from typing import List
from app.schema.diagram_schema import DiagramSchema

def render_logic(schema: DiagramSchema) -> List[str]:
    logic_lines = []
    
    node_labels = {node.id: node.label for node in schema.nodes}
    
    for edge in schema.edges:
        to_label = node_labels.get(edge.to_node, edge.to_node)
        verb = edge.label.replace(' ', '_').lower()
        
        line = f"{verb}({to_label.lower().replace(' ', '_')})"
        logic_lines.append(line)
        
    return logic_lines
