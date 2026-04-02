import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { LogEntry } from '../types';

interface TerminalLogProps {
  logs: LogEntry[];
}

export const TerminalLog: React.FC<TerminalLogProps> = ({ logs }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll the container to the bottom when new logs arrive.
    // We use scrollTop instead of scrollIntoView to prevent the main browser window 
    // from scrolling if the terminal is not in view.
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'SCAN': return 'text-blue-400';
      case 'LIST': return 'text-indigo-400';
      case 'AD': return 'text-violet-400';
      case 'ROI': return 'text-emerald-400';
      case 'FULFILL': return 'text-orange-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <section
      className="bg-black/40 border border-white/10 rounded-xl overflow-hidden flex flex-col h-64 md:h-full backdrop-blur-sm"
      aria-labelledby="terminal-log-heading"
    >
      <header className="bg-slate-950/80 px-4 py-2 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-slate-500" aria-hidden="true" />
          <h3 id="terminal-log-heading" className="text-xs font-mono text-slate-400 uppercase tracking-widest">Neural Kernel Logs</h3>
        </div>
        <div className="flex gap-1.5" aria-hidden="true">
           <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
           <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
           <div className="w-2 h-2 rounded-full bg-emerald-500/20"></div>
        </div>
      </header>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5 scrollbar-hide"
        role="log"
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions"
        aria-label="System activity log"
      >
        {logs.length === 0 && (
          <div className="text-slate-600 italic" role="status">Waiting for activation sequence...</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 hover:bg-white/5 p-0.5 rounded transition-colors">
            <span className="text-slate-600 shrink-0 select-none" aria-label={`Time: ${log.timestamp}`}>[{log.timestamp}]</span>
            <span className={`font-bold shrink-0 w-16 ${getCategoryColor(log.category)}`} aria-label={`Category: ${log.category}`}>{log.category}</span>
            <span className="text-slate-300 break-all">{log.message}</span>
          </div>
        ))}
      </div>
    </section>
  );
};