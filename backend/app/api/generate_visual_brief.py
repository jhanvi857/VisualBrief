from typing import Dict, Any
from ..nlp.router import route_nlp
from ..nlp.preprocess import normalize_text
from ..nlp.diagram_schema import DiagramSchema, Node, Edge, DiagramMeta
from ..nlp.mermaid_adapter import to_mermaid
from ..renderers.step_renderer import render_steps
from ..renderers.logic_renderer import render_logic

def generate_visual_brief(text: str, diagram_type: str = "flowchart") -> Dict[str, Any]:
    # 1. test norm.
    clean_text = normalize_text(text)
    
    # 2. user's input according routing.
    result = route_nlp(clean_text, diagram_type)
    
    # Check for confidence gating
    if result.get("success") is False:
        return {
            "success": False,
            "error": result["error"],
            "suggested_type": result.get("suggested_type"),
            "confidence": result.get("confidence", 0.0)
        }
    schema = DiagramSchema(
        type=diagram_type,
        nodes=[Node(**n) for n in result["nodes"]],
        edges=[Edge(**e) for e in result["edges"]],
        metadata=DiagramMeta(**result["metadata"])
    )
    
    # render op.
    mermaid_code = to_mermaid(schema)
    steps = render_steps(schema)
    logic = render_logic(schema)
    
    return {
        "success": True,
        "schema": schema.dict(),
        "mermaid": mermaid_code,
        "steps": steps,
        "logic": logic,
        "confidence": schema.metadata.confidence
    }
