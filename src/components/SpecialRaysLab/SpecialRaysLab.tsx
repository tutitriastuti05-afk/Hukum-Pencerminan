import React, { useState, useMemo, useEffect } from 'react';
import { CurvedMirrorType, CurvedVisibility } from '../../types/physics';
import { calculateSphericalMirror } from '../../utils/opticsMath';
import { CurvedMirrorCanvas } from './CurvedMirrorCanvas';
import { CurvedControls } from './CurvedControls';
import { ChevronRight, ChevronLeft, Sliders } from 'lucide-react';

export const SpecialRaysLab: React.FC = () => {
  const [mirrorType, setMirrorType] = useState<CurvedMirrorType>('concave');
  const [focalLength, setFocalLength] = useState<number>(140);
  const [objectDistance, setObjectDistance] = useState<number>(210);
  const [objectHeight, setObjectHeight] = useState<number>(65);

  const [ray1Active, setRay1Active] = useState<boolean>(true);
  const [ray2Active, setRay2Active] = useState<boolean>(true);
  const [ray3Active, setRay3Active] = useState<boolean>(true);

  const [isAnimated, setIsAnimated] = useState<boolean>(true);

  // Mobile tab state ('canvas' | 'controls') for optimal smartphone experience
  const [mobileTab, setMobileTab] = useState<'canvas' | 'controls'>('canvas');

  // Tinkercad-style collapsible & resizable panel state
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
  const [panelWidth, setPanelWidth] = useState<number>(380); // in pixels
  const [isDraggingDivider, setIsDraggingDivider] = useState<boolean>(false);

  // Resize listener for Tinkercad drag bar
  useEffect(() => {
    if (!isDraggingDivider) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.min(580, Math.max(290, window.innerWidth - e.clientX));
      setPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDraggingDivider(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingDivider]);

  const [visibility, setVisibility] = useState<CurvedVisibility>({
    showPrincipalAxis: true,
    showFocalPoint: true,
    showCenterPoint: true,
    showVertexPoint: true,
    showVirtualExtensions: true,
    showFinalImage: true,
    showRayLabels: true,
    showZones: true,
  });

  const calcResult = useMemo(() => {
    return calculateSphericalMirror(
      mirrorType,
      focalLength,
      objectDistance,
      objectHeight
    );
  }, [mirrorType, focalLength, objectDistance, objectHeight]);

  const handleReset = () => {
    setMirrorType('concave');
    setFocalLength(140);
    setObjectDistance(210);
    setObjectHeight(65);
    setRay1Active(true);
    setRay2Active(true);
    setRay3Active(true);
    setIsAnimated(true);
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
  };

  return (
    <div className="relative w-full h-full flex flex-col p-2 sm:p-3 overflow-hidden bg-optics-ambient">
      {/* Mobile-Only Segmented Switcher (Visible on smartphones & tablets < lg) */}
      <div className="lg:hidden shrink-0 flex items-center p-1 bg-white border border-slate-200/90 rounded-xl mb-1.5 shadow-2xs gap-1 select-none">
        <button
          onClick={() => setMobileTab('canvas')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'canvas'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>📐 Kanvas Cermin Lengkung</span>
        </button>
        <button
          onClick={() => setMobileTab('controls')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'controls'
              ? 'bg-amber-400 text-slate-900 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>⚙️ Parameter &amp; Rumus</span>
        </button>
      </div>

      {/* Main Workspace: Side-by-side on desktop (lg:), single-panel on mobile (< lg) */}
      <div className="flex-1 w-full h-full flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Primary Stage: SVG Canvas */}
        <div
          className={`flex-1 h-full flex flex-col min-w-0 transition-all duration-200 ${
            mobileTab === 'controls' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <CurvedMirrorCanvas
            mirrorType={mirrorType}
            setMirrorType={setMirrorType}
            focalLength={focalLength}
            setFocalLength={setFocalLength}
            objectDistance={objectDistance}
            setObjectDistance={setObjectDistance}
            objectHeight={objectHeight}
            setObjectHeight={setObjectHeight}
            ray1Active={ray1Active}
            setRay1Active={setRay1Active}
            ray2Active={ray2Active}
            setRay2Active={setRay2Active}
            ray3Active={ray3Active}
            setRay3Active={setRay3Active}
            visibility={visibility}
            calcResult={calcResult}
            isAnimated={isAnimated}
            isPanelOpen={isPanelOpen}
            onTogglePanel={() => setIsPanelOpen(!isPanelOpen)}
          />
        </div>

        {/* Tinkercad-Style Resizable & Collapsible Divider Bar (Desktop) */}
        {isPanelOpen && (
          <div
            className={`hidden lg:flex relative items-center justify-center w-3 shrink-0 cursor-col-resize select-none group transition-colors mx-1 ${
              isDraggingDivider ? 'bg-sky-400/40 rounded-full' : 'hover:bg-sky-200/50 rounded-full'
            }`}
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDraggingDivider(true);
            }}
            title="Tarik untuk mengatur lebar panel, atau klik panah untuk menyembunyikan panel"
          >
            {/* Grab handle dots / strip */}
            <div className="w-1 h-12 rounded-full bg-slate-300 group-hover:bg-sky-500 transition-colors" />

            {/* Center Collapse Arrow Button (Tinkercad-style pull tab) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPanelOpen(false);
              }}
              className="absolute top-1/2 -translate-y-1/2 -left-3 z-30 w-6 h-11 bg-white hover:bg-sky-50 border border-slate-300 hover:border-sky-400 text-slate-600 hover:text-sky-600 rounded-l-lg shadow-sm flex items-center justify-center transition-all cursor-pointer group"
              title="Sembunyikan Panel (Perbesar Layar Simulasi)"
              aria-label="Sembunyikan Panel"
            >
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}

        {/* Secondary Stage: Compact Control Dock (Collapsible on desktop, tabbed on mobile) */}
        {isPanelOpen ? (
          <div
            style={{ width: undefined }}
            className={`w-full lg:w-[380px] xl:w-[410px] h-full shrink-0 flex flex-col min-h-0 transition-all duration-200 ${
              mobileTab === 'canvas' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <CurvedControls
              mirrorType={mirrorType}
              setMirrorType={setMirrorType}
              focalLength={focalLength}
              setFocalLength={setFocalLength}
              objectDistance={objectDistance}
              setObjectDistance={setObjectDistance}
              objectHeight={objectHeight}
              setObjectHeight={setObjectHeight}
              ray1Active={ray1Active}
              setRay1Active={setRay1Active}
              ray2Active={ray2Active}
              setRay2Active={setRay2Active}
              ray3Active={ray3Active}
              setRay3Active={setRay3Active}
              visibility={visibility}
              setVisibility={setVisibility}
              isAnimated={isAnimated}
              setIsAnimated={setIsAnimated}
              onReset={handleReset}
              calcResult={calcResult}
            />
          </div>
        ) : (
          /* Floating Tinkercad Re-open Pull Tab (Visible on desktop when panel is collapsed) */
          <button
            onClick={() => setIsPanelOpen(true)}
            className="hidden lg:flex fixed right-3 top-20 z-40 items-center gap-2 px-3.5 py-2.5 bg-white hover:bg-sky-50 border-2 border-indigo-400 hover:border-indigo-500 text-indigo-900 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group font-bold text-xs"
            title="Klik atau tarik untuk membuka kembali panel sinar istimewa"
          >
            <ChevronLeft className="w-4 h-4 text-indigo-600 group-hover:-translate-x-0.5 transition-transform animate-pulse" />
            <span>Buka Panel Sinar &amp; Parameter</span>
            <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-mono">Tinkercad Dock</span>
          </button>
        )}
      </div>

      {/* Floating Jump-to-Controls button on mobile canvas */}
      {mobileTab === 'canvas' && (
        <button
          onClick={() => setMobileTab('controls')}
          className="lg:hidden fixed bottom-18 right-3 z-30 flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 text-slate-900 rounded-full font-bold text-xs shadow-lg active:scale-95 transition-all cursor-pointer border border-amber-500/30"
          title="Buka panel parameter & sinar istimewa"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Atur Parameter &amp; Sinar</span>
        </button>
      )}
    </div>
  );
};
