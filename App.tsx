
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Language, SearchState, SavedEntry, DictionaryEntry } from './types';
import { fetchDictionaryEntry } from './services/geminiService';
import SearchBar from './components/SearchBar';
import DictionaryView from './components/DictionaryView';
import PolytonicConverter from './components/PolytonicConverter';

const Logo = () => (
  <div className="relative group cursor-default select-none mx-auto">
    <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 transition-all duration-1000 scale-150"></div>
    <div className="relative h-64 w-64 md:h-72 md:w-72 flex items-center justify-center bg-[#1a1a1a] rounded-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border-8 border-[#2a2a2a] overflow-hidden group-hover:shadow-[0_48px_80px_-20px_rgba(249,115,22,0.3)] transition-all duration-700">
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/asfalt-light.png")' }}></div>
      <div className="relative w-[90%] h-[90%] flex items-center justify-center transition-all duration-700 group-hover:scale-110">
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
          <circle cx="100" cy="100" r="95" fill="#e07a5f" opacity="0.15" />
          <g fill="#e07a5f">
            <path d="M70,80 C60,80 50,85 50,95 L50,140 C50,150 60,160 80,160 L90,160 L90,150 L80,150 C70,150 65,145 65,140 L65,95 C65,90 70,85 80,85 L85,85 L85,80 Z" />
            <circle cx="70" cy="70" r="8" />
            <path d="M40,145 L90,145 L85,155 L45,155 Z" />
            <circle cx="140" cy="90" r="7" />
            <path d="M140,100 C135,100 130,105 130,115 L130,160 L145,160 L145,115 C145,105 145,100 140,100 Z" />
            <rect x="85" y="90" width="45" height="35" rx="2" fill="#fff" transform="rotate(-5, 107, 107)" />
            <text x="108" y="110" textAnchor="middle" transform="rotate(-5, 108, 110)" className="font-serif font-black tracking-tighter" style={{ fontSize: '8px', fill: '#1a1a1a' }}>ΛΕΞΙΚΟ</text>
            <text x="165" y="165" className="font-serif italic font-black opacity-30 group-hover:opacity-80 transition-opacity duration-700" style={{ fontSize: '18px', fill: '#e07a5f' }}>!!</text>
          </g>
          <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke="#e07a5f" strokeWidth="1" strokeDasharray="4,2" opacity="0.2"/>
        </svg>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(255,255,255,0.1)_0%,_transparent_50%,_rgba(0,0,0,0.2)_100%)] pointer-events-none"></div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.ANCIENT_GREEK);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchState, setSearchState] = useState<SearchState>({
    loading: false,
    entry: null,
    error: null,
  });
  const [savedEntries, setSavedEntries] = useState<SavedEntry[]>([]);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  
  const cacheRef = useRef<Map<string, DictionaryEntry>>(new Map());

  const performSearch = useCallback(async (word: string, lang: Language) => {
    const trimmedQuery = word.trim();
    if (!trimmedQuery) return;

    const cacheKey = `${lang}:${trimmedQuery}`;
    if (cacheRef.current.has(cacheKey)) {
      setSearchState({ loading: false, entry: cacheRef.current.get(cacheKey)!, error: null });
      return;
    }

    setSearchState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const entry = await fetchDictionaryEntry(trimmedQuery, lang);
      cacheRef.current.set(cacheKey, entry);
      setSearchState({ loading: false, entry, error: null });
    } catch (err: any) {
      setSearchState({ loading: false, entry: null, error: err.message || "Παρουσιάστηκε σφάλμα." });
    }
  }, []);

  const handleRandomWord = () => {
    const greekWords = ["λόγος", "πόλις", "αρετή", "φιλοσοφία", "κόσμος", "ψυχή"];
    const latinWords = ["amor", "tempus", "bellum", "civis", "libertas", "mundus"];
    const modernWords = ["δημοκρατία", "τεχνολογία", "άνθρωπος", "θάλασσα", "φως", "αγάπη"];
    
    let pool: string[] = [];
    if (currentLanguage === Language.ANCIENT_GREEK) pool = greekWords;
    else if (currentLanguage === Language.LATIN) pool = latinWords;
    else pool = modernWords;

    const random = pool[Math.floor(Math.random() * pool.length)];
    setSearchQuery(random);
    performSearch(random, currentLanguage);
  };

  useEffect(() => {
    const saved = localStorage.getItem('lexicon_saved_words');
    if (saved) setSavedEntries(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('lexicon_saved_words', JSON.stringify(savedEntries));
  }, [savedEntries]);

  const handleSearchTrigger = (word: string, lang: Language) => {
    if (lang !== currentLanguage) setCurrentLanguage(lang);
    setSearchQuery(word);
    performSearch(word, lang);
  };

  const handleDoubleClick = useCallback(() => {
    const selection = window.getSelection();
    if (selection) {
      const text = selection.toString().trim();
      if (text && !text.includes(' ') && text.length < 30) {
        setSearchQuery(text);
        performSearch(text, currentLanguage);
      }
    }
  }, [currentLanguage, performSearch]);

  const toggleSaveEntry = () => {
    if (!searchState.entry) return;
    const entryId = `${currentLanguage}-${searchState.entry.word}`;
    const exists = savedEntries.some(e => `${e.language}-${e.word}` === entryId);
    if (exists) {
      setSavedEntries(prev => prev.filter(e => `${e.language}-${e.word}` !== entryId));
    } else {
      setSavedEntries(prev => [{
        word: searchState.entry!.word,
        displayWord: searchState.entry!.polytonicWord || searchState.entry!.word,
        language: currentLanguage,
        definition: searchState.entry!.definition,
        timestamp: Date.now()
      }, ...prev]);
    }
  };

  const isCurrentEntrySaved = searchState.entry 
    ? savedEntries.some(e => e.word === searchState.entry?.word && e.language === currentLanguage) 
    : false;

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-slate-900 flex flex-col" onDoubleClick={handleDoubleClick}>
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]"></div>
      </div>

      <header className="relative pt-16 pb-8 px-6 flex flex-col items-center">
        {/* Αποθηκευμένα - Εικονίδιο Καλαθιού Πάνω Δεξιά */}
        <button 
          onClick={() => setIsSavedDrawerOpen(true)}
          className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 bg-white border border-slate-200 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all backdrop-blur-md group"
          title="Προβολή Αποθηκευμένων"
        >
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {savedEntries.length > 0 && (
              <span className="absolute -top-3 -right-3 bg-rose-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-lg border-2 border-white animate-in zoom-in">
                {savedEntries.length}
              </span>
            )}
          </div>
          <span className="hidden md:inline text-xs font-black text-slate-700 uppercase tracking-widest">Συλλογή</span>
        </button>

        <div className="max-w-4xl mx-auto text-center space-y-8 flex flex-col items-center">
          <div className="flex justify-center w-full">
            <Logo />
          </div>
          <h1 className="text-6xl md:text-7xl font-serif font-extrabold text-slate-900 tracking-tight leading-none">Λεξικό Ελληνικών και Λατινικών</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed font-serif italic">"Ἔστι δ᾽ ἀρχὴ τῆς λέξεως τὸ ἑλληνίζειν" — Αριστοτέλης</p>
          
          <div className="flex justify-center mt-12">
            <div className="inline-flex p-2 bg-slate-200/40 rounded-[2rem] border border-slate-200/60 shadow-inner backdrop-blur-sm overflow-x-auto max-w-full">
              <button onClick={() => setCurrentLanguage(Language.ANCIENT_GREEK)} className={`px-6 md:px-10 py-4 rounded-[1.5rem] text-sm md:text-lg font-bold transition-all whitespace-nowrap ${currentLanguage === Language.ANCIENT_GREEK ? 'bg-white text-indigo-700 shadow-xl scale-105' : 'text-slate-500'}`}>🏛️ Αρχαία</button>
              <button onClick={() => setCurrentLanguage(Language.LATIN)} className={`px-6 md:px-10 py-4 rounded-[1.5rem] text-sm md:text-lg font-bold transition-all whitespace-nowrap ${currentLanguage === Language.LATIN ? 'bg-white text-indigo-700 shadow-xl scale-105' : 'text-slate-500'}`}>📜 Λατινικά</button>
              <button onClick={() => setCurrentLanguage(Language.MODERN_GREEK)} className={`px-6 md:px-10 py-4 rounded-[1.5rem] text-sm md:text-lg font-bold transition-all whitespace-nowrap ${currentLanguage === Language.MODERN_GREEK ? 'bg-white text-indigo-700 shadow-xl scale-105' : 'text-slate-500'}`}>✍️ Νέα Ελληνικά</button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative px-6 pb-12 pt-12 flex-grow">
        <SearchBar onSearch={handleSearchTrigger} selectedLanguage={currentLanguage} disabled={searchState.loading} query={searchQuery} setQuery={setSearchQuery} />
        
        <div className="flex justify-center mt-6">
          <button onClick={handleRandomWord} disabled={searchState.loading} className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800 flex items-center gap-2 group transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Δοκιμάστε μια τυχαία λέξη
          </button>
        </div>

        <div className="mt-20">
          {searchState.loading && <div className="text-center py-24 font-serif text-3xl italic animate-pulse">Αναζήτηση...</div>}
          {searchState.error && <div className="max-w-md mx-auto bg-rose-50 p-8 rounded-[2.5rem] text-center text-rose-900 font-bold">{searchState.error}</div>}
          {!searchState.loading && searchState.entry && <DictionaryView entry={searchState.entry} language={currentLanguage} isSaved={isCurrentEntrySaved} onToggleSave={toggleSaveEntry} onWordNavigate={(w) => handleSearchTrigger(w, currentLanguage)} />}
        </div>
      </main>

      <footer className="relative z-10 py-12 px-6 border-t border-slate-200/60 flex flex-col items-center">
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-6 opacity-60 hover:opacity-100 transition-opacity">
          <div className="text-center md:text-left space-y-1">
            <p className="text-sm font-serif font-bold text-slate-700">Σπύρος Ζήνδρος</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Επιμορφωτής ΨΤ</p>
          </div>
          <div className="h-px w-12 bg-slate-200 md:hidden"></div>
          <div className="text-center md:text-right">
             <p className="text-[10px] text-slate-400 font-medium">Lexicon Antiquum &copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>

      {isSavedDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsSavedDrawerOpen(false)}></div>
          <div className="relative w-full max-w-md bg-[#fcfaf8] h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="p-8 border-b flex justify-between bg-white">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h2 className="text-2xl font-serif font-extrabold text-slate-900">Η Συλλογή μου</h2>
              </div>
              <button onClick={() => setIsSavedDrawerOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">✕</button>
            </div>
            <div className="flex-grow overflow-y-auto p-8 space-y-5">
              {savedEntries.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 font-serif italic">Το καλάθι σας είναι άδειο.</p>
                </div>
              ) : (
                savedEntries.map((saved, idx) => (
                  <div key={idx} onClick={() => { setIsSavedDrawerOpen(false); handleSearchTrigger(saved.word, saved.language); }} className="group p-6 bg-white rounded-3xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg cursor-pointer transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-serif font-bold group-hover:text-indigo-600 transition-colors">{saved.displayWord}</h3>
                      <span className="text-[8px] px-2 py-0.5 bg-slate-100 rounded-full font-bold uppercase tracking-widest text-slate-400">
                        {saved.language === Language.ANCIENT_GREEK ? 'Αρχαία' : saved.language === Language.LATIN ? 'Λατινικά' : 'Νέα'}
                      </span>
                    </div>
                    <p className="text-slate-500 line-clamp-2 italic text-sm">{saved.definition}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      <PolytonicConverter />
    </div>
  );
};

export default App;
