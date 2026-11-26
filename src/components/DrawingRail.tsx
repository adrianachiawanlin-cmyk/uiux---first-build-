import React from 'react';
import { DrawingTool } from '../types/trading';

interface DrawingRailProps {
  activeTool: DrawingTool;
  hasDrawings: boolean;
  isZoomed: boolean;
  onSelectTool: (tool: DrawingTool) => void;
  onUndoDrawing: () => void;
  onClearDrawings: () => void;
  onResetZoom: () => void;
}

const TOOLS: { id: DrawingTool; label: string; icon: string }[] = [
  { id: 'crosshair', label: 'Crosshair cursor', icon: 'my_location' },
  { id: 'trendline', label: 'Trend line tool', icon: 'show_chart' },
  { id: 'fib', label: 'Fibonacci retracement', icon: 'density_medium' },
  { id: 'brush', label: 'Brush annotation', icon: 'edit' },
  { id: 'text', label: 'Text note', icon: 'title' },
  { id: 'measure', label: 'Price range measure', icon: 'straighten' },
  { id: 'zoom', label: 'Zoom into chart', icon: 'zoom_in' },
];

export const DrawingRail: React.FC<DrawingRailProps> = ({
  activeTool,
  hasDrawings,
  isZoomed,
  onSelectTool,
  onUndoDrawing,
  onClearDrawings,
  onResetZoom,
}) => {
  return (
    <aside
      aria-label="Drawing tools"
      className="hidden lg:flex w-12 flex-col items-center gap-gutter-sm py-gutter-md bg-light-surface-container-lowest dark:bg-dark-surface-container-lowest border-r border-light-outline-variant dark:border-dark-outline-variant shrink-0"
    >
      {TOOLS.map((tool) => {
        const active = activeTool === tool.id;
        return (
          <button
            key={tool.id}
            type="button"
            onClick={() => onSelectTool(tool.id)}
            aria-label={tool.label}
            aria-pressed={active}
            title={tool.label}
            className={
              active
                ? 'w-9 h-9 rounded flex items-center justify-center bg-light-surface-container-highest dark:bg-dark-surface-container-highest text-light-on-surface dark:text-dark-on-surface cursor-pointer transition-colors duration-state-change'
                : 'w-9 h-9 rounded flex items-center justify-center text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container dark:hover:bg-dark-surface-container cursor-pointer transition-colors duration-state-change'
            }
          >
            <span className="material-symbols-outlined text-title-md">{tool.icon}</span>
          </button>
        );
      })}

      {(hasDrawings || isZoomed) && (
        <>
          <div className="w-6 h-px bg-light-outline-variant dark:bg-dark-outline-variant my-gutter-xs" />
          {isZoomed && (
            <button
              type="button"
              onClick={onResetZoom}
              aria-label="Reset chart zoom"
              title="Reset zoom"
              className="w-9 h-9 rounded flex items-center justify-center text-brand-blue hover:bg-light-surface-container dark:hover:bg-dark-surface-container cursor-pointer transition-colors duration-state-change"
            >
              <span className="material-symbols-outlined text-title-md">zoom_out_map</span>
            </button>
          )}
          {hasDrawings && (
            <>
              <button
                type="button"
                onClick={onUndoDrawing}
                aria-label="Undo last drawing"
                title="Undo last drawing"
                className="w-9 h-9 rounded flex items-center justify-center text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-light-surface-container dark:hover:bg-dark-surface-container cursor-pointer transition-colors duration-state-change"
              >
                <span className="material-symbols-outlined text-title-md">undo</span>
              </button>
              <button
                type="button"
                onClick={onClearDrawings}
                aria-label="Clear all drawings"
                title="Clear all drawings"
                className="w-9 h-9 rounded flex items-center justify-center text-bearish hover:bg-light-surface-container dark:hover:bg-dark-surface-container cursor-pointer transition-colors duration-state-change"
              >
                <span className="material-symbols-outlined text-title-md">delete_sweep</span>
              </button>
            </>
          )}
        </>
      )}
    </aside>
  );
};
