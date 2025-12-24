
import React, { useState, useMemo, useEffect } from 'react';
import { GrammarTable } from '../types';

interface GrammarTableViewProps {
  table: GrammarTable;
}

const GrammarTableView: React.FC<GrammarTableViewProps> = ({ table }) => {
  // 1. Φιλτράρισμα στηλών: Αφαιρούμε μόνο τις στήλες που λειτουργούν ως "πρώτη στήλη" (πτώσεις/πρόσωπα)
  const filteredColumns = useMemo(() => {
    if (!table.columns) return [];
    const blacklist = ['ΠΤΩΣΗ', 'ΠΤΩΣΕΙΣ', 'CASE', 'CASES', 'ΠΡΟΣΩΠΟ', 'PERSON'];
    return table.columns.filter(col => !blacklist.includes(col.toUpperCase()));
  }, [table.columns]);

  const [visibleColumns, setVisibleColumns] = useState<string[]>(filteredColumns);
  const [showControls, setShowControls] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Επαναφορά ορατών στηλών όταν αλλάζει η λέξη
  useEffect(() => {
    setVisibleColumns(filteredColumns);
  }, [filteredColumns]);

  const toggleColumn = (col: string) => {
    setVisibleColumns(prev => 
      prev.includes(col) 
        ? (prev.length > 1 ? prev.filter(c => c !== col) : prev) 
        : [...prev, col]
    );
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolled(e.currentTarget.scrollLeft > 15);
  };

  const getHeaderLabel = () => {
    const title = (table.title || "").toLowerCase();
    if (title.includes('ρήμα') || title.includes('verb')) return 'Πρόσωπο';
    return 'Πτώση';
  };

  if (!table.rows || table.rows.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm transition-all duration-300">
      {/* Header Area */}
      <div className="bg-slate-50/80 px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-indigo-600 rounded-xl shrink-0 shadow-lg shadow-indigo-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-slate-900 font-serif font-bold text-lg md:text-xl truncate">
            {table.title || "Πίνακας Κλίσης"}
          </h3>
        </div>
        
        {filteredColumns.length > 1 && (
          <button 
            onClick={() => setShowControls(!showControls)}
            className={`p-2 rounded-xl border transition-all flex items-center gap-2 shrink-0 ${
              showControls 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Προσαρμογη</span>
          </button>
        )}
      </div>

      {/* Column Selectors */}
      {showControls && filteredColumns.length > 0 && (
        <div className="p-4 bg-indigo-50/40 border-b border-indigo-100 animate-in slide-in-from-top-2">
          <p className="text-[9px] font-black text-indigo-900/40 uppercase tracking-[0.2em] mb-3">Επιλέξτε στήλες για εμφάνιση</p>
          <div className="flex flex-wrap gap-2">
            {filteredColumns.map((col, idx) => (
              <button
                key={idx}
                onClick={() => toggleColumn(col)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all border ${
                  visibleColumns.includes(col)
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-200'
                }`}
              >
                {col}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div 
        className="overflow-x-auto custom-scrollbar relative"
        onScroll={handleScroll}
      >
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/50">
              {/* Sticky Top-Left Corner */}
              <th className={`sticky left-0 top-0 z-30 bg-slate-50 px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-r border-slate-100 text-left transition-shadow ${isScrolled ? 'shadow-[4px_0_8px_-2px_rgba(0,0,0,0.05)]' : ''}`}>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                  {getHeaderLabel()}
                </div>
              </th>
              {/* Other Column Headers */}
              {filteredColumns.map((col, idx) => visibleColumns.includes(col) && (
                <th key={idx} className="sticky top-0 z-20 px-6 py-4 bg-slate-50/90 backdrop-blur-sm text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-center min-w-[140px] whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {table.rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="group hover:bg-slate-50/50 transition-colors">
                {/* Sticky Left Case/Person labels */}
                <td className={`sticky left-0 z-10 px-5 py-5 bg-white text-[11px] font-black text-slate-500 border-b border-r border-slate-50 group-hover:bg-slate-50/80 transition-shadow ${isScrolled ? 'shadow-[4px_0_8px_-2px_rgba(0,0,0,0.05)]' : ''}`}>
                  {row.header}
                </td>
                {/* Data cells */}
                {filteredColumns.map((col, colIdx) => {
                  if (!visibleColumns.includes(col)) return null;
                  
                  // Προσπάθεια εύρεσης με ακριβές label ή index αν αποτύχει το label
                  let cell = row.cells.find(c => c.label.toLowerCase() === col.toLowerCase());
                  if (!cell && row.cells[colIdx]) cell = row.cells[colIdx];

                  return (
                    <td key={colIdx} className="px-6 py-5 text-center border-b border-slate-50">
                      <span className="font-serif text-lg md:text-xl text-slate-800 leading-tight block">
                        {cell ? cell.value : '—'}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Shadow Overlay Hint for Mobile */}
        {!isScrolled && filteredColumns.length > 1 && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/80 to-transparent pointer-events-none md:hidden flex items-center justify-end pr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300 animate-bounce-x" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-5 py-3 bg-slate-50/30 flex items-center justify-between border-t border-slate-100">
        <div className="flex items-center gap-2">
           <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Εγκυρη Γραμματικη Αναλυση</span>
        </div>
        <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
           {visibleColumns.length} στηλες ορατες
        </div>
      </div>
      
      <style>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default GrammarTableView;
