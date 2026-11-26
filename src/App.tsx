import { useMemo, useState } from 'react';
import {
  ALL_SYMBOLS,
  DEFAULT_WATCHLIST,
  formatPrice,
  getChartDataset,
} from './data/marketData';
import {
  ChartDrawing,
  ChartPoint,
  DrawingTool,
  PriceAlert,
  PublishedIdea,
  Timeframe,
} from './types/trading';
import { TopToolbar } from './components/TopToolbar';
import { DrawingRail } from './components/DrawingRail';
import { CandlestickChart } from './components/CandlestickChart';
import { RsiPane } from './components/RsiPane';
import { WatchlistPanel } from './components/WatchlistPanel';
import {
  MarketsOverviewModal,
  PriceAlertModal,
  PublishIdeaModal,
  SymbolSearchModal,
  TextNoteModal,
} from './components/Modals';

export default function App() {
  const [activeSymbol, setActiveSymbol] = useState<string>('NVDA');
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [showEma, setShowEma] = useState<boolean>(true);
  const [showBb, setShowBb] = useState<boolean>(false);
  const [activeTool, setActiveTool] = useState<DrawingTool>('crosshair');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [zoomRange, setZoomRange] = useState<[number, number] | null>(null);

  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(DEFAULT_WATCHLIST);
  const [drawingsByKey, setDrawingsByKey] = useState<Record<string, ChartDrawing[]>>({});
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [ideas, setIdeas] = useState<PublishedIdea[]>([]);

  const [openModal, setOpenModal] = useState<
    null | 'search' | 'alert' | 'publish' | 'markets'
  >(null);
  const [pendingTextPoint, setPendingTextPoint] = useState<ChartPoint | null>(null);

  const symbolMeta = useMemo(
    () => ALL_SYMBOLS.find((s) => s.symbol === activeSymbol) ?? ALL_SYMBOLS[0],
    [activeSymbol]
  );

  const dataset = useMemo(
    () => getChartDataset(activeSymbol, timeframe),
    [activeSymbol, timeframe]
  );

  const watchlistItems = useMemo(
    () =>
      watchlistSymbols
        .map((sym) => ALL_SYMBOLS.find((s) => s.symbol === sym))
        .filter((s): s is NonNullable<typeof s> => Boolean(s)),
    [watchlistSymbols]
  );

  const drawingKey = `${activeSymbol}:${timeframe}`;
  const currentDrawings = drawingsByKey[drawingKey] ?? [];
  const symbolAlerts = alerts.filter((a) => a.symbol === activeSymbol);

  const hoveredCandle =
    hoveredIndex !== null && dataset.candles[hoveredIndex]
      ? dataset.candles[hoveredIndex]
      : null;

  const displayO = hoveredCandle ? hoveredCandle.open : symbolMeta.open;
  const displayH = hoveredCandle ? hoveredCandle.high : symbolMeta.high;
  const displayL = hoveredCandle ? hoveredCandle.low : symbolMeta.low;
  const displayC = hoveredCandle ? hoveredCandle.close : symbolMeta.close;
  const displayEma = hoveredCandle ? hoveredCandle.ema20 : dataset.ema20;
  const displayRsi = hoveredCandle ? hoveredCandle.rsi14 : dataset.rsi14;
  const displayIsUp = hoveredCandle ? hoveredCandle.close >= hoveredCandle.open : symbolMeta.isUp;

  const displayVol = hoveredCandle
    ? `${hoveredCandle.volume.toFixed(1)}${symbolMeta.volumeLabel.slice(-1)}`
    : symbolMeta.volumeLabel;

  const handleSelectSymbol = (sym: string) => {
    setActiveSymbol(sym);
    setHoveredIndex(null);
    setZoomRange(null);
  };

  const handleSelectTimeframe = (tf: Timeframe) => {
    setTimeframe(tf);
    setHoveredIndex(null);
    setZoomRange(null);
  };

  const handleAddDrawing = (drawing: ChartDrawing) => {
    setDrawingsByKey((prev) => ({
      ...prev,
      [drawingKey]: [...(prev[drawingKey] ?? []), drawing],
    }));
  };

  const handleUndoDrawing = () => {
    setDrawingsByKey((prev) => {
      const list = prev[drawingKey] ?? [];
      if (list.length === 0) return prev;
      return {
        ...prev,
        [drawingKey]: list.slice(0, -1),
      };
    });
  };

  const handleClearDrawings = () => {
    setDrawingsByKey((prev) => ({
      ...prev,
      [drawingKey]: [],
    }));
  };

  const handleToggleWatchlist = (sym: string) => {
    setWatchlistSymbols((prev) => {
      if (prev.includes(sym)) {
        return prev.length > 1 ? prev.filter((s) => s !== sym) : prev;
      }
      return [...prev, sym];
    });
  };

  const handleCreateAlert = (input: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    setAlerts((prev) => [
      {
        ...input,
        id: `alert-${Date.now()}`,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handlePublishIdea = (input: Omit<PublishedIdea, 'id' | 'createdAt'>) => {
    setIdeas((prev) => [
      {
        ...input,
        id: `idea-${Date.now()}`,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-surface dark:bg-dark-surface text-light-on-surface dark:text-dark-on-surface">
      {/* Supercharts Top Toolbar */}
      <TopToolbar
        symbol={symbolMeta.symbol}
        exchange={symbolMeta.exchange}
        timeframe={timeframe}
        showEma={showEma}
        showBb={showBb}
        alertCount={symbolAlerts.length}
        ideaCount={ideas.length}
        onOpenMarkets={() => setOpenModal('markets')}
        onOpenSymbolSearch={() => setOpenModal('search')}
        onSelectTimeframe={handleSelectTimeframe}
        onToggleEma={() => setShowEma((v) => !v)}
        onToggleBb={() => setShowBb((v) => !v)}
        onOpenAlertModal={() => setOpenModal('alert')}
        onOpenPublishModal={() => setOpenModal('publish')}
      />

      {/* Main 3-Zone Charting Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Drawing Tools Rail */}
        <DrawingRail
          activeTool={activeTool}
          hasDrawings={currentDrawings.length > 0}
          isZoomed={zoomRange !== null}
          onSelectTool={setActiveTool}
          onUndoDrawing={handleUndoDrawing}
          onClearDrawings={handleClearDrawings}
          onResetZoom={() => setZoomRange(null)}
        />

        {/* Center Chart Canvas */}
        <main className="flex-1 flex flex-col bg-light-surface dark:bg-dark-surface p-gutter-md gap-gutter-md min-w-0">
          {/* OHLCV Status Bar */}
          <div className="rounded bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline-variant dark:border-dark-outline-variant px-gutter-md py-gutter-sm flex flex-wrap items-center justify-between gap-gutter-md">
            <div className="flex flex-wrap items-center gap-gutter-md">
              <div className="flex items-center gap-gutter-sm">
                <h1 className="font-headline text-title-lg text-light-on-surface dark:text-dark-on-surface">
                  {symbolMeta.name}
                </h1>
                <span className="font-mono text-mono-sm px-gutter-xs py-gutter-xs rounded-sm bg-light-surface-container-high dark:bg-dark-surface-container-high text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  {timeframe}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-gutter-md font-mono text-mono-sm tabular-nums">
                <span className="text-light-outline dark:text-dark-outline">
                  O{' '}
                  <strong className={displayIsUp ? 'text-bullish' : 'text-bearish'}>
                    {formatPrice(displayO, symbolMeta.symbol)}
                  </strong>
                </span>
                <span className="text-light-outline dark:text-dark-outline">
                  H{' '}
                  <strong className={displayIsUp ? 'text-bullish' : 'text-bearish'}>
                    {formatPrice(displayH, symbolMeta.symbol)}
                  </strong>
                </span>
                <span className="text-light-outline dark:text-dark-outline">
                  L{' '}
                  <strong className={displayIsUp ? 'text-bullish' : 'text-bearish'}>
                    {formatPrice(displayL, symbolMeta.symbol)}
                  </strong>
                </span>
                <span className="text-light-outline dark:text-dark-outline">
                  C{' '}
                  <strong className={displayIsUp ? 'text-bullish' : 'text-bearish'}>
                    {formatPrice(displayC, symbolMeta.symbol)}
                  </strong>
                </span>
                <span className={symbolMeta.isUp ? 'text-bullish' : 'text-bearish'}>
                  {symbolMeta.isUp ? '+' : ''}
                  {formatPrice(symbolMeta.change, symbolMeta.symbol)} ({symbolMeta.isUp ? '+' : ''}
                  {symbolMeta.changePct.toFixed(2)}%)
                </span>
                <span className="text-light-outline dark:text-dark-outline">
                  Vol{' '}
                  <strong className="text-light-on-surface dark:text-dark-on-surface">
                    {displayVol}
                  </strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-gutter-md font-mono text-mono-sm tabular-nums">
              <span className="text-light-primary dark:text-dark-primary">
                EMA(20): <span>{formatPrice(displayEma, symbolMeta.symbol)}</span>
              </span>
              <span className="text-light-outline dark:text-dark-outline">
                RSI(14):{' '}
                <span className="text-light-on-surface dark:text-dark-on-surface">
                  {displayRsi.toFixed(2)}
                </span>
              </span>
            </div>
          </div>

          {/* Primary Candlestick & Volume Chart Container */}
          <CandlestickChart
            symbol={symbolMeta.symbol}
            candles={dataset.candles}
            timeLabels={dataset.timeLabels}
            showEma={showEma}
            showBb={showBb}
            activeTool={activeTool}
            drawings={currentDrawings}
            alerts={symbolAlerts}
            hoveredIndex={hoveredIndex}
            zoomRange={zoomRange}
            onHoverIndex={setHoveredIndex}
            onAddDrawing={handleAddDrawing}
            onRequestTextNote={(pt) => setPendingTextPoint(pt)}
            onZoomRange={setZoomRange}
          />

          {/* Lower Technical Oscillator Pane: RSI (14) */}
          <RsiPane
            candles={dataset.candles}
            hoveredIndex={hoveredIndex}
            latestRsi={dataset.rsi14}
          />
        </main>

        {/* Right Watchlist & Technical Analysis Summary Panel */}
        <WatchlistPanel
          activeSymbol={symbolMeta.symbol}
          timeframe={timeframe}
          watchlistItems={watchlistItems}
          rating={dataset.rating}
          counts={dataset.counts}
          signals={dataset.signals}
          onSelectSymbol={handleSelectSymbol}
          onOpenSearch={() => setOpenModal('search')}
        />
      </div>

      {/* Interactive Modals */}
      {openModal === 'search' && (
        <SymbolSearchModal
          symbols={ALL_SYMBOLS}
          watchlist={watchlistSymbols}
          activeSymbol={symbolMeta.symbol}
          onSelectSymbol={handleSelectSymbol}
          onToggleWatchlist={handleToggleWatchlist}
          onClose={() => setOpenModal(null)}
        />
      )}

      {openModal === 'alert' && (
        <PriceAlertModal
          symbol={symbolMeta.symbol}
          currentPrice={symbolMeta.price}
          alerts={symbolAlerts}
          onCreateAlert={handleCreateAlert}
          onDeleteAlert={handleDeleteAlert}
          onClose={() => setOpenModal(null)}
        />
      )}

      {openModal === 'publish' && (
        <PublishIdeaModal
          symbol={symbolMeta.symbol}
          timeframe={timeframe}
          currentPrice={symbolMeta.price}
          ideas={ideas}
          onPublish={handlePublishIdea}
          onClose={() => setOpenModal(null)}
        />
      )}

      {openModal === 'markets' && (
        <MarketsOverviewModal
          symbols={ALL_SYMBOLS}
          activeSymbol={symbolMeta.symbol}
          onSelectSymbol={handleSelectSymbol}
          onClose={() => setOpenModal(null)}
        />
      )}

      {pendingTextPoint && (
        <TextNoteModal
          onConfirm={(text) => {
            handleAddDrawing({
              id: `text-${Date.now()}`,
              type: 'text',
              point: pendingTextPoint,
              text,
            });
            setPendingTextPoint(null);
          }}
          onClose={() => setPendingTextPoint(null)}
        />
      )}
    </div>
  );
}
