import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import CategoryCard from '../components/CategoryCard';
import { Bug, FileText, Pill, Baby, BrainCircuit } from 'lucide-react';

const Home = () => {
  const { language } = useLanguage();

  const categories = [
    { id: 'diseases', title: { en: 'Diseases', ru: 'Болезни', lv: 'Slimības' }, icon: Bug, to: '/diseases' },
    { id: 'guidelines', title: { en: 'Guidelines', ru: 'Гайдлайны', lv: 'Vadlīnijas' }, icon: FileText, to: '/guidelines' },
    { id: 'meds', title: { en: 'Medications', ru: 'Медикаменты', lv: 'Medikamenti' }, icon: Pill, to: '/meds' },
    { id: 'pediatrics', title: { en: 'Pediatrics', ru: 'Педиатрия', lv: 'Pediatrija' }, icon: Baby, to: '/pediatrics' },
    { id: 'tests', title: { en: 'Quiz/Tests', ru: 'Тесты', lv: 'Testi' }, icon: BrainCircuit, to: '/tests' },
  ];

  return (
    <div className="space-y-6">
       <div className="text-center py-6">
         <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
         <p className="text-gray-500">Select a category to browse content</p>
       </div>
       <div className="grid grid-cols-2 gap-4">
         {categories.map((cat) => (
           <CategoryCard
             key={cat.id}
             title={cat.title[language]}
             icon={cat.icon}
             to={cat.to}
           />
         ))}
       </div>
    </div>
  );
};

export default Home;
