import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function MermaidRenderer({ chart }) {
  const containerRef = useRef(null);
  
  const renderId = useRef("mermaid-render-" + Math.floor(Math.random() * 10000)).current;

  useEffect(() => {
    if (!chart || !containerRef.current) return;
    let isMounted = true; 
    containerRef.current.innerHTML = "";
        mermaid.initialize({ 
        startOnLoad: false, 
        theme: 'default' 
    });
    
    mermaid.render(renderId, chart)
        .then(({ svg }) => {
            if (isMounted && containerRef.current) {
                containerRef.current.innerHTML = svg; 
            }
        })
        .catch((err) => {
           if (isMounted && containerRef.current) {
              console.error("Mermaid render error:", err);
              containerRef.current.innerHTML =
                "<p class='text-red-500'>Invalid diagram code or rendering failed.</p>";
           }
        });
    
    return () => {
      isMounted = false;
    };

  }, [chart, renderId]); 

  return (
    <div
      ref={containerRef}
      className="w-full overflow-auto bg-gray-50 p-4 rounded-xl shadow-inner min-h-[200px]"
    >
      {!chart && <p className="text-gray-500">No diagram to render</p>}
    </div>
  );
}