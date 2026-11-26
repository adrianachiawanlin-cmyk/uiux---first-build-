import React from 'react';
import { Timeframe } from '../types/trading';

interface TopToolbarProps {
  symbol: string;
  exchange: string;
  timeframe: Timeframe;
  showEma: boolean;
  showBb: boolean;
  alertCount: number;
  ideaCount: number;
  onOpenMarkets: () => void;
  onOpenSymbolSearch: () => void;
  onSelectTimeframe: (tf: Timeframe) => void;
  onToggleEma: () => void;
  onToggleBb: () => void;
  onOpenAlertModal: () => void;
  onOpenPublishModal: () => void;
}

const TIMEFRAMES: Timeframe[] = ['15m', '1H', '4H', '1D', '1W'];

export const TopToolbar: React.FC<TopToolbarProps> = ({
  symbol,
  exchange,
  timeframe,
  showEma,
  showBb,
  alertCount,
  ideaCount,
  onOpenMarkets,
  onOpenSymbolSearch,
  onSelectTimeframe,
  onToggleEma,
  onToggleBb,
  onOpenAlertModal,
  onOpenPublishModal,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border-b border-light-outline-variant dark:border-dark-outline-variant">
      <div className="px-gutter-md h-14 flex items-center justify-between gap-gutter-md">
        {/* Left: Brand + Symbol + Timeframes + Indicators */}
        <div className="flex items-center gap-gutter-md overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={onOpenMarkets}
            title="Track All Markets Overview"
            aria-label="Track All Markets Overview"
            className="flex items-center gap-gutter-xs text-light-on-surface dark:text-dark-on-surface hover:opacity-80 transition-opacity duration-state-change shrink-0 cursor-pointer"
          >
            <svg width="24" height="18" viewBox="0 0 36 28" fill="none" aria-hidden="true">
              <path d="M14 6H2V12H8V22H14V6Z" fill="currentColor" />
              <path d="M22 22L28 6H34L28 22H22Z" fill="currentColor" />
              <circle cx="19" cy="9" r="3" fill="#2962FF" />
            </svg>
          </button>

          <div className="h-5 w-px bg-light-outline-variant dark:bg-dark-outline-variant shrink-0" />

          {/* Active Symbol Selector */}
          <button
            type="button"
            onClick={onOpenSymbolSearch}
            aria-label={`Search symbol, current ${symbol}`}
            className="flex items-center gap-gutter-xs px-gutter-sm py-gutter-xs rounded bg-light-surface-container dark:bg-dark-surface-container border border-light-outline-variant dark:border-dark-outline-variant hover:border-brand-blue transition-colors duration-state-change shrink-0 cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-title-md text-light-outline dark:text-dark-outline"
              aria-hidden="true"
            >
              search
            </span>
            <span className="font-mono text-mono-md text-light-on-surface dark:text-dark-on-surface whitespace-nowrap">
              {symbol}
            </span>
            <span className="font-label text-label-sm text-light-outline dark:text-dark-outline whitespace-nowrap">
              {exchange}
            </span>
          </button>

          <div className="h-5 w-px bg-light-outline-variant dark:bg-dark-outline-variant shrink-0" />

          {/* Timeframes */}
          <div className="flex items-center gap-gutter-xs shrink-0" role="group" aria-label="Chart timeframe">
            {TIMEFRAMES.map((tf) => {
              const active = tf === timeframe;
              return (
                <button
                  key={tf}
                  type="button"
                  onClick={() => onSelectTimeframe(tf)}
                  aria-pressed={active}
                  className={
                    active
                      ? 'px-gutter-sm py-gutter-xs rounded-sm bg-light-surface-container-highest dark:bg-dark-surface-container-highest text-light-on-surface dark:text-dark-on-surface font-mono text-mono-sm whitespace-nowrap shrink-0 cursor-pointer'
                      : 'px-gutter-sm py-gutter-xs rounded-sm font-mono text-mono-sm text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container dark:hover:bg-dark-surface-container whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-state-change'
                  }
                >
                  {tf}
                </button>
              );
            })}
          </div>

          <div className="hidden md:block h-5 w-px bg-light-outline-variant dark:bg-dark-outline-variant shrink-0" />

          {/* Indicator Toggles */}
          <div className="hidden md:flex items-center gap-gutter-xs shrink-0">
            <button
              type="button"
              onClick={onToggleEma}
              aria-pressed={showEma}
              className={
                showEma
                  ? 'inline-flex items-center gap-gutter-xs px-gutter-sm py-gutter-xs rounded-sm bg-light-surface-container-highest dark:bg-dark-surface-container-highest text-light-on-surface dark:text-dark-on-surface font-label text-label-md whitespace-nowrap shrink-0 cursor-pointer'
                  : 'inline-flex items-center gap-gutter-xs px-gutter-sm py-gutter-xs rounded-sm text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container dark:hover:bg-dark-surface-container font-label text-label-md whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-state-change'
              }
            >
              <span
                className={`material-symbols-outlined text-title-md ${showEma ? 'text-brand-blue' : ''}`}
                aria-hidden="true"
              >
                stacked_line_chart
              </span>
              <span>EMA 20</span>
            </button>

            <button
              type="button"
              onClick={onToggleBb}
              aria-pressed={showBb}
              className={
                showBb
                  ? 'inline-flex items-center gap-gutter-xs px-gutter-sm py-gutter-xs rounded-sm bg-light-surface-container-highest dark:bg-dark-surface-container-highest text-light-on-surface dark:text-dark-on-surface font-label text-label-md whitespace-nowrap shrink-0 cursor-pointer'
                  : 'inline-flex items-center gap-gutter-xs px-gutter-sm py-gutter-xs rounded-sm text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container dark:hover:bg-dark-surface-container font-label text-label-md whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-state-change'
              }
            >
              <span
                className={`material-symbols-outlined text-title-md ${showBb ? 'text-brand-blue' : ''}`}
                aria-hidden="true"
              >
                ssid_chart
              </span>
              <span>Bollinger</span>
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-gutter-sm shrink-0">
          <button
            type="button"
            onClick={onOpenAlertModal}
            aria-label="Create price alert"
            title="Price Alerts"
            className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-light-surface-container dark:bg-dark-surface-container text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container-high dark:hover:bg-dark-surface-container-high transition-colors duration-state-change ease-state-change cursor-pointer"
          >
            <span className="material-symbols-outlined text-title-md">add_alert</span>
            {alertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-brand-blue text-on-brand-blue font-mono text-[10px] leading-4 text-center">
                {alertCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenPublishModal}
            className="inline-flex items-center justify-center gap-1.5 px-gutter-md py-gutter-xs rounded-full bg-brand-blue text-on-brand-blue font-label text-label-lg hover:opacity-90 transition-opacity duration-state-change ease-state-change whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Publish</span>
            {ideaCount > 0 && (
              <span className="font-mono text-[11px] opacity-85">({ideaCount})</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
