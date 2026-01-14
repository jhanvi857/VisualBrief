import spacy
from typing import List, Dict, Any
from .preprocess import normalize_text
from .confidence import score_flowchart

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm", "--quiet"])
    nlp = spacy.load("en_core_web_sm")

def extract_flowchart(text: str) -> Dict[str, Any]:
    text = normalize_text(text)
    doc = nlp(text)
    
    steps_text = [sent.text.strip() for sent in doc.sents if len(sent.text) > 3]
    
    nodes = [{"id": "START", "label": "Start", "type": "start"}]
    edges = []
    
    prev_id = "START"
    decision_keywords = {"if", "check", "whether", "verify", "validate", "test", "should"}

    for i, step in enumerate(steps_text):
        node_id = f"STEP_{i}"
        step_doc = nlp(step)
        
        is_decision = any(token.lower_ in decision_keywords for token in step_doc) or "?" in step

        # extracting labels.
        root = next((t for t in step_doc if t.dep_ == "ROOT"), step_doc[0])
        label = f"{root.lemma_.capitalize()} " + " ".join([c.text for c in root.children if c.dep_ in ("dobj", "pobj", "attr")])
        label = label.strip()
        if is_decision and not label.endswith("?"):
            label += "?"
        
        nodes.append({
            "id": node_id,
            "label": label if len(label) > 2 else step.capitalize(),
            "type": "decision" if is_decision else "process"
        })

        # branching logic.
        edge_label = ""
        if i > 0:
            prev_node = nodes[-2] 
            if prev_node["type"] == "decision":
                edge_label = "Yes"
            else:
                edge_label = "Next"
        
        # eles/otherwise branch logic.
        if i > 0 and ("else" in step.lower() or "otherwise" in step.lower()):
            last_dec = next((n for n in reversed(nodes[:-1]) if n["type"] == "decision"), None)
            if last_dec:
                edges.append({"from_node": last_dec["id"], "to_node": node_id, "label": "No"})
                prev_id = node_id
                continue

        edges.append({"from_node": prev_id, "to_node": node_id, "label": edge_label})
        prev_id = node_id

    nodes.append({"id": "END", "label": "End", "type": "end"})
    if prev_id != "START":
        edges.append({"from_node": prev_id, "to_node": "END", "label": ""})

    confidence = score_flowchart(doc, len(steps_text))

    return {
        "type": "flowchart", 
        "nodes": nodes, 
        "edges": edges, 
        "metadata": {
            "confidence": confidence,
            "suggested_type": "conceptMap" if confidence < 0.45 else None
        }
    }