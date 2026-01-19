import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Activity, AlertTriangle, Stethoscope, Pill, X, Info,
  AlertOctagon, Bug, Bed, Users, ClipboardList, Globe, Trash2,
  Upload, Plus, Save, Download, GraduationCap, ArrowRight, CheckCircle, XCircle, FileText, BookOpen
} from 'lucide-react';

// Load diseases from JSON files
const diseaseModules = import.meta.glob('./data/diseases/*.json', { eager: true });
const initialData = Object.values(diseaseModules).map(module => module.default || module);

// Load tests from JSON files
const testModules = import.meta.glob('./data/tests/*.json', { eager: true });
const initialTests = Object.values(testModules).flatMap(module => module.default || module);

// Load medications from JSON files
const medicationModules = import.meta.glob('./data/medications/*.json', { eager: true });
const initialMedications = Object.values(medicationModules).map(module => module.default || module);

// Load guidelines from JSON files
const guidelineModules = import.meta.glob('./data/guidelines/*.json', { eager: true });
const initialGuidelines = Object.values(guidelineModules).map(module => module.default || module);

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
    reset_db: 'Atiestatīt bāzi',
    start_test: 'Sākt Testu',
    test_title: 'Zināšanu pārbaude',
    next_question: 'Nākamais jautājums',
    correct: 'Pareizi!',
    incorrect: 'Nepareizi',
    explanation: 'Paskaidrojums',
    finish_test: 'Pabeigt testu',
    your_score: 'Tavs rezultāts',
    from: 'no',
    medications: 'Medikamenti',
    medications_title: 'Medikamentu rokasgrāmata',
    adult_dosage: 'Devas pieaugušajiem',
    pediatric_dosage: 'Devas bērniem',
    contraindications: 'Kontrindikācijas',
    search_meds: 'Meklēt zāles...',
    tab_diseases: 'Slimības',
    tab_guidelines: 'Vadlīnijas',
    open_pdf: 'Atvērt PDF',
    source: 'Avots'
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
    reset_db: 'Reset DB',
    start_test: 'Start Test',
    test_title: 'Knowledge Test',
    next_question: 'Next Question',
    correct: 'Correct!',
    incorrect: 'Incorrect',
    explanation: 'Explanation',
    finish_test: 'Finish Test',
    your_score: 'Your Score',
    from: 'of',
    medications: 'Medications',
    medications_title: 'Medication Guide',
    adult_dosage: 'Adult Dosage',
    pediatric_dosage: 'Pediatric Dosage',
    contraindications: 'Contraindications',
    search_meds: 'Search meds...',
    tab_diseases: 'Diseases',
    tab_guidelines: 'Guidelines',
    open_pdf: 'Open PDF',
    source: 'Source'
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
  const [guidelines, setGuidelines] = useState(initialGuidelines);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('diseases'); // 'diseases' or 'guidelines'

  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedGuideline, setSelectedGuideline] = useState(null);

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  // Test State
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Medications State
  const [isMedsOpen, setIsMedsOpen] = useState(false);
  const [medsSearch, setMedsSearch] = useState('');
  const [selectedMed, setSelectedMed] = useState(null);

  // Load local storage and merge with file data
  useEffect(() => {
    try {
      const savedDiseases = localStorage.getItem('infecto_diseases');
      if (savedDiseases) {
        const localDiseases = JSON.parse(savedDiseases);
        const fileIds = new Set(initialData.map(d => d.id));
        const uniqueLocal = localDiseases.filter(d => !fileIds.has(d.id));
        setDiseases([...initialData, ...uniqueLocal]);
      } else {
        setDiseases(initialData);
      }

      const savedGuidelines = localStorage.getItem('infecto_guidelines');
      if (savedGuidelines) {
        const localGuidelines = JSON.parse(savedGuidelines);
        const fileIds = new Set(initialGuidelines.map(g => g.id));
        const uniqueLocal = localGuidelines.filter(g => !fileIds.has(g.id));
        setGuidelines([...initialGuidelines, ...uniqueLocal]);
      } else {
        setGuidelines(initialGuidelines);
      }

    } catch (e) {
      console.error("Storage load error", e);
    }
  }, []);

  // Save local storage
  useEffect(() => {
    const fileIds = new Set(initialData.map(d => d.id));
    const toSave = diseases.filter(d => !fileIds.has(d.id));
    localStorage.setItem('infecto_diseases', JSON.stringify(toSave));
  }, [diseases]);

  useEffect(() => {
    const fileIds = new Set(initialGuidelines.map(g => g.id));
    const toSave = guidelines.filter(g => !fileIds.has(g.id));
    localStorage.setItem('infecto_guidelines', JSON.stringify(toSave));
  }, [guidelines]);

  // Helpers
  const t = (key) => uiText[lang][key] || key;
  const getVal = (obj) => (obj && (obj[lang] || obj['en'])) || '';
  const getArr = (obj) => (obj && (obj[lang] || obj['en'])) || [];

  // Filter Diseases
  const filteredDiseases = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return diseases.filter(d => {
      const title = getVal(d.title).toLowerCase();
      const redFlags = getVal(d.redFlags).toLowerCase();
      return title.includes(lowerSearch) || redFlags.includes(lowerSearch);
    });
  }, [diseases, searchTerm, lang]);

  // Filter Guidelines
  const filteredGuidelines = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return guidelines.filter(g => {
      const title = getVal(g.title).toLowerCase();
      const summary = getVal(g.summary).toLowerCase();
      return title.includes(lowerSearch) || summary.includes(lowerSearch);
    });
  }, [guidelines, searchTerm, lang]);

  // Filter Medications
  const filteredMeds = useMemo(() => {
    const lowerSearch = medsSearch.toLowerCase();
    return initialMedications.filter(m => {
       const title = getVal(m.title).toLowerCase();
       const group = getVal(m.group).toLowerCase();
       return title.includes(lowerSearch) || group.includes(lowerSearch);
    });
  }, [medsSearch, lang]);

  // Actions
  const handleImport = () => {
    try {
      const newEntry = JSON.parse(jsonInput);
      if (!newEntry.id) throw new Error("Missing ID");

      if (newEntry.type === 'guideline') {
        // Import Guideline
        setGuidelines(prev => {
            const existingIdx = prev.findIndex(g => g.id === newEntry.id);
            if (existingIdx >= 0) {
              const updated = [...prev];
              updated[existingIdx] = newEntry;
              return updated;
            }
            return [...prev, newEntry];
          });
      } else {
        // Import Disease (default)
        if (!newEntry.title) throw new Error("Missing Title");
        setDiseases(prev => {
            const existingIdx = prev.findIndex(d => d.id === newEntry.id);
            if (existingIdx >= 0) {
              const updated = [...prev];
              updated[existingIdx] = newEntry;
              return updated;
            }
            return [...prev, newEntry];
          });
      }

      setJsonInput('');
      setIsImportOpen(false);
      alert(t('add_success'));
    } catch (e) {
      alert(t('json_error') + " " + e.message);
    }
  };

  const handleDelete = (id, type = 'disease') => {
    if (type === 'guideline') {
        if (initialGuidelines.find(g => g.id === id)) {
            alert("Cannot delete built-in data.");
            return;
        }
        if (window.confirm(t('confirm_delete'))) {
            setGuidelines(prev => prev.filter(g => g.id !== id));
            setSelectedGuideline(null);
        }
    } else {
        if (initialData.find(d => d.id === id)) {
            alert("Cannot delete built-in data.");
            return;
        }
        if (window.confirm(t('confirm_delete'))) {
            setDiseases(prev => prev.filter(d => d.id !== id));
            setSelectedDisease(null);
        }
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset?")) {
      setDiseases(initialData);
      setGuidelines(initialGuidelines);
      localStorage.removeItem('infecto_diseases');
      localStorage.removeItem('infecto_guidelines');
    }
  };

  // --- TEST LOGIC ---
  const startTest = () => {
    const shuffled = [...initialTests].sort(() => 0.5 - Math.random());
    setTestQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setIsTestOpen(true);
  };

  const handleAnswer = (option) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    const correct = testQuestions[currentQuestionIndex][5];
    if (option === correct) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
    } else {
      alert(`${t('your_score')}: ${score} ${t('from')} ${testQuestions.length}`);
      setIsTestOpen(false);
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

          <div className="flex gap-2 flex-wrap justify-center">
            <button
              onClick={() => setLang(l => l === 'lv' ? 'en' : 'lv')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100"
            >
              <Globe className="w-4 h-4" /> {lang.toUpperCase()}
            </button>

            <button
              onClick={startTest}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100"
            >
              <GraduationCap className="w-4 h-4" /> {t('start_test')}
            </button>

            <button
              onClick={() => setIsMedsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100"
            >
              <Pill className="w-4 h-4" /> {t('medications')}
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

        {/* SEARCH & TABS */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 sticky top-2 z-10">
          <div className="flex gap-4 mb-4 border-b border-gray-100">
             <button
               onClick={() => setActiveTab('diseases')}
               className={`pb-2 px-1 font-bold ${activeTab === 'diseases' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400'}`}
             >
                {t('tab_diseases')}
             </button>
             <button
               onClick={() => setActiveTab('guidelines')}
               className={`pb-2 px-1 font-bold ${activeTab === 'guidelines' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400'}`}
             >
                {t('tab_guidelines')}
             </button>
          </div>

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
            {t('found')} {activeTab === 'diseases' ? filteredDiseases.length : filteredGuidelines.length}
          </div>
        </div>

        {/* CONTENT: DISEASES */}
        {activeTab === 'diseases' && (
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
        )}

        {/* CONTENT: GUIDELINES */}
        {activeTab === 'guidelines' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGuidelines.map(guide => (
                  <div
                    key={guide.id}
                    onClick={() => setSelectedGuideline(guide)}
                    className="cursor-pointer bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-4"
                  >
                     <div className="flex justify-between items-start">
                        <div>
                            <span className="text-xs font-bold uppercase text-blue-600 tracking-wider bg-blue-50 px-2 py-1 rounded">
                                {getVal(guide.category)}
                            </span>
                            <h3 className="text-lg font-bold leading-tight mt-3 text-gray-800">
                                {getVal(guide.title)}
                            </h3>
                        </div>
                        <FileText className="text-gray-400 w-6 h-6" />
                     </div>
                     <p className="text-sm text-gray-600 line-clamp-3">
                        {getVal(guide.summary)}
                     </p>
                     <div className="mt-auto pt-2 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
                        <span>{guide.source}</span>
                     </div>
                  </div>
              ))}
            </div>
        )}

        {/* MODAL: DISEASE DETAILS */}
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

        {/* MODAL: GUIDELINE DETAILS */}
        {selectedGuideline && (
             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setSelectedGuideline(null)}>
                <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl relative my-auto h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                    <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50 rounded-t-xl">
                        <div>
                            <span className="text-xs font-bold uppercase text-blue-600 tracking-wider bg-blue-100 px-2 py-1 rounded">
                                {getVal(selectedGuideline.category)}
                            </span>
                            <h2 className="text-2xl font-bold text-gray-900 mt-2">
                                {getVal(selectedGuideline.title)}
                            </h2>
                             <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                <span className="font-medium">{t('source')}: {selectedGuideline.source}</span>
                             </div>
                        </div>
                        <div className="flex gap-2">
                             <button onClick={() => handleDelete(selectedGuideline.id, 'guideline')} className="p-2 bg-white/50 rounded-full hover:bg-red-100 text-red-500">
                                <Trash2 className="w-5 h-5" />
                            </button>
                            <button onClick={() => setSelectedGuideline(null)} className="p-2 bg-white/50 rounded-full hover:bg-white text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="p-8 overflow-y-auto flex-1 text-gray-800 leading-relaxed whitespace-pre-line text-lg">
                        {getVal(selectedGuideline.content)}
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-between items-center">
                         {selectedGuideline.pdfUrl && (
                             <a href={selectedGuideline.pdfUrl} target="_blank" className="flex items-center gap-2 text-indigo-600 font-bold hover:underline">
                                <Download className="w-4 h-4" /> {t('open_pdf')}
                             </a>
                         )}
                    </div>
                </div>
             </div>
        )}

        {/* MODAL: TEST */}
        {isTestOpen && testQuestions.length > 0 && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-2xl relative">
              <button onClick={() => setIsTestOpen(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-blue-600" /> {t('test_title')}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {t('your_score')}: {score} / {testQuestions.length}
              </p>

              <div className="mb-6">
                 <h4 className="text-lg font-bold text-gray-800 mb-4">
                   {currentQuestionIndex + 1}. {testQuestions[currentQuestionIndex][0]}
                 </h4>

                 <div className="grid grid-cols-1 gap-3">
                   {testQuestions[currentQuestionIndex].slice(1, 5).map((option, idx) => {
                      let btnClass = "p-3 rounded-lg border text-left transition-colors hover:bg-gray-50";
                      const correct = testQuestions[currentQuestionIndex][5];

                      if (isAnswered) {
                        if (option === correct) btnClass = "p-3 rounded-lg border border-green-500 bg-green-50 text-green-900";
                        else if (option === selectedAnswer) btnClass = "p-3 rounded-lg border border-red-500 bg-red-50 text-red-900";
                        else btnClass = "p-3 rounded-lg border opacity-50";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(option)}
                          disabled={isAnswered}
                          className={btnClass}
                        >
                          <span className="font-bold mr-2">{['A', 'B', 'C', 'D'][idx]}.</span> {option}
                        </button>
                      )
                   })}
                 </div>
              </div>

              {isAnswered && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                  <h5 className="font-bold text-blue-800 flex items-center gap-2 mb-1">
                    <Info className="w-4 h-4" /> {t('explanation')}
                  </h5>
                  <p className="text-blue-900 text-sm">
                    {testQuestions[currentQuestionIndex][6]}
                  </p>
                </div>
              )}

              <div className="flex justify-end mt-4">
                {isAnswered && (
                  <button onClick={nextQuestion} className="px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg flex items-center gap-2">
                    {t('next_question')} <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL: MEDICATIONS */}
        {isMedsOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-4xl p-6 shadow-2xl relative h-[90vh] flex flex-col">
              <button onClick={() => { setIsMedsOpen(false); setSelectedMed(null); }} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-700">
                <Pill className="w-6 h-6" /> {t('medications_title')}
              </h3>

              {selectedMed ? (
                <div className="flex-1 overflow-y-auto">
                  <button onClick={() => setSelectedMed(null)} className="text-sm text-gray-500 mb-4 hover:underline">&larr; Back</button>
                  <h2 className="text-2xl font-bold mb-1">{getVal(selectedMed.title)}</h2>
                  <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded mb-6 font-bold uppercase">{getVal(selectedMed.group)}</span>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <h4 className="flex items-center gap-2 font-bold text-blue-800 mb-2">
                        <Users className="w-4 h-4" /> {t('adult_dosage')}
                      </h4>
                      <p className="text-gray-800">{getVal(selectedMed.adult_dosage)}</p>
                    </div>

                    <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
                      <h4 className="flex items-center gap-2 font-bold text-pink-800 mb-2">
                        <Bug className="w-4 h-4" /> {t('pediatric_dosage')}
                      </h4>
                      <p className="text-gray-800">{getVal(selectedMed.pediatric_dosage)}</p>
                    </div>
                  </div>

                  <div className="mt-6 bg-red-50 p-4 rounded-xl border border-red-100">
                     <h4 className="flex items-center gap-2 font-bold text-red-800 mb-2">
                        <AlertTriangle className="w-4 h-4" /> {t('contraindications')}
                      </h4>
                      <p className="text-gray-800">{getVal(selectedMed.contraindications)}</p>
                  </div>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder={t('search_meds')}
                    className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 outline-none"
                    value={medsSearch}
                    onChange={e => setMedsSearch(e.target.value)}
                  />

                  <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredMeds.map((med) => (
                      <div
                        key={med.id}
                        onClick={() => setSelectedMed(med)}
                        className="p-4 border rounded-xl hover:bg-purple-50 cursor-pointer transition-colors flex justify-between items-center"
                      >
                         <div>
                           <h4 className="font-bold text-gray-800">{getVal(med.title)}</h4>
                           <p className="text-xs text-gray-500">{getVal(med.group)}</p>
                         </div>
                         <ArrowRight className="w-4 h-4 text-purple-300" />
                      </div>
                    ))}
                  </div>
                </>
              )}
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
                placeholder='{ "id": "test", "type": "guideline", "title": ... }'
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
