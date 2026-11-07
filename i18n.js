// ==========================================
// ENGLISH QUEST — RUSSIAN / UZBEK LANGUAGE
// ==========================================

const I18N_STORAGE_KEY = "english-quest-language";

let currentLanguage =
    localStorage.getItem(I18N_STORAGE_KEY) || "ru";

if (!["ru", "uz"].includes(currentLanguage)) {
    currentLanguage = "ru";
}

const translations = {
    // HEADER
    "Учись играя!": "O‘ynab o‘rgan!",
    "Офлайн-режим": "Oflayn rejim",

    // HOME
    "Что будем делать?": "Nima qilamiz?",
    "Добро пожаловать": "Xush kelibsiz",
    "Изучай английский, отвечай на вопросы и получай новые знания!":
        "Ingliz tilini o‘rganing, savollarga javob bering va yangi bilimlarga ega bo‘ling!",
    "Играть": "O‘ynash",
    "Начать английскую викторину": "Ingliz tili viktorinasini boshlash",
    "Начать →": "Boshlash →",
    "Создать тест": "Test yaratish",
    "Создавай собственные задания": "O‘z topshiriqlaringizni yarating",
    "Создать →": "Yaratish →",
    "Мои тесты": "Testlarim",
    "Управляй своими тестами": "Testlaringizni boshqaring",
    "Открыть →": "Ochish →",
    "Listening": "Listening",
    "Слушай английскую речь и выполняй задания":
        "Ingliz tilidagi matnni tinglang va topshiriqlarni bajaring",
    "Vocabulary": "Vocabulary",

    // COMMON
    "На главную": "Bosh sahifaga",
    "← На главную": "← Bosh sahifaga",
    "← Назад": "← Orqaga",
    "Назад": "Orqaga",
    "Сохранить": "Saqlash",
    "Удалить": "O‘chirish",
    "Редактировать": "Tahrirlash",
    "Изучать": "O‘rganish",
    "Следующее": "Keyingisi",
    "Перемешать": "Aralashtirish",

    // QUIZ
    "Создание теста": "Test yaratish",
    "Создай собственную английскую викторину":
        "O‘zingizning ingliz tili testingizni yarating",
    "Название теста": "Test nomi",
    "Например: Fruits": "Masalan: Fruits",
    "Добавить вопрос": "Savol qo‘shish",
    "Вопрос на английском": "Ingliz tilidagi savol",
    "Картинка к вопросу (необязательно)":
        "Savol uchun rasm (ixtiyoriy)",
    "Удалить картинку": "Rasmni o‘chirish",
    "Вариант 1": "1-variant",
    "Вариант 2": "2-variant",
    "Вариант 3": "3-variant",
    "Вариант 4": "4-variant",
    "Правильный ответ": "To‘g‘ri javob",
    "Сохранить тест": "Testni saqlash",
    "Сохранить изменения теста": "Testdagi o‘zgarishlarni saqlash",
    "Мои тесты": "Testlarim",
    "Все твои сохранённые викторины": "Barcha saqlangan testlaringiz",
    "Выбери тест для своей группы": "Guruhingiz uchun testni tanlang",
    "Время на один вопрос": "Har bir savol uchun vaqt",
    "10 секунд": "10 soniya",
    "15 секунд": "15 soniya",
    "20 секунд": "20 soniya",
    "30 секунд": "30 soniya",
    "Вопрос": "Savol",
    "Следующий вопрос через 3 секунды...":
        "Keyingi savol 3 soniyadan keyin...",
    "Завершить тест": "Testni yakunlash",
    "Выбрать другой тест": "Boshqa testni tanlash",
    "Играть ещё раз": "Qayta o‘ynash",
    "Отличная работа!": "Ajoyib ish!",
    "Продолжаем учиться!": "O‘rganishda davom etamiz!",
    "Очень хороший результат!": "Juda yaxshi natija!",
    "Правильных ответов:": "To‘g‘ri javoblar:",
    "Тест успешно сохранён!": "Test muvaffaqiyatli saqlandi!",
    "Тест не найден.": "Test topilmadi.",
    "В этом тесте нет вопросов!": "Bu testda savollar yo‘q!",
    "Добавь хотя бы один вопрос!": "Kamida bitta savol qo‘shing!",
    "Введи название теста!": "Test nomini kiriting!",
    "Заполни вопрос и все четыре варианта ответа!":
        "Savol va barcha to‘rtta javob variantini to‘ldiring!",
    "Сначала выбери вариант ответа.": "Avval javob variantini tanlang.",
    "Удалить этот вопрос?": "Bu savol o‘chirilsinmi?",
    "Ты действительно хочешь удалить этот тест?":
        "Haqiqatan ham bu testni o‘chirmoqchimisiz?",

    // LISTENING
    "Развивай навыки аудирования на английском языке":
        "Ingliz tilida tinglab tushunish ko‘nikmalarini rivojlantiring",
    "Создать аудирование": "Listening topshirig‘ini yaratish",
    "Добавь текст, вопросы и ответы": "Matn, savollar va javoblarni qo‘shing",
    "Создание Listening": "Listening yaratish",
    "Подготовь аудирование для своих учеников":
        "O‘quvchilaringiz uchun tinglab tushunish mashqini tayyorlang",
    "Название задания": "Topshiriq nomi",
    "Текст для озвучки": "Ovozli matn",
    "Введи английский текст. Во время игры компьютер прочитает его голосом на английском языке.":
        "Ingliz tilidagi matnni kiriting. Kompyuter uni ingliz tilida ovoz chiqarib o‘qiydi.",
    "Английский текст": "Inglizcha matn",
    "Скорость голоса": "Ovoz tezligi",
    "Медленно": "Sekin",
    "Обычная": "Oddiy",
    "Быстро": "Tez",
    "Картинка (необязательно)": "Rasm (ixtiyoriy)",
    "Можно добавить картинку к аудированию.":
        "Listening topshirig‘iga rasm qo‘shishingiz mumkin.",
    "Вопросы к аудированию": "Listening savollari",
    "Добавь вопросы, на которые дети будут отвечать на своих листочках.":
        "Bolalar javob berishi uchun savollar qo‘shing.",
    "Вопрос": "Savol",
    "Ответ": "Javob",
    "Правильный ответ": "To‘g‘ri javob",
    "Добавить вопрос": "Savol qo‘shish",
    "Сохранить аудирование": "Listening topshirig‘ini saqlash",
    "Мои аудирования": "Listening topshiriqlarim",
    "Слушай внимательно и записывай ответы на своём листочке!":
        "Diqqat bilan tinglang va javoblarni varaqangizga yozing!",
    "Нажми кнопку, чтобы прослушать текст.":
        "Matnni tinglash uchun tugmani bosing.",
    "Воспроизвести": "Tinglash",
    "Пауза": "Pauza",
    "Повторить": "Takrorlash",
    "Прослушай текст и ответь на вопросы на своём листочке.":
        "Matnni tinglang va savollarga varaqangizda javob bering.",
    "Показать правильные ответы": "To‘g‘ri javoblarni ko‘rsatish",
    "Завершить аудирование": "Listeningni yakunlash",
    "Назад к аудированиям": "← Listening topshiriqlariga qaytish",
    "Готово к воспроизведению": "Tinglashga tayyor",
    "Прослушивание завершено. Можно ответить на вопросы.":
        "Tinglash tugadi. Savollarga javob berishingiz mumkin.",
    "Воспроизведение остановлено.": "Tinglash to‘xtatildi.",
    "Набор не найден.": "To‘plam topilmadi.",

    // VOCABULARY
    "Изучай новые английские слова!": "Yangi inglizcha so‘zlarni o‘rganing!",
    "Мои наборы слов": "So‘zlar to‘plamlarim",
    "Создать набор слов": "So‘zlar to‘plamini yaratish",
    "Создание набора": "To‘plam yaratish",
    "Редактирование набора": "To‘plamni tahrirlash",
    "Название набора": "To‘plam nomi",
    "Добавить слово": "So‘z qo‘shish",
    "English word": "Inglizcha so‘z",
    "Перевод": "Tarjima",
    "Пример предложения (необязательно)":
        "Misol gap (ixtiyoriy)",
    "Слова в наборе": "To‘plamdagi so‘zlar",
    "Сохранить набор": "To‘plamni saqlash",
    "Нажми, чтобы увидеть перевод": "Tarjimani ko‘rish uchun bosing",
    "Нажми, чтобы перевернуть": "Kartani aylantirish uchun bosing",
    "Перевернуть": "Aylantirish",
    "Далее →": "Keyingisi →",
    "← Назад к наборам": "← To‘plamlarga qaytish",
    "Отменить редактирование": "Tahrirlashni bekor qilish",
    "Пока нет наборов слов. Создай первый!":
        "Hozircha so‘zlar to‘plami yo‘q. Birinchisini yarating!",
    "Пока нет слов. Добавь первое слово.":
        "Hozircha so‘zlar yo‘q. Birinchi so‘zni qo‘shing!",
    "Введи название набора, например Fruits.":
        "To‘plam nomini kiriting, masalan Fruits.",
    "Добавь хотя бы одно слово.": "Kamida bitta so‘z qo‘shing!",
    "Набор слов сохранён!": "So‘zlar to‘plami saqlandi!",
    "Удалить это слово из набора?": "Bu so‘z to‘plamdan o‘chirilsinmi?",
    "Удалить весь набор слов?": "Butun so‘zlar to‘plami o‘chirilsinmi?",

    // FOOTER
    "Learning is fun!": "O‘rganish qiziqarli!"
};

const vocabularyTranslationsUz = {
    "кот": "mushuk",
    "собака": "it",
    "птица": "qush",
    "рыба": "baliq",
    "кролик": "quyon",
    "лошадь": "ot",
    "корова": "sigir",
    "свинья": "cho‘chqa",
    "яблоко": "olma",
    "банан": "banan",
    "апельсин": "apelsin",
    "хлеб": "non",
    "молоко": "sut",
    "вода": "suv",
    "яйцо": "tuxum",
    "сыр": "pishloq",
    "торт": "tort",
    "рис": "guruch",
    "красный": "qizil",
    "синий": "ko‘k",
    "зелёный": "yashil",
    "жёлтый": "sariq",
    "чёрный": "qora",
    "белый": "oq",
    "мама": "ona",
    "папа": "ota",
    "сестра": "opa / singil",
    "брат": "aka / uka",
    "семья": "oila",
    "друг": "do‘st",
    "дом": "uy",
    "комната": "xona",
    "дверь": "eshik",
    "окно": "deraza",
    "стол": "stol",
    "стул": "stul",
    "книга": "kitob",
    "ручка": "ruchka",
    "школа": "maktab",
    "учитель": "o‘qituvchi",
    "ученик": "o‘quvchi",
    "солнце": "quyosh",
    "луна": "oy",
    "звезда": "yulduz",
    "дерево": "daraxt",
    "цветок": "gul",
    "машина": "mashina",
    "автобус": "avtobus",
    "один": "bir",
    "два": "ikki",

    "завтрак": "nonushta",
    "обед": "tushlik",
    "ужин": "kechki ovqat",
    "кухня": "oshxona",
    "ванная": "hammom",
    "спальня": "yotoqxona",
    "сад": "bog‘",
    "одежда": "kiyim",
    "куртка": "kurtka",
    "обувь": "poyabzal",
    "погода": "ob-havo",
    "дождь": "yomg‘ir",
    "снег": "qor",
    "облако": "bulut",
    "гора": "tog‘",
    "река": "daryo",
    "пляж": "plyaj",
    "лес": "o‘rmon",
    "путешествовать": "sayohat qilmoq",
    "аэропорт": "aeroport",
    "отель": "mehmonxona",
    "билет": "chipta",
    "поезд": "poyezd",
    "велосипед": "velosiped",
    "магазин": "do‘kon",
    "рынок": "bozor",
    "деньги": "pul",
    "цена": "narx",
    "врач": "shifokor",
    "больница": "kasalxona",
    "здоровый": "sog‘lom",
    "упражнение": "mashq",
    "перерыв": "tanaffus",
    "каникулы": "ta’til",
    "выходные": "dam olish kunlari",
    "утро": "ertalab",
    "вечер": "kechqurun",
    "всегда": "har doim",
    "обычно": "odatda",
    "иногда": "ba’zan",
    "никогда": "hech qachon",
    "осторожный": "ehtiyotkor",
    "дружелюбный": "do‘stona",
    "красивый": "chiroyli",
    "дорогой": "qimmat",
    "дешёвый": "arzon",
    "голодный": "och",
    "испытывающий жажду": "chanqagan",
    "интересный": "qiziqarli",
    "важный": "muhim",

    "достижение": "yutuq",
    "совет": "maslahat",
    "преимущество": "afzallik",
    "встреча": "uchrashuv",
    "поведение": "xulq-atvor",
    "испытание": "sinov",
    "выбор": "tanlov",
    "сообщество": "hamjamiyat",
    "соревнование": "musobaqa",
    "уверенность": "ishonch",
    "решение": "qaror",
    "развитие": "rivojlanish",
    "образование": "ta’lim",
    "окружающая среда": "atrof-muhit",
    "опыт": "tajriba",
    "цель": "maqsad",
    "привычка": "odat",
    "здоровье": "sog‘liq",
    "улучшение": "yaxshilanish",
    "знания": "bilim",
    "язык": "til",
    "память": "xotira",
    "возможность": "imkoniyat",
    "мнение": "fikr",
    "организация": "tashkilot",
    "выступление": "chiqish",
    "разрешение": "ruxsat",
    "население": "aholi",
    "отношения": "munosabatlar",
    "ответственность": "mas’uliyat",
    "успех": "muvaffaqiyat",
    "предложение": "taklif",
    "технология": "texnologiya",
    "традиция": "an’ana",
    "волонтёр": "ko‘ngilli",
    "достигать": "erishmoq",
    "избегать": "qochmoq",
    "сравнивать": "taqqoslamoq",
    "рассматривать": "ko‘rib chiqmoq",
    "развивать": "rivojlantirmoq",
    "поощрять": "rag‘batlantirmoq",
    "улучшать": "yaxshilamoq",
    "справляться": "uddalamoq",
    "готовить": "tayyorlamoq",
    "защищать": "himoya qilmoq",
    "осознавать": "anglamoq",
    "уменьшать": "kamaytirmoq",
    "требовать": "talab qilmoq",
    "поддерживать": "qo‘llab-quvvatlamoq",

    "анализ": "tahlil",
    "подход": "yondashuv",
    "предположение": "taxmin",
    "осведомлённость": "xabardorlik",
    "обстоятельство": "holat",
    "последствие": "oqibat",
    "вклад": "hissa",
    "спор": "bahs",
    "традиционный": "an’anaviy",
    "критерий": "mezon",
    "распределение": "taqsimot",
    "акцент": "urg‘u",
    "доказательство": "dalil",
    "расходы": "xarajatlar",
    "структура": "tuzilma",
    "основополагающий": "asosiy",
    "гипотеза": "gipoteza",
    "стимул": "rag‘bat",
    "неравенство": "tengsizlik",
    "инновация": "innovatsiya",
    "понимание": "tushuncha",
    "интерпретация": "talqin",
    "инвестиция": "sarmoya",
    "законодательство": "qonunchilik",
    "точка зрения": "nuqtayi nazar",
    "явление": "hodisa",
    "приоритет": "ustuvorlik",
    "процедура": "tartib",
    "пропорция": "nisbat",
    "правило": "qoida",
    "ресурс": "resurs",
    "стратегия": "strategiya",
    "устойчивый": "barqaror",
    "тенденция": "tendensiya",
    "достоверность": "ishonchlilik",
    "благополучие": "farovonlik",
    "приобретать": "egallamoq",
    "адаптироваться": "moslashmoq",
    "распределять": "taqsimlamoq",
    "предвидеть": "oldindan ko‘rmoq",
    "прояснять": "aniqlashtirmoq",
    "компенсировать": "qoplamoq",
    "сталкиваться": "duch kelmoq",
    "демонстрировать": "namoyish qilmoq",
    "создавать": "yaratmoq",
    "оценивать": "baholamoq",
    "осуществлять": "amalga oshirmoq",
    "поддерживать": "saqlab turmoq"
};


// ==========================================
// TRANSLATION ENGINE
// ==========================================

const originalTextNodes = new WeakMap();
const originalAttributes = new WeakMap();

function translateText(value) {
    const trimmed = value.trim();

    if (!trimmed) return value;

    let translated = translations[trimmed];

    if (!translated && currentLanguage === "uz") {
        translated = vocabularyTranslationsUz[trimmed];
    }

    if (!translated) {
        const questionMatch = trimmed.match(/^Вопрос (\d+) \/ (\d+)$/);

        if (questionMatch && currentLanguage === "uz") {
            translated = `Savol ${questionMatch[1]} / ${questionMatch[2]}`;
        }
    }

    if (!translated) return value;

    const start = value.match(/^\s*/)[0];
    const end = value.match(/\s*$/)[0];

    return start + translated + end;
}

function translateNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        if (!originalTextNodes.has(node)) {
            originalTextNodes.set(node, node.nodeValue);
        }

        const original = originalTextNodes.get(node);

        node.nodeValue =
            currentLanguage === "ru"
                ? original
                : translateText(original);
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
        const attributes = ["placeholder", "title", "aria-label"];

        attributes.forEach(attribute => {
            if (!node.hasAttribute(attribute)) return;

            let saved = originalAttributes.get(node);

            if (!saved) {
                saved = {};
                originalAttributes.set(node, saved);
            }

            if (!(attribute in saved)) {
                saved[attribute] = node.getAttribute(attribute);
            }

            const original = saved[attribute];

            node.setAttribute(
                attribute,
                currentLanguage === "ru"
                    ? original
                    : translateText(original)
            );
        });

        node.childNodes.forEach(translateNode);
    }
}

function applyLanguage() {
    document.documentElement.lang =
        currentLanguage === "uz" ? "uz" : "ru";

    translateNode(document.body);

    updateLanguageButtons();
    localStorage.setItem(I18N_STORAGE_KEY, currentLanguage);
}


// ==========================================
// LANGUAGE SWITCHER
// ==========================================

function createLanguageSwitcher() {
    const header = document.querySelector(".header-right");

    if (!header || document.getElementById("language-switcher")) {
        return;
    }

    const wrapper = document.createElement("div");

    wrapper.id = "language-switcher";

    wrapper.innerHTML = `
        <span class="language-label">🌐</span>

        <button type="button" id="language-ru"
            onclick="setLanguage('ru')">
            🇷🇺 RU
        </button>

        <button type="button" id="language-uz"
            onclick="setLanguage('uz')">
            🇺🇿 UZ
        </button>
    `;

    wrapper.style.cssText = `
        display:flex;
        align-items:center;
        gap:6px;
        margin-left:12px;
        padding:5px;
        border-radius:14px;
        background:#f0ebff;
    `;

    const style = document.createElement("style");

    style.textContent = `
        #language-switcher button {
            border:0;
            border-radius:10px;
            padding:9px 13px;
            background:transparent;
            color:#56369b;
            font-weight:700;
            cursor:pointer;
            transition:all .2s ease;
        }

        #language-switcher button.active {
            background:linear-gradient(135deg,#8b5cf6,#6235d9);
            color:white;
            box-shadow:0 3px 10px rgba(98,53,217,.25);
        }

        #language-switcher button:hover {
            transform:translateY(-1px);
        }

        @media(max-width:600px) {
            #language-switcher {
                margin-left:5px;
            }

            #language-switcher button {
                padding:7px 9px;
                font-size:12px;
            }
        }
    `;

    document.head.appendChild(style);
    header.appendChild(wrapper);

    updateLanguageButtons();
}

function updateLanguageButtons() {
    const ru = document.getElementById("language-ru");
    const uz = document.getElementById("language-uz");

    if (!ru || !uz) return;

    ru.classList.toggle("active", currentLanguage === "ru");
    uz.classList.toggle("active", currentLanguage === "uz");
}

function setLanguage(language) {
    if (!["ru", "uz"].includes(language)) return;

    currentLanguage = language;

    applyLanguage();
}


// ==========================================
// TRANSLATE ALERTS AND CONFIRMATIONS
// ==========================================

const originalAlert = window.alert.bind(window);
const originalConfirm = window.confirm.bind(window);

window.alert = function(message) {
    originalAlert(
        currentLanguage === "uz"
            ? translateText(String(message))
            : message
    );
};

window.confirm = function(message) {
    return originalConfirm(
        currentLanguage === "uz"
            ? translateText(String(message))
            : message
    );
};


// ==========================================
// WATCH DYNAMIC CONTENT
// ==========================================

const languageObserver = new MutationObserver(records => {
    records.forEach(record => {
        if (record.type === "childList") {
            record.addedNodes.forEach(translateNode);
        }

        if (record.type === "characterData") {
            translateNode(record.target);
        }
    });
});

function startLanguageSystem() {
    createLanguageSwitcher();
    applyLanguage();

    languageObserver.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startLanguageSystem);
} else {
    startLanguageSystem();
}