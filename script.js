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
