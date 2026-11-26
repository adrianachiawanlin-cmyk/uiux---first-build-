import React from 'react';
import { CandleBar } from '../types/trading';

interface RsiPaneProps {
  candles: CandleBar[];
  hoveredIndex: number | null;
  latestRsi: number;
}

export const RsiPane: React.FC<RsiPaneProps> = ({
  candles,
  hoveredIndex,
  latestRsi,
}) => {
  const displayRsi =
    hoveredIndex !== null && candles[hoveredIndex]
      ? candles[hoveredIndex].rsi14
      : latestRsi;

  const rsiToY = (rsi: number) => {
    // Map RSI 100 -> y=5, 70 -> y=20, 30 -> y=70, 0 -> y=85
    const clamped = Math.max(0, Math.min(100, rsi));
    if (clamped >= 70) {
      return 20 - ((clamped - 70) / 30) * 15;
    }
    if (clamped <= 30) {
      return 70 + ((30 - clamped) / 30) * 15;
    }
    return 20 + ((70 - clamped) / 40) * 50;
  };

  const count = candles.length;
  const xForIdx = (idx: number) => {
    if (count <= 1) return 22;
    const step = 800 / (count - 1);
    return 22 + idx * step;
  };

  const pathD = candles
    .map((c, idx) => `${idx === 0 ? 'M' : 'L'} ${xForIdx(idx).toFixed(1)} ${rsiToY(c.rsi14).toFixed(1)}`)
    .join(' ');

  const hoverX = hoveredIndex !== null ? xForIdx(hoveredIndex) : null;
  const hoverY =
    hoveredIndex !== null && candles[hoveredIndex]
      ? rsiToY(candles[hoveredIndex].rsi14)
      : null;

  return (
    <section
      aria-label="RSI 14 oscillator pane"
      className="rounded bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border border-light-outline-variant dark:border-dark-outline-variant p-gutter-md flex flex-col gap-gutter-xs"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-gutter-sm">
          <span className="font-label text-label-md text-light-on-surface dark:text-dark-on-surface">
            RSI (14) close
          </span>
          <span className="font-mono text-mono-sm text-light-primary dark:text-dark-primary tabular-nums">
            {displayRsi.toFixed(2)}
          </span>
        </div>
        <span className="font-mono text-mono-sm text-light-outline dark:text-dark-outline">
          OB 70 · OS 30
        </span>
      </div>

      <div className="w-full h-24">
        <svg
          viewBox="0 0 920 90"
          className="w-full h-full"
          preserveAspectRatio="none"
          role="img"
          aria-label="Relative Strength Index chart"
        >
          <rect
            x="0"
            y="20"
            width="850"
            height="50"
            className="fill-light-surface-container dark:fill-dark-surface-container-low"
            opacity="0.55"
          />
          <line
            x1="0"
            y1="20"
            x2="850"
            y2="20"
            stroke="#434656"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <line
            x1="0"
            y1="70"
            x2="850"
            y2="70"
            stroke="#434656"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          <path
            d={pathD}
            fill="none"
            stroke="#B6C4FF"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {hoverX !== null && hoverY !== null && (
            <>
              <line
                x1={hoverX}
                y1="0"
                x2={hoverX}
                y2="90"
                stroke="#8D90A2"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle cx={hoverX} cy={hoverY} r="3.5" fill="#2962FF" stroke="#FFFFFF" strokeWidth="1.2" />
            </>
          )}

          <text x="860" y="24" fontSize="11" fill="#8D90A2" className="font-mono">
            70.00
          </text>
          <text x="860" y="74" fontSize="11" fill="#8D90A2" className="font-mono">
            30.00
          </text>
        </svg>
      </div>
    </section>
  );
};
