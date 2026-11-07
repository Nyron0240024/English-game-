// ENGLISH QUEST — VOCABULARY MODULE

const VOCABULARY_STORAGE_KEY = "english-quest-vocabulary";

let vocabularySets = [];
let vocabularyDraftWords = [];
let vocabularyEditingSetId = null;
let vocabularyEditingWordIndex = null;
let vocabularyStudyCards = [];
let vocabularyStudyIndex = 0;
let vocabularyCardFlipped = false;

try {
    const savedVocabulary = JSON.parse(
        localStorage.getItem(VOCABULARY_STORAGE_KEY) || "[]"
    );

    vocabularySets = Array.isArray(savedVocabulary)
        ? savedVocabulary
        : [];

} catch (error) {
    console.error("Не удалось загрузить Vocabulary:", error);
    vocabularySets = [];
}


// ПОДКЛЮЧЕНИЕ К НАВИГАЦИИ

const englishQuestOriginalShowSection = window.showSection;

window.showSection = function(section) {
    if (typeof englishQuestOriginalShowSection === "function") {
        englishQuestOriginalShowSection(section);
    }

    if (section === "vocabulary") {
        backToVocabularyMenu();
        renderVocabularySets();
    }
};


// СОХРАНЕНИЕ

function saveVocabularyData() {
    try {
        localStorage.setItem(
            VOCABULARY_STORAGE_KEY,
            JSON.stringify(vocabularySets)
        );

        return true;

    } catch (error) {
        console.error("Ошибка сохранения Vocabulary:", error);

        alert(
            "Не удалось сохранить набор. Попробуй убрать большие изображения из других разделов или освободить место в браузере."
        );

        return false;
    }
}


// ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ

function showVocabularyView(view) {
    [
        "vocabulary-menu",
        "vocabulary-editor",
        "vocabulary-study"
    ].forEach(id => {
        const element = document.getElementById(id);

        if (element) {
            element.classList.toggle("hidden", id !== view);
        }
    });
}

function backToVocabularyMenu() {
    showVocabularyView("vocabulary-menu");

    vocabularyEditingSetId = null;
    vocabularyEditingWordIndex = null;

    renderVocabularySets();
}


// СОЗДАНИЕ И РЕДАКТИРОВАНИЕ НАБОРА

function openVocabularyEditor(id = null) {
    vocabularyEditingSetId = id;
    vocabularyEditingWordIndex = null;

    const titleInput = document.getElementById("vocabulary-title");

    if (id !== null) {
        const set = vocabularySets.find(
            item => String(item.id) === String(id)
        );

        if (!set) {
            return alert("Набор не найден.");
        }

        titleInput.value = set.title;

        vocabularyDraftWords = set.words.map(word => ({
            ...word
        }));

        document.getElementById(
            "vocabulary-editor-heading"
        ).textContent = "✏️ Редактирование набора";

    } else {
        titleInput.value = "";
        vocabularyDraftWords = [];

        document.getElementById(
            "vocabulary-editor-heading"
        ).textContent = "✏️ Создание набора";
    }

    clearVocabularyWordForm();
    renderVocabularyDraftWords();

    showVocabularyView("vocabulary-editor");
}


// ОЧИСТКА ФОРМЫ СЛОВА

function clearVocabularyWordForm() {
    document.getElementById("vocabulary-word").value = "";
    document.getElementById("vocabulary-translation").value = "";
    document.getElementById("vocabulary-example").value = "";

    document.getElementById(
        "vocabulary-cancel-edit"
    ).classList.add("hidden");

    vocabularyEditingWordIndex = null;
}


// ДОБАВЛЕНИЕ СЛОВА

function addVocabularyWord() {
    const word = document
        .getElementById("vocabulary-word")
        .value.trim();

    const translation = document
        .getElementById("vocabulary-translation")
        .value.trim();

    const example = document
        .getElementById("vocabulary-example")
        .value.trim();

    if (!word || !translation) {
        alert("Заполни английское слово и его перевод.");
        return;
    }

    const item = {
        word,
        translation,
        example
    };

    if (vocabularyEditingWordIndex !== null) {
        vocabularyDraftWords[vocabularyEditingWordIndex] = item;
    } else {
        vocabularyDraftWords.push(item);
    }

    clearVocabularyWordForm();
    renderVocabularyDraftWords();
}


// РЕДАКТИРОВАНИЕ СЛОВА

function editVocabularyWord(index) {
    const item = vocabularyDraftWords[index];

    if (!item) return;

    vocabularyEditingWordIndex = index;

    document.getElementById("vocabulary-word").value = item.word;

    document.getElementById(
        "vocabulary-translation"
    ).value = item.translation;

    document.getElementById(
        "vocabulary-example"
    ).value = item.example || "";

    document.getElementById(
        "vocabulary-cancel-edit"
    ).classList.remove("hidden");

    document.getElementById("vocabulary-word").focus();
}

function cancelVocabularyWordEdit() {
    clearVocabularyWordForm();
}


// УДАЛЕНИЕ СЛОВА

function deleteVocabularyWord(index) {
    if (!confirm("Удалить это слово из набора?")) return;

    vocabularyDraftWords.splice(index, 1);

    clearVocabularyWordForm();
    renderVocabularyDraftWords();
}


// ОТОБРАЖЕНИЕ СЛОВ В РЕДАКТОРЕ

function renderVocabularyDraftWords() {
    const container = document.getElementById(
        "vocabulary-word-list"
    );

    if (!vocabularyDraftWords.length) {
        container.innerHTML =
            '<p class="empty-message">Пока нет слов. Добавь первое слово.</p>';

        return;
    }

    container.innerHTML = vocabularyDraftWords.map((item, index) => `
        <div class="question-item">

            <strong>${escapeHTML(item.word)}</strong>
            — ${escapeHTML(item.translation)}

            ${item.example
                ? `<p>${escapeHTML(item.example)}</p>`
                : ""
            }

            <button
                type="button"
                class="edit-button"
                onclick="editVocabularyWord(${index})">
                Изменить
            </button>

            <button
                type="button"
                class="delete-button"
                onclick="deleteVocabularyWord(${index})">
                Удалить
            </button>

        </div>
    `).join("");
}


// СОХРАНЕНИЕ НАБОРА

function saveVocabularySet() {
    const title = document
        .getElementById("vocabulary-title")
        .value.trim();

    if (!title) {
        alert("Введи название набора, например Fruits.");
        return;
    }

    if (!vocabularyDraftWords.length) {
        alert("Добавь хотя бы одно слово.");
        return;
    }

    const previous = [...vocabularySets];

    if (vocabularyEditingSetId !== null) {
        const index = vocabularySets.findIndex(
            item => String(item.id) === String(vocabularyEditingSetId)
        );

        if (index === -1) {
            return alert("Набор не найден.");
        }

        vocabularySets[index] = {
            ...vocabularySets[index],
            title,
            words: vocabularyDraftWords.map(word => ({
                ...word
            }))
        };

    } else {
        vocabularySets.push({
            id: Date.now(),
            title,
            words: vocabularyDraftWords.map(word => ({
                ...word
            }))
        });
    }

    if (!saveVocabularyData()) {
        vocabularySets = previous;
        return;
    }

    alert("Набор слов сохранён!");

    backToVocabularyMenu();
}


// СПИСОК НАБОРОВ

function renderVocabularySets() {
    const container = document.getElementById("vocabulary-list");

    if (!container) return;

    if (!vocabularySets.length) {
        container.innerHTML =
            '<p class="empty-message">Пока нет наборов слов. Создай первый!</p>';

        return;
    }

    container.innerHTML = vocabularySets.map(set => `
        <div class="test-item">

            <h3>📖 ${escapeHTML(set.title)}</h3>

            <p>${set.words.length} слов</p>

            <button
                class="primary-button"
                onclick="startVocabularyStudy(${Number(set.id)})">
                Изучать
            </button>

            <button
                class="edit-button"
                onclick="openVocabularyEditor(${Number(set.id)})">
                Редактировать
            </button>

            <button
                class="delete-button"
                onclick="deleteVocabularySet(${Number(set.id)})">
                Удалить
            </button>

        </div>
    `).join("");
}


// УДАЛЕНИЕ НАБОРА

function deleteVocabularySet(id) {
    if (!confirm("Удалить весь набор слов?")) return;

    const previous = [...vocabularySets];

    vocabularySets = vocabularySets.filter(
        item => String(item.id) !== String(id)
    );

    if (!saveVocabularyData()) {
        vocabularySets = previous;
    }

    renderVocabularySets();
}


// НАЧАЛО ИЗУЧЕНИЯ

function startVocabularyStudy(id) {
    const set = vocabularySets.find(
        item => String(item.id) === String(id)
    );

    if (!set || !set.words.length) {
        return alert("В этом наборе пока нет слов.");
    }

    vocabularyStudyCards = set.words.map(word => ({
        ...word
    }));

    vocabularyStudyIndex = 0;
    vocabularyCardFlipped = false;

    document.getElementById(
        "vocabulary-study-title"
    ).textContent = set.title;

    showVocabularyView("vocabulary-study");

    renderVocabularyCard();
}


// ОТОБРАЖЕНИЕ КАРТОЧКИ

function renderVocabularyCard() {
    const item = vocabularyStudyCards[vocabularyStudyIndex];

    if (!item) return;

    document.getElementById(
        "vocabulary-study-progress"
    ).textContent =
        `Слово ${vocabularyStudyIndex + 1} из ${vocabularyStudyCards.length}`;

    document.getElementById(
        "vocabulary-card-label"
    ).textContent =
        vocabularyCardFlipped ? "ПЕРЕВОД" : "ENGLISH WORD";

    document.getElementById(
        "vocabulary-card-main"
    ).textContent =
        vocabularyCardFlipped ? item.translation : item.word;

    document.getElementById(
        "vocabulary-card-example"
    ).textContent =
        vocabularyCardFlipped ? (item.example || "") : "";

    document.getElementById(
        "vocabulary-card-hint"
    ).textContent =
        vocabularyCardFlipped
            ? "Нажми, чтобы вернуться к слову"
            : "Нажми, чтобы увидеть перевод";
}


// ПЕРЕВОРОТ КАРТОЧКИ

function flipVocabularyCard() {
    vocabularyCardFlipped = !vocabularyCardFlipped;

    renderVocabularyCard();
}


// СЛЕДУЮЩЕЕ СЛОВО

function nextVocabularyCard() {
    vocabularyStudyIndex =
        (vocabularyStudyIndex + 1) % vocabularyStudyCards.length;

    vocabularyCardFlipped = false;

    renderVocabularyCard();
}


// ПРЕДЫДУЩЕЕ СЛОВО

function previousVocabularyCard() {
    vocabularyStudyIndex =
        (vocabularyStudyIndex - 1 + vocabularyStudyCards.length)
        % vocabularyStudyCards.length;

    vocabularyCardFlipped = false;

    renderVocabularyCard();
}


// ПЕРЕМЕШИВАНИЕ СЛОВ

function shuffleVocabularyCards() {
    for (
        let i = vocabularyStudyCards.length - 1;
        i > 0;
        i--
    ) {
        const j = Math.floor(Math.random() * (i + 1));

        [
            vocabularyStudyCards[i],
            vocabularyStudyCards[j]
        ] = [
            vocabularyStudyCards[j],
            vocabularyStudyCards[i]
        ];
    }

    vocabularyStudyIndex = 0;
    vocabularyCardFlipped = false;

    renderVocabularyCard();
}
// ============================================
// ENGLISH QUEST — STARTER VOCABULARY LIBRARY
// 4 LEVELS × 50 WORDS = 200 WORDS
// ============================================

const STARTER_VOCABULARY = [
{
    id: 910001,
    title: "Basic English (A1)",
    words: [
        ["cat","кот","I have a cat.","🐱"],
        ["dog","собака","The dog is big.","🐶"],
        ["bird","птица","The bird can fly.","🐦"],
        ["fish","рыба","I see a fish.","🐠"],
        ["rabbit","кролик","The rabbit is white.","🐰"],
        ["horse","лошадь","The horse can run.","🐴"],
        ["cow","корова","The cow gives milk.","🐮"],
        ["pig","свинья","The pig is pink.","🐷"],
        ["apple","яблоко","I eat an apple.","🍎"],
        ["banana","банан","The banana is yellow.","🍌"],
        ["orange","апельсин","I like oranges.","🍊"],
        ["bread","хлеб","I eat bread.","🍞"],
        ["milk","молоко","I drink milk.","🥛"],
        ["water","вода","Water is important.","💧"],
        ["egg","яйцо","I have an egg.","🥚"],
        ["cheese","сыр","I like cheese.","🧀"],
        ["cake","торт","The cake is sweet.","🎂"],
        ["rice","рис","We eat rice.","🍚"],
        ["red","красный","My bag is red.","🔴"],
        ["blue","синий","The sky is blue.","🔵"],
        ["green","зелёный","The grass is green.","🟢"],
        ["yellow","жёлтый","The sun is yellow.","🟡"],
        ["black","чёрный","My shoes are black.","⚫"],
        ["white","белый","The snow is white.","⚪"],
        ["mother","мама","My mother is kind.","👩"],
        ["father","папа","My father is tall.","👨"],
        ["sister","сестра","My sister is nice.","👧"],
        ["brother","брат","My brother is funny.","👦"],
        ["family","семья","I love my family.","👨‍👩‍👧"],
        ["friend","друг","He is my friend.","🧑‍🤝‍🧑"],
        ["house","дом","This is my house.","🏠"],
        ["room","комната","My room is clean.","🛏️"],
        ["door","дверь","Open the door.","🚪"],
        ["window","окно","Look at the window.","🪟"],
        ["table","стол","The book is on the table.","🪑"],
        ["chair","стул","Sit on the chair.","💺"],
        ["book","книга","I read a book.","📘"],
        ["pen","ручка","I have a blue pen.","🖊️"],
        ["school","школа","I go to school.","🏫"],
        ["teacher","учитель","My teacher is nice.","👩‍🏫"],
        ["student","ученик","I am a student.","🎒"],
        ["sun","солнце","The sun is bright.","☀️"],
        ["moon","луна","The moon is beautiful.","🌙"],
        ["star","звезда","I see a star.","⭐"],
        ["tree","дерево","The tree is tall.","🌳"],
        ["flower","цветок","This flower is beautiful.","🌸"],
        ["car","машина","My car is blue.","🚗"],
        ["bus","автобус","I go by bus.","🚌"],
        ["one","один","I have one apple.","1️⃣"],
        ["two","два","I have two pencils.","2️⃣"]
    ]
},

{
    id: 910002,
    title: "Everyday English (A2)",
    words: [
        ["breakfast","завтрак","I have breakfast at seven.","🍳"],
        ["lunch","обед","We have lunch together.","🥗"],
        ["dinner","ужин","Dinner is ready.","🍽️"],
        ["kitchen","кухня","My mother is in the kitchen.","🍳"],
        ["bathroom","ванная","The bathroom is clean.","🛁"],
        ["bedroom","спальня","My bedroom is small.","🛏️"],
        ["garden","сад","There are flowers in the garden.","🌷"],
        ["clothes","одежда","My clothes are clean.","👕"],
        ["jacket","куртка","Wear your jacket.","🧥"],
        ["shoes","обувь","My shoes are new.","👟"],
        ["weather","погода","The weather is nice today.","🌤️"],
        ["rain","дождь","I can hear the rain.","🌧️"],
        ["snow","снег","Children play in the snow.","❄️"],
        ["cloud","облако","A cloud is in the sky.","☁️"],
        ["mountain","гора","The mountain is high.","⛰️"],
        ["river","река","The river is long.","🏞️"],
        ["beach","пляж","We are at the beach.","🏖️"],
        ["forest","лес","The forest is green.","🌲"],
        ["travel","путешествовать","I love to travel.","✈️"],
        ["airport","аэропорт","We are at the airport.","🛫"],
        ["hotel","отель","Our hotel is comfortable.","🏨"],
        ["ticket","билет","I bought a ticket.","🎫"],
        ["train","поезд","The train is fast.","🚆"],
        ["bicycle","велосипед","I ride my bicycle.","🚲"],
        ["shop","магазин","I go to the shop.","🏪"],
        ["market","рынок","The market is busy.","🛒"],
        ["money","деньги","I need some money.","💵"],
        ["price","цена","What is the price?","🏷️"],
        ["doctor","врач","The doctor helps people.","🩺"],
        ["hospital","больница","He is in hospital.","🏥"],
        ["healthy","здоровый","Fruit is healthy.","🥦"],
        ["exercise","упражнение","I do exercise every day.","🏃"],
        ["break","перерыв","Let's take a break.","☕"],
        ["holiday","каникулы","We have a holiday.","🏝️"],
        ["weekend","выходные","I relax at the weekend.","🎉"],
        ["morning","утро","I wake up in the morning.","🌅"],
        ["evening","вечер","I read in the evening.","🌆"],
        ["always","всегда","I always brush my teeth.","🔁"],
        ["usually","обычно","I usually walk to school.","🚶"],
        ["sometimes","иногда","I sometimes watch TV.","📺"],
        ["never","никогда","I never drink coffee at night.","🚫"],
        ["careful","осторожный","Be careful on the road.","⚠️"],
        ["friendly","дружелюбный","Our neighbours are friendly.","😊"],
        ["beautiful","красивый","The city is beautiful.","🌆"],
        ["expensive","дорогой","This phone is expensive.","📱"],
        ["cheap","дешёвый","This bag is cheap.","👜"],
        ["hungry","голодный","I am hungry.","🍔"],
        ["thirsty","испытывающий жажду","She is thirsty.","🥤"],
        ["interesting","интересный","This book is interesting.","📚"],
        ["important","важный","English is important.","💡"]
    ]
},

{
    id: 910003,
    title: "Intermediate (B1)",
    words: [
        ["achievement","достижение","Winning was a great achievement.","🏆"],
        ["advice","совет","Thank you for your advice.","💬"],
        ["advantage","преимущество","This plan has an advantage.","👍"],
        ["appointment","встреча","I have a doctor's appointment.","📅"],
        ["behavior","поведение","Good behavior is important.","🤝"],
        ["challenge","испытание","Learning English is a challenge.","🧗"],
        ["choice","выбор","It was a difficult choice.","🔀"],
        ["community","сообщество","Our community is helpful.","🏘️"],
        ["competition","соревнование","She won the competition.","🥇"],
        ["confidence","уверенность","Practice builds confidence.","💪"],
        ["decision","решение","I made a decision.","🧠"],
        ["development","развитие","Education supports development.","📈"],
        ["education","образование","Education opens doors.","🎓"],
        ["environment","окружающая среда","We must protect the environment.","🌍"],
        ["experience","опыт","It was a useful experience.","🧭"],
        ["goal","цель","My goal is to improve.","🎯"],
        ["habit","привычка","Reading is a good habit.","📖"],
        ["health","здоровье","Health is very important.","❤️"],
        ["improvement","улучшение","I can see an improvement.","⬆️"],
        ["knowledge","знания","Knowledge comes from learning.","📚"],
        ["language","язык","Language connects people.","🗣️"],
        ["memory","память","Music can improve memory.","🧩"],
        ["opportunity","возможность","This is a great opportunity.","🚪"],
        ["opinion","мнение","What is your opinion?","💭"],
        ["organization","организация","The organization helps children.","🏢"],
        ["performance","выступление","Her performance was excellent.","🎭"],
        ["permission","разрешение","You need permission to enter.","🔑"],
        ["population","население","The population is growing.","👥"],
        ["relationship","отношения","Trust builds a relationship.","🤝"],
        ["responsibility","ответственность","It is my responsibility.","📋"],
        ["solution","решение","We found a solution.","🧩"],
        ["success","успех","Hard work brings success.","🌟"],
        ["suggestion","предложение","That is a good suggestion.","💡"],
        ["technology","технология","Technology changes our lives.","💻"],
        ["tradition","традиция","This is an old tradition.","🎎"],
        ["volunteer","волонтёр","I work as a volunteer.","🙋"],
        ["achieve","достигать","You can achieve your goals.","🏅"],
        ["avoid","избегать","Try to avoid mistakes.","🚧"],
        ["compare","сравнивать","Compare the two pictures.","⚖️"],
        ["consider","рассматривать","Please consider my idea.","🤔"],
        ["develop","развивать","We develop new skills.","🌱"],
        ["encourage","поощрять","Teachers encourage students.","👏"],
        ["improve","улучшать","I want to improve my English.","📈"],
        ["manage","справляться","She can manage her time.","🗓️"],
        ["prepare","готовить","We prepare for the exam.","📝"],
        ["protect","защищать","We protect wild animals.","🛡️"],
        ["realize","осознавать","I realize my mistake.","💡"],
        ["reduce","уменьшать","We should reduce waste.","♻️"],
        ["require","требовать","This job requires experience.","📌"],
        ["support","поддерживать","My friends support me.","🤗"]
    ]
},

{
    id: 910004,
    title: "Upper Intermediate (B2)",
    words: [
        ["analysis","анализ","The analysis shows clear results.","📊"],
        ["approach","подход","We need a different approach.","🧭"],
        ["assumption","предположение","That assumption may be wrong.","💭"],
        ["awareness","осведомлённость","Public awareness is increasing.","🔎"],
        ["circumstance","обстоятельство","The circumstances have changed.","🌦️"],
        ["consequence","последствие","Every action has a consequence.","⚖️"],
        ["contribution","вклад","Her contribution was valuable.","🤲"],
        ["controversy","спор","The decision caused controversy.","🗯️"],
        ["conventional","традиционный","This is a conventional method.","📐"],
        ["criterion","критерий","Price is one important criterion.","📏"],
        ["distribution","распределение","The distribution is unequal.","📦"],
        ["emphasis","акцент","The teacher puts emphasis on grammar.","🎯"],
        ["evidence","доказательство","We need more evidence.","🔬"],
        ["expenditure","расходы","Government expenditure increased.","💸"],
        ["framework","структура","We need a clear framework.","🏗️"],
        ["fundamental","основополагающий","Trust is fundamental to teamwork.","🧱"],
        ["hypothesis","гипотеза","The experiment tests a hypothesis.","🧪"],
        ["implication","последствие","We discussed the implications.","🔗"],
        ["incentive","стимул","The prize is an incentive.","🏅"],
        ["inequality","неравенство","Education can reduce inequality.","⚖️"],
        ["innovation","инновация","Innovation changes industries.","🚀"],
        ["insight","понимание","The report offers useful insight.","🔍"],
        ["interpretation","интерпретация","There are different interpretations.","🧠"],
        ["investment","инвестиция","Education is a long-term investment.","💰"],
        ["legislation","законодательство","New legislation was introduced.","📜"],
        ["objective","цель","Our main objective is clear.","🎯"],
        ["perspective","точка зрения","Try to see another perspective.","🔭"],
        ["phenomenon","явление","This phenomenon is unusual.","🌌"],
        ["priority","приоритет","Safety is our first priority.","🥇"],
        ["procedure","процедура","Follow the correct procedure.","📝"],
        ["proportion","пропорция","A large proportion agreed.","📐"],
        ["regulation","правило","The regulation protects consumers.","📋"],
        ["resource","ресурс","Time is a valuable resource.","🧰"],
        ["strategy","стратегия","We need a new strategy.","♟️"],
        ["sustainable","устойчивый","We need sustainable solutions.","🌱"],
        ["trend","тенденция","This trend is becoming popular.","📈"],
        ["validity","достоверность","We checked the validity of the data.","✅"],
        ["welfare","благополучие","Child welfare is essential.","❤️"],
        ["acquire","приобретать","Students acquire new skills.","📚"],
        ["adapt","адаптироваться","People adapt to change.","🦎"],
        ["allocate","распределять","We allocate resources carefully.","📦"],
        ["anticipate","предвидеть","We anticipate further changes.","🔮"],
        ["clarify","прояснять","Could you clarify your point?","💡"],
        ["compensate","компенсировать","The company will compensate workers.","💵"],
        ["confront","сталкиваться","We must confront the problem.","🛡️"],
        ["demonstrate","демонстрировать","The results demonstrate progress.","📉"],
        ["enhance","улучшать","Exercise can enhance concentration.","✨"],
        ["establish","создавать","They established a new company.","🏢"],
        ["evaluate","оценивать","We evaluate the results.","📊"],
        ["implement","осуществлять","They implement the new policy.","⚙️"],
        ["maintain","поддерживать","It is important to maintain balance.","⚖️"]
    ]
}
];


// ============================================
// CREATE CARTOON-STYLE OFFLINE WORD IMAGES
// ============================================

function vocabularyEmojiImage(emoji) {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="240" height="200" viewBox="0 0 240 200">
            <rect x="8" y="8" width="224" height="184" rx="30" fill="#eee9ff"/>
            <circle cx="120" cy="98" r="70" fill="#ffffff"/>
            <text x="120" y="125" text-anchor="middle"
                font-size="92" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif">${emoji}</text>
        </svg>
    `;

    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}


// ============================================
// ADD DEFAULT SETS WITHOUT DELETING USER DATA
// ============================================

function installStarterVocabulary() {
    let changed = false;

    STARTER_VOCABULARY.forEach(set => {
        const exists = vocabularySets.some(
            saved => Number(saved.id) === set.id
        );

        if (!exists) {
            vocabularySets.push({
                id: set.id,
                title: set.title,
                words: set.words.map(item => ({
                    word: item[0],
                    translation: item[1],
                    example: item[2],
                    image: vocabularyEmojiImage(item[3]),
                    emoji: item[3]
                }))
            });

            changed = true;
        }
    });

    if (changed) {
        saveVocabularyData();
    }
}


// ============================================
// SHOW WORD ILLUSTRATION ON FLASHCARD
// ============================================

function addVocabularyCardImage() {
    const card = document.getElementById("vocabulary-card");
    if (!card) return;

    let image = document.getElementById("vocabulary-card-image");

    if (!image) {
        image = document.createElement("img");
        image.id = "vocabulary-card-image";
        image.alt = "Мультяшная иллюстрация слова";
        image.style.width = "180px";
        image.style.height = "150px";
        image.style.objectFit = "contain";
        image.style.margin = "0 auto 12px";
        card.insertBefore(image, card.firstChild);
    }

    const item = vocabularyStudyCards[vocabularyStudyIndex];

    if (item && item.image) {
        image.src = item.image;
        image.style.display = "block";
    } else {
        image.style.display = "none";
    }
}


// Preserve the existing card renderer and add the illustration.
const originalVocabularyCardRenderer = renderVocabularyCard;

renderVocabularyCard = function() {
    originalVocabularyCardRenderer();
    addVocabularyCardImage();
};


// Install the library after the page scripts load.
installStarterVocabulary();

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderVocabularySets);
} else {
    renderVocabularySets();
}
// ============================================
// VOCABULARY — FINAL DESIGN IMPROVEMENTS
// ============================================

// Убираем подсказку под словом
function hideVocabularyHint() {
    const hint = document.getElementById("vocabulary-card-hint");

    if (hint) {
        hint.style.display = "none";
    }
}

// Обновляем карточку при каждом перевороте
const previousVocabularyRenderer = renderVocabularyCard;

renderVocabularyCard = function() {
    previousVocabularyRenderer();
    hideVocabularyHint();
};


// Красивый стиль кнопок Vocabulary
const vocabularyDesign = document.createElement("style");

vocabularyDesign.textContent = `
    #vocabulary-study .editor-card button {
        border-radius: 15px;
        padding: 13px 23px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.25s ease;
        border: 1px solid transparent;
        box-shadow: 0 5px 12px rgba(75, 45, 150, 0.12);
    }

    #vocabulary-study .editor-card .primary-button {
        background: linear-gradient(135deg, #8b5cf6, #6235d9);
        color: white;
        border: none;
        box-shadow: 0 5px 15px rgba(105, 65, 220, 0.3);
    }

    #vocabulary-study .editor-card .edit-button {
        background: linear-gradient(135deg, #ffffff, #f0ebff);
        color: #5733a5;
        border: 1px solid #d8ccff;
    }

    #vocabulary-study .editor-card button:hover {
        transform: translateY(-3px);
        box-shadow: 0 9px 20px rgba(95, 60, 180, 0.22);
    }

    #vocabulary-study .editor-card button:active {
        transform: scale(0.96);
    }

    #vocabulary-study .editor-card button:focus-visible {
        outline: 3px solid rgba(139, 92, 246, 0.35);
        outline-offset: 3px;
    }

    #vocabulary-card {
        border: 2px solid #e2d5ff;
        box-shadow: 0 12px 30px rgba(100, 65, 180, 0.12);
        transition: transform 0.25s ease, box-shadow 0.25s ease;
    }

    #vocabulary-card:hover {
        box-shadow: 0 16px 35px rgba(100, 65, 180, 0.2);
    }

    #vocabulary-card-main {
        color: #38206f;
        font-weight: 800;
    }

    #vocabulary-card-label {
        color: #7954ca;
        font-weight: 800;
        letter-spacing: 2px;
    }

    #vocabulary-card-example {
        color: #6444a4;
        font-size: 18px;
        font-weight: 600;
        margin-top: 12px;
    }

    @media (max-width: 600px) {
        #vocabulary-study .editor-card button {
            padding: 11px 16px;
            font-size: 14px;
        }

        #vocabulary-card {
            min-height: 220px !important;
        }
    }
`;

document.head.appendChild(vocabularyDesign);


// Убираем подсказку сразу после загрузки
hideVocabularyHint();
