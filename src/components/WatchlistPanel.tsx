import React from 'react';
import {
  IndicatorSignal,
  RatingLabel,
  SymbolOverview,
  Timeframe,
} from '../types/trading';
import { formatPrice } from '../data/marketData';

interface WatchlistPanelProps {
  activeSymbol: string;
  timeframe: Timeframe;
  watchlistItems: SymbolOverview[];
  rating: RatingLabel;
  counts: [number, number, number];
  signals: IndicatorSignal[];
  onSelectSymbol: (symbol: string) => void;
  onOpenSearch: () => void;
}

export const WatchlistPanel: React.FC<WatchlistPanelProps> = ({
  activeSymbol,
  timeframe,
  watchlistItems,
  rating,
  counts,
  signals,
  onSelectSymbol,
  onOpenSearch,
}) => {
  const [sellCount, neutralCount, buyCount] = counts;
  const total = Math.max(1, sellCount + neutralCount + buyCount);
  const sentimentScore = (buyCount - sellCount) / total; // -1 to +1
  const angleRad = Math.PI * (1 - (sentimentScore + 1) / 2);
  const needleLen = 73;
  const needleX = 100 + needleLen * Math.cos(angleRad);
  const needleY = 95 - needleLen * Math.sin(angleRad);

  const isPositiveRating = rating === 'Strong Buy' || rating === 'Buy';
  const isNegativeRating = rating === 'Strong Sell' || rating === 'Sell';

  const ratingBadgeClass = isPositiveRating
    ? 'font-label text-label-md px-gutter-sm py-gutter-xs rounded-full bg-bullish-container text-on-bullish-container whitespace-nowrap shrink-0'
    : isNegativeRating
    ? 'font-label text-label-md px-gutter-sm py-gutter-xs rounded-full bg-bearish-container text-on-bearish-container whitespace-nowrap shrink-0'
    : 'font-label text-label-md px-gutter-sm py-gutter-xs rounded-full bg-light-surface-container-highest dark:bg-dark-surface-container-highest text-light-on-surface-variant dark:text-dark-on-surface-variant whitespace-nowrap shrink-0';

  return (
    <aside
      aria-label="Watchlist and technical summary"
      className="w-full lg:w-80 bg-light-surface-container-low dark:bg-dark-surface-container-low border-t lg:border-t-0 lg:border-l border-light-outline-variant dark:border-dark-outline-variant p-gutter-md flex flex-col gap-gutter-lg shrink-0"
    >
      {/* Watchlist */}
      <section className="flex flex-col gap-gutter-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-title-md text-light-on-surface dark:text-dark-on-surface">
            Watchlist
          </h2>
          <div className="flex items-center gap-gutter-sm">
            <span className="font-label text-label-md text-light-outline dark:text-dark-outline">
              {watchlistItems.length} symbols
            </span>
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Manage watchlist symbols"
              title="Add or switch symbol"
              className="w-6 h-6 rounded flex items-center justify-center text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container-high dark:hover:bg-dark-surface-container-high transition-colors duration-state-change cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>
        </div>

        <div className="rounded bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border border-light-outline-variant dark:border-dark-outline-variant divide-y divide-light-outline-variant dark:divide-dark-outline-variant overflow-hidden">
          {watchlistItems.map((item) => {
            const isSelected = item.symbol === activeSymbol;
            return (
              <button
                key={item.symbol}
                type="button"
                onClick={() => onSelectSymbol(item.symbol)}
                aria-current={isSelected ? 'true' : undefined}
                className={
                  isSelected
                    ? 'w-full px-gutter-md py-gutter-sm flex items-center justify-between bg-light-surface-container dark:bg-dark-surface-container text-left transition-colors duration-state-change cursor-pointer'
                    : 'w-full px-gutter-md py-gutter-sm flex items-center justify-between hover:bg-light-surface-container dark:hover:bg-dark-surface-container text-left transition-colors duration-state-change cursor-pointer'
                }
              >
                <div>
                  <p className="font-mono text-mono-md text-light-on-surface dark:text-dark-on-surface">
                    {item.symbol}
                  </p>
                  <p className="font-body text-body-sm text-light-outline dark:text-dark-outline">
                    {item.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-mono-md text-light-on-surface dark:text-dark-on-surface tabular-nums">
                    {formatPrice(item.price, item.symbol)}
                  </p>
                  <p
                    className={`font-mono text-mono-sm tabular-nums ${
                      item.isUp ? 'text-bullish' : 'text-bearish'
                    }`}
                  >
                    {item.isUp ? '+' : ''}
                    {item.changePct.toFixed(2)}%
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Technical Analysis Gauge Card */}
      <article className="rounded-md bg-light-surface-container dark:bg-dark-surface-container border border-light-outline-variant dark:border-dark-outline-variant p-gutter-md flex flex-col gap-gutter-md">
        <header className="flex items-center justify-between gap-gutter-sm">
          <div>
            <h3 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface">
              Technicals
            </h3>
            <p className="font-body text-body-sm text-light-outline dark:text-dark-outline">
              Summary · {timeframe}
            </p>
          </div>
          <span className={ratingBadgeClass}>{rating}</span>
        </header>

        {/* Semi-Circular Gauge */}
        <div className="flex flex-col items-center">
          <svg
            viewBox="0 0 200 110"
            className="w-48 h-28"
            aria-label={`Technical analysis sentiment gauge: ${rating}`}
          >
            <path
              d="M 20 95 A 80 80 0 0 1 56 30"
              fill="none"
              stroke="#FF4D5A"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 64 25 A 80 80 0 0 1 136 25"
              fill="none"
              stroke="#8D90A2"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 144 30 A 80 80 0 0 1 180 95"
              fill="none"
              stroke="#089981"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <line
              x1="100"
              y1="95"
              x2={needleX.toFixed(1)}
              y2={needleY.toFixed(1)}
              className="stroke-light-on-surface dark:stroke-dark-on-surface transition-all duration-200"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle
              cx="100"
              cy="95"
              r="5"
              className="fill-light-on-surface dark:fill-dark-on-surface"
            />
          </svg>

          <div className="w-full flex items-center justify-between text-center font-mono text-mono-sm tabular-nums pt-gutter-xs">
            <div>
              <p className="text-bearish">{sellCount}</p>
              <p className="text-light-outline dark:text-dark-outline">Sell</p>
            </div>
            <div>
              <p className="text-light-on-surface dark:text-dark-on-surface">{neutralCount}</p>
              <p className="text-light-outline dark:text-dark-outline">Neutral</p>
            </div>
            <div>
              <p className="text-bullish">{buyCount}</p>
              <p className="text-light-outline dark:text-dark-outline">Buy</p>
            </div>
          </div>
        </div>

        {/* Key Indicator Signals */}
        <div className="divide-y divide-light-outline-variant dark:divide-dark-outline-variant border-t border-light-outline-variant dark:border-dark-outline-variant pt-gutter-sm font-mono text-mono-sm tabular-nums">
          {signals.map((sig) => {
            const sigClass =
              sig.signal === 'Buy'
                ? 'text-bullish'
                : sig.signal === 'Sell'
                ? 'text-bearish'
                : 'text-light-outline dark:text-dark-outline';
            return (
              <div key={sig.name} className="py-gutter-xs flex items-center justify-between">
                <span className="text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  {sig.name}
                </span>
                <span className={sigClass}>
                  {sig.value} · {sig.signal}
                </span>
              </div>
            );
          })}
        </div>
      </article>
    </aside>
  );
};
