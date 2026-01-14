import spacy
import networkx as nx
from typing import List, Dict, Any
from .preprocess import normalize_text

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm", "--quiet"])
    nlp = spacy.load("en_core_web_sm")

def extract_er(text: str) -> Dict[str, Any]:
    clean_text = normalize_text(text)
    doc = nlp(clean_text)
    G = nx.MultiDiGraph()
    
    # subject-verb-object extraction.
    for sent in doc.sents:
        subj = None
        obj = None
        relation = None
        
        for token in sent:
            if "subj" in token.dep_:
                subj = token.text.lower()
            if "obj" in token.dep_ or token.dep_ == "attr":
                obj = token.text.lower()
            if token.pos_ == "VERB":
                relation = token.lemma_

        if subj and obj and relation:
            # mapping verbs.
            label = "has" if relation in ["have", "contain", "possess", "own"] else relation
            G.add_edge(subj, obj, label=label)

    nodes = [{"id": f"ENT_{i}", "label": n.capitalize(), "type": "entity"} 
             for i, n in enumerate(G.nodes())]
    
    # mapping node labels.
    label_to_id = {n.capitalize(): f"ENT_{i}" for i, n in enumerate(G.nodes())}
    
    edges = []
    for u, v, d in G.edges(data=True):
        edges.append({
            "from_node": label_to_id[u.capitalize()], 
            "to_node": label_to_id[v.capitalize()], 
            "label": d.get('label', 'related')
        })

    confidence = 0.7 if len(nodes) >= 2 and len(edges) >= 1 else 0.3

    return {
        "type": "erDiagram", 
        "nodes": nodes, 
        "edges": edges, 
        "metadata": {
            "confidence": confidence,
            "suggested_type": "conceptMap" if confidence < 0.4 else None
        }
    }