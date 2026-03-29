const fs = require('fs');
const path = require('path');

// --- НАСТРОЙКА ПУТЕЙ ---
const publicDir = path.join(__dirname, 'public');
const dataDir = path.join(publicDir, 'data');
const templatesDir = path.join(__dirname, 'templates');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(templatesDir)) fs.mkdirSync(templatesDir, { recursive: true });

console.log('⚙️ Генерация базы данных DietHolesteric...');

// ==========================================
// 1. КОНФИГУРАЦИЯ (ЦЕЛИ)
// ==========================================
let dashboardConfig = {
    macros: { cal: 2500, prot: "160г", fat: "75г", carb: "290г" },
    medicalRules: [
        { id: 1, title: "Правило Сладкого", desc: "Только ПОСЛЕ тренировки или утром. Не мешать с жирами." },
        { id: 2, title: "Рыба", desc: "Минимум 3 раза в неделю (Снижаем триглицериды)." },
        { id: 3, title: "Запрет", desc: "Никаких трансжиров, маргарина и магазинных соусов." }
    ]
};

// ==========================================
// 2. РЕЦЕПТЫ (ПОЛНАЯ БАЗА)
// ==========================================
let recipesData = [
    // --- ГОРЯЧИЕ БЛЮДА ---
    {
        id: "wok_beef",
        title: "Вок с Говядиной и Соба",
        tags: ["Пост-трен", "Азия", "Неделя 1"],
        time: "20 мин",
        cals: 650,
        sections: [
            { title: "Основа", items: [{ name: "Гречневая лапша (Soba)", amount: 70, unit: "г" }, { name: "Говядина постная", amount: 150, unit: "г" }, { name: "Стручковая фасоль", amount: 100, unit: "г" }, { name: "Перец болгарский", amount: 0.5, unit: "шт" }] },
            { title: "Соус (Смешать)", items: [{ name: "Соевый соус", amount: 45, unit: "мл" }, { name: "Мед", amount: 5, unit: "г" }, { name: "Вода", amount: 30, unit: "мл" }, { name: "Крахмал", amount: 3, unit: "г" }] },
            { title: "Специи", items: [{ name: "Имбирь свежий", amount: 10, unit: "г" }, { name: "Чеснок", amount: 2, unit: "зуб" }, { name: "Чили", amount: 1, unit: "по вкусу" }] }
        ],
        steps: [
            { title: "Мясо", desc: "Нарежь говядину тонкими полосками. Лапшу отвари и промой холодной водой." },
            { title: "Wok", desc: "Раскали сковороду. Обжарь мясо (1 мин). Добавь овощи (2 мин)." },
            { title: "Финал", desc: "Влей соус, добавь лапшу, прогрей 30 сек." }
        ],
        medical: "Гречневая лапша имеет низкий ГИ.",
        chefSecret: "Жарь мясо порциями, чтобы не тушилось."
    },
    {
        id: "buckwheat_creamy",
        title: "Гречотто с Курицей (One Pot)",
        tags: ["Ужин", "Гречка", "Очень вкусно"],
        time: "25 мин",
        cals: 450,
        sections: [
            { title: "Основа", items: [{ name: "Куриное филе", amount: 150, unit: "г" }, { name: "Гречка (сухая)", amount: 70, unit: "г" }, { name: "Лук", amount: 0.5, unit: "шт" }, { name: "Морковь", amount: 0.5, unit: "шт" }] },
            { title: "Соус", items: [{ name: "Сметана 15%", amount: 40, unit: "г" }, { name: "Вода (кипяток)", amount: 150, unit: "мл" }] }
        ],
        steps: [
            { title: "Зажарка", desc: "Обжарь курицу и овощи на сильном огне." },
            { title: "Засыпка", desc: "Всыпь сухую гречку к мясу, перемешай с маслом." },
            { title: "Томление", desc: "Залей водой со сметаной, туши 20 мин под крышкой." }
        ],
        medical: "Гречка восстанавливает железо.",
        chefSecret: "Брось кусочек сливочного масла в конце."
    },
    {
        id: "tuna_wok",
        title: "Вок с Тунцом (Средиземноморский)",
        tags: ["Рыба", "Экспресс", "Неделя 3"],
        time: "15 мин",
        cals: 450,
        sections: [
            { title: "Основа", items: [{ name: "Паста/Лапша", amount: 70, unit: "г" }, { name: "Тунец консерв.", amount: 1, unit: "банка" }] },
            { title: "Овощи", items: [{ name: "Лук", amount: 0.5, unit: "шт" }, { name: "Перец", amount: 100, unit: "г" }, { name: "Оливки", amount: 5, unit: "шт" }] },
            { title: "Соус", items: [{ name: "Томатная паста", amount: 1, unit: "ст.л." }, { name: "Соевый соус", amount: 20, unit: "мл" }, { name: "Вода от пасты", amount: 50, unit: "мл" }] }
        ],
        steps: [
            { title: "Лапша", desc: "Свари пасту." },
            { title: "Зажарка", desc: "Обжарь овощи с томатной пастой." },
            { title: "Финал", desc: "Добавь тунца и пасту, прогрей 1 мин. Не пересуши!" }
        ],
        medical: "Тунец богат селеном.",
        chefSecret: "Оливки дают ресторанный вкус."
    },
    {
        id: "pad_thai_fit",
        title: "Пад Тай (Фитнес)",
        tags: ["Азия", "Вок", "Вкусно"],
        time: "25 мин",
        cals: 580,
        sections: [
            { title: "Основа", items: [{ name: "Рисовая лапша", amount: 60, unit: "г" }, { name: "Куриное филе", amount: 150, unit: "г" }, { name: "Яйцо", amount: 1, unit: "шт" }] },
            { title: "Соус", items: [{ name: "Соевый соус", amount: 30, unit: "мл" }, { name: "Лайм", amount: 1, unit: "шт" }, { name: "Арахисовая паста", amount: 10, unit: "г" }] },
            { title: "Топпинг", items: [{ name: "Арахис жареный", amount: 10, unit: "г" }, { name: "Лук зеленый", amount: 1, unit: "пучок" }] }
        ],
        steps: [
            { title: "Лапша", desc: "Замочи лапшу в теплой воде (не вари)." },
            { title: "Жарка", desc: "Обжарь курицу и яйцо." },
            { title: "Финиш", desc: "Кинь лапшу, залей соусом, жарь 2 мин до мягкости." }
        ],
        medical: "Без глютена.",
        chefSecret: "Лапша должна быть твердой перед жаркой."
    },
    {
        id: "chahohbili",
        title: "Чахохбили (Грузия)",
        tags: ["Ужин", "На 3 дня"],
        time: "45 мин",
        cals: 400,
        sections: [
            { title: "Основа", items: [{ name: "Куриные бедра", amount: 250, unit: "г" }, { name: "Лук", amount: 1, unit: "шт" }, { name: "Томаты в с/с", amount: 150, unit: "г" }] },
            { title: "Специи", items: [{ name: "Хмели-сунели", amount: 1, unit: "ч.л." }, { name: "Чеснок", amount: 2, unit: "зуб" }, { name: "Кинза", amount: 10, unit: "г" }] }
        ],
        steps: [
            { title: "Жарка", desc: "Обжарь курицу без масла. Добавь лук." },
            { title: "Тушение", desc: "Добавь томаты и специи. Туши 30 мин." },
            { title: "Финал", desc: "Добавь чеснок и кинзу в конце." }
        ],
        medical: "Диетическое рагу.",
        chefSecret: "Больше лука - гуще соус."
    },
    {
        id: "hearts_cream",
        title: "Сердечки в сметане",
        tags: ["Бюджет", "На работу"],
        time: "35 мин",
        cals: 350,
        sections: [
            { title: "Основа", items: [{ name: "Сердечки", amount: 250, unit: "г" }, { name: "Лук/Морковь", amount: 100, unit: "г" }] },
            { title: "Соус", items: [{ name: "Сметана 15%", amount: 40, unit: "г" }, { name: "Вода", amount: 50, unit: "мл" }] },
            { title: "Специи", items: [{ name: "Лавровый лист", amount: 1, unit: "шт" }, { name: "Соль", amount: 1, unit: "по вкусу" }] }
        ],
        steps: [{ title: "Приготовление", desc: "Очисти, обжарь с овощами, потуши в сметане." }],
        medical: "Коэнзим Q10.",
        chefSecret: "Идеально греется."
    },
    {
        id: "shawarma",
        title: "Шаурма Домашняя",
        tags: ["Обед", "Свежее"],
        time: "15 мин",
        cals: 550,
        sections: [
            { title: "База", items: [{ name: "Лаваш", amount: 0.5, unit: "лист" }, { name: "Курица готовая", amount: 120, unit: "г" }, { name: "Овощи", amount: 100, unit: "г" }] },
            { title: "Соус", items: [{ name: "Сметана", amount: 20, unit: "г" }, { name: "Горчица", amount: 5, unit: "г" }, { name: "Чеснок", amount: 1, unit: "щепотка" }] }
        ],
        steps: [{ title: "Сборка", desc: "Заверни и подсуши." }],
        medical: "Не греть в СВЧ!",
        chefSecret: "Сделай корочку."
    },
    {
        id: "kung_pao",
        title: "Курица Гунбао",
        tags: ["Азия", "Остро"],
        time: "20 мин",
        cals: 480,
        sections: [
            { title: "Основа", items: [{ name: "Филе", amount: 150, unit: "г" }, { name: "Арахис", amount: 20, unit: "г" }, { name: "Перец", amount: 0.5, unit: "шт" }] },
            { title: "Соус", items: [{ name: "Соевый", amount: 45, unit: "мл" }, { name: "Уксус", amount: 15, unit: "мл" }, { name: "Имбирь", amount: 5, unit: "г" }] }
        ],
        steps: [{ title: "Вок", desc: "Быстро обжарь всё, залей соусом." }],
        medical: "Метаболизм.",
        chefSecret: "Арахис нежареный."
    },
    {
        id: "stroganoff",
        title: "Бефстроганов",
        tags: ["Классика"],
        time: "25 мин",
        cals: 450,
        sections: [
            { title: "Основа", items: [{ name: "Говядина", amount: 150, unit: "г" }, { name: "Грибы", amount: 100, unit: "г" }, { name: "Огурец соленый", amount: 1, unit: "шт" }] },
            { title: "Соус", items: [{ name: "Сметана", amount: 50, unit: "г" }, { name: "Горчица", amount: 1, unit: "ч.л." }, { name: "Мука", amount: 0.5, unit: "ч.л." }] }
        ],
        steps: [
            { title: "Мясо", desc: "Быстро обжарь говядину. Убери." },
            { title: "Соус", desc: "Обжарь грибы, добавь огурец и сметанную смесь." },
            { title: "Финал", desc: "Верни мясо, туши 3 мин." }
        ],
        medical: "Греется отлично.",
        chefSecret: "Соленый огурец обязателен."
    },
    {
        id: "chili_con_carne",
        title: "Чили Кон Карне",
        tags: ["Batch Cook"],
        time: "40 мин",
        cals: 500,
        sections: [
            { title: "Основа", items: [{ name: "Фарш говяжий", amount: 200, unit: "г" }, { name: "Фасоль красная", amount: 200, unit: "г" }, { name: "Кукуруза", amount: 50, unit: "г" }, { name: "Томаты в с/с", amount: 200, unit: "г" }] },
            { title: "Специи", items: [{ name: "Зира (Кумин)", amount: 1, unit: "ч.л." }, { name: "Шоколад горький", amount: 5, unit: "г" }] }
        ],
        steps: [
            { title: "Основа", desc: "Обжарь фарш с зирой." },
            { title: "Тушение", desc: "Добавь овощи, туши 30 мин." },
            { title: "Секрет", desc: "Добавь шоколад в конце." }
        ],
        medical: "Фасоль выводит холестерин.",
        chefSecret: "Вкусно на 2-3 день."
    },
    {
        id: "meat_french",
        title: "Мясо по-французски",
        tags: ["Ужин"],
        time: "40 мин",
        cals: 450,
        sections: [
            { title: "Слои", items: [{ name: "Мясо", amount: 150, unit: "г" }, { name: "Грибы", amount: 100, unit: "г" }, { name: "Помидор", amount: 1, unit: "шт" }, { name: "Сыр", amount: 30, unit: "г" }] },
            { title: "Намазка", items: [{ name: "Йогурт/Сметана", amount: 30, unit: "г" }, { name: "Горчица", amount: 0.5, unit: "ч.л." }] }
        ],
        steps: [{ title: "Печь", desc: "Слоями в духовку на 30 мин." }],
        medical: "Без майонеза.",
        chefSecret: "Соли грибы отдельно."
    },
    // --- ЗАВТРАКИ/БАЗА ---
    {
        id: "oat_pancake",
        title: "Овсяноблин",
        tags: ["Завтрак"],
        time: "10 мин",
        cals: 450,
        sections: [{ title: "Тесто", items: [{ name: "Овсянка", amount: 40, unit: "г" }, { name: "Яйца", amount: 2, unit: "шт" }, { name: "Молоко", amount: 30, unit: "мл" }] }, { title: "Начинка", items: [{ name: "Сыр", amount: 20, unit: "г" }] }],
        steps: [{ title: "Жарка", desc: "Смешай, пожарь, добавь сыр." }],
        medical: "Сложные угли.",
        chefSecret: "Разрыхлитель для пышности."
    },
    {
        id: "pasta_tuna_express",
        title: "Паста с Тунцом (10 мин)",
        tags: ["Обед"],
        time: "12 мин",
        cals: 550,
        sections: [{ title: "Основа", items: [{ name: "Макароны", amount: 80, unit: "г" }, { name: "Тунец", amount: 1, unit: "банка" }] }, { title: "Соус", items: [{ name: "Сметана", amount: 20, unit: "г" }, { name: "Кукуруза", amount: 30, unit: "г" }] }],
        steps: [{ title: "Микс", desc: "Свари и смешай." }],
        medical: "Быстрый белок.",
        chefSecret: "Лимон."
    },
    {
        id: "mackerel",
        title: "Скумбрия в фольге",
        tags: ["Ужин"],
        time: "30 мин",
        cals: 350,
        sections: [{ title: "Основа", items: [{ name: "Скумбрия", amount: 1, unit: "шт" }, { name: "Лимон", amount: 0.5, unit: "шт" }] }, { title: "Маринад", items: [{ name: "Горчица", amount: 1, unit: "ч.л." }] }],
        steps: [{ title: "Печь", desc: "В фольгу на 25 мин." }],
        medical: "Омега-3.",
        chefSecret: "Горчица убирает запах."
    },
    {
        id: "fish_polish",
        title: "Рыба По-польски",
        tags: ["Рыба"],
        time: "30 мин",
        cals: 350,
        sections: [{ title: "Основа", items: [{ name: "Белая рыба", amount: 200, unit: "г" }, { name: "Овощи", amount: 200, unit: "г" }] }, { title: "Заливка", items: [{ name: "Томатная паста", amount: 1, unit: "ст.л." }] }],
        steps: [{ title: "Тушение", desc: "Рыба под шубой из овощей." }],
        medical: "Легкий ужин.",
        chefSecret: "Вкусно холодным."
    },
    {
        id: "fish_cakes",
        title: "Фиш-кейки",
        tags: ["Рыба"],
        time: "15 мин",
        cals: 300,
        sections: [{ title: "Тесто", items: [{ name: "Тунец", amount: 1, unit: "банка" }, { name: "Овсянка", amount: 2, unit: "ст.л." }] }],
        steps: [{ title: "Жарка", desc: "Как оладьи." }],
        medical: "Протеин.",
        chefSecret: "Зелень."
    },
    {
        id: "teriyaki_orange",
        title: "Курица Терияки",
        tags: ["Азия"],
        time: "20 мин",
        cals: 550,
        sections: [{ title: "Основа", items: [{ name: "Курица", amount: 150, unit: "г" }, { name: "Апельсин сок", amount: 30, unit: "мл" }] }],
        steps: [{ title: "Глазурь", desc: "Выпари сок до густоты." }],
        medical: "Без сахара.",
        chefSecret: "Имбирь."
    },
    {
        id: "shrimp_glass",
        title: "Фунчоза с Креветками",
        tags: ["Азия"],
        time: "15 мин",
        cals: 450,
        sections: [{ title: "Основа", items: [{ name: "Фунчоза", amount: 40, unit: "г" }, { name: "Креветки", amount: 150, unit: "г" }] }],
        steps: [{ title: "Вок", desc: "Быстро обжарь." }],
        medical: "Легко.",
        chefSecret: "Кунжутное масло."
    },
    {
        id: "oyakodon",
        title: "Оякодон",
        tags: ["Япония"],
        time: "15 мин",
        cals: 500,
        sections: [{ title: "Основа", items: [{ name: "Курица", amount: 150, unit: "г" }, { name: "Яйца", amount: 2, unit: "шт" }, { name: "Рис", amount: 150, unit: "г" }] }, { title: "Бульон", items: [{ name: "Соевый соус", amount: 45, unit: "мл" }] }],
        steps: [{ title: "Омлет", desc: "Потуши курицу в соусе, залей яйцом." }],
        medical: "Варка без масла.",
        chefSecret: "Яйцо всмятку."
    }
];

// ==========================================
// 3. ПЛАН НЕДЕЛЬ
// ==========================================
let weeksData = {
    1: { title: "Неделя 1: Стабильность", desc: "Блюда, которые легко греть на работе.", focus: "Удобство" },
    2: { title: "Неделя 2: Азия & Овощи", desc: "Рис и рагу — вкусно и полезно.", focus: "Вкус" },
    3: { title: "Неделя 3: Сытный режим", desc: "Бефстроганов и паста.", focus: "Гемоглобин" },
    4: { title: "Неделя 4: Ленивая", desc: "Готовим на 2 дня вперед.", focus: "Время" }
};

let menuPlan = {
    1: [
        { day: "ПН (Трен)", meals: ["Овсянка", "Вок с Говядиной", "Зефир", "Чахохбили"] },
        { day: "ВТ (Работа)", meals: ["Яичница", "Чахохбили (Греем)", "Творог", "Сердечки в сметане"] },
        { day: "СР (Кардио)", meals: ["Сырники", "Сердечки (Греем)", "Фрукт", "Паста с Тунцом"] },
        { day: "ЧТ (Трен)", meals: ["Овсяноблин", "Гречотто с курицей", "Мармелад", "Шаурма"] },
        { day: "ПТ (Работа)", meals: ["Ленивая овсянка", "Гречотто (Греем)", "Орехи", "Скумбрия"] },
        { day: "СБ (Актив)", meals: ["Авокадо-тост", "Фитнес-Бургер", "Сорбет", "Салат с тунцом"] },
        { day: "ВС (Отдых)", meals: ["Блины", "Шашлык", "Шоколад", "Овощной салат"] }
    ],
    // Дублируем для примера, в реальности тут будут другие дни
    2: [
        { day: "ПН (Трен)", meals: ["Омлет", "Курица Гунбао", "Зефир", "Оякодон"] },
        { day: "ВТ (Работа)", meals: ["Сэндвич", "Гунбао (Греем)", "Йогурт", "Рыба"] },
        // ... (остальные дни)
    ]
};
menuPlan[2] = menuPlan[1];
menuPlan[3] = menuPlan[1];
menuPlan[4] = menuPlan[1];

// ==========================================
// 4. ПОКУПКИ
// ==========================================
let shoppingList = {
    base: [
        { category: "Крупы", items: [{ name: "Овсянка", price: 1.50 }, { name: "Рис Басмати", price: 2.50 }, { name: "Гречка", price: 2.00 }] },
        { category: "Масла/Специи", items: [{ name: "Масло оливковое", price: 8.00 }, { name: "Соевый соус", price: 3.50 }] }
    ],
    week1: [
        { category: "Мясо/Рыба", items: [{ name: "Куриные бедра (1.2кг)", price: 6.50 }, { name: "Говядина (600г)", price: 6.00 }, { name: "Сердечки", price: 3.50 }] },
        { category: "Овощи", items: [{ name: "Лук/Морковь", price: 2.00 }, { name: "Перец", price: 2.00 }, { name: "Зелень", price: 1.50 }] }
    ]
};
shoppingList.week2 = shoppingList.week1;
shoppingList.week3 = shoppingList.week1;
shoppingList.week4 = shoppingList.week1;

// ==========================================
// 5. ЗАГРУЗКА ШАБЛОНОВ ИЗ ПАПКИ TEMPLATES
// ==========================================
console.log('📂 Поиск пользовательских шаблонов в /templates...');

if (fs.existsSync(templatesDir)) {
    const files = fs.readdirSync(templatesDir).filter(file => file.endsWith('.json'));

    files.forEach(file => {
        try {
            const filePath = path.join(templatesDir, file);
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            console.log(`   📄 Обработка шаблона: ${file}`);

            // 1. Рецепты (recipes)
            if (content.recipes && Array.isArray(content.recipes)) {
                console.log(`      + Добавлено ${content.recipes.length} рецептов`);
                recipesData = [...recipesData, ...content.recipes];
            }

            // 2. Меню (menuPlan)
            if (content.menuPlan) {
                console.log(`      + Обновлен план меню`);
                // Слияние объектов меню (недель)
                menuPlan = { ...menuPlan, ...content.menuPlan };
            }

             // 3. Описание недель (weeksData)
             if (content.weeksData) {
                console.log(`      + Обновлены описания недель`);
                weeksData = { ...weeksData, ...content.weeksData };
            }

            // 4. Покупки (shoppingList)
            if (content.shoppingList) {
                console.log(`      + Обновлен список покупок`);
                shoppingList = { ...shoppingList, ...content.shoppingList };
            }

            // 5. Дашборд (dashboardConfig) - если нужно переопределить настройки
            if (content.dashboardConfig) {
                 console.log(`      + Обновлен конфиг дашборда`);
                 dashboardConfig = { ...dashboardConfig, ...content.dashboardConfig };
            }

        } catch (err) {
            console.error(`   ❌ Ошибка чтения файла ${file}:`, err.message);
        }
    });
} else {
    console.log('   (Папка templates пуста или не существует)');
}


// ==========================================
// ЗАПИСЬ
// ==========================================
fs.writeFileSync(path.join(dataDir, 'dashboard.json'), JSON.stringify(dashboardConfig, null, 2));
fs.writeFileSync(path.join(dataDir, 'recipes.json'), JSON.stringify(recipesData, null, 2));
fs.writeFileSync(path.join(dataDir, 'weeks.json'), JSON.stringify(weeksData, null, 2));
fs.writeFileSync(path.join(dataDir, 'menu_plan.json'), JSON.stringify(menuPlan, null, 2));
fs.writeFileSync(path.join(dataDir, 'shopping.json'), JSON.stringify(shoppingList, null, 2));

console.log('✅ Данные успешно сгенерированы в public/data/!');
