import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Activity, AlertTriangle, Stethoscope, Pill, X, Info,
  AlertOctagon, Bug, Bed, Users, ClipboardList, Globe, Trash2,
  Upload, Plus, Save, Download
} from 'lucide-react';

// --- НАЧАЛЬНЫЕ ДАННЫЕ (ШАБЛОН) ---
const initialData = [
  {
    id: 'tbe',
    category: { lv: 'Transmisīvās', en: 'Vector-borne' },
    title: { lv: 'Ērču encefalīts (TBE)', en: 'Tick-borne Encephalitis (TBE)' },
    color: 'bg-green-100 border-green-300',
    symptoms: {
      lv: ['Drudzis', 'Galvassāpes', 'Vemšana', 'Ērce'],
      en: ['Fever', 'Headache', 'Vomiting', 'Tick bite']
    },
    redFlags: {
      lv: 'Divfāzu gaita. Pēc "izveseļošanās" (8 dienas) -> Straujš T kāpums + Meningeālie simptomi.',
      en: 'Biphasic course. After "recovery" (8 days) -> Sudden fever spike + Meningeal signs.'
    },
    diagnostics: {
      lv: ['Asinis/Likvors: IgM pret TBE'],
      en: ['Blood/CSF: IgM anti-TBE']
    },
    treatment: {
      lv: ['Specifiskas NAV', 'Deksametazons'],
      en: ['No specific treatment', 'Dexamethasone']
    },
    details: {
      etiology: { lv: 'Flavivirus. Pārnesēji: ērces (Ixodes).', en: 'Flavivirus. Vectors: ticks (Ixodes).' },
      pathogenesis: { lv: 'Vīruss asinīs -> GHE barjera -> CNS.', en: 'Viremia -> Blood-brain barrier -> CNS.' },
      clinical: { lv: '1. fāze: Gripai līdzīga. 2. fāze: Meningīts/Encefalīts.', en: 'Phase 1: Flu-like. Phase 2: Meningitis/Encephalitis.' },
      diagnostics_full: { lv: 'IFA IgM/IgG. PĶR tikai 1. fāzē.', en: 'ELISA IgM/IgG. PCR only in 1st phase.' },
      treatment_full: { lv: 'Gultas režīms. Mannitols, Deksametazons.', en: 'Bed rest. Mannitol, Dexamethasone.' },
      hospitalization: { lv: 'Stacionēt visus ar 2. fāzes simptomiem.', en: 'Hospitalize all with phase 2 symptoms.' },
      risk_groups: { lv: 'Mežsargi, sēņotāji.', en: 'Foresters, mushroom pickers.' },
      recommendations: { lv: 'Vakcinācija (TicoVac).', en: 'Vaccination (TicoVac).' }
    }
  }
];

// --- TEKSTI SASKARNEI ---
const uiText = {
  lv: {
    title: 'Infecto-Shell',
    subtitle: 'Infekcijas slimību ceļvedis',
    search: 'Meklēt...',
    found: 'Atrasts:',
    add_json: 'Pievienot JSON',
    reset: 'Notīrīt',
    red_flags: 'Sarkanie karogi',
    diagnostics: 'Diagnostika',
    treatment: 'Ārstēšana',
    etiology: 'Etioloģija',
    pathogenesis: 'Patoģenēze',
    clinical: 'Klīnika',
    hospitalization: 'Režīms',
    risk_groups: 'Riska grupas',
    recommendations: 'Rekomendācijas',
    cancel: 'Atcelt',
    save: 'Saglabāt',
    delete: 'Dzēst',
    paste_json: 'Iekopējiet JSON bloku šeit:',
    json_error: 'Kļūda JSON formātā!',
    add_success: 'Veiksmīgi pievienots!',
    confirm_delete: 'Dzēst ierakstu?',
    reset_db: 'Atiestatīt bāzi'
  },
  en: {
    title: 'Infecto-Shell',
    subtitle: 'Infectious Disease Guide',
    search: 'Search...',
    found: 'Found:',
    add_json: 'Add JSON',
    reset: 'Reset',
    red_flags: 'Red Flags',
    diagnostics: 'Diagnostics',
    treatment: 'Treatment',
    etiology: 'Etiology',
    pathogenesis: 'Pathogenesis',
    clinical: 'Clinical',
    hospitalization: 'Regimen',
    risk_groups: 'Risk Groups',
    recommendations: 'Recommendations',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    paste_json: 'Paste JSON block here:',
    json_error: 'Invalid JSON format!',
    add_success: 'Successfully added!',
    confirm_delete: 'Delete entry?',
    reset_db: 'Reset DB'
  }
};

const Section = ({ title, icon: Icon, children }) => {
  if (!children) return null;
  return (
    <div className="mb-6">
      <h4 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2 border-b pb-1 border-gray-200">
        {Icon && <Icon className="w-5 h-5 text-indigo-600" />}
        {title}
      </h4>
      <div className="text-gray-700 leading-relaxed whitespace-pre-line pl-1">
        {children}
      </div>
    </div>
  );
};

export default function InfectoApp() {
  const [lang, setLang] = useState('lv');
  const [diseases, setDiseases] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  // Load local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('infecto_diseases');
      if (saved) setDiseases(JSON.parse(saved));
    } catch (e) {
      console.error("Storage load error", e);
    }
  }, []);

  // Save local storage
  useEffect(() => {
    localStorage.setItem('infecto_diseases', JSON.stringify(diseases));
  }, [diseases]);

  // Helpers
  const t = (key) => uiText[lang][key] || key;
  const getVal = (obj) => (obj && (obj[lang] || obj['en'])) || '';
  const getArr = (obj) => (obj && (obj[lang] || obj['en'])) || [];

  // Filter
  const filteredDiseases = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return diseases.filter(d => {
      const title = getVal(d.title).toLowerCase();
      const redFlags = getVal(d.redFlags).toLowerCase();
      return title.includes(lowerSearch) || redFlags.includes(lowerSearch);
    });
  }, [diseases, searchTerm, lang]);

  // Actions
  const handleImport = () => {
    try {
      const newEntry = JSON.parse(jsonInput);
      if (!newEntry.id || !newEntry.title) throw new Error("Missing ID or Title");

      setDiseases(prev => {
        const existingIdx = prev.findIndex(d => d.id === newEntry.id);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = newEntry;
          return updated;
        }
        return [...prev, newEntry];
      });

      setJsonInput('');
      setIsImportOpen(false);
      alert(t('add_success'));
    } catch (e) {
      alert(t('json_error') + " " + e.message);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(t('confirm_delete'))) {
      setDiseases(prev => prev.filter(d => d.id !== id));
      setSelectedDisease(null);
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset?")) {
      setDiseases(initialData);
      localStorage.removeItem('infecto_diseases');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{t('title')}</h1>
              <p className="text-xs text-gray-500">{t('subtitle')}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setLang(l => l === 'lv' ? 'en' : 'lv')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100"
            >
              <Globe className="w-4 h-4" /> {lang.toUpperCase()}
            </button>
            <button
              onClick={() => setIsImportOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100"
            >
              <Upload className="w-4 h-4" /> {t('add_json')}
            </button>
            <button onClick={handleReset} className="p-2 text-gray-400 hover:text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 sticky top-2 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('search')}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {t('found')} {filteredDiseases.length}
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDiseases.map(disease => (
            <div
              key={disease.id}
              onClick={() => setSelectedDisease(disease)}
              className={`cursor-pointer bg-white rounded-xl border-l-4 shadow-sm hover:shadow-md transition-all p-4 flex flex-col gap-3 ${disease.color ? disease.color.replace('bg-', 'border-').split(' ')[1] : 'border-gray-300'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                    {getVal(disease.category)}
                  </span>
                  <h3 className="text-lg font-bold leading-tight mt-1">
                    {getVal(disease.title)}
                  </h3>
                </div>
                <Info className="text-indigo-400 w-5 h-5 opacity-50" />
              </div>

              <div className="bg-red-50 p-2 rounded border border-red-100 text-xs text-gray-700 line-clamp-3">
                <div className="flex items-center gap-1 text-red-700 font-bold mb-1">
                  <AlertTriangle className="w-3 h-3" /> {t('red_flags')}
                </div>
                {getVal(disease.redFlags)}
              </div>

              <div className="flex flex-wrap gap-1 mt-auto">
                {getArr(disease.symptoms).slice(0,3).map((s,i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* MODAL: DETAILS */}
        {selectedDisease && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setSelectedDisease(null)}>
            <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl relative my-auto" onClick={e => e.stopPropagation()}>

              <div className={`p-6 border-b border-gray-100 flex justify-between items-start rounded-t-xl ${selectedDisease.color || 'bg-gray-50'}`}>
                <div>
                  <span className="text-sm font-bold uppercase text-gray-600">
                    {getVal(selectedDisease.category)}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">
                    {getVal(selectedDisease.title)}
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(selectedDisease.id)} className="p-2 bg-white/50 rounded-full hover:bg-red-100 text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => setSelectedDisease(null)} className="p-2 bg-white/50 rounded-full hover:bg-white text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[80vh]">
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-8 flex gap-4 items-start">
                  <AlertOctagon className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-red-800 font-bold text-lg mb-1">{t('red_flags')}</h3>
                    <p className="text-red-900/80 font-medium">{getVal(selectedDisease.redFlags)}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <Section title={t('etiology')} icon={Bug}>
                      {getVal(selectedDisease.details?.etiology)}
                    </Section>
                    <Section title={t('risk_groups')} icon={Users}>
                      {getVal(selectedDisease.details?.risk_groups)}
                    </Section>
                    <Section title={t('pathogenesis')} icon={Activity}>
                      {getVal(selectedDisease.details?.pathogenesis)}
                    </Section>
                    <Section title={t('clinical')} icon={Stethoscope}>
                      {getVal(selectedDisease.details?.clinical)}
                    </Section>
                  </div>
                  <div>
                    <Section title={t('diagnostics')} icon={Search}>
                      {getVal(selectedDisease.details?.diagnostics_full) || (
                        <ul className="list-disc pl-4">{getArr(selectedDisease.diagnostics).map((s,i)=><li key={i}>{s}</li>)}</ul>
                      )}
                    </Section>
                    <Section title={t('treatment')} icon={Pill}>
                      {getVal(selectedDisease.details?.treatment_full) || (
                        <ul className="list-disc pl-4">{getArr(selectedDisease.treatment).map((s,i)=><li key={i}>{s}</li>)}</ul>
                      )}
                    </Section>
                    <Section title={t('hospitalization')} icon={Bed}>
                      {getVal(selectedDisease.details?.hospitalization)}
                    </Section>
                    <Section title={t('recommendations')} icon={ClipboardList}>
                      {getVal(selectedDisease.details?.recommendations)}
                    </Section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: IMPORT */}
        {isImportOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" /> {t('add_json')}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{t('paste_json')}</p>
              <textarea
                className="w-full h-64 p-3 border rounded-lg font-mono text-xs bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={jsonInput}
                onChange={e => setJsonInput(e.target.value)}
                placeholder='{ "id": "test", "title": { "lv": "Test", "en": "Test" } ... }'
              />
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => setIsImportOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  {t('cancel')}
                </button>
                <button onClick={handleImport} className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg">
                  {t('save')}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
