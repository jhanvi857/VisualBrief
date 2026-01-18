import re
from typing import List, Dict, Any

def clean_edge_label(label: str) -> str:
    """
    Cleans relationship labels.
    """
    if not label:
        return ""
    
    label = label.replace('_', ' ')
    return label.strip().lower()

def extract_metadata_from_relations(edges: List[Dict[str, Any]]) -> Dict[str, Any]:
    # calc. matrix about relation found.
    if not edges:
        return {"density": 0, "complexity": "low"}
        
    num_edges = len(edges)
    # counting unique labels
    labels = set(e["label"] for e in edges if e["label"])
    
    complexity = "low"
    if num_edges > 10:
        complexity = "high"
    elif num_edges > 5:
        complexity = "medium"
        
    return {
        "count": num_edges,
        "unique_labels": list(labels),
        "complexity": complexity
    }
