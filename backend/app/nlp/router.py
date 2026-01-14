from typing import Dict, Any
from .flowchart_nlp import extract_flowchart
from .er_nlp import extract_er
from .concept_map_nlp import extract_concepts

# threshold to decide good fit of user selected input diag. type.
THRESHOLDS = {
    "flowchart": 0.45,
    "erDiagram": 0.35,
    "conceptMap": 0.30
}

def route_nlp(text: str, diagram_type: str) -> Dict[str, Any]:
    if diagram_type == "flowchart":
        result = extract_flowchart(text)
    elif diagram_type == "erDiagram":
        result = extract_er(text)
    elif diagram_type == "conceptMap" or diagram_type == "mindmap":
        result = extract_concepts(text)
        diagram_type = "conceptMap" 
    else:
        result = extract_concepts(text)
        diagram_type = "conceptMap"

    threshold = THRESHOLDS.get(diagram_type, 0.30)
    confidence = result["metadata"]["confidence"]
    
    if confidence < threshold:
        return {
            "success": False,
            "error": f"The input text does not appear to be a good fit for a {diagram_type}.",
            "suggested_type": result["metadata"].get("suggested_type") or "conceptMap",
            "confidence": confidence,
            "type": diagram_type,
            "nodes": [],
            "edges": []
        }
    
    result["success"] = True
    return result
