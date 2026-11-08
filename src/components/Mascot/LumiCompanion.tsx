import React, { useState, useEffect } from 'react';
import { Sparkles, X, ChevronRight, Lightbulb, MessageSquare, Award, RefreshCw, Volume2 } from 'lucide-react';

interface LumiCompanionProps {
  activeLab?: 'home' | 'reflection' | 'special_rays' | 'concepts';
  currentStep?: number;
  mirrorType?: string;
  isVirtual?: boolean;
}

const OPTICS_TIPS = {
  home: [
    'Halo Teman Fisika! Aku Lumi, maskot lab REFLECTA dari Tim Anti Gravitasi! Siap bereksperimen bersamaku?',
    'Miskonsepsi terbesar: banyak yang mengira hukum pantul cuma untuk cermin datar. Di lab ini kamu akan buktikan bahwa itu berlaku di SEMUA bentuk!',
    'Klik "Mulai Praktikum 2 Sinar" untuk membuktikan bahwa sudut datang i selalu sama dengan sudut pantul r!',
    'Sudah membaca penjelasan materi? Yuk uji pemahamanmu di Quiz Mode di bawah materi dan raih skor 600 poin sempurna!',
  ],
  reflection: [
    'Tips Lumi: Coba klik langsung salah satu titik sudut (A, B, C) di kanvas untuk melihat rekonstruksi 2 sinar!',
    'Tarik garis normal N dari Titik O! Perhatikan bahwa garis normal selalu tegak lurus 90° menembus permukaan cermin.',
    'Cobalah pilih bentuk Bintang atau Bentuk Bebas, lalu geser titik sudutnya. Kamu akan melihat bayangan tetap terbentuk sempurna!',
    'Dua sinar datang dengan arah berbeda akan menghasilkan dua sinar pantul yang berpotongan di satu titik bayangan maya!',
    'Ingin layar lebih lega? Tekan tombol "Perbesar Kanvas" atau geser garis pembatas ke kanan!',
  ],
  special_rays: [
    'Tips Lumi: Geser benda ke depan titik Fokus (s < f) untuk melihat bayangan maya yang tegak dan diperbesar!',
    'Sinar istimewa 1 yang sejajar sumbu utama akan selalu dipantulkan melewati titik fokus F.',
    'Pada cermin cembung, titik fokus F dan pusat C berada di belakang cermin (ruang maya), sehingga bayangannya selalu maya, tegak, dan diperkecil!',
    'Gunakan tombol preset di atas kanvas untuk melompat langsung ke kondisi bayangan maya atau nyata!',
  ],
  concepts: [
    'Ingat rumus emas Hukum Snellius Pemantulan: Sudut Datang (i) = Sudut Pantul (r) dihitung dari garis normal N!',
    'Bayangan maya dibentuk oleh perpanjangan sinar pantul di belakang cermin dan tidak dapat ditangkap oleh layar.',
    'Tim Anti Gravitasi merancang simulasi ini agar kamu bisa belajar fisika dengan gembira dan tanpa pusing!',
  ],
};

export const LumiCompanion: React.FC<LumiCompanionProps> = ({
  activeLab = 'home',
  currentStep = 0,
  mirrorType,
  isVirtual,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const [isWaving, setIsWaving] = useState(false);

  const tips = OPTICS_TIPS[activeLab] || OPTICS_TIPS.home;

  // Change tip index safely when activeLab changes
  useEffect(() => {
    setTipIndex(0);
  }, [activeLab]);

  const handleNextTip = () => {
    setIsWaving(true);
    setTipIndex((prev) => (prev + 1) % tips.length);
    setTimeout(() => setIsWaving(false), 600);
  };

  return (
    <aside
      aria-label="Panduan Maskot Lumi"
      className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 pointer-events-none select-none max-w-[92vw] sm:max-w-md"
    >
      <div className="pointer-events-auto flex items-end justify-end gap-2">
        {/* Dialogue Card */}
        {isOpen && (
          <div className="bg-white/95 backdrop-blur-md border-2 border-sky-300 rounded-2xl shadow-xl p-3.5 sm:p-4 text-slate-800 transition-all duration-300 transform scale-100 origin-bottom-right max-w-[280px] sm:max-w-[340px]">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-sky-100 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
                <span className="text-xs font-extrabold text-sky-900 tracking-wide font-display">LUMI &bull; Maskot Optik</span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-amber-200">
                  Teman Belajar
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-100 transition-colors"
                title="Sembunyikan Lumi"
                aria-label="Tutup pesan Lumi"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content speech */}
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              &ldquo;{tips[tipIndex]}&rdquo;
            </p>

            {/* Quick action footer */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px]">
              <button
                onClick={handleNextTip}
                className="flex items-center gap-1 text-sky-600 hover:text-sky-800 font-bold hover:underline transition-all cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Tips Lainnya ({tipIndex + 1}/{tips.length})</span>
              </button>
              <span className="text-[10px] text-slate-400 font-mono">Anti Gravitasi</span>
            </div>
          </div>
        )}

        {/* Mascot Avatar Button */}
        <button
          onClick={() => {
            if (!isOpen) {
              setIsOpen(true);
              handleNextTip();
            } else {
              handleNextTip();
            }
          }}
          className={`relative group shrink-0 rounded-full p-1 bg-gradient-to-tr from-sky-400 via-indigo-500 to-amber-400 shadow-lg hover:shadow-sky-400/50 hover:scale-105 active:scale-95 transition-all cursor-pointer ${
            isWaving ? 'rotate-6' : ''
          }`}
          title={isOpen ? 'Klik Lumi untuk tips berikutnya!' : 'Klik untuk memunculkan Lumi!'}
          aria-label="Maskot Lumi"
        >
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white bg-sky-900 shadow-inner flex items-center justify-center">
            <img
              src="/src/assets/images/reflecta_mascot_lumi_1794128572379.jpg"
              alt="Maskot Lumi REFLECTA"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* Glowing Badge Notification */}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[9px] text-white font-bold items-center justify-center border border-white">
                💡
              </span>
            </span>
          )}

          {/* Mascot Label on Hover */}
          <span className="sr-only">Lumi Maskot</span>
        </button>
      </div>
    </aside>
  );
};
