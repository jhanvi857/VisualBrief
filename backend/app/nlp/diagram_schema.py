from pydantic import BaseModel
from typing import List, Optional, Any

class Node(BaseModel):
    id: str
    label: str
    type: Optional[str] = "process" # For flowchart: process, decision, start, end

class Edge(BaseModel):
    from_node: str
    to_node: str
    label: str = ""

class DiagramMeta(BaseModel):
    confidence: float
    suggested_type: Optional[str] = None

class DiagramSchema(BaseModel):
    type: str # flowchart | erDiagram | conceptMap
    nodes: List[Node]
    edges: List[Edge]
    metadata: DiagramMeta
