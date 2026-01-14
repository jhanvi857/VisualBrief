from .diagram_schema import DiagramSchema

def to_mermaid(schema: DiagramSchema) -> str:
    """
    Converts a canonical DiagramSchema to Mermaid syntax.
    """
    if schema.type == "erDiagram":
        return _render_er(schema)
    elif schema.type == "flowchart":
        return _render_flowchart(schema)
    else:
        return _render_flowchart(schema)

def _render_er(schema: DiagramSchema) -> str:
    lines = ["erDiagram"]
    for edge in schema.edges:
        # label standerdize.
        clean_label = edge.label.replace(" ", "_")
        # default rel. : 1 to n.
        lines.append(f"    {edge.from_node} ||--o{{ {edge.to_node} : \"{clean_label}\"")
        
    if not schema.edges:
        for node in schema.nodes:
            lines.append(f"    {node.id} {{}}")
            
    return "\n".join(lines)

def _render_flowchart(schema: DiagramSchema) -> str:
    lines = ["flowchart TD"]
    for node in schema.nodes:
        if node.type == "decision":
            lines.append(f'    {node.id}{{{{"{node.label}"}}}}')
        elif node.type in ["start", "end"]:
            lines.append(f'    {node.id}(["{node.label}"])')
        else:
            lines.append(f'    {node.id}["{node.label}"]')
    
    for edge in schema.edges:
        connector = f'-- "{edge.label}" -->' if edge.label else "-->"
        lines.append(f"    {edge.from_node} {connector} {edge.to_node}")
    return "\n".join(lines)