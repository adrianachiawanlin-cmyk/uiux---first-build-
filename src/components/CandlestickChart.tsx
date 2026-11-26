import React, { useMemo, useRef, useState } from 'react';
import {
  CandleBar,
  ChartDrawing,
  ChartPoint,
  DrawingTool,
  PriceAlert,
} from '../types/trading';
import { formatAxisPrice, formatPrice } from '../data/marketData';

interface CandlestickChartProps {
  symbol: string;
  candles: CandleBar[];
  timeLabels: string[];
  showEma: boolean;
  showBb: boolean;
  activeTool: DrawingTool;
  drawings: ChartDrawing[];
  alerts: PriceAlert[];
  hoveredIndex: number | null;
  zoomRange: [number, number] | null;
  onHoverIndex: (idx: number | null) => void;
  onAddDrawing: (drawing: ChartDrawing) => void;
  onRequestTextNote: (point: ChartPoint) => void;
  onZoomRange: (range: [number, number] | null) => void;
}

const FIB_RATIOS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
const FIB_COLORS = [
  '#8D90A2',
  '#FF4D5A',
  '#FFB59A',
  '#2962FF',
  '#089981',
  '#B6C4FF',
  '#8D90A2',
];

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  symbol,
  candles,
  timeLabels,
  showEma,
  showBb,
  activeTool,
  drawings,
  alerts,
  hoveredIndex,
  zoomRange,
  onHoverIndex,
  onAddDrawing,
  onRequestTextNote,
  onZoomRange,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [pointerSvg, setPointerSvg] = useState<{ x: number; y: number } | null>(null);
  const [draftStart, setDraftStart] = useState<ChartPoint | null>(null);
  const [draftCurrent, setDraftCurrent] = useState<ChartPoint | null>(null);
  const [brushPoints, setBrushPoints] = useState<ChartPoint[]>([]);
  const [isBrushing, setIsBrushing] = useState(false);
  const [zoomDragStartIdx, setZoomDragStartIdx] = useState<number | null>(null);
  const [zoomDragCurrentIdx, setZoomDragCurrentIdx] = useState<number | null>(null);

  const visibleStart = zoomRange ? Math.max(0, zoomRange[0]) : 0;
  const visibleEnd = zoomRange ? Math.min(candles.length - 1, zoomRange[1]) : candles.length - 1;
  const visibleCandles = useMemo(
    () => candles.slice(visibleStart, visibleEnd + 1),
    [candles, visibleStart, visibleEnd]
  );

  // Price bounds over visible slice (including Bollinger if enabled)
  const { minPrice, maxPrice, axisTicks } = useMemo(() => {
    let minP = Infinity;
    let maxP = -Infinity;
    visibleCandles.forEach((c) => {
      minP = Math.min(minP, c.low);
      maxP = Math.max(maxP, c.high);
      if (showBb) {
        minP = Math.min(minP, c.bbLower);
        maxP = Math.max(maxP, c.bbUpper);
      }
    });
    if (!Number.isFinite(minP) || !Number.isFinite(maxP) || minP === maxP) {
      minP = 100;
      maxP = 150;
    }
    const span = maxP - minP;
    const paddedMax = maxP + span * 0.14;
    const paddedMin = minP - span * 0.14;
    const ticks = [0, 1, 2, 3, 4].map(
      (i) => paddedMax - (i / 4) * (paddedMax - paddedMin)
    );
    return { minPrice: paddedMin, maxPrice: paddedMax, axisTicks: ticks };
  }, [visibleCandles, showBb]);

  const maxVol = useMemo(
    () => Math.max(...visibleCandles.map((c) => c.volume), 1),
    [visibleCandles]
  );

  const count = visibleCandles.length;
  const plotLeft = 22;
  const plotRight = 822;
  const candleWidth = Math.max(8, Math.min(20, (plotRight - plotLeft) / Math.max(1, count) * 0.52));

  const indexToX = (globalIdx: number): number => {
    const localIdx = globalIdx - visibleStart;
    if (count <= 1) return plotLeft;
    return plotLeft + (localIdx / (count - 1)) * (plotRight - plotLeft);
  };

  const priceToY = (price: number): number => {
    const ratio = (maxPrice - price) / (maxPrice - minPrice || 1);
    return 40 + ratio * 240;
  };

  const yToPrice = (y: number): number => {
    const clampedY = Math.max(16, Math.min(300, y));
    const ratio = (clampedY - 40) / 240;
    return maxPrice - ratio * (maxPrice - minPrice);
  };

  const xToGlobalIndex = (x: number): number => {
    const clampedX = Math.max(plotLeft, Math.min(plotRight, x));
    const ratio = (clampedX - plotLeft) / (plotRight - plotLeft || 1);
    const localIdx = Math.round(ratio * Math.max(0, count - 1));
    return Math.max(visibleStart, Math.min(visibleEnd, visibleStart + localIdx));
  };

  const clientToSvg = (clientX: number, clientY: number): { x: number; y: number } | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const x = ((clientX - rect.left) / rect.width) * 920;
    const y = ((clientY - rect.top) / rect.height) * 340;
    return { x, y };
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const coords = clientToSvg(e.clientX, e.clientY);
    if (!coords) return;
    setPointerSvg(coords);

    if (coords.x <= 850) {
      const globalIdx = xToGlobalIndex(coords.x);
      onHoverIndex(globalIdx);

      const pt: ChartPoint = {
        index: globalIdx,
        price: yToPrice(coords.y),
      };

      if (draftStart) {
        setDraftCurrent(pt);
      }
      if (isBrushing) {
        setBrushPoints((prev) => [...prev, pt]);
      }
      if (zoomDragStartIdx !== null) {
        setZoomDragCurrentIdx(globalIdx);
      }
    } else {
      onHoverIndex(null);
    }
  };

  const handleMouseLeave = () => {
    setPointerSvg(null);
    onHoverIndex(null);
    if (isBrushing && brushPoints.length > 1) {
      onAddDrawing({
        id: `brush-${Date.now()}`,
        type: 'brush',
        points: brushPoints,
      });
    }
    setIsBrushing(false);
    setBrushPoints([]);
    setZoomDragStartIdx(null);
    setZoomDragCurrentIdx(null);
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const coords = clientToSvg(e.clientX, e.clientY);
    if (!coords || coords.x > 850) return;

    const globalIdx = xToGlobalIndex(coords.x);
    const point: ChartPoint = { index: globalIdx, price: yToPrice(coords.y) };

    if (activeTool === 'brush') {
      setIsBrushing(true);
      setBrushPoints([point]);
      return;
    }

    if (activeTool === 'zoom') {
      setZoomDragStartIdx(globalIdx);
      setZoomDragCurrentIdx(globalIdx);
      return;
    }

    if (activeTool === 'text') {
      onRequestTextNote(point);
      return;
    }

    if (activeTool === 'trendline' || activeTool === 'fib' || activeTool === 'measure') {
      if (!draftStart) {
        setDraftStart(point);
        setDraftCurrent(point);
      } else {
        onAddDrawing({
          id: `${activeTool}-${Date.now()}`,
          type: activeTool,
          p1: draftStart,
          p2: point,
        });
        setDraftStart(null);
        setDraftCurrent(null);
      }
    }
  };

  const handleMouseUp = () => {
    if (activeTool === 'brush' && isBrushing) {
      if (brushPoints.length > 1) {
        onAddDrawing({
          id: `brush-${Date.now()}`,
          type: 'brush',
          points: brushPoints,
        });
      }
      setIsBrushing(false);
      setBrushPoints([]);
    }

    if (activeTool === 'zoom' && zoomDragStartIdx !== null && zoomDragCurrentIdx !== null) {
      const lo = Math.min(zoomDragStartIdx, zoomDragCurrentIdx);
      const hi = Math.max(zoomDragStartIdx, zoomDragCurrentIdx);
      if (hi - lo >= 3) {
        onZoomRange([lo, hi]);
      } else if (zoomRange) {
        // Quick click while zoomed resets or zooms in around click
        const center = zoomDragStartIdx;
        const span = Math.max(6, Math.floor((visibleEnd - visibleStart) / 2));
        const nextLo = Math.max(0, center - Math.floor(span / 2));
        const nextHi = Math.min(candles.length - 1, nextLo + span);
        if (nextHi - nextLo >= 4) {
          onZoomRange([nextLo, nextHi]);
        }
      } else {
        // Single click zoom-in around center
        const half = 5;
        const nextLo = Math.max(0, zoomDragStartIdx - half);
        const nextHi = Math.min(candles.length - 1, nextLo + 10);
        onZoomRange([nextLo, nextHi]);
      }
      setZoomDragStartIdx(null);
      setZoomDragCurrentIdx(null);
    }
  };

  // Build SVG paths for EMA 20 and Bollinger Bands
  const emaPath = visibleCandles
    .map(
      (c, i) =>
        `${i === 0 ? 'M' : 'L'} ${indexToX(visibleStart + i).toFixed(1)} ${priceToY(
          c.ema20
        ).toFixed(1)}`
    )
    .join(' ');

  const bbUpperPath = visibleCandles
    .map(
      (c, i) =>
        `${i === 0 ? 'M' : 'L'} ${indexToX(visibleStart + i).toFixed(1)} ${priceToY(
          c.bbUpper
        ).toFixed(1)}`
    )
    .join(' ');

  const bbLowerPath = visibleCandles
    .map(
      (c, i) =>
        `${i === 0 ? 'M' : 'L'} ${indexToX(visibleStart + i).toFixed(1)} ${priceToY(
          c.bbLower
        ).toFixed(1)}`
    )
    .join(' ');

  const bbAreaPath = useMemo(() => {
    if (visibleCandles.length === 0) return '';
    const upperPts = visibleCandles.map(
      (c, i) => `${indexToX(visibleStart + i).toFixed(1)},${priceToY(c.bbUpper).toFixed(1)}`
    );
    const lowerPts = [...visibleCandles]
      .reverse()
      .map(
        (c, i) =>
          `${indexToX(visibleEnd - i).toFixed(1)},${priceToY(c.bbLower).toFixed(1)}`
      );
    return `M ${upperPts.join(' L ')} L ${lowerPts.join(' L ')} Z`;
  }, [visibleCandles, visibleStart, visibleEnd, minPrice, maxPrice]);

  const lastCandle = candles[candles.length - 1];
  const lastIsUp = lastCandle.close >= lastCandle.open;
  const lastPriceY = Math.max(20, Math.min(285, priceToY(lastCandle.close)));

  const visibleTimeLabels = useMemo(() => {
    if (!zoomRange) return timeLabels;
    const idxs = [0, 0.25, 0.5, 0.75, 1].map((r) =>
      Math.round(visibleStart + r * (visibleEnd - visibleStart))
    );
    return idxs.map((idx) => candles[idx]?.time ?? '');
  }, [zoomRange, timeLabels, visibleStart, visibleEnd, candles]);

  const renderDrawing = (d: ChartDrawing, isPreview = false) => {
    if (d.type === 'trendline') {
      const x1 = indexToX(d.p1.index);
      const y1 = priceToY(d.p1.price);
      const x2 = indexToX(d.p2.index);
      const y2 = priceToY(d.p2.price);
      return (
        <g key={d.id} opacity={isPreview ? 0.75 : 1}>
          <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#2962FF"
            strokeWidth="2"
            strokeDasharray={isPreview ? '5 4' : undefined}
          />
          <circle cx={x1} cy={y1} r="3.5" fill="#2962FF" stroke="#FFFFFF" strokeWidth="1.2" />
          <circle cx={x2} cy={y2} r="3.5" fill="#2962FF" stroke="#FFFFFF" strokeWidth="1.2" />
        </g>
      );
    }

    if (d.type === 'fib') {
      const x1 = Math.min(indexToX(d.p1.index), indexToX(d.p2.index));
      const x2 = Math.max(indexToX(d.p1.index), indexToX(d.p2.index), x1 + 90);
      const clampedX2 = Math.min(846, x2);
      const pHigh = Math.max(d.p1.price, d.p2.price);
      const pLow = Math.min(d.p1.price, d.p2.price);
      const diff = pHigh - pLow || 0.01;

      return (
        <g key={d.id} opacity={isPreview ? 0.8 : 1}>
          {FIB_RATIOS.map((ratio, i) => {
            const levelPrice = pHigh - diff * ratio;
            const ly = priceToY(levelPrice);
            if (ly < 10 || ly > 300) return null;
            return (
              <g key={ratio}>
                <line
                  x1={x1}
                  y1={ly}
                  x2={clampedX2}
                  y2={ly}
                  stroke={FIB_COLORS[i]}
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
                <text
                  x={x1 + 4}
                  y={ly - 3}
                  fontSize="10"
                  fill={FIB_COLORS[i]}
                  className="font-mono"
                >
                  {(ratio * 100).toFixed(1)}% ({formatPrice(levelPrice, symbol)})
                </text>
              </g>
            );
          })}
        </g>
      );
    }

    if (d.type === 'brush') {
      if (d.points.length < 2) return null;
      const pathD = d.points
        .map(
          (pt, idx) =>
            `${idx === 0 ? 'M' : 'L'} ${indexToX(pt.index).toFixed(1)} ${priceToY(
              pt.price
            ).toFixed(1)}`
        )
        .join(' ');
      return (
        <path
          key={d.id}
          d={pathD}
          fill="none"
          stroke="#FFB59A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    }

    if (d.type === 'text') {
      const x = Math.max(12, Math.min(730, indexToX(d.point.index)));
      const y = Math.max(24, Math.min(280, priceToY(d.point.price)));
      const boxWidth = Math.min(180, Math.max(64, d.text.length * 7.2 + 16));
      return (
        <g key={d.id} transform={`translate(${x}, ${y})`}>
          <rect
            x="0"
            y="-18"
            width={boxWidth}
            height="22"
            rx="4"
            fill="#282933"
            stroke="#434656"
            strokeWidth="1"
          />
          <text x="8" y="-3" fontSize="11" fill="#E1E1EE" className="font-body">
            {d.text.slice(0, 24)}
          </text>
        </g>
      );
    }

    if (d.type === 'measure') {
      const x1 = indexToX(d.p1.index);
      const y1 = priceToY(d.p1.price);
      const x2 = indexToX(d.p2.index);
      const y2 = priceToY(d.p2.price);
      const rx = Math.min(x1, x2);
      const ry = Math.min(y1, y2);
      const rw = Math.max(16, Math.abs(x2 - x1));
      const rh = Math.max(16, Math.abs(y2 - y1));
      const delta = d.p2.price - d.p1.price;
      const pct = d.p1.price !== 0 ? (delta / d.p1.price) * 100 : 0;
      const bars = Math.abs(d.p2.index - d.p1.index) + 1;
      const up = delta >= 0;

      return (
        <g key={d.id} opacity={isPreview ? 0.85 : 1}>
          <rect
            x={rx}
            y={ry}
            width={rw}
            height={rh}
            fill={up ? 'rgba(8, 153, 129, 0.18)' : 'rgba(255, 77, 90, 0.18)'}
            stroke={up ? '#089981' : '#FF4D5A'}
            strokeWidth="1.2"
          />
          <g transform={`translate(${Math.min(700, rx + rw / 2 - 58)}, ${Math.max(18, ry - 26)})`}>
            <rect
              x="0"
              y="0"
              width="126"
              height="22"
              rx="4"
              fill={up ? '#089981' : '#FF4D5A'}
            />
            <text
              x="63"
              y="14"
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="700"
              fill="#FFFFFF"
              className="font-mono"
            >
              {up ? '+' : ''}
              {delta.toFixed(2)} ({up ? '+' : ''}
              {pct.toFixed(2)}%) · {bars}b
            </text>
          </g>
        </g>
      );
    }

    return null;
  };

  const cursorClass =
    activeTool === 'crosshair'
      ? 'cursor-crosshair'
      : activeTool === 'zoom'
      ? 'cursor-zoom-in'
      : activeTool === 'text'
      ? 'cursor-text'
      : 'cursor-crosshair';

  const hoveredCandle = hoveredIndex !== null ? candles[hoveredIndex] : null;
  const crosshairX =
    hoveredIndex !== null && hoveredIndex >= visibleStart && hoveredIndex <= visibleEnd
      ? indexToX(hoveredIndex)
      : pointerSvg && pointerSvg.x <= 850
      ? pointerSvg.x
      : null;
  const crosshairY =
    pointerSvg && pointerSvg.x <= 850 ? Math.max(14, Math.min(295, pointerSvg.y)) : null;
  const crosshairPrice = crosshairY !== null ? yToPrice(crosshairY) : null;

  return (
    <section
      aria-label="Primary candlestick chart"
      className="rounded bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border border-light-outline-variant dark:border-dark-outline-variant p-gutter-md flex flex-col gap-gutter-sm relative"
    >
      {/* Active drawing / zoom helper bar when a drawing tool or zoom is active */}
      {(activeTool !== 'crosshair' || zoomRange) && (
        <div className="flex flex-wrap items-center justify-between gap-gutter-sm text-body-sm text-light-outline dark:text-dark-outline pb-gutter-xs border-b border-light-outline-variant/50 dark:border-dark-outline-variant/50">
          <span>
            {activeTool === 'trendline' &&
              (draftStart
                ? 'Click second point to finish trend line'
                : 'Click start point on chart to draw trend line')}
            {activeTool === 'fib' &&
              (draftStart
                ? 'Click second point to anchor Fibonacci retracement'
                : 'Click swing high/low to start Fibonacci retracement')}
            {activeTool === 'brush' && 'Click and drag on the chart to sketch freehand annotation'}
            {activeTool === 'text' && 'Click anywhere on the chart to place a text note'}
            {activeTool === 'measure' &&
              (draftStart
                ? 'Click end point to lock price range measurement'
                : 'Click start point to measure price & bar distance')}
            {activeTool === 'zoom' && 'Drag across candles to zoom in (or double-click to reset)'}
            {activeTool === 'crosshair' && zoomRange && 'Zoomed chart view'}
          </span>
          {zoomRange && (
            <button
              type="button"
              onClick={() => onZoomRange(null)}
              className="font-mono text-mono-sm text-brand-blue hover:underline cursor-pointer"
            >
              Reset Zoom
            </button>
          )}
        </div>
      )}

      <div className="relative w-full h-96 select-none">
        <svg
          ref={svgRef}
          viewBox="0 0 920 340"
          className={`w-full h-full ${cursorClass}`}
          preserveAspectRatio="none"
          role="img"
          aria-label="Interactive stock candlestick chart"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onDoubleClick={() => zoomRange && onZoomRange(null)}
        >
          {/* Horizontal Gridlines */}
          {[40, 100, 160, 220].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="850"
              y2={y}
              className="stroke-light-outline-variant/60 dark:stroke-dark-surface-container-high"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          ))}
          <line
            x1="0"
            y1="280"
            x2="850"
            y2="280"
            className="stroke-light-outline-variant/70 dark:stroke-dark-surface-container-high"
            strokeWidth="1"
          />

          {/* Bollinger Bands (Toggleable) */}
          {showBb && (
            <g>
              {bbAreaPath && (
                <path d={bbAreaPath} fill="#8D90A2" opacity="0.08" />
              )}
              <path
                d={bbUpperPath}
                fill="none"
                stroke="#8D90A2"
                strokeWidth="1"
                strokeDasharray="4 3"
                opacity="0.65"
              />
              <path
                d={bbLowerPath}
                fill="none"
                stroke="#8D90A2"
                strokeWidth="1"
                strokeDasharray="4 3"
                opacity="0.65"
              />
            </g>
          )}

          {/* EMA 20 Overlay */}
          {showEma && (
            <path
              d={emaPath}
              fill="none"
              stroke="#2962FF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Volume Bars */}
          <g>
            {visibleCandles.map((c, i) => {
              const globalIdx = visibleStart + i;
              const x = indexToX(globalIdx);
              const isUp = c.close >= c.open;
              const color = isUp ? '#089981' : '#FF4D5A';
              const volH = Math.max(8, (c.volume / maxVol) * 44);
              const isHovered = hoveredIndex === globalIdx;
              return (
                <rect
                  key={`vol-${globalIdx}`}
                  x={x - candleWidth * 0.44}
                  y={336 - volH}
                  width={candleWidth * 0.88}
                  height={volH}
                  fill={color}
                  opacity={isHovered ? 0.65 : 0.35}
                />
              );
            })}
          </g>

          {/* Candlesticks */}
          <g>
            {visibleCandles.map((c, i) => {
              const globalIdx = visibleStart + i;
              const x = indexToX(globalIdx);
              const openY = priceToY(c.open);
              const closeY = priceToY(c.close);
              const highY = priceToY(c.high);
              const lowY = priceToY(c.low);
              const isUp = c.close >= c.open;
              const color = isUp ? '#089981' : '#FF4D5A';
              const top = Math.min(openY, closeY);
              const height = Math.max(4, Math.abs(closeY - openY));
              const isHovered = hoveredIndex === globalIdx;

              return (
                <g key={`candle-${globalIdx}`}>
                  {isHovered && (
                    <rect
                      x={x - candleWidth * 0.65}
                      y="16"
                      width={candleWidth * 1.3}
                      height="264"
                      fill="#8D90A2"
                      opacity="0.06"
                    />
                  )}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={color}
                    strokeWidth={isHovered ? '2' : '1.5'}
                  />
                  <rect
                    x={x - candleWidth / 2}
                    y={top}
                    width={candleWidth}
                    height={height}
                    rx="1.5"
                    fill={color}
                    opacity={isHovered ? 1 : 0.94}
                  />
                </g>
              );
            })}
          </g>

          {/* Current Price Reference Line */}
          <line
            x1="0"
            y1={lastPriceY}
            x2="850"
            y2={lastPriceY}
            stroke={lastIsUp ? '#089981' : '#FF4D5A'}
            strokeWidth="1"
            strokeDasharray="2 3"
            opacity="0.6"
          />

          {/* Price Alert Horizontal Lines */}
          {alerts.map((alert) => {
            const ay = priceToY(alert.price);
            if (ay < 12 || ay > 292) return null;
            return (
              <g key={alert.id}>
                <line
                  x1="0"
                  y1={ay}
                  x2="850"
                  y2={ay}
                  stroke="#FFB59A"
                  strokeWidth="1.3"
                  strokeDasharray="6 3"
                />
                <rect x="6" y={ay - 16} width="128" height="15" rx="3" fill="#5B1B00" />
                <text x="11" y={ay - 5} fontSize="9.5" fill="#FFB59A" className="font-mono">
                  Alert @ {formatPrice(alert.price, symbol)}
                </text>
              </g>
            );
          })}

          {/* Committed Drawings */}
          {drawings.map((d) => renderDrawing(d, false))}

          {/* Active Drawing Previews */}
          {draftStart &&
            draftCurrent &&
            (activeTool === 'trendline' || activeTool === 'fib' || activeTool === 'measure') &&
            renderDrawing(
              {
                id: 'preview',
                type: activeTool,
                p1: draftStart,
                p2: draftCurrent,
              },
              true
            )}

          {isBrushing &&
            brushPoints.length > 1 &&
            renderDrawing(
              {
                id: 'brush-preview',
                type: 'brush',
                points: brushPoints,
              },
              true
            )}

          {/* Zoom Selection Marquee */}
          {activeTool === 'zoom' &&
            zoomDragStartIdx !== null &&
            zoomDragCurrentIdx !== null && (
              <rect
                x={Math.min(indexToX(zoomDragStartIdx), indexToX(zoomDragCurrentIdx))}
                y="18"
                width={Math.max(
                  8,
                  Math.abs(indexToX(zoomDragCurrentIdx) - indexToX(zoomDragStartIdx))
                )}
                height="262"
                fill="rgba(41, 98, 255, 0.16)"
                stroke="#2962FF"
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />
            )}

          {/* Interactive Crosshair */}
          {crosshairX !== null && crosshairY !== null && (
            <g pointerEvents="none">
              <line
                x1={crosshairX}
                y1="0"
                x2={crosshairX}
                y2="340"
                stroke="#8D90A2"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.7"
              />
              <line
                x1="0"
                y1={crosshairY}
                x2="850"
                y2={crosshairY}
                stroke="#8D90A2"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.7"
              />
              {crosshairPrice !== null && (
                <g transform={`translate(852, ${crosshairY})`}>
                  <rect x="0" y="-10" width="66" height="20" rx="4" fill="#32343E" />
                  <text
                    x="33"
                    y="4"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill="#E1E1EE"
                    className="font-mono"
                  >
                    {formatAxisPrice(crosshairPrice, symbol)}
                  </text>
                </g>
              )}
              {hoveredCandle && (
                <g transform={`translate(${Math.min(765, Math.max(4, crosshairX - 42))}, 318)`}>
                  <rect x="0" y="0" width="84" height="18" rx="3" fill="#282933" />
                  <text
                    x="42"
                    y="12"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#E1E1EE"
                    className="font-mono"
                  >
                    {hoveredCandle.time}
                  </text>
                </g>
              )}
            </g>
          )}

          {/* Right Price Axis Labels */}
          <g className="font-mono" fontSize="11" fill="#8D90A2">
            {axisTicks.map((tick, i) => (
              <text key={i} x="860" y={44 + i * 60}>
                {formatAxisPrice(tick, symbol)}
              </text>
            ))}
          </g>

          {/* Current Price Tag */}
          <g transform={`translate(852, ${lastPriceY})`}>
            <rect
              x="0"
              y="-10"
              width="66"
              height="20"
              rx="4"
              fill={lastIsUp ? '#089981' : '#FF4D5A'}
            />
            <text
              x="33"
              y="4"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#FFFFFF"
              className="font-mono"
            >
              {formatAxisPrice(lastCandle.close, symbol)}
            </text>
          </g>
        </svg>
      </div>

      {/* Time Axis */}
      <div className="flex items-center justify-between pr-16 font-mono text-mono-sm text-light-outline dark:text-dark-outline">
        {visibleTimeLabels.map((label, idx) => (
          <span key={idx}>{label}</span>
        ))}
      </div>
    </section>
  );
};
