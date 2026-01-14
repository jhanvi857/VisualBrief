from typing import List, Dict, Any

def score_flowchart(doc, valid_steps: int) -> float:
    # High verb density and sequencing words
    verb_count = sum(1 for token in doc if token.pos_ == "VERB")
    total_tokens = len(doc)
    
    if total_tokens == 0: return 0.0
    
    verb_density = verb_count / total_tokens
    
    # Confidence points
    score = 0.0
    if verb_density > 0.15: score += 0.4
    if valid_steps >= 2: score += 0.3
    if any(m in doc.text.lower() for m in ["first", "then", "next", "finally", "after"]):
        score += 0.3
        
    return min(score, 1.0)

def score_er(entities_count: int, relations_count: int) -> float:
    score = 0.0
    if entities_count >= 2: score += 0.4
    if relations_count >= 1: score += 0.4
    if entities_count >= 4 and relations_count >= 2: score += 0.2
    
    return min(score, 1.0)

def score_concept_map(concept_count: int, edge_count: int) -> float:
    score = 0.0
    if concept_count >= 3: score += 0.4
    if edge_count >= 1: score += 0.4
    if concept_count >= 6: score += 0.2
    
    return min(score, 1.0)
