import React, { useState } from 'react';
import { fetchBiblePassage } from '../services/geminiService';
import { BiblePassage } from '../types';
import { Search, Globe, BookOpen, ChevronRight, Loader2, Copy, Check } from 'lucide-react';

const BibleReader: React.FC = () => {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('English');
  const [translation, setTranslation] = useState('NIV');
  const [passage, setPassage] = useState<BiblePassage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const data = await fetchBiblePassage(query, language, translation);
      setPassage(data);
    } catch (err) {
      setError("Unable to retrieve passage. Please check your connection or try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!passage) return;
    const text = `${passage.reference} (${passage.translation})\n\n${passage.text}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const languages = [
    "English", 
    "Nepali",
    "Nepali (Romanized)",
    "Spanish", 
    "French", 
    "Portuguese", 
    "German", 
    "Mandarin", 
    "Korean", 
    "Tagalog", 
    "Arabic"
  ];
  
  const translations = [
    "NIV", 
    "KJV", 
    "NNRV", 
    "ESV", 
    "NASB", 
    "NLT", 
    "Reina-Valera 1960", 
    "Louis Segond", 
    "CUV"
  ];

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col pb-12">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Holy Bible</h2>
        <p className="text-slate-500">Search scripture in Roman Nepali and other languages.</p>
      </div>

      {/* Glass Controls */}
      <div className="bg-white/60 backdrop-blur-xl p-2 rounded-[2rem] shadow-xl shadow-indigo-100 border border-white/50 mb-8">
        <form onSubmit={handleSearch} className="space-y-2 lg:space-y-0 lg:flex lg:gap-2">
          
          <div className="flex-1 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., John 3:16 or 'Love'"
              className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-white/50 border border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 text-slate-800"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative group flex-1 sm:flex-none">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full sm:w-auto pl-11 pr-10 py-4 rounded-[1.5rem] bg-white/50 border border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-100 outline-none appearance-none cursor-pointer text-slate-700 font-medium transition-all hover:bg-white/80"
              >
                {languages.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" size={14} />
            </div>

            <div className="relative group flex-1 sm:flex-none">
              <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
              <select 
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                className="w-full sm:w-auto pl-11 pr-10 py-4 rounded-[1.5rem] bg-white/50 border border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-100 outline-none appearance-none cursor-pointer text-slate-700 font-medium transition-all hover:bg-white/80"
              >
                {translations.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
               <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" size={14} />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-slate-900 text-white font-bold rounded-[1.5rem] hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-300/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px] active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Read"}
            </button>
          </div>
        </form>
      </div>

      {/* Results Area */}
      <div className="flex-1">
        {error && (
          <div className="p-6 bg-red-50/80 backdrop-blur-md text-red-600 rounded-2xl border border-red-100 mb-4 text-center">
            {error}
          </div>
        )}

        {!passage && !loading && !error && (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-white/30 backdrop-blur-md rounded-[2.5rem] border border-white/40">
            <BookOpen size={48} className="mb-4 opacity-30" />
            <p className="font-medium">Enter a reference to reveal the Word.</p>
          </div>
        )}

        {passage && (
          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white/60 overflow-hidden animate-fade-in relative">
            
            {/* Header */}
            <div className="bg-white/50 border-b border-white/50 p-6 sm:p-8 flex justify-between items-start">
              <div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-1">{passage.reference}</h3>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wide">{passage.translation}</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wide">{passage.language}</span>
                </div>
              </div>
              <button 
                onClick={copyToClipboard}
                className="p-3 bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm border border-slate-100"
                title="Copy Passage"
              >
                {copied ? <Check size={20} className="text-green-500"/> : <Copy size={20} />}
              </button>
            </div>
            
            <div className="p-8 sm:p-12">
               <div className="prose prose-xl max-w-none prose-slate">
                 <p className="font-serif leading-loose text-slate-800 whitespace-pre-wrap">
                   {passage.text}
                 </p>
               </div>
               
               {passage.summary && (
                 <div className="mt-12 pt-8 border-t border-slate-200/50">
                   <div className="flex items-center gap-2 mb-3">
                     <div className="w-1 h-4 bg-indigo-400 rounded-full"></div>
                     <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Context & Insight</h4>
                   </div>
                   <p className="text-slate-600 italic bg-white/50 p-6 rounded-2xl border border-white/50">{passage.summary}</p>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BibleReader;