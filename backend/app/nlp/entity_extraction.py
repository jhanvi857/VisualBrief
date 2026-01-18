import re
from typing import List, Dict, Set, Any

def normalize_label(text: str) -> str:
    # removing extra whitespace, quotes, and common stop words.
    if not text:
        return ""
    # quotes
    text = text.strip().strip('"').strip("'").strip()
    # Normalizeing whitespace
    text = re.sub(r'\s+', ' ', text)

    if len(text) > 1:
        text = text[0].upper() + text[1:]
    return text

def consolidate_nodes(nodes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    
    if not nodes:
        return []
    # Map of normalized name -> canonical node
    canonical_map = {}
    # ID mapping to cannonical nodes.
    id_mapping = {}

    for node in nodes:
        original_label = node["label"]
        norm_label = original_label.lower().strip()
        # plural->singular. and vice versa.
        if norm_label.endswith('s') and len(norm_label) > 3:
            norm_label = norm_label[:-1]
            
        if norm_label in canonical_map:
            id_mapping[node["id"]] = canonical_map[norm_label]["id"]
        else:
            canonical_map[norm_label] = node
            id_mapping[node["id"]] = node["id"]

    return list(canonical_map.values()), id_mapping
