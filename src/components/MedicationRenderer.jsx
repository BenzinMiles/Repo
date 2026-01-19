import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const MedicationRenderer = ({ data }) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.title[language]}</h1>
        <p className="text-blue-600 font-medium">{data.group[language]}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Indications</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {data.indications[language].map((ind, idx) => (
            <li key={idx}>{ind}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-red-600 mb-3 border-b pb-2">Contraindications</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {data.contraindications[language].map((ci, idx) => (
            <li key={idx}>{ci}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-green-700 mb-3 border-b pb-2">Dosing</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Adults</h3>
            <p className="text-gray-700">{data.dosing.adults[language]}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Pediatric</h3>
            <p className="text-gray-700">{data.dosing.pediatric[language]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationRenderer;
