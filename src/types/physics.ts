export type ShapeType = 'line' | 'triangle' | 'square' | 'rectangle' | 'circle' | 'star' | 'custom';

export interface Point2D {
  x: number;
  y: number;
}

export interface RayData {
  id: number;
  sourcePoint: Point2D;
  hitPoint: Point2D;
  normalAngleDeg: number;
  incidentAngleDeg: number;
  reflectedAngleDeg: number;
  reflectedEndPoint: Point2D;
  virtualOriginPoint: Point2D;
  rayColor: string;
}

export interface ObjectConfig {
  type: ShapeType;
  position: Point2D;
  scale: number;
  rotationDeg: number;
  customPoints?: Point2D[];
}

export interface MirrorConfig {
  x: number;
  yTop: number;
  yBottom: number;
  angleDeg: number; // 0 is vertical
}

export type MirrorOption = 'flat' | 'concave' | 'convex';

export interface SingleRay {
  id: string;
  sourcePoint: Point2D;
  sourceBackwardExt: Point2D; // Extended backwards behind object
  hitPoint: Point2D;
  normalStartPoint: Point2D; // Normal line extended into mirror
  normalEndPoint: Point2D;   // Normal line extended in front of mirror
  normalAngleDeg: number;
  incidentAngleDeg: number;
  reflectedAngleDeg: number;
  reflectedEndPoint: Point2D;
  virtualEndPoint: Point2D;
  color: string;
  centerO?: Point2D; // Titik Pusat O (Asal Garis Normal)
}

export interface VertexRayPair {
  vertexId: number;
  label: string;
  color: string;
  vertexPoint: Point2D;
  ray1: SingleRay;
  ray2: SingleRay;
  intersectionPoint: Point2D;
  isIntersectionReal: boolean;
}

export interface ReflectionVisibility {
  showIncidentRays: boolean;
  showReflectedRays: boolean;
  showNormalLines: boolean;
  showIncidentAngles: boolean;
  showReflectedAngles: boolean;
  showVirtualExtensions: boolean;
  showVirtualPoints: boolean;
  showImageOutline: boolean;
  showOriginalObject: boolean;
  showVirtualImage: boolean;
}

export type CurvedMirrorType = 'concave' | 'convex';

export interface SphericalCalculationResult {
  focalLength: number;
  radiusOfCurvature: number;
  objectDistance: number;
  objectHeight: number;
  imageDistance: number;
  imageHeight: number;
  magnification: number;
  isReal: boolean;
  isVirtual: boolean;
  isUpright: boolean;
  isInverted: boolean;
  isMagnified: boolean;
  isDiminished: boolean;
  isSameSize: boolean;
  objectRoom: string;
  imageRoom: string;
  isAtInfinity: boolean;
}

export interface SpecialRaysConfig {
  mirrorType: CurvedMirrorType;
  focalLength: number; // positive number magnitude
  objectDistance: number; // s_o > 0
  objectHeight: number; // h_o
  ray1Active: boolean; // parallel to axis -> through focus
  ray2Active: boolean; // through focus -> parallel
  ray3Active: boolean; // through center of curvature -> reflected back
}

export interface CurvedVisibility {
  showPrincipalAxis: boolean;
  showFocalPoint: boolean;
  showCenterPoint: boolean;
  showVertexPoint: boolean;
  showVirtualExtensions: boolean;
  showFinalImage: boolean;
  showRayLabels: boolean;
  showZones: boolean;
}

export interface ExperimentRecord {
  timestamp: string;
  labType: 'ReflectionLaw' | 'SpecialRays';
  objectShape?: string;
  rayCount?: number;
  incidentAngleAvg?: number;
  reflectedAngleAvg?: number;
  isLawVerified: boolean;
  notes: string;
}
