import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Point2D, ShapeType, MirrorOption, ReflectionVisibility, VertexRayPair } from '../../types/physics';
import { getShapeVertices, calculateTwoRaysPerVertex } from '../../utils/opticsMath';
import { ReflectionCanvas } from './ReflectionCanvas';
import { ControlsPanel } from './ControlsPanel';
import { ChevronRight, ChevronLeft, Maximize2, Minimize2, Sparkles, Sliders } from 'lucide-react';

export const ReflectionLawLab: React.FC = () => {
  // Mirror type: flat, concave, or convex!
  const [mirrorOption, setMirrorOption] = useState<MirrorOption>('flat');
  const [shapeType, setShapeType] = useState<ShapeType>('triangle');
  const [selectedVertexFilter, setSelectedVertexFilter] = useState<number | 'all'>('all');

  const [objectPos, setObjectPos] = useState<Point2D>({ x: 200, y: 260 });
  const [mirrorX, setMirrorX] = useState<number>(510);
  const [scale, setScale] = useState<number>(1.1);
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [spreadAngleDeg, setSpreadAngleDeg] = useState<number>(11);
  const [userTiltDeg, setUserTiltDeg] = useState<number>(0);
  const [focalLength, setFocalLength] = useState<number>(160);
  const [isAnimated, setIsAnimated] = useState<boolean>(true);

  // Tinkercad-style collapsible & resizable panel state
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
  const [panelWidth, setPanelWidth] = useState<number>(380); // in pixels
  const [isDraggingDivider, setIsDraggingDivider] = useState<boolean>(false);

  // Resize listener for Tinkercad drag bar
  useEffect(() => {
    if (!isDraggingDivider) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Distance from right edge
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

  // Custom shape vertices (relative to center)
  const [customVertices, setCustomVertices] = useState<Point2D[]>([
    { x: -30, y: -35 },
    { x: 30, y: -10 },
    { x: 10, y: 35 },
    { x: -35, y: 20 },
  ]);

  // Visibility states
  const [visibility, setVisibility] = useState<ReflectionVisibility>({
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

  // 1. Generate discrete labeled vertices for the selected shape
  const allVertices = useMemo(() => {
    return getShapeVertices(
      shapeType,
      objectPos,
      scale,
      rotationDeg,
      shapeType === 'custom' ? customVertices : undefined
    );
  }, [shapeType, objectPos, scale, rotationDeg, customVertices]);

  // 2. Generate exactly 2 rays per vertex reflecting on chosen mirror and finding their intersection
  const vertexPairs: VertexRayPair[] = useMemo(() => {
    return allVertices.map((v, idx) => {
      return calculateTwoRaysPerVertex(
        v.point,
        idx,
        v.label,
        v.color,
        mirrorOption,
        mirrorX,
        260, // mirrorCenterY
        focalLength,
        0, // mirrorAngleDeg
        spreadAngleDeg,
        userTiltDeg
      );
    });
  }, [allVertices, mirrorOption, mirrorX, focalLength, spreadAngleDeg, userTiltDeg]);

  // Step-by-step construction state (0 = full view, 1..8 = pedagogical construction sequence)
  const [constructionStep, setConstructionStep] = useState<number>(0);
  const [isAutoPlayingSteps, setIsAutoPlayingSteps] = useState<boolean>(false);

  const handleReset = () => {
    setMirrorOption('flat');
    setShapeType('triangle');
    setSelectedVertexFilter('all');
    setObjectPos({ x: 200, y: 260 });
    setMirrorX(510);
    setScale(1.1);
    setRotationDeg(0);
    setSpreadAngleDeg(11);
    setUserTiltDeg(0);
    setFocalLength(160);
    setIsAnimated(true);
    setConstructionStep(0);
    setIsAutoPlayingSteps(false);
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

  const handleCustomVertexDrag = useCallback((index: number, newPos: Point2D) => {
    setCustomVertices((prev) => {
      const updated = [...prev];
      updated[index] = newPos;
      return updated;
    });
  }, []);

  // Mobile tab state ('canvas' | 'controls') for optimal smartphone experience
  const [mobileTab, setMobileTab] = useState<'canvas' | 'controls'>('canvas');

  return (
    <div className="relative w-full h-full flex flex-col p-2 sm:p-3 overflow-hidden bg-optics-ambient">
      {/* Mobile-Only Segmented Switcher (Visible on smartphones & tablets < lg) */}
      <div className="lg:hidden shrink-0 flex items-center p-1 bg-white border border-slate-200/90 rounded-xl mb-1.5 shadow-2xs gap-1 select-none">
        <button
          onClick={() => setMobileTab('canvas')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'canvas'
              ? 'bg-sky-500 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>🔬 Kanvas Simulasi</span>
        </button>
        <button
          onClick={() => setMobileTab('controls')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'controls'
              ? 'bg-amber-400 text-slate-900 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>🎛️ Kontrol &amp; Langkah {constructionStep > 0 ? `(${constructionStep}/8)` : ''}</span>
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
          <ReflectionCanvas
            mirrorOption={mirrorOption}
            setMirrorOption={setMirrorOption}
            shapeType={shapeType}
            setShapeType={setShapeType}
            selectedVertexFilter={selectedVertexFilter}
            setSelectedVertexFilter={setSelectedVertexFilter}
            objectPos={objectPos}
            setObjectPos={setObjectPos}
            mirrorX={mirrorX}
            setMirrorX={setMirrorX}
            focalLength={focalLength}
            setFocalLength={setFocalLength}
            vertexPairs={vertexPairs}
            allVertices={allVertices}
            visibility={visibility}
            isAnimated={isAnimated}
            onCustomVertexDrag={handleCustomVertexDrag}
            customVertices={customVertices}
            constructionStep={constructionStep}
            setConstructionStep={setConstructionStep}
            isAutoPlayingSteps={isAutoPlayingSteps}
            setIsAutoPlayingSteps={setIsAutoPlayingSteps}
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

        {/* Secondary Stage: Control Dock (Collapsible on desktop, tabbed on mobile) */}
        {isPanelOpen ? (
          <div
            style={{ width: undefined }}
            className={`w-full lg:w-[380px] xl:w-[410px] h-full shrink-0 flex flex-col min-h-0 transition-all duration-200 ${
              mobileTab === 'canvas' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <ControlsPanel
              mirrorOption={mirrorOption}
              setMirrorOption={setMirrorOption}
              scale={scale}
              setScale={setScale}
              rotationDeg={rotationDeg}
              setRotationDeg={setRotationDeg}
              spreadAngleDeg={spreadAngleDeg}
              setSpreadAngleDeg={setSpreadAngleDeg}
              userTiltDeg={userTiltDeg}
              setUserTiltDeg={setUserTiltDeg}
              focalLength={focalLength}
              setFocalLength={setFocalLength}
              mirrorX={mirrorX}
              setMirrorX={setMirrorX}
              visibility={visibility}
              setVisibility={setVisibility}
              isAnimated={isAnimated}
              setIsAnimated={setIsAnimated}
              onReset={handleReset}
              vertexPairs={vertexPairs}
              shapeType={shapeType}
              constructionStep={constructionStep}
              setConstructionStep={setConstructionStep}
              isAutoPlayingSteps={isAutoPlayingSteps}
              setIsAutoPlayingSteps={setIsAutoPlayingSteps}
            />
          </div>
        ) : (
          /* Floating Tinkercad Re-open Pull Tab (Visible on desktop when panel is collapsed) */
          <button
            onClick={() => setIsPanelOpen(true)}
            className="hidden lg:flex fixed right-3 top-20 z-40 items-center gap-2 px-3.5 py-2.5 bg-white hover:bg-sky-50 border-2 border-sky-400 hover:border-sky-500 text-sky-800 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group font-bold text-xs"
            title="Klik atau tarik untuk membuka kembali panel kontrol & langkah sinar"
          >
            <ChevronLeft className="w-4 h-4 text-sky-600 group-hover:-translate-x-0.5 transition-transform animate-pulse" />
            <span>Buka Panel Kontrol &amp; Langkah Sinar</span>
            <span className="bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded text-[10px] font-mono">Tinkercad Dock</span>
          </button>
        )}
      </div>

      {/* Floating Jump-to-Controls button on mobile canvas */}
      {mobileTab === 'canvas' && (
        <button
          onClick={() => setMobileTab('controls')}
          className="lg:hidden fixed bottom-18 right-3 z-30 flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 text-slate-900 rounded-full font-bold text-xs shadow-lg active:scale-95 transition-all cursor-pointer border border-amber-500/30"
          title="Buka panel langkah & kontrol praktikum"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Atur Kontrol &amp; Langkah</span>
        </button>
      )}
    </div>
  );
};
