import {
  Point2D,
  ShapeType,
  MirrorOption,
  VertexRayPair,
  SingleRay,
  SphericalCalculationResult,
  CurvedMirrorType,
  RayData,
} from '../types/physics';

export type { SphericalCalculationResult };

/**
 * Child-friendly, pleasant vibrant colors for each vertex
 * High contrast, soft on eyes
 */
export const CHILD_FRIENDLY_PALETTE = [
  '#0284C7', // Sky Blue
  '#E11D48', // Rose Pink
  '#D97706', // Warm Amber
  '#059669', // Emerald Green
  '#7C3AED', // Purple
  '#EA580C', // Orange
  '#2563EB', // Royal Blue
  '#0D9488', // Teal
];

export const VERTEX_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

/**
 * Generate discrete vertices for each geometric shape
 */
export function getShapeVertices(
  type: ShapeType,
  center: Point2D,
  scale: number,
  rotationDeg: number,
  customPoints?: Point2D[]
): { point: Point2D; label: string; color: string }[] {
  const rad = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const transform = (p: Point2D): Point2D => ({
    x: center.x + (p.x * cos - p.y * sin) * scale,
    y: center.y + (p.x * sin + p.y * cos) * scale,
  });

  let rawPoints: Point2D[] = [];

  switch (type) {
    case 'line': {
      // 2 endpoints
      rawPoints = [
        { x: 0, y: -45 },
        { x: 0, y: 45 },
      ];
      break;
    }
    case 'triangle': {
      // 3 vertices
      rawPoints = [
        { x: -35, y: -40 }, // Top
        { x: 35, y: 0 },    // Right point
        { x: -35, y: 40 },  // Bottom
      ];
      break;
    }
    case 'square': {
      // 4 corners
      const h = 32;
      rawPoints = [
        { x: -h, y: -h },
        { x: h, y: -h },
        { x: h, y: h },
        { x: -h, y: h },
      ];
      break;
    }
    case 'rectangle': {
      // 4 corners
      const w = 45;
      const h = 25;
      rawPoints = [
        { x: -w, y: -h },
        { x: w, y: -h },
        { x: w, y: h },
        { x: -w, y: h },
      ];
      break;
    }
    case 'circle': {
      // 4 cardinal points (North, East, South, West)
      const r = 35;
      rawPoints = [
        { x: 0, y: -r },
        { x: r, y: 0 },
        { x: 0, y: r },
        { x: -r, y: 0 },
      ];
      break;
    }
    case 'star': {
      // 5 outer points
      const outerR = 40;
      for (let i = 0; i < 5; i++) {
        const theta = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        rawPoints.push({
          x: outerR * Math.cos(theta),
          y: outerR * Math.sin(theta),
        });
      }
      break;
    }
    case 'custom': {
      if (customPoints && customPoints.length >= 2) {
        rawPoints = customPoints;
      } else {
        rawPoints = [
          { x: -30, y: -30 },
          { x: 20, y: -35 },
          { x: 40, y: 10 },
          { x: -10, y: 35 },
        ];
      }
      break;
    }
  }

  return rawPoints.map((p, idx) => ({
    point: transform(p),
    label: VERTEX_LABELS[idx % VERTEX_LABELS.length],
    color: CHILD_FRIENDLY_PALETTE[idx % CHILD_FRIENDLY_PALETTE.length],
  }));
}

/**
 * Calculates 2 rays per vertex reflecting on a flat, concave, or convex mirror,
 * and finds their exact intersection point!
 */
export function calculateTwoRaysPerVertex(
  vertex: Point2D,
  vertexIndex: number,
  vertexLabel: string,
  vertexColor: string,
  mirrorOption: MirrorOption,
  mirrorX: number,
  mirrorCenterY: number = 260,
  focalLength: number = 180, // for concave/convex
  mirrorAngleDeg: number = 0,
  spreadAngleDeg: number = 11, // spread between the 2 rays
  userTiltDeg: number = 0
): VertexRayPair {
  // Ray 1 direction and Ray 2 direction
  // Spread symmetrically around central aiming vector
  const baseAimAngle = Math.atan2(mirrorCenterY - vertex.y, mirrorX - vertex.x);
  const tiltRad = (userTiltDeg * Math.PI) / 180;
  const spreadRad = (spreadAngleDeg * Math.PI) / 180;

  const angle1 = baseAimAngle - spreadRad / 2 + tiltRad;
  const angle2 = baseAimAngle + spreadRad / 2 + tiltRad;

  const ray1 = traceSingleRay(
    vertex,
    angle1,
    'ray1',
    vertexColor,
    mirrorOption,
    mirrorX,
    mirrorCenterY,
    focalLength,
    mirrorAngleDeg
  );

  const ray2 = traceSingleRay(
    vertex,
    angle2,
    'ray2',
    vertexColor,
    mirrorOption,
    mirrorX,
    mirrorCenterY,
    focalLength,
    mirrorAngleDeg
  );

  // Compute intersection of the 2 reflected rays
  // Line 1: P1 + s * u1
  // Line 2: P2 + t * u2
  const P1 = ray1.hitPoint;
  const u1 = {
    x: (ray1.reflectedEndPoint.x - P1.x) / 300,
    y: (ray1.reflectedEndPoint.y - P1.y) / 300,
  };

  const P2 = ray2.hitPoint;
  const u2 = {
    x: (ray2.reflectedEndPoint.x - P2.x) / 300,
    y: (ray2.reflectedEndPoint.y - P2.y) / 300,
  };

  const det = u1.x * u2.y - u1.y * u2.x;
  let intersection: Point2D;
  let isReal = false;

  if (Math.abs(det) > 1e-5) {
    const dx = P2.x - P1.x;
    const dy = P2.y - P1.y;
    const s = (dx * u2.y - dy * u2.x) / det;
    intersection = {
      x: P1.x + s * u1.x,
      y: P1.y + s * u1.y,
    };
    isReal = s > 0 && intersection.x < mirrorX;
  } else {
    // Parallel reflected rays (e.g. at focus point)
    intersection = { x: -9999, y: -9999 };
  }

  // If virtual or flat mirror, exact geometrical virtual reflection
  if (mirrorOption === 'flat') {
    // For flat mirror, the backward extensions meet exactly at (2 * mirrorX - vertex.x, vertex.y)
    const mRad = (mirrorAngleDeg * Math.PI) / 180;
    const n = { x: -Math.cos(mRad), y: Math.sin(mRad) };
    const d = (vertex.x - mirrorX) * n.x + (vertex.y - mirrorCenterY) * n.y;
    intersection = {
      x: vertex.x - 2 * d * n.x,
      y: vertex.y - 2 * d * n.y,
    };
    isReal = false;
  }

  // Update virtual extension endpoints to point directly to intersection point
  ray1.virtualEndPoint = intersection;
  ray2.virtualEndPoint = intersection;

  return {
    vertexId: vertexIndex,
    label: vertexLabel,
    color: vertexColor,
    vertexPoint: vertex,
    ray1,
    ray2,
    intersectionPoint: intersection,
    isIntersectionReal: isReal,
  };
}

/**
 * Traces a single ray to the mirror surface and reflects it
 */
function traceSingleRay(
  source: Point2D,
  rayAngleRad: number,
  id: string,
  color: string,
  mirrorOption: MirrorOption,
  mirrorX: number,
  mirrorCenterY: number,
  focalLength: number,
  mirrorAngleDeg: number
): SingleRay {
  const dir = { x: Math.cos(rayAngleRad), y: Math.sin(rayAngleRad) };

  let hitPoint: Point2D = { x: mirrorX, y: source.y + dir.y * 50 };
  let normal: Point2D = { x: -1, y: 0 };
  let centerO: Point2D = { x: mirrorX, y: mirrorCenterY };

  const R = 2 * focalLength;

  if (mirrorOption === 'flat') {
    // Flat mirror line: (P - mirrorPos) . n = 0
    centerO = { x: mirrorX, y: mirrorCenterY };
    const mRad = (mirrorAngleDeg * Math.PI) / 180;
    normal = { x: -Math.cos(mRad), y: Math.sin(mRad) };
    // Intersect ray with line x = mirrorX (or tilted line)
    // Ray: source + t * dir
    const t = dir.x !== 0 ? (mirrorX - source.x) / dir.x : 100;
    hitPoint = {
      x: mirrorX,
      y: source.y + t * dir.y,
    };
  } else if (mirrorOption === 'concave') {
    // Concave mirror curves left (inward)
    // Center of curvature O / C is at (mirrorX - R, mirrorCenterY)
    const Cx = mirrorX - R;
    const Cy = mirrorCenterY;
    centerO = { x: Cx, y: Cy };
    // Ray line intersects circle (x - Cx)^2 + (y - Cy)^2 = R^2
    const dx = source.x - Cx;
    const dy = source.y - Cy;
    const b = 2 * (dx * dir.x + dy * dir.y);
    const c = dx * dx + dy * dy - R * R;
    const disc = b * b - 4 * c;

    if (disc >= 0) {
      // Pick the positive intersection near mirrorX
      const t1 = (-b + Math.sqrt(disc)) / 2;
      const t2 = (-b - Math.sqrt(disc)) / 2;
      const t = Math.max(t1, t2);
      hitPoint = { x: source.x + t * dir.x, y: source.y + t * dir.y };
    } else {
      hitPoint = { x: mirrorX, y: source.y + 60 * dir.y };
    }
    // Normal for concave points from hitPoint towards O / C
    const ndx = Cx - hitPoint.x;
    const ndy = Cy - hitPoint.y;
    const nlen = Math.hypot(ndx, ndy) || 1;
    normal = { x: ndx / nlen, y: ndy / nlen };
  } else {
    // Convex mirror curves right (bulges toward object)
    // Center of curvature O / C is behind mirror at (mirrorX + R, mirrorCenterY)
    const Cx = mirrorX + R;
    const Cy = mirrorCenterY;
    centerO = { x: Cx, y: Cy };
    const dx = source.x - Cx;
    const dy = source.y - Cy;
    const b = 2 * (dx * dir.x + dy * dir.y);
    const c = dx * dx + dy * dy - R * R;
    const disc = b * b - 4 * c;

    if (disc >= 0) {
      const t1 = (-b + Math.sqrt(disc)) / 2;
      const t2 = (-b - Math.sqrt(disc)) / 2;
      const t = Math.min(Math.abs(t1), Math.abs(t2));
      hitPoint = { x: source.x + t * dir.x, y: source.y + t * dir.y };
    } else {
      hitPoint = { x: mirrorX, y: source.y + 60 * dir.y };
    }
    // Normal for convex points from O / C outward through hitPoint
    const ndx = hitPoint.x - Cx;
    const ndy = hitPoint.y - Cy;
    const nlen = Math.hypot(ndx, ndy) || 1;
    normal = { x: ndx / nlen, y: ndy / nlen };
  }

  // Incident vector: source -> hitPoint
  const incDx = hitPoint.x - source.x;
  const incDy = hitPoint.y - source.y;
  const incLen = Math.hypot(incDx, incDy) || 1;
  const incUnit = { x: incDx / incLen, y: incDy / incLen };

  // Law of Reflection:
  // Dot product with normal
  const dot = incUnit.x * normal.x + incUnit.y * normal.y;
  const cosInc = Math.max(-1, Math.min(1, Math.abs(dot)));
  const incidentAngleDeg = Number(((Math.acos(cosInc) * 180) / Math.PI).toFixed(1));
  const reflectedAngleDeg = incidentAngleDeg; // i = r

  // Reflected unit vector: V_r = V_i - 2(V_i . n) n
  const refUnit = {
    x: incUnit.x - 2 * dot * normal.x,
    y: incUnit.y - 2 * dot * normal.y,
  };
  const refLen = 220;
  const reflectedEndPoint: Point2D = {
    x: hitPoint.x + refUnit.x * refLen,
    y: hitPoint.y + refUnit.y * refLen,
  };

  // Backward extension of incident ray behind object (where the ray came from)
  const backwardLen = 70;
  const sourceBackwardExt: Point2D = {
    x: source.x - incUnit.x * backwardLen,
    y: source.y - incUnit.y * backwardLen,
  };

  // Prominent normal line spanning and passing through the mirror surface (melewati cermin)
  // Originates from/connects with Center Point O (titik pusat kelengkungan / acuan O)
  let normalStartPoint: Point2D;
  let normalEndPoint: Point2D;

  if (mirrorOption === 'concave') {
    // In concave: O is in front of mirror. Normal connects to O and extends 25px past O,
    // and passes THROUGH the mirror into the back by 80px!
    normalEndPoint = {
      x: centerO.x + normal.x * 25,
      y: centerO.y + normal.y * 25,
    };
    normalStartPoint = {
      x: hitPoint.x - normal.x * 85,
      y: hitPoint.y - normal.y * 85,
    };
  } else if (mirrorOption === 'convex') {
    // In convex: O is behind mirror. Normal originates directly from O,
    // passes THROUGH the mirror at hitPoint, and extends 110px in front of mirror!
    normalStartPoint = {
      x: centerO.x,
      y: centerO.y,
    };
    normalEndPoint = {
      x: hitPoint.x + normal.x * 115,
      y: hitPoint.y + normal.y * 115,
    };
  } else {
    // In flat mirror: Normal starts 90px behind the mirror, passes THROUGH mirror,
    // and extends 125px in front of mirror so it clearly penetrates both sides.
    normalStartPoint = {
      x: hitPoint.x - normal.x * 90,
      y: hitPoint.y - normal.y * 90,
    };
    normalEndPoint = {
      x: hitPoint.x + normal.x * 125,
      y: hitPoint.y + normal.y * 125,
    };
  }

  const normalAngleDeg = (Math.atan2(normal.y, normal.x) * 180) / Math.PI;

  return {
    id,
    sourcePoint: source,
    sourceBackwardExt,
    hitPoint,
    normalStartPoint,
    normalEndPoint,
    normalAngleDeg,
    incidentAngleDeg,
    reflectedAngleDeg,
    reflectedEndPoint,
    virtualEndPoint: { x: hitPoint.x - refUnit.x * 200, y: hitPoint.y - refUnit.y * 200 },
    color,
    centerO,
  };
}

/**
 * Spherical Mirror Calculations
 */
export function calculateSphericalMirror(
  type: CurvedMirrorType,
  fMagnitude: number,
  s_o: number,
  h_o: number
): SphericalCalculationResult {
  const f = type === 'concave' ? fMagnitude : -fMagnitude;
  const R = 2 * f;

  const isAtInfinity = Math.abs(s_o - f) < 0.5;

  let s_i = 0;
  let M = 0;
  let h_i = 0;

  if (isAtInfinity) {
    s_i = 999999;
    M = 999;
    h_i = 999;
  } else {
    s_i = (s_o * f) / (s_o - f);
    M = -(s_i / s_o);
    h_i = M * h_o;
  }

  const isReal = s_i > 0 && !isAtInfinity;
  const isVirtual = s_i < 0 && !isAtInfinity;
  const isUpright = h_i > 0;
  const isInverted = h_i < 0;
  const absM = Math.abs(M);
  const isMagnified = absM > 1.05;
  const isDiminished = absM < 0.95;
  const isSameSize = !isMagnified && !isDiminished;

  let objectRoom = '';
  let imageRoom = '';

  if (type === 'concave') {
    if (s_o < fMagnitude) {
      objectRoom = 'Ruang I';
      imageRoom = 'Ruang IV (Maya)';
    } else if (s_o === fMagnitude) {
      objectRoom = 'Titik F';
      imageRoom = '∞ (Tak Terhingga)';
    } else if (s_o < 2 * fMagnitude) {
      objectRoom = 'Ruang II';
      imageRoom = 'Ruang III (Nyata)';
    } else if (s_o === 2 * fMagnitude) {
      objectRoom = 'Titik C';
      imageRoom = 'Titik C (Nyata)';
    } else {
      objectRoom = 'Ruang III';
      imageRoom = 'Ruang II (Nyata)';
    }
  } else {
    objectRoom = 'Depan Cermin';
    imageRoom = 'Ruang I (Maya)';
  }

  return {
    focalLength: f,
    radiusOfCurvature: R,
    objectDistance: s_o,
    objectHeight: h_o,
    imageDistance: Number(s_i.toFixed(1)),
    imageHeight: Number(h_i.toFixed(1)),
    magnification: Number(M.toFixed(2)),
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
  };
}

/**
 * Generate CSV text for Two-Ray experiments
 */
export function generateTwoRayCSV(
  vertexPairs: VertexRayPair[],
  mirrorOption: MirrorOption,
  shapeType: string
): string {
  const headers = [
    'Titik Sudut',
    'Posisi Titik (X, Y)',
    'Sinar A - Sudut Datang (°)',
    'Sinar A - Sudut Pantul (°)',
    'Sinar B - Sudut Datang (°)',
    'Sinar B - Sudut Pantul (°)',
    'Hukum Pemantulan (i = r)',
    'Titik Potong Bayangan (X, Y)',
    'Sifat Bayangan',
  ];

  const rows = vertexPairs.map((pair) => [
    `Sudut ${pair.label}`,
    `(${Math.round(pair.vertexPoint.x)}; ${Math.round(pair.vertexPoint.y)})`,
    pair.ray1.incidentAngleDeg,
    pair.ray1.reflectedAngleDeg,
    pair.ray2.incidentAngleDeg,
    pair.ray2.reflectedAngleDeg,
    'TERBUKTI SAMA (i = r)',
    `(${Math.round(pair.intersectionPoint.x)}; ${Math.round(pair.intersectionPoint.y)})`,
    pair.isIntersectionReal ? 'NYATA' : 'MAYA',
  ]);

  return [
    `EKSPERIMEN REFLECTA - TIM ANTI GRAVITASI`,
    `Jenis Cermin,${mirrorOption.toUpperCase()}`,
    `Bentuk Objek,${shapeType.toUpperCase()}`,
    `Metode,2 Sinar Pantul Berpotongan Per Titik Sudut`,
    ``,
    headers.join(','),
    ...rows.map((r) => r.join(',')),
  ].join('\n');
}

/**
 * Backward compatibility for old reflection table if needed
 */
export function generateReflectionCSV(rays: RayData[]): string {
  const headers = [
    'Nomor Sinar',
    'Titik Asal X',
    'Titik Asal Y',
    'Titik Pantul X',
    'Titik Pantul Y',
    'Sudut i (°)',
    'Sudut r (°)',
    'Status i = r',
  ];
  const rows = rays.map((r, i) =>
    [
      i + 1,
      r.sourcePoint.x.toFixed(1),
      r.sourcePoint.y.toFixed(1),
      r.hitPoint.x.toFixed(1),
      r.hitPoint.y.toFixed(1),
      r.incidentAngleDeg,
      r.reflectedAngleDeg,
      'VALID',
    ].join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

export function generateCurvedMirrorCSV(
  type: CurvedMirrorType,
  f: number,
  s_o: number,
  h_o: number,
  res: SphericalCalculationResult
): string {
  return [
    `Jenis Cermin,${type}`,
    `Fokus f,${f}`,
    `Jarak s_o,${s_o}`,
    `Tinggi h_o,${h_o}`,
    `Jarak Bayangan s_i,${res.imageDistance}`,
    `Perbesaran,${res.magnification}`,
    `Sifat,${res.isReal ? 'NYATA' : 'MAYA'}`,
  ].join('\n');
}
