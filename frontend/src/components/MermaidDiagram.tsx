import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'loose',
  theme: 'dark',
  themeVariables: {
    primaryColor: '#3b82f6',
    primaryTextColor: '#fff',
    primaryBorderColor: '#6366f1',
    lineColor: '#6366f1',
    secondaryColor: '#1e293b',
    tertiaryColor: '#334155',
    background: '#0f172a',
    mainBkg: '#1e293b',
    secondBkg: '#334155',
    border1: '#475569',
    border2: '#64748b',
    note: '#1e293b',
    noteBkgColor: '#1e293b',
    noteBorderColor: '#6366f1',
    noteTextColor: '#e2e8f0',
    fontFamily: 'ui-monospace, monospace',
  },
});

let diagramCounter = 0;

export default function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const id = `mermaid-${diagramCounter++}`;

    mermaid
      .render(id, chart)
      .then(({ svg }) => {
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      })
      .catch((error) => {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = `<pre class="text-red-400 text-xs whitespace-pre-wrap">${String(error)}</pre>`;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chart]);

  return (
    <div
      ref={ref}
      className={`bg-gray-900 rounded-lg p-6 overflow-x-auto ${className}`}
    />
  );
}
