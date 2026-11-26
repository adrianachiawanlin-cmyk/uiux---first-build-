import {
  CandleBar,
  ChartDataset,
  IndicatorSignal,
  RatingLabel,
  SignalDirection,
  SymbolOverview,
  Timeframe,
} from '../types/trading';

interface SeedSymbol {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  price: number;
  change: number;
  changePct: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volumeLabel: string;
  ema20: number;
  sma50: number;
  macd: number;
  rsi14: number;
  rating: RatingLabel;
  counts: [number, number, number];
  axisTop: number;
  axisBottom: number;
  // [openY, closeY, lowY, highY] on the 40..280 grid
  rawCandles: [number, number, number, number][];
}

const SEED_SYMBOLS: SeedSymbol[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    exchange: 'NASDAQ',
    sector: 'Semiconductors',
    price: 141.95,
    change: 3.92,
    changePct: 2.84,
    open: 139.40,
    high: 142.85,
    low: 138.90,
    close: 141.95,
    volumeLabel: '48.2M',
    ema20: 136.48,
    sma50: 129.15,
    macd: 2.84,
    rsi14: 64.20,
    rating: 'Strong Buy',
    counts: [2, 7, 17],
    axisTop: 145.0,
    axisBottom: 125.0,
    rawCandles: [
      [235, 218, 242, 212], [218, 224, 230, 210], [224, 205, 228, 198],
      [205, 192, 212, 188], [192, 202, 208, 185], [202, 184, 206, 178],
      [184, 168, 190, 162], [168, 176, 184, 160], [176, 154, 180, 148],
      [154, 142, 160, 136], [142, 150, 158, 135], [150, 128, 154, 122],
      [128, 118, 136, 112], [118, 126, 132, 110], [126, 108, 130, 102],
      [108, 96, 114, 90], [96, 104, 112, 88], [104, 88, 108, 82],
      [88, 76, 94, 70], [76, 82, 90, 68], [82, 72, 88, 64],
    ],
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc',
    exchange: 'NASDAQ',
    sector: 'Consumer Tech',
    price: 232.87,
    change: 2.19,
    changePct: 0.95,
    open: 230.90,
    high: 233.40,
    low: 229.85,
    close: 232.87,
    volumeLabel: '39.4M',
    ema20: 228.10,
    sma50: 223.40,
    macd: 1.42,
    rsi14: 58.90,
    rating: 'Buy',
    counts: [4, 8, 14],
    axisTop: 236.0,
    axisBottom: 220.0,
    rawCandles: [
      [210, 198, 216, 192], [198, 204, 210, 190], [204, 188, 208, 182],
      [188, 180, 194, 174], [180, 186, 192, 175], [186, 170, 190, 164],
      [170, 158, 176, 152], [158, 164, 170, 150], [164, 148, 168, 142],
      [148, 140, 154, 134], [140, 146, 152, 135], [146, 132, 150, 126],
      [132, 122, 138, 116], [122, 128, 134, 118], [128, 114, 132, 108],
      [114, 106, 120, 100], [106, 112, 118, 98], [112, 98, 116, 92],
      [98, 90, 104, 84], [90, 94, 100, 82], [94, 84, 98, 78],
    ],
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc',
    exchange: 'NASDAQ',
    sector: 'Automotive & AI',
    price: 338.59,
    change: -3.84,
    changePct: -1.12,
    open: 342.10,
    high: 344.00,
    low: 335.20,
    close: 338.59,
    volumeLabel: '62.1M',
    ema20: 341.20,
    sma50: 345.80,
    macd: -1.18,
    rsi14: 46.15,
    rating: 'Neutral',
    counts: [9, 10, 7],
    axisTop: 355.0,
    axisBottom: 327.0,
    rawCandles: [
      [92, 104, 110, 86], [104, 96, 112, 90], [96, 114, 120, 92],
      [114, 126, 132, 108], [126, 118, 134, 112], [118, 136, 142, 114],
      [136, 148, 154, 130], [148, 140, 156, 134], [140, 158, 164, 136],
      [158, 166, 174, 152], [166, 154, 172, 148], [154, 172, 178, 150],
      [172, 184, 190, 168], [184, 176, 192, 170], [176, 192, 198, 172],
      [192, 204, 210, 188], [204, 196, 212, 190], [196, 210, 216, 192],
      [210, 222, 228, 206], [222, 214, 230, 208], [214, 226, 234, 210],
    ],
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft',
    exchange: 'NASDAQ',
    sector: 'Cloud & Enterprise',
    price: 422.90,
    change: 2.85,
    changePct: 0.68,
    open: 420.15,
    high: 424.10,
    low: 418.80,
    close: 422.90,
    volumeLabel: '21.8M',
    ema20: 417.50,
    sma50: 412.10,
    macd: 1.95,
    rsi14: 57.40,
    rating: 'Buy',
    counts: [3, 9, 14],
    axisTop: 430.0,
    axisBottom: 410.0,
    rawCandles: [
      [224, 214, 230, 208], [214, 218, 224, 206], [218, 204, 222, 198],
      [204, 196, 210, 190], [196, 202, 208, 190], [202, 188, 206, 182],
      [188, 178, 194, 172], [178, 184, 190, 170], [184, 168, 188, 162],
      [168, 158, 174, 152], [158, 164, 170, 150], [164, 150, 168, 144],
      [150, 140, 156, 134], [140, 146, 152, 132], [146, 132, 150, 126],
      [132, 122, 138, 116], [122, 128, 134, 114], [128, 114, 132, 108],
      [114, 104, 120, 98], [104, 110, 116, 96], [110, 98, 114, 92],
    ],
  },
  {
    symbol: 'AMD',
    name: 'AMD Inc',
    exchange: 'NASDAQ',
    sector: 'Semiconductors',
    price: 144.20,
    change: 2.46,
    changePct: 1.74,
    open: 141.80,
    high: 145.10,
    low: 140.95,
    close: 144.20,
    volumeLabel: '44.7M',
    ema20: 139.80,
    sma50: 134.90,
    macd: 2.15,
    rsi14: 61.30,
    rating: 'Strong Buy',
    counts: [2, 8, 16],
    axisTop: 148.0,
    axisBottom: 132.0,
    rawCandles: [
      [230, 214, 236, 208], [214, 222, 228, 206], [222, 202, 226, 196],
      [202, 190, 208, 184], [190, 198, 204, 182], [198, 180, 202, 174],
      [180, 166, 186, 160], [166, 174, 180, 158], [174, 154, 178, 148],
      [154, 142, 160, 136], [142, 148, 156, 134], [148, 130, 152, 124],
      [130, 118, 136, 112], [118, 126, 132, 110], [126, 110, 130, 104],
      [110, 98, 116, 92], [98, 106, 114, 90], [106, 90, 110, 84],
      [90, 78, 96, 72], [78, 86, 92, 70], [86, 74, 90, 68],
    ],
  },
  {
    symbol: 'BTCUSD',
    name: 'Bitcoin',
    exchange: 'CRYPTO',
    sector: 'Digital Assets',
    price: 96420.00,
    change: 2918.00,
    changePct: 3.12,
    open: 93502.00,
    high: 97150.00,
    low: 93120.00,
    close: 96420.00,
    volumeLabel: '1.84B',
    ema20: 91840.00,
    sma50: 87650.00,
    macd: 1840.20,
    rsi14: 68.90,
    rating: 'Strong Buy',
    counts: [1, 6, 19],
    axisTop: 98000,
    axisBottom: 86000,
    rawCandles: [
      [242, 224, 248, 218], [224, 232, 238, 216], [232, 210, 236, 204],
      [210, 194, 216, 188], [194, 202, 208, 186], [202, 182, 206, 176],
      [182, 164, 188, 158], [164, 172, 178, 156], [172, 148, 176, 142],
      [148, 134, 154, 128], [134, 142, 150, 126], [142, 120, 146, 114],
      [120, 108, 126, 102], [108, 116, 122, 100], [116, 96, 120, 90],
      [96, 82, 102, 76], [82, 90, 98, 74], [90, 74, 94, 68],
      [74, 62, 80, 56], [62, 70, 76, 54], [70, 54, 74, 48],
    ],
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc',
    exchange: 'NASDAQ',
    sector: 'Internet & AI',
    price: 178.45,
    change: 1.92,
    changePct: 1.09,
    open: 176.60,
    high: 179.20,
    low: 175.80,
    close: 178.45,
    volumeLabel: '24.6M',
    ema20: 174.90,
    sma50: 171.20,
    macd: 1.14,
    rsi14: 59.40,
    rating: 'Buy',
    counts: [3, 9, 14],
    axisTop: 182.0,
    axisBottom: 166.0,
    rawCandles: [
      [218, 206, 224, 200], [206, 212, 218, 198], [212, 196, 216, 190],
      [196, 188, 202, 182], [188, 194, 200, 182], [194, 178, 198, 172],
      [178, 168, 184, 162], [168, 174, 180, 160], [174, 158, 178, 152],
      [158, 148, 164, 142], [148, 154, 160, 142], [154, 140, 158, 134],
      [140, 130, 146, 124], [130, 136, 142, 124], [136, 122, 140, 116],
      [122, 112, 128, 106], [112, 118, 124, 104], [118, 104, 122, 98],
      [104, 96, 110, 90], [96, 102, 108, 88], [102, 90, 106, 84],
    ],
  },
  {
    symbol: 'META',
    name: 'Meta Platforms',
    exchange: 'NASDAQ',
    sector: 'Social & AI',
    price: 572.30,
    change: -4.15,
    changePct: -0.72,
    open: 576.10,
    high: 578.40,
    low: 569.90,
    close: 572.30,
    volumeLabel: '14.3M',
    ema20: 574.10,
    sma50: 568.40,
    macd: -0.84,
    rsi14: 48.60,
    rating: 'Neutral',
    counts: [8, 11, 7],
    axisTop: 590.0,
    axisBottom: 558.0,
    rawCandles: [
      [112, 122, 128, 106], [122, 116, 128, 110], [116, 132, 138, 112],
      [132, 144, 150, 126], [144, 136, 152, 130], [136, 152, 158, 132],
      [152, 164, 170, 146], [164, 156, 172, 150], [156, 172, 178, 152],
      [172, 180, 188, 166], [180, 168, 186, 162], [168, 184, 190, 164],
      [184, 194, 200, 178], [194, 186, 202, 180], [186, 198, 204, 182],
      [198, 208, 214, 192], [208, 200, 216, 194], [200, 212, 218, 196],
      [212, 220, 226, 206], [220, 212, 228, 206], [212, 218, 224, 204],
    ],
  },
  {
    symbol: 'ETHUSD',
    name: 'Ethereum',
    exchange: 'CRYPTO',
    sector: 'Digital Assets',
    price: 3412.80,
    change: 118.40,
    changePct: 3.59,
    open: 3294.40,
    high: 3448.00,
    low: 3280.00,
    close: 3412.80,
    volumeLabel: '920M',
    ema20: 3260.50,
    sma50: 3110.00,
    macd: 64.50,
    rsi14: 66.80,
    rating: 'Strong Buy',
    counts: [2, 5, 19],
    axisTop: 3520,
    axisBottom: 3080,
    rawCandles: [
      [238, 220, 244, 214], [220, 228, 234, 212], [228, 208, 232, 202],
      [208, 192, 214, 186], [192, 200, 206, 184], [200, 180, 204, 174],
      [180, 162, 186, 156], [162, 170, 176, 154], [170, 146, 174, 140],
      [146, 132, 152, 126], [132, 140, 148, 124], [140, 118, 144, 112],
      [118, 106, 124, 100], [106, 114, 120, 98], [114, 94, 118, 88],
      [94, 80, 100, 74], [80, 88, 96, 72], [88, 72, 92, 66],
      [72, 60, 78, 54], [60, 68, 74, 52], [68, 56, 72, 50],
    ],
  },
  {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    exchange: 'ARCA',
    sector: 'Index ETF',
    price: 598.42,
    change: 3.12,
    changePct: 0.52,
    open: 595.40,
    high: 599.20,
    low: 594.80,
    close: 598.42,
    volumeLabel: '52.1M',
    ema20: 594.20,
    sma50: 588.90,
    macd: 2.04,
    rsi14: 60.10,
    rating: 'Buy',
    counts: [3, 8, 15],
    axisTop: 604.0,
    axisBottom: 584.0,
    rawCandles: [
      [216, 204, 222, 198], [204, 210, 216, 196], [210, 194, 214, 188],
      [194, 186, 200, 180], [186, 192, 198, 180], [192, 178, 196, 172],
      [178, 168, 184, 162], [168, 174, 180, 160], [174, 160, 178, 154],
      [160, 150, 166, 144], [150, 156, 162, 144], [156, 142, 160, 136],
      [142, 132, 148, 126], [132, 138, 144, 126], [138, 124, 142, 118],
      [124, 114, 130, 108], [114, 120, 126, 106], [120, 106, 124, 100],
      [106, 98, 112, 92], [98, 104, 110, 90], [104, 92, 108, 86],
    ],
  },
];

export const ALL_SYMBOLS: SymbolOverview[] = SEED_SYMBOLS.map((s) => ({
  symbol: s.symbol,
  name: s.name,
  exchange: s.exchange,
  sector: s.sector,
  price: s.price,
  change: s.change,
  changePct: s.changePct,
  isUp: s.change >= 0,
  open: s.open,
  high: s.high,
  low: s.low,
  close: s.close,
  volumeLabel: s.volumeLabel,
  ema20: s.ema20,
  sma50: s.sma50,
  macd: s.macd,
  rsi14: s.rsi14,
  rating: s.rating,
  counts: s.counts,
}));

export const DEFAULT_WATCHLIST = ['NVDA', 'AAPL', 'TSLA', 'MSFT', 'AMD', 'BTCUSD'];

const TIME_AXIS_BY_TF: Record<Timeframe, string[]> = {
  '15m': ['10:30', '11:45', '13:00', '14:15', '15:45'],
  '1H': ['Nov 21', 'Nov 22', 'Nov 23', 'Nov 24', 'Nov 25'],
  '4H': ['Nov 11', 'Nov 14', 'Nov 18', 'Nov 21', 'Nov 25'],
  '1D': ['Oct 28', 'Nov 04', 'Nov 11', 'Nov 18', 'Nov 25'],
  '1W': ['Jul 08', 'Aug 12', 'Sep 16', 'Oct 21', 'Nov 25'],
};

const BAR_DATES_BY_TF: Record<Timeframe, string[]> = {
  '15m': [
    '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00',
    '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45',
    '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:45',
  ],
  '1H': [
    'Nov 21 10:00', 'Nov 21 12:00', 'Nov 21 14:00', 'Nov 21 16:00',
    'Nov 22 09:30', 'Nov 22 11:30', 'Nov 22 13:30', 'Nov 22 15:30',
    'Nov 23 10:00', 'Nov 23 12:00', 'Nov 23 14:00', 'Nov 23 16:00',
    'Nov 24 09:30', 'Nov 24 11:30', 'Nov 24 13:30', 'Nov 24 15:30',
    'Nov 25 10:00', 'Nov 25 11:30', 'Nov 25 13:00', 'Nov 25 14:30', 'Nov 25 16:00',
  ],
  '4H': [
    'Nov 11 09:30', 'Nov 11 13:30', 'Nov 12 09:30', 'Nov 12 13:30',
    'Nov 13 09:30', 'Nov 13 13:30', 'Nov 14 09:30', 'Nov 14 13:30',
    'Nov 15 09:30', 'Nov 15 13:30', 'Nov 18 09:30', 'Nov 18 13:30',
    'Nov 19 09:30', 'Nov 19 13:30', 'Nov 20 09:30', 'Nov 20 13:30',
    'Nov 21 09:30', 'Nov 22 09:30', 'Nov 22 13:30', 'Nov 25 09:30', 'Nov 25 13:30',
  ],
  '1D': [
    'Oct 28', 'Oct 29', 'Oct 30', 'Oct 31', 'Nov 01', 'Nov 04', 'Nov 05',
    'Nov 06', 'Nov 07', 'Nov 08', 'Nov 11', 'Nov 12', 'Nov 13', 'Nov 14',
    'Nov 15', 'Nov 18', 'Nov 19', 'Nov 20', 'Nov 21', 'Nov 22', 'Nov 25',
  ],
  '1W': [
    'Jul 08', 'Jul 15', 'Jul 22', 'Jul 29', 'Aug 05', 'Aug 12', 'Aug 19',
    'Aug 26', 'Sep 02', 'Sep 09', 'Sep 16', 'Sep 23', 'Sep 30', 'Oct 07',
    'Oct 14', 'Oct 21', 'Oct 28', 'Nov 04', 'Nov 11', 'Nov 18', 'Nov 25',
  ],
};

function yToPrice(y: number, axisTop: number, axisBottom: number): number {
  const ratio = (y - 40) / 240;
  return axisTop - ratio * (axisTop - axisBottom);
}

function roundPrice(value: number, symbol: string): number {
  if (symbol === 'BTCUSD' || symbol === 'ETHUSD') {
    return Math.round(value * 100) / 100;
  }
  return Math.round(value * 100) / 100;
}

export function formatPrice(value: number, symbol: string): string {
  if (symbol === 'BTCUSD' || value >= 1000) {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return value.toFixed(2);
}

export function formatAxisPrice(value: number, symbol: string): string {
  if (symbol === 'BTCUSD') {
    return Math.round(value).toLocaleString('en-US');
  }
  return value.toFixed(2);
}

function getRatingFromCounts(counts: [number, number, number]): RatingLabel {
  const [sell, , buy] = counts;
  const diff = buy - sell;
  if (diff >= 12) return 'Strong Buy';
  if (diff >= 5) return 'Buy';
  if (diff <= -12) return 'Strong Sell';
  if (diff <= -5) return 'Sell';
  return 'Neutral';
}

function signalForRsi(rsi: number): SignalDirection {
  if (rsi >= 55) return 'Buy';
  if (rsi <= 45) return 'Sell';
  return 'Neutral';
}

export function getChartDataset(symbol: string, timeframe: Timeframe): ChartDataset {
  const seed = SEED_SYMBOLS.find((s) => s.symbol === symbol) ?? SEED_SYMBOLS[0];

  // Timeframe jitter/scale deterministic per timeframe so 1D exactly reproduces Stitch
  const tfConfig: Record<
    Timeframe,
    {
      yShift: number;
      amplitude: number;
      rsiDelta: number;
      countsDelta: [number, number, number];
      macdMult: number;
      volMult: number;
    }
  > = {
    '15m': { yShift: 6, amplitude: 0.48, rsiDelta: -4.8, countsDelta: [2, 2, -4], macdMult: 0.35, volMult: 0.14 },
    '1H': { yShift: 3, amplitude: 0.68, rsiDelta: -2.1, countsDelta: [1, 1, -2], macdMult: 0.62, volMult: 0.32 },
    '4H': { yShift: -2, amplitude: 0.85, rsiDelta: 1.4, countsDelta: [0, -1, 1], macdMult: 0.84, volMult: 0.65 },
    '1D': { yShift: 0, amplitude: 1.0, rsiDelta: 0, countsDelta: [0, 0, 0], macdMult: 1.0, volMult: 1.0 },
    '1W': { yShift: -8, amplitude: 1.24, rsiDelta: 3.6, countsDelta: [-1, -1, 2], macdMult: 1.45, volMult: 3.8 },
  };

  const cfg = tfConfig[timeframe];
  const baseVolNum = parseFloat(seed.volumeLabel);
  const dates = BAR_DATES_BY_TF[timeframe];

  // Convert raw candles into real prices
  const lastRaw = seed.rawCandles[seed.rawCandles.length - 1];
  const anchorCloseY = lastRaw[1];

  const candles: CandleBar[] = seed.rawCandles.map((raw, idx) => {
    const [oY, cY, lY, hY] = raw;

    // For 1D, keep exact Stitch geometry; for other timeframes, transform smoothly around anchor
    const transformY = (y: number) => {
      if (timeframe === '1D') return y;
      const wave = Math.sin(idx * 0.85 + timeframe.length) * (4 * (1.25 - cfg.amplitude));
      const centered = anchorCloseY + (y - anchorCloseY) * cfg.amplitude + cfg.yShift + wave;
      return Math.max(26, Math.min(272, centered));
    };

    const tOpenY = transformY(oY);
    const tCloseY = transformY(cY);
    const tLowY = Math.max(tOpenY, tCloseY, transformY(lY));
    const tHighY = Math.min(tOpenY, tCloseY, transformY(hY));

    let open = roundPrice(yToPrice(tOpenY, seed.axisTop, seed.axisBottom), seed.symbol);
    let close = roundPrice(yToPrice(tCloseY, seed.axisTop, seed.axisBottom), seed.symbol);
    let high = roundPrice(yToPrice(tHighY, seed.axisTop, seed.axisBottom), seed.symbol);
    let low = roundPrice(yToPrice(tLowY, seed.axisTop, seed.axisBottom), seed.symbol);

    // Ensure the last bar on 1D matches exact Stitch OHLC readout
    if (idx === seed.rawCandles.length - 1) {
      if (timeframe === '1D') {
        open = seed.open;
        high = seed.high;
        low = seed.low;
        close = seed.close;
      } else {
        close = seed.close;
        high = Math.max(high, open, close);
        low = Math.min(low, open, close);
      }
    }

    const midY = (tOpenY + tCloseY) / 2 + 8;
    const ema20Val =
      idx === seed.rawCandles.length - 1 && timeframe === '1D'
        ? seed.ema20
        : roundPrice(yToPrice(midY, seed.axisTop, seed.axisBottom), seed.symbol);
    const bandSpread = (seed.axisTop - seed.axisBottom) * 0.105;
    const bbUpper = roundPrice(ema20Val + bandSpread, seed.symbol);
    const bbLower = roundPrice(ema20Val - bandSpread, seed.symbol);

    const progress = idx / (seed.rawCandles.length - 1);
    const trendDir = seed.change >= 0 ? 1 : -1;
    const baseRsi = seed.rsi14 + cfg.rsiDelta;
    const rsiStart = trendDir > 0 ? 43 : 63;
    const waveRsi = Math.sin(idx * 1.15) * 3.4;
    const rsi14 =
      idx === seed.rawCandles.length - 1
        ? Math.max(18, Math.min(84, Number(baseRsi.toFixed(2))))
        : Number(
            Math.max(
              18,
              Math.min(84, rsiStart + (baseRsi - rsiStart) * progress + waveRsi)
            ).toFixed(2)
          );

    const volRatio = 0.65 + ((idx * 17) % 34) / 34;
    const volume = Number((baseVolNum * cfg.volMult * volRatio).toFixed(2));

    return {
      time: dates[idx] || `Bar ${idx + 1}`,
      open,
      high,
      low,
      close,
      volume,
      ema20: ema20Val,
      bbUpper,
      bbLower,
      rsi14,
    };
  });

  const lastBar = candles[candles.length - 1];
  const counts: [number, number, number] = [
    Math.max(0, seed.counts[0] + cfg.countsDelta[0]),
    Math.max(1, seed.counts[1] + cfg.countsDelta[1]),
    Math.max(0, seed.counts[2] + cfg.countsDelta[2]),
  ];
  const rating = timeframe === '1D' ? seed.rating : getRatingFromCounts(counts);
  const macdVal = Number((seed.macd * cfg.macdMult).toFixed(2));
  const sma50Val =
    timeframe === '1D'
      ? seed.sma50
      : roundPrice(seed.sma50 + (seed.price - seed.sma50) * (1 - cfg.amplitude) * 0.4, seed.symbol);

  const signals: IndicatorSignal[] = [
    {
      name: 'RSI (14)',
      value: lastBar.rsi14.toFixed(2),
      signal: signalForRsi(lastBar.rsi14),
    },
    {
      name: 'MACD (12, 26)',
      value: macdVal.toFixed(2),
      signal: macdVal > 0.25 ? 'Buy' : macdVal < -0.25 ? 'Sell' : 'Neutral',
    },
    {
      name: 'EMA (20)',
      value: formatPrice(lastBar.ema20, seed.symbol),
      signal: lastBar.close > lastBar.ema20 ? 'Buy' : lastBar.close < lastBar.ema20 ? 'Sell' : 'Neutral',
    },
    {
      name: 'SMA (50)',
      value: formatPrice(sma50Val, seed.symbol),
      signal: lastBar.close > sma50Val ? 'Buy' : lastBar.close < sma50Val ? 'Sell' : 'Neutral',
    },
  ];

  return {
    candles,
    timeLabels: TIME_AXIS_BY_TF[timeframe],
    ema20: lastBar.ema20,
    sma50: sma50Val,
    macd: macdVal,
    rsi14: lastBar.rsi14,
    rating,
    counts,
    signals,
  };
}
