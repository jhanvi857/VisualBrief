from typing import Dict, Any
from .arrow_parser import ArrowParser

def extract_er(arrow_text: str) -> Dict[str, Any]:
    result = ArrowParser.parse(arrow_text, diagram_type="er")

    for node in result["nodes"]:
        node["type"] = "entity"
        
    # validation : 2 entities + 1 rel.
    if len(result["nodes"]) < 2 or len(result["edges"]) < 1:
        result["metadata"]["confidence"] = min(result["metadata"]["confidence"], 0.4)
    
    return result