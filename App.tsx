import React from 'react';
import LyricsFinder from './components/LyricsFinder';

const App: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden relative text-slate-800 bg-[#f0f4ff]">
      
      {/* 
        Optimized Background:
        A deep, elegant gradient suitable for a modern worship app.
        Static CSS gradient is much faster than animated blurred divs.
      */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at 15% 15%, rgba(226, 232, 240, 0.8) 0%, transparent 40%),
            radial-gradient(circle at 85% 20%, rgba(216, 180, 254, 0.3) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, transparent 60%),
            radial-gradient(circle at 20% 80%, rgba(199, 210, 254, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 90%, rgba(254, 202, 202, 0.3) 0%, transparent 50%)
          `,
          backgroundColor: '#f8fafc' // Base slate-50
        }}
      />

      <main className="flex-1 flex flex-col h-full w-full relative z-10 overflow-hidden transform-gpu">
         <LyricsFinder />
      </main>
    </div>
  );
};

export default App;