import React, { useEffect, useState } from 'react';
import {
  PriceAlert,
  PublishedIdea,
  SymbolOverview,
  Timeframe,
} from '../types/trading';
import { formatPrice } from '../data/marketData';

interface ModalShellProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

const ModalShell: React.FC<ModalShellProps> = ({
  title,
  subtitle,
  onClose,
  children,
  maxWidth = 'max-w-lg',
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} rounded-md bg-light-surface-container-lowest dark:bg-dark-surface-container-low border border-light-outline-variant dark:border-dark-outline-variant shadow-xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-gutter-md py-gutter-sm border-b border-light-outline-variant dark:border-dark-outline-variant flex items-center justify-between gap-4">
          <div>
            <h2 className="font-headline text-title-md text-light-on-surface dark:text-dark-on-surface">
              {title}
            </h2>
            {subtitle && (
              <p className="font-body text-body-sm text-light-outline dark:text-dark-outline">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded flex items-center justify-center text-light-outline dark:text-dark-outline hover:bg-light-surface-container dark:hover:bg-dark-surface-container cursor-pointer"
          >
            <span className="material-symbols-outlined text-title-md">close</span>
          </button>
        </div>
        <div className="p-gutter-md">{children}</div>
      </div>
    </div>
  );
};

interface SymbolSearchModalProps {
  symbols: SymbolOverview[];
  watchlist: string[];
  activeSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  onToggleWatchlist: (symbol: string) => void;
  onClose: () => void;
}

export const SymbolSearchModal: React.FC<SymbolSearchModalProps> = ({
  symbols,
  watchlist,
  activeSymbol,
  onSelectSymbol,
  onToggleWatchlist,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'NASDAQ' | 'CRYPTO' | 'ARCA'>('ALL');

  const filtered = symbols.filter((s) => {
    const matchesFilter = filter === 'ALL' || s.exchange === filter;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      s.symbol.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.sector.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  return (
    <ModalShell
      title="Symbol Search"
      subtitle="Load chart or star symbols to your Watchlist"
      onClose={onClose}
      maxWidth="max-w-xl"
    >
      <div className="flex flex-col gap-gutter-md">
        <div className="flex items-center gap-gutter-sm px-gutter-sm py-2 rounded bg-light-surface-container dark:bg-dark-surface-container border border-light-outline-variant dark:border-dark-outline-variant">
          <span className="material-symbols-outlined text-title-md text-light-outline dark:text-dark-outline">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ticker, company, or sector (e.g. NVDA, Bitcoin)..."
            autoFocus
            className="w-full bg-transparent text-body-md text-light-on-surface dark:text-dark-on-surface placeholder:text-light-outline dark:placeholder:text-dark-outline focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-gutter-xs">
          {(['ALL', 'NASDAQ', 'CRYPTO', 'ARCA'] as const).map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setFilter(ex)}
              className={
                filter === ex
                  ? 'px-gutter-sm py-1 rounded-sm bg-light-surface-container-highest dark:bg-dark-surface-container-highest text-light-on-surface dark:text-dark-on-surface font-mono text-mono-sm cursor-pointer'
                  : 'px-gutter-sm py-1 rounded-sm text-light-outline dark:text-dark-outline hover:bg-light-surface-container dark:hover:bg-dark-surface-container font-mono text-mono-sm cursor-pointer'
              }
            >
              {ex === 'ALL' ? 'All Markets' : ex}
            </button>
          ))}
        </div>

        <div className="max-h-72 overflow-y-auto divide-y divide-light-outline-variant dark:divide-dark-outline-variant border border-light-outline-variant dark:border-dark-outline-variant rounded">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-body-md text-light-outline dark:text-dark-outline">
              No symbols match &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.map((item) => {
              const inWatchlist = watchlist.includes(item.symbol);
              const isSelected = item.symbol === activeSymbol;
              return (
                <div
                  key={item.symbol}
                  className={`flex items-center justify-between px-gutter-md py-gutter-sm ${
                    isSelected
                      ? 'bg-light-surface-container dark:bg-dark-surface-container'
                      : 'hover:bg-light-surface-container/70 dark:hover:bg-dark-surface-container/70'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectSymbol(item.symbol);
                      onClose();
                    }}
                    className="flex-1 flex items-center justify-between text-left cursor-pointer pr-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-mono-md text-light-on-surface dark:text-dark-on-surface">
                          {item.symbol}
                        </span>
                        <span className="font-label text-label-sm text-light-outline dark:text-dark-outline">
                          {item.exchange} · {item.sector}
                        </span>
                      </div>
                      <p className="font-body text-body-sm text-light-outline dark:text-dark-outline">
                        {item.name}
                      </p>
                    </div>
                    <div className="text-right font-mono tabular-nums">
                      <p className="text-mono-md text-light-on-surface dark:text-dark-on-surface">
                        {formatPrice(item.price, item.symbol)}
                      </p>
                      <p
                        className={`text-mono-sm ${
                          item.isUp ? 'text-bullish' : 'text-bearish'
                        }`}
                      >
                        {item.isUp ? '+' : ''}
                        {item.changePct.toFixed(2)}%
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleWatchlist(item.symbol)}
                    aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                    title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                    className="w-8 h-8 rounded flex items-center justify-center hover:bg-light-surface-container-high dark:hover:bg-dark-surface-container-high cursor-pointer"
                  >
                    <span
                      className={`material-symbols-outlined text-title-md ${
                        inWatchlist
                          ? 'text-brand-blue'
                          : 'text-light-outline dark:text-dark-outline'
                      }`}
                    >
                      {inWatchlist ? 'star' : 'star_border'}
                    </span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </ModalShell>
  );
};

interface PriceAlertModalProps {
  symbol: string;
  currentPrice: number;
  alerts: PriceAlert[];
  onCreateAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
  onDeleteAlert: (id: string) => void;
  onClose: () => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  symbol,
  currentPrice,
  alerts,
  onCreateAlert,
  onDeleteAlert,
  onClose,
}) => {
  const [condition, setCondition] = useState<'Crossing Up' | 'Crossing Down'>('Crossing Up');
  const [priceStr, setPriceStr] = useState((currentPrice * 1.015).toFixed(2));
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(priceStr);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    onCreateAlert({
      symbol,
      condition,
      price: parsed,
      note: note.trim(),
    });
    setNote('');
  };

  return (
    <ModalShell
      title={`Price Alert · ${symbol}`}
      subtitle={`Current price: ${formatPrice(currentPrice, symbol)}`}
      onClose={onClose}
    >
      <div className="flex flex-col gap-gutter-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-gutter-sm">
          <div className="grid grid-cols-2 gap-gutter-sm">
            <div>
              <label className="block font-label text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant mb-1">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) =>
                  setCondition(e.target.value as 'Crossing Up' | 'Crossing Down')
                }
                className="w-full px-3 py-2 rounded bg-light-surface-container dark:bg-dark-surface-container border border-light-outline-variant dark:border-dark-outline-variant text-body-md text-light-on-surface dark:text-dark-on-surface"
              >
                <option value="Crossing Up">Crossing Up</option>
                <option value="Crossing Down">Crossing Down</option>
              </select>
            </div>

            <div>
              <label className="block font-label text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant mb-1">
                Target Price
              </label>
              <input
                type="number"
                step="any"
                value={priceStr}
                onChange={(e) => setPriceStr(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-light-surface-container dark:bg-dark-surface-container border border-light-outline-variant dark:border-dark-outline-variant font-mono text-body-md text-light-on-surface dark:text-dark-on-surface"
              />
            </div>
          </div>

          <div>
            <label className="block font-label text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant mb-1">
              Alert Message (optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={`e.g. ${symbol} breakout level`}
              className="w-full px-3 py-2 rounded bg-light-surface-container dark:bg-dark-surface-container border border-light-outline-variant dark:border-dark-outline-variant text-body-md text-light-on-surface dark:text-dark-on-surface"
            />
          </div>

          <div className="flex justify-end gap-gutter-sm pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-label-lg text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container dark:hover:bg-dark-surface-container cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-brand-blue text-on-brand-blue font-label text-label-lg hover:opacity-90 cursor-pointer"
            >
              Create Alert
            </button>
          </div>
        </form>

        <div className="border-t border-light-outline-variant dark:border-dark-outline-variant pt-gutter-sm">
          <h3 className="font-label text-label-md text-light-outline dark:text-dark-outline mb-2">
            Active Alerts for {symbol} ({alerts.length})
          </h3>
          {alerts.length === 0 ? (
            <p className="text-body-sm text-light-outline dark:text-dark-outline">
              No active price alerts on {symbol}.
            </p>
          ) : (
            <div className="divide-y divide-light-outline-variant dark:divide-dark-outline-variant border border-light-outline-variant dark:border-dark-outline-variant rounded max-h-40 overflow-y-auto">
              {alerts.map((al) => (
                <div
                  key={al.id}
                  className="px-3 py-2 flex items-center justify-between gap-2 text-body-sm"
                >
                  <div>
                    <span className="font-mono text-light-on-surface dark:text-dark-on-surface">
                      {al.condition} {formatPrice(al.price, al.symbol)}
                    </span>
                    {al.note && (
                      <p className="text-light-outline dark:text-dark-outline">{al.note}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteAlert(al.id)}
                    aria-label="Delete alert"
                    className="text-bearish hover:opacity-80 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-title-md">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  );
};

interface PublishIdeaModalProps {
  symbol: string;
  timeframe: Timeframe;
  currentPrice: number;
  ideas: PublishedIdea[];
  onPublish: (idea: Omit<PublishedIdea, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

export const PublishIdeaModal: React.FC<PublishIdeaModalProps> = ({
  symbol,
  timeframe,
  currentPrice,
  ideas,
  onPublish,
  onClose,
}) => {
  const [title, setTitle] = useState(`${symbol} ${timeframe} Technical Setup`);
  const [bias, setBias] = useState<'Long' | 'Neutral' | 'Short'>('Long');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onPublish({
      symbol,
      timeframe,
      title: title.trim(),
      bias,
      notes: notes.trim() || `Monitoring ${symbol} at ${formatPrice(currentPrice, symbol)} on ${timeframe}.`,
      priceAtPublish: currentPrice,
    });
    setNotes('');
  };

  return (
    <ModalShell
      title="Publish Chart Idea"
      subtitle={`${symbol} · ${timeframe} · ${formatPrice(currentPrice, symbol)}`}
      onClose={onClose}
    >
      <div className="flex flex-col gap-gutter-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-gutter-sm">
          <div>
            <label className="block font-label text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant mb-1">
              Idea Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-light-surface-container dark:bg-dark-surface-container border border-light-outline-variant dark:border-dark-outline-variant text-body-md text-light-on-surface dark:text-dark-on-surface"
            />
          </div>

          <div>
            <label className="block font-label text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant mb-1">
              Directional Bias
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Long', 'Neutral', 'Short'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setBias(opt)}
                  className={
                    bias === opt
                      ? opt === 'Long'
                        ? 'py-1.5 rounded bg-bullish-container text-on-bullish-container font-label text-label-md cursor-pointer'
                        : opt === 'Short'
                        ? 'py-1.5 rounded bg-bearish-container text-on-bearish-container font-label text-label-md cursor-pointer'
                        : 'py-1.5 rounded bg-light-surface-container-highest dark:bg-dark-surface-container-highest text-light-on-surface dark:text-dark-on-surface font-label text-label-md cursor-pointer'
                      : 'py-1.5 rounded bg-light-surface-container dark:bg-dark-surface-container text-light-outline dark:text-dark-outline font-label text-label-md cursor-pointer'
                  }
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-label text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant mb-1">
              Analysis Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe key support/resistance, RSI divergence, or EMA trend..."
              className="w-full px-3 py-2 rounded bg-light-surface-container dark:bg-dark-surface-container border border-light-outline-variant dark:border-dark-outline-variant text-body-md text-light-on-surface dark:text-dark-on-surface"
            />
          </div>

          <div className="flex justify-end gap-gutter-sm pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-label-lg text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container dark:hover:bg-dark-surface-container cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-brand-blue text-on-brand-blue font-label text-label-lg hover:opacity-90 cursor-pointer"
            >
              Publish Idea
            </button>
          </div>
        </form>

        {ideas.length > 0 && (
          <div className="border-t border-light-outline-variant dark:border-dark-outline-variant pt-gutter-sm">
            <h3 className="font-label text-label-md text-light-outline dark:text-dark-outline mb-2">
              Published Ideas ({ideas.length})
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="p-2.5 rounded bg-light-surface-container dark:bg-dark-surface-container border border-light-outline-variant dark:border-dark-outline-variant"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-title text-body-md font-semibold text-light-on-surface dark:text-dark-on-surface">
                      {idea.title}
                    </span>
                    <span
                      className={`font-mono text-mono-sm ${
                        idea.bias === 'Long'
                          ? 'text-bullish'
                          : idea.bias === 'Short'
                          ? 'text-bearish'
                          : 'text-light-outline dark:text-dark-outline'
                      }`}
                    >
                      {idea.bias}
                    </span>
                  </div>
                  <p className="text-body-sm text-light-outline dark:text-dark-outline mt-1">
                    {idea.notes}
                  </p>
                  <p className="font-mono text-[11px] text-light-outline dark:text-dark-outline mt-1">
                    {idea.symbol} · {idea.timeframe} · {formatPrice(idea.priceAtPublish, idea.symbol)} · {idea.createdAt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
};

interface MarketsOverviewModalProps {
  symbols: SymbolOverview[];
  activeSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  onClose: () => void;
}

export const MarketsOverviewModal: React.FC<MarketsOverviewModalProps> = ({
  symbols,
  activeSymbol,
  onSelectSymbol,
  onClose,
}) => {
  return (
    <ModalShell
      title="Track All Markets"
      subtitle="Select any instrument to open in Supercharts"
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      <div className="overflow-x-auto border border-light-outline-variant dark:border-dark-outline-variant rounded">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container dark:bg-dark-surface-container font-label text-label-md text-light-outline dark:text-dark-outline">
              <th className="py-2 px-3">Symbol</th>
              <th className="py-2 px-3 text-right">Last</th>
              <th className="py-2 px-3 text-right">Chg %</th>
              <th className="py-2 px-3 text-right">Volume</th>
              <th className="py-2 px-3 text-right">RSI (14)</th>
              <th className="py-2 px-3 text-right">Technicals</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-outline-variant dark:divide-dark-outline-variant font-mono text-mono-sm tabular-nums">
            {symbols.map((s) => (
              <tr
                key={s.symbol}
                onClick={() => {
                  onSelectSymbol(s.symbol);
                  onClose();
                }}
                className={`cursor-pointer transition-colors duration-state-change ${
                  s.symbol === activeSymbol
                    ? 'bg-light-surface-container dark:bg-dark-surface-container'
                    : 'hover:bg-light-surface-container/60 dark:hover:bg-dark-surface-container/60'
                }`}
              >
                <td className="py-2.5 px-3">
                  <div className="font-bold text-light-on-surface dark:text-dark-on-surface">
                    {s.symbol}
                  </div>
                  <div className="font-body text-body-sm text-light-outline dark:text-dark-outline">
                    {s.name} · {s.exchange}
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right text-light-on-surface dark:text-dark-on-surface">
                  {formatPrice(s.price, s.symbol)}
                </td>
                <td
                  className={`py-2.5 px-3 text-right ${
                    s.isUp ? 'text-bullish' : 'text-bearish'
                  }`}
                >
                  {s.isUp ? '+' : ''}
                  {s.changePct.toFixed(2)}%
                </td>
                <td className="py-2.5 px-3 text-right text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  {s.volumeLabel}
                </td>
                <td className="py-2.5 px-3 text-right text-light-primary dark:text-dark-primary">
                  {s.rsi14.toFixed(2)}
                </td>
                <td
                  className={`py-2.5 px-3 text-right font-label ${
                    s.rating.includes('Buy')
                      ? 'text-bullish'
                      : s.rating.includes('Sell')
                      ? 'text-bearish'
                      : 'text-light-outline dark:text-dark-outline'
                  }`}
                >
                  {s.rating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModalShell>
  );
};

interface TextNoteModalProps {
  onConfirm: (text: string) => void;
  onClose: () => void;
}

export const TextNoteModal: React.FC<TextNoteModalProps> = ({
  onConfirm,
  onClose,
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onConfirm(text.trim());
  };

  return (
    <ModalShell
      title="Add Chart Annotation"
      subtitle="Place a text callout at the selected price level"
      onClose={onClose}
      maxWidth="max-w-sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-gutter-sm">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Key support retest"
          maxLength={24}
          autoFocus
          required
          className="w-full px-3 py-2 rounded bg-light-surface-container dark:bg-dark-surface-container border border-light-outline-variant dark:border-dark-outline-variant text-body-md text-light-on-surface dark:text-dark-on-surface"
        />
        <div className="flex justify-end gap-gutter-sm pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-full text-label-md text-light-outline dark:text-dark-outline hover:bg-light-surface-container dark:hover:bg-dark-surface-container cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-full bg-brand-blue text-on-brand-blue font-label text-label-md hover:opacity-90 cursor-pointer"
          >
            Place Note
          </button>
        </div>
      </form>
    </ModalShell>
  );
};
