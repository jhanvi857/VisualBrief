from typing import List
from ..nlp.diagram_schema import DiagramSchema

def render_steps(schema: DiagramSchema) -> List[str]:
    steps = []
    
    node_labels = {node.id: node.label for node in schema.nodes}
    
    for i, edge in enumerate(schema.edges):
        from_label = node_labels.get(edge.from_node, edge.from_node)
        to_label = node_labels.get(edge.to_node, edge.to_node)
        verb = edge.label.replace('_', ' ')
        
        step_text = f"Step {i+1}: {from_label} {verb} {to_label}"
        steps.append(step_text)
        
    return steps
