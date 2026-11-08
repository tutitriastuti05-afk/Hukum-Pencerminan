import React, { useState } from 'react';
import { CurvedMirrorType, CurvedVisibility } from '../../types/physics';
import { SphericalCalculationResult, generateCurvedMirrorCSV } from '../../utils/opticsMath';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  Calculator,
  Eye,
  Download,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface CurvedControlsProps {
  mirrorType: CurvedMirrorType;
  setMirrorType: (t: CurvedMirrorType) => void;
  focalLength: number;
  setFocalLength: (f: number) => void;
  objectDistance: number;
  setObjectDistance: (s: number) => void;
  objectHeight: number;
  setObjectHeight: (h: number) => void;
  ray1Active: boolean;
  setRay1Active: (v: boolean) => void;
  ray2Active: boolean;
  setRay2Active: (v: boolean) => void;
  ray3Active: boolean;
  setRay3Active: (v: boolean) => void;
  visibility: CurvedVisibility;
  setVisibility: React.Dispatch<React.SetStateAction<CurvedVisibility>>;
  isAnimated: boolean;
  setIsAnimated: (v: boolean) => void;
  onReset: () => void;
  calcResult: SphericalCalculationResult;
}

export const CurvedControls: React.FC<CurvedControlsProps> = ({
  mirrorType,
  setMirrorType,
  focalLength,
  setFocalLength,
  objectDistance,
  setObjectDistance,
  objectHeight,
  setObjectHeight,
  ray1Active,
  setRay1Active,
  ray2Active,
  setRay2Active,
  ray3Active,
  setRay3Active,
  visibility,
  setVisibility,
  isAnimated,
  setIsAnimated,
  onReset,
  calcResult,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'adjust' | 'formula' | 'layers'>('presets');

  const toggleVisibility = (key: keyof CurvedVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleShowAll = () => {
    setVisibility({
      showPrincipalAxis: true,
      showFocalPoint: true,
      showCenterPoint: true,
      showVertexPoint: true,
      showVirtualExtensions: true,
      showFinalImage: true,
      showRayLabels: true,
      showZones: true,
    });
    setRay1Active(true);
    setRay2Active(true);
    setRay3Active(true);
  };

  const handleHideAll = () => {
    setVisibility({
      showPrincipalAxis: true,
      showFocalPoint: false,
      showCenterPoint: false,
      showVertexPoint: false,
      showVirtualExtensions: false,
      showFinalImage: false,
      showRayLabels: false,
      showZones: false,
    });
  };

  const applyPreset = (preset: 'ruang1' | 'ruang2' | 'titikC' | 'convexDefault') => {
    if (preset === 'ruang1') {
      setMirrorType('concave');
      setFocalLength(140);
      setObjectDistance(80); // s < f -> MAYA, TEGAK, DIPERBESAR
      setObjectHeight(65);
    } else if (preset === 'ruang2') {
      setMirrorType('concave');
      setFocalLength(140);
      setObjectDistance(210); // f < s < 2f -> NYATA, TERBALIK, DIPERBESAR
      setObjectHeight(65);
    } else if (preset === 'titikC') {
      setMirrorType('concave');
      setFocalLength(140);
      setObjectDistance(280); // s = 2f -> NYATA, TERBALIK, SAMA BESAR
      setObjectHeight(65);
    } else if (preset === 'convexDefault') {
      setMirrorType('convex');
      setFocalLength(140);
      setObjectDistance(180); // Convex is always MAYA, TEGAK, DIPERKECIL
      setObjectHeight(70);
    }
  };

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
    link.href = url;
    link.download = `REFLECTA_Cermin_${mirrorType === 'concave' ? 'Cekung' : 'Cembung'}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white/95 backdrop-blur-md rounded-2xl border-2 border-indigo-200/90 shadow-md overflow-hidden">
      {/* Tab Switcher Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-indigo-100 bg-indigo-50/70 p-2 gap-1.5 overflow-x-auto">
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'presets'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>✨</span>
            <span>Preset & Sinar</span>
          </button>
          <button
            onClick={() => setActiveTab('adjust')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'adjust'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>🎛️</span>
            <span>Parameter</span>
          </button>
          <button
            onClick={() => setActiveTab('formula')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'formula'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>📐</span>
            <span>Rumus & Data</span>
          </button>
          <button
            onClick={() => setActiveTab('layers')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'layers'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>👁️</span>
            <span>Lapisan</span>
          </button>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsAnimated(!isAnimated)}
            title={isAnimated ? 'Jeda Animasi' : 'Mulai Animasi'}
            className={`p-1.5 rounded-lg border text-xs font-semibold transition-all ${
              isAnimated
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isAnimated ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onReset}
            title="Reset Pengaturan"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tab 1: Presets & 3 Special Rays */}
      {activeTab === 'presets' && (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs text-slate-700">
          {/* Quick Virtual/Real Presets */}
          <div className="space-y-2">
            <span className="font-bold text-slate-700 uppercase text-[11px] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Pilihan Cepat Sifat Bayangan (Maya / Nyata)
            </span>

            <div className="grid grid-cols-1 gap-1.5">
              <button
                onClick={() => applyPreset('ruang1')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  mirrorType === 'concave' && calcResult.isVirtual
                    ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-200'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-purple-800">
                  <span>🥣 Bayangan Maya Cermin Cekung (s &lt; f)</span>
                  <span className="text-[10px] bg-purple-200 text-purple-900 px-1.5 py-0.5 rounded-full">Ruang I</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                  Benda diletakkan di depan fokus. Bayangan bersifat <strong>Maya, Tegak, Diperbesar</strong> di belakang cermin!
                </p>
              </button>

              <button
                onClick={() => applyPreset('convexDefault')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  mirrorType === 'convex'
                    ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-amber-800">
                  <span>🌐 Cermin Cembung (Selalu Maya)</span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-full">Divergen</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                  Bayangan selalu bersifat <strong>Maya, Tegak, Diperkecil</strong> di belakang cermin.
                </p>
              </button>

              <button
                onClick={() => applyPreset('ruang2')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  mirrorType === 'concave' && calcResult.isReal && calcResult.isMagnified
                    ? 'bg-cyan-50 border-cyan-300 ring-2 ring-cyan-200'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-cyan-800">
                  <span>🥣 Bayangan Nyata Diperbesar (f &lt; s &lt; 2f)</span>
                  <span className="text-[10px] bg-cyan-200 text-cyan-900 px-1.5 py-0.5 rounded-full">Ruang II</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                  Bayangan bersifat <strong>Nyata, Terbalik, Diperbesar</strong> di depan cermin.
                </p>
              </button>

              <button
                onClick={() => applyPreset('titikC')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  mirrorType === 'concave' && calcResult.isSameSize
                    ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-emerald-800">
                  <span>🥣 Sama Besar di Titik Pusat C (s = 2f)</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded-full">M = 1x</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                  Bayangan bersifat <strong>Nyata, Terbalik, Sama Besar</strong> tepat di titik C.
                </p>
              </button>
            </div>
          </div>

          {/* 3 Special Rays Toggles */}
          <div className="space-y-2 pt-1 border-t border-slate-200">
            <span className="font-bold text-slate-700 uppercase text-[11px]">3 Sinar Istimewa Geometris</span>

            <div className="space-y-2">
              {/* Ray 1 */}
              <button
                onClick={() => setRay1Active(!ray1Active)}
                className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                  ray1Active
                    ? 'bg-sky-50 border-sky-300 ring-1 ring-sky-200'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-sky-800">
                  <span>Sinar 1 (Biru): Sejajar Sumbu Utama</span>
                  <span className="text-xs">{ray1Active ? 'Aktif' : 'Mati'}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                  {mirrorType === 'concave'
                    ? 'Sinar sejajar sumbu utama dipantulkan melalui titik fokus (F).'
                    : 'Sinar sejajar sumbu utama dipantulkan seolah-olah berasal dari fokus maya (F).'}
                </p>
              </button>

              {/* Ray 2 */}
              <button
                onClick={() => setRay2Active(!ray2Active)}
                className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                  ray2Active
                    ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-200'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-amber-800">
                  <span>Sinar 2 (Oranye): Melalui Fokus</span>
                  <span className="text-xs">{ray2Active ? 'Aktif' : 'Mati'}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                  {mirrorType === 'concave'
                    ? 'Sinar melalui titik fokus (F) dipantulkan sejajar sumbu utama.'
                    : 'Sinar yang diarahkan menuju fokus maya (F) dipantulkan sejajar sumbu utama.'}
                </p>
              </button>

              {/* Ray 3 */}
              <button
                onClick={() => setRay3Active(!ray3Active)}
                className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                  ray3Active
                    ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-200'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-emerald-800">
                  <span>Sinar 3 (Hijau): Melalui Pusat Kelengkungan</span>
                  <span className="text-xs">{ray3Active ? 'Aktif' : 'Mati'}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                  {mirrorType === 'concave'
                    ? 'Sinar melalui pusat kelengkungan (C) dipantulkan kembali melalui jalur semula.'
                    : 'Sinar yang diarahkan menuju pusat kelengkungan maya (C) dipantulkan kembali melalui jalur semula.'}
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Sliders Parameter Geometri */}
      {activeTab === 'adjust' && (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs text-slate-700">
          <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100 text-sky-900 leading-snug">
            <span className="font-bold">Tips Interaksi:</span> Anda juga bisa menggeser panah benda dan ujung panah langsung di atas kanvas!
          </div>

          {/* Object Distance Slider */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex justify-between font-semibold">
              <span>Jarak Benda (s)</span>
              <span className="font-mono text-cyan-600 font-bold">{objectDistance} px</span>
            </div>
            <input
              type="range"
              min="40"
              max="500"
              step="5"
              value={objectDistance}
              onChange={(e) => setObjectDistance(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Dekat (40px)</span>
              <span>s &lt; f (Ruang I)</span>
              <span>Jauh (500px)</span>
            </div>
          </div>

          {/* Focal Length Slider */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex justify-between font-semibold">
              <span>Jarak Fokus (|f|)</span>
              <span className="font-mono text-indigo-600 font-bold">{focalLength} px (R={2 * focalLength})</span>
            </div>
            <input
              type="range"
              min="80"
              max="220"
              step="5"
              value={focalLength}
              onChange={(e) => setFocalLength(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Object Height Slider */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex justify-between font-semibold">
              <span>Tinggi Benda (h)</span>
              <span className="font-mono text-amber-600 font-bold">{objectHeight} px</span>
            </div>
            <input
              type="range"
              min="25"
              max="150"
              step="5"
              value={objectHeight}
              onChange={(e) => setObjectHeight(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Live Traits Summary Card */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 font-mono">
            <div className="font-bold font-sans text-xs text-slate-800">Ringkasan Sifat Bayangan:</div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Sifat:</span>
              <span className="font-bold text-indigo-700">{calcResult.isReal ? 'NYATA' : 'MAYA'}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Arah:</span>
              <span className="font-bold text-emerald-700">{calcResult.isUpright ? 'TEGAK' : 'TERBALIK'}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Ukuran:</span>
              <span className="font-bold text-purple-700">
                {calcResult.isMagnified ? 'DIPERBESAR' : calcResult.isDiminished ? 'DIPERKECIL' : 'SAMA BESAR'} ({calcResult.magnification}x)
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Jarak Bayangan (s'):</span>
              <span className="font-bold text-cyan-700">{calcResult.isAtInfinity ? '∞' : `${calcResult.imageDistance} px`}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Formula Derivation & CSV Data */}
      {activeTab === 'formula' && (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs text-slate-700 font-mono">
          <div className="flex items-center justify-between font-sans">
            <span className="font-bold text-slate-700 uppercase text-[11px] flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5 text-indigo-600" />
              Perhitungan Matematis
            </span>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-indigo-900 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>

          {/* Derivation Steps */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2.5 text-[11px]">
            <div>
              <span className="text-slate-400 block text-[9px]">1. Persamaan Umum Cermin:</span>
              <span className="text-indigo-600 font-bold">1/f = 1/s + 1/s'</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">2. Substitusi Nilai:</span>
              <span>1/({calcResult.focalLength}) = 1/({objectDistance}) + 1/s'</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">3. Jarak Bayangan (s'):</span>
              <span className="font-bold text-indigo-700">
                {calcResult.isAtInfinity ? 's\' = ∞ (Tak terhingga)' : `s' = ${calcResult.imageDistance} px`}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">4. Perbesaran Linear (M):</span>
              <span className="font-bold text-amber-700">
                M = - (s' / s) = {calcResult.isAtInfinity ? '∞' : `${calcResult.magnification}x`}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">5. Tinggi Bayangan (h'):</span>
              <span className="font-bold text-emerald-700">
                h' = |M| × h = {calcResult.isAtInfinity ? '∞' : `${calcResult.imageHeight} px`}
              </span>
            </div>
          </div>

          {/* Dalil Esbach */}
          <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 space-y-1 text-indigo-950 font-sans">
            <span className="font-bold text-indigo-800 text-xs">Dalil Esbach:</span>
            <p className="text-[11px] leading-relaxed">
              Ruang Benda (<strong>{calcResult.objectRoom}</strong>) + Ruang Bayangan (<strong>{calcResult.imageRoom}</strong>) = <strong>5</strong>.
            </p>
            <p className="text-[10px] text-indigo-700">
              Jika Ruang Bayangan &gt; Ruang Benda &rarr; Diperbesar.<br />
              Bayangan di Ruang IV (belakang cermin) selalu bersifat Maya dan Tegak.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Layer Visibility Toggles */}
      {activeTab === 'layers' && (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 uppercase text-[11px]">Lapisan Visualisasi</span>
            <div className="flex gap-2 text-xs">
              <button onClick={handleShowAll} className="text-indigo-600 hover:underline font-semibold">
                Semua
              </button>
              <span className="text-slate-300">|</span>
              <button onClick={handleHideAll} className="text-slate-500 hover:underline">
                Minimalis
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={visibility.showPrincipalAxis}
                onChange={() => toggleVisibility('showPrincipalAxis')}
                className="accent-indigo-500 rounded w-4 h-4 cursor-pointer"
              />
              <span className="font-semibold text-slate-700">Sumbu Utama</span>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={visibility.showFocalPoint}
                onChange={() => toggleVisibility('showFocalPoint')}
                className="accent-amber-500 rounded w-4 h-4 cursor-pointer"
              />
              <span className="font-semibold text-slate-700">Titik Fokus (F)</span>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={visibility.showCenterPoint}
                onChange={() => toggleVisibility('showCenterPoint')}
                className="accent-indigo-500 rounded w-4 h-4 cursor-pointer"
              />
              <span className="font-semibold text-slate-700">Titik Pusat Kelengkungan (C = 2F)</span>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={visibility.showVertexPoint}
                onChange={() => toggleVisibility('showVertexPoint')}
                className="accent-cyan-500 rounded w-4 h-4 cursor-pointer"
              />
              <span className="font-semibold text-slate-700">Pusat Cermin (O)</span>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={visibility.showVirtualExtensions}
                onChange={() => toggleVisibility('showVirtualExtensions')}
                className="accent-purple-500 rounded w-4 h-4 cursor-pointer"
              />
              <span className="font-semibold text-purple-800">Perpanjangan Garis Maya Putus-putus</span>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={visibility.showFinalImage}
                onChange={() => toggleVisibility('showFinalImage')}
                className="accent-indigo-500 rounded w-4 h-4 cursor-pointer"
              />
              <span className="font-semibold text-indigo-700">Bayangan Akhir Benda</span>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={visibility.showRayLabels}
                onChange={() => toggleVisibility('showRayLabels')}
                className="accent-sky-500 rounded w-4 h-4 cursor-pointer"
              />
              <span className="font-semibold text-slate-700">Label Nomor Sinar (1, 2, 3)</span>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={visibility.showZones}
                onChange={() => toggleVisibility('showZones')}
                className="accent-indigo-500 rounded w-4 h-4 cursor-pointer"
              />
              <span className="font-semibold text-slate-700">Zonasi Ruang I, II, III, IV</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
