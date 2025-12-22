
import React, { useState } from 'react';
import { Language } from '../types';

interface SearchBarProps {
  onSearch: (word: string, lang: Language) => void;
  selectedLanguage: Language;
  disabled: boolean;
  query: string;
  setQuery: (q: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, selectedLanguage, disabled, query, setQuery }) => {
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), selectedLanguage);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Η αναγνώριση φωνής δεν υποστηρίζεται από τον περιηγητή σας. Δοκιμάστε Chrome ή Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    
    // Set recognition language based on selected dictionary
    if (selectedLanguage === Language.LATIN) {
      recognition.lang = 'it-IT'; // Best fallback for Latin
    } else {
      recognition.lang = 'el-GR';
    }

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const cleanTranscript = transcript.replace(/\.$/, '').trim();
      setQuery(cleanTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  const getPlaceholder = () => {
    switch (selectedLanguage) {
      case Language.ANCIENT_GREEK: return "Αναζήτηση αρχαίας λέξης...";
      case Language.LATIN: return "Search Latin word...";
      case Language.MODERN_GREEK: return "Αναζήτηση λέξης στα Νέα Ελληνικά...";
      default: return "Αναζήτηση...";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={getPlaceholder()}
            disabled={disabled}
            className="w-full pl-14 pr-32 py-5 bg-white border-2 border-slate-200 rounded-2xl text-lg shadow-lg focus:outline-none focus:border-indigo-500 transition-all group-hover:border-slate-300 disabled:opacity-50 font-serif"
          />
          
          <button
            type="button"
            onClick={handleVoiceInput}
            disabled={disabled}
            title="Φωνητική Αναζήτηση"
            className={`absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all duration-300 ${
              isListening 
                ? 'bg-rose-100 text-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.4)] animate-pulse' 
                : 'bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            {isListening ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                <path d="M19 10v1a7 7 0 0 1-14 0v-1H3v1a9 9 0 0 0 8 8.93V21h2v-1.07A9 9 0 0 0 21 11v-1h-2z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={disabled || !query.trim()}
          className="absolute right-3 top-3 bottom-3 px-6 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
        >
          {disabled ? (
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <span className="hidden sm:inline">Αναζήτηση</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
