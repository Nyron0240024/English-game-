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