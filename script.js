const STORAGE_KEY = "english-quest-tests";

let tests = [];

try {
    tests = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(tests)) tests = [];
} catch (error) {
    console.error("Не удалось прочитать тесты:", error);
    tests = [];
}

let currentQuestions = [];
let currentQuestionImage = "";

let editingTestId = null;
let editingQuestionIndex = null;

let gameTest = null;
let gameIndex = 0;
let gameScore = 0;
let selectedAnswer = null;
let gameDuration = 15;
let gameMode = "timed"; // "timed" или "manual"
let remainingTime = 15;
let timerInterval = null;
let nextTimeout = null;
let answerLocked = false;

// Звуки игры: настройка сохраняется на этом устройстве.
let soundEnabled = localStorage.getItem("english-quest-sound-enabled") !== "false";
let audioContext = null;


// SOFT GAME SOUNDS

function getAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return null;

    if (!audioContext) {
        audioContext = new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume().catch(() => {});
    }

    return audioContext;
}

function playSoftTone(frequency, duration, type = "sine", volume = 0.07, delay = 0) {
    if (!soundEnabled) return;

    const context = getAudioContext();
    if (!context) return;

    try {
        const startTime = context.currentTime + delay;
        const oscillator = context.createOscillator();
        const gain = context.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        oscillator.connect(gain);
        gain.connect(context.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration + 0.03);
    } catch (error) {
        console.warn("Не удалось воспроизвести звук:", error);
    }
}

function playCorrectSound() {
    playSoftTone(523.25, 0.16, "sine", 0.065, 0);
    playSoftTone(659.25, 0.16, "sine", 0.065, 0.15);
    playSoftTone(783.99, 0.24, "sine", 0.065, 0.30);
}

function playWrongSound() {
    playSoftTone(349.23, 0.18, "triangle", 0.045, 0);
    playSoftTone(293.66, 0.22, "triangle", 0.045, 0.17);
}

function playTimeoutSound() {
    playSoftTone(440, 0.16, "sine", 0.05, 0);
    playSoftTone(392, 0.22, "sine", 0.05, 0.18);
}

function updateSoundToggle() {
    const button = document.getElementById("sound-toggle");
    if (!button) return;

    button.textContent = soundEnabled ? "🔊 Звук: вкл." : "🔇 Звук: выкл.";
    button.setAttribute("aria-pressed", String(soundEnabled));
    button.title = soundEnabled ? "Выключить звуки" : "Включить звуки";
}

function toggleGameSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem("english-quest-sound-enabled", String(soundEnabled));

    if (soundEnabled) {
        getAudioContext();
        playSoftTone(523.25, 0.12, "sine", 0.045);
    }

    updateSoundToggle();
}

function ensureSoundToggle() {
    const gameTop = document.querySelector(".game-top");
    const gameTitle = document.getElementById("game-title");
    const parent = gameTop || (gameTitle ? gameTitle.parentElement : null);

    if (!parent) return;

    let button = document.getElementById("sound-toggle");

    if (!button) {
        button = document.createElement("button");
        button.id = "sound-toggle";
        button.type = "button";
        button.className = "edit-button";
        button.style.marginLeft = "auto";
        button.style.marginBottom = "10px";
        button.style.padding = "9px 14px";
        button.style.fontSize = "14px";
        button.style.borderRadius = "12px";
        button.style.cursor = "pointer";
        button.addEventListener("click", toggleGameSound);
        parent.appendChild(button);
    }

    updateSoundToggle();
}


// RANDOM SHUFFLE

function shuffleArray(array) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}


// NAVIGATION

function showSection(section) {
    stopGameTimers();

    if (section !== "listening") {
        stopListeningSpeech();
    }

    document.querySelectorAll("main > section").forEach(el => {
        el.classList.add("hidden");
    });

    const target = document.getElementById(section + "-section");
    if (!target) return;

    target.classList.remove("hidden");

    if (section === "listening") {
        backToListeningMenu();
        renderListeningList();
    }

    if (section === "tests") {
        renderTests();
    }

    if (section === "play") {
        document.getElementById("game-selection").classList.remove("hidden");
        document.getElementById("game-container").classList.add("hidden");
        document.getElementById("game-result").classList.add("hidden");

        renderPlayTests();
    }

    if (section === "create") {
        editingTestId = null;
        editingQuestionIndex = null;

        currentQuestions = [];
        currentQuestionImage = "";

        document.getElementById("test-title").value = "";
        document.getElementById("question-text").value = "";

        document.querySelectorAll(".answer-input").forEach(input => {
            input.value = "";
        });

        document.getElementById("correct-answer").value = "0";

        resetQuestionImage();
        updateEditorButtons();
        renderQuestions();
    }
}

function goHome() {
    stopGameTimers();
    stopListeningSpeech();
    showSection("home");
}

function stopGameTimers() {
    clearInterval(timerInterval);
    clearTimeout(nextTimeout);

    timerInterval = null;
    nextTimeout = null;
}


// EDITOR BUTTONS

function updateEditorButtons() {
    const addButton = document.querySelector('[onclick="addQuestion()"]');
    const saveButton = document.querySelector('[onclick="saveTest()"]');

    if (addButton) {
        addButton.textContent =
            editingQuestionIndex !== null
                ? "Сохранить изменения вопроса"
                : "Добавить вопрос";
    }

    if (saveButton) {
        saveButton.textContent =
            editingTestId !== null
                ? "Сохранить изменения теста"
                : "Сохранить тест";
    }
}


// QUESTION IMAGE

function previewQuestionImage(event) {
    const file = event.target.files && event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Выбери файл изображения.");
        event.target.value = "";
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert("Картинка слишком большая. Выбери изображение до 5 МБ.");
        event.target.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const image = new Image();

        image.onload = function () {
            const maxWidth = 900;
            const maxHeight = 700;

            const scale = Math.min(
                1,
                maxWidth / image.width,
                maxHeight / image.height
            );

            const canvas = document.createElement("canvas");

            canvas.width = Math.max(1, Math.round(image.width * scale));
            canvas.height = Math.max(1, Math.round(image.height * scale));

            const context = canvas.getContext("2d");

            if (!context) {
                alert("Не удалось обработать изображение.");
                event.target.value = "";
                return;
            }

            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);

            currentQuestionImage = canvas.toDataURL("image/jpeg", 0.78);

            const preview = document.getElementById("question-image-preview");
            const previewBox = document.getElementById("image-preview-box");

            preview.src = currentQuestionImage;
            previewBox.classList.remove("hidden");
        };

        image.onerror = function () {
            alert("Не удалось открыть это изображение.");
            event.target.value = "";
        };

        image.src = e.target.result;
    };

    reader.onerror = function () {
        alert("Не удалось прочитать файл изображения.");
        event.target.value = "";
    };

    reader.readAsDataURL(file);
}

function removeQuestionImage() {
    currentQuestionImage = "";

    const fileInput = document.getElementById("question-image");
    const preview = document.getElementById("question-image-preview");
    const previewBox = document.getElementById("image-preview-box");

    if (fileInput) fileInput.value = "";
    if (preview) preview.removeAttribute("src");
    if (previewBox) previewBox.classList.add("hidden");
}

function resetQuestionImage() {
    removeQuestionImage();
}


// QUESTION CREATION AND EDITING

function addQuestion() {
    const question = document.getElementById("question-text").value.trim();

    const answers = [...document.querySelectorAll(".answer-input")]
        .map(input => input.value.trim());

    const correct = Number(
        document.getElementById("correct-answer").value
    );

    if (!question || answers.some(answer => !answer)) {
        alert("Заполни вопрос и все четыре варианта ответа!");
        return;
    }

    if (!Number.isInteger(correct) || correct < 0 || correct > 3) {
        alert("Выбери правильный вариант ответа.");
        return;
    }

    const questionData = {
        question,
        answers,
        correct,
        image: currentQuestionImage
    };

    if (editingQuestionIndex !== null) {
        currentQuestions[editingQuestionIndex] = questionData;
        alert("Вопрос успешно изменён!");
    } else {
        currentQuestions.push(questionData);
        alert("Вопрос успешно добавлен!");
    }

    editingQuestionIndex = null;

    clearQuestionForm();
    updateEditorButtons();
    renderQuestions();
}

function clearQuestionForm() {
    document.getElementById("question-text").value = "";

    document.querySelectorAll(".answer-input").forEach(input => {
        input.value = "";
    });

    document.getElementById("correct-answer").value = "0";

    resetQuestionImage();
}

function renderQuestions() {
    const container = document.getElementById("question-list");

    if (!currentQuestions.length) {
        container.innerHTML =
            '<p class="empty-message">Пока нет добавленных вопросов</p>';
        return;
    }

    container.innerHTML = currentQuestions.map((q, index) => `
        <div class="question-item">
            <strong>${index + 1}. ${escapeHTML(q.question)}</strong>

            ${q.image ? "<p>🖼 Картинка прикреплена</p>" : ""}

            <p>
                ${q.answers.map((a, i) =>
                    `${i + 1}. ${escapeHTML(a)} ${i === q.correct ? "✓" : ""}`
                ).join("<br>")}
            </p>

            <button class="edit-button" onclick="editQuestion(${index})">
                Редактировать
            </button>

            <button class="delete-button" onclick="deleteQuestion(${index})">
                Удалить
            </button>
        </div>
    `).join("");
}


// EDIT QUESTION

function editQuestion(index) {
    const question = currentQuestions[index];

    if (!question) return;

    editingQuestionIndex = index;

    document.getElementById("question-text").value = question.question;

    document.querySelectorAll(".answer-input").forEach((input, i) => {
        input.value = question.answers[i] || "";
    });

    document.getElementById("correct-answer").value =
        String(question.correct);

    currentQuestionImage = question.image || "";

    const preview = document.getElementById("question-image-preview");
    const previewBox = document.getElementById("image-preview-box");

    if (currentQuestionImage) {
        preview.src = currentQuestionImage;
        previewBox.classList.remove("hidden");
    } else {
        resetQuestionImage();
    }

    updateEditorButtons();

    document.getElementById("question-text").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// DELETE QUESTION

function deleteQuestion(index) {
    if (!confirm("Удалить этот вопрос?")) return;

    currentQuestions.splice(index, 1);

    if (editingQuestionIndex === index) {
        editingQuestionIndex = null;
        clearQuestionForm();
        updateEditorButtons();
    } else if (
        editingQuestionIndex !== null &&
        editingQuestionIndex > index
    ) {
        editingQuestionIndex--;
    }

    renderQuestions();
}


// SAVE OR UPDATE TEST

function saveTest() {
    const title = document.getElementById("test-title").value.trim();

    if (!title) {
        alert("Введи название теста!");
        return;
    }

    if (!currentQuestions.length) {
        alert("Добавь хотя бы один вопрос!");
        return;
    }

    if (editingTestId !== null) {
        const testIndex = tests.findIndex(
            test => test.id === editingTestId
        );

        if (testIndex === -1) {
            alert("Тест не найден.");
            editingTestId = null;
            return;
        }

        const previousTest = tests[testIndex];

        tests[testIndex] = {
            ...previousTest,
            title,
            questions: currentQuestions.map(question => ({ ...question }))
        };

        if (!saveData()) {
            tests[testIndex] = previousTest;
            return;
        }

        alert("Изменения теста успешно сохранены!");

        editingTestId = null;
        showSection("tests");
        return;
    }

    const newTest = {
        id: Date.now(),
        title,
        questions: currentQuestions.map(question => ({ ...question }))
    };

    tests.push(newTest);

    if (!saveData()) {
        tests.pop();
        return;
    }

    alert("Тест успешно сохранён!");

    showSection("tests");
}
// OPEN SAVED TEST FOR EDITING

function editTest(id) {
    const test = tests.find(item => item.id === id);

    if (!test) {
        alert("Тест не найден.");
        return;
    }

    showSection("create");

    editingTestId = id;

    document.getElementById("test-title").value = test.title;

    currentQuestions = test.questions.map(question => ({
        ...question,
        answers: [...question.answers],
        image: question.image || ""
    }));

    editingQuestionIndex = null;
    currentQuestionImage = "";

    clearQuestionForm();
    updateEditorButtons();
    renderQuestions();
}


// SAVE DATA

function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
        return true;
    } catch (error) {
        console.error("Ошибка сохранения:", error);

        alert(
            "Не удалось сохранить тест. Возможно, в браузере закончилось место. " +
            "Попробуй уменьшить размер картинок."
        );

        return false;
    }
}


// BACKUP: EXPORT

function exportTests() {
    if (!tests.length) {
        alert("Пока нет тестов для экспорта.");
        return;
    }

    const backup = {
        app: "English Quest",
        version: 1,
        exportedAt: new Date().toISOString(),
        tests
    };

    const blob = new Blob(
        [JSON.stringify(backup, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "English-Quest-Backup.json";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    alert("Резервная копия успешно создана!");
}


// BACKUP: IMPORT

function importTests(event) {
    const file = event.target.files && event.target.files[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".json")) {
        alert("Выбери файл резервной копии в формате JSON.");
        event.target.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);

            const importedTests = Array.isArray(data)
                ? data
                : data.tests;

            if (!Array.isArray(importedTests)) {
                throw new Error("Неверный формат файла.");
            }

            processImportedTests(importedTests);

        } catch (error) {
            console.error("Ошибка импорта:", error);
            alert("Не удалось прочитать файл. Возможно, он повреждён.");
        }

        event.target.value = "";
    };

    reader.onerror = function () {
        alert("Не удалось прочитать файл.");
        event.target.value = "";
    };

    reader.readAsText(file);
}

function validateImportedTest(test) {
    if (!test || typeof test !== "object") return false;

    if (typeof test.title !== "string" || !test.title.trim()) {
        return false;
    }

    if (!Array.isArray(test.questions) || !test.questions.length) {
        return false;
    }

    return test.questions.every(question => {
        if (!question || typeof question !== "object") return false;

        if (
            typeof question.question !== "string" ||
            !question.question.trim()
        ) {
            return false;
        }

        if (
            !Array.isArray(question.answers) ||
            question.answers.length !== 4
        ) {
            return false;
        }

        if (
            !question.answers.every(
                answer => typeof answer === "string" && answer.trim()
            )
        ) {
            return false;
        }

        if (
            !Number.isInteger(question.correct) ||
            question.correct < 0 ||
            question.correct > 3
        ) {
            return false;
        }

        if (
            question.image !== undefined &&
            typeof question.image !== "string"
        ) {
            return false;
        }

        return true;
    });
}

function createUniqueTestId() {
    let id;

    do {
        id = Date.now() + Math.floor(Math.random() * 1000000);
    } while (tests.some(test => String(test.id) === String(id)));

    return id;
}

function getTestSignature(test) {
    return JSON.stringify({
        title: test.title.trim().toLowerCase(),
        questions: test.questions
    });
}

function processImportedTests(importedTests) {
    if (!importedTests.length) {
        alert("В файле нет тестов.");
        return;
    }

    const validTests = importedTests.filter(validateImportedTest);
    const invalidCount = importedTests.length - validTests.length;

    if (!validTests.length) {
        alert("В файле не найдено корректных тестов.");
        return;
    }

    const existingSignatures = new Set(tests.map(getTestSignature));
    const existingIds = new Set(tests.map(test => String(test.id)));

    const newTests = [];
    let duplicates = 0;

    validTests.forEach(importedTest => {
        const signature = getTestSignature(importedTest);

        if (existingSignatures.has(signature)) {
            duplicates++;
            return;
        }

        const newTest = {
            ...importedTest,
            id: importedTest.id
        };

        if (
            newTest.id === undefined ||
            newTest.id === null ||
            existingIds.has(String(newTest.id))
        ) {
            newTest.id = createUniqueTestId();
        }

        newTest.questions = importedTest.questions.map(question => ({
            question: question.question,
            answers: [...question.answers],
            correct: question.correct,
            image: question.image || ""
        }));

        newTests.push(newTest);

        existingSignatures.add(signature);
        existingIds.add(String(newTest.id));
    });

    if (!newTests.length) {
        alert(
            "Новых тестов нет.\n\n" +
            "Повторяющихся тестов: " + duplicates +
            "\nНекорректных тестов: " + invalidCount
        );
        return;
    }

    const confirmation = confirm(
        "Найдено новых тестов: " + newTests.length +
        "\nПовторяющихся: " + duplicates +
        "\nНекорректных: " + invalidCount +
        "\n\nДобавить новые тесты?"
    );

    if (!confirmation) return;

    const previousTests = tests;

    tests = [...tests, ...newTests];

    if (!saveData()) {
        tests = previousTests;
        return;
    }

    renderTests();

    alert(
        "Импорт завершён!\n\n" +
        "Добавлено тестов: " + newTests.length +
        "\nПропущено повторов: " + duplicates +
        "\nНекорректных тестов: " + invalidCount
    );
}


// RENDER SAVED TESTS

function renderTests() {
    const container = document.getElementById("tests-list");

    const backupToolbar = `
        <div style="
            display:flex;
            flex-wrap:wrap;
            gap:10px;
            margin-bottom:20px;
        ">
            <button class="primary-button" onclick="exportTests()">
                📥 Экспорт тестов
            </button>

            <button
                class="edit-button"
                onclick="document.getElementById('backup-file-input').click()">
                📤 Импорт тестов
            </button>

            <input
                type="file"
                id="backup-file-input"
                accept=".json,application/json"
                onchange="importTests(event)"
                style="display:none;">
        </div>
    `;

    if (!tests.length) {
        container.innerHTML = backupToolbar +
            '<div class="empty-message">У тебя пока нет тестов. Создай первый!</div>';
        return;
    }

    container.innerHTML = backupToolbar + tests.map(test => `
        <div class="test-item">
            <h3>📚 ${escapeHTML(test.title)}</h3>

            <p>${test.questions.length} вопросов</p>

            <button
                class="edit-button"
                onclick="editTest(${Number(test.id)})">
                Редактировать
            </button>

            <button
                class="delete-button"
                onclick="deleteTest(${Number(test.id)})">
                Удалить тест
            </button>
        </div>
    `).join("");
}


// DELETE TEST

function deleteTest(id) {
    if (!confirm("Ты действительно хочешь удалить этот тест?")) return;

    const previousTests = tests;

    tests = tests.filter(test => test.id !== id);

    if (!saveData()) {
        tests = previousTests;
        return;
    }

    renderTests();
}


// GAME SELECTION

function renderPlayTests() {
    const container = document.getElementById("play-tests-list");

    if (!tests.length) {
        container.innerHTML =
            '<div class="empty-message">Сначала создай свой тест!</div>';
        return;
    }

    container.innerHTML = tests.map(test => `
        <div class="test-item">
            <h3>🎮 ${escapeHTML(test.title)}</h3>
            <p>${test.questions.length} вопросов</p>
            <button class="primary-button"
                onclick="startGame(${Number(test.id)}, 'timed')">
                ⏱ С таймером
            </button>
            <button class="edit-button"
                onclick="startGame(${Number(test.id)}, 'manual')">
                ✋ Без таймера
            </button>
        </div>
    `).join("");
}


// PREPARE RANDOM GAME

function prepareRandomGame(test) {
    const randomizedQuestions = test.questions.map(question => {
        const answersWithCorrectness = question.answers.map(
            (answer, index) => ({
                text: answer,
                isCorrect: index === question.correct
            })
        );

        const shuffledAnswers = shuffleArray(answersWithCorrectness);

        return {
            ...question,
            answers: shuffledAnswers.map(answer => answer.text),
            correct: shuffledAnswers.findIndex(answer => answer.isCorrect)
        };
    });

    return {
        ...test,
        questions: shuffleArray(randomizedQuestions)
    };
}


// START GAME

function startGame(id, mode = "timed") {
    const savedTest = tests.find(test => test.id === id);

    if (!savedTest || !Array.isArray(savedTest.questions) || !savedTest.questions.length) {
        alert("В этом тесте нет вопросов!");
        return;
    }

    stopGameTimers();
    gameTest = prepareRandomGame(savedTest);
    gameMode = mode === "manual" ? "manual" : "timed";
    gameIndex = 0;
    gameScore = 0;
    selectedAnswer = null;
    answerLocked = false;
    gameDuration = Number(document.getElementById("game-duration").value);

    document.getElementById("game-selection").classList.add("hidden");
    document.getElementById("game-result").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");
    document.getElementById("game-title").textContent =
        gameTest.title + (gameMode === "manual" ? " — БЕЗ ТАЙМЕРА" : "");

    ensureSoundToggle();
    showGameQuestion();

    const gameScreen = document.getElementById("game-container");
    if (gameScreen.requestFullscreen) {
        gameScreen.requestFullscreen().catch(() => {});
    }
}


// SHOW QUESTION

function showGameQuestion() {
    stopGameTimers();
    selectedAnswer = null;
    answerLocked = false;

    const question = gameTest.questions[gameIndex];
    document.getElementById("game-progress").textContent =
        `Вопрос ${gameIndex + 1} / ${gameTest.questions.length}`;
    document.getElementById("game-question-text").textContent = question.question;

    const imageBox = document.getElementById("game-question-image");
    const gameImage = document.getElementById("game-image");
    if (question.image) {
        gameImage.src = question.image;
        imageBox.classList.remove("hidden");
    } else {
        gameImage.removeAttribute("src");
        imageBox.classList.add("hidden");
    }

    document.getElementById("game-feedback").classList.add("hidden");
    document.getElementById("game-next-message").classList.add("hidden");

    const manualControls = document.getElementById("manual-game-controls");
    manualControls.classList.add("hidden");
    manualControls.innerHTML = "";

    const timerBox = document.querySelector(".timer-box");
    const answersContainer = document.getElementById("game-answers");
    timerBox.classList.toggle("hidden", gameMode === "manual");

    answersContainer.innerHTML = question.answers.map((answer, index) => `
        <button class="game-answer" onclick="selectAnswer(${index})">
            ${String.fromCharCode(65 + index)}. ${escapeHTML(answer)}
        </button>
    `).join("");

    if (gameMode === "manual") {
        manualControls.innerHTML = `
            <button class="primary-button" id="manual-check-button"
                onclick="checkManualAnswer()" disabled>✓ Проверить</button>
        `;
        manualControls.classList.remove("hidden");
    } else {
        remainingTime = gameDuration;
        updateTimer();
        timerInterval = setInterval(() => {
            remainingTime = Math.max(0, remainingTime - 0.1);
            updateTimer();
            if (remainingTime <= 0) finishQuestion();
        }, 100);
    }
}


// TIMER

function updateTimer() {
    const seconds = Math.ceil(remainingTime);

    document.getElementById("timer-number").textContent = seconds;

    document.getElementById("timer-progress").style.width =
        (remainingTime / gameDuration * 100) + "%";

    const timer = document.getElementById("timer-number");

    timer.style.color = remainingTime <= 5 ? "#ed5555" : "#6258e8";

    document.getElementById("timer-progress").style.background =
        remainingTime <= 5 ? "#ed5555" : "#20bd78";
}


// SELECT ANSWER

function selectAnswer(index) {
    if (answerLocked) return;
    if (gameMode === "timed" && remainingTime <= 0) return;

    selectedAnswer = index;
    document.querySelectorAll(".game-answer").forEach((button, i) => {
        button.classList.toggle("selected", i === index);
    });

    if (gameMode === "manual") {
        const checkButton = document.getElementById("manual-check-button");
        if (checkButton) checkButton.disabled = false;
    }
}


// РЕЖИМ БЕЗ ТАЙМЕРА: ПРОВЕРКА ОТВЕТА
function checkManualAnswer() {
    if (gameMode !== "manual" || answerLocked) return;
    if (selectedAnswer === null) {
        alert("Сначала выбери вариант ответа.");
        return;
    }

    answerLocked = true;
    const question = gameTest.questions[gameIndex];
    const correct = question.correct;

    document.querySelectorAll(".game-answer").forEach((button, index) => {
        button.disabled = true;
        if (index === correct) button.classList.add("correct");
        else if (index === selectedAnswer) button.classList.add("wrong");
    });

    const feedback = document.getElementById("game-feedback");
    feedback.classList.remove("hidden");

    if (selectedAnswer === correct) {
        gameScore++;
        playCorrectSound();
        feedback.textContent = "🎉 CORRECT! Отличная работа!";
        feedback.style.background = "#dff8eb";
        feedback.style.color = "#13864e";
    } else {
        playWrongSound();
        feedback.textContent = "Правильный ответ: " + question.answers[correct];
        feedback.style.background = "#ffe6e6";
        feedback.style.color = "#bd3030";
    }

    const controls = document.getElementById("manual-game-controls");
    controls.innerHTML = `
        <button class="primary-button" onclick="nextManualQuestion()">
            ➜ ${gameIndex + 1 < gameTest.questions.length ? "Следующий вопрос" : "Завершить тест"}
        </button>
    `;
}

function nextManualQuestion() {
    if (gameMode !== "manual" || !answerLocked) return;
    gameIndex++;
    if (gameIndex < gameTest.questions.length) showGameQuestion();
    else finishGame();
}


// FINISH QUESTION

function finishQuestion() {
    if (answerLocked) return;

    answerLocked = true;
    stopGameTimers();

    const question = gameTest.questions[gameIndex];
    const correct = question.correct;

    if (selectedAnswer === correct) {
        gameScore++;
        playCorrectSound();
    } else if (selectedAnswer === null) {
        playTimeoutSound();
    } else {
        playWrongSound();
    }

    const buttons = document.querySelectorAll(".game-answer");

    buttons.forEach((button, index) => {
        button.disabled = true;

        if (index === correct) {
            button.classList.add("correct");
        } else if (index === selectedAnswer) {
            button.classList.add("wrong");
        }
    });

    const feedback = document.getElementById("game-feedback");

    feedback.classList.remove("hidden");

    if (selectedAnswer === correct) {
        feedback.textContent = "🎉 CORRECT! Отличная работа!";
        feedback.style.background = "#dff8eb";
        feedback.style.color = "#13864e";
    } else if (selectedAnswer === null) {
        feedback.textContent =
            "⏰ TIME'S UP! Правильный ответ: " + question.answers[correct];

        feedback.style.background = "#fff2e5";
        feedback.style.color = "#b66a18";
    } else {
        feedback.textContent =
            "Правильный ответ: " + question.answers[correct];

        feedback.style.background = "#ffe6e6";
        feedback.style.color = "#bd3030";
    }

    document.getElementById("game-next-message").classList.remove("hidden");

    nextTimeout = setTimeout(() => {
        gameIndex++;

        if (gameIndex < gameTest.questions.length) {
            showGameQuestion();
        } else {
            finishGame();
        }
    }, 3000);
}


// GAME RESULTS

function finishGame() {
    stopGameTimers();

    if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
    }

    document.getElementById("game-container").classList.add("hidden");

    const result = document.getElementById("game-result");
    result.classList.remove("hidden");

    const total = gameTest.questions.length;
    const percentage = Math.round(gameScore / total * 100);

    let emoji = "🏆";
    let message = "Отличная работа!";

    if (percentage < 50) {
        emoji = "💪";
        message = "Продолжаем учиться!";
    } else if (percentage < 80) {
        emoji = "🌟";
        message = "Очень хороший результат!";
    }

    result.innerHTML = `
        <div class="game-result-card">
            <div class="result-emoji">${emoji}</div>

            <h2>${message}</h2>

            <p>Тест: ${escapeHTML(gameTest.title)}</p>

            <p>
                Правильных ответов:
                <strong>${gameScore} / ${total}</strong>
            </p>

            <h2>${percentage}%</h2>

            <button
                class="primary-button"
                onclick="startGame(${Number(gameTest.id)}, '${gameMode}')">
                🔄 Играть ещё раз
            </button>

            <button
                class="back-button"
                onclick="returnToSelection()">
                Выбрать другой тест
            </button>
        </div>
    `;
}

function returnToSelection() {
    stopGameTimers();

    document.getElementById("game-result").classList.add("hidden");
    document.getElementById("game-selection").classList.remove("hidden");

    renderPlayTests();
}


// LISTENING: ХРАНЕНИЕ И СОЗДАНИЕ ЗАДАНИЙ

const LISTENING_STORAGE_KEY = "english-quest-listening";

let listeningItems = [];
let listeningQuestions = [];
let listeningImage = "";
let editingListeningId = null;
let currentListeningItem = null;

try {
    const savedListening = JSON.parse(localStorage.getItem(LISTENING_STORAGE_KEY) || "[]");
    listeningItems = Array.isArray(savedListening) ? savedListening : [];
} catch (error) {
    console.error("Не удалось прочитать Listening:", error);
    listeningItems = [];
}

function saveListeningData() {
    try {
        localStorage.setItem(LISTENING_STORAGE_KEY, JSON.stringify(listeningItems));
        return true;
    } catch (error) {
        console.error("Ошибка сохранения Listening:", error);
        alert("Не удалось сохранить задание. Возможно, картинка слишком большая. Уменьши её размер.");
        return false;
    }
}

function openListeningEditor(id = null) {
    stopListeningSpeech();
    editingListeningId = id;
    listeningQuestions = [];
    listeningImage = "";

    const titleInput = document.getElementById("listening-title");
    const textInput = document.getElementById("listening-text");
    const speedInput = document.getElementById("listening-speed");
    const questionInput = document.getElementById("listening-question");
    const answerInput = document.getElementById("listening-answer");

    if (id !== null) {
        const item = listeningItems.find(entry => String(entry.id) === String(id));
        if (!item) {
            alert("Задание Listening не найдено.");
            return;
        }

        titleInput.value = item.title || "";
        textInput.value = item.text || "";
        speedInput.value = String(item.speed || 0.85);
        listeningQuestions = Array.isArray(item.questions)
            ? item.questions.map(q => ({ question: q.question, answer: q.answer }))
            : [];
        listeningImage = item.image || "";
    } else {
        titleInput.value = "";
        textInput.value = "";
        speedInput.value = "0.85";
    }

    questionInput.value = "";
    answerInput.value = "";
    document.getElementById("listening-editor").classList.remove("hidden");
    document.getElementById("listening-menu").classList.add("hidden");
    document.getElementById("listening-player").classList.add("hidden");

    updateListeningImagePreview();
    renderListeningQuestions();
    document.getElementById("listening-title").scrollIntoView({ behavior: "smooth", block: "center" });
}

function addListeningQuestion() {
    const questionInput = document.getElementById("listening-question");
    const answerInput = document.getElementById("listening-answer");
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();

    if (!question || !answer) {
        alert("Заполни вопрос и правильный ответ.");
        return;
    }

    listeningQuestions.push({ question, answer });
    questionInput.value = "";
    answerInput.value = "";
    renderListeningQuestions();
    questionInput.focus();
}

function removeListeningQuestion(index) {
    if (!confirm("Удалить этот вопрос?")) return;
    listeningQuestions.splice(index, 1);
    renderListeningQuestions();
}

function renderListeningQuestions() {
    const container = document.getElementById("listening-question-list");
    if (!container) return;

    if (!listeningQuestions.length) {
        container.innerHTML = '<p class="empty-message">Пока нет вопросов</p>';
        return;
    }

    container.innerHTML = listeningQuestions.map((item, index) => `
        <div class="listening-question-item">
            <strong>${index + 1}. ${escapeHTML(item.question)}</strong>
            <p>Ответ: ${escapeHTML(item.answer)}</p>
            <button class="delete-button" onclick="removeListeningQuestion(${index})">Удалить</button>
        </div>
    `).join("");
}

function previewListeningImage(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Выбери файл изображения.");
        event.target.value = "";
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert("Картинка должна быть не больше 5 МБ.");
        event.target.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = eventResult => {
        const image = new Image();
        image.onload = () => {
            const scale = Math.min(1, 1000 / image.width, 750 / image.height);
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.round(image.width * scale));
            canvas.height = Math.max(1, Math.round(image.height * scale));
            const context = canvas.getContext("2d");

            if (!context) {
                alert("Не удалось обработать изображение.");
                return;
            }

            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            listeningImage = canvas.toDataURL("image/jpeg", 0.75);
            updateListeningImagePreview();
        };
        image.onerror = () => alert("Не удалось открыть изображение.");
        image.src = eventResult.target.result;
    };
    reader.onerror = () => alert("Не удалось прочитать изображение.");
    reader.readAsDataURL(file);
}

function updateListeningImagePreview() {
    const preview = document.getElementById("listening-image-preview");
    const box = document.getElementById("listening-image-preview-box");
    if (!preview || !box) return;

    if (listeningImage) {
        preview.src = listeningImage;
        box.classList.remove("hidden");
    } else {
        preview.removeAttribute("src");
        box.classList.add("hidden");
    }
}

function removeListeningImage() {
    listeningImage = "";
    const input = document.getElementById("listening-image");
    if (input) input.value = "";
    updateListeningImagePreview();
}

function saveListening() {
    const title = document.getElementById("listening-title").value.trim();
    const text = document.getElementById("listening-text").value.trim();
    const speed = Number(document.getElementById("listening-speed").value);

    if (!title || !text) {
        alert("Введи название и английский текст для прослушивания.");
        return;
    }

    if (!listeningQuestions.length) {
        alert("Добавь хотя бы один вопрос.");
        return;
    }

    const item = {
        id: editingListeningId !== null ? editingListeningId : Date.now(),
        title,
        text,
        speed: [0.7, 0.85, 1].includes(speed) ? speed : 0.85,
        image: listeningImage,
        questions: listeningQuestions.map(q => ({ ...q }))
    };

    const previous = [...listeningItems];
    if (editingListeningId !== null) {
        const index = listeningItems.findIndex(entry => String(entry.id) === String(editingListeningId));
        if (index === -1) {
            alert("Задание не найдено.");
            return;
        }
        listeningItems[index] = item;
    } else {
        listeningItems.push(item);
    }

    if (!saveListeningData()) {
        listeningItems = previous;
        return;
    }

    alert(editingListeningId !== null ? "Listening-задание обновлено!" : "Listening-задание сохранено!");
    backToListeningMenu();
    renderListeningList();
}

function renderListeningList() {
    const container = document.getElementById("listening-list");
    if (!container) return;

    if (!listeningItems.length) {
        container.innerHTML = '<p class="empty-message">Пока нет Listening-заданий. Создай первое!</p>';
        return;
    }

    container.innerHTML = listeningItems.map(item => `
        <div class="test-item">
            <h3>🎧 ${escapeHTML(item.title)}</h3>
            <p>${(item.questions || []).length} вопросов</p>
            <button class="primary-button" onclick="startListening(${Number(item.id)})">Начать</button>
            <button class="edit-button" onclick="openListeningEditor(${Number(item.id)})">Редактировать</button>
            <button class="delete-button" onclick="deleteListening(${Number(item.id)})">Удалить</button>
        </div>
    `).join("");
}

function deleteListening(id) {
    if (!confirm("Удалить это Listening-задание?")) return;
    const previous = [...listeningItems];
    listeningItems = listeningItems.filter(item => String(item.id) !== String(id));
    if (!saveListeningData()) {
        listeningItems = previous;
        return;
    }
    renderListeningList();
}

function startListening(id) {
    const item = listeningItems.find(entry => String(entry.id) === String(id));
    if (!item) {
        alert("Задание не найдено.");
        return;
    }

    stopListeningSpeech();
    currentListeningItem = item;
    document.getElementById("listening-menu").classList.add("hidden");
    document.getElementById("listening-editor").classList.add("hidden");
    document.getElementById("listening-player").classList.remove("hidden");
    document.getElementById("listening-player-title").textContent = item.title;

    const imageBox = document.getElementById("listening-player-image-box");
    const image = document.getElementById("listening-player-image");
    if (item.image) {
        image.src = item.image;
        imageBox.classList.remove("hidden");
    } else {
        image.removeAttribute("src");
        imageBox.classList.add("hidden");
    }

    document.getElementById("listening-player-questions").innerHTML =
        '<h3 class="listening-task-heading">Вопросы</h3>' +
        (item.questions || []).map((q, index) => `
            <div class="listening-question-item">
                <strong>${index + 1}. ${escapeHTML(q.question)}</strong>
            </div>
        `).join("");

    document.getElementById("listening-correct-answers").innerHTML = "";
    document.getElementById("listening-correct-answers").classList.add("hidden");
    document.getElementById("listening-audio-status").textContent = "Нажми «Прослушать», когда дети будут готовы.";
}

function playListeningAudio() {
    if (!currentListeningItem) return;

    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
        document.getElementById("listening-audio-status").textContent =
            "В этом браузере озвучивание не поддерживается.";
        return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentListeningItem.text);
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => /^en([_-]|$)/i.test(voice.lang));

    if (englishVoice) {
        utterance.voice = englishVoice;
        utterance.lang = englishVoice.lang;
    } else {
        utterance.lang = "en-US";
    }

    utterance.rate = Number(currentListeningItem.speed) || 0.85;
    utterance.pitch = 1;
    utterance.onstart = () => {
        document.getElementById("listening-audio-status").textContent = "🔊 Сейчас звучит текст...";
    };
    utterance.onend = () => {
        document.getElementById("listening-audio-status").textContent = "Прослушивание завершено. Можно ответить на вопросы.";
    };
    utterance.onerror = event => {
        document.getElementById("listening-audio-status").textContent =
            event.error === "canceled" ? "Воспроизведение остановлено." : "Не удалось озвучить текст. Проверь английский голос в Windows.";
    };

    window.speechSynthesis.speak(utterance);
}

function pauseListeningAudio() {
    if (!("speechSynthesis" in window)) return;
    if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        document.getElementById("listening-audio-status").textContent = "🔊 Воспроизведение продолжается...";
    } else if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        document.getElementById("listening-audio-status").textContent = "⏸ Пауза";
    }
}

function repeatListeningAudio() {
    playListeningAudio();
}

function revealListeningAnswers() {
    if (!currentListeningItem) return;
    const container = document.getElementById("listening-correct-answers");
    container.innerHTML = '<h3 class="listening-task-heading">Правильные ответы</h3>' +
        currentListeningItem.questions.map((q, index) => `
            <div class="listening-correct-item">
                <strong>${index + 1}. ${escapeHTML(q.question)}</strong>
                <p>${escapeHTML(q.answer)}</p>
            </div>
        `).join("");
    container.classList.remove("hidden");
}

function stopListeningSpeech() {
    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }
}

function backToListeningMenu() {
    stopListeningSpeech();
    currentListeningItem = null;

    const menu = document.getElementById("listening-menu");
    const editor = document.getElementById("listening-editor");
    const player = document.getElementById("listening-player");

    if (menu) menu.classList.remove("hidden");
    if (editor) editor.classList.add("hidden");
    if (player) player.classList.add("hidden");

    renderListeningList();
}


// HTML ESCAPING

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}
