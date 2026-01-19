import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const GuidelineRenderer = ({ data }) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">{data.title[language]}</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-700">Steps</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {data.steps.sort((a,b) => a.order - b.order).map((step) => (
            <div key={step.order} className="p-6 flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                {step.order}
              </div>
              <div className="text-gray-800 pt-1">
                {step.text[language]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuidelineRenderer;
