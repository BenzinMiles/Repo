import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const DiseaseRenderer = ({ data }) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.title[language]}</h1>
      </div>

      {data.redFlags && (
        <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-100">
          <h2 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
            Red Flags
          </h2>
          <ul className="list-disc list-inside space-y-1 text-red-900">
            {data.redFlags[language].map((flag, idx) => (
              <li key={idx}>{flag}</li>
            ))}
          </ul>
        </div>
      )}

      {data.etiology && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Etiology</h2>
          <p className="text-gray-700">{data.etiology[language]}</p>
        </div>
      )}

      {data.diagnostics && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Diagnostics</h2>
          <p className="text-gray-700">{data.diagnostics[language]}</p>
        </div>
      )}

      {data.treatment && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-green-700 mb-3 border-b pb-2">Treatment</h2>
          <p className="text-gray-700">{data.treatment[language]}</p>
        </div>
      )}
    </div>
  );
};

export default DiseaseRenderer;
