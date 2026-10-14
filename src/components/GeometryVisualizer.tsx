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
      <div className="w-full relative flex flex-col items-center justify-center p-3 sm:p-5 bg-gradient-to-b from-sky-50/70 to-white rounded-3xl border-2 border-sky-100 shadow-sm my-2 group transition-all">
        {/* Label and Sublabel */}
        {label && (
          <div className="text-center mb-2 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-black text-sky-800 bg-sky-100/90 px-3.5 py-1 rounded-full border border-sky-200 shadow-2xs whitespace-nowrap">
              {label}
            </span>
            {subLabel && <span className="text-xs sm:text-sm text-amber-700 font-bold hidden sm:inline">({subLabel})</span>}
          </div>
        )}

        {/* Zoom trigger badge button */}
        <button
          type="button"
          onClick={handleOpenZoom}
          className="absolute top-3 right-3 flex items-center gap-1.5 text-xs font-black text-sky-700 bg-white/95 hover:bg-sky-50 border border-sky-200 rounded-xl px-2.5 py-1.5 shadow-xs transition-transform transform active:scale-95 cursor-pointer z-10"
          title="Bấm để phóng to hình ảnh"
        >
          <ZoomIn className="w-4 h-4 text-sky-600" />
          <span className="hidden sm:inline">Phóng to</span>
        </button>

        {/* Clickable Graphic Canvas - Generous Height for 16:9 */}
        <div
          onClick={handleOpenZoom}
          className="w-full flex items-center justify-center min-h-[200px] max-h-80 lg:max-h-96 2xl:max-h-[440px] cursor-zoom-in overflow-hidden py-2"
          title="Nhấn vào hình để phóng to"
        >
          {renderShapeContent(false)}
        </div>

        {isSolutionView && (
          <div className="mt-2 text-xs sm:text-sm text-emerald-800 font-black flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
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
            className="relative w-full max-w-4xl bg-white rounded-3xl p-5 sm:p-8 shadow-2xl border-4 border-sky-200 flex flex-col items-center max-h-[94vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-2xl bg-sky-100 text-sky-700">
                  <Maximize2 className="w-6 h-6 stroke-[2.5]" />
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-800">
                    {label || 'Hình Minh Họa Phóng To'}
                  </h3>
                  {subLabel && <p className="text-xs sm:text-sm text-amber-600 font-semibold">{subLabel}</p>}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseZoom}
                className="p-2.5 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                title="Đóng xem phóng to"
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>

            {/* Enlarged Shape Canvas */}
            <div className="w-full flex items-center justify-center p-4 sm:p-6 bg-sky-50/50 rounded-2xl border border-sky-100 my-2">
              {renderShapeContent(true)}
            </div>

            {/* Modal Footer Note */}
            <p className="text-xs sm:text-sm text-slate-400 font-bold mt-2 text-center">
              Chạm ra ngoài hoặc bấm dấu ✕ (hoặc phím ESC) để quay lại làm bài
            </p>
          </div>
        </div>
      )}
    </>
  );
};

// ==========================================
// 1. SQUARE SVG WITH PRECISE UNIFORM GRID (ENLARGED)
// ==========================================
const SquareSvg: React.FC<{
  side: number;
  area?: number;
  unit: string;
  isSolutionView: boolean;
  isZoomed?: boolean;
  label?: string;
}> = ({ side, area, unit, isSolutionView, isZoomed, label }) => {
  const size = isZoomed ? 300 : 210;
  const padding = isZoomed ? 50 : 40;
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
      className={`${
        isZoomed
          ? 'w-88 h-88 sm:w-[440px] sm:h-[440px]'
          : 'w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 2xl:w-96 2xl:h-96'
      } drop-shadow-sm transition-all`}
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
        rx="10"
        fill={isSolutionView ? '#bbf7d0' : 'url(#sqFillGrad)'}
        stroke={isSolutionView ? '#16a34a' : '#ca8a04'}
        strokeWidth="3.5"
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
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.65"
              />
              {/* Horizontal line */}
              <line
                x1={padding}
                y1={pos}
                x2={padding + size}
                y2={pos}
                stroke="#ca8a04"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.65"
              />
            </React.Fragment>
          );
        })}
      </g>

      {/* Top dimension line with Unit */}
      <line x1={padding} y1={padding - 14} x2={padding + size} y2={padding - 14} stroke="#0284c7" strokeWidth="2.2" />
      <path d={`M ${padding} ${padding - 20} L ${padding} ${padding - 8}`} stroke="#0284c7" strokeWidth="2.2" />
      <path d={`M ${padding + size} ${padding - 20} L ${padding + size} ${padding - 8}`} stroke="#0284c7" strokeWidth="2.2" />
      <text
        x={padding + size / 2}
        y={padding - 20}
        fill="#0369a1"
        fontSize={isZoomed ? '18' : '15'}
        fontWeight="900"
        textAnchor="middle"
      >
        {displaySideText}
      </text>

      {/* Right dimension line with Unit */}
      <line x1={padding + size + 14} y1={padding} x2={padding + size + 14} y2={padding + size} stroke="#0284c7" strokeWidth="2.2" />
      <path d={`M ${padding + size + 8} ${padding} L ${padding + size + 20} ${padding}`} stroke="#0284c7" strokeWidth="2.2" />
      <path d={`M ${padding + size + 8} ${padding + size} L ${padding + size + 20} ${padding + size}`} stroke="#0284c7" strokeWidth="2.2" />
      <text
        x={padding + size + 24}
        y={padding + size / 2 + 6}
        fill="#0369a1"
        fontSize={isZoomed ? '18' : '15'}
        fontWeight="900"
        textAnchor="start"
      >
        {displaySideText}
      </text>

      {/* Center Formula / Area badge */}
      <rect
        x={padding + size / 2 - (isZoomed ? 90 : 70)}
        y={padding + size / 2 - (isZoomed ? 24 : 18)}
        width={isZoomed ? 180 : 140}
        height={isZoomed ? 48 : 36}
        rx="10"
        fill="#ffffff"
        opacity="0.95"
        stroke={isSolutionView ? '#16a34a' : '#ca8a04'}
        strokeWidth="2"
      />
      <text
        x={padding + size / 2}
        y={padding + size / 2 + (isZoomed ? 7 : 5)}
        fill={isSolutionView ? '#15803d' : '#854d0e'}
        fontSize={isZoomed ? '17' : '14'}
        fontWeight="900"
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
// 2. RECTANGLE SVG WITH PRECISE UNIFORM GRID (ENLARGED)
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
  const svgWidth = isZoomed ? 420 : 300;
  const svgHeight = isZoomed ? 240 : 170;
  const padX = isZoomed ? 55 : 40;
  const padY = isZoomed ? 50 : 35;

  const rectW = isZoomed ? 310 : 220;
  // Maintain proper aspect ratio between 40% and 75%
  const ratio = Math.max(0.42, Math.min(0.72, height / width));
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
      className={`${
        isZoomed
          ? 'w-96 h-64 sm:w-[480px] sm:h-[310px]'
          : 'w-72 h-48 sm:w-84 sm:h-56 lg:w-96 lg:h-64 2xl:w-[460px] 2xl:h-[290px]'
      } drop-shadow-sm transition-all`}
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
        rx="10"
        fill={isSolutionView ? '#bbf7d0' : 'url(#rectGradExact)'}
        stroke={isSolutionView ? '#16a34a' : '#0284c7'}
        strokeWidth="3"
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
            strokeWidth="1"
            strokeDasharray="4,4"
            opacity="0.6"
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
            strokeWidth="1"
            strokeDasharray="4,4"
            opacity="0.6"
          />
        ))}
      </g>

      {/* Top Dimension (Length) with Unit */}
      <line x1={padX} y1={padY - 12} x2={padX + rectW} y2={padY - 12} stroke="#0369a1" strokeWidth="2" />
      <path d={`M ${padX} ${padY - 18} L ${padX} ${padY - 6}`} stroke="#0369a1" strokeWidth="2" />
      <path d={`M ${padX + rectW} ${padY - 18} L ${padX + rectW} ${padY - 6}`} stroke="#0369a1" strokeWidth="2" />
      <text
        x={padX + rectW / 2}
        y={padY - 16}
        fill="#0369a1"
        fontSize={isZoomed ? '17' : '13'}
        fontWeight="900"
        textAnchor="middle"
      >
        Chiều dài: {displayWidth}
      </text>

      {/* Right Dimension (Width) with Unit */}
      <line x1={padX + rectW + 12} y1={padY} x2={padX + rectW + 12} y2={padY + rectH} stroke="#0369a1" strokeWidth="2" />
      <path d={`M ${padX + rectW + 6} ${padY} L ${padX + rectW + 18} ${padY}`} stroke="#0369a1" strokeWidth="2" />
      <path d={`M ${padX + rectW + 6} ${padY + rectH} L ${padX + rectW + 18} ${padY + rectH}`} stroke="#0369a1" strokeWidth="2" />
      <text
        x={padX + rectW + 22}
        y={padY + rectH / 2 + 5}
        fill="#0369a1"
        fontSize={isZoomed ? '16' : '12'}
        fontWeight="900"
        textAnchor="start"
      >
        Rộng: {displayHeight}
      </text>

      {/* Center Label / Formula Badge */}
      <rect
        x={padX + rectW / 2 - (isZoomed ? 95 : 75)}
        y={padY + rectH / 2 - (isZoomed ? 20 : 15)}
        width={isZoomed ? 190 : 150}
        height={isZoomed ? 40 : 30}
        rx="8"
        fill="#ffffff"
        opacity="0.95"
        stroke={isSolutionView ? '#16a34a' : '#0369a1'}
        strokeWidth="1.5"
      />
      <text
        x={padX + rectW / 2}
        y={padY + rectH / 2 + 5}
        fill={isSolutionView ? '#15803d' : '#0369a1'}
        fontSize={isZoomed ? '15' : '12'}
        fontWeight="900"
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
// 3. HOUSE CARDS (SGK EXERCISE 3) - WIDE & EXACT
// ==========================================
const HouseCardsSvg: React.FC<{ isSolutionView: boolean; isZoomed?: boolean }> = ({
  isSolutionView,
  isZoomed
}) => {
  const cols = 25;
  const rows = 7;
  // Generous unit size for wide display
  const u = isZoomed ? 30 : 21;
  const width = cols * u;
  const height = rows * u + 36;

  return (
    <div className="flex flex-col items-center w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={`${isZoomed ? 'w-full max-w-3xl' : 'w-full max-w-xl lg:max-w-2xl 2xl:max-w-3xl'} h-auto drop-shadow-sm select-none`}
      >
        <defs>
          <pattern id="unifiedGrid" width={u} height={u} patternUnits="userSpaceOnUse">
            <rect width={u} height={u} fill="#ffffff" stroke="#bae6fd" strokeWidth="0.8" />
          </pattern>
        </defs>

        {/* Full continuous grid background */}
        <rect width={cols * u} height={rows * u} fill="url(#unifiedGrid)" stroke="#38bdf8" strokeWidth="1.5" />

        {/* ============================================================== */}
        {/* HOUSE A: Light Blue (Cols 1 to 7, Base width 6, Body cols 2 to 6) */}
        {/* ============================================================== */}
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
          strokeWidth="2.2"
        />
        {/* Internal grid lines for House A */}
        <g stroke="#7dd3fc" strokeWidth="1" opacity="0.9">
          <line x1={3 * u} y1={2 * u} x2={3 * u} y2={6 * u} />
          <line x1={4 * u} y1={0 * u} x2={4 * u} y2={6 * u} />
          <line x1={5 * u} y1={2 * u} x2={5 * u} y2={6 * u} />
          <line x1={3 * u} y1={1 * u} x2={5 * u} y2={1 * u} />
          <line x1={2 * u} y1={2 * u} x2={6 * u} y2={2 * u} />
          <line x1={2 * u} y1={3 * u} x2={6 * u} y2={3 * u} />
          <line x1={2 * u} y1={4 * u} x2={6 * u} y2={4 * u} />
          <line x1={2 * u} y1={5 * u} x2={6 * u} y2={5 * u} />
        </g>
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
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Label A below house */}
        <text
          x={4 * u}
          y={rows * u + 26}
          fill="#db2777"
          fontSize={isZoomed ? '24' : '18'}
          fontWeight="900"
          textAnchor="middle"
        >
          A
        </text>

        {/* ============================================================== */}
        {/* HOUSE B: Yellow (Cols 9 to 15, Base width 6, Doorway 2x2) */}
        {/* ============================================================== */}
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
          strokeWidth="2.2"
        />
        {/* Doorway white cutout */}
        <rect
          x={11 * u}
          y={4 * u}
          width={2 * u}
          height={2 * u}
          fill="#ffffff"
          stroke="#854d0e"
          strokeWidth="2"
        />
        <line x1={12 * u} y1={4 * u} x2={12 * u} y2={6 * u} stroke="#bae6fd" strokeWidth="1" />
        <line x1={11 * u} y1={5 * u} x2={13 * u} y2={5 * u} stroke="#bae6fd" strokeWidth="1" />

        {/* Internal grid lines for House B */}
        <g stroke="#facc15" strokeWidth="1" opacity="0.9">
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
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Label B below house */}
        <text
          x={12 * u}
          y={rows * u + 26}
          fill="#db2777"
          fontSize={isZoomed ? '24' : '18'}
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
          strokeWidth="2.2"
        />

        {/* Windows cutouts */}
        {/* Top window (Cols 19 to 21, Row 2 to 3, width 2, height 1) */}
        <rect
          x={19 * u}
          y={2 * u}
          width={2 * u}
          height={1 * u}
          fill="#ffffff"
          stroke="#9d174d"
          strokeWidth="2"
        />
        <line x1={20 * u} y1={2 * u} x2={20 * u} y2={3 * u} stroke="#bae6fd" strokeWidth="1" />

        {/* Bottom-left window (Col 18 to 19, Row 4.5 to 5.5, size 1x1) */}
        <rect
          x={18 * u}
          y={4.5 * u}
          width={1 * u}
          height={1 * u}
          fill="#ffffff"
          stroke="#9d174d"
          strokeWidth="2"
        />

        {/* Bottom-right window (Col 21 to 22, Row 4.5 to 5.5, size 1x1) */}
        <rect
          x={21 * u}
          y={4.5 * u}
          width={1 * u}
          height={1 * u}
          fill="#ffffff"
          stroke="#9d174d"
          strokeWidth="2"
        />

        {/* Internal grid lines for House C */}
        <g stroke="#f472b6" strokeWidth="1" opacity="0.9">
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
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Label C below house */}
        <text
          x={20 * u}
          y={rows * u + 26}
          fill="#db2777"
          fontSize={isZoomed ? '24' : '18'}
          fontWeight="900"
          textAnchor="middle"
        >
          C
        </text>

        {/* ============================================================== */}
        {/* SOLUTION BADGES (ONLY SHOWN IN SOLUTION VIEW) */}
        {/* ============================================================== */}
        {isSolutionView && (
          <g>
            <rect x={2.5 * u} y={6.2 * u} width={3 * u} height={0.9 * u} rx="4" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
            <text x={4 * u} y={6.8 * u} textAnchor="middle" fill="#0369a1" fontSize={isZoomed ? '13' : '10'} fontWeight="bold">
              21 ô
            </text>

            <rect x={10.5 * u} y={6.2 * u} width={3 * u} height={0.9 * u} rx="4" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1" />
            <text x={12 * u} y={6.8 * u} textAnchor="middle" fill="#15803d" fontSize={isZoomed ? '13' : '10'} fontWeight="bold">
              23 ô ✓
            </text>

            <rect x={18.5 * u} y={6.2 * u} width={3 * u} height={0.9 * u} rx="4" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1" />
            <text x={20 * u} y={6.8 * u} textAnchor="middle" fill="#15803d" fontSize={isZoomed ? '13' : '10'} fontWeight="bold">
              23 ô ✓
            </text>
          </g>
        )}
      </svg>
      <p className="text-xs sm:text-sm text-slate-500 mt-2 font-bold text-center">
        Mỗi ô vuông nhỏ trên lưới = 1 đơn vị diện tích (1 ô vuông)
      </p>
    </div>
  );
};

// ==========================================
// 4. GARDEN SVG (SGK EXERCISE 4) - ENLARGED
// ==========================================
const GardenSvg: React.FC<{
  side: number;
  perimeter: number;
  unit: string;
  isSolutionView: boolean;
  isZoomed?: boolean;
}> = ({ side, perimeter, unit, isSolutionView, isZoomed }) => {
  return (
    <svg
      viewBox="0 0 260 210"
      className={`${
        isZoomed
          ? 'w-96 h-76 sm:w-[460px] sm:h-[340px]'
          : 'w-60 h-50 sm:w-72 sm:h-60 lg:w-84 lg:h-68'
      } drop-shadow-sm transition-all`}
    >
      <defs>
        <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
      </defs>

      {/* Garden Area */}
      <rect x="50" y="38" width="160" height="160" rx="14" fill="url(#grassGrad)" stroke="#15803d" strokeWidth="3.5" />

      {/* Grid rows with carrots */}
      {[60, 95, 130, 165].map((y, rowIdx) => (
        <g key={rowIdx}>
          <line x1="60" y1={y + 14} x2="200" y2={y + 14} stroke="#166534" strokeWidth="1" strokeDasharray="4,4" />
          {[75, 110, 145, 180].map((x, colIdx) => (
            <text key={colIdx} x={x} y={y + 12} fontSize="16" textAnchor="middle">
              🥕
            </text>
          ))}
        </g>
      ))}

      {/* Perimeter label with Unit */}
      <rect x="60" y="6" width="140" height="26" rx="8" fill="#ffffff" stroke="#0284c7" strokeWidth="1.8" />
      <text x="130" y="23" textAnchor="middle" fill="#0369a1" fontSize="13" fontWeight="900">
        Chu vi vườn = {perimeter} {unit}
      </text>

      {/* Side dimension indicator with Unit */}
      <line x1="30" y1="38" x2="30" y2="198" stroke="#0284c7" strokeWidth="2.2" />
      <path d="M 24 38 L 36 38" stroke="#0284c7" strokeWidth="2.2" />
      <path d="M 24 198 L 36 198" stroke="#0284c7" strokeWidth="2.2" />
      <text
        x="18"
        y="120"
        textAnchor="middle"
        fill="#0369a1"
        fontSize="13"
        fontWeight="900"
        transform="rotate(-90 18 120)"
      >
        {isSolutionView ? `Cạnh: ${side} ${unit}` : `Cạnh: ? ${unit}`}
      </text>

      {/* Solution breakdown badge */}
      {isSolutionView && (
        <g>
          <rect x="65" y="75" width="130" height="60" rx="12" fill="#ffffff" opacity="0.96" stroke="#16a34a" strokeWidth="2.2" />
          <text x="130" y="100" textAnchor="middle" fill="#166534" fontSize="12" fontWeight="bold">
            Cạnh = {perimeter} : 4 = {side} {unit}
          </text>
          <text x="130" y="122" textAnchor="middle" fill="#15803d" fontSize="14" fontWeight="900">
            S = {side} × {side} = {side * side} {unit}²
          </text>
        </g>
      )}
    </svg>
  );
};

// ==========================================
// 5. COMPOSITE L-SHAPE WITH CLEAR DIMENSIONS
// ==========================================
const CompositeLSvg: React.FC<{ unit: string; isSolutionView: boolean; isZoomed?: boolean }> = ({
  unit,
  isSolutionView,
  isZoomed
}) => {
  return (
    <svg
      viewBox="0 0 250 190"
      className={`${
        isZoomed
          ? 'w-96 h-76 sm:w-[450px] sm:h-[330px]'
          : 'w-64 h-50 sm:w-76 sm:h-58 lg:w-88 lg:h-68'
      } drop-shadow-sm transition-all`}
    >
      {/* Rect 1: 5 x 3 cm (Top rectangle) */}
      <rect
        x="50"
        y="25"
        width="110"
        height="65"
        fill={isSolutionView ? '#86efac' : '#fed7aa'}
        stroke="#ea580c"
        strokeWidth="2.5"
        rx="6"
      />
      {/* Rect 1 Dimension Arrows with Unit */}
      <line x1="50" y1="16" x2="160" y2="16" stroke="#c2410c" strokeWidth="1.8" />
      <path d="M 50 11 L 50 21" stroke="#c2410c" strokeWidth="1.8" />
      <path d="M 160 11 L 160 21" stroke="#c2410c" strokeWidth="1.8" />
      <text x="105" y="12" textAnchor="middle" fill="#9a3412" fontSize="12" fontWeight="900">
        5 {unit}
      </text>

      <line x1="168" y1="25" x2="168" y2="90" stroke="#c2410c" strokeWidth="1.8" />
      <path d="M 163 25 L 173 25" stroke="#c2410c" strokeWidth="1.8" />
      <path d="M 163 90 L 173 90" stroke="#c2410c" strokeWidth="1.8" />
      <text x="178" y="60" textAnchor="start" fill="#9a3412" fontSize="12" fontWeight="900">
        3 {unit}
      </text>

      <text x="105" y="60" textAnchor="middle" fill="#9a3412" fontSize="12" fontWeight="900">
        Hình 1 {isSolutionView && `= 15 ${unit}²`}
      </text>

      {/* Rect 2: 4 x 3 cm (Bottom attached rectangle) */}
      <rect
        x="50"
        y="90"
        width="90"
        height="65"
        fill={isSolutionView ? '#bbf7d0' : '#fed7aa'}
        stroke="#ea580c"
        strokeWidth="2.5"
        rx="6"
      />
      {/* Rect 2 Width Dimension with Unit */}
      <line x1="50" y1="162" x2="140" y2="162" stroke="#c2410c" strokeWidth="1.8" />
      <path d="M 50 157 L 50 167" stroke="#c2410c" strokeWidth="1.8" />
      <path d="M 140 157 L 140 167" stroke="#c2410c" strokeWidth="1.8" />
      <text x="95" y="177" textAnchor="middle" fill="#9a3412" fontSize="12" fontWeight="900">
        4 {unit}
      </text>

      <line x1="36" y1="90" x2="36" y2="155" stroke="#c2410c" strokeWidth="1.8" />
      <path d="M 31 90 L 41 90" stroke="#c2410c" strokeWidth="1.8" />
      <path d="M 31 155 L 41 155" stroke="#c2410c" strokeWidth="1.8" />
      <text x="26" y="125" textAnchor="end" fill="#9a3412" fontSize="12" fontWeight="900">
        3 {unit}
      </text>

      <text x="95" y="125" textAnchor="middle" fill="#9a3412" fontSize="12" fontWeight="900">
        Hình 2 {isSolutionView && `= 12 ${unit}²`}
      </text>

      {/* Total label */}
      {isSolutionView && (
        <g>
          <rect x="155" y="112" width="90" height="34" rx="8" fill="#ffffff" stroke="#16a34a" strokeWidth="2" />
          <text x="200" y="133" textAnchor="middle" fill="#15803d" fontSize="13" fontWeight="900">
            S = 27 {unit}²
          </text>
        </g>
      )}
    </svg>
  );
};

// ==========================================
// 6. COMPARISON SVG (ENLARGED)
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
      <div className="flex items-center justify-center gap-6 sm:gap-10 py-3">
        {/* Square M */}
        <div className="flex flex-col items-center bg-amber-50 p-3.5 sm:p-5 rounded-3xl border-2 border-amber-300 shadow-sm">
          <span className="text-sm font-black text-amber-950 mb-2">Hình vuông M</span>
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-amber-200 rounded-2xl border-2 border-amber-500 flex flex-col items-center justify-center text-sm font-black text-amber-950 relative shadow-inner">
            <span>Cạnh: 6 {unit}</span>
          </div>
          <span className="text-xs sm:text-sm font-black text-amber-800 mt-2">
            {isSolutionView ? `S = 6 × 6 = 36 ${unit}² ✓` : `Cạnh: 6 ${unit}`}
          </span>
        </div>

        <span className="text-xl sm:text-2xl font-black text-slate-400">VS</span>

        {/* Rectangle N */}
        <div className="flex flex-col items-center bg-sky-50 p-3.5 sm:p-5 rounded-3xl border-2 border-sky-300 shadow-sm">
          <span className="text-sm font-black text-sky-950 mb-2">Hình chữ nhật N</span>
          <div className="w-32 h-20 sm:w-36 sm:h-22 bg-sky-200 rounded-2xl border-2 border-sky-500 flex flex-col items-center justify-center text-sm font-black text-sky-950 shadow-inner">
            <span>8 {unit} × 4 {unit}</span>
          </div>
          <span className="text-xs sm:text-sm font-black text-sky-800 mt-2">
            {isSolutionView ? `S = 8 × 4 = 32 ${unit}²` : `Dài 8 ${unit}, Rộng 4 ${unit}`}
          </span>
        </div>
      </div>
    );
  }

  // Question 16: Three Rectangles (4x6, 5x5, 8x2)
  const currentUnit = unit === 'cm' ? 'ô vuông' : unit;
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 py-2">
      {/* Hình 1: 4 x 6 */}
      <div
        className={`p-3 rounded-2xl border-2 text-center transition-all ${
          isSolutionView ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-300 shadow-md' : 'bg-sky-50 border-sky-200'
        }`}
      >
        <span className="text-xs font-black text-slate-700 block mb-1.5">Hình 1</span>
        <div className="w-20 h-28 bg-sky-300 rounded-xl border-2 border-sky-500 mx-auto flex flex-col items-center justify-center text-xs font-black text-sky-950 shadow-inner">
          <span>4 {currentUnit}</span>
          <span>×</span>
          <span>6 {currentUnit}</span>
        </div>
        <span className="text-xs sm:text-sm font-black text-sky-900 mt-2 block">
          {isSolutionView ? 'S = 24 ô vuông ✓' : '4 × 6'}
        </span>
      </div>

      {/* Hình 2: 5 x 5 */}
      <div className="p-3 rounded-2xl border-2 bg-amber-50 border-amber-200 text-center">
        <span className="text-xs font-black text-slate-700 block mb-1.5">Hình 2</span>
        <div className="w-24 h-24 bg-amber-300 rounded-xl border-2 border-amber-500 mx-auto flex flex-col items-center justify-center text-xs font-black text-amber-950 shadow-inner">
          <span>5 {currentUnit}</span>
          <span>×</span>
          <span>5 {currentUnit}</span>
        </div>
        <span className="text-xs sm:text-sm font-black text-amber-900 mt-2 block">
          {isSolutionView ? 'S = 25 ô vuông' : '5 × 5'}
        </span>
      </div>

      {/* Hình 3: 8 x 2 */}
      <div className="p-3 rounded-2xl border-2 bg-purple-50 border-purple-200 text-center">
        <span className="text-xs font-black text-slate-700 block mb-1.5">Hình 3</span>
        <div className="w-28 h-16 bg-purple-300 rounded-xl border-2 border-purple-500 mx-auto flex flex-col items-center justify-center text-xs font-black text-purple-950 shadow-inner">
          <span>8 {currentUnit} × 2 {currentUnit}</span>
        </div>
        <span className="text-xs sm:text-sm font-black text-purple-900 mt-2 block">
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
  const cellSize = isZoomed ? 44 : 32;
  const w = cols * cellSize;
  const h = rows * cellSize;

  return (
    <svg viewBox={`0 0 ${w + 36} ${h + 36}`} className={`${isZoomed ? 'w-96 h-76' : 'w-56 h-44 sm:w-64 sm:h-52'} drop-shadow-sm`}>
      <g transform="translate(18, 18)">
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
              strokeWidth="1.2"
            />
          ))
        )}

        {/* Outer border */}
        <rect width={w} height={h} fill="none" stroke="#0284c7" strokeWidth="3" rx="6" />

        {/* Top dimension label with Unit */}
        <text x={w / 2} y={-6} fill="#0369a1" fontSize="13" fontWeight="900" textAnchor="middle">
          {cols} {unit}
        </text>
        {/* Left dimension label with Unit */}
        <text x={-8} y={h / 2 + 5} fill="#0369a1" fontSize="13" fontWeight="900" textAnchor="end">
          {rows} {unit}
        </text>

        {isSolutionView && (
          <g>
            <rect x={w / 2 - 50} y={h / 2 - 15} width={100} height={30} rx="8" fill="#ffffff" stroke="#16a34a" strokeWidth="2" />
            <text x={w / 2} y={h / 2 + 5} textAnchor="middle" fill="#15803d" fontSize="14" fontWeight="900">
              {rows * cols} {unit}²
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};
