import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const PediatricRenderer = ({ data }) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.title[language]}</h1>
        {data.category && <p className="text-pink-600 font-medium capitalize">{data.category}</p>}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {data.data_type === 'list' || data.data_type === 'table' ? (
           <table className="w-full text-left border-collapse">
             <thead className="bg-gray-50">
               <tr>
                 <th className="p-4 border-b font-semibold text-gray-700 w-1/3">Age</th>
                 <th className="p-4 border-b font-semibold text-gray-700">Content</th>
               </tr>
             </thead>
             <tbody>
               {data.items.map((item, idx) => (
                 <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                   <td className="p-4 font-medium text-gray-900">{item.age[language]}</td>
                   <td className="p-4 text-gray-700">{item.value[language]}</td>
                 </tr>
               ))}
             </tbody>
           </table>
        ) : (
          <div className="p-6">
            <p className="text-gray-500 italic">Unknown data type format.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PediatricRenderer;
