"use client";
import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false, 
  theme: "default",
});

export default function MermaidRenderer({ chart }) {
  const container = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!chart || !container.current) return;

    setError(false);
    const renderId = `mermaid-${Math.floor(Math.random() * 10000)}`;
    
    mermaid.render(renderId, chart, (svgCode) => {
      if (container.current) container.current.innerHTML = svgCode;
    }).catch((err) => {
      console.error("Mermaid render error:", err);
      setError(true);
    });
  }, [chart]);

  if (!chart) return <p className="text-slate-400">Diagram will appear here</p>;
  if (error) return <p className="text-red-400">Failed to render diagram</p>;

  return <div ref={container}></div>;
}
