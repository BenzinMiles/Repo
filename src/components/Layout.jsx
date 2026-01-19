import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, Globe, ChevronLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  const toggleLanguage = () => {
    const langs = ['en', 'ru', 'lv'];
    const currentIndex = langs.indexOf(language);
    const nextIndex = (currentIndex + 1) % langs.length;
    setLanguage(langs[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             {!isHome && (
              <button onClick={() => navigate(-1)} className="p-1 hover:bg-blue-700 rounded-full">
                <ChevronLeft size={24} />
              </button>
            )}
            <Link to="/" className="text-xl font-bold tracking-tight">
              Infecto-Shell
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
            >
              <Globe size={16} />
              <span className="uppercase">{language}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 max-w-3xl">
        {children}
      </main>
    </div>
  );
};

export default Layout;
