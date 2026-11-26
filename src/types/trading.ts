export type Timeframe = '15m' | '1H' | '4H' | '1D' | '1W';

export type DrawingTool =
  | 'crosshair'
  | 'trendline'
  | 'fib'
  | 'brush'
  | 'text'
  | 'measure'
  | 'zoom';

export interface CandleBar {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ema20: number;
  bbUpper: number;
  bbLower: number;
  rsi14: number;
}

export type SignalDirection = 'Buy' | 'Neutral' | 'Sell';
export type RatingLabel = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface IndicatorSignal {
  name: string;
  value: string;
  signal: SignalDirection;
}

export interface SymbolOverview {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  price: number;
  change: number;
  changePct: number;
  isUp: boolean;
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
  counts: [number, number, number]; // [sell, neutral, buy]
}

export interface ChartDataset {
  candles: CandleBar[];
  timeLabels: string[];
  ema20: number;
  sma50: number;
  macd: number;
  rsi14: number;
  rating: RatingLabel;
  counts: [number, number, number];
  signals: IndicatorSignal[];
}

export interface ChartPoint {
  index: number;
  price: number;
}

export type ChartDrawing =
  | {
      id: string;
      type: 'trendline';
      p1: ChartPoint;
      p2: ChartPoint;
    }
  | {
      id: string;
      type: 'fib';
      p1: ChartPoint;
      p2: ChartPoint;
    }
  | {
      id: string;
      type: 'brush';
      points: ChartPoint[];
    }
  | {
      id: string;
      type: 'text';
      point: ChartPoint;
      text: string;
    }
  | {
      id: string;
      type: 'measure';
      p1: ChartPoint;
      p2: ChartPoint;
    };

export interface PriceAlert {
  id: string;
  symbol: string;
  condition: 'Crossing Up' | 'Crossing Down';
  price: number;
  note: string;
  createdAt: string;
}

export interface PublishedIdea {
  id: string;
  symbol: string;
  timeframe: Timeframe;
  title: string;
  bias: 'Long' | 'Neutral' | 'Short';
  notes: string;
  priceAtPublish: number;
  createdAt: string;
}
