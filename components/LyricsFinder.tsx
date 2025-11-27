import React, { useState } from 'react';
import { fetchSongLyrics } from '../services/geminiService';
import { SongLyrics } from '../types';
import { Search, Mic2, Tag, Loader2, Copy, Check, Disc, Link as LinkIcon, Sparkles, ArrowRight } from 'lucide-react';
import { AppLogo } from './AppLogo';

const LyricsFinder: React.FC = () => {
  const [query, setQuery] = useState('');
  const [song, setSong] = useState<SongLyrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent, manualQuery?: string) => {
    if (e) e.preventDefault();
    const searchTerm = manualQuery || query;
    if (!searchTerm.trim()) return;

    // Update query state if manualQuery was passed (e.g. from chips)
    if (manualQuery) setQuery(manualQuery);

    setLoading(true);
    setCopied(false);
    setHasSearched(true);
    setSong(null); // Clear previous song while loading

    try {
      const data = await fetchSongLyrics(searchTerm);
      setSong(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!song) return;
    const text = `${song.title} - ${song.artist}\n\n${song.lyrics}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const popularSongs = [
    "Way Maker",
    "10,000 Reasons",
    "Ko Ho Ma (Nepali)",
    "Aru Kohi Chaina"
  ];

  return (
    <div className="h-full overflow-y-auto w-full scroll-smooth">
      <div className={`
        min-h-full flex flex-col transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
        ${hasSearched ? 'justify-start pt-6 pb-12' : 'justify-center pb-20'}
      `}>
        
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 relative z-20">
          
          {/* Header Section */}
          <div className={`transition-all duration-700 ${hasSearched ? 'mb-6' : 'mb-14 scale-110'}`}>
             <AppLogo variant={hasSearched ? 'horizontal' : 'full'} />
          </div>

          {/* Search Bar - Transitions */}
          <div className={`
            bg-white/70 backdrop-blur-xl p-2 rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-white/60 transition-all duration-500
            ${hasSearched ? 'mx-auto max-w-2xl' : 'mx-auto max-w-2xl'}
          `}>
            <form onSubmit={(e) => handleSearch(e)} className="flex items-center">
              <div className="pl-6 text-slate-400">
                <Search size={22} />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search song title or lyrics..."
                className="flex-1 px-4 py-4 outline-none text-lg text-slate-800 placeholder:text-slate-400 bg-transparent"
              />
              <button 
                type="submit" 
                disabled={loading || !query.trim()}
                className="m-1 px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-[1.6rem] font-bold transition-all disabled:opacity-50 active:scale-95 flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><span className="hidden sm:inline">Search</span><ArrowRight size={20} className="sm:hidden" /></>}
              </button>
            </form>
          </div>

          {/* Popular Chips - Only visible when not searched */}
          {!hasSearched && (
            <div className="mt-10 flex flex-wrap justify-center gap-2 animate-fade-in-up">
              <span className="text-sm font-semibold text-slate-400 mr-2 py-2">Popular:</span>
              {popularSongs.map(s => (
                <button 
                  key={s}
                  onClick={() => handleSearch(undefined, s)}
                  className="px-4 py-2 bg-white/50 hover:bg-white text-slate-600 hover:text-indigo-600 rounded-full text-sm font-medium border border-white/60 shadow-sm transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 mt-8 animate-fade-in pb-12">
            
            {loading && !song && (
              <div className="flex flex-col items-center justify-center py-20">
                 <Loader2 size={40} className="text-indigo-500 animate-spin mb-4" />
                 <p className="text-slate-500 font-medium">Searching hymnals & web...</p>
              </div>
            )}

            {song && (
              <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white/80 overflow-hidden relative">
                
                {/* Header Card */}
                <div className="bg-slate-900 p-8 sm:p-10 text-white relative overflow-hidden">
                   {/* Decorative elements */}
                   <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500 opacity-20 rounded-full -mt-20 -mr-20 blur-[80px]"></div>
                   <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500 opacity-20 rounded-full -mb-10 -ml-10 blur-[60px]"></div>

                   <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-6">
                     <div className="flex items-start gap-6">
                       <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-inner shrink-0">
                         <Disc size={32} className="opacity-80" />
                       </div>
                       <div>
                         <h2 className="text-3xl font-bold mb-2 leading-tight">{song.title}</h2>
                         <div className="flex items-center space-x-2 text-indigo-200">
                           <Mic2 size={16} />
                           <span className="text-lg font-medium">{song.artist}</span>
                         </div>
                       </div>
                     </div>
                     
                     <button 
                      onClick={copyToClipboard}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-md border border-white/10 self-end sm:self-start group"
                      title="Copy Lyrics"
                     >
                       {copied ? <Check size={20} className="text-green-400"/> : <Copy size={20} className="group-hover:scale-110 transition-transform" />}
                     </button>
                   </div>
                   
                   {/* Themes Chips */}
                   <div className="relative z-10 flex flex-wrap gap-2 mt-8">
                      {song.themes.map((theme, i) => (
                        <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-indigo-100 rounded-lg text-xs font-bold uppercase tracking-wider">
                          {theme}
                        </span>
                      ))}
                   </div>
                </div>

                {/* Lyrics Content */}
                <div className="p-8 sm:p-12 bg-gradient-to-b from-white to-slate-50">
                  <div className="whitespace-pre-wrap font-serif text-xl text-slate-700 leading-loose text-center max-w-2xl mx-auto">
                    {song.lyrics}
                  </div>

                  {/* Sources Footer */}
                  {song.sources && song.sources.length > 0 && (
                    <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col items-center">
                      <div className="flex items-center gap-2 mb-4 text-slate-400">
                        <LinkIcon size={14} />
                        <span className="text-xs font-bold uppercase tracking-wider">Verified Sources</span>
                      </div>
                      <div className="flex flex-wrap justify-center gap-3">
                        {song.sources.map((source, idx) => (
                          <a 
                            key={idx}
                            href={source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-slate-500 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 px-3 py-1.5 rounded-lg transition-all shadow-sm truncate max-w-[200px]"
                          >
                            {new URL(source).hostname.replace('www.', '')}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LyricsFinder;