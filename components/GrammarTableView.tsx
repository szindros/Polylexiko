
import React, { useState, useMemo } from 'react';
import { GrammarTable } from '../types';

interface GrammarTableViewProps {
  table: GrammarTable;
}

const GrammarTableView: React.FC<GrammarTableViewProps> = ({ table }) => {
  // Filter out any column that might represent "Case" or "Πτώση" to keep the table clean
  const filteredColumns = useMemo(() => {
    return (table.columns || []).filter(col => {
      const c = col.toUpperCase();
      return c !== 'ΠΤΩΣΗ' && c !== 'ΠΤΩΣΕΙΣ' && c !== 'CASE' && c !== 'CASES' && c !== 'ΠΡΟΣΩΠΟ';
    });
  }, [table.columns]);

  const [visibleColumns, setVisibleColumns] = useState<string[]>(filteredColumns);
  const [showControls, setShowControls] = useState(false);

  // Toggle column visibility
  const toggleColumn = (col: string) => {
    setVisibleColumns(prev => 
      prev.includes(col) 
        ? prev.filter(c => c !== col) 
        : [...prev, col]
    );
  };

  // Determine the header label based on content
  const getHeaderLabel = () => {
    const title = table.title.toLowerCase();
    if (title.includes('ρήμα') || title.includes('verb') || title.includes('συζυγία')) {
      return 'Πρόσωπο';
    }
    return 'Πτώση';
  };

  // Ensure visibility state updates if filteredColumns change (e.g., new search)
  React.useEffect(() => {
    setVisibleColumns(filteredColumns);
  }, [filteredColumns]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm transition-all duration-300">
      <div className="bg-slate-50 px-4 md:px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
        <h3 className="text-slate-900 font-serif font-bold text-lg md:text-xl flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="truncate">{table.title}</span>
        </h3>
        
        {filteredColumns.length > 0 && (
          <button 
            onClick={() => setShowControls(!showControls)}
            className={`p-2 rounded-xl border transition-all shrink-0 ${showControls ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
            title="Φίλτρα Στηλών"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        )}
      </div>

      {/* Column Filter Controls */}
      {showControls && filteredColumns.length > 0 && (
        <div className="px-4 md:px-6 py-4 bg-indigo-50/50 border-b border-indigo-100 animate-in slide-in-from-top-2 duration-300">
          <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest block mb-3">Εμφάνιση Στηλών</span>
          <div className="flex flex-wrap gap-2">
            {filteredColumns.map((col, idx) => (
              <button
                key={idx}
                onClick={() => toggleColumn(col)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  visibleColumns.includes(col)
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
                }`}
              >
                {col}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto custom-scrollbar relative">
        <table className="w-full text-left border-collapse min-w-full table-fixed md:table-auto">
          <thead>
            <tr className="bg-slate-50/50">
              {/* Sticky Header Column */}
              <th className="sticky left-0 z-20 bg-slate-50 px-4 md:px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 min-w-[100px] md:min-w-[140px] shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                {getHeaderLabel()}
              </th>
              {filteredColumns.map((col, idx) => visibleColumns.includes(col) && (
                <th key={idx} className="px-4 md:px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center min-w-[120px]">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-slate-50/80 transition-colors group">
                {/* Sticky Row Label Column */}
                <td className="sticky left-0 z-20 px-4 md:px-6 py-4 text-xs font-bold text-slate-500 bg-white group-hover:bg-slate-50/80 whitespace-nowrap border-r border-slate-50 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                  {row.header}
                </td>
                {filteredColumns.map((col, colIdx) => visibleColumns.includes(col) && (
                  <td key={colIdx} className="px-4 md:px-6 py-4 text-center">
                    <span className="font-serif text-lg md:text-xl text-slate-800 break-words">
                      {row.cells.find(c => c.label.toLowerCase() === col.toLowerCase())?.value || '-'}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer Info */}
      <div className="px-6 py-3 bg-slate-50/30 text-[10px] text-slate-400 uppercase tracking-widest text-right border-t border-slate-100">
        <span className="hidden sm:inline">Πλήρης Γραμματική Ανάλυση &bull; </span> {visibleColumns.length} / {filteredColumns.length} Στήλες
      </div>
    </div>
  );
};

export default GrammarTableView;
