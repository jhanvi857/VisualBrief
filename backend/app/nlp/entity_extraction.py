import spacy
import re
from typing import List, Set, Dict

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm", "--quiet"])
    nlp = spacy.load("en_core_web_sm")

def normalize_entity(name: str) -> str:
    name = name.strip().lower()
    name = re.sub(r'^(the|a|an|of|s)\s+', '', name)
    name = re.sub(r'\s+(the|a|an|of|s)$', '', name)
    name = re.sub(r'[.,;:`\'"]', '', name)
    return name.strip()

def consolidate_entities(entities: List[str]) -> Dict[str, str]:
    if not entities:
        return {}
    
    consolidation_map = {}
    sorted_entities = sorted(list(set(entities)), key=len, reverse=True)
    
    for entity in sorted_entities:
        norm = normalize_entity(entity)
        if norm and norm not in consolidation_map:
            consolidation_map[norm] = entity
            
    final_map = {}
    for entity in entities:
        norm = normalize_entity(entity)
        best_match = consolidation_map.get(norm, entity)
        for n_key, master in consolidation_map.items():
            if norm != n_key and (norm in n_key or n_key in norm):
                if len(master) > len(best_match) or best_match == entity:
                    best_match = master
        final_map[entity] = best_match
    return final_map

def extract_raw_entities(text: str):
    doc = nlp(text)
    raw_entities = set()
    noun_chunk_map = {}

    for chunk in doc.noun_chunks:
        name = chunk.text.strip().replace("\n", " ")
        if chunk.root.pos_ in ["PROPN", "NOUN"] and name:
            raw_entities.add(name)
            noun_chunk_map[chunk.root] = name

    for ent in doc.ents:
        name = ent.text.strip().replace("\n"," ")
        raw_entities.add(name)
        if ent.root not in noun_chunk_map:
            noun_chunk_map[ent.root] = name

    return doc, raw_entities, noun_chunk_map
