'use client';

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Inter, sans-serif'
});

export default function MermaidChart({ chart }: { chart: string }) {
  const [mounted, setMounted] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && chartRef.current) {
        mermaid.contentLoaded();
    }
  }, [mounted, chart]);

  if (!mounted) return <div className="opacity-0">{chart}</div>;

  return (
    <div className="mermaid" ref={chartRef}>
      {chart}
    </div>
  );
}
