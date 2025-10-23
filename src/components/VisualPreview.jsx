import MermaidRenderer from "./MermaidRenderer";

export default function VisualPreview({ diagramData }) {
  if (!diagramData) return null;

  return (
    <div className="my-6">
      <h2 className="text-xl font-semibold mb-3 text-white">Generated Diagram</h2>
      <MermaidRenderer chart={diagramData.mermaid || ""} />
    </div>
  );
}
