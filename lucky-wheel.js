// ENGLISH QUEST — LUCKY WHEEL
// Готовые задания: учителю не нужно вводить слова вручную.

const luckyWheelSegments = [
    { key: "fruits", label: "FRUITS", emoji: "🍎", color: "#ff7474" },
    { key: "animals", label: "ANIMALS", emoji: "🐾", color: "#ffb84d" },
    { key: "colors", label: "COLORS", emoji: "🎨", color: "#ffe16b" },
    { key: "numbers", label: "NUMBERS", emoji: "🔢", color: "#78d7a0" },
    { key: "school", label: "SCHOOL", emoji: "🎒", color: "#65c9e8" },
    { key: "grammar", label: "GRAMMAR", emoji: "🧩", color: "#8e8af5" },
    { key: "speaking", label: "SPEAKING", emoji: "🗣️", color: "#c58be9" },
    { key: "mixed", label: "MIX IT!", emoji: "⭐", color: "#f28db8" }
];

const luckyWheelTasks = {
    young: {
        fruits: [
            { q: "Which fruit is yellow and long?", options: ["Apple", "Banana", "Grape", "Pear"], a: "Banana 🍌", ru: "Какой фрукт жёлтый и длинный?" },
            { q: "What fruit is red or green?", options: ["Apple", "Lemon", "Peach", "Plum"], a: "Apple 🍎", ru: "Какой фрукт бывает красным или зелёным?" },
            { q: "Name three fruits in English.", a: "Example: apple, banana, orange.", ru: "Назови три фрукта на английском." },
            { q: "Which fruit is sour and yellow?", options: ["Watermelon", "Lemon", "Cherry", "Pear"], a: "Lemon 🍋", ru: "Какой фрукт кислый и жёлтый?" },
            { q: "Translate: клубника.", a: "Strawberry 🍓", ru: "Переведи слово «клубника»." },
            { q: "What fruit is big and green outside?", options: ["Watermelon", "Cherry", "Grape", "Apricot"], a: "Watermelon 🍉", ru: "Какой фрукт большой и зелёный снаружи?" }
        ],
        animals: [
            { q: "Which animal says ‘Meow’?", options: ["Dog", "Cat", "Cow", "Duck"], a: "Cat 🐱", ru: "Какое животное говорит «мяу»?" },
            { q: "Which animal is the king of the jungle?", options: ["Rabbit", "Lion", "Horse", "Sheep"], a: "Lion 🦁", ru: "Какое животное называют царём джунглей?" },
            { q: "Name three farm animals in English.", a: "Example: cow, horse, sheep.", ru: "Назови три домашних сельскохозяйственных животных." },
            { q: "Which animal can fly?", options: ["Elephant", "Bird", "Fish", "Dog"], a: "Bird 🐦", ru: "Какое животное умеет летать?" },
            { q: "Translate: черепаха.", a: "Turtle 🐢", ru: "Переведи слово «черепаха»." },
            { q: "What animal gives us milk?", options: ["Cow", "Tiger", "Fox", "Bear"], a: "Cow 🐄", ru: "Какое животное даёт нам молоко?" }
        ],
        colors: [
            { q: "What color is the sun?", options: ["Blue", "Yellow", "Black", "Green"], a: "Yellow ☀️", ru: "Какого цвета солнце?" },
            { q: "Mix blue and yellow. What color do you get?", a: "Green 💚", ru: "Смешай синий и жёлтый. Какой цвет получится?" },
            { q: "Name four colors in English.", a: "Example: red, blue, green, pink.", ru: "Назови четыре цвета на английском." },
            { q: "What color is chocolate?", options: ["Purple", "Brown", "White", "Pink"], a: "Brown 🍫", ru: "Какого цвета шоколад?" },
            { q: "Translate: фиолетовый.", a: "Purple 💜", ru: "Переведи слово «фиолетовый»." }
        ],
        numbers: [
            { q: "What number comes after twelve?", options: ["Eleven", "Thirteen", "Fourteen", "Ten"], a: "Thirteen 13", ru: "Какое число идёт после двенадцати?" },
            { q: "How much is five plus three?", a: "Eight — 8", ru: "Сколько будет пять плюс три?" },
            { q: "Count from one to ten in English.", a: "One, two, three, four, five, six, seven, eight, nine, ten.", ru: "Посчитай от одного до десяти на английском." },
            { q: "How much is ten minus four?", a: "Six — 6", ru: "Сколько будет десять минус четыре?" }
        ],
        school: [
            { q: "What do you write with?", options: ["Pencil", "Plate", "Shoe", "Ball"], a: "Pencil ✏️", ru: "Чем ты пишешь?" },
            { q: "Translate: книга.", a: "Book 📚", ru: "Переведи слово «книга»." },
            { q: "Name three things in your classroom.", a: "Example: desk, chair, board.", ru: "Назови три предмета в классе." },
            { q: "What do you carry your books in?", options: ["Backpack", "Cup", "Window", "Clock"], a: "Backpack 🎒", ru: "В чём ты носишь книги?" }
        ],
        grammar: [
            { q: "Choose: She ___ my friend.", options: ["am", "is", "are", "be"], a: "is", ru: "Выбери правильную форму глагола to be." },
            { q: "Choose: I ___ seven years old.", options: ["am", "is", "are", "be"], a: "am", ru: "Выбери правильную форму глагола to be." },
            { q: "Make this sentence negative: I like apples.", a: "I don't like apples.", ru: "Сделай предложение отрицательным." },
            { q: "Choose: They ___ football every day.", options: ["plays", "play", "playing", "is play"], a: "play", ru: "Выбери правильную форму глагола." },
            { q: "What is the plural of ‘child’?", a: "Children", ru: "Назови множественное число слова child." }
        ],
        speaking: [
            { q: "Introduce yourself in three sentences.", a: "Example: My name is ... I am ... years old. I like ...", ru: "Представься тремя предложениями." },
            { q: "Describe your best friend.", a: "Say their name, age and two things about them.", ru: "Опиши своего лучшего друга." },
            { q: "What is your favourite food? Why?", a: "Example: My favourite food is pizza because it is delicious.", ru: "Какая твоя любимая еда и почему?" },
            { q: "Say five words that start with the letter B.", a: "Example: ball, book, banana, bird, blue.", ru: "Назови пять слов на букву B." }
        ]
    },
    older: {
        fruits: [
            { q: "Which fruit contains a lot of vitamin C?", options: ["Lemon", "Coconut", "Avocado", "Fig"], a: "Lemon 🍋", ru: "В каком фрукте много витамина C?" },
            { q: "Describe your favourite fruit without naming it.", a: "Give its colour, shape, taste and where it grows.", ru: "Опиши любимый фрукт, не называя его." },
            { q: "What is the plural of ‘strawberry’?", a: "Strawberries", ru: "Назови множественное число strawberry." },
            { q: "Name five fruits that grow in Uzbekistan.", a: "Example: grapes, apricots, peaches, melons, pomegranates.", ru: "Назови пять фруктов, которые растут в Узбекистане." }
        ],
        animals: [
            { q: "What is the fastest land animal?", options: ["Lion", "Cheetah", "Horse", "Wolf"], a: "Cheetah 🐆", ru: "Какое наземное животное самое быстрое?" },
            { q: "What is the difference between ‘wild’ and ‘domestic’?", a: "Wild animals live in nature; domestic animals live with or are cared for by people.", ru: "Объясни разницу между wild и domestic." },
            { q: "Describe an elephant using three adjectives.", a: "Example: huge, intelligent, strong.", ru: "Опиши слона тремя прилагательными." },
            { q: "Which animal is a mammal but can fly?", a: "Bat 🦇", ru: "Какое млекопитающее умеет летать?" }
        ],
        colors: [
            { q: "What do we call a colour between red and blue?", a: "Purple / violet", ru: "Как называется цвет между красным и синим?" },
            { q: "Give three examples of things that are usually transparent.", a: "Example: clean glass, clear water, some plastic.", ru: "Назови три обычно прозрачных предмета или материала." },
            { q: "What does ‘to feel blue’ mean?", a: "To feel sad.", ru: "Что означает выражение to feel blue?" }
        ],
        numbers: [
            { q: "What is 25 multiplied by 4?", a: "100 — one hundred", ru: "Сколько будет 25 умножить на 4?" },
            { q: "Spell the number 40.", a: "Forty (not fourty).", ru: "Напиши число 40 словами по-английски." },
            { q: "What is half of ninety?", a: "Forty-five — 45", ru: "Чему равна половина девяноста?" }
        ],
        school: [
            { q: "What is the difference between ‘lesson’ and ‘subject’?", a: "A lesson is a period of teaching; a subject is an area of study, such as English or Maths.", ru: "Объясни разницу между lesson и subject." },
            { q: "Name five school subjects in English.", a: "Example: Maths, Science, History, Geography, English.", ru: "Назови пять школьных предметов." },
            { q: "Make a sentence with the word ‘library’.", a: "Example: I usually borrow books from the library.", ru: "Составь предложение со словом library." }
        ],
        grammar: [
            { q: "Choose: If I ___ time, I will call you.", options: ["will have", "have", "had", "having"], a: "have — First Conditional", ru: "Выбери форму для First Conditional." },
            { q: "Change to Present Perfect: She finishes her homework.", a: "She has finished her homework.", ru: "Поставь предложение в Present Perfect." },
            { q: "Find the mistake: He don't like coffee.", a: "He doesn't like coffee.", ru: "Найди ошибку в предложении." },
            { q: "Complete: This is the ___ film I have ever seen. (good)", a: "best", ru: "Поставь good в превосходную степень." },
            { q: "Change to passive: People speak English in many countries.", a: "English is spoken in many countries.", ru: "Преобразуй предложение в Passive Voice." }
        ],
        speaking: [
            { q: "Would you rather live in a city or in the countryside? Why?", a: "Give your choice and at least two reasons.", ru: "Где бы ты предпочёл жить: в городе или деревне? Почему?" },
            { q: "Describe a memorable day in your life.", a: "Mention when it happened, what you did and why you remember it.", ru: "Опиши запоминающийся день своей жизни." },
            { q: "Should children have homework every day? Give your opinion.", a: "Give your opinion with two reasons and an example.", ru: "Должны ли дети получать домашнее задание каждый день? Обоснуй мнение." },
            { q: "Talk about a book or film you recommend.", a: "Say what it is about and why other people should try it.", ru: "Расскажи о книге или фильме, который рекомендуешь." }
        ]
    }
};

let luckyWheelRotation = 0;
let luckyWheelSpinning = false;
let luckyWheelCurrentTask = null;
let luckyWheelScores = [0, 0];
let luckyWheelUsed = {};

function drawLuckyWheel() {
    const canvas = document.getElementById("lucky-wheel-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = canvas.width / 2, cy = canvas.height / 2, radius = 292;
    const arc = Math.PI * 2 / luckyWheelSegments.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    luckyWheelSegments.forEach((segment, i) => {
        const start = -Math.PI / 2 + i * arc;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, radius, start, start + arc); ctx.closePath();
        ctx.fillStyle = segment.color; ctx.fill();
        ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 7; ctx.stroke();
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(start + arc / 2);
        ctx.textAlign = "right"; ctx.fillStyle = "#332b55"; ctx.font = "bold 23px Arial";
        ctx.fillText(segment.label, radius - 27, 8);
        ctx.font = "30px Arial"; ctx.fillText(segment.emoji, radius - 125, 12);
        ctx.restore();
    });
    ctx.beginPath(); ctx.arc(cx, cy, 35, 0, Math.PI * 2); ctx.fillStyle = "#ffffff"; ctx.fill();
    ctx.strokeStyle = "#6258e8"; ctx.lineWidth = 7; ctx.stroke();
}

function getWheelPack() {
    return document.getElementById("wheel-pack")?.value || "mixed";
}
function getWheelAge() {
    return document.getElementById("wheel-age")?.value || "young";
}
function availableWheelSegments() {
    const pack = getWheelPack();
    return luckyWheelSegments.filter(s => pack === "mixed" || s.key === pack || (pack === "vocabulary" && ["fruits", "animals", "colors", "numbers", "school"].includes(s.key)));
}
function getWheelTasks(key) {
    const age = getWheelAge();
    if (key === "mixed") {
        const keys = ["fruits", "animals", "colors", "numbers", "school", "grammar", "speaking"];
        return keys.flatMap(k => luckyWheelTasks[age][k] || []);
    }
    return luckyWheelTasks[age][key] || [];
}
function pickWheelTask(key) {
    const tasks = getWheelTasks(key);
    const id = getWheelAge() + "-" + key;
    if (!luckyWheelUsed[id] || luckyWheelUsed[id].length >= tasks.length) luckyWheelUsed[id] = [];
    const remaining = tasks.map((_, i) => i).filter(i => !luckyWheelUsed[id].includes(i));
    const index = remaining[Math.floor(Math.random() * remaining.length)];
    luckyWheelUsed[id].push(index);
    return tasks[index];
}

function spinLuckyWheel() {
    if (luckyWheelSpinning) return;
    const segments = availableWheelSegments();
    if (!segments.length) return;
    luckyWheelSpinning = true;
    const spinButton = document.getElementById("wheel-spin-button");
    spinButton.disabled = true;
    const chosen = segments[Math.floor(Math.random() * segments.length)];
    const chosenIndex = luckyWheelSegments.findIndex(s => s.key === chosen.key);
    const segmentAngle = 360 / luckyWheelSegments.length;
    const targetAngle = 360 - (chosenIndex * segmentAngle + segmentAngle / 2);
    const current = ((luckyWheelRotation % 360) + 360) % 360;
    const delta = ((targetAngle - current) + 360) % 360;
    luckyWheelRotation += 360 * 6 + delta;
    const canvas = document.getElementById("lucky-wheel-canvas");
    canvas.style.transition = "transform 5s cubic-bezier(.12,.78,.12,1)";
    canvas.style.transform = `rotate(${luckyWheelRotation}deg)`;
    setTimeout(() => {
        luckyWheelSpinning = false;
        spinButton.disabled = false;
        luckyWheelCurrentTask = { ...pickWheelTask(chosen.key), category: chosen };
        renderWheelTask(luckyWheelCurrentTask);
    }, 5100);
}

function renderWheelTask(task) {
    const card = document.getElementById("wheel-task-card");
    const options = task.options?.length ? `<div class="wheel-task-options">${task.options.map(o => `<div class="wheel-task-option">${escapeWheelHTML(o)}</div>`).join("")}</div>` : "";
    card.innerHTML = `<div class="wheel-task-label">${task.category.emoji} ${task.category.label}</div><div class="wheel-task-emoji">${task.category.emoji}</div><div class="wheel-task-question">${escapeWheelHTML(task.q)}</div>${options}<p style="margin-top:12px;color:#858198;font-size:14px">${escapeWheelHTML(task.ru || "")}</p><div id="wheel-answer-area"></div>`;
    document.getElementById("wheel-answer-button").disabled = false;
    document.getElementById("wheel-correct-button").disabled = false;
    document.getElementById("wheel-correct-two-button").disabled = false;
    document.getElementById("wheel-next-button").disabled = false;
}
function escapeWheelHTML(value) {
    return String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}
function revealWheelAnswer() {
    if (!luckyWheelCurrentTask) return;
    const area = document.getElementById("wheel-answer-area");
    if (area) area.innerHTML = `<div class="wheel-task-answer">💡 ${escapeWheelHTML(luckyWheelCurrentTask.a)}</div>`;
}
function changeWheelScore(team, delta) {
    const index = team - 1;
    luckyWheelScores[index] = Math.max(0, luckyWheelScores[index] + delta);
    updateWheelScores();
}
function awardWheelPoint(team) {
    changeWheelScore(team, 1);
    const button = document.getElementById(team === 1 ? "wheel-correct-button" : "wheel-correct-two-button");
    button.disabled = true;
}
function updateWheelScores() {
    document.getElementById("wheel-score-one").textContent = luckyWheelScores[0] + " баллов";
    document.getElementById("wheel-score-two").textContent = luckyWheelScores[1] + " баллов";
}
function nextWheelTask() {
    luckyWheelCurrentTask = null;
    const card = document.getElementById("wheel-task-card");
    card.innerHTML = `<div class="wheel-task-label">СЛЕДУЮЩИЙ РАУНД</div><div class="wheel-task-emoji">🎡</div><h3>Крутим колесо ещё раз!</h3><p>Какая команда ответит быстрее?</p>`;
    ["wheel-answer-button", "wheel-correct-button", "wheel-correct-two-button", "wheel-next-button"].forEach(id => document.getElementById(id).disabled = true);
    document.getElementById("wheel-spin-button").disabled = false;
}
function resetLuckyWheel() {
    luckyWheelUsed = {};
    luckyWheelCurrentTask = null;
    luckyWheelScores = [0, 0];
    luckyWheelRotation = 0;
    luckyWheelSpinning = false;
    const canvas = document.getElementById("lucky-wheel-canvas");
    if (canvas) { canvas.style.transition = "none"; canvas.style.transform = "rotate(0deg)"; }
    const card = document.getElementById("wheel-task-card");
    if (card) card.innerHTML = `<div class="wheel-task-label">ТВОЁ ЗАДАНИЕ</div><div class="wheel-task-emoji">✨</div><h3>Готовы играть?</h3><p>Крути колесо — оно выберет тему и покажет готовое задание.</p>`;
    ["wheel-answer-button", "wheel-correct-button", "wheel-correct-two-button", "wheel-next-button"].forEach(id => { const el = document.getElementById(id); if (el) el.disabled = true; });
    const spin = document.getElementById("wheel-spin-button"); if (spin) spin.disabled = false;
    updateWheelScores();
    drawLuckyWheel();
}

// Add Lucky Wheel to the existing section navigation without changing existing modules.
if (typeof window.showSection === "function") {
    const previousShowSectionForWheel = window.showSection;
    window.showSection = function(section) {
        previousShowSectionForWheel(section);
        if (section === "lucky-wheel") resetLuckyWheel();
    };
}

document.addEventListener("DOMContentLoaded", drawLuckyWheel);
if (document.readyState !== "loading") drawLuckyWheel();
