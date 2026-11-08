import React, { useState } from 'react';
import { ShapeType, MirrorOption, ReflectionVisibility, VertexRayPair } from '../../types/physics';
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Eye,
  Download,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { generateTwoRayCSV } from '../../utils/opticsMath';

interface ControlsPanelProps {
  mirrorOption: MirrorOption;
  setMirrorOption: (m: MirrorOption) => void;
  scale: number;
  setScale: (s: number) => void;
  rotationDeg: number;
  setRotationDeg: (r: number) => void;
  spreadAngleDeg: number;
  setSpreadAngleDeg: (a: number) => void;
  userTiltDeg: number;
  setUserTiltDeg: (t: number) => void;
  focalLength: number;
  setFocalLength: (f: number) => void;
  mirrorX: number;
  setMirrorX: (x: number) => void;
  visibility: ReflectionVisibility;
  setVisibility: React.Dispatch<React.SetStateAction<ReflectionVisibility>>;
  isAnimated: boolean;
  setIsAnimated: (v: boolean) => void;
  onReset: () => void;
  vertexPairs: VertexRayPair[];
  shapeType: string;
  constructionStep?: number;
  setConstructionStep?: (s: number) => void;
  isAutoPlayingSteps?: boolean;
  setIsAutoPlayingSteps?: (v: boolean) => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  mirrorOption,
  setMirrorOption,
  scale,
  setScale,
  rotationDeg,
  setRotationDeg,
  spreadAngleDeg,
  setSpreadAngleDeg,
  userTiltDeg,
  setUserTiltDeg,
  focalLength,
  setFocalLength,
  mirrorX,
  setMirrorX,
  visibility,
  setVisibility,
  isAnimated,
  setIsAnimated,
  onReset,
  vertexPairs,
  shapeType,
  constructionStep = 0,
  setConstructionStep,
  isAutoPlayingSteps = false,
  setIsAutoPlayingSteps,
}) => {
  const [activeTab, setActiveTab] = useState<'steps' | 'adjust' | 'layers' | 'data'>('steps');

  const toggleVisibility = (key: keyof ReflectionVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleShowAll = () => {
    setVisibility({
      showIncidentRays: true,
      showReflectedRays: true,
      showNormalLines: true,
      showIncidentAngles: true,
      showReflectedAngles: true,
      showVirtualExtensions: true,
      showVirtualPoints: true,
      showImageOutline: true,
      showOriginalObject: true,
      showVirtualImage: true,
    });
  };

  const handleHideAll = () => {
    setVisibility({
      showIncidentRays: false,
      showReflectedRays: false,
      showNormalLines: false,
      showIncidentAngles: false,
      showReflectedAngles: false,
      showVirtualExtensions: false,
      showVirtualPoints: false,
      showImageOutline: false,
      showOriginalObject: true,
      showVirtualImage: false,
    });
  };

  const handleDownloadCSV = () => {
    const csv = generateTwoRayCSV(vertexPairs, mirrorOption, shapeType);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `REFLECTA_Data_2Sinar_${mirrorOption}_${shapeType}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white/95 backdrop-blur-md rounded-2xl border-2 border-sky-200/90 shadow-md overflow-hidden">
      {/* Tab Switcher Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-sky-100 bg-sky-50/70 p-2 gap-1.5 overflow-x-auto">
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('steps')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'steps'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>🐾</span>
            <span>Langkah Sinar</span>
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
          <button
            onClick={() => setActiveTab('data')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'data'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>📊</span>
            <span>Data</span>
          </button>
        </div>

        {/* Global Action Mini Buttons */}
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

      {/* Tab: Langkah-langkah Pembentukan Sinar (Pedagogical Step Flow) */}
      {activeTab === 'steps' && (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs text-slate-700">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-indigo-950 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-indigo-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                {constructionStep === 0
                  ? 'Tampilan Penuh (Semua Sinar)'
                  : `Langkah ${constructionStep} dari 8`}
              </span>
              {setConstructionStep && (
                <button
                  onClick={() => setConstructionStep(constructionStep === 0 ? 1 : 0)}
                  className="text-[11px] font-bold text-indigo-600 hover:underline"
                >
                  {constructionStep === 0 ? 'Mode Per Langkah' : 'Lihat Semua'}
                </button>
              )}
            </div>

            {/* Quick Step Buttons 1..8 */}
            {setConstructionStep && (
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      if (setIsAutoPlayingSteps) setIsAutoPlayingSteps(false);
                      setConstructionStep(s);
                    }}
                    className={`py-1.5 rounded-lg font-bold text-[11px] transition-all text-center ${
                      constructionStep === s
                        ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                        : 'bg-white border border-indigo-200 text-indigo-900 hover:bg-indigo-100/60'
                    }`}
                  >
                    Langkah {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detailed Explanation of Current Step */}
          <div className="space-y-2">
            {/* Step 1 */}
            <div
              className={`p-2.5 rounded-xl border transition-all ${
                constructionStep === 1
                  ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-200'
                  : 'bg-slate-50 border-slate-200/80 text-slate-600'
              }`}
            >
              <div className="font-bold text-sky-800 flex items-center justify-between">
                <span>1. Sinar Datang 1</span>
                {constructionStep === 1 && <span className="text-[10px] bg-sky-200 text-sky-800 px-1.5 py-0.5 rounded-full font-bold">Aktif</span>}
              </div>
              <p className="mt-1 leading-relaxed text-[11px]">
                Sinar pertama dipancarkan dari titik objek ke permukaan cermin. Garis putus-putus di belakang objek menunjukkan arah datang berkas sinar dari sumber cahaya.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className={`p-2.5 rounded-xl border transition-all ${
                constructionStep === 2
                  ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-300'
                  : 'bg-slate-50 border-slate-200/80 text-slate-600'
              }`}
            >
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>2. Garis Normal 1 (N₁) dari Titik O</span>
                {constructionStep === 2 && <span className="text-[10px] bg-slate-800 text-white px-1.5 py-0.5 rounded-full font-bold">Aktif</span>}
              </div>
              <p className="mt-1 leading-relaxed text-[11px]">
                Garis normal N₁ berhulu dari <strong>Titik Pusat O</strong> dan <strong>menembus melewati permukaan cermin</strong> secara tegak lurus (90°). Garis normal ini adalah garis acuan utama untuk mengukur sudut datang <em>i₁</em>!
              </p>
            </div>

            {/* Step 3 */}
            <div
              className={`p-2.5 rounded-xl border transition-all ${
                constructionStep === 3
                  ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200'
                  : 'bg-slate-50 border-slate-200/80 text-slate-600'
              }`}
            >
              <div className="font-bold text-amber-800 flex items-center justify-between">
                <span>3. Sinar Pantul 1 & Perpanjangan</span>
                {constructionStep === 3 && <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-full font-bold">Aktif</span>}
              </div>
              <p className="mt-1 leading-relaxed text-[11px]">
                Sinar memantul dengan sudut pantul <em>r₁ = i₁</em> (diukur terhadap garis normal). Garis pantul diperpanjang ke belakang cermin berupa garis putus-putus.
              </p>
            </div>

            {/* Step 4 */}
            <div
              className={`p-2.5 rounded-xl border transition-all ${
                constructionStep === 4
                  ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-200'
                  : 'bg-slate-50 border-slate-200/80 text-slate-600'
              }`}
            >
              <div className="font-bold text-sky-800 flex items-center justify-between">
                <span>4. Sinar Datang 2 (Arah Berbeda)</span>
                {constructionStep === 4 && <span className="text-[10px] bg-sky-200 text-sky-800 px-1.5 py-0.5 rounded-full font-bold">Aktif</span>}
              </div>
              <p className="mt-1 leading-relaxed text-[11px]">
                Dari sudut objek yang sama, kita pancarkan sinar datang kedua dengan arah yang berbeda menuju cermin.
              </p>
            </div>

            {/* Step 5 */}
            <div
              className={`p-2.5 rounded-xl border transition-all ${
                constructionStep === 5
                  ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-300'
                  : 'bg-slate-50 border-slate-200/80 text-slate-600'
              }`}
            >
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>5. Garis Normal 2 (N₂) dari Titik O</span>
                {constructionStep === 5 && <span className="text-[10px] bg-slate-800 text-white px-1.5 py-0.5 rounded-full font-bold">Aktif</span>}
              </div>
              <p className="mt-1 leading-relaxed text-[11px]">
                Garis normal N₂ kedua ditarik dari <strong>Titik Pusat O menembus melewati cermin</strong> tegak lurus 90° di titik jatuh sinar kedua sebagai acuan sudut datang <em>i₂</em>.
              </p>
            </div>

            {/* Step 6 */}
            <div
              className={`p-2.5 rounded-xl border transition-all ${
                constructionStep === 6
                  ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200'
                  : 'bg-slate-50 border-slate-200/80 text-slate-600'
              }`}
            >
              <div className="font-bold text-amber-800 flex items-center justify-between">
                <span>6. Sinar Pantul 2 & Perpanjangan</span>
                {constructionStep === 6 && <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-full font-bold">Aktif</span>}
              </div>
              <p className="mt-1 leading-relaxed text-[11px]">
                Sinar kedua memantul dengan <em>r₂ = i₂</em> dan ditarik garis perpanjangan ke belakang cermin.
              </p>
            </div>

            {/* Step 7 */}
            <div
              className={`p-2.5 rounded-xl border transition-all ${
                constructionStep === 7
                  ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200'
                  : 'bg-slate-50 border-slate-200/80 text-slate-600'
              }`}
            >
              <div className="font-bold text-indigo-800 flex items-center justify-between">
                <span>7. Titik Potong Bayangan Maya (A')</span>
                {constructionStep === 7 && <span className="text-[10px] bg-indigo-200 text-indigo-900 px-1.5 py-0.5 rounded-full font-bold">Aktif</span>}
              </div>
              <p className="mt-1 leading-relaxed text-[11px]">
                Perpanjangan sinar pantul 1 dan 2 <strong>berpotongan di satu titik</strong>. Titik potong inilah lokasi bayangan semu (maya) dari sudut tersebut!
              </p>
            </div>

            {/* Step 8 */}
            <div
              className={`p-2.5 rounded-xl border transition-all ${
                constructionStep === 8
                  ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-200'
                  : 'bg-slate-50 border-slate-200/80 text-slate-600'
              }`}
            >
              <div className="font-bold text-purple-800 flex items-center justify-between">
                <span>8. Bayangan Utuh Terbentuk</span>
                {constructionStep === 8 && <span className="text-[10px] bg-purple-200 text-purple-900 px-1.5 py-0.5 rounded-full font-bold">Aktif</span>}
              </div>
              <p className="mt-1 leading-relaxed text-[11px]">
                Dengan menghubungkan semua titik potong bayangan (A', B', C'...), bentuk bayangan utuh tampak sama persis dan tegak!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Parameter Geometri & Cermin */}
      {activeTab === 'adjust' && (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs text-slate-700">
          {/* Quick Info Box for Kids */}
          <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100 text-sky-900 leading-snug">
            <span className="font-bold">Prinsip Praktikum:</span> Cukup perhatikan <strong>2 sinar datang</strong> dari setiap sudut objek yang memantul dan saling berpotongan di titik bayangan!
          </div>

          {/* Scale Slider */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex justify-between font-semibold">
              <span>Ukuran Objek (Skala)</span>
              <span className="font-mono text-sky-600 font-bold">{scale.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.8"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* Rotation Slider */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex justify-between font-semibold">
              <span>Putar / Rotasi Objek</span>
              <span className="font-mono text-sky-600 font-bold">{rotationDeg}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="5"
              value={rotationDeg}
              onChange={(e) => setRotationDeg(parseInt(e.target.value, 10))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* Ray Spread Slider */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex justify-between font-semibold">
              <span>Sudut Antara 2 Sinar</span>
              <span className="font-mono text-indigo-600 font-bold">{spreadAngleDeg}°</span>
            </div>
            <input
              type="range"
              min="6"
              max="24"
              step="1"
              value={spreadAngleDeg}
              onChange={(e) => setSpreadAngleDeg(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">Mengatur jarak bukaan antara 2 berkas sinar</span>
          </div>

          {/* Incident Beam Tilt Angle */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex justify-between font-semibold">
              <span>Arah Kemiringan Sinar</span>
              <span className="font-mono text-amber-600 font-bold">{userTiltDeg > 0 ? `+${userTiltDeg}°` : `${userTiltDeg}°`}</span>
            </div>
            <input
              type="range"
              min="-25"
              max="25"
              step="1"
              value={userTiltDeg}
              onChange={(e) => setUserTiltDeg(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Focal Length Slider if Concave or Convex */}
          {mirrorOption !== 'flat' && (
            <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 space-y-1">
              <div className="flex justify-between font-semibold text-amber-900">
                <span>Jarak Fokus Cermin (|f|)</span>
                <span className="font-mono font-bold text-amber-700">{focalLength} px (R={2 * focalLength})</span>
              </div>
              <input
                type="range"
                min="100"
                max="240"
                step="10"
                value={focalLength}
                onChange={(e) => setFocalLength(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          )}

          {/* Mirror Position Slider */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex justify-between font-semibold">
              <span>Posisi Garis Cermin</span>
              <span className="font-mono text-slate-700 font-bold">{mirrorX} px</span>
            </div>
            <input
              type="range"
              min="380"
              max="680"
              step="10"
              value={mirrorX}
              onChange={(e) => setMirrorX(parseInt(e.target.value, 10))}
              className="w-full accent-slate-600 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Lapisan Visibilitas Sinar */}
      {activeTab === 'layers' && (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 uppercase text-[11px]">Pilih Lapisan Tampilan</span>
            <div className="flex gap-2 text-xs">
              <button onClick={handleShowAll} className="text-sky-600 hover:underline font-semibold">
                Semua
              </button>
              <span className="text-slate-300">|</span>
              <button onClick={handleHideAll} className="text-slate-500 hover:underline">
                Sederhana
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={visibility.showIncidentRays}
                onChange={() => toggleVisibility('showIncidentRays')}
                className="accent-sky-500 rounded w-4 h-4 cursor-pointer"
              />
              <span className="font-semibold text-slate-700">2 Sinar Datang</span>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={visibility.showReflectedRays}
                onChange={() => toggleVisibility('showReflectedRays')}
                className="accent-sky-500 rounded w-4 h-4 cursor-pointer"
              />
              <span className="font-semibold text-slate-700">2 Sinar Pantul</span>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={visibility.showNormalLines}
                onChange={() => toggleVisibility('showNormalLines')}
                className="accent-slate-500 rounded w-4 h-4 cursor-pointer"
              />
              <span className="font-semibold text-slate-700">Garis Normal (Tegak Lurus)</span>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={visibility.showIncidentAngles}
                onChange={() => toggleVisibility('showIncidentAngles')}
                className="accent-amber-500 rounded w-4 h-4 cursor-pointer"
              />
              <span className="font-semibold text-slate-700">Label Sudut Datang & Pantul (i = r)</span>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={visibility.showVirtualExtensions}
                onChange={() => toggleVisibility('showVirtualExtensions')}
                className="accent-indigo-500 rounded w-4 h-4 cursor-pointer"
              />
              <span className="font-semibold text-indigo-700">Perpanjangan Garis Putus-putus</span>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={visibility.showVirtualPoints}
                onChange={() => toggleVisibility('showVirtualPoints')}
                className="accent-indigo-500 rounded w-4 h-4 cursor-pointer"
              />
              <span className="font-semibold text-indigo-700">Titik Potong Bayangan (A', B'...)</span>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={visibility.showVirtualImage}
                onChange={() => toggleVisibility('showVirtualImage')}
                className="accent-indigo-500 rounded w-4 h-4 cursor-pointer"
              />
              <span className="font-semibold text-indigo-700">Bentuk Bayangan Hasil Rekonstruksi</span>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={visibility.showOriginalObject}
                onChange={() => toggleVisibility('showOriginalObject')}
                className="accent-sky-500 rounded w-4 h-4 cursor-pointer"
              />
              <span className="font-semibold text-sky-800">Objek Benda Asli</span>
            </label>
          </div>
        </div>
      )}

      {/* Tab 3: Data Analisis 2 Sinar Real-time */}
      {activeTab === 'data' && (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 uppercase text-[11px]">Buktian Hukum i = r</span>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-sky-900 bg-sky-100 hover:bg-sky-200 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>

          <div className="space-y-2">
            {vertexPairs.map((pair) => (
              <div
                key={pair.vertexId}
                className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5 font-mono"
              >
                <div className="flex items-center justify-between text-xs font-bold font-sans">
                  <span style={{ color: pair.color }}>Sudut {pair.label}</span>
                  <span className="text-[11px] text-emerald-600 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> i = r Terbukti!
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600">
                  <div className="bg-white p-1 rounded border border-slate-100">
                    <span className="text-slate-400 block text-[9px]">Sinar A:</span>
                    <span>i={pair.ray1.incidentAngleDeg}° = r={pair.ray1.reflectedAngleDeg}°</span>
                  </div>
                  <div className="bg-white p-1 rounded border border-slate-100">
                    <span className="text-slate-400 block text-[9px]">Sinar B:</span>
                    <span>i={pair.ray2.incidentAngleDeg}° = r={pair.ray2.reflectedAngleDeg}°</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 flex justify-between pt-0.5">
                  <span>Titik Potong: ({Math.round(pair.intersectionPoint.x)}, {Math.round(pair.intersectionPoint.y)})</span>
                  <span className="font-bold text-indigo-600">{pair.isIntersectionReal ? 'Nyata' : 'Maya'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
