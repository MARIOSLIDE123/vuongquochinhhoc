import React, { useState, useEffect } from 'react';
import { GeometryData } from '../types/math';
import { ZoomIn, ZoomOut, X, Maximize2 } from 'lucide-react';
import { soundService } from '../services/soundService';

interface GeometryVisualizerProps {
  geometry?: GeometryData;
  isSolutionView?: boolean;
}

export const GeometryVisualizer: React.FC<GeometryVisualizerProps> = ({
  geometry,
  isSolutionView = false
}) => {
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // Close zoom modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZoomed) {
        setIsZoomed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed]);

  if (!geometry) {
    return null;
  }

  const { shape, side, width, height, perimeter, area, unit = 'cm', label, subLabel } = geometry;

  const handleOpenZoom = () => {
    soundService.playClick();
    setIsZoomed(true);
  };

  const handleCloseZoom = () => {
    soundService.playClick();
    setIsZoomed(false);
  };

  const renderShapeContent = (zoomed: boolean) => {
    switch (shape) {
      case 'square':
        return (
          <SquareSvg
            side={side || 8}
            area={area}
            unit={unit}
            isSolutionView={isSolutionView}
            isZoomed={zoomed}
            label={label}
          />
        );
      case 'rectangle':
        return (
          <RectangleSvg
            width={width || 10}
            height={height || 5}
            unit={unit}
            perimeter={perimeter}
            area={area}
            isSolutionView={isSolutionView}
            isZoomed={zoomed}
          />
        );
      case 'house_cards':
        return <HouseCardsSvg isSolutionView={isSolutionView} isZoomed={zoomed} />;
      case 'garden':
        return (
          <GardenSvg
            side={side || 9}
            perimeter={perimeter || 36}
            unit={unit}
            isSolutionView={isSolutionView}
            isZoomed={zoomed}
          />
        );
      case 'composite_l':
        return <CompositeLSvg unit={unit} isSolutionView={isSolutionView} isZoomed={zoomed} />;
      case 'comparison':
        return <ComparisonSvg geometry={geometry} isSolutionView={isSolutionView} isZoomed={zoomed} />;
      case 'grid':
        return (
          <GridUnitSvg
            rows={geometry.gridRows || 3}
            cols={geometry.gridCols || 3}
            unit={unit}
            isSolutionView={isSolutionView}
            isZoomed={zoomed}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-full relative flex flex-col items-center justify-center p-2.5 sm:p-3 bg-gradient-to-b from-sky-50/70 to-white rounded-2xl border border-sky-100 shadow-xs my-2 group transition-all">
        {/* Label and Sublabel */}
        {label && (
          <div className="text-center mb-1.5 flex items-center gap-2">
            <span className="text-xs font-bold text-sky-800 bg-sky-100/90 px-2.5 py-0.5 rounded-full border border-sky-200 shadow-2xs">
              {label}
            </span>
            {subLabel && <span className="text-xs text-amber-700 font-medium hidden sm:inline">({subLabel})</span>}
          </div>
        )}

        {/* Zoom trigger badge button */}
        <button
          type="button"
          onClick={handleOpenZoom}
          className="absolute top-2 right-2 flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-white/90 hover:bg-sky-50 border border-sky-200 rounded-lg px-2 py-1 shadow-xs transition-transform transform active:scale-95 cursor-pointer z-10"
          title="Bấm để phóng to hình ảnh"
        >
          <ZoomIn className="w-3.5 h-3.5 text-sky-600" />
          <span className="hidden sm:inline">Phóng to</span>
        </button>

        {/* Clickable Graphic Canvas */}
        <div
          onClick={handleOpenZoom}
          className="w-full flex items-center justify-center max-h-48 sm:max-h-52 cursor-zoom-in overflow-hidden py-1"
          title="Nhấn vào hình để phóng to"
        >
          {renderShapeContent(false)}
        </div>

        {isSolutionView && (
          <div className="mt-1.5 text-xs text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Hình minh họa phần diện tích được tính toán</span>
          </div>
        )}
      </div>

      {/* FULL-SIZE ZOOM MODAL (Requirement 6) */}
      {isZoomed && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-150"
          onClick={handleCloseZoom}
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-3xl p-4 sm:p-8 shadow-2xl border-4 border-sky-200 flex flex-col items-center max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-sky-100 text-sky-700">
                  <Maximize2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800">
                    {label || 'Hình Minh Họa Phóng To'}
                  </h3>
                  {subLabel && <p className="text-xs text-amber-600 font-medium">{subLabel}</p>}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseZoom}
                className="p-2 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                title="Đóng xem phóng to"
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>

            {/* Enlarged Shape Canvas */}
            <div className="w-full flex items-center justify-center p-2 sm:p-4 bg-sky-50/40 rounded-2xl border border-sky-100 my-2">
              {renderShapeContent(true)}
            </div>

            {/* Modal Footer Note */}
            <p className="text-xs text-slate-400 font-semibold mt-2 text-center">
              Chạm ra ngoài hoặc bấm dấu ✕ để quay lại làm bài
            </p>
          </div>
        </div>
      )}
    </>
  );
};

// ==========================================
// 1. SQUARE SVG WITH PRECISE UNIFORM GRID
// ==========================================
const SquareSvg: React.FC<{
  side: number;
  area?: number;
  unit: string;
  isSolutionView: boolean;
  isZoomed?: boolean;
  label?: string;
}> = ({ side, area, unit, isSolutionView, isZoomed, label }) => {
  const size = isZoomed ? 260 : 160;
  const padding = isZoomed ? 45 : 35;
  const total = size + padding * 2;

  // Grid divisions: exact integer divisions
  const gridDivisions = Math.min(Math.max(side, 4), 10);
  const cellSize = size / gridDivisions;

  // Check if side is unknown (e.g. reverse question finding side from area, or formula 'a')
  const isFormula = label?.includes('Cạnh a') || side === 0;
  const isSideUnknown = area && !isSolutionView && !isFormula;
  const displaySideText = isFormula ? 'a' : isSideUnknown ? `? ${unit}` : `${side} ${unit}`;

  return (
    <svg
      viewBox={`0 0 ${total} ${total}`}
      className={`${isZoomed ? 'w-80 h-80 sm:w-96 sm:h-96' : 'w-44 h-44 sm:w-48 sm:h-48'} drop-shadow-sm transition-all`}
    >
      <defs>
        <linearGradient id="sqFillGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>
      </defs>

      {/* Main Square Background */}
      <rect
        x={padding}
        y={padding}
        width={size}
        height={size}
        rx="8"
        fill={isSolutionView ? '#bbf7d0' : 'url(#sqFillGrad)'}
        stroke={isSolutionView ? '#16a34a' : '#ca8a04'}
        strokeWidth="3"
      />

      {/* Precise, non-clipped internal grid lines */}
      <g>
        {Array.from({ length: gridDivisions - 1 }).map((_, i) => {
          const pos = padding + (i + 1) * cellSize;
          return (
            <React.Fragment key={i}>
              {/* Vertical line */}
              <line
                x1={pos}
                y1={padding}
                x2={pos}
                y2={padding + size}
                stroke="#ca8a04"
                strokeWidth="0.8"
                strokeDasharray="3,3"
                opacity="0.6"
              />
              {/* Horizontal line */}
              <line
                x1={padding}
                y1={pos}
                x2={padding + size}
                y2={pos}
                stroke="#ca8a04"
                strokeWidth="0.8"
                strokeDasharray="3,3"
                opacity="0.6"
              />
            </React.Fragment>
          );
        })}
      </g>

      {/* Top dimension line with Unit */}
      <line x1={padding} y1={padding - 12} x2={padding + size} y2={padding - 12} stroke="#0284c7" strokeWidth="1.8" />
      <path d={`M ${padding} ${padding - 17} L ${padding} ${padding - 7}`} stroke="#0284c7" strokeWidth="1.8" />
      <path d={`M ${padding + size} ${padding - 17} L ${padding + size} ${padding - 7}`} stroke="#0284c7" strokeWidth="1.8" />
      <text
        x={padding + size / 2}
        y={padding - 18}
        fill="#0369a1"
        fontSize={isZoomed ? '16' : '13'}
        fontWeight="800"
        textAnchor="middle"
      >
        {displaySideText}
      </text>

      {/* Right dimension line with Unit */}
      <line x1={padding + size + 12} y1={padding} x2={padding + size + 12} y2={padding + size} stroke="#0284c7" strokeWidth="1.8" />
      <path d={`M ${padding + size + 7} ${padding} L ${padding + size + 17} ${padding}`} stroke="#0284c7" strokeWidth="1.8" />
      <path d={`M ${padding + size + 7} ${padding + size} L ${padding + size + 17} ${padding + size}`} stroke="#0284c7" strokeWidth="1.8" />
      <text
        x={padding + size + 20}
        y={padding + size / 2 + 5}
        fill="#0369a1"
        fontSize={isZoomed ? '16' : '13'}
        fontWeight="800"
        textAnchor="start"
      >
        {displaySideText}
      </text>

      {/* Center Formula / Area badge */}
      <rect
        x={padding + size / 2 - (isZoomed ? 75 : 55)}
        y={padding + size / 2 - (isZoomed ? 20 : 15)}
        width={isZoomed ? 150 : 110}
        height={isZoomed ? 40 : 30}
        rx="8"
        fill="#ffffff"
        opacity="0.92"
        stroke={isSolutionView ? '#16a34a' : '#ca8a04'}
        strokeWidth="1.5"
      />
      <text
        x={padding + size / 2}
        y={padding + size / 2 + (isZoomed ? 6 : 5)}
        fill={isSolutionView ? '#15803d' : '#854d0e'}
        fontSize={isZoomed ? '15' : '12'}
        fontWeight="800"
        textAnchor="middle"
      >
        {isSolutionView
          ? `S = ${side * side} ${unit}²`
          : area
          ? `S = ${area} ${unit}²`
          : isFormula
          ? `S = a × a`
          : `S = ${side} × ${side}`}
      </text>
    </svg>
  );
};

// ==========================================
// 2. RECTANGLE SVG WITH PRECISE UNIFORM GRID
// ==========================================
const RectangleSvg: React.FC<{
  width: number;
  height: number;
  unit: string;
  perimeter?: number;
  area?: number;
  isSolutionView: boolean;
  isZoomed?: boolean;
}> = ({ width, height, unit, perimeter, area, isSolutionView, isZoomed }) => {
  const svgWidth = isZoomed ? 380 : 250;
  const svgHeight = isZoomed ? 220 : 150;
  const padX = isZoomed ? 50 : 35;
  const padY = isZoomed ? 45 : 30;

  const rectW = isZoomed ? 270 : 175;
  // Maintain proper aspect ratio between 40% and 75%
  const ratio = Math.max(0.4, Math.min(0.75, height / width));
  const rectH = rectW * ratio;

  // Exact divisions for grid
  const cols = Math.min(width, 12);
  const rows = Math.min(height, 6);
  const cellW = rectW / cols;
  const cellH = rectH / rows;

  // Unknown dimensions detection
  const isWidthUnknown = area && !perimeter && !isSolutionView;
  const isHeightUnknown = perimeter && !isSolutionView;

  const displayWidth = isWidthUnknown ? `? ${unit}` : `${width} ${unit}`;
  const displayHeight = isHeightUnknown ? `? ${unit}` : `${height} ${unit}`;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className={`${isZoomed ? 'w-80 h-56 sm:w-96 sm:h-64' : 'w-56 h-36 sm:w-60 sm:h-38'} drop-shadow-sm transition-all`}
    >
      <defs>
        <linearGradient id="rectGradExact" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#7dd3fc" />
        </linearGradient>
      </defs>

      {/* Main Rectangle Background */}
      <rect
        x={padX}
        y={padY}
        width={rectW}
        height={rectH}
        rx="8"
        fill={isSolutionView ? '#bbf7d0' : 'url(#rectGradExact)'}
        stroke={isSolutionView ? '#16a34a' : '#0284c7'}
        strokeWidth="2.5"
      />

      {/* Precise Interior Grid Lines */}
      <g>
        {Array.from({ length: cols - 1 }).map((_, i) => (
          <line
            key={`c-${i}`}
            x1={padX + (i + 1) * cellW}
            y1={padY}
            x2={padX + (i + 1) * cellW}
            y2={padY + rectH}
            stroke="#0284c7"
            strokeWidth="0.8"
            strokeDasharray="3,3"
            opacity="0.55"
          />
        ))}
        {Array.from({ length: rows - 1 }).map((_, i) => (
          <line
            key={`r-${i}`}
            x1={padX}
            y1={padY + (i + 1) * cellH}
            x2={padX + rectW}
            y2={padY + (i + 1) * cellH}
            stroke="#0284c7"
            strokeWidth="0.8"
            strokeDasharray="3,3"
            opacity="0.55"
          />
        ))}
      </g>

      {/* Top Dimension (Length) with Unit */}
      <line x1={padX} y1={padY - 10} x2={padX + rectW} y2={padY - 10} stroke="#0369a1" strokeWidth="1.8" />
      <path d={`M ${padX} ${padY - 15} L ${padX} ${padY - 5}`} stroke="#0369a1" strokeWidth="1.8" />
      <path d={`M ${padX + rectW} ${padY - 15} L ${padX + rectW} ${padY - 5}`} stroke="#0369a1" strokeWidth="1.8" />
      <text
        x={padX + rectW / 2}
        y={padY - 14}
        fill="#0369a1"
        fontSize={isZoomed ? '15' : '12'}
        fontWeight="800"
        textAnchor="middle"
      >
        Chiều dài: {displayWidth}
      </text>

      {/* Right Dimension (Width) with Unit */}
      <line x1={padX + rectW + 10} y1={padY} x2={padX + rectW + 10} y2={padY + rectH} stroke="#0369a1" strokeWidth="1.8" />
      <path d={`M ${padX + rectW + 5} ${padY} L ${padX + rectW + 15} ${padY}`} stroke="#0369a1" strokeWidth="1.8" />
      <path d={`M ${padX + rectW + 5} ${padY + rectH} L ${padX + rectW + 15} ${padY + rectH}`} stroke="#0369a1" strokeWidth="1.8" />
      <text
        x={padX + rectW + 18}
        y={padY + rectH / 2 + 5}
        fill="#0369a1"
        fontSize={isZoomed ? '14' : '11'}
        fontWeight="800"
        textAnchor="start"
      >
        Rộng: {displayHeight}
      </text>

      {/* Center Label / Formula Badge */}
      <rect
        x={padX + rectW / 2 - (isZoomed ? 85 : 65)}
        y={padY + rectH / 2 - (isZoomed ? 18 : 13)}
        width={isZoomed ? 170 : 130}
        height={isZoomed ? 36 : 26}
        rx="6"
        fill="#ffffff"
        opacity="0.92"
        stroke={isSolutionView ? '#16a34a' : '#0369a1'}
        strokeWidth="1.2"
      />
      <text
        x={padX + rectW / 2}
        y={padY + rectH / 2 + 4}
        fill={isSolutionView ? '#15803d' : '#0369a1'}
        fontSize={isZoomed ? '14' : '11'}
        fontWeight="800"
        textAnchor="middle"
      >
        {isSolutionView
          ? `S = ${width} × ${height} = ${width * height} ${unit}²`
          : area
          ? `S = ${area} ${unit}²`
          : `S = a × b`}
      </text>
    </svg>
  );
};

// ==========================================
// 3. HOUSE CARDS (SGK EXERCISE 3) - EXACT MATCH TO USER IMAGE
// ==========================================
/**
 * Three house cards drawn on a single continuous grid of unit squares.
 * Exactly matches the textbook scan provided by user:
 * - Continuous cyan grid
 * - House A: Light blue (Roof base 6 with eaves, height 3; body 4x3) => 21 ô
 * - House B: Yellow (Roof base 6, height 3; body 6x3, doorway 2x2) => 23 ô
 * - House C: Pink (Roof base 6, height 3; body 6x3, 1 top window 2x1, 2 bottom windows 1x1) => 23 ô
 * - Labels "A", "B", "C" centered below each house in magenta.
 * - NO hints (no "21 ô vuông", "23 ô vuông") during question answering!
 */
const HouseCardsSvg: React.FC<{ isSolutionView: boolean; isZoomed?: boolean }> = ({
  isSolutionView,
  isZoomed
}) => {
  const cols = 25;
  const rows = 7;
  const u = isZoomed ? 26 : 17; // unit size in pixels
  const width = cols * u;
  const height = rows * u + 30; // extra space for labels A, B, C

  return (
    <div className="flex flex-col items-center w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={`${isZoomed ? 'w-full max-w-2xl' : 'w-full max-w-md'} h-auto drop-shadow-sm select-none`}
      >
        <defs>
          <pattern id="unifiedGrid" width={u} height={u} patternUnits="userSpaceOnUse">
            <rect width={u} height={u} fill="#ffffff" stroke="#bae6fd" strokeWidth="0.8" />
          </pattern>
        </defs>

        {/* Full continuous grid background */}
        <rect width={cols * u} height={rows * u} fill="url(#unifiedGrid)" stroke="#38bdf8" strokeWidth="1.2" />

        {/* ============================================================== */}
        {/* HOUSE A: Light Blue (Cols 1 to 7, Base width 6, Body cols 2 to 6) */}
        {/* ============================================================== */}
        {/* Roof A: Peak (4, 0) -> Eaves (1, 3) -> (2, 3) -> Body bottom (2, 6) -> (6, 6) -> (6, 3) -> Eaves (7, 3) -> Peak (4, 0) */}
        <path
          d={`
            M ${4 * u} ${0 * u}
            L ${1 * u} ${3 * u}
            L ${2 * u} ${3 * u}
            L ${2 * u} ${6 * u}
            L ${6 * u} ${6 * u}
            L ${6 * u} ${3 * u}
            L ${7 * u} ${3 * u}
            Z
          `}
          fill="#bae6fd"
          stroke="#0284c7"
          strokeWidth="2"
        />
        {/* Internal grid lines for House A to make counting easy */}
        <g stroke="#7dd3fc" strokeWidth="0.8" opacity="0.85">
          {/* Vertical lines in roof & body */}
          <line x1={3 * u} y1={2 * u} x2={3 * u} y2={6 * u} />
          <line x1={4 * u} y1={0 * u} x2={4 * u} y2={6 * u} />
          <line x1={5 * u} y1={2 * u} x2={5 * u} y2={6 * u} />
          {/* Horizontal lines */}
          <line x1={3 * u} y1={1 * u} x2={5 * u} y2={1 * u} />
          <line x1={2 * u} y1={2 * u} x2={6 * u} y2={2 * u} />
          <line x1={2 * u} y1={3 * u} x2={6 * u} y2={3 * u} />
          <line x1={2 * u} y1={4 * u} x2={6 * u} y2={4 * u} />
          <line x1={2 * u} y1={5 * u} x2={6 * u} y2={5 * u} />
        </g>
        {/* Re-stroke border */}
        <path
          d={`
            M ${4 * u} ${0 * u}
            L ${1 * u} ${3 * u}
            L ${2 * u} ${3 * u}
            L ${2 * u} ${6 * u}
            L ${6 * u} ${6 * u}
            L ${6 * u} ${3 * u}
            L ${7 * u} ${3 * u}
            Z
          `}
          fill="none"
          stroke="#0369a1"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Label A below house */}
        <text
          x={4 * u}
          y={rows * u + 22}
          fill="#db2777"
          fontSize={isZoomed ? '20' : '15'}
          fontWeight="900"
          textAnchor="middle"
        >
          A
        </text>

        {/* ============================================================== */}
        {/* HOUSE B: Yellow (Cols 9 to 15, Base width 6, Doorway 2x2) */}
        {/* ============================================================== */}
        {/* Roof & Body outline */}
        <path
          d={`
            M ${12 * u} ${0 * u}
            L ${9 * u} ${3 * u}
            L ${9 * u} ${6 * u}
            L ${11 * u} ${6 * u}
            L ${11 * u} ${4 * u}
            L ${13 * u} ${4 * u}
            L ${13 * u} ${6 * u}
            L ${15 * u} ${6 * u}
            L ${15 * u} ${3 * u}
            Z
          `}
          fill="#fef08a"
          stroke="#ca8a04"
          strokeWidth="2"
        />
        {/* Doorway white cutout */}
        <rect
          x={11 * u}
          y={4 * u}
          width={2 * u}
          height={2 * u}
          fill="#ffffff"
          stroke="#854d0e"
          strokeWidth="1.5"
        />
        {/* Door grid line inside */}
        <line x1={12 * u} y1={4 * u} x2={12 * u} y2={6 * u} stroke="#bae6fd" strokeWidth="0.8" />
        <line x1={11 * u} y1={5 * u} x2={13 * u} y2={5 * u} stroke="#bae6fd" strokeWidth="0.8" />

        {/* Internal grid lines for House B */}
        <g stroke="#facc15" strokeWidth="0.8" opacity="0.9">
          <line x1={10 * u} y1={2 * u} x2={10 * u} y2={6 * u} />
          <line x1={11 * u} y1={1 * u} x2={11 * u} y2={4 * u} />
          <line x1={12 * u} y1={0 * u} x2={12 * u} y2={4 * u} />
          <line x1={13 * u} y1={1 * u} x2={13 * u} y2={4 * u} />
          <line x1={14 * u} y1={2 * u} x2={14 * u} y2={6 * u} />
          <line x1={11 * u} y1={1 * u} x2={13 * u} y2={1 * u} />
          <line x1={10 * u} y1={2 * u} x2={14 * u} y2={2 * u} />
          <line x1={9 * u} y1={3 * u} x2={15 * u} y2={3 * u} />
          <line x1={9 * u} y1={4 * u} x2={11 * u} y2={4 * u} />
          <line x1={13 * u} y1={4 * u} x2={15 * u} y2={4 * u} />
          <line x1={9 * u} y1={5 * u} x2={11 * u} y2={5 * u} />
          <line x1={13 * u} y1={5 * u} x2={15 * u} y2={5 * u} />
        </g>
        {/* Re-stroke border */}
        <path
          d={`
            M ${12 * u} ${0 * u}
            L ${9 * u} ${3 * u}
            L ${9 * u} ${6 * u}
            L ${11 * u} ${6 * u}
            L ${11 * u} ${4 * u}
            L ${13 * u} ${4 * u}
            L ${13 * u} ${6 * u}
            L ${15 * u} ${6 * u}
            L ${15 * u} ${3 * u}
            Z
          `}
          fill="none"
          stroke="#854d0e"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Label B below house */}
        <text
          x={12 * u}
          y={rows * u + 22}
          fill="#db2777"
          fontSize={isZoomed ? '20' : '15'}
          fontWeight="900"
          textAnchor="middle"
        >
          B
        </text>

        {/* ============================================================== */}
        {/* HOUSE C: Pink (Cols 17 to 23, Base width 6, 3 Windows cutouts) */}
        {/* ============================================================== */}
        <path
          d={`
            M ${20 * u} ${0 * u}
            L ${17 * u} ${3 * u}
            L ${17 * u} ${6 * u}
            L ${23 * u} ${6 * u}
            L ${23 * u} ${3 * u}
            Z
          `}
          fill="#fbcfe8"
          stroke="#be185d"
          strokeWidth="2"
        />

        {/* Windows cutouts (white fill with border) */}
        {/* Top window (Cols 19 to 21, Row 2 to 3, width 2, height 1) */}
        <rect
          x={19 * u}
          y={2 * u}
          width={2 * u}
          height={1 * u}
          fill="#ffffff"
          stroke="#9d174d"
          strokeWidth="1.5"
        />
        <line x1={20 * u} y1={2 * u} x2={20 * u} y2={3 * u} stroke="#bae6fd" strokeWidth="0.8" />

        {/* Bottom-left window (Col 18 to 19, Row 4.5 to 5.5, size 1x1) */}
        <rect
          x={18 * u}
          y={4.5 * u}
          width={1 * u}
          height={1 * u}
          fill="#ffffff"
          stroke="#9d174d"
          strokeWidth="1.5"
        />

        {/* Bottom-right window (Col 21 to 22, Row 4.5 to 5.5, size 1x1) */}
        <rect
          x={21 * u}
          y={4.5 * u}
          width={1 * u}
          height={1 * u}
          fill="#ffffff"
          stroke="#9d174d"
          strokeWidth="1.5"
        />

        {/* Internal grid lines for House C */}
        <g stroke="#f472b6" strokeWidth="0.8" opacity="0.9">
          <line x1={18 * u} y1={2 * u} x2={18 * u} y2={6 * u} />
          <line x1={19 * u} y1={1 * u} x2={19 * u} y2={6 * u} />
          <line x1={20 * u} y1={0 * u} x2={20 * u} y2={6 * u} />
          <line x1={21 * u} y1={1 * u} x2={21 * u} y2={6 * u} />
          <line x1={22 * u} y1={2 * u} x2={22 * u} y2={6 * u} />
          <line x1={19 * u} y1={1 * u} x2={21 * u} y2={1 * u} />
          <line x1={18 * u} y1={2 * u} x2={22 * u} y2={2 * u} />
          <line x1={17 * u} y1={3 * u} x2={23 * u} y2={3 * u} />
          <line x1={17 * u} y1={4 * u} x2={23 * u} y2={4 * u} />
          <line x1={17 * u} y1={5 * u} x2={23 * u} y2={5 * u} />
        </g>
        {/* Re-stroke border */}
        <path
          d={`
            M ${20 * u} ${0 * u}
            L ${17 * u} ${3 * u}
            L ${17 * u} ${6 * u}
            L ${23 * u} ${6 * u}
            L ${23 * u} ${3 * u}
            Z
          `}
          fill="none"
          stroke="#9d174d"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Label C below house */}
        <text
          x={20 * u}
          y={rows * u + 22}
          fill="#db2777"
          fontSize={isZoomed ? '20' : '15'}
          fontWeight="900"
          textAnchor="middle"
        >
          C
        </text>

        {/* ============================================================== */}
        {/* SOLUTION BADGES (ONLY SHOWN AFTER ANSWERING / SOLUTION VIEW) */}
        {/* ============================================================== */}
        {isSolutionView && (
          <g>
            <rect x={2.5 * u} y={6.2 * u} width={3 * u} height={0.9 * u} rx="4" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
            <text x={4 * u} y={6.8 * u} textAnchor="middle" fill="#0369a1" fontSize={isZoomed ? '11' : '8'} fontWeight="bold">
              21 ô
            </text>

            <rect x={10.5 * u} y={6.2 * u} width={3 * u} height={0.9 * u} rx="4" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1" />
            <text x={12 * u} y={6.8 * u} textAnchor="middle" fill="#15803d" fontSize={isZoomed ? '11' : '8'} fontWeight="bold">
              23 ô ✓
            </text>

            <rect x={18.5 * u} y={6.2 * u} width={3 * u} height={0.9 * u} rx="4" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1" />
            <text x={20 * u} y={6.8 * u} textAnchor="middle" fill="#15803d" fontSize={isZoomed ? '11' : '8'} fontWeight="bold">
              23 ô ✓
            </text>
          </g>
        )}
      </svg>
      <p className="text-xs text-slate-500 mt-1 italic text-center">
        Mỗi ô vuông nhỏ trên lưới = 1 đơn vị diện tích (1 ô vuông)
      </p>
    </div>
  );
};

// ==========================================
// 4. GARDEN SVG (SGK EXERCISE 4)
// ==========================================
const GardenSvg: React.FC<{
  side: number;
  perimeter: number;
  unit: string;
  isSolutionView: boolean;
  isZoomed?: boolean;
}> = ({ side, perimeter, unit, isSolutionView, isZoomed }) => {
  const size = isZoomed ? 260 : 160;
  return (
    <svg
      viewBox="0 0 240 200"
      className={`${isZoomed ? 'w-80 h-64 sm:w-96 sm:h-72' : 'w-52 h-44 sm:w-56 sm:h-48'} drop-shadow-sm transition-all`}
    >
      <defs>
        <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
      </defs>

      {/* Garden Area */}
      <rect x="45" y="35" width="150" height="150" rx="12" fill="url(#grassGrad)" stroke="#15803d" strokeWidth="3" />

      {/* Grid rows with carrots */}
      {[55, 85, 115, 145].map((y, rowIdx) => (
        <g key={rowIdx}>
          <line x1="55" y1={y + 12} x2="185" y2={y + 12} stroke="#166534" strokeWidth="1" strokeDasharray="4,4" />
          {[70, 100, 130, 160].map((x, colIdx) => (
            <text key={colIdx} x={x} y={y + 10} fontSize="14" textAnchor="middle">
              🥕
            </text>
          ))}
        </g>
      ))}

      {/* Perimeter label with Unit */}
      <rect x="55" y="6" width="130" height="24" rx="6" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
      <text x="120" y="22" textAnchor="middle" fill="#0369a1" fontSize="12" fontWeight="bold">
        Chu vi vườn = {perimeter} {unit}
      </text>

      {/* Side dimension indicator with Unit */}
      <line x1="28" y1="35" x2="28" y2="185" stroke="#0284c7" strokeWidth="1.8" />
      <path d="M 23 35 L 33 35" stroke="#0284c7" strokeWidth="1.8" />
      <path d="M 23 185 L 33 185" stroke="#0284c7" strokeWidth="1.8" />
      <text
        x="18"
        y="115"
        textAnchor="middle"
        fill="#0369a1"
        fontSize="12"
        fontWeight="800"
        transform="rotate(-90 18 115)"
      >
        {isSolutionView ? `Cạnh: ${side} ${unit}` : `Cạnh: ? ${unit}`}
      </text>

      {/* Solution breakdown badge */}
      {isSolutionView && (
        <g>
          <rect x="55" y="70" width="130" height="55" rx="10" fill="#ffffff" opacity="0.95" stroke="#16a34a" strokeWidth="2" />
          <text x="120" y="92" textAnchor="middle" fill="#166534" fontSize="11" fontWeight="bold">
            Cạnh = {perimeter} : 4 = {side} {unit}
          </text>
          <text x="120" y="112" textAnchor="middle" fill="#15803d" fontSize="13" fontWeight="800">
            S = {side} × {side} = {side * side} {unit}²
          </text>
        </g>
      )}
    </svg>
  );
};

// ==========================================
// 5. COMPOSITE L-SHAPE WITH CLEAR DIMENSION LABELS & UNITS
// ==========================================
const CompositeLSvg: React.FC<{ unit: string; isSolutionView: boolean; isZoomed?: boolean }> = ({
  unit,
  isSolutionView,
  isZoomed
}) => {
  return (
    <svg
      viewBox="0 0 240 180"
      className={`${isZoomed ? 'w-80 h-64 sm:w-96 sm:h-72' : 'w-56 h-44 sm:w-60 sm:h-48'} drop-shadow-sm transition-all`}
    >
      {/* Rect 1: 5 x 3 cm (Top rectangle) */}
      <rect
        x="50"
        y="25"
        width="100"
        height="60"
        fill={isSolutionView ? '#86efac' : '#fed7aa'}
        stroke="#ea580c"
        strokeWidth="2"
        rx="4"
      />
      {/* Rect 1 Dimension Arrows with Unit */}
      <line x1="50" y1="17" x2="150" y2="17" stroke="#c2410c" strokeWidth="1.5" />
      <path d="M 50 13 L 50 21" stroke="#c2410c" strokeWidth="1.5" />
      <path d="M 150 13 L 150 21" stroke="#c2410c" strokeWidth="1.5" />
      <text x="100" y="13" textAnchor="middle" fill="#9a3412" fontSize="11" fontWeight="bold">
        5 {unit}
      </text>

      <line x1="158" y1="25" x2="158" y2="85" stroke="#c2410c" strokeWidth="1.5" />
      <path d="M 154 25 L 162 25" stroke="#c2410c" strokeWidth="1.5" />
      <path d="M 154 85 L 162 85" stroke="#c2410c" strokeWidth="1.5" />
      <text x="166" y="58" textAnchor="start" fill="#9a3412" fontSize="10" fontWeight="bold">
        3 {unit}
      </text>

      <text x="100" y="58" textAnchor="middle" fill="#9a3412" fontSize="11" fontWeight="bold">
        Hình 1 {isSolutionView && `= 15 ${unit}²`}
      </text>

      {/* Rect 2: 4 x 3 cm (Bottom attached rectangle) */}
      <rect
        x="50"
        y="85"
        width="80"
        height="60"
        fill={isSolutionView ? '#bbf7d0' : '#fed7aa'}
        stroke="#ea580c"
        strokeWidth="2"
        rx="4"
      />
      {/* Rect 2 Width Dimension with Unit */}
      <line x1="50" y1="153" x2="130" y2="153" stroke="#c2410c" strokeWidth="1.5" />
      <path d="M 50 149 L 50 157" stroke="#c2410c" strokeWidth="1.5" />
      <path d="M 130 149 L 130 157" stroke="#c2410c" strokeWidth="1.5" />
      <text x="90" y="167" textAnchor="middle" fill="#9a3412" fontSize="11" fontWeight="bold">
        4 {unit}
      </text>

      <line x1="38" y1="85" x2="38" y2="145" stroke="#c2410c" strokeWidth="1.5" />
      <path d="M 34 85 L 42 85" stroke="#c2410c" strokeWidth="1.5" />
      <path d="M 34 145 L 42 145" stroke="#c2410c" strokeWidth="1.5" />
      <text x="30" y="118" textAnchor="end" fill="#9a3412" fontSize="10" fontWeight="bold">
        3 {unit}
      </text>

      <text x="90" y="118" textAnchor="middle" fill="#9a3412" fontSize="11" fontWeight="bold">
        Hình 2 {isSolutionView && `= 12 ${unit}²`}
      </text>

      {/* Total label */}
      {isSolutionView && (
        <g>
          <rect x="145" y="105" width="85" height="30" rx="6" fill="#ffffff" stroke="#16a34a" strokeWidth="1.5" />
          <text x="187" y="124" textAnchor="middle" fill="#15803d" fontSize="11" fontWeight="800">
            S = 27 {unit}²
          </text>
        </g>
      )}
    </svg>
  );
};

// ==========================================
// 6. COMPARISON SVG WITH CLEAR UNITS & DYNAMIC SUPPORT
// ==========================================
const ComparisonSvg: React.FC<{ geometry: GeometryData; isSolutionView: boolean; isZoomed?: boolean }> = ({
  geometry,
  isSolutionView,
  isZoomed
}) => {
  const { unit = 'cm', label } = geometry;
  const isQuestion21 = label?.includes('Hình vuông M');

  if (isQuestion21) {
    // Question 21: Square M (6 cm) vs Rectangle N (8 cm x 4 cm)
    return (
      <div className="flex items-center justify-center gap-4 sm:gap-6 py-2">
        {/* Square M */}
        <div className="flex flex-col items-center bg-amber-50 p-2.5 rounded-2xl border-2 border-amber-300 shadow-2xs">
          <span className="text-xs font-black text-amber-900 mb-1">Hình vuông M</span>
          <div className="w-20 h-20 bg-amber-200 rounded-lg border-2 border-amber-500 flex flex-col items-center justify-center text-xs font-bold text-amber-950 relative">
            <span>Cạnh: 6 {unit}</span>
          </div>
          <span className="text-[11px] font-bold text-amber-800 mt-1">
            {isSolutionView ? `S = 6 × 6 = 36 ${unit}² ✓` : `Cạnh: 6 ${unit}`}
          </span>
        </div>

        <span className="text-base font-black text-slate-400">VS</span>

        {/* Rectangle N */}
        <div className="flex flex-col items-center bg-sky-50 p-2.5 rounded-2xl border-2 border-sky-300 shadow-2xs">
          <span className="text-xs font-black text-sky-900 mb-1">Hình chữ nhật N</span>
          <div className="w-28 h-16 bg-sky-200 rounded-lg border-2 border-sky-500 flex flex-col items-center justify-center text-xs font-bold text-sky-950">
            <span>8 {unit} × 4 {unit}</span>
          </div>
          <span className="text-[11px] font-bold text-sky-800 mt-1">
            {isSolutionView ? `S = 8 × 4 = 32 ${unit}²` : `Dài 8 ${unit}, Rộng 4 ${unit}`}
          </span>
        </div>
      </div>
    );
  }

  // Question 16: Three Rectangles (4x6, 5x5, 8x2) with complete units
  const currentUnit = unit === 'cm' ? 'ô vuông' : unit;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 py-1">
      {/* Hình 1: 4 x 6 */}
      <div
        className={`p-2 rounded-xl border text-center transition-all ${
          isSolutionView ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-300' : 'bg-sky-50 border-sky-200'
        }`}
      >
        <span className="text-[11px] font-bold text-slate-600 block mb-1">Hình 1</span>
        <div className="w-16 h-22 bg-sky-300 rounded border border-sky-500 mx-auto flex flex-col items-center justify-center text-[10px] font-extrabold text-sky-950">
          <span>4 {currentUnit}</span>
          <span>×</span>
          <span>6 {currentUnit}</span>
        </div>
        <span className="text-[11px] font-bold text-sky-900 mt-1 block">
          {isSolutionView ? 'S = 24 ô vuông ✓' : '4 × 6'}
        </span>
      </div>

      {/* Hình 2: 5 x 5 */}
      <div className="p-2 rounded-xl border bg-amber-50 border-amber-200 text-center">
        <span className="text-[11px] font-bold text-slate-600 block mb-1">Hình 2</span>
        <div className="w-18 h-18 bg-amber-300 rounded border border-amber-500 mx-auto flex flex-col items-center justify-center text-[10px] font-extrabold text-amber-950">
          <span>5 {currentUnit}</span>
          <span>×</span>
          <span>5 {currentUnit}</span>
        </div>
        <span className="text-[11px] font-bold text-amber-900 mt-1 block">
          {isSolutionView ? 'S = 25 ô vuông' : '5 × 5'}
        </span>
      </div>

      {/* Hình 3: 8 x 2 */}
      <div className="p-2 rounded-xl border bg-purple-50 border-purple-200 text-center">
        <span className="text-[11px] font-bold text-slate-600 block mb-1">Hình 3</span>
        <div className="w-22 h-12 bg-purple-300 rounded border border-purple-500 mx-auto flex flex-col items-center justify-center text-[10px] font-extrabold text-purple-950">
          <span>8 {currentUnit} × 2 {currentUnit}</span>
        </div>
        <span className="text-[11px] font-bold text-purple-900 mt-1 block">
          {isSolutionView ? 'S = 16 ô vuông' : '8 × 2'}
        </span>
      </div>
    </div>
  );
};

// ==========================================
// 7. GRID UNIT SVG
// ==========================================
const GridUnitSvg: React.FC<{ rows: number; cols: number; unit: string; isSolutionView: boolean; isZoomed?: boolean }> = ({
  rows,
  cols,
  unit,
  isSolutionView,
  isZoomed
}) => {
  const cellSize = isZoomed ? 40 : 28;
  const w = cols * cellSize;
  const h = rows * cellSize;

  return (
    <svg viewBox={`0 0 ${w + 30} ${h + 30}`} className={`${isZoomed ? 'w-80 h-64' : 'w-48 h-36'} drop-shadow-sm`}>
      <g transform="translate(15, 15)">
        {/* Draw each cell cleanly */}
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#f0f9ff"
              stroke="#38bdf8"
              strokeWidth="1"
            />
          ))
        )}

        {/* Outer border */}
        <rect width={w} height={h} fill="none" stroke="#0284c7" strokeWidth="2.5" rx="4" />

        {/* Top dimension label with Unit */}
        <text x={w / 2} y={-4} fill="#0369a1" fontSize="11" fontWeight="bold" textAnchor="middle">
          {cols} {unit}
        </text>
        {/* Left dimension label with Unit */}
        <text x={-6} y={h / 2 + 4} fill="#0369a1" fontSize="11" fontWeight="bold" textAnchor="end">
          {rows} {unit}
        </text>

        {isSolutionView && (
          <g>
            <rect x={w / 2 - 45} y={h / 2 - 12} width={90} height={24} rx="6" fill="#ffffff" stroke="#16a34a" strokeWidth="1.5" />
            <text x={w / 2} y={h / 2 + 4} textAnchor="middle" fill="#15803d" fontSize="12" fontWeight="800">
              {rows * cols} {unit}²
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};
