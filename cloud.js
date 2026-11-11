// ENGLISH QUEST — SUPABASE CLOUD SYNC
// Public project URL and publishable key are intended for browser use.
const SUPABASE_URL = "https://iiclxhfroaqkymainxdn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_-KydAWjq0s4Cq3gohiGNVw_evnz8K7W";

(() => {
    if (!window.supabase?.createClient) {
        alert("Не удалось загрузить модуль облачной базы. Проверь подключение к интернету.");
        return;
    }

    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    let currentUser = null;
    let syncQueue = Promise.resolve();
    let syncTimer = null;
    let cloudReady = false;

    const app = document.querySelector(".app");
    const login = document.createElement("section");
    login.id = "eq-cloud-login";
    login.innerHTML = `
      <div class="eq-login-card">
        <div class="eq-login-icon">🎓</div>
        <h1>English Quest</h1>
        <p class="eq-login-subtitle">Вход преподавателя</p>
        <form id="eq-login-form">
          <label for="eq-email">Email</label>
          <input id="eq-email" type="email" autocomplete="username" required placeholder="teacher@email.com">
          <label for="eq-password">Пароль</label>
          <input id="eq-password" type="password" autocomplete="current-password" required placeholder="Введите пароль">
          <button type="submit" id="eq-login-button">Войти</button>
          <p id="eq-login-message" role="status"></p>
        </form>
      </div>`;
    document.body.appendChild(login);

    const style = document.createElement("style");
    style.textContent = `
      #eq-cloud-login{min-height:100vh;display:grid;place-items:center;padding:24px;background:#f3f6fc;font-family:Arial,sans-serif;color:#202b45}
      .eq-login-card{width:min(100%,420px);background:#fff;border-radius:22px;padding:34px;box-shadow:0 12px 40px rgba(40,50,100,.10)}
      .eq-login-icon{font-size:42px;margin-bottom:12px}.eq-login-card h1{font-size:27px}.eq-login-subtitle{color:#8490a8;margin:8px 0 24px}
      .eq-login-card label{display:block;font-weight:700;font-size:14px;margin:16px 0 7px}
      .eq-login-card input{width:100%;padding:14px;border:1px solid #dfe4ee;border-radius:10px;font-size:15px;background:#fafbfe;color:#202b45}
      #eq-login-button{width:100%;border:0;border-radius:11px;padding:14px;margin-top:22px;background:#6258e8;color:#fff;font-weight:700;font-size:15px;cursor:pointer}
      #eq-login-button:disabled{opacity:.65;cursor:wait}#eq-login-message{min-height:20px;margin-top:14px;font-size:13px;color:#c33}
      #eq-cloud-tools{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-left:12px}
      #eq-cloud-tools button{border:1px solid #dedcfb;background:#fff;color:#6258e8;padding:8px 11px;border-radius:10px;cursor:pointer;font-size:12px}
      #eq-cloud-status{font-size:12px;color:#64748b}
      @media(max-width:600px){.eq-login-card{padding:25px}}
    `;
    document.head.appendChild(style);
    if (app) app.style.display = "none";

    function message(text, isError = true) {
        const el = document.getElementById("eq-login-message");
        if (el) {
            el.textContent = text;
            el.style.color = isError ? "#c33" : "#16865b";
        }
    }

    function localCollections() {
        return {
            tests: Array.isArray(tests) ? tests : [],
            listening: Array.isArray(listeningItems) ? listeningItems : [],
            vocabulary: Array.isArray(vocabularySets) ? vocabularySets : []
        };
    }

    function applyCollections(data) {
        tests = Array.isArray(data.tests) ? data.tests : [];
        listeningItems = Array.isArray(data.listening) ? data.listening : [];
        vocabularySets = Array.isArray(data.vocabulary) ? data.vocabulary : [];

        // Apply the new built-in CEFR library while preserving teacher-created content.
        const curriculum = window.ENGLISH_QUEST_CURRICULUM;
        if (curriculum && curriculum.version === 2) {
            const oldVocabularyIds = new Set(curriculum.replaceVocabularyIds.map(Number));
            const newVocabularyIds = new Set(curriculum.vocabulary.map(item => Number(item.id)));
            vocabularySets = vocabularySets.filter(item =>
                !oldVocabularyIds.has(Number(item.id)) && !newVocabularyIds.has(Number(item.id))
            );
            const builtInVocabulary = curriculum.vocabulary.map(set => ({
                id: set.id,
                title: set.title,
                words: set.words.map(word => ({
                    word: word[0], translation: word[1], example: word[2],
                    image: typeof vocabularyEmojiImage === "function" ? vocabularyEmojiImage(word[3]) : "",
                    emoji: word[3]
                }))
            }));
            vocabularySets.push(...builtInVocabulary);

            const oldTestIds = new Set(curriculum.replaceTestIds.map(Number));
            const newTestIds = new Set(curriculum.tests.map(item => Number(item.id)));
            tests = tests.filter(item =>
                !oldTestIds.has(Number(item.id)) && !newTestIds.has(Number(item.id))
            );
            const builtInTests = curriculum.tests.map(test => ({
                id: test.id,
                title: test.title,
                questions: test.questions.map(question => ({
                    ...question,
                    answers: [...question.answers]
                }))
            }));
            tests.push(...builtInTests);
        }

        localStorage.setItem("english-quest-tests", JSON.stringify(tests));
        localStorage.setItem("english-quest-listening", JSON.stringify(listeningItems));
        localStorage.setItem("english-quest-vocabulary", JSON.stringify(vocabularySets));
        if (typeof renderTests === "function") renderTests();
        if (typeof renderPlayTests === "function") renderPlayTests();
        if (typeof renderListeningList === "function") renderListeningList();
        if (typeof renderVocabularySets === "function") renderVocabularySets();
    }

    function updateCloudStatus(text) {
        const status = document.getElementById("eq-cloud-status");
        if (status) status.textContent = text;
    }

    async function writeCloud() {
        if (!currentUser || !cloudReady) return;
        const data = localCollections();
        updateCloudStatus("Синхронизация…");
        const { error } = await client.from("english_quest_data").upsert({
            user_id: currentUser.id,
            tests: data.tests,
            listening: data.listening,
            vocabulary: data.vocabulary,
            updated_at: new Date().toISOString()
        }, { onConflict: "user_id" });
        if (error) {
            console.error("Cloud sync error:", error);
            updateCloudStatus("Ошибка синхронизации");
            return;
        }
        updateCloudStatus("☁️ Синхронизировано");
    }

    function queueCloudSync() {
        if (!currentUser || !cloudReady) return;
        clearTimeout(syncTimer);
        syncTimer = setTimeout(() => {
            syncQueue = syncQueue.then(writeCloud).catch(error => {
                console.error("Cloud queue error:", error);
                updateCloudStatus("Ошибка синхронизации");
            });
        }, 450);
    }

    function addCloudControls() {
        const header = document.querySelector(".header-right");
        if (!header || document.getElementById("eq-cloud-tools")) return;
        const tools = document.createElement("div");
        tools.id = "eq-cloud-tools";
        tools.innerHTML = `<span id="eq-cloud-status">☁️ Подключено</span><button type="button" id="eq-sync-now">Синхронизировать</button><button type="button" id="eq-logout">Выйти</button>`;
        header.appendChild(tools);
        document.getElementById("eq-sync-now").addEventListener("click", () => {
            syncQueue = syncQueue.then(writeCloud);
        });
        document.getElementById("eq-logout").addEventListener("click", async () => {
            await client.auth.signOut();
            location.reload();
        });
    }

    async function enterApp(user) {
        currentUser = user;
        message("Проверяем облачные данные…", false);
        const { data, error } = await client.from("english_quest_data")
            .select("tests,listening,vocabulary")
            .eq("user_id", user.id)
            .maybeSingle();
        if (error) {
            message("Не удалось загрузить данные: " + error.message);
            return;
        }

        if (data) {
            applyCollections(data);
        } else {
            // First sign-in on the teacher's original device: migrate existing local data.
            const local = localCollections();
            const hasLocal = local.tests.length || local.listening.length || local.vocabulary.length;
            const initial = hasLocal ? local : { tests: [], listening: [], vocabulary: [] };
            applyCollections(initial);
            cloudReady = true;
            await writeCloud();
        }

        cloudReady = true;
        // Persist curriculum replacement/upgrade to the teacher's cloud record.
        await writeCloud();
        login.style.display = "none";
        if (app) app.style.display = "block";
        addCloudControls();
        if (typeof renderTests === "function") renderTests();
        if (typeof renderPlayTests === "function") renderPlayTests();
        if (typeof renderListeningList === "function") renderListeningList();
        if (typeof renderVocabularySets === "function") renderVocabularySets();
        updateCloudStatus("☁️ Синхронизировано");
    }

    document.getElementById("eq-login-form").addEventListener("submit", async event => {
        event.preventDefault();
        const button = document.getElementById("eq-login-button");
        button.disabled = true;
        button.textContent = "Входим…";
        message("");
        const email = document.getElementById("eq-email").value.trim();
        const password = document.getElementById("eq-password").value;
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        button.disabled = false;
        button.textContent = "Войти";
        if (error) {
            message("Не удалось войти. Проверь email и пароль.");
            console.error(error);
            return;
        }
        await enterApp(data.user);
    });

    // Keep the existing local save behavior and additionally sync successful saves to cloud.
    const originalSaveData = window.saveData;
    if (typeof originalSaveData === "function") {
        window.saveData = function() {
            const ok = originalSaveData.apply(this, arguments);
            if (ok) queueCloudSync();
            return ok;
        };
    }
    const originalSaveListening = window.saveListeningData;
    if (typeof originalSaveListening === "function") {
        window.saveListeningData = function() {
            const ok = originalSaveListening.apply(this, arguments);
            if (ok) queueCloudSync();
            return ok;
        };
    }
    const originalSaveVocabulary = window.saveVocabularyData;
    if (typeof originalSaveVocabulary === "function") {
        window.saveVocabularyData = function() {
            const ok = originalSaveVocabulary.apply(this, arguments);
            if (ok) queueCloudSync();
            return ok;
        };
    }

    (async () => {
        const { data, error } = await client.auth.getSession();
        if (error) {
            message("Ошибка проверки входа. Обнови страницу.");
            return;
        }
        if (data.session?.user) {
            await enterApp(data.session.user);
        } else {
            login.style.display = "grid";
        }
    })();
})();
