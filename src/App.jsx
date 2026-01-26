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

    const [data, setData] = useState(null);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [r, w, m, s, d] = await Promise.all([
                    fetch('./data/recipes.json').then(res => res.json()),
                    fetch('./data/weeks.json').then(res => res.json()),
                    fetch('./data/menu_plan.json').then(res => res.json()),
                    fetch('./data/shopping.json').then(res => res.json()),
                    fetch('./data/dashboard.json').then(res => res.json())
                ]);
                setData({ recipes: r, weeks: w, menuPlan: m, shoppingList: s, dashboard: d });
                if (r.length > 0) setSelectedRecipe(r[0]);
            } catch (e) {
                console.error("Ошибка загрузки:", e);
            }
        };
        loadData();
    }, []);

    useEffect(() => setServings(1), [selectedRecipe]);

    if (!data) return (
        <div className="flex h-screen items-center justify-center bg-slate-900 text-blue-400">
            <Loader2 className="w-12 h-12 animate-spin" />
        </div>
    );

    const getWeekTotal = (list) => {
        if (!list) return 0;
        return list.reduce((acc, cat) => acc + cat.items.reduce((sum, item) => sum + (item.price * servings), 0), 0).toFixed(2);
    };

    // --- RENDERERS ---
    const renderDashboard = () => (
        <div className="grid grid-cols-1 gap-4 mb-8">
            <div className="bg-gray-800 p-4 rounded-xl border-l-4 border-blue-500 shadow-lg">
                <div className="text-sm text-gray-400">Цель (Масса)</div>
                <div className="text-2xl font-bold">{data.dashboard.macros.cal} ккал</div>
                <div className="text-xs text-gray-500 mt-1">
                    Б: {data.dashboard.macros.prot} • Ж: {data.dashboard.macros.fat} • У: {data.dashboard.macros.carb}
                </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
                <div className="font-bold text-sm mb-2 text-gray-400 uppercase">Правила</div>
                {data.dashboard.medicalRules.map(r => (
                    <div key={r.id} className="mb-2 last:mb-0">
                        <span className="text-blue-400 font-bold text-xs">{r.title}:</span> <span className="text-xs text-gray-300">{r.desc}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderWeekPlan = () => (
        <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
                {Object.keys(data.weeks).map(w => (
                    <button key={w} onClick={() => setSelectedWeek(Number(w))} className={`px-4 py-2 rounded-lg whitespace-nowrap ${selectedWeek === Number(w) ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
                        {data.weeks[w].title}
                    </button>
                ))}
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <p className="text-xs text-gray-400 mb-4 italic">{data.weeks[selectedWeek].desc}</p>
                <div className="space-y-3">
                    {data.menuPlan[selectedWeek]?.map((day, i) => (
                        <div key={i} className={`p-3 rounded border ${day.day.includes('Работа') ? 'bg-blue-900/10 border-blue-500/20' : 'bg-gray-700/30 border-transparent'}`}>
                            <div className="font-bold text-sm mb-1 text-green-400">{day.day}</div>
                            <div className="text-xs text-gray-300">{day.meals.join(" • ")}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderRecipes = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-160px)]">
            <div className="lg:col-span-1 overflow-y-auto pr-2 space-y-2">
                {data.recipes.map(r => (
                    <div key={r.id} onClick={() => setSelectedRecipe(r)} className={`p-3 rounded-lg cursor-pointer border ${selectedRecipe?.id === r.id ? 'bg-blue-600 border-blue-400' : 'bg-gray-800 border-transparent'}`}>
                        <div className="font-bold text-sm">{r.title}</div>
                        <div className="flex gap-2 mt-1"><span className="text-[10px] bg-black/20 px-2 rounded text-gray-300">{r.time}</span></div>
                    </div>
                ))}
            </div>
            <div className="lg:col-span-2 overflow-y-auto pb-10">
                {selectedRecipe && (
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 shadow-2xl">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">{selectedRecipe.title}</h2>
                                <div className="text-sm text-gray-400 mt-1 flex gap-3">
                                    <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500"/> {selectedRecipe.cals * servings} ккал</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-blue-500"/> {selectedRecipe.time}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-900 px-2 py-1 rounded-lg">
                                <button onClick={() => setServings(Math.max(1, servings - 1))}><Minus className="w-4 h-4"/></button>
                                <span className="font-bold">{servings}</span>
                                <button onClick={() => setServings(servings + 1)}><Plus className="w-4 h-4"/></button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {selectedRecipe.sections.map((sec, idx) => (
                                <div key={idx}>
                                    <h4 className="text-xs font-bold text-blue-400 uppercase mb-2">{sec.title}</h4>
                                    <ul className="space-y-1">
                                        {sec.items.map((ing, i) => (
                                            <li key={i} className="flex justify-between text-sm bg-gray-700/30 p-2 rounded">
                                                <span>{ing.name}</span>
                                                <span className="font-bold text-blue-100">{(ing.amount * servings).toFixed(1)} {ing.unit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            <div>
                                <h4 className="text-xs font-bold text-orange-400 uppercase mb-2 flex gap-2"><ChefHat className="w-3 h-3"/> Приготовление</h4>
                                <div className="space-y-3 pl-3 border-l border-gray-600">
                                    {selectedRecipe.steps.map((s, i) => (
                                        <div key={i}>
                                            <div className="font-bold text-sm text-gray-200">{s.title}</div>
                                            <div className="text-xs text-gray-400">{s.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderShopping = () => (
        <div className="space-y-6 h-[calc(100vh-160px)] overflow-y-auto">
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <div className="flex justify-between mb-4">
                    <h3 className="font-bold flex gap-2 items-center"><ShoppingCart className="w-4 h-4 text-purple-400"/> База</h3>
                    <span className="font-bold">{getWeekTotal(data.shoppingList.base)} €</span>
                </div>
                {data.shoppingList.base.map((cat, i) => (
                    <div key={i} className="mb-2 last:mb-0">
                        <div className="text-[10px] text-gray-500 uppercase mb-1">{cat.category}</div>
                        {cat.items.map((item, j) => (
                            <div key={j} className="flex justify-between text-xs p-2 bg-gray-700/30 rounded mb-1">
                                <span>{item.name}</span>
                                <span className="font-mono">{(item.price * servings).toFixed(2)} €</span>
                            </div>
                        ))}
                    </div>
                ))}
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
