import React from 'react';
import { SphericalCalculationResult, generateCurvedMirrorCSV } from '../../utils/opticsMath';
import { CurvedMirrorType } from '../../types/physics';
import { Download, Calculator, CheckCircle2, BookOpen } from 'lucide-react';

interface FormulaExplanationProps {
  mirrorType: CurvedMirrorType;
  calcResult: SphericalCalculationResult;
}

export const FormulaExplanation: React.FC<FormulaExplanationProps> = ({
  mirrorType,
  calcResult,
}) => {
  const {
    focalLength,
    objectDistance,
    objectHeight,
    imageDistance,
    imageHeight,
    magnification,
    isReal,
    isVirtual,
    isUpright,
    isInverted,
    isMagnified,
    isDiminished,
    isSameSize,
    objectRoom,
    imageRoom,
    isAtInfinity,
  } = calcResult;

  const handleDownloadCSV = () => {
    const csvContent = generateCurvedMirrorCSV(
      mirrorType,
      Math.abs(focalLength),
      objectDistance,
      objectHeight,
      calcResult
    );
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `REFLECTA_Cermin_${mirrorType === 'concave' ? 'Cekung' : 'Cembung'}_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-indigo-600" />
          <h3 className="font-display text-base font-bold text-slate-900">
            Analisis Matematis & Rumus Optika Geometri
          </h3>
        </div>

        <button
          onClick={handleDownloadCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Unduh Data CSV</span>
        </button>
      </div>

      {/* Grid of Results & Calculation Walkthrough */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Step-by-Step Derivation */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Substitusi Rumus Cermin Sferis</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 font-mono text-xs">
            {/* Mirror Formula */}
            <div className="text-slate-800">
              <span className="text-slate-500 block text-[11px]">1. Persamaan Umum Cermin:</span>
              <span className="text-indigo-600 font-bold">1 / f = 1 / s_o + 1 / s_i</span>
            </div>

            {/* Substitution */}
            <div className="text-slate-800">
              <span className="text-slate-500 block text-[11px]">2. Memasukkan Nilai Input:</span>
              <span>
                1 / ({focalLength}) = 1 / ({objectDistance}) + 1 / s_i
              </span>
            </div>

            {/* Rearrangement */}
            <div className="text-slate-800">
              <span className="text-slate-500 block text-[11px]">3. Menghitung Jarak Bayangan (s_i):</span>
              {isAtInfinity ? (
                <span className="text-amber-600 font-bold">s_o = f &rarr; s_i = &infin; (Tak terhingga)</span>
              ) : (
                <span>
                  1 / s_i = (1 / {focalLength}) - (1 / {objectDistance}) &rarr;{' '}
                  <strong className="text-indigo-700 font-bold">s_i = {imageDistance} px</strong>
                </span>
              )}
            </div>

            {/* Magnification */}
            <div className="text-slate-800">
              <span className="text-slate-500 block text-[11px]">4. Perbesaran Linear (M):</span>
              {isAtInfinity ? (
                <span className="text-amber-600 font-bold">M = &infin;</span>
              ) : (
                <span>
                  M = - (s_i / s_o) = - ({imageDistance} / {objectDistance}) ={' '}
                  <strong className="text-indigo-700 font-bold">{magnification}x</strong>
                </span>
              )}
            </div>

            {/* Image Height */}
            <div className="text-slate-800">
              <span className="text-slate-500 block text-[11px]">5. Tinggi Bayangan (h_i):</span>
              {isAtInfinity ? (
                <span className="text-amber-600 font-bold">h_i = &infin;</span>
              ) : (
                <span>
                  h_i = M &times; h_o = {magnification} &times; {objectHeight} ={' '}
                  <strong className="text-indigo-700 font-bold">{imageHeight} px</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Sifat-Sifat Bayangan (Image Characteristics) */}
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Karakteristik & Sifat Bayangan Akhir
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Characteristic 1: Real vs Virtual */}
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 block">Sifat Keberadaan</span>
              <span className={`text-sm font-bold font-mono ${isReal ? 'text-cyan-400' : 'text-purple-400'}`}>
                {isAtInfinity ? 'Tak Terhingga (∞)' : isReal ? 'NYATA (Di depan cermin)' : 'MAYA (Di belakang cermin)'}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {isReal ? 'Dapat ditangkap layar' : 'Hanya tampak di dalam cermin'}
              </span>
            </div>

            {/* Characteristic 2: Upright vs Inverted */}
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 block">Orientasi Arah</span>
              <span className={`text-sm font-bold font-mono ${isUpright ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isAtInfinity ? '-' : isUpright ? 'TEGAK (h > 0)' : 'TERBALIK (h < 0)'}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {isUpright ? 'Searah dengan benda asli' : 'Menghadap ke bawah'}
              </span>
            </div>

            {/* Characteristic 3: Size */}
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 block">Ukuran Dimensi</span>
              <span className="text-sm font-bold font-mono text-indigo-300">
                {isAtInfinity
                  ? 'Tak Terhingga'
                  : isMagnified
                  ? 'DIPERBESAR (|M| > 1)'
                  : isDiminished
                  ? 'DIPERKECIL (|M| < 1)'
                  : 'SAMA BESAR (|M| = 1)'}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Faktor skala: {Math.abs(magnification)}x
              </span>
            </div>

            {/* Characteristic 4: Rooms */}
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 block">Hukum Esbach (Jumlah Ruang = 5)</span>
              <span className="text-xs font-bold font-mono text-slate-200 block">
                {objectRoom} &rarr; {imageRoom}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Ruang Benda + Ruang Bayangan = 5 (untuk cermin cekung)
              </span>
            </div>
          </div>

          {/* Quick Concept Note */}
          <div className="p-3 bg-indigo-950/30 border border-indigo-500/30 rounded-xl text-xs text-indigo-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              Pada <strong>cermin cembung</strong>, bayangan selalu bersifat <strong>maya, tegak, dan diperkecil</strong> di mana pun benda diletakkan di depan cermin. Pada <strong>cermin cekung</strong>, sifat bayangan bergantung pada ruang posisi benda terhadap titik fokus (F) dan titik pusat kelengkungan (C).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
