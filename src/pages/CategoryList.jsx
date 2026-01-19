import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { useLanguage } from '../context/LanguageContext';
import { ChevronRight, Loader2 } from 'lucide-react';

const CategoryList = () => {
  const { category } = useParams();
  const { getItemsByType, loading } = useData();
  const { language } = useLanguage();

  // Map URL category to internal type
  const categoryMap = {
    'diseases': 'disease',
    'guidelines': 'guideline',
    'meds': 'med',
    'pediatrics': 'pediatric',
    'tests': 'quiz'
  };

  const type = categoryMap[category];
  const items = getItemsByType(type);

  const titles = {
    diseases: { en: 'Diseases', ru: 'Болезни', lv: 'Slimības' },
    guidelines: { en: 'Guidelines', ru: 'Гайдлайны', lv: 'Vadlīnijas' },
    meds: { en: 'Medications', ru: 'Медикаменты', lv: 'Medikamenti' },
    pediatrics: { en: 'Pediatrics', ru: 'Педиатрия', lv: 'Pediatrija' },
    tests: { en: 'Quizzes', ru: 'Тесты', lv: 'Testi' }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
         <p className="text-gray-500">No items found in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 capitalize">{titles[category]?.[language] || category}</h1>

      <div className="grid gap-3">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/${category}/${item.id}`}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow group"
          >
            <span className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
              {item.title[language]}
            </span>
            <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-500" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
