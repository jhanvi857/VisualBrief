from typing import Dict, Any
from .flowchart_nlp import extract_flowchart
from .er_nlp import extract_er
from .concept_map_nlp import extract_concepts

def route_nlp(arrow_text: str, diagram_type: str) -> Dict[str, Any]:
    if diagram_type == "flowchart":
        result = extract_flowchart(arrow_text)
    elif diagram_type in ["er", "erDiagram"]:
        result = extract_er(arrow_text)
    elif diagram_type in ["conceptMap", "mindMap", "mindmap"]:
        result = extract_concepts(arrow_text)
    else:
        result = extract_concepts(arrow_text)

    result["success"] = True
    return result
