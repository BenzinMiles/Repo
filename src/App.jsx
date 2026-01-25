import React, { useState, useEffect } from 'react';
import {
    Activity, ShoppingCart, Calendar,
    TrendingUp, Flame, ChefHat,
    Clock, Sparkles, Users, Minus, Plus,
    Utensils, Loader2
} from 'lucide-react';

const App = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [servings, setServings] = useState(1);

    // Данные теперь приходят из JSON
    const [data, setData] = useState({
        recipes: [],
        weeks: {},
        menuPlan: {},
        shoppingList: {},
        dashboard: null
    });
    const [loading, setLoading] = useState(true);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    // Загрузка при старте
    useEffect(() => {
        const loadData = async () => {
            try {
                // В production (Android) fetch ищет в папке public
                const [resRecipes, resWeeks, resMenu, resShop, resDash] = await Promise.all([
                    fetch('./data/recipes.json'),
                    fetch('./data/weeks.json'),
                    fetch('./data/menu_plan.json'),
                    fetch('./data/shopping.json'),
                    fetch('./data/dashboard.json')
                ]);

                const recipes = await resRecipes.json();
                const weeks = await resWeeks.json();
                const menuPlan = await resMenu.json();
                const shoppingList = await resShop.json();
                const dashboard = await resDash.json();

                setData({ recipes, weeks, menuPlan, shoppingList, dashboard });
                if (recipes.length > 0) setSelectedRecipe(recipes[0]);
                setLoading(false);
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
                setLoading(false); // В реальном приложении тут нужен экран ошибки
            }
        };

        loadData();
    }, []);

    // Сброс порций при переключении рецепта
    useEffect(() => {
        setServings(1);
    }, [selectedRecipe]);

    // Калькуляторы
    const getCategoryTotal = (items) => items.reduce((acc, i) => acc + i.price * servings, 0).toFixed(2);

    const getWeekTotal = (weekData) => {
        if (!weekData) return "0.00";
        // Проверка структуры, так как она меняется (массив объектов {category, items})
        return weekData.reduce((acc, cat) => acc + parseFloat(getCategoryTotal(cat.items)), 0).toFixed(2);
    };

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-blue-400">
                <Loader2 className="w-12 h-12 animate-spin" />
                <span className="ml-4 text-xl font-bold">DietHolesteric...</span>
            </div>
        );
    }

    // --- RENDERERS ---

    const renderDashboard = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 p-4 rounded-xl border-l-4 border-blue-500 shadow-lg">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">Цель</span>
                    <TrendingUp className="w-5 h-5 text-blue-400"/>
                </div>
                <div className="text-2xl font-bold">{data.dashboard?.macros?.cal || 2500} ккал</div>
                <div className="text-xs text-gray-400 mt-1">
                    Б: {data.dashboard?.macros?.prot} | Ж: {data.dashboard?.macros?.fat} | У: {data.dashboard?.macros?.carb}
                </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl md:col-span-2 shadow-lg">
                <div className="text-gray-400 text-sm mb-3 font-bold uppercase">Правила Диеты</div>
                <div className="space-y-2">
                    {data.dashboard?.medicalRules?.map((r, i) => (
                        <div key={i} className="flex items-start gap-3 bg-gray-700/50 p-2 rounded">
                            <div className="min-w-[4px] h-full bg-orange-500 rounded"></div>
                            <div>
                                <span className="text-xs font-bold text-blue-300 block">{r.title}</span>
                                <span className="text-xs text-gray-300">{r.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderWeekPlan = () => (
        <div className="space-y-6">
            {/* Week Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {Object.keys(data.weeks).map(w => (
                    <button key={w} onClick={() => setSelectedWeek(Number(w))} className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${selectedWeek === Number(w) ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                        {data.weeks[w].title}
                    </button>
                ))}
            </div>

            {/* Plan Display */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
                <p className="text-gray-400 text-sm mb-4 italic">{data.weeks[selectedWeek]?.desc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.menuPlan[selectedWeek] ? data.menuPlan[selectedWeek].map((day, i) => (
                        <div key={i} className={`p-4 rounded-lg border ${day.day.includes('Работа') ? 'bg-blue-900/20 border-blue-500/30' : 'bg-gray-700/30 border-transparent'}`}>
                            <div className={`font-bold mb-3 flex items-center gap-2 ${day.day.includes('Трен') ? 'text-green-400' : 'text-gray-200'}`}>
                                {day.day}
                                {day.day.includes('Работа') && <Clock className="w-4 h-4 text-blue-400"/>}
                            </div>
                            <div className="space-y-2 text-sm text-gray-300">
                                {day.meals.map((m, j) => (
                                    <div key={j} className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                                        {m}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )) : <div className="text-gray-500">Нет данных</div>}
                </div>
            </div>
        </div>
    );

    const renderRecipes = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-150px)]">
            {/* List */}
            <div className="lg:col-span-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                {data.recipes.map(r => (
                    <div key={r.id} onClick={() => setSelectedRecipe(r)} className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedRecipe?.id === r.id ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-gray-800 border-transparent hover:bg-gray-700'}`}>
                        <div className="font-bold text-lg">{r.title}</div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {r.tags && r.tags.map(tag => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-black/20">{tag}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Details */}
            <div className="lg:col-span-2 overflow-y-auto pr-2 pb-10 custom-scrollbar">
                {selectedRecipe && (
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-2xl">
                        <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-700">
                            <div>
                                <h2 className="text-3xl font-bold mb-1">{selectedRecipe.title}</h2>
                                <div className="text-sm text-gray-400 flex items-center gap-4">
                                    <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-orange-500"/> {selectedRecipe.cals * servings} ккал</span>
                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-blue-500"/> {selectedRecipe.time}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-600">
                                <Users className="w-4 h-4 text-gray-400"/>
                                <button onClick={() => setServings(Math.max(1, servings - 1))} className="hover:text-blue-400"><Minus className="w-4 h-4"/></button>
                                <span className="font-bold w-4 text-center">{servings}</span>
                                <button onClick={() => setServings(servings + 1)} className="hover:text-blue-400"><Plus className="w-4 h-4"/></button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-6">
                                {selectedRecipe.sections && selectedRecipe.sections.map((section, idx) => (
                                    <div key={idx}>
                                        <h4 className="font-bold text-blue-400 mb-3 text-sm uppercase tracking-wider">{section.title}</h4>
                                        <ul className="space-y-2">
                                            {section.items.map((ing, i) => (
                                                <li key={i} className="flex justify-between text-sm bg-gray-700/30 p-2 rounded hover:bg-gray-700/50 transition">
                                                    <span className="text-gray-200">{ing.name}</span>
                                                    <span className="font-bold text-blue-100">{(ing.amount * servings).toFixed(ing.unit === 'шт' ? 1 : 0)} {ing.unit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <h4 className="font-bold text-orange-400 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                                    <ChefHat className="w-4 h-4"/> Приготовление
                                </h4>
                                <div className="space-y-6 relative border-l-2 border-gray-700 ml-2 pl-6">
                                    {selectedRecipe.steps && selectedRecipe.steps.map((s, i) => (
                                        <div key={i} className="relative">
                                            <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-gray-800 border-2 border-orange-500 text-xs flex items-center justify-center font-bold text-orange-500">{i + 1}</div>
                                            <div className="font-bold text-gray-200 mb-1">{s.title}</div>
                                            <div className="text-sm text-gray-400 leading-relaxed">{s.desc}</div>
                                        </div>
                                    ))}
                                </div>
                                {selectedRecipe.chefSecret && (
                                    <div className="mt-8 bg-green-900/20 border border-green-500/20 p-4 rounded-lg">
                                        <div className="text-green-400 text-xs font-bold uppercase mb-1 flex items-center gap-2">
                                            <Sparkles className="w-3 h-3"/> Секрет успеха
                                        </div>
                                        <p className="text-sm text-gray-300 italic">{selectedRecipe.chefSecret}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderShopping = () => (
        <div className="grid md:grid-cols-2 gap-6 h-[calc(100vh-150px)] overflow-y-auto custom-scrollbar">
            {/* БАЗА */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-fit">
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-700">
                    <h3 className="font-bold flex items-center gap-2 text-purple-400"><ShoppingCart className="w-5 h-5"/> База (На месяц)</h3>
                    <span className="text-xl font-bold">{getWeekTotal(data.shoppingList.base)} €</span>
                </div>
                <div className="space-y-6">
                    {data.shoppingList.base && data.shoppingList.base.map((cat, i) => (
                        <div key={i}>
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">{cat.category}</h4>
                            <div className="space-y-1">
                                {cat.items.map((item, j) => (
                                    <div key={j} className="flex justify-between text-sm p-2 bg-gray-700/30 rounded hover:bg-gray-700/50">
                                        <span>{item.name}</span>
                                        <span className="text-gray-400 font-mono">{(item.price * servings).toFixed(2)} €</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* НЕДЕЛЯ */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-fit">
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-400"/>
                        <select value={selectedWeek} onChange={(e) => setSelectedWeek(Number(e.target.value))} className="bg-gray-900 rounded text-sm px-2 py-1 border border-gray-600 focus:outline-none focus:border-blue-500">
                            {Object.keys(data.weeks).map(w => <option key={w} value={w}>Неделя {w}</option>)}
                        </select>
                    </div>
                    <span className="text-2xl font-bold text-green-400">{getWeekTotal(data.shoppingList[`week${selectedWeek}`])} €</span>
                </div>
                <div className="space-y-6">
                    {data.shoppingList[`week${selectedWeek}`] ? data.shoppingList[`week${selectedWeek}`].map((cat, i) => (
                        <div key={i}>
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">{cat.category}</h4>
                            <div className="space-y-1">
                                {cat.items.map((item, j) => (
                                    <div key={j} className="flex justify-between text-sm p-2 bg-gray-700/30 rounded hover:bg-gray-700/50">
                                        <span>{item.name}</span>
                                        <span className="text-gray-400 font-mono">{(item.price * servings).toFixed(2)} €</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )) : <div>Выберите неделю</div>}
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-blue-500/30">
            <header className="mb-6 flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">DietHolesteric</h1>
                <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
                    {[
                        { id: 'dashboard', icon: Activity, label: 'Обзор' },
                        { id: 'week', icon: Calendar, label: 'План' },
                        { id: 'recipes', icon: Utensils, label: 'Рецепты' },
                        { id: 'shop', icon: ShoppingCart, label: 'Покупки' },
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                            <tab.icon className="w-4 h-4" /> <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </header>
            <main>
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'week' && renderWeekPlan()}
                {activeTab === 'recipes' && renderRecipes()}
                {activeTab === 'shop' && renderShopping()}
            </main>
        </div>
    );
};

export default App;
