import { useRef } from "react";
import MermaidRenderer from "./MermaidRenderer";

export default function VisualPreview({ diagramData }) {
  const containerRef = useRef(null);

  if (!diagramData) return null;

  function getInlineSVG(svgElement) {
    const clone = svgElement.cloneNode(true);

    const originalElements = svgElement.querySelectorAll("*");
    const cloneElements = clone.querySelectorAll("*");

    cloneElements.forEach((el, i) => {
      const computed = window.getComputedStyle(originalElements[i]);
      let styleString = "";
      for (const key of computed) {
        styleString += `${key}:${computed.getPropertyValue(key)};`;
      }
      el.setAttribute("style", styleString);
    });

    if (!clone.getAttribute("xmlns")) {
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    }

    return new XMLSerializer().serializeToString(clone);
  }

  const exportDiagramAsPNG = () => {
    const svgElement = containerRef.current?.querySelector("svg");
    if (!svgElement) {
      alert("No diagram found!");
      return;
    }

    const svgString = getInlineSVG(svgElement);

    const canvas = document.createElement("canvas");
    const bbox = svgElement.getBBox();
    canvas.width = bbox.width + 20; 
    canvas.height = bbox.height + 20;
    const ctx = canvas.getContext("2d");

    // Creating img from svg string..
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);

      // download.
      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = "diagram.png";
      a.click();
    };

    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
  };

  return (
    <div className="my-6">
      <h2 className="text-xl font-semibold mb-3 text-white text-center">Generated Diagram</h2>
      <div className="flex flex-col gap-y-4 items-center">
          <div ref={containerRef} className="w-full">
        <MermaidRenderer chart={diagramData.mermaid || ""} />
      </div>
      <button
        className="py-3 px-6 bg-linear-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
        onClick={exportDiagramAsPNG}
      >
        Export as PNG
      </button>
      </div>
    </div>
  );
}
