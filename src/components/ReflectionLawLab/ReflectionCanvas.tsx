import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Point2D, ShapeType, MirrorOption, VertexRayPair, ReflectionVisibility } from '../../types/physics';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface ReflectionCanvasProps {
  mirrorOption: MirrorOption;
  setMirrorOption: (m: MirrorOption) => void;
  shapeType: ShapeType;
  setShapeType: (s: ShapeType) => void;
  selectedVertexFilter: number | 'all';
  setSelectedVertexFilter: (v: number | 'all') => void;
  objectPos: Point2D;
  setObjectPos: (p: Point2D) => void;
  mirrorX: number;
  setMirrorX: (x: number) => void;
  focalLength: number;
  setFocalLength: (f: number) => void;
  vertexPairs: VertexRayPair[];
  allVertices: { point: Point2D; label: string; color: string }[];
  visibility: ReflectionVisibility;
  isAnimated: boolean;
  onCustomVertexDrag?: (index: number, newPos: Point2D) => void;
  customVertices?: Point2D[];
  constructionStep: number; // 0 = full, 1..8 = step-by-step
  setConstructionStep: (s: number) => void;
  isAutoPlayingSteps: boolean;
  setIsAutoPlayingSteps: (v: boolean) => void;
  isPanelOpen?: boolean;
  onTogglePanel?: () => void;
}

export const ReflectionCanvas: React.FC<ReflectionCanvasProps> = ({
  mirrorOption,
  setMirrorOption,
  shapeType,
  setShapeType,
  selectedVertexFilter,
  setSelectedVertexFilter,
  objectPos,
  setObjectPos,
  mirrorX,
  setMirrorX,
  focalLength,
  vertexPairs,
  allVertices,
  visibility,
  isAnimated,
  onCustomVertexDrag,
  customVertices,
  constructionStep,
  setConstructionStep,
  isAutoPlayingSteps,
  setIsAutoPlayingSteps,
  isPanelOpen = true,
  onTogglePanel,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draggingTarget, setDraggingTarget] = useState<'object' | 'mirror' | { customVertex: number } | null>(null);
  const [dragOffset, setDragOffset] = useState<Point2D>({ x: 0, y: 0 });
  const [dashOffset, setDashOffset] = useState(0);

  // Soft animation pulse for ray waves
  useEffect(() => {
    let animId: number;
    if (isAnimated) {
      const animate = () => {
        setDashOffset((prev) => (prev - 0.9) % 20);
        animId = requestAnimationFrame(animate);
      };
      animId = requestAnimationFrame(animate);
    }
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isAnimated]);

  // Auto-play step-by-step timer
  useEffect(() => {
    let timer: number;
    if (isAutoPlayingSteps) {
      timer = window.setInterval(() => {
        setConstructionStep(constructionStep >= 8 ? 1 : constructionStep + 1);
      }, 2400);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoPlayingSteps, constructionStep, setConstructionStep]);

  // Convert client coordinates to SVG user coordinates (viewBox 0 0 900 520)
  const getSVGCoordinates = (e: React.MouseEvent | React.TouchEvent): Point2D => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const viewBox = svg.viewBox.baseVal;
    const scaleX = viewBox.width / rect.width;
    const scaleY = viewBox.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (
    e: React.MouseEvent | React.TouchEvent,
    target: 'object' | 'mirror' | { customVertex: number }
  ) => {
    e.stopPropagation();
    const pt = getSVGCoordinates(e);
    setDraggingTarget(target);

    if (target === 'object') {
      setDragOffset({ x: pt.x - objectPos.x, y: pt.y - objectPos.y });
    } else if (target === 'mirror') {
      setDragOffset({ x: pt.x - mirrorX, y: 0 });
    }
  };

  const handlePointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!draggingTarget) return;
      const pt = getSVGCoordinates(e);

      if (draggingTarget === 'object') {
        const clampedX = Math.max(70, Math.min(mirrorX - 80, pt.x - dragOffset.x));
        const clampedY = Math.max(80, Math.min(460, pt.y - dragOffset.y));
        setObjectPos({ x: clampedX, y: clampedY });
      } else if (draggingTarget === 'mirror') {
        const clampedX = Math.max(objectPos.x + 100, Math.min(740, pt.x - dragOffset.x));
        setMirrorX(clampedX);
      } else if (typeof draggingTarget === 'object' && 'customVertex' in draggingTarget) {
        if (onCustomVertexDrag) {
          onCustomVertexDrag(draggingTarget.customVertex, {
            x: pt.x - objectPos.x,
            y: pt.y - objectPos.y,
          });
        }
      }
    },
    [draggingTarget, dragOffset, objectPos, mirrorX, setObjectPos, setMirrorX, onCustomVertexDrag]
  );

  const handlePointerUp = () => {
    setDraggingTarget(null);
  };

  // Center vertical line of mirror
  const mirrorCenterY = 260;
  const mirrorHalfSpan = 220;

  // Mirror Curvature Math
  const R = 2 * focalLength;
  const Fx = mirrorOption === 'concave' ? mirrorX - focalLength : mirrorX + focalLength;
  const Cx = mirrorOption === 'concave' ? mirrorX - R : mirrorX + R;

  // Mirror Path
  let mirrorPath = `M ${mirrorX} ${mirrorCenterY - mirrorHalfSpan} L ${mirrorX} ${mirrorCenterY + mirrorHalfSpan}`;
  if (mirrorOption === 'concave') {
    const arcRadius = Math.max(220, R);
    mirrorPath = `M ${mirrorX + 15} ${mirrorCenterY - mirrorHalfSpan} A ${arcRadius} ${arcRadius} 0 0 0 ${mirrorX + 15} ${mirrorCenterY + mirrorHalfSpan}`;
  } else if (mirrorOption === 'convex') {
    const arcRadius = Math.max(220, R);
    mirrorPath = `M ${mirrorX - 15} ${mirrorCenterY - mirrorHalfSpan} A ${arcRadius} ${arcRadius} 0 0 1 ${mirrorX - 15} ${mirrorCenterY + mirrorHalfSpan}`;
  }

  // Hatching on non-reflective backside
  const hatchLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const hatchCount = 20;
  for (let i = 0; i <= hatchCount; i++) {
    const t = (i / hatchCount) * 2 - 1;
    const y = mirrorCenterY + t * (mirrorHalfSpan - 15);
    const offset = mirrorOption === 'concave' ? t * t * 18 : mirrorOption === 'convex' ? -t * t * 18 : 0;
    const baseX = mirrorX + offset;
    hatchLines.push({
      x1: baseX,
      y1: y,
      x2: baseX + 12,
      y2: y + 7,
    });
  }

  // Filter active vertex pairs
  const activePairs = selectedVertexFilter === 'all'
    ? vertexPairs
    : vertexPairs.filter((p) => p.vertexId === selectedVertexFilter);

  const stepTargetPair = activePairs[0] || vertexPairs[0];
  const targetLabelText = selectedVertexFilter === 'all'
    ? 'Semua Sudut (' + activePairs.map((p) => p.label).join(', ') + ')'
    : `Sudut ${stepTargetPair?.label || 'A'}`;

  // Original object polygon path
  const origPoints = allVertices.map((v) => v.point);
  const origPathD = origPoints.length > 1
    ? `M ${origPoints.map((p) => `${p.x},${p.y}`).join(' L ')} Z`
    : '';

  // Virtual / Real Image polygon path
  const imgPoints = vertexPairs
    .map((v) => v.intersectionPoint)
    .filter((p) => p.x > -1000 && p.x < 2000 && p.y > -1000 && p.y < 2000);
  const imgPathD = imgPoints.length > 1
    ? `M ${imgPoints.map((p) => `${p.x},${p.y}`).join(' L ')} Z`
    : '';

  // Center reference / curvature center O coordinates
  const Ox = mirrorOption === 'concave' ? mirrorX - R : mirrorOption === 'convex' ? mirrorX + R : mirrorX;
  const Oy = mirrorCenterY;

  // Step explanation texts (Pedagogical sequence for all corners or chosen corner)
  const stepExplanations: { [step: number]: { title: string; desc: string } } = {
    0: {
      title: 'Tampilan Penuh (Semua Sinar & Bayangan Lengkap)',
      desc: 'Menampilkan seluruh berkas sinar, garis normal dari Titik Pusat O menembus cermin, dan rekonstruksi bayangan secara utuh.',
    },
    1: {
      title: `Langkah 1: Sinar Datang 1 untuk ${targetLabelText}`,
      desc: `Sinar Datang 1 dipancarkan dari ${targetLabelText} menuju cermin. Garis putus-putus ke belakang objek menunjukkan arah perambatan asal sinar.`,
    },
    2: {
      title: `Langkah 2: Menarik Garis Normal 1 (N₁) dari Titik Pusat O Melewati Cermin`,
      desc: `Garis normal N₁ ditarik berhulu dari Titik Pusat O dan MENEMBUS MELEWATI permukaan cermin secara tegak lurus (90°) pada titik pantul. Garis normal ini adalah garis acuan untuk mengukur sudut datang i₁!`,
    },
    3: {
      title: `Langkah 3: Sinar Pantul 1 & Perpanjangannya ke Belakang Cermin`,
      desc: `Sinar memantul dengan sudut pantul r₁ yang sama persis dengan sudut datang i₁ (i₁ = r₁ diukur dari garis normal). Garis pantul diperpanjang lurus ke belakang cermin berupa garis putus-putus.`,
    },
    4: {
      title: `Langkah 4: Sinar Datang 2 (Arah Berbeda) untuk ${targetLabelText}`,
      desc: `Dari ${targetLabelText} yang sama, kita pancarkan Sinar Datang 2 dengan arah sudut berbeda menuju titik kedua pada cermin.`,
    },
    5: {
      title: `Langkah 5: Menarik Garis Normal 2 (N₂) dari Titik Pusat O Melewati Cermin`,
      desc: `Garis normal N₂ ditarik dari Titik Pusat O menembus cermin tegak lurus 90° pada titik pantul 2 sebagai acuan sudut datang i₂.`,
    },
    6: {
      title: `Langkah 6: Sinar Pantul 2 & Perpotongan di Belakang Cermin`,
      desc: `Sinar Pantul 2 memantul (r₂ = i₂). Perpanjangan sinar pantul 2 ditarik ke belakang hingga BERPOTONGAN dengan perpanjangan Sinar 1!`,
    },
    7: {
      title: `Langkah 7: Titik Bayangan Maya ${targetLabelText}' Terkunci!`,
      desc: `Kedua perpanjangan sinar pantul saling berpotongan di satu titik di belakang cermin, membentuk letak pasti titik bayangan (${targetLabelText}')!`,
    },
    8: {
      title: `Langkah 8: Seluruh Sudut Terhubung Menjadi Bayangan Utuh`,
      desc: `Dengan menghubungkan seluruh titik potong bayangan (A', B', C'...), bentuk bayangan utuh objek terbentuk dengan sempurna!`,
    },
  };

  const currentStepInfo = stepExplanations[constructionStep] || stepExplanations[0];

  return (
    <div className="relative w-full h-full flex flex-col bg-sky-50/60 rounded-2xl border-2 border-sky-300/80 shadow-md overflow-hidden select-none">
      {/* 1. Top Bar: Mirror Switcher & Shape Picker */}
      <div className="shrink-0 bg-sky-50/90 backdrop-blur-md border-b border-sky-200/80 px-3 py-2 flex flex-wrap items-center justify-between gap-2 z-10">
        {/* Mirror Switcher: Datar / Cekung / Cembung */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 px-1.5 uppercase">Pilih Cermin:</span>
          <button
            onClick={() => setMirrorOption('flat')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              mirrorOption === 'flat'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🪞 Datar
          </button>
          <button
            onClick={() => setMirrorOption('concave')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              mirrorOption === 'concave'
                ? 'bg-indigo-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🥣 Cekung
          </button>
          <button
            onClick={() => setMirrorOption('convex')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              mirrorOption === 'convex'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🌐 Cembung
          </button>
        </div>

        {/* Shape Switcher */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-500 px-1.5 uppercase">Bentuk:</span>
          {(['line', 'triangle', 'square', 'circle', 'star', 'custom'] as ShapeType[]).map((shape) => (
            <button
              key={shape}
              onClick={() => setShapeType(shape)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all capitalize whitespace-nowrap ${
                shapeType === shape
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {shape === 'line' ? 'Garis' : shape === 'triangle' ? 'Segitiga' : shape === 'square' ? 'Persegi' : shape === 'circle' ? 'Lingkaran' : shape === 'star' ? 'Bintang' : 'Bebas'}
            </button>
          ))}
        </div>

        {/* Vertex Focus: All vs Specific Vertex */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 px-1 uppercase">Fokus:</span>
          <button
            onClick={() => setSelectedVertexFilter('all')}
            className={`px-2 py-0.5 text-xs font-bold rounded transition-all ${
              selectedVertexFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semua Sudut
          </button>
          {allVertices.map((v, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedVertexFilter(idx)}
              className={`px-2 py-0.5 text-xs font-bold rounded transition-all`}
              style={{
                backgroundColor: selectedVertexFilter === idx ? v.color : undefined,
                color: selectedVertexFilter === idx ? '#FFFFFF' : v.color,
                border: selectedVertexFilter === idx ? 'none' : '1px solid #E2E8F0',
              }}
            >
              Sudut {v.label}
            </button>
          ))}
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

      {/* 2. Interactive SVG Canvas Stage */}
      <div className="flex-1 w-full relative bg-friendly-grid overflow-hidden">
        <svg
          ref={svgRef}
          viewBox="0 0 900 520"
          className="w-full h-full cursor-default touch-none"
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          <defs>
            <marker id="rayArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0284C7" />
            </marker>
          </defs>

          {/* Shaded space behind mirror */}
          <rect
            x={mirrorX}
            y="0"
            width={900 - mirrorX}
            height="520"
            fill="#E0F2FE"
            opacity="0.75"
          />

          {/* Optical Axis */}
          <line
            x1="0"
            y1={mirrorCenterY}
            x2="900"
            y2={mirrorCenterY}
            stroke="#93C5FD"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* TITIK PUSAT O (Asal Garis Normal) & TITIK FOKUS F */}
          <g id="center-points-and-origin">
            {mirrorOption !== 'flat' && (
              <g id="focal-point">
                <circle cx={Fx} cy={mirrorCenterY} r="5.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
                <rect
                  x={Fx - 22}
                  y={mirrorCenterY + 12}
                  width="44"
                  height="18"
                  rx="4"
                  fill="#FEF3C7"
                  stroke="#F59E0B"
                  strokeWidth="1"
                />
                <text x={Fx} y={mirrorCenterY + 25} fill="#B45309" fontSize="10" fontFamily="var(--font-mono)" fontWeight="bold" textAnchor="middle">
                  F {mirrorOption === 'convex' ? '(Maya)' : ''}
                </text>
              </g>
            )}

            {/* Titik Pusat O (Pusat Kelengkungan / Pusat Acuan Normal) */}
            <g id="center-point-O">
              <circle cx={Ox} cy={Oy} r="16" fill="none" stroke="#0F172A" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.65" />
              <circle cx={Ox} cy={Oy} r="7" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2.5" />
              <rect
                x={Ox - 65}
                y={Oy - 32}
                width="130"
                height="20"
                rx="5"
                fill="#0F172A"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
              <text x={Ox} y={Oy - 18} fill="#FFFFFF" fontSize="10.5" fontFamily="var(--font-mono)" fontWeight="bold" textAnchor="middle">
                {mirrorOption === 'flat' ? 'Pusat Acuan Cermin O' : mirrorOption === 'concave' ? 'Titik Pusat O (C = 2F)' : 'Titik Pusat O (Maya)'}
              </text>
              <text x={Ox} y={Oy + 20} fill="#334155" fontSize="10" fontFamily="var(--font-mono)" fontWeight="bold" textAnchor="middle">
                📍 Asal Garis Normal
              </text>
            </g>
          </g>

          {/* 1. CERMIN (Mirror Line / Arc) */}
          <g id="mirror">
            {hatchLines.map((h, idx) => (
              <line
                key={`h-${idx}`}
                x1={h.x1}
                y1={h.y1}
                x2={h.x2}
                y2={h.y2}
                stroke="#94A3B8"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ))}

            <path
              d={mirrorPath}
              fill="none"
              stroke="#0284C7"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d={mirrorPath}
              fill="none"
              stroke="#E0F2FE"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Mirror Drag Handle */}
            <g
              className="cursor-ew-resize"
              onMouseDown={(e) => handlePointerDown(e, 'mirror')}
              onTouchStart={(e) => handlePointerDown(e, 'mirror')}
            >
              <circle cx={mirrorX} cy={mirrorCenterY} r="14" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
              <text x={mirrorX} y={mirrorCenterY + 4} fill="#0284C7" fontSize="10" fontFamily="var(--font-mono)" fontWeight="bold" textAnchor="middle">
                M
              </text>
              <text x={mirrorX} y={mirrorCenterY - 20} fill="#475569" fontSize="11" fontFamily="var(--font-mono)" fontWeight="bold" textAnchor="middle">
                {mirrorOption === 'flat' ? 'Cermin Datar' : mirrorOption === 'concave' ? 'Cermin Cekung' : 'Cermin Cembung'}
              </text>
            </g>
          </g>

          {/* 2. RECONSTRUCTED IMAGE (Connected Image Outline & Area) */}
          {/* Shown in Step 0 (Full view) or Step 8 */}
          {visibility.showVirtualImage && (constructionStep === 0 || constructionStep >= 8) && imgPathD && (
            <g id="reconstructed-image">
              {shapeType !== 'line' && (
                <path
                  d={imgPathD}
                  fill="#818CF8"
                  fillOpacity="0.22"
                  stroke="#6366F1"
                  strokeWidth="2.5"
                  strokeDasharray="5 4"
                />
              )}
              {shapeType === 'line' && imgPoints.length >= 2 && (
                <line
                  x1={imgPoints[0].x}
                  y1={imgPoints[0].y}
                  x2={imgPoints[imgPoints.length - 1].x}
                  y2={imgPoints[imgPoints.length - 1].y}
                  stroke="#6366F1"
                  strokeWidth="3.5"
                  strokeDasharray="5 4"
                  strokeLinecap="round"
                />
              )}
            </g>
          )}

          {/* 3. TWO RAYS PER VERTEX & PROMINENT NORMAL LINES FROM O & ANGLE ARCS */}
          {/* Active pairs map ensures steps 1-7 work for ALL corners when 'all' is selected, or any specific corner */}
          {activePairs.map((pair) => {
            if (!pair) return null;
            const { ray1, ray2, intersectionPoint, label, color } = pair;

            // Visibility flags for this pair based on construction step
            const showRay1Inc = constructionStep === 0 || constructionStep >= 1;
            const showNorm1 = (constructionStep === 0 || constructionStep >= 2) && visibility.showNormalLines;
            const showRay1Refl = constructionStep === 0 || constructionStep >= 3;
            const showRay1Virt = (constructionStep === 0 || constructionStep >= 3) && visibility.showVirtualExtensions;

            const showRay2Inc = constructionStep === 0 || constructionStep >= 4;
            const showNorm2 = (constructionStep === 0 || constructionStep >= 5) && visibility.showNormalLines;
            const showRay2Refl = constructionStep === 0 || constructionStep >= 6;
            const showRay2Virt = (constructionStep === 0 || constructionStep >= 6) && visibility.showVirtualExtensions;

            const showIntPoint = (constructionStep === 0 || constructionStep >= 7) && visibility.showVirtualPoints;

            // Normal 1 Vectors & Right-Angle Box
            const n1 = {
              x: (ray1.normalEndPoint.x - ray1.hitPoint.x) / 70,
              y: (ray1.normalEndPoint.y - ray1.hitPoint.y) / 70,
            };
            const t1 = { x: -n1.y, y: n1.x };
            const box1 = `M ${ray1.hitPoint.x + n1.x * 12} ${ray1.hitPoint.y + n1.y * 12} L ${ray1.hitPoint.x + n1.x * 12 + t1.x * 12} ${ray1.hitPoint.y + n1.y * 12 + t1.y * 12} L ${ray1.hitPoint.x + t1.x * 12} ${ray1.hitPoint.y + t1.y * 12}`;

            // Angle 1 Vectors for measuring i1 and r1 relative to Normal
            const in1Dx = ray1.sourcePoint.x - ray1.hitPoint.x;
            const in1Dy = ray1.sourcePoint.y - ray1.hitPoint.y;
            const in1Len = Math.hypot(in1Dx, in1Dy) || 1;
            const uIn1 = { x: in1Dx / in1Len, y: in1Dy / in1Len };

            const norm1Dx = ray1.normalEndPoint.x - ray1.hitPoint.x;
            const norm1Dy = ray1.normalEndPoint.y - ray1.hitPoint.y;
            const norm1Len = Math.hypot(norm1Dx, norm1Dy) || 1;
            const uNorm1 = { x: norm1Dx / norm1Len, y: norm1Dy / norm1Len };

            const ref1Dx = ray1.reflectedEndPoint.x - ray1.hitPoint.x;
            const ref1Dy = ray1.reflectedEndPoint.y - ray1.hitPoint.y;
            const ref1Len = Math.hypot(ref1Dx, ref1Dy) || 1;
            const uRef1 = { x: ref1Dx / ref1Len, y: ref1Dy / ref1Len };

            const arcR1 = 28;
            const pIn1 = { x: ray1.hitPoint.x + uIn1.x * arcR1, y: ray1.hitPoint.y + uIn1.y * arcR1 };
            const pNorm1 = { x: ray1.hitPoint.x + uNorm1.x * arcR1, y: ray1.hitPoint.y + uNorm1.y * arcR1 };
            const pRef1 = { x: ray1.hitPoint.x + uRef1.x * (arcR1 - 7), y: ray1.hitPoint.y + uRef1.y * (arcR1 - 7) };
            const pNorm1Small = { x: ray1.hitPoint.x + uNorm1.x * (arcR1 - 7), y: ray1.hitPoint.y + uNorm1.y * (arcR1 - 7) };

            // Normal 2 Vectors & Right-Angle Box
            const n2 = {
              x: (ray2.normalEndPoint.x - ray2.hitPoint.x) / 70,
              y: (ray2.normalEndPoint.y - ray2.hitPoint.y) / 70,
            };
            const t2 = { x: -n2.y, y: n2.x };
            const box2 = `M ${ray2.hitPoint.x + n2.x * 12} ${ray2.hitPoint.y + n2.y * 12} L ${ray2.hitPoint.x + n2.x * 12 + t2.x * 12} ${ray2.hitPoint.y + n2.y * 12 + t2.y * 12} L ${ray2.hitPoint.x + t2.x * 12} ${ray2.hitPoint.y + t2.y * 12}`;

            const in2Dx = ray2.sourcePoint.x - ray2.hitPoint.x;
            const in2Dy = ray2.sourcePoint.y - ray2.hitPoint.y;
            const in2Len = Math.hypot(in2Dx, in2Dy) || 1;
            const uIn2 = { x: in2Dx / in2Len, y: in2Dy / in2Len };

            const norm2Dx = ray2.normalEndPoint.x - ray2.hitPoint.x;
            const norm2Dy = ray2.normalEndPoint.y - ray2.hitPoint.y;
            const norm2Len = Math.hypot(norm2Dx, norm2Dy) || 1;
            const uNorm2 = { x: norm2Dx / norm2Len, y: norm2Dy / norm2Len };

            const ref2Dx = ray2.reflectedEndPoint.x - ray2.hitPoint.x;
            const ref2Dy = ray2.reflectedEndPoint.y - ray2.hitPoint.y;
            const ref2Len = Math.hypot(ref2Dx, ref2Dy) || 1;
            const uRef2 = { x: ref2Dx / ref2Len, y: ref2Dy / ref2Len };

            const arcR2 = 28;
            const pIn2 = { x: ray2.hitPoint.x + uIn2.x * arcR2, y: ray2.hitPoint.y + uIn2.y * arcR2 };
            const pNorm2 = { x: ray2.hitPoint.x + uNorm2.x * arcR2, y: ray2.hitPoint.y + uNorm2.y * arcR2 };
            const pRef2 = { x: ray2.hitPoint.x + uRef2.x * (arcR2 - 7), y: ray2.hitPoint.y + uRef2.y * (arcR2 - 7) };
            const pNorm2Small = { x: ray2.hitPoint.x + uNorm2.x * (arcR2 - 7), y: ray2.hitPoint.y + uNorm2.y * (arcR2 - 7) };

            return (
              <g key={`vertex-rays-${pair.vertexId}`}>
                {/* RAY 1: INCIDENT WITH BACKWARD UPSTREAM EXTENSION */}
                {showRay1Inc && visibility.showIncidentRays && (
                  <g id={`ray1-inc-${pair.vertexId}`}>
                    {/* Backward upstream extension */}
                    <line
                      x1={ray1.sourceBackwardExt.x}
                      y1={ray1.sourceBackwardExt.y}
                      x2={ray1.sourcePoint.x}
                      y2={ray1.sourcePoint.y}
                      stroke={color}
                      strokeWidth="2"
                      strokeDasharray="4 3"
                      strokeLinecap="round"
                      opacity="0.75"
                    />
                    <circle
                      cx={(ray1.sourceBackwardExt.x + ray1.sourcePoint.x) / 2}
                      cy={(ray1.sourceBackwardExt.y + ray1.sourcePoint.y) / 2}
                      r="2.5"
                      fill={color}
                    />

                    {/* Main Incident Ray 1 */}
                    <line
                      x1={ray1.sourcePoint.x}
                      y1={ray1.sourcePoint.y}
                      x2={ray1.hitPoint.x}
                      y2={ray1.hitPoint.y}
                      stroke={color}
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeDasharray={isAnimated ? '8 4' : undefined}
                      strokeDashoffset={isAnimated ? dashOffset : undefined}
                    />
                    <circle
                      cx={(ray1.sourcePoint.x + ray1.hitPoint.x) / 2}
                      cy={(ray1.sourcePoint.y + ray1.hitPoint.y) / 2}
                      r="3.5"
                      fill={color}
                    />
                  </g>
                )}

                {/* NORMAL LINE 1: ORIGINATING FROM TITIK O, PASSING THROUGH MIRROR */}
                {showNorm1 && (
                  <g id={`normal1-${pair.vertexId}`}>
                    {/* Construction connection line from Titik Pusat O */}
                    <line
                      x1={Ox}
                      y1={Oy}
                      x2={ray1.hitPoint.x}
                      y2={ray1.hitPoint.y}
                      stroke="#0F172A"
                      strokeWidth="1.8"
                      strokeDasharray="4 3"
                      opacity="0.6"
                    />

                    {/* Bold Normal line spanning and passing through mirror (melewati cermin) */}
                    <line
                      x1={ray1.normalStartPoint.x}
                      y1={ray1.normalStartPoint.y}
                      x2={ray1.normalEndPoint.x}
                      y2={ray1.normalEndPoint.y}
                      stroke="#0F172A"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                      strokeLinecap="round"
                    />

                    {/* 90-degree right angle marker */}
                    <path d={box1} fill="none" stroke="#0F172A" strokeWidth="1.6" />
                    <circle cx={ray1.hitPoint.x + n1.x * 6 + t1.x * 6} cy={ray1.hitPoint.y + n1.y * 6 + t1.y * 6} r="1.5" fill="#0F172A" />

                    {/* Normal Badge N1 */}
                    <rect
                      x={ray1.normalEndPoint.x - 16}
                      y={ray1.normalEndPoint.y - 12}
                      width="32"
                      height="22"
                      rx="5"
                      fill="#0F172A"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    <text
                      x={ray1.normalEndPoint.x}
                      y={ray1.normalEndPoint.y + 4}
                      fill="#FFFFFF"
                      fontSize="10"
                      fontFamily="var(--font-mono)"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      N₁{activePairs.length > 1 ? label : ''}
                    </text>
                  </g>
                )}

                {/* RAY 1: REFLECTED RAY & VIRTUAL BACKWARD EXTENSION */}
                {showRay1Refl && visibility.showReflectedRays && (
                  <g id={`ray1-refl-${pair.vertexId}`}>
                    <line
                      x1={ray1.hitPoint.x}
                      y1={ray1.hitPoint.y}
                      x2={ray1.reflectedEndPoint.x}
                      y2={ray1.reflectedEndPoint.y}
                      stroke={color}
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeDasharray={isAnimated ? '8 4' : undefined}
                      strokeDashoffset={isAnimated ? dashOffset : undefined}
                    />
                    <circle
                      cx={(ray1.hitPoint.x + ray1.reflectedEndPoint.x) / 2}
                      cy={(ray1.hitPoint.y + ray1.reflectedEndPoint.y) / 2}
                      r="3.5"
                      fill={color}
                    />
                  </g>
                )}

                {/* Ray 1 Virtual Backward Extension */}
                {showRay1Virt && (
                  <line
                    x1={ray1.hitPoint.x}
                    y1={ray1.hitPoint.y}
                    x2={intersectionPoint.x}
                    y2={intersectionPoint.y}
                    stroke={color}
                    strokeWidth="2.2"
                    strokeDasharray="5 3"
                    opacity="0.85"
                  />
                )}

                {/* Angle 1 Arcs & Calculation relative to Normal */}
                {showRay1Refl && visibility.showIncidentAngles && (
                  <g id={`angle1-${pair.vertexId}`}>
                    {/* Angle arc for i1 */}
                    <path
                      d={`M ${ray1.hitPoint.x} ${ray1.hitPoint.y} L ${pIn1.x} ${pIn1.y} A ${arcR1} ${arcR1} 0 0 1 ${pNorm1.x} ${pNorm1.y} Z`}
                      fill="#F59E0B"
                      fillOpacity="0.28"
                      stroke="#D97706"
                      strokeWidth="1.2"
                    />
                    {/* Angle arc for r1 */}
                    <path
                      d={`M ${ray1.hitPoint.x} ${ray1.hitPoint.y} L ${pNorm1Small.x} ${pNorm1Small.y} A ${arcR1 - 7} ${arcR1 - 7} 0 0 1 ${pRef1.x} ${pRef1.y} Z`}
                      fill="#0284C7"
                      fillOpacity="0.28"
                      stroke="#0284C7"
                      strokeWidth="1.2"
                    />
                    {/* Measurement Badge */}
                    <g transform={`translate(${ray1.hitPoint.x - 70}, ${ray1.hitPoint.y - 20})`}>
                      <rect width="130" height="22" rx="5" fill="#FFFFFF" fillOpacity="0.95" stroke="#CBD5E1" strokeWidth="1" />
                      <text x="65" y="15" fill="#0F172A" fontSize="10" fontFamily="var(--font-mono)" fontWeight="bold" textAnchor="middle">
                        i₁={ray1.incidentAngleDeg}° = r₁ (thd Normal)
                      </text>
                    </g>
                  </g>
                )}

                {/* RAY 2: INCIDENT WITH BACKWARD UPSTREAM EXTENSION */}
                {showRay2Inc && visibility.showIncidentRays && (
                  <g id={`ray2-inc-${pair.vertexId}`}>
                    {/* Backward upstream extension */}
                    <line
                      x1={ray2.sourceBackwardExt.x}
                      y1={ray2.sourceBackwardExt.y}
                      x2={ray2.sourcePoint.x}
                      y2={ray2.sourcePoint.y}
                      stroke={color}
                      strokeWidth="2"
                      strokeDasharray="4 3"
                      strokeLinecap="round"
                      opacity="0.75"
                    />
                    <circle
                      cx={(ray2.sourceBackwardExt.x + ray2.sourcePoint.x) / 2}
                      cy={(ray2.sourceBackwardExt.y + ray2.sourcePoint.y) / 2}
                      r="2.5"
                      fill={color}
                    />

                    {/* Main Incident Ray 2 */}
                    <line
                      x1={ray2.sourcePoint.x}
                      y1={ray2.sourcePoint.y}
                      x2={ray2.hitPoint.x}
                      y2={ray2.hitPoint.y}
                      stroke={color}
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeDasharray={isAnimated ? '8 4' : undefined}
                      strokeDashoffset={isAnimated ? dashOffset : undefined}
                    />
                    <circle
                      cx={(ray2.sourcePoint.x + ray2.hitPoint.x) / 2}
                      cy={(ray2.sourcePoint.y + ray2.hitPoint.y) / 2}
                      r="3.5"
                      fill={color}
                    />
                  </g>
                )}

                {/* NORMAL LINE 2: ORIGINATING FROM TITIK O, PASSING THROUGH MIRROR */}
                {showNorm2 && (
                  <g id={`normal2-${pair.vertexId}`}>
                    {/* Construction connection line from Titik Pusat O */}
                    <line
                      x1={Ox}
                      y1={Oy}
                      x2={ray2.hitPoint.x}
                      y2={ray2.hitPoint.y}
                      stroke="#0F172A"
                      strokeWidth="1.8"
                      strokeDasharray="4 3"
                      opacity="0.6"
                    />

                    {/* Bold Normal line spanning and passing through mirror */}
                    <line
                      x1={ray2.normalStartPoint.x}
                      y1={ray2.normalStartPoint.y}
                      x2={ray2.normalEndPoint.x}
                      y2={ray2.normalEndPoint.y}
                      stroke="#0F172A"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                      strokeLinecap="round"
                    />

                    {/* 90-degree right angle marker */}
                    <path d={box2} fill="none" stroke="#0F172A" strokeWidth="1.6" />
                    <circle cx={ray2.hitPoint.x + n2.x * 6 + t2.x * 6} cy={ray2.hitPoint.y + n2.y * 6 + t2.y * 6} r="1.5" fill="#0F172A" />

                    {/* Normal Badge N2 */}
                    <rect
                      x={ray2.normalEndPoint.x - 16}
                      y={ray2.normalEndPoint.y - 12}
                      width="32"
                      height="22"
                      rx="5"
                      fill="#0F172A"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    <text
                      x={ray2.normalEndPoint.x}
                      y={ray2.normalEndPoint.y + 4}
                      fill="#FFFFFF"
                      fontSize="10"
                      fontFamily="var(--font-mono)"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      N₂{activePairs.length > 1 ? label : ''}
                    </text>
                  </g>
                )}

                {/* RAY 2: REFLECTED RAY & VIRTUAL BACKWARD EXTENSION */}
                {showRay2Refl && visibility.showReflectedRays && (
                  <g id={`ray2-refl-${pair.vertexId}`}>
                    <line
                      x1={ray2.hitPoint.x}
                      y1={ray2.hitPoint.y}
                      x2={ray2.reflectedEndPoint.x}
                      y2={ray2.reflectedEndPoint.y}
                      stroke={color}
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeDasharray={isAnimated ? '8 4' : undefined}
                      strokeDashoffset={isAnimated ? dashOffset : undefined}
                    />
                    <circle
                      cx={(ray2.hitPoint.x + ray2.reflectedEndPoint.x) / 2}
                      cy={(ray2.hitPoint.y + ray2.reflectedEndPoint.y) / 2}
                      r="3.5"
                      fill={color}
                    />
                  </g>
                )}

                {/* Ray 2 Virtual Backward Extension */}
                {showRay2Virt && (
                  <line
                    x1={ray2.hitPoint.x}
                    y1={ray2.hitPoint.y}
                    x2={intersectionPoint.x}
                    y2={intersectionPoint.y}
                    stroke={color}
                    strokeWidth="2.2"
                    strokeDasharray="5 3"
                    opacity="0.85"
                  />
                )}

                {/* Angle 2 Arcs & Calculation relative to Normal */}
                {showRay2Refl && visibility.showIncidentAngles && (
                  <g id={`angle2-${pair.vertexId}`}>
                    {/* Angle arc for i2 */}
                    <path
                      d={`M ${ray2.hitPoint.x} ${ray2.hitPoint.y} L ${pIn2.x} ${pIn2.y} A ${arcR2} ${arcR2} 0 0 1 ${pNorm2.x} ${pNorm2.y} Z`}
                      fill="#F59E0B"
                      fillOpacity="0.28"
                      stroke="#D97706"
                      strokeWidth="1.2"
                    />
                    {/* Angle arc for r2 */}
                    <path
                      d={`M ${ray2.hitPoint.x} ${ray2.hitPoint.y} L ${pNorm2Small.x} ${pNorm2Small.y} A ${arcR2 - 7} ${arcR2 - 7} 0 0 1 ${pRef2.x} ${pRef2.y} Z`}
                      fill="#0284C7"
                      fillOpacity="0.28"
                      stroke="#0284C7"
                      strokeWidth="1.2"
                    />
                    {/* Measurement Badge */}
                    <g transform={`translate(${ray2.hitPoint.x - 70}, ${ray2.hitPoint.y + 12})`}>
                      <rect width="130" height="22" rx="5" fill="#FFFFFF" fillOpacity="0.95" stroke="#CBD5E1" strokeWidth="1" />
                      <text x="65" y="15" fill="#0F172A" fontSize="10" fontFamily="var(--font-mono)" fontWeight="bold" textAnchor="middle">
                        i₂={ray2.incidentAngleDeg}° = r₂ (thd Normal)
                      </text>
                    </g>
                  </g>
                )}

                {/* INTERSECTION POINT (TITIK POTONG BAYANGAN) */}
                {showIntPoint && (
                  <g id={`int-point-${pair.vertexId}`}>
                    {/* Glowing outer ring */}
                    <circle
                      cx={intersectionPoint.x}
                      cy={intersectionPoint.y}
                      r="10"
                      fill="none"
                      stroke={color}
                      strokeWidth="2"
                      opacity="0.4"
                    />
                    <circle
                      cx={intersectionPoint.x}
                      cy={intersectionPoint.y}
                      r="7"
                      fill={color}
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />
                    <circle cx={intersectionPoint.x} cy={intersectionPoint.y} r="2.5" fill="#FFFFFF" />

                    {/* Point Label Badge */}
                    <rect
                      x={intersectionPoint.x + 10}
                      y={intersectionPoint.y - 12}
                      width="34"
                      height="22"
                      rx="6"
                      fill="#FFFFFF"
                      stroke={color}
                      strokeWidth="1.5"
                    />
                    <text
                      x={intersectionPoint.x + 27}
                      y={intersectionPoint.y + 3}
                      fill={color}
                      fontSize="12"
                      fontFamily="var(--font-mono)"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {label}'
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* 4. ORIGINAL OBJECT & LABELED VERTICES */}
          {visibility.showOriginalObject && (
            <g id="original-object">
              {shapeType !== 'line' && origPathD && (
                <path
                  d={origPathD}
                  fill="#0284C7"
                  fillOpacity="0.18"
                  stroke="#0284C7"
                  strokeWidth="2.5"
                  className="cursor-move"
                  onMouseDown={(e) => handlePointerDown(e, 'object')}
                  onTouchStart={(e) => handlePointerDown(e, 'object')}
                />
              )}
              {shapeType === 'line' && origPoints.length >= 2 && (
                <line
                  x1={origPoints[0].x}
                  y1={origPoints[0].y}
                  x2={origPoints[origPoints.length - 1].x}
                  y2={origPoints[origPoints.length - 1].y}
                  stroke="#0284C7"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="cursor-move"
                  onMouseDown={(e) => handlePointerDown(e, 'object')}
                  onTouchStart={(e) => handlePointerDown(e, 'object')}
                />
              )}

              {/* Labeled Vertex Points (A, B, C...) - Directly clickable to run Langkah 1-7 */}
              {allVertices.map((v, idx) => {
                const isSelected = selectedVertexFilter === idx;
                return (
                  <g
                    key={`vert-${idx}`}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVertexFilter(idx);
                    }}
                  >
                    {/* Selection ring if this corner is currently active */}
                    {isSelected && (
                      <circle
                        cx={v.point.x}
                        cy={v.point.y}
                        r="15"
                        fill="none"
                        stroke={v.color}
                        strokeWidth="2.5"
                        strokeDasharray="4 3"
                        opacity="0.9"
                      />
                    )}
                    <circle
                      cx={v.point.x}
                      cy={v.point.y}
                      r={isSelected ? 10.5 : 8.5}
                      fill={v.color}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      className="group-hover:scale-125 transition-transform"
                    />
                    <text
                      x={v.point.x}
                      y={v.point.y + 3.5}
                      fill="#FFFFFF"
                      fontSize={isSelected ? '11' : '10'}
                      fontFamily="var(--font-mono)"
                      fontWeight="bold"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {v.label}
                    </text>
                  </g>
                );
              })}

              {/* Center Drag Handle on Object */}
              <g
                className="cursor-move"
                onMouseDown={(e) => handlePointerDown(e, 'object')}
                onTouchStart={(e) => handlePointerDown(e, 'object')}
              >
                <circle cx={objectPos.x} cy={objectPos.y} r="12" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
                <circle cx={objectPos.x} cy={objectPos.y} r="4" fill="#0284C7" />
                <text
                  x={objectPos.x}
                  y={objectPos.y - 18}
                  fill="#0369A1"
                  fontSize="12"
                  fontFamily="var(--font-mono)"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Benda Asli
                </text>
              </g>

              {/* Custom draggable handles if Custom Shape */}
              {shapeType === 'custom' &&
                customVertices &&
                customVertices.map((v, idx) => (
                  <circle
                    key={`custom-handle-${idx}`}
                    cx={objectPos.x + v.x}
                    cy={objectPos.y + v.y}
                    r="8"
                    fill="#F59E0B"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="cursor-pointer hover:scale-125 transition-transform"
                    onMouseDown={(e) => handlePointerDown(e, { customVertex: idx })}
                    onTouchStart={(e) => handlePointerDown(e, { customVertex: idx })}
                  />
                ))}
            </g>
          )}

          {/* Distance Dimension Guides: s & s' */}
          <g id="distance-labels">
            <line
              x1={objectPos.x}
              y1="495"
              x2={mirrorX}
              y2="495"
              stroke="#0284C7"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <text
              x={(objectPos.x + mirrorX) / 2}
              y="490"
              fill="#0369A1"
              fontSize="11"
              fontFamily="var(--font-mono)"
              fontWeight="bold"
              textAnchor="middle"
            >
              s = {Math.round(mirrorX - objectPos.x)} px
            </text>

            {mirrorOption === 'flat' && (
              <>
                <line
                  x1={mirrorX}
                  y1="495"
                  x2={mirrorX + (mirrorX - objectPos.x)}
                  y2="495"
                  stroke="#6366F1"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <text
                  x={mirrorX + (mirrorX - objectPos.x) / 2}
                  y="490"
                  fill="#4F46E5"
                  fontSize="11"
                  fontFamily="var(--font-mono)"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  s' = {Math.round(mirrorX - objectPos.x)} px
                </text>
              </>
            )}
          </g>
        </svg>
      </div>

      {/* 3. Bottom Pedagogical Step Controller Strip */}
      <div className="shrink-0 bg-slate-50 border-t border-slate-200 px-3 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 z-10">
        {/* Step Info Callout */}
        <div className="flex items-center gap-2 text-xs min-w-0">
          <div className="p-1 rounded-md bg-amber-100 text-amber-800 font-bold shrink-0 text-[10px]">
            {constructionStep === 0 ? 'MODE BEBAS' : `LANGKAH ${constructionStep}/8`}
          </div>
          <div className="truncate">
            <span className="font-bold text-slate-800">{currentStepInfo.title}: </span>
            <span className="text-slate-600 hidden md:inline">{currentStepInfo.desc}</span>
          </div>
        </div>

        {/* Corner Selection & Step Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {/* Quick Corner Switcher for Langkah 1-7 */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase px-1">Sudut:</span>
            <button
              onClick={() => setSelectedVertexFilter('all')}
              className={`px-2 py-0.5 text-[11px] font-bold rounded transition-all ${
                selectedVertexFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Semua Sudut
            </button>
            {allVertices.map((v, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedVertexFilter(idx)}
                className={`px-2 py-0.5 text-[11px] font-bold rounded transition-all`}
                style={{
                  backgroundColor: selectedVertexFilter === idx ? v.color : undefined,
                  color: selectedVertexFilter === idx ? '#FFFFFF' : v.color,
                  border: selectedVertexFilter === idx ? 'none' : '1px solid #E2E8F0',
                }}
              >
                Sudut {v.label}
              </button>
            ))}
          </div>

          {/* Previous Step */}
          <button
            onClick={() => {
              setIsAutoPlayingSteps(false);
              setConstructionStep(Math.max(1, constructionStep - 1));
            }}
            disabled={constructionStep <= 1}
            title="Langkah Sebelumnya"
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {/* Auto-Play Steps Toggle */}
          <button
            onClick={() => {
              if (constructionStep === 0) setConstructionStep(1);
              setIsAutoPlayingSteps(!isAutoPlayingSteps);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              isAutoPlayingSteps
                ? 'bg-amber-400 text-slate-900 shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isAutoPlayingSteps ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoPlayingSteps ? 'Jeda Langkah' : 'Putar Langkah'}</span>
          </button>

          {/* Next Step */}
          <button
            onClick={() => {
              setIsAutoPlayingSteps(false);
              setConstructionStep(constructionStep === 0 ? 1 : Math.min(8, constructionStep + 1));
            }}
            disabled={constructionStep >= 8}
            title="Langkah Selanjutnya"
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Reset Steps to Full View */}
          <button
            onClick={() => {
              setIsAutoPlayingSteps(false);
              setConstructionStep(constructionStep === 0 ? 1 : 0);
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
              constructionStep === 0
                ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {constructionStep === 0 ? 'Mode Per Langkah' : 'Lihat Semua'}
          </button>
        </div>
      </div>
    </div>
  );
};
