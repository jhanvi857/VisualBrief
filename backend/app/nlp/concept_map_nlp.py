from typing import Dict, Any
from .arrow_parser import ArrowParser

def extract_concepts(arrow_text: str) -> Dict[str, Any]:
#     refining according to gemini response.
    result = ArrowParser.parse(arrow_text, diagram_type="conceptMap")
    
    # Validation
    if len(result["nodes"]) < 3:
         result["metadata"]["confidence"] = min(result["metadata"]["confidence"], 0.3)
         
    return result