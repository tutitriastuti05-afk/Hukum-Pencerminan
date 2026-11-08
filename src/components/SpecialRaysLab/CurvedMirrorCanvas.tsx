import React, { useRef, useState, useCallback, useEffect } from 'react';
import { CurvedMirrorType, CurvedVisibility, Point2D } from '../../types/physics';
import { SphericalCalculationResult } from '../../utils/opticsMath';
import { Maximize2, Minimize2 } from 'lucide-react';

interface CurvedMirrorCanvasProps {
  mirrorType: CurvedMirrorType;
  setMirrorType: (t: CurvedMirrorType) => void;
  focalLength: number; // magnitude in px
  setFocalLength?: (f: number) => void;
  objectDistance: number; // s_o in px
  setObjectDistance: (s: number) => void;
  objectHeight: number; // h_o in px
  setObjectHeight: (h: number) => void;
  ray1Active: boolean;
  setRay1Active?: (v: boolean) => void;
  ray2Active: boolean;
  setRay2Active?: (v: boolean) => void;
  ray3Active: boolean;
  setRay3Active?: (v: boolean) => void;
  visibility: CurvedVisibility;
  calcResult: SphericalCalculationResult;
  isAnimated: boolean;
  isPanelOpen?: boolean;
  onTogglePanel?: () => void;
}

export const CurvedMirrorCanvas: React.FC<CurvedMirrorCanvasProps> = ({
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
  calcResult,
  isAnimated,
  isPanelOpen = true,
  onTogglePanel,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isDraggingObj, setIsDraggingObj] = useState(false);
  const [isDraggingHeight, setIsDraggingHeight] = useState(false);
  const [dashOffset, setDashOffset] = useState(0);

  // Animation pulse
  useEffect(() => {
    let animId: number;
    if (isAnimated) {
      const animate = () => {
        setDashOffset((prev) => (prev - 1.2) % 20);
        animId = requestAnimationFrame(animate);
      };
      animId = requestAnimationFrame(animate);
    }
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isAnimated]);

  // Optical bench center & geometry
  // Mirror vertex O is placed at (600, 300)
  const Ox = 600;
  const Oy = 300;

  // Convert SVG coordinates
  const getSVGCoordinates = (e: React.MouseEvent | React.TouchEvent): Point2D => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const viewBox = svg.viewBox.baseVal;
    return {
      x: (clientX - rect.left) * (viewBox.width / rect.width),
      y: (clientY - rect.top) * (viewBox.height / rect.height),
    };
  };

  const handlePointerDownObject = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsDraggingObj(true);
  };

  const handlePointerDownHeight = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsDraggingHeight(true);
  };

  const handlePointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDraggingObj && !isDraggingHeight) return;
      const pt = getSVGCoordinates(e);

      if (isDraggingObj) {
        // Object is in front of mirror (x < Ox)
        const newSo = Math.max(30, Math.min(540, Ox - pt.x));
        setObjectDistance(Math.round(newSo));
      } else if (isDraggingHeight) {
        // Height from principal axis (Oy - pt.y)
        const newHo = Math.max(20, Math.min(180, Oy - pt.y));
        setObjectHeight(Math.round(newHo));
      }
    },
    [isDraggingObj, isDraggingHeight, Ox, Oy, setObjectDistance, setObjectHeight]
  );

  const handlePointerUp = () => {
    setIsDraggingObj(false);
    setIsDraggingHeight(false);
  };

  // Points of Interest on Principal Axis
  // For concave: F and C are on the left (in front)
  // For convex: F and C are on the right (behind mirror, virtual)
  const Fx = mirrorType === 'concave' ? Ox - focalLength : Ox + focalLength;
  const Cx = mirrorType === 'concave' ? Ox - 2 * focalLength : Ox + 2 * focalLength;

  // Object coordinates: tip is A, base on axis is B
  const Ax = Ox - objectDistance;
  const Ay = Oy - objectHeight;

  // Image coordinates
  // calcResult.imageDistance (s_i): if > 0 (real), x = Ox - s_i; if < 0 (virtual), x = Ox + |s_i|
  const isInfinity = calcResult.isAtInfinity;
  const imageX = isInfinity ? -9999 : Ox - calcResult.imageDistance;
  const imageTipY = isInfinity ? 300 : Oy - calcResult.imageHeight;

  // Curved Mirror Arc Path
  // Arc radius R = 2 * focalLength
  const mirrorR = Math.max(220, focalLength * 2.2);
  const arcSpan = 220;
  // Arc calculation: for concave, curves inward to the left
  // For convex, curves outward to the left (bulging towards the object)
  const mirrorPath =
    mirrorType === 'concave'
      ? `M ${Ox + 18} ${Oy - arcSpan} A ${mirrorR} ${mirrorR} 0 0 0 ${Ox + 18} ${Oy + arcSpan}`
      : `M ${Ox - 18} ${Oy - arcSpan} A ${mirrorR} ${mirrorR} 0 0 1 ${Ox - 18} ${Oy + arcSpan}`;

  // Mirror Hatching lines
  const hatchLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const hatchCount = 24;
  for (let i = 0; i <= hatchCount; i++) {
    const t = (i / hatchCount) * 2 - 1; // -1 to 1
    const y = Oy + t * (arcSpan - 10);
    // Approximation of arc x
    const dx = mirrorType === 'concave'
      ? (t * t * 24)
      : -(t * t * 24);
    const baseX = (mirrorType === 'concave' ? Ox : Ox) + dx;
    const hatchDir = mirrorType === 'concave' ? 1 : 1; // Hatch always on non-reflective backside (right side)
    hatchLines.push({
      x1: baseX,
      y1: y,
      x2: baseX + 14 * hatchDir,
      y2: y + 8,
    });
  }

  // --- RAY 1: Parallel to Principal Axis ---
  // Starts at A(Ax, Ay), goes parallel to axis to Mirror at M1(Ox, Ay).
  // Concave: Reflects through F(Fx, Oy).
  // Convex: Reflects outward as if coming from virtual F(Fx, Oy).
  const ray1Hit: Point2D = { x: Ox, y: Ay };
  // Reflected ray direction for Ray 1:
  let ray1ReflectedEnd: Point2D = { x: 0, y: 0 };
  let ray1VirtualExtension: { x1: number; y1: number; x2: number; y2: number } | null = null;

  if (mirrorType === 'concave') {
    // Passes through F(Fx, Oy)
    const slope = (Oy - ray1Hit.y) / (Fx - ray1Hit.x);
    // Reflected ray travels towards x < 0
    ray1ReflectedEnd = { x: 50, y: ray1Hit.y + slope * (50 - ray1Hit.x) };
    if (calcResult.isVirtual) {
      // Virtual extension behind mirror towards image tip
      ray1VirtualExtension = {
        x1: ray1Hit.x,
        y1: ray1Hit.y,
        x2: Math.min(950, imageX),
        y2: imageTipY,
      };
    }
  } else {
    // Convex: appears to diverge from Fx (which is behind mirror at Ox + f)
    const slope = (Oy - ray1Hit.y) / (Fx - ray1Hit.x);
    // Ray reflects away from mirror (x < Ox)
    ray1ReflectedEnd = { x: 50, y: ray1Hit.y - slope * (ray1Hit.x - 50) };
    // Virtual extension connects hit point to virtual focus F
    ray1VirtualExtension = {
      x1: ray1Hit.x,
      y1: ray1Hit.y,
      x2: Fx,
      y2: Oy,
    };
  }

  // --- RAY 2: Through / Towards Focus ---
  // Concave: From A through F(Fx, Oy) to Mirror at M2(Ox, hitY2) -> Reflects parallel to axis
  // Convex: Directed towards virtual F(Fx, Oy) to Mirror at M2(Ox, hitY2) -> Reflects parallel to axis
  let ray2Hit: Point2D = { x: Ox, y: Oy };
  let ray2ReflectedEnd: Point2D = { x: 50, y: Oy };
  let ray2VirtualExtension: { x1: number; y1: number; x2: number; y2: number } | null = null;

  if (mirrorType === 'concave') {
    if (!isInfinity) {
      const slope = (Oy - Ay) / (Fx - Ax);
      const hitY2 = Ay + slope * (Ox - Ax);
      ray2Hit = { x: Ox, y: Math.max(Oy - arcSpan + 10, Math.min(Oy + arcSpan - 10, hitY2)) };
      ray2ReflectedEnd = { x: 50, y: ray2Hit.y };
      if (calcResult.isVirtual) {
        ray2VirtualExtension = {
          x1: ray2Hit.x,
          y1: ray2Hit.y,
          x2: Math.min(950, imageX),
          y2: ray2Hit.y,
        };
      }
    }
  } else {
    // Convex: From A toward virtual F(Fx, Oy)
    const slope = (Oy - Ay) / (Fx - Ax);
    const hitY2 = Ay + slope * (Ox - Ax);
    ray2Hit = { x: Ox, y: Math.max(Oy - arcSpan + 10, Math.min(Oy + arcSpan - 10, hitY2)) };
    ray2ReflectedEnd = { x: 50, y: ray2Hit.y };
    // Virtual extension: from hit point to virtual focus F, and parallel backward extension to image tip
    ray2VirtualExtension = {
      x1: ray2Hit.x,
      y1: ray2Hit.y,
      x2: Math.min(950, imageX + 100),
      y2: ray2Hit.y,
    };
  }

  // --- RAY 3: Through / Towards Center of Curvature C ---
  // Concave: From A through C(Cx, Oy) to Mirror at M3 -> Reflects back along same path
  // Convex: Directed towards virtual C(Cx, Oy) -> Reflects back along same path
  let ray3Hit: Point2D = { x: Ox, y: Oy };
  let ray3VirtualExtension: { x1: number; y1: number; x2: number; y2: number } | null = null;

  if (mirrorType === 'concave') {
    const slope = (Oy - Ay) / (Cx - Ax);
    const hitY3 = Ay + slope * (Ox - Ax);
    ray3Hit = { x: Ox, y: Math.max(Oy - arcSpan + 10, Math.min(Oy + arcSpan - 10, hitY3)) };
    if (calcResult.isVirtual) {
      ray3VirtualExtension = {
        x1: ray3Hit.x,
        y1: ray3Hit.y,
        x2: Math.min(950, imageX),
        y2: imageTipY,
      };
    }
  } else {
    // Convex: Directed towards virtual C(Cx, Oy)
    const slope = (Oy - Ay) / (Cx - Ax);
    const hitY3 = Ay + slope * (Ox - Ax);
    ray3Hit = { x: Ox, y: Math.max(Oy - arcSpan + 10, Math.min(Oy + arcSpan - 10, hitY3)) };
    ray3VirtualExtension = {
      x1: ray3Hit.x,
      y1: ray3Hit.y,
      x2: Cx,
      y2: Oy,
    };
  }

  // Quick preset shortcuts for students
  const applyPreset = (preset: 'ruang1_maya' | 'ruang2_nyata' | 'titikC_sama' | 'convex_default') => {
    if (preset === 'ruang1_maya') {
      if (mirrorType === 'concave') {
        if (setFocalLength) setFocalLength(140);
        setObjectDistance(80); // s < f -> MAYA, TEGAK, DIPERBESAR
        setObjectHeight(65);
      } else {
        if (setFocalLength) setFocalLength(140);
        setObjectDistance(140); // Convex is always MAYA, TEGAK, DIPERKECIL
        setObjectHeight(70);
      }
    } else if (preset === 'ruang2_nyata') {
      setMirrorType('concave');
      if (setFocalLength) setFocalLength(140);
      setObjectDistance(210); // f < s < 2f -> NYATA, TERBALIK, DIPERBESAR
      setObjectHeight(65);
    } else if (preset === 'titikC_sama') {
      setMirrorType('concave');
      if (setFocalLength) setFocalLength(140);
      setObjectDistance(280); // s = 2f -> NYATA, TERBALIK, SAMA BESAR
      setObjectHeight(65);
    } else if (preset === 'convex_default') {
      setMirrorType('convex');
      if (setFocalLength) setFocalLength(140);
      setObjectDistance(180);
      setObjectHeight(70);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-sky-50/60 rounded-2xl border-2 border-indigo-200/90 shadow-md overflow-hidden select-none">
      {/* 1. Top Bar on Canvas: Mirror Switcher, Virtual/Real Presets, and Ray Toggles */}
      <div className="shrink-0 bg-sky-50/90 backdrop-blur-md border-b border-sky-200/80 px-3 py-2 flex flex-wrap items-center justify-between gap-2 z-10">
        {/* Mirror Type Switcher */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 px-1 uppercase">Cermin:</span>
          <button
            onClick={() => setMirrorType('concave')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              mirrorType === 'concave'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🥣 Cermin Cekung
          </button>
          <button
            onClick={() => setMirrorType('convex')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              mirrorType === 'convex'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🌐 Cermin Cembung
          </button>
        </div>

        {/* Quick Presets for Virtual vs Real Image */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-500 px-1 uppercase">Preset:</span>
          <button
            onClick={() => applyPreset('ruang1_maya')}
            title="Benda di depan fokus (s < f): Membentuk bayangan MAYA, TEGAK, DIPERBESAR"
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
              calcResult.isVirtual
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            ✨ Bayangan Maya (s &lt; f)
          </button>
          <button
            onClick={() => applyPreset('ruang2_nyata')}
            title="Benda di antara F dan C: Membentuk bayangan NYATA, TERBALIK, DIPERBESAR"
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
              calcResult.isReal && calcResult.isMagnified
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Nyata (f &lt; s &lt; 2f)
          </button>
          <button
            onClick={() => applyPreset('titikC_sama')}
            title="Benda di Titik Pusat C (s = 2f): Bayangan NYATA, TERBALIK, SAMA BESAR"
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
              calcResult.isSameSize
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Di Pusat C (s = 2f)
          </button>
        </div>

        {/* Real-time Status Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-mono text-xs bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-slate-400 text-[10px]">Sifat:</span>
            <span className={`font-bold ${calcResult.isVirtual ? 'text-purple-600' : 'text-cyan-700'}`}>
              {calcResult.isAtInfinity
                ? 'Tak Terhingga (∞)'
                : `${calcResult.isReal ? 'Nyata' : 'Maya'}, ${calcResult.isUpright ? 'Tegak' : 'Terbalik'}, ${calcResult.isMagnified ? 'Diperbesar' : calcResult.isDiminished ? 'Diperkecil' : 'Sama Besar'}`}
            </span>
          </div>

          {/* Tinkercad Canvas Expand / Collapse Button */}
          {onTogglePanel && (
            <button
              onClick={onTogglePanel}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                !isPanelOpen
                  ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs'
              }`}
              title={isPanelOpen ? "Perbesar Kanvas (Sembunyikan Panel Kontrol)" : "Buka Kembali Panel Kontrol"}
            >
              {isPanelOpen ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-slate-700" />
                  <span className="hidden sm:inline">Perbesar Kanvas</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-slate-900" />
                  <span>Buka Panel Kontrol</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Stage SVG Canvas */}
      <div className="flex-1 w-full min-h-0 relative flex items-center justify-center p-1 bg-[#F0F8FF]">
        <svg
          ref={svgRef}
          viewBox="0 0 1000 600"
          className="w-full h-full object-contain cursor-default touch-none"
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
        <defs>
          <pattern id="curvedGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#BAE6FD" strokeWidth="1" />
          </pattern>

          {/* Marker arrows */}
          <marker id="arrowCyan" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0284C7" />
          </marker>
          <marker id="arrowAmber" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#F59E0B" />
          </marker>
          <marker id="arrowGreen" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10B981" />
          </marker>
        </defs>

        {/* Background Grid (Soft friendly light blue) */}
        <rect width="1000" height="600" fill="#F0F8FF" />
        <rect width="1000" height="600" fill="url(#curvedGrid)" />

        {/* Shaded Virtual Space (Behind mirror) */}
        <rect x={Ox} y="0" width={1000 - Ox} height="600" fill="#E0F2FE" opacity="0.75" />

        {/* Zones (Ruang Benda & Ruang Bayangan) */}
        {visibility.showZones && (
          <g id="zones" opacity="0.7">
            {mirrorType === 'concave' ? (
              <>
                {/* Ruang I: between O and F */}
                <rect x={Fx} y="40" width={Ox - Fx} height="520" fill="#0284c7" fillOpacity="0.04" />
                <text x={(Fx + Ox) / 2} y="75" fill="#38bdf8" fontSize="12" fontFamily="var(--font-mono)" textAnchor="middle">
                  RUANG I
                </text>

                {/* Ruang II: between F and C */}
                <rect x={Cx} y="40" width={Fx - Cx} height="520" fill="#6366f1" fillOpacity="0.04" />
                <text x={(Cx + Fx) / 2} y="75" fill="#818cf8" fontSize="12" fontFamily="var(--font-mono)" textAnchor="middle">
                  RUANG II
                </text>

                {/* Ruang III: outside C */}
                <rect x="0" y="40" width={Cx} height="520" fill="#a855f7" fillOpacity="0.04" />
                <text x={Cx / 2} y="75" fill="#c084fc" fontSize="12" fontFamily="var(--font-mono)" textAnchor="middle">
                  RUANG III
                </text>

                {/* Ruang IV: behind mirror */}
                <rect x={Ox} y="40" width={1000 - Ox} height="520" fill="#f59e0b" fillOpacity="0.04" />
                <text x={(Ox + 1000) / 2} y="75" fill="#fbbf24" fontSize="12" fontFamily="var(--font-mono)" textAnchor="middle">
                  RUANG IV (MAYA)
                </text>
              </>
            ) : (
              <>
                {/* Convex mirror rooms */}
                <text x="300" y="75" fill="#38bdf8" fontSize="12" fontFamily="var(--font-mono)" textAnchor="middle">
                  RUANG IV (DEPAN CERMIN)
                </text>
                <text x={(Ox + Fx) / 2} y="75" fill="#fbbf24" fontSize="12" fontFamily="var(--font-mono)" textAnchor="middle">
                  RUANG I (MAYA)
                </text>
                <text x={(Fx + Cx) / 2} y="75" fill="#c084fc" fontSize="12" fontFamily="var(--font-mono)" textAnchor="middle">
                  RUANG II (MAYA)
                </text>
              </>
            )}
          </g>
        )}

        {/* 1. SUMBU UTAMA (Principal Axis) */}
        {visibility.showPrincipalAxis && (
          <g id="principal-axis">
            <line x1="0" y1={Oy} x2="1000" y2={Oy} stroke="#64748b" strokeWidth="1.5" strokeDasharray="6 4" />
            <text x="25" y={Oy - 10} fill="#94a3b8" fontSize="11" fontFamily="var(--font-mono)">
              Sumbu Utama
            </text>
          </g>
        )}

        {/* 2. TITIK-TITIK REFERENSI OPTIK (O, F, C) */}
        {/* Titik Pusat Cermin / Vertex O */}
        {visibility.showVertexPoint && (
          <g id="point-vertex">
            <circle cx={Ox} cy={Oy} r="4" fill="#38bdf8" />
            <text x={Ox - 10} y={Oy + 20} fill="#38bdf8" fontSize="13" fontFamily="var(--font-mono)" fontWeight="bold">
              O
            </text>
          </g>
        )}

        {/* Titik Fokus F */}
        {visibility.showFocalPoint && (
          <g id="point-focus">
            <circle cx={Fx} cy={Oy} r="5" fill="#F59E0B" />
            <text x={Fx} y={Oy + 22} fill="#F59E0B" fontSize="13" fontFamily="var(--font-mono)" fontWeight="bold" textAnchor="middle">
              F {mirrorType === 'convex' ? '(Maya)' : ''}
            </text>
            <text x={Fx} y={Oy + 36} fill="#78716c" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">
              f={focalLength}px
            </text>
          </g>
        )}

        {/* Titik Pusat Kelengkungan C */}
        {visibility.showCenterPoint && (
          <g id="point-center">
            <circle cx={Cx} cy={Oy} r="5" fill="#A855F7" />
            <text x={Cx} y={Oy + 22} fill="#A855F7" fontSize="13" fontFamily="var(--font-mono)" fontWeight="bold" textAnchor="middle">
              C (2F) {mirrorType === 'convex' ? '(Maya)' : ''}
            </text>
            <text x={Cx} y={Oy + 36} fill="#78716c" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">
              R={2 * focalLength}px
            </text>
          </g>
        )}

        {/* 3. CERMIN LENGKUNG (Curved Mirror Surface) */}
        <g id="curved-mirror">
          {/* Backing hatch lines */}
          {hatchLines.map((line, idx) => (
            <line
              key={`hatch-${idx}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#475569"
              strokeWidth="1.5"
            />
          ))}

          {/* Mirror body line */}
          <path
            d={mirrorPath}
            fill="none"
            stroke="#38BDF8"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d={mirrorPath}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>

        {/* 4. SINAR-SINAR ISTIMEWA & PERPANJANGAN */}

        {/* SINAR 1: Sejajar Sumbu Utama -> Melalui / Dari Fokus (Cyan) */}
        {ray1Active && (
          <g id="ray-1">
            {/* Incident Ray: A -> Hit1 */}
            <line
              x1={Ax}
              y1={Ay}
              x2={ray1Hit.x}
              y2={ray1Hit.y}
              stroke="#00F0FF"
              strokeWidth="2.2"
              strokeDasharray={isAnimated ? '6 3' : undefined}
              strokeDashoffset={isAnimated ? dashOffset : undefined}
            />
            {/* Arrow on Incident Ray 1 */}
            <circle cx={(Ax + ray1Hit.x) / 2} cy={Ay} r="2.5" fill="#00F0FF" />

            {/* Reflected Ray 1 */}
            <line
              x1={ray1Hit.x}
              y1={ray1Hit.y}
              x2={ray1ReflectedEnd.x}
              y2={ray1ReflectedEnd.y}
              stroke="#00F0FF"
              strokeWidth="2.2"
              strokeDasharray={isAnimated ? '6 3' : undefined}
              strokeDashoffset={isAnimated ? dashOffset : undefined}
            />
            <circle
              cx={(ray1Hit.x + ray1ReflectedEnd.x) / 2}
              cy={(ray1Hit.y + ray1ReflectedEnd.y) / 2}
              r="2.5"
              fill="#00F0FF"
            />

            {/* Virtual Extension Ray 1 (Dashed) */}
            {visibility.showVirtualExtensions && ray1VirtualExtension && (
              <line
                x1={ray1VirtualExtension.x1}
                y1={ray1VirtualExtension.y1}
                x2={ray1VirtualExtension.x2}
                y2={ray1VirtualExtension.y2}
                stroke="#00F0FF"
                strokeWidth="1.6"
                strokeDasharray="4 3"
                opacity="0.7"
              />
            )}

            {visibility.showRayLabels && (
              <text x={Ax + 20} y={Ay - 8} fill="#00F0FF" fontSize="10" fontFamily="var(--font-mono)">
                Sinar 1 (Sejajar)
              </text>
            )}
          </g>
        )}

        {/* SINAR 2: Melalui / Menuju Fokus -> Sejajar Sumbu Utama (Amber) */}
        {ray2Active && !isInfinity && (
          <g id="ray-2">
            {/* Incident Ray 2: A -> Hit2 */}
            <line
              x1={Ax}
              y1={Ay}
              x2={ray2Hit.x}
              y2={ray2Hit.y}
              stroke="#F59E0B"
              strokeWidth="2.2"
              strokeDasharray={isAnimated ? '6 3' : undefined}
              strokeDashoffset={isAnimated ? dashOffset : undefined}
            />
            <circle cx={(Ax + ray2Hit.x) / 2} cy={(Ay + ray2Hit.y) / 2} r="2.5" fill="#F59E0B" />

            {/* Reflected Ray 2 */}
            <line
              x1={ray2Hit.x}
              y1={ray2Hit.y}
              x2={ray2ReflectedEnd.x}
              y2={ray2ReflectedEnd.y}
              stroke="#F59E0B"
              strokeWidth="2.2"
              strokeDasharray={isAnimated ? '6 3' : undefined}
              strokeDashoffset={isAnimated ? dashOffset : undefined}
            />
            <circle
              cx={(ray2Hit.x + ray2ReflectedEnd.x) / 2}
              cy={ray2Hit.y}
              r="2.5"
              fill="#F59E0B"
            />

            {/* Virtual Extension Ray 2 (Dashed) */}
            {visibility.showVirtualExtensions && ray2VirtualExtension && (
              <line
                x1={ray2VirtualExtension.x1}
                y1={ray2VirtualExtension.y1}
                x2={ray2VirtualExtension.x2}
                y2={ray2VirtualExtension.y2}
                stroke="#F59E0B"
                strokeWidth="1.6"
                strokeDasharray="4 3"
                opacity="0.7"
              />
            )}

            {visibility.showRayLabels && (
              <text x={Ax + 20} y={Ay + 18} fill="#F59E0B" fontSize="10" fontFamily="var(--font-mono)">
                Sinar 2 (Fokus)
              </text>
            )}
          </g>
        )}

        {/* SINAR 3: Melalui / Menuju Pusat Kelengkungan C -> Dipantulkan Balik (Emerald) */}
        {ray3Active && (
          <g id="ray-3">
            {/* Incident & Reflected Ray 3: A -> Hit3 */}
            <line
              x1={Ax}
              y1={Ay}
              x2={ray3Hit.x}
              y2={ray3Hit.y}
              stroke="#10B981"
              strokeWidth="2.2"
              strokeDasharray={isAnimated ? '6 3' : undefined}
              strokeDashoffset={isAnimated ? dashOffset : undefined}
            />
            <circle cx={(Ax + ray3Hit.x) / 2} cy={(Ay + ray3Hit.y) / 2} r="2.5" fill="#10B981" />

            {/* Virtual Extension Ray 3 (Dashed) */}
            {visibility.showVirtualExtensions && ray3VirtualExtension && (
              <line
                x1={ray3VirtualExtension.x1}
                y1={ray3VirtualExtension.y1}
                x2={ray3VirtualExtension.x2}
                y2={ray3VirtualExtension.y2}
                stroke="#10B981"
                strokeWidth="1.6"
                strokeDasharray="4 3"
                opacity="0.7"
              />
            )}

            {visibility.showRayLabels && (
              <text x={Ax - 30} y={Ay - 18} fill="#10B981" fontSize="10" fontFamily="var(--font-mono)">
                Sinar 3 (Pusat C)
              </text>
            )}
          </g>
        )}

        {/* 5. BAYANGAN AKHIR (Resulting Image Arrow) */}
        {visibility.showFinalImage && !isInfinity && (
          <g id="final-image">
            {/* Stem of Image Arrow */}
            <line
              x1={imageX}
              y1={Oy}
              x2={imageX}
              y2={imageTipY}
              stroke={calcResult.isReal ? '#38BDF8' : '#C084FC'}
              strokeWidth="3.5"
              strokeDasharray={calcResult.isVirtual ? '5 3' : undefined}
              strokeLinecap="round"
            />

            {/* Arrowhead on Image Tip */}
            {calcResult.isUpright ? (
              // Upward pointing arrow
              <polygon
                points={`${imageX},${imageTipY - 7} ${imageX - 6},${imageTipY + 4} ${imageX + 6},${imageTipY + 4}`}
                fill={calcResult.isReal ? '#38BDF8' : '#C084FC'}
              />
            ) : (
              // Downward pointing arrow
              <polygon
                points={`${imageX},${imageTipY + 7} ${imageX - 6},${imageTipY - 4} ${imageX + 6},${imageTipY - 4}`}
                fill={calcResult.isReal ? '#38BDF8' : '#C084FC'}
              />
            )}

            {/* Image Label */}
            <text
              x={imageX}
              y={calcResult.isUpright ? imageTipY - 14 : imageTipY + 22}
              fill={calcResult.isReal ? '#38BDF8' : '#C084FC'}
              fontSize="11"
              fontFamily="var(--font-mono)"
              fontWeight="bold"
              textAnchor="middle"
            >
              BAYANGAN ({calcResult.isReal ? 'NYATA' : 'MAYA'})
            </text>
            <text
              x={imageX}
              y={calcResult.isUpright ? imageTipY - 26 : imageTipY + 34}
              fill="#94a3b8"
              fontSize="10"
              fontFamily="var(--font-mono)"
              textAnchor="middle"
            >
              s'={Math.abs(calcResult.imageDistance)}px · h'={Math.abs(calcResult.imageHeight)}px
            </text>
          </g>
        )}

        {/* Special Case: Object at Focus -> Image at Infinity */}
        {isInfinity && (
          <g id="image-at-infinity">
            <text x="300" y="240" fill="#f59e0b" fontSize="14" fontFamily="var(--font-mono)" fontWeight="bold" textAnchor="middle">
              BERKAS SINAR PANTUL SEJAJAR (TIDAK MEMBENTUK BAYANGAN / DI TAK TERHINGGA ∞)
            </text>
          </g>
        )}

        {/* 6. BENDA ASLI (Object Arrow with interactive drag handles) */}
        <g id="original-object">
          {/* Stem of Object Arrow */}
          <line
            x1={Ax}
            y1={Oy}
            x2={Ax}
            y2={Ay}
            stroke="#00F0FF"
            strokeWidth="4"
            strokeLinecap="round"
            className="cursor-ew-resize"
            onMouseDown={handlePointerDownObject}
            onTouchStart={handlePointerDownObject}
          />

          {/* Upward Arrowhead on Object Tip */}
          <polygon
            points={`${Ax},${Ay - 9} ${Ax - 7},${Ay + 3} ${Ax + 7},${Ay + 3}`}
            fill="#00F0FF"
            className="cursor-ns-resize"
            onMouseDown={handlePointerDownHeight}
            onTouchStart={handlePointerDownHeight}
          />

          {/* Drag Handle on Arrow Tip */}
          <circle
            cx={Ax}
            cy={Ay}
            r="8"
            fill="#0F172A"
            stroke="#00F0FF"
            strokeWidth="2"
            className="cursor-ns-resize hover:scale-125 transition-transform"
            onMouseDown={handlePointerDownHeight}
            onTouchStart={handlePointerDownHeight}
          />

          {/* Drag Handle at Base */}
          <circle
            cx={Ax}
            cy={Oy}
            r="8"
            fill="#0F172A"
            stroke="#00F0FF"
            strokeWidth="2"
            className="cursor-ew-resize hover:scale-125 transition-transform"
            onMouseDown={handlePointerDownObject}
            onTouchStart={handlePointerDownObject}
          />

          {/* Object Labels */}
          <text x={Ax} y={Ay - 18} fill="#00F0FF" fontSize="12" fontFamily="var(--font-mono)" fontWeight="bold" textAnchor="middle">
            BENDA
          </text>
          <text x={Ax} y={Oy + 20} fill="#94a3b8" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">
            s={objectDistance}px · h={objectHeight}px
          </text>
        </g>
      </svg>
      </div>

      {/* 3. Bottom Strip: Tips & Ray Measurements */}
      <div className="shrink-0 bg-slate-50 border-t border-slate-200 px-3 py-1.5 flex flex-wrap items-center justify-between text-xs text-slate-600 z-10">
        <div className="flex items-center gap-2 text-[11px]">
          <span className="font-bold text-indigo-700">💡 Praktikum:</span>
          <span>Geser panah benda untuk atur jarak (s) atau tarik pucuk panah untuk ubah tinggi (h).</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
            f={mirrorType === 'concave' ? `+${focalLength}` : `-${focalLength}`}px
          </span>
          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
            s={objectDistance}px
          </span>
          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
            s'={calcResult.isAtInfinity ? '∞' : `${calcResult.imageDistance}px`}
          </span>
          <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-bold text-indigo-600">
            M={calcResult.isAtInfinity ? '∞' : `${calcResult.magnification}x`}
          </span>
        </div>
      </div>
    </div>
  );
};
