from app.schema.diagram_schema import DiagramSchema

def to_mermaid(schema: DiagramSchema) -> str:
    """
    Converts a canonical DiagramSchema to Mermaid syntax.
    """
    if schema.type == "erDiagram" or schema.type == "er":
        return _render_er(schema)
    elif schema.type == "mindMap":
        return _render_flowchart(schema, direction="LR")
    elif schema.type == "conceptMap":
        return _render_flowchart(schema, direction="LR")
    else:
        return _render_flowchart(schema)

def _render_mindmap(schema: DiagramSchema) -> str:
    lines = ["mindmap"]
    # assuming first node as root.
    if schema.nodes:
        root = schema.nodes[0]
        lines.append(f"    root(({root.label}))")
        # convert only common edges to branches.
        processed_edges = set()
        for edge in schema.edges:
            if edge.from_node == root.id:
                
                target = next((n for n in schema.nodes if n.id == edge.to_node), None)
                if target:
                    lines.append(f"        {target.label}")
                    processed_edges.add(f"{edge.from_node}->{edge.to_node}")
                    
    return "\n".join(lines)

def _render_er(schema: DiagramSchema) -> str:
    lines = ["erDiagram"]
    

    def sanitize(text, fallback_id):
        res = "".join(c for c in text if c.isalnum())
        if not res or res[0].isdigit():
            res = "E" + res if res else fallback_id
        return res

    id_to_label = {node.id: sanitize(node.label, node.id) for node in schema.nodes}
    
    for edge in schema.edges:
        from_name = id_to_label.get(edge.from_node, "Entity")
        to_name = id_to_label.get(edge.to_node, "Entity")
        clean_label = edge.label.replace(" ", "_").lower()
        if not clean_label:
            clean_label = "relates"
            
        lines.append(f"    {from_name} ||--o{{ {to_name} : \"{clean_label}\"")
        
    if not schema.edges:
        for node in schema.nodes:
            label = id_to_label.get(node.id, node.id)
            lines.append(f"    {label} {{}}")
            
    return "\n".join(lines)

def _render_flowchart(schema: DiagramSchema, direction: str = "TD") -> str:
    lines = [f"flowchart {direction}"]
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