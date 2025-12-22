
import React, { useState } from 'react';
import { convertToPolytonic } from '../services/geminiService';

const PolytonicConverter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConvert = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await convertToPolytonic(input.trim());
      setOutput(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
          <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
            <h4 className="font-serif font-bold text-sm tracking-wide flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              Μετατροπέας Πολυτονικού
            </h4>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Μονοτονικό Κείμενο</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="π.χ. ανθρωπος"
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-serif resize-none"
              />
            </div>
            
            <button
              onClick={handleConvert}
              disabled={loading || !input.trim()}
              className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Μετατροπή'}
            </button>

            {output && (
              <div className="mt-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 animate-in fade-in duration-300">
                <div className="flex justify-between items-start mb-1">
                  <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Πολυτονικό</label>
                  <button 
                    onClick={copyToClipboard}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all ${copied ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}
                  >
                    {copied ? 'Αντιγράφηκε!' : 'Αντιγραφή'}
                  </button>
                </div>
                <p className="text-lg font-serif text-indigo-900 leading-relaxed break-words">
                  {output}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Βοηθητικό Εργαλείο Πολυτονικού"
        className={`h-14 w-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform ${
          isOpen ? 'bg-indigo-800 rotate-90' : 'bg-indigo-600 hover:scale-110 active:scale-95'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 border-2 border-white"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default PolytonicConverter;
