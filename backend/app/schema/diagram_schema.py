from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class NodeMeta(BaseModel):
    source: Optional[str] = "spaCy"
    confidence: Optional[float] = 1.0
    entity_type: Optional[str] = "NOUN"

class Node(BaseModel):
    id: str
    label: str
    type: Optional[str] = "process"
    meta: Optional[NodeMeta] = None

class EdgeMeta(BaseModel):
    verb: Optional[str] = ""
    sentence_index: Optional[int] = -1

class Edge(BaseModel):
    from_node: str
    to_node: str
    label: str
    meta: Optional[EdgeMeta] = None

class DiagramMeta(BaseModel):
    confidence: float = 1.0
    suggested_type: Optional[str] = None

class DiagramSchema(BaseModel):
    type: str  
    nodes: List[Node]
    edges: List[Edge]
    metadata: Optional[DiagramMeta] = DiagramMeta()
