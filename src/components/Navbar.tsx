import React from 'react';
import { ReflectaLogo } from './ReflectaLogo';
import { FileDown, Sparkles, Home, Microscope, Compass, BookOpen } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'reflection' | 'special_rays' | 'concepts';
  onSelectTab: (tab: 'home' | 'reflection' | 'special_rays' | 'concepts') => void;
  onOpenExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenExport,
}) => {
  return (
    <>
      {/* Top Header Bar (Height: 56px) */}
      <header className="sticky top-0 z-40 w-full h-14 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs flex items-center">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 px-3 sm:px-6">
          {/* Zone 1: Brand wordmark & Team Anti Gravitasi */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectTab('home')}
              className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-lg shrink-0 cursor-pointer"
              aria-label="Kembali ke Beranda REFLECTA"
            >
              <ReflectaLogo size="sm" />
            </button>
            <span className="hidden xl:inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Anti Gravitasi
            </span>
          </div>

          {/* Zone 2: Desktop Navigation Links (Hidden on mobile phones) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 text-xs font-semibold overflow-x-auto py-1">
            <button
              onClick={() => onSelectTab('home')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>🏠 Dasbor Edukasi</span>
            </button>

            <button
              onClick={() => onSelectTab('reflection')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'reflection'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              🔬 Lab Praktikum Refleksi
            </button>

            <button
              onClick={() => onSelectTab('special_rays')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'special_rays'
                  ? 'bg-indigo-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              📐 Sinar Istimewa
            </button>

            <button
              onClick={() => onSelectTab('concepts')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'concepts'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              💡 Fakta &amp; Miskonsepsi
            </button>
          </nav>

          {/* Zone 3: Actions & Mascot Greeting */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mascot Avatar Pill */}
            <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 px-2 py-1 rounded-full text-xs font-bold text-sky-800 shadow-2xs">
              <div className="w-5 h-5 rounded-full overflow-hidden border border-sky-400">
                <img
                  src="/src/assets/images/reflecta_mascot_lumi_1794128572379.jpg"
                  alt="Lumi"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="hidden sm:inline">Hai, aku Lumi!</span>
              <span className="sm:hidden">Lumi</span>
            </div>

            {/* Export Report Button */}
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs transition-all active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ekspor Laporan</span>
              <span className="sm:hidden">Ekspor</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Visible only on smartphones < md) */}
      <nav
        aria-label="Navigasi Bawah Smartphone"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around select-none"
      >
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'text-sky-600 font-bold bg-sky-50 scale-105'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Dasbor</span>
        </button>

        <button
          onClick={() => onSelectTab('reflection')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'reflection'
              ? 'text-sky-600 font-bold bg-sky-50 scale-105'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <Microscope className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Refleksi 2 Sinar</span>
        </button>

        <button
          onClick={() => onSelectTab('special_rays')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'special_rays'
              ? 'text-indigo-600 font-bold bg-indigo-50 scale-105'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Sinar Lengkung</span>
        </button>

        <button
          onClick={() => onSelectTab('concepts')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'concepts'
              ? 'text-emerald-600 font-bold bg-emerald-50 scale-105'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Miskonsepsi</span>
        </button>
      </nav>
    </>
  );
};
