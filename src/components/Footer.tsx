import React from 'react';
import { ReflectaLogo } from './ReflectaLogo';
import { Compass, Sparkles } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: 'home' | 'reflection' | 'special_rays' | 'concepts') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="w-full border-t border-slate-800 bg-[#060a14] py-10 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <ReflectaLogo size="sm" />
          <p className="text-slate-400 mt-1 text-[11px]">
            &ldquo;See the Light, Understand the Law.&rdquo;
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
          <button
            onClick={() => onSelectTab('home')}
            className="hover:text-cyan-400 transition-colors"
          >
            Beranda
          </button>
          <button
            onClick={() => onSelectTab('reflection')}
            className="hover:text-cyan-400 transition-colors"
          >
            Reflection Law Lab
          </button>
          <button
            onClick={() => onSelectTab('special_rays')}
            className="hover:text-cyan-400 transition-colors"
          >
            Special Rays Lab
          </button>
          <button
            onClick={() => onSelectTab('concepts')}
            className="hover:text-cyan-400 transition-colors"
          >
            Konsep & Miskonsepsi
          </button>
        </div>

        <div className="text-center md:text-right text-[11px] text-slate-400">
          <div>Dikembangkan oleh <span className="text-slate-200 font-semibold">Tim ANTI GRAVITASI</span></div>
          <div className="text-slate-400">Aplikasi Edukasi Fisika Optika Geometri © 2026</div>
        </div>
      </div>
    </footer>
  );
};
