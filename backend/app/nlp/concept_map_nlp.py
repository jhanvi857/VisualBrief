import spacy
import pytextrank
from typing import List, Dict, Any
from .preprocess import normalize_text

nlp = spacy.load("en_core_web_sm")

def extract_concepts(text: str) -> Dict[str, Any]:
    if "textrank" not in nlp.pipe_names:
        nlp.add_pipe("textrank")
    
    clean_text = normalize_text(text)
    doc = nlp(clean_text)
    
    # Extract top 10 key phrases using pytextrank
    top_phrases = [p.text.lower() for p in doc._.phrases[:12]]
    
    nodes = [{"id": f"CON_{i}", "label": p.capitalize()} for i, p in enumerate(top_phrases)]
    edges = []
    
    # Connect phrases if they appear in the same sentence
    seen_edges = set()
    for sent in doc.sents:
        sent_concepts = [p for p in top_phrases if p in sent.text.lower()]
        for i in range(len(sent_concepts)):
            for j in range(i + 1, len(sent_concepts)):
                c1, c2 = sent_concepts[i], sent_concepts[j]
                idx1 = top_phrases.index(c1)
                idx2 = top_phrases.index(c2)
                
                edge_key = tuple(sorted([idx1, idx2]))
                if edge_key not in seen_edges:
                    edges.append({
                        "from_node": f"CON_{idx1}",
                        "to_node": f"CON_{idx2}",
                        "label": "related"
                    })
                    seen_edges.add(edge_key)

    # Use a basic confidence score as a placeholder or implement score_concept_map
    confidence = 0.6 if len(nodes) >= 3 else 0.3

    return {
        "type": "conceptMap", 
        "nodes": nodes, 
        "edges": edges[:15], 
        "metadata": {
            "confidence": confidence,
            "suggested_type": None
        }
    }