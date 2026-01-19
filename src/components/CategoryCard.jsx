import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ title, icon: Icon, to, color = "bg-white" }) => {
  return (
    <Link to={to} className={`block group ${color} rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 flex flex-col items-center justify-center gap-3 text-center aspect-square`}>
      <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-100 transition-colors">
        <Icon size={32} />
      </div>
      <h3 className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">{title}</h3>
    </Link>
  );
};

export default CategoryCard;
