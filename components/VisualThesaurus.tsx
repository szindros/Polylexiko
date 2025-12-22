
import React from 'react';
import { Language } from '../types';

interface VisualThesaurusProps {
  currentWord: string;
  synonyms: string[];
  antonyms: string[];
  onWordClick: (word: string) => void;
}

const VisualThesaurus: React.FC<VisualThesaurusProps> = ({ currentWord, synonyms, antonyms, onWordClick }) => {
  const hasSynonyms = synonyms.length > 0;
  const hasAntonyms = antonyms.length > 0;
  const hasContent = hasSynonyms || hasAntonyms;

  if (!hasContent) {
    return (
      <section className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-slate-400 italic font-serif text-lg">Δεν βρέθηκαν συνώνυμα ή αντώνυμα</p>
      </section>
    );
  }

  return (
    <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8 overflow-hidden relative animate-in fade-in duration-1000">
      <div className="flex flex-col items-center justify-center space-y-12 py-10">
        
        {/* Central Hub */}
        <div className="relative z-10">
          <div className="bg-indigo-600 text-white px-8 py-4 rounded-2xl shadow-xl shadow-indigo-200 border-4 border-white transform transition-transform hover:scale-105 duration-300 select-none">
            <span className="font-serif text-2xl font-bold tracking-tight">{currentWord}</span>
          </div>
          {/* Decorative Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-indigo-50 rounded-full -z-10 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-indigo-50/50 rounded-full -z-10 animate-pulse delay-75"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full relative">
          {/* Vertical Divider for Desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-100/60 -translate-x-1/2"></div>

          {/* Synonyms Column */}
          <div className="space-y-6 flex flex-col items-center md:items-end">
            <h4 className="text-emerald-600 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Συνώνυμα
            </h4>
            <div className="flex flex-wrap justify-center md:justify-end gap-3">
              {hasSynonyms ? synonyms.map((word, i) => (
                <button
                  key={i}
                  onClick={() => onWordClick(word)}
                  className="group relative px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 hover:bg-emerald-600 hover:text-white hover:shadow-xl hover:shadow-emerald-200 hover:scale-110 active:scale-95 transition-all duration-300 animate-in fade-in slide-in-from-right-4"
                  style={{ animationDelay: `${i * 75}ms` }}
                >
                  <span className="font-serif text-lg">{word}</span>
                  <span className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                </button>
              )) : (
                <p className="text-slate-300 italic text-sm">Δεν βρέθηκαν</p>
              )}
            </div>
          </div>

          {/* Antonyms Column */}
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <h4 className="text-rose-600 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
              Αντώνυμα
            </h4>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {hasAntonyms ? antonyms.map((word, i) => (
                <button
                  key={i}
                  onClick={() => onWordClick(word)}
                  className="group relative px-5 py-2.5 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 hover:bg-rose-600 hover:text-white hover:shadow-xl hover:shadow-rose-200 hover:scale-110 active:scale-95 transition-all duration-300 animate-in fade-in slide-in-from-left-4"
                  style={{ animationDelay: `${i * 75}ms` }}
                >
                  <span className="font-serif text-lg">{word}</span>
                  <span className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                </button>
              )) : (
                <p className="text-slate-300 italic text-sm">Δεν βρέθηκαν</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
         <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Κάντε κλικ σε μια λέξη για να την αναζητήσετε
         </span>
      </div>
    </section>
  );
};

export default VisualThesaurus;
