import React from 'react';
import { BookOpen, Music, MessageCircle, Home, Menu, X, Sparkles } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Home', icon: Home },
    { id: AppView.BIBLE, label: 'Bible', icon: BookOpen },
    { id: AppView.LYRICS, label: 'Worship', icon: Music },
    { id: AppView.SERMON_ASSISTANT, label: 'AI Pastor', icon: MessageCircle },
  ];

  const handleNavClick = (view: AppView) => {
    setView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header - Glass */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-white/70 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-6 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Sparkles size={20} fill="white" />
          </div>
          <span className="font-bold text-slate-800 text-xl tracking-tight">Anugrah</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 hover:bg-black/5 rounded-full transition-colors">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar / Drawer - Glass */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 transform-gpu transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
        lg:translate-x-0 lg:static lg:h-screen lg:bg-transparent
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Sidebar Background */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-2xl lg:hidden border-r border-white/20"></div>

        {/* Desktop Sidebar Background */}
        <div className="hidden lg:block absolute inset-y-4 left-4 right-0 bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl shadow-indigo-100/50"></div>

        <div className="relative h-full flex flex-col p-4 lg:p-8">
          <div className="h-20 flex items-center px-2 mb-6 hidden lg:flex">
             <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 mr-3">
               <Sparkles size={20} fill="white" />
             </div>
             <div>
               <h1 className="font-bold text-slate-800 text-xl leading-none">Anugrah</h1>
               <span className="text-xs text-slate-500 font-medium tracking-wide">CHURCH</span>
             </div>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-200 group
                    ${isActive 
                      ? 'bg-white shadow-lg shadow-indigo-100 text-indigo-600 font-semibold scale-100' 
                      : 'text-slate-500 hover:bg-white/50 hover:text-slate-900 hover:scale-[1.02]'}
                  `}
                >
                  <Icon 
                    size={22} 
                    className={`transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group cursor-default">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mt-10 -mr-10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-2">Verse of the Day</p>
              <p className="font-serif text-sm italic mb-3 leading-relaxed">"The Lord is my shepherd; I shall not want."</p>
              <p className="text-xs font-bold opacity-90">- Psalm 23:1</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;