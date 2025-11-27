import React from 'react';

interface AppLogoProps {
  variant?: 'full' | 'horizontal';
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ variant = 'full', className = '' }) => {
  const isFull = variant === 'full';

  return (
    <div className={`flex flex-col items-center justify-center ${className} select-none`}>
      <h1 className={`
        font-rounded font-black text-slate-800 tracking-tight
        bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-indigo-900
        ${isFull ? 'text-5xl sm:text-6xl drop-shadow-sm' : 'text-3xl'}
      `}>
        Christian Lyrics
      </h1>
      
      {isFull && (
        <div className="mt-3 flex items-center gap-3 opacity-60">
          <div className="h-[1px] w-8 bg-indigo-400"></div>
          <p className="font-rounded font-bold text-indigo-500 text-xs tracking-[0.2em] uppercase">
            Worship Database
          </p>
          <div className="h-[1px] w-8 bg-indigo-400"></div>
        </div>
      )}
    </div>
  );
};