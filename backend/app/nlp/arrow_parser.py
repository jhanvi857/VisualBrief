import re
from typing import Dict, Any
from .entity_extraction import normalize_label, consolidate_nodes
from .relation_extraction import clean_edge_label, extract_metadata_from_relations

class ArrowParser:
    @staticmethod
    def parse(text: str, diagram_type: str = "flowchart") -> Dict[str, Any]:
        # parsing into arrow format : nodeA->nodeB|label|.
        text = re.sub(r'```[\w]*\n?', '', text)
        text = re.sub(r'```', '', text)
        
        lines = [line.strip() for line in text.strip().split('\n') if line.strip()]
        
        raw_nodes = []
        raw_edges = []        
        pattern = re.compile(r'^(.*?)\s*->\s*([^|]*?)(?:\s*\|(.*?)\|)?$')
        node_counter = 1
        node_label_to_id = {}

        def get_or_create_node(label: str):
            nonlocal node_counter
            clean = normalize_label(label)
            if not clean: return None
            
            if clean not in node_label_to_id:
                node_id = f"NODE_{node_counter}"
                node_label_to_id[clean] = node_id
                node_counter += 1
                
                # Determining node type.
                node_type = "process"
                l_lower = clean.lower()
                if diagram_type == "flowchart":
                    if any(x in l_lower for x in ["start", "begin"]): node_type = "start"
                    elif any(x in l_lower for x in ["end", "stop"]): node_type = "end"
                    elif "?" in l_lower or any(x in l_lower for x in ["if", "check"]): node_type = "decision"
                elif diagram_type in ["er", "erDiagram"]:
                    node_type = "entity"
                elif diagram_type in ["conceptMap", "mindMap"]:
                    node_type = "concept"
                    
                raw_nodes.append({"id": node_id, "label": clean, "type": node_type})
            
            return node_label_to_id[clean]

        for line in lines:
            if "->" not in line: continue
            
            match = pattern.match(line)
            if match:
                src, tgt, lab = match.groups()
                src_id = get_or_create_node(src)
                tgt_id = get_or_create_node(tgt)
                
                if src_id and tgt_id:
                    raw_edges.append({
                        "from_node": src_id,
                        "to_node": tgt_id,
                        "label": clean_edge_label(lab) if lab else ""
                    })

        # Consolidating duplicate nodes.
        final_nodes, id_mapping = consolidate_nodes(raw_nodes)
        
        # Remapping edges if nodes were consolidated.
        final_edges = []
        seen_edges = set()
        for edge in raw_edges:
            new_from = id_mapping.get(edge["from_node"], edge["from_node"])
            new_to = id_mapping.get(edge["to_node"], edge["to_node"])
            edge_key = (new_from, new_to, edge["label"])
            
            if edge_key not in seen_edges and new_from != new_to:
                final_edges.append({
                    "from_node": new_from,
                    "to_node": new_to,
                    "label": edge["label"]
                })
                seen_edges.add(edge_key)

        # Extracting metadata and confidence.
        meta = extract_metadata_from_relations(final_edges)
        confidence = 0.5
        if len(final_edges) > 0:
            confidence = min(0.98, 0.4 + (len(final_edges) * 0.1))
        
        return {
            "type": diagram_type,
            "nodes": final_nodes,
            "edges": final_edges,
            "metadata": {
                "confidence": round(confidence, 2),
                "complexity": meta["complexity"],
                "raw_arrow_count": len(lines)
            }
        }
