import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function VisualPreview({ data }) {
  const mermaidRef = useRef(null);

  useEffect(() => {
    if (!data?.mermaid || !mermaidRef.current) return;

    mermaid.initialize({ startOnLoad: false, theme: "forest" });

    mermaidRef.current.innerHTML = "";

    try {
      mermaid.render("mermaid-diagram", data.mermaid, (svgCode) => {
        mermaidRef.current.innerHTML = svgCode;
      });
    } catch (err) {
      console.error("Mermaid render error:", err);
    }
  }, [data]);

  return <div ref={mermaidRef} className="min-h-[300px] w-full"></div>;
}
