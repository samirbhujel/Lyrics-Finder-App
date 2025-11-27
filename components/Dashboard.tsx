import React, { useEffect, useState } from 'react';
import { generateDailyDevotional } from '../services/geminiService';
import { DailyDevotional, AppView } from '../types';
import { Sun, ArrowRight, Book, Loader2, Heart, Sparkles, Mic2 } from 'lucide-react';

interface DashboardProps {
  onChangeView: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onChangeView }) => {
  const [devotional, setDevotional] = useState<DailyDevotional | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadDevotional = async () => {
      try {
        const data = await generateDailyDevotional();
        if (isMounted) {
          setDevotional(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load devotional", error);
        if (isMounted) setLoading(false);
      }
    };
    
    loadDevotional();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="font-bold text-3xl md:text-4xl text-slate-800 tracking-tight">
            Welcome to Anugrah
          </h1>
          <p className="text-slate-500 text-lg mt-1">
            Your spiritual companion for today.
          </p>
        </div>
        <div className="text-sm font-medium bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 text-slate-600 shadow-sm self-start md:self-auto">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Daily Devotional - Left Large Column */}
        <div className="lg:col-span-8">
          <div className="h-full bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
            <div className="p-8 pb-0">
               <div className="flex items-center space-x-2 text-indigo-600 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-full">
                    <Sun size={18} />
                  </div>
                  <span className="text-sm font-bold tracking-wide uppercase">Daily Devotional</span>
               </div>
               
               {loading ? (
                 <div className="space-y-4">
                   <div className="h-10 w-3/4 bg-slate-200/50 animate-pulse rounded-xl"></div>
                   <div className="h-6 w-1/2 bg-slate-200/50 animate-pulse rounded-xl"></div>
                 </div>
               ) : (
                 <h2 className="font-serif text-3xl font-bold text-slate-800 leading-tight">{devotional?.title}</h2>
               )}
            </div>
            
            <div className="p-8 flex-1 flex flex-col space-y-6">
              {loading ? (
                 <div className="flex-1 flex justify-center items-center min-h-[200px]">
                   <Loader2 className="animate-spin text-indigo-500" size={32} />
                 </div>
              ) : (
                <>
                  <div className="bg-indigo-50/50 backdrop-blur-sm p-6 rounded-2xl border border-indigo-100/50">
                    <p className="font-serif text-lg text-slate-700 italic mb-3">"{devotional?.scripture}"</p>
                    <div className="flex items-center space-x-2">
                       <div className="h-[1px] w-8 bg-indigo-300"></div>
                       <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Scripture Focus</p>
                    </div>
                  </div>

                  <div className="prose prose-slate prose-lg max-w-none">
                    <p className="text-slate-600 leading-relaxed">{devotional?.content}</p>
                  </div>

                  <div className="mt-auto bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl border border-white/50">
                    <div className="flex items-start gap-3">
                      <Heart size={20} className="text-purple-500 shrink-0 mt-1" fill="currentColor" fillOpacity={0.2} />
                      <div>
                        <h3 className="text-purple-900 font-bold text-sm uppercase tracking-wide mb-1">Prayer</h3>
                        <p className="text-slate-700 italic text-sm md:text-base">{devotional?.prayer}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <button 
            onClick={() => onChangeView(AppView.BIBLE)}
            className="group relative flex-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-200 hover:shadow-2xl hover:shadow-blue-300 transition-all duration-300 overflow-hidden text-left"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mt-8 -mr-8 blur-2xl group-hover:scale-150 transition-transform"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                <Book size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-2xl mb-1">Bible</h3>
                <p className="text-blue-100 text-sm font-medium mb-4">Read Roman Nepali & more</p>
                <div className="flex items-center text-sm font-bold bg-white/20 w-fit px-4 py-2 rounded-full backdrop-blur-md group-hover:bg-white group-hover:text-blue-600 transition-all">
                  Open Reader
                </div>
              </div>
            </div>
          </button>

          <button 
            onClick={() => onChangeView(AppView.SERMON_ASSISTANT)}
            className="group relative bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2rem] p-6 shadow-xl shadow-slate-100 transition-all hover:bg-white/80 hover:scale-[1.02] text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                <Sparkles size={22} />
              </div>
              <ArrowRight size={20} className="text-slate-300 group-hover:text-purple-500 transition-colors" />
            </div>
            <h3 className="font-bold text-slate-800 text-xl">AI Pastor</h3>
            <p className="text-slate-500 text-sm mt-1">Ask theological questions</p>
          </button>

          <button 
            onClick={() => onChangeView(AppView.LYRICS)}
            className="group relative bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2rem] p-6 shadow-xl shadow-slate-100 transition-all hover:bg-white/80 hover:scale-[1.02] text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600">
                <Mic2 size={22} />
              </div>
              <ArrowRight size={20} className="text-slate-300 group-hover:text-rose-500 transition-colors" />
            </div>
            <h3 className="font-bold text-slate-800 text-xl">Worship</h3>
            <p className="text-slate-500 text-sm mt-1">Find lyrics & themes</p>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;