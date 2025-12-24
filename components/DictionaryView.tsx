
import React from 'react';
import { DictionaryEntry, Language } from '../types';
import GrammarTableView from './GrammarTableView';
import VisualThesaurus from './VisualThesaurus';

interface DictionaryViewProps {
  entry: DictionaryEntry;
  language: Language;
  isSaved: boolean;
  onToggleSave: () => void;
  onWordNavigate: (word: string) => void;
}

const DictionaryView: React.FC<DictionaryViewProps> = ({ entry, language, isSaved, onToggleSave, onWordNavigate }) => {
  const getLanguageLabel = () => {
    switch (language) {
      case Language.ANCIENT_GREEK: return '🏛️ Αρχαία Ελληνικά';
      case Language.LATIN: return '📜 Λατινικά';
      case Language.MODERN_GREEK: return '✍️ Νέα Ελληνικά';
      default: return '';
    }
  };

  const isModernGreek = language === Language.MODERN_GREEK;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Info */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative p-8">
        <div className="absolute top-0 right-0 p-4 z-20">
          <button
            onClick={onToggleSave}
            title={isSaved ? "Αφαίρεση από τα αποθηκευμένα" : "Αποθήκευση λέξης"}
            className={`p-3 rounded-2xl transition-all duration-300 ${
              isSaved 
                ? 'bg-rose-50 text-rose-500 shadow-sm scale-110' 
                : 'bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-1 mb-8">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase rounded-full tracking-widest">
              {entry.partOfSpeech}
            </span>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              {getLanguageLabel()}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 flex-wrap">
            <h2 className="text-5xl sm:text-6xl font-serif text-slate-900 leading-tight">
              {isModernGreek ? entry.word : (entry.polytonicWord || entry.word)}
            </h2>
            {entry.adjectiveForms && (
              <span className="text-2xl sm:text-3xl font-serif text-slate-400 italic">
                ({entry.adjectiveForms})
              </span>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-slate-900 font-bold border-l-4 border-indigo-500 pl-3">Ερμηνεία</h4>
            <div className="text-lg text-slate-700 leading-relaxed font-serif whitespace-pre-wrap">
              {entry.definition}
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Etymology Section */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-slate-900 font-bold border-l-4 border-amber-400 pl-3">
            Ετυμολογία
          </h4>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Προέλευση Λέξης</span>
        </div>
        
        <div className="text-slate-700 font-serif leading-relaxed text-lg p-6 rounded-2xl border italic bg-amber-50/20 border-amber-100/50">
          {entry.etymology}
        </div>
      </section>

      <VisualThesaurus 
        currentWord={isModernGreek ? entry.word : (entry.polytonicWord || entry.word)}
        synonyms={entry.synonyms}
        antonyms={entry.antonyms}
        onWordClick={onWordNavigate}
      />

      <GrammarTableView table={entry.grammarTable} />

      {/* Examples Section */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h4 className="text-slate-900 font-bold border-l-4 border-indigo-400 pl-3 italic">Παραδείγματα Χρήσης</h4>
        <div className="space-y-6">
          {entry.examples && entry.examples.length > 0 ? (
            entry.examples.map((ex, idx) => (
              <div key={idx} className="relative pl-8 border-l-2 border-slate-100 py-1">
                <div className="absolute left-0 top-0 -translate-x-1/2 bg-white p-1 text-slate-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3L14.017 2H12.017V3C12.017 4.10457 11.1216 5 10.017 5H7.017C6.46472 5 6.017 5.44772 6.017 6V12C6.017 12.5523 6.46472 13 7.017 13H10.017C11.1216 13 12.017 13.8954 12.017 15V18L12.017 21H14.017Z" />
                  </svg>
                </div>
                <p className={`text-xl font-serif text-slate-800 leading-relaxed ${!isModernGreek ? 'italic' : ''}`}>
                  {ex.text}
                </p>
                {!isModernGreek && (
                  <p className="text-slate-500 mt-2 text-sm">
                    {ex.translation}
                  </p>
                )}
                {ex.source && (
                  <p className="text-indigo-600/60 text-xs font-bold uppercase tracking-widest mt-2 flex items-center gap-1">
                    <span className="w-4 h-px bg-indigo-100"></span> {ex.source}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-slate-400 italic">Δεν βρέθηκαν παραδείγματα.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default DictionaryView;
