from typing import Dict, Any
from .arrow_parser import ArrowParser

def extract_flowchart(arrow_text: str) -> Dict[str, Any]:
    """
    Refined Flowchart extraction from Gemini's arrow format.
    Ensures branch labels (Yes/No) are correctly associated.
    """
    result = ArrowParser.parse(arrow_text, diagram_type="flowchart")
    
    # assinging missing labels.
    for node in result["nodes"]:
        outgoing = [e for e in result["edges"] if e["from_node"] == node["id"]]
        if len(outgoing) > 1 and node["type"] == "decision":

            labels = ["Yes", "No", "Otherwise"]
            for i, edge in enumerate(outgoing):
                if not edge["label"] and i < len(labels):
                    edge["label"] = labels[i]
                    
    return result