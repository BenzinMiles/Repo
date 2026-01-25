import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Создаем структуру папок (Vite использует папку public для статики)
const publicDir = path.join(__dirname, 'public');
const dataDir = path.join(publicDir, 'data');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

console.log('📂 Папка public/data готова.');

// --- 1. DASHBOARD CONFIG ---
const dashboardConfig = {
    macros: { cal: 2500, prot: "160г", fat: "75г", carb: "290г" },
    medicalRules: [
        { id: 1, title: "Правило Сладкого", desc: "Только ПОСЛЕ тренировки или утром. Не мешать с жирами." },
        { id: 2, title: "Рыба", desc: "Минимум 3 раза в неделю (Омега-3 для снижения триглицеридов)." },
        { id: 3, title: "Трансжиры", desc: "Строго исключить маргарин, фритюр и магазинный майонез." }
    ]
};

// --- 2. НЕДЕЛИ ---
const weeksData = {
    1: { title: "Неделя 1: Стабильность", desc: "Вторник и Четверг — блюда, которые легко греть на работе.", focus: "Удобство" },
    2: { title: "Неделя 2: Азия & Овощи", desc: "Рис и рагу — лучшие друзья контейнеров. Яркие вкусы.", focus: "Вкус" },
    3: { title: "Неделя 3: Сытный режим", desc: "Бефстроганов и паста. Упор на гемоглобин.", focus: "Гемоглобин" },
    4: { title: "Неделя 4: Ленивая", desc: "Одно блюдо на два дня (Чили Кон Карне). Экономим время.", focus: "Время" }
};

// --- 3. МЕНЮ ---
const menuPlan = {
    1: [
        { day: "ПН (Трен)", meals: ["Овсянка", "Вок с Говядиной", "Зефир", "Чахохбили"] },
        { day: "ВТ (Работа)", meals: ["Яичница", "Чахохбили (Греется отлично)", "Творог", "Сердечки в сметане"] },
        { day: "СР (Кардио)", meals: ["Сырники", "Сердечки в сметане", "Фрукт", "Паста с Тунцом"] },
        { day: "ЧТ (Трен)", meals: ["Овсяноблин", "Вок с Говядиной", "Мармелад", "Шаурма (Дома свежая)"] },
        { day: "ПТ (Работа)", meals: ["Ленивая овсянка", "Котлеты", "Орехи", "Скумбрия"] },
        { day: "СБ (Актив)", meals: ["Авокадо-тост", "Фитнес-Бургер", "Сорбет", "Салат с тунцом"] },
        { day: "ВС (Отдых)", meals: ["Блины", "Шашлык/Гриль", "Шоколад", "Овощной салат"] },
    ],
    2: [
        { day: "ПН (Трен)", meals: ["Омлет", "Курица Гунбао", "Зефир", "Оякодон"] },
        { day: "ВТ (Работа)", meals: ["Сэндвич", "Гунбао (Рис пропитался)", "Йогурт", "Рыба 'По-польски'"] },
        { day: "СР (Кардио)", meals: ["Каша", "Рыба 'По-польски' (Холодная ок)", "Орехи", "Оякодон"] },
        { day: "ЧТ (Трен)", meals: ["Сырники", "Пибимпап (Греется норм)", "Пастила", "Фунчоза с курицей"] },
        { day: "ПТ (Работа)", meals: ["Тосты", "Пибимпап", "Батончик", "Курица в аэрогриле"] },
        { day: "СБ (Выход)", meals: ["Шакшука", "Курица + Овощи", "Фрукты", "Скумбрия"] },
        { day: "ВС (Заготовка)", meals: ["Оладьи", "Гречка по-купечески", "Шоколад", "Греческий салат"] },
    ],
    3: [
        { day: "ПН (Трен)", meals: ["Тост", "Бефстроганов", "Мармелад", "Скумбрия"] },
        { day: "ВТ (Работа)", meals: ["Яичница", "Бефстроганов (Идеально греется)", "Орехи", "Фиш-кейки"] },
        { day: "СР (Кардио)", meals: ["Творог", "Фиш-кейки", "Яблоко", "Салат Нисуаз"] },
        { day: "ЧТ (Трен)", meals: ["Овсянка", "Паста Болоньезе", "Зефир", "Кальмары"] },
        { day: "ПТ (Работа)", meals: ["Скрэмбл", "Паста Болоньезе", "Кефир", "Вок с курицей"] },
        { day: "СБ (Актив)", meals: ["Бургер рыбный", "Вок", "Сорбет", "Креветки"] },
        { day: "ВС (Отдых)", meals: ["Сырники", "Плов с мидиями", "Шоколад", "Запеканка"] },
    ],
    4: [
        { day: "ПН (Трен)", meals: ["Овсяноблин", "Чили Кон Карне", "Сладкое", "Стейк рыбы"] },
        { day: "ВТ (Работа)", meals: ["Яичница", "Чили Кон Карне (Топ разогрев)", "Орехи", "Тыкв. суп"] },
        { day: "СР (Кардио)", meals: ["Каша", "Мясо по-французски", "Фрукт", "Селедка"] },
        { day: "ЧТ (Трен)", meals: ["Сырники", "Мясо по-французски", "Зефир", "Курица"] },
        { day: "ПТ (Работа)", meals: ["Тосты", "Тако с фасолью", "Йогурт", "Шаверма"] },
        { day: "СБ (Актив)", meals: ["Яйца", "Пицца", "Мороженое", "Салат"] },
        { day: "ВС (Отдых)", meals: ["Блины", "Шашлык", "Шоколад", "Легкий ужин"] },
    ]
};

// --- 4. ПОКУПКИ ---
const shoppingList = {
    base: [
        { category: "Крупы", items: [
            { name: "Овсянка / Геркулес", price: 1.50 },
            { name: "Рис Басмати (1 кг)", price: 2.50 },
            { name: "Макароны тв. сортов", price: 2.00 },
            { name: "Гречка (1 кг)", price: 2.00 },
            { name: "Лапша Соба/Удон", price: 1.50 }
        ]},
        { category: "Масла и Соусы", items: [
            { name: "Оливковое масло", price: 8.00 },
            { name: "Соевый соус (без сахара)", price: 3.50 },
            { name: "Томатная паста", price: 1.20 },
            { name: "Горчица", price: 1.00 }
        ]},
        { category: "Молочка и Яйца", items: [
            { name: "Яйца (20 шт)", price: 5.00 },
            { name: "Творог 2-5% (1 кг)", price: 6.00 },
            { name: "Сметана 15%", price: 1.80 }
        ]},
        { category: "Специи (Проверь дома)", items: [
            { name: "Хмели-сунели, Карри, Паприка", price: 2.00 },
            { name: "Чеснок сушеный, Перец", price: 1.50 },
            { name: "Кунжут, Зира", price: 1.50 }
        ]}
    ],
    week1: [
        { category: "Мясо и Рыба", items: [
            { name: "Куриные бедра (1.2кг)", price: 6.50 },
            { name: "Говядина постная (600г)", price: 6.00 },
            { name: "Скумбрия (1 шт)", price: 2.50 },
            { name: "Сердечки (500г)", price: 3.50 },
            { name: "Тунец (1 банка)", price: 2.00 }
        ]},
        { category: "Овощи и Фрукты", items: [
            { name: "Лук, Морковь, Чеснок", price: 2.00 },
            { name: "Перец болгарский (2 шт)", price: 2.00 },
            { name: "Фасоль стручковая (зам)", price: 1.50 },
            { name: "Зелень (Кинза/Укроп)", price: 1.50 },
            { name: "Лаваш / Булки", price: 2.00 },
            { name: "Фрукты на перекус", price: 4.00 }
        ]}
    ],
    week2: [
        { category: "Мясо и Рыба", items: [
            { name: "Куриное филе (1кг)", price: 7.50 },
            { name: "Фарш говяжий (500г)", price: 4.50 },
            { name: "Рыба белая (Минтай 500г)", price: 3.50 },
            { name: "Скумбрия", price: 2.50 }
        ]},
        { category: "Овощи и Азия", items: [
            { name: "Арахис, Кунжут", price: 2.00 },
            { name: "Имбирь свежий", price: 0.50 },
            { name: "Перец, Шпинат, Лук", price: 4.00 },
            { name: "Фунчоза", price: 1.50 },
            { name: "Фрукты", price: 4.00 }
        ]}
    ],
    week3: [
        { category: "Мясо и Рыба", items: [
            { name: "Говядина вырезка (600г)", price: 8.50 },
            { name: "Фарш (400г)", price: 3.80 },
            { name: "Тунец (2 банки)", price: 4.00 },
            { name: "Кальмары / Креветки", price: 5.00 },
            { name: "Скумбрия", price: 2.50 }
        ]},
        { category: "Остальное", items: [
            { name: "Шампиньоны (300г)", price: 1.80 },
            { name: "Огурцы соленые", price: 1.50 },
            { name: "Сливки 10%", price: 1.20 },
            { name: "Овощи салатные", price: 3.00 }
        ]}
    ],
    week4: [
        { category: "Мясо и Рыба", items: [
            { name: "Фарш говяжий (800г)", price: 7.50 },
            { name: "Филе куриное (300г)", price: 2.50 },
            { name: "Сельдь / Красная рыба", price: 5.00 }
        ]},
        { category: "Овощи и Бакалея", items: [
            { name: "Фасоль красная (2 банки)", price: 2.50 },
            { name: "Кукуруза (1 банка)", price: 1.20 },
            { name: "Шампиньоны, Помидоры", price: 3.50 },
            { name: "Сыр легкий", price: 2.50 },
            { name: "Шоколад горький", price: 1.50 }
        ]}
    ]
};

// --- 5. РЕЦЕПТЫ ---
const recipesData = [
    {
        id: "wok_beef",
        title: "Вок с Говядиной и Лапшой Соба",
        tags: ["Пост-трен", "Азия", "Неделя 1"],
        time: "20 мин",
        prepTime: "10 мин",
        cookTime: "10 мин",
        cals: 650,
        sections: [
            { title: "Основа", items: [{ name: "Гречневая лапша (Soba)", amount: 70, unit: "г" }, { name: "Говядина постная", amount: 150, unit: "г" }, { name: "Стручковая фасоль", amount: 100, unit: "г" }, { name: "Перец болгарский", amount: 0.5, unit: "шт" }] },
            { title: "Соус", items: [{ name: "Соевый соус", amount: 45, unit: "мл" }, { name: "Мед", amount: 5, unit: "г" }, { name: "Вода", amount: 30, unit: "мл" }, { name: "Крахмал", amount: 3, unit: "г" }] },
            { title: "Специи", items: [{ name: "Имбирь", amount: 10, unit: "г" }, { name: "Чеснок", amount: 2, unit: "зуб" }, { name: "Чили", amount: 1, unit: "по вкусу" }] }
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
        id: "chahohbili",
        title: "Чахохбили (Грузия)",
        tags: ["Ужин", "На 3 дня", "Неделя 1"],
        time: "45 мин",
        prepTime: "15 мин",
        cookTime: "30 мин",
        cals: 400,
        sections: [
            { title: "Основа", items: [{ name: "Куриные бедра", amount: 250, unit: "г" }, { name: "Лук репчатый", amount: 1, unit: "шт" }, { name: "Томаты в с/с", amount: 150, unit: "г" }] },
            { title: "Специи", items: [{ name: "Хмели-сунели", amount: 1, unit: "ч.л." }, { name: "Чеснок", amount: 2, unit: "зуб" }, { name: "Кинза", amount: 10, unit: "г" }] }
        ],
        steps: [
            { title: "Жарка", desc: "Обжарь курицу без масла. Добавь лук." },
            { title: "Томление", desc: "Добавь томаты и специи. Туши 30 мин." },
            { title: "Финал", desc: "Добавь чеснок и кинзу в конце." }
        ],
        medical: "Белок без лишнего жира.",
        chefSecret: "На второй день вкуснее."
    },
    {
        id: "hearts_cream",
        title: "Сердечки в сметане",
        tags: ["Бюджет", "Неделя 1"],
        time: "35 мин",
        prepTime: "10 мин",
        cookTime: "25 мин",
        cals: 350,
        sections: [
            { title: "Основа", items: [{ name: "Сердечки куриные", amount: 250, unit: "г" }, { name: "Лук", amount: 0.5, unit: "шт" }, { name: "Морковь", amount: 0.5, unit: "шт" }] },
            { title: "Соус", items: [{ name: "Сметана 15%", amount: 40, unit: "г" }, { name: "Вода", amount: 50, unit: "мл" }] },
            { title: "Специи", items: [{ name: "Лавровый лист", amount: 1, unit: "шт" }, { name: "Соль/Перец", amount: 1, unit: "по вкусу" }] }
        ],
        steps: [
            { title: "Подготовка", desc: "Очисти сердечки от жира." },
            { title: "Жарка", desc: "Обжарь овощи, добавь сердечки." },
            { title: "Тушение", desc: "Добавь сметану и воду, туши 25 мин." }
        ],
        medical: "Коэнзим Q10 полезен для сердца.",
        chefSecret: "Морковь дает сладость."
    },
    {
        id: "buckwheat_creamy",
        title: "Гречотто с Курицей (One Pot)",
        tags: ["Ужин", "Гречка", "Очень вкусно"],
        time: "25 мин",
        prepTime: "5 мин",
        cookTime: "20 мин",
        cals: 450,
        sections: [
            { title: "Основа", items: [{ name: "Куриное филе", amount: 150, unit: "г" }, { name: "Гречка (сухая)", amount: 70, unit: "г" }, { name: "Лук", amount: 0.5, unit: "шт" }, { name: "Морковь", amount: 0.5, unit: "шт" }] },
            { title: "Соус", items: [{ name: "Сметана 15%", amount: 40, unit: "г" }, { name: "Вода", amount: 150, unit: "мл" }] }
        ],
        steps: [
            { title: "Зажарка", desc: "Обжарь курицу и овощи." },
            { title: "Засыпка", desc: "Всыпь сухую гречку к мясу." },
            { title: "Томление", desc: "Залей водой со сметаной, туши 20 мин под крышкой." }
        ],
        medical: "Гречка восстанавливает железо.",
        chefSecret: "Брось кусочек масла в конце."
    },
    {
        id: "tuna_wok",
        title: "Вок с Тунцом",
        tags: ["Рыба", "Экспресс", "Неделя 3"],
        time: "15 мин",
        prepTime: "5 мин",
        cookTime: "10 мин",
        cals: 450,
        sections: [
            { title: "Основа", items: [{ name: "Паста/Лапша", amount: 70, unit: "г" }, { name: "Тунец консерв.", amount: 1, unit: "банка" }] },
            { title: "Овощи", items: [{ name: "Лук", amount: 0.5, unit: "шт" }, { name: "Перец", amount: 100, unit: "г" }, { name: "Оливки", amount: 5, unit: "шт" }] },
            { title: "Соус", items: [{ name: "Томатная паста", amount: 1, unit: "ст.л." }, { name: "Соевый соус", amount: 20, unit: "мл" }] }
        ],
        steps: [
            { title: "Лапша", desc: "Свари пасту." },
            { title: "Зажарка", desc: "Обжарь овощи с томатной пастой." },
            { title: "Финал", desc: "Добавь тунца и пасту, прогрей 1 мин." }
        ],
        medical: "Тунец богат селеном.",
        chefSecret: "Оливки дают ресторанный вкус."
    },
    {
        id: "shawarma",
        title: "Шаурма Домашняя",
        tags: ["Обед", "Свежее", "Неделя 1"],
        time: "15 мин",
        prepTime: "10 мин",
        cookTime: "5 мин",
        cals: 550,
        sections: [
            { title: "База", items: [{ name: "Лаваш", amount: 0.5, unit: "лист" }, { name: "Курица готовая", amount: 120, unit: "г" }, { name: "Овощи", amount: 100, unit: "г" }] },
            { title: "Соус", items: [{ name: "Сметана", amount: 20, unit: "г" }, { name: "Горчица", amount: 5, unit: "г" }, { name: "Чеснок", amount: 1, unit: "щепотка" }] }
        ],
        steps: [
            { title: "Сборка", desc: "Намажь соус, выложи начинку, сверни." },
            { title: "Хруст", desc: "Подсуши на сковороде." }
        ],
        medical: "Не греть в микроволновке!",
        chefSecret: "Овощи вниз, мясо сверху."
    },
    {
        id: "stroganoff",
        title: "Бефстроганов (ЗОЖ)",
        tags: ["Классика", "Неделя 3"],
        time: "25 мин",
        prepTime: "10 мин",
        cookTime: "15 мин",
        cals: 450,
        sections: [
            { title: "Основа", items: [{ name: "Говядина вырезка", amount: 150, unit: "г" }, { name: "Шампиньоны", amount: 100, unit: "г" }, { name: "Огурец соленый", amount: 1, unit: "шт" }] },
            { title: "Соус", items: [{ name: "Сметана 10%", amount: 50, unit: "г" }, { name: "Горчица", amount: 1, unit: "ч.л." }, { name: "Мука", amount: 0.5, unit: "ч.л." }] }
        ],
        steps: [
            { title: "Мясо", desc: "Быстро обжарь говядину. Убери." },
            { title: "Соус", desc: "Обжарь грибы, добавь огурец и сметанную смесь." },
            { title: "Финал", desc: "Верни мясо, туши 3 мин." }
        ],
        medical: "Идеально греется.",
        chefSecret: "Соленый огурец обязателен."
    },
    {
        id: "chili_con_carne",
        title: "Чили Кон Карне",
        tags: ["Batch Cook", "Неделя 4"],
        time: "40 мин",
        prepTime: "10 мин",
        cookTime: "30 мин",
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
        tags: ["Ужин", "Неделя 4"],
        time: "40 мин",
        prepTime: "10 мин",
        cookTime: "30 мин",
        cals: 450,
        sections: [
            { title: "Слои", items: [{ name: "Мясо", amount: 150, unit: "г" }, { name: "Грибы", amount: 100, unit: "г" }, { name: "Помидор", amount: 1, unit: "шт" }, { name: "Сыр", amount: 30, unit: "г" }] },
            { title: "Соус", items: [{ name: "Йогурт/Сметана", amount: 30, unit: "г" }, { name: "Горчица", amount: 0.5, unit: "ч.л." }] }
        ],
        steps: [
            { title: "Сборка", desc: "Мясо, соус, грибы, помидор, сыр." },
            { title: "Печь", desc: "180°C на 30 мин." }
        ],
        medical: "Без майонеза.",
        chefSecret: "Соли грибы отдельно."
    },
    // Добавляем базовые рецепты
    {
        id: "oat_pancake",
        title: "Овсяноблин",
        tags: ["Завтрак"],
        time: "10 мин",
        prepTime: "3 мин",
        cookTime: "7 мин",
        cals: 450,
        sections: [
            { title: "Тесто", items: [{ name: "Овсянка", amount: 40, unit: "г" }, { name: "Яйца", amount: 2, unit: "шт" }, { name: "Молоко", amount: 30, unit: "мл" }] },
            { title: "Начинка", items: [{ name: "Сыр", amount: 20, unit: "г" }] }
        ],
        steps: [{ title: "Жарка", desc: "Смешай, пожарь, добавь сыр." }],
        medical: "Сложные угли.",
        chefSecret: "Разрыхлитель для пышности."
    },
    {
        id: "pasta_tuna_express",
        title: "Паста с Тунцом (10 мин)",
        tags: ["Обед"],
        time: "12 мин",
        prepTime: "2 мин",
        cookTime: "10 мин",
        cals: 550,
        sections: [
            { title: "Основа", items: [{ name: "Макароны", amount: 80, unit: "г" }, { name: "Тунец", amount: 1, unit: "банка" }] },
            { title: "Соус", items: [{ name: "Сметана", amount: 20, unit: "г" }, { name: "Кукуруза", amount: 30, unit: "г" }] }
        ],
        steps: [{ title: "Микс", desc: "Свари пасту, смешай с тунцом и сметаной." }],
        medical: "Быстрый белок.",
        chefSecret: "Лимонная цедра."
    }
];

// 4. ЗАПИСЬ ФАЙЛОВ
fs.writeFileSync(path.join(dataDir, 'dashboard.json'), JSON.stringify(dashboardConfig, null, 2));
fs.writeFileSync(path.join(dataDir, 'weeks.json'), JSON.stringify(weeksData, null, 2));
fs.writeFileSync(path.join(dataDir, 'menu_plan.json'), JSON.stringify(menuPlan, null, 2));
fs.writeFileSync(path.join(dataDir, 'shopping.json'), JSON.stringify(shoppingList, null, 2));
fs.writeFileSync(path.join(dataDir, 'recipes.json'), JSON.stringify(recipesData, null, 2));

console.log('✅ Данные успешно сгенерированы в public/data/!');
