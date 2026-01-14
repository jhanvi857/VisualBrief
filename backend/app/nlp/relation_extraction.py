import re
from typing import List, Tuple
from .entity_extraction import consolidate_entities

def extract_relations(doc, noun_chunk_map):
    raw_relations = set()

    def get_entity_name(token):
        if token in noun_chunk_map:
            return noun_chunk_map[token]
        if token.pos_ in ["NOUN", "PROPN"]:
            return token.text.strip()
        return None

    for sent in doc.sents:
        for token in sent:
            if token.pos_ == "VERB":
                subjects = [c for c in token.children if c.dep_ in ["nsubj","nsubjpass"]]
                if not subjects and token.dep_ == "conj" and token.head.pos_ == "VERB":
                    subjects = [c for c in token.head.children if c.dep_ in ["nsubj","nsubjpass"]]

                for subj in subjects:
                    subj_name = get_entity_name(subj)
                    if not subj_name:
                        continue

                    # Direct objects
                    for obj in [c for c in token.children if c.dep_=="dobj"]:
                        obj_name = get_entity_name(obj)
                        if obj_name and subj_name != obj_name:
                            raw_relations.add((subj_name, token.lemma_, obj_name))

                    # Prepositional objects
                    for prep in [c for c in token.children if c.dep_=="prep"]:
                        prep_text = prep.text.lower()
                        for pobj in [c for c in prep.children if c.dep_=="pobj"]:
                            obj_name = get_entity_name(pobj)
                            if obj_name and subj_name != obj_name:
                                label = f"{token.lemma_}_{prep_text}" if prep_text not in ["of","by"] else token.lemma_
                                raw_relations.add((subj_name, label, obj_name))

                    # Agents (passive)
                    for agent in [c for c in token.children if c.dep_=="agent"]:
                        for pobj in [c for c in agent.children if c.dep_=="pobj"]:
                            obj_name = get_entity_name(pobj)
                            if obj_name and subj_name != obj_name:
                                raw_relations.add((obj_name, f"{token.lemma_}_by", subj_name))

            # Non-verb based relations
            if token.pos_ in ["NOUN","PROPN"] and token in noun_chunk_map:
                subj_name = get_entity_name(token)
                for child in token.children:
                    if child.dep_=="appos":
                        obj_name = get_entity_name(child)
                        if obj_name and subj_name != obj_name:
                            raw_relations.add((subj_name, "is_a", obj_name))

                if token.dep_ in ["poss","pobj","attr"]:
                    head_name = get_entity_name(token.head)
                    if head_name and subj_name != head_name:
                        raw_relations.add((head_name, "has_a", subj_name))

    return raw_relations

def get_graph_data(text: str):
    from .entity_extraction import extract_raw_entities
    
    doc, raw_entities, noun_chunk_map = extract_raw_entities(text)
    raw_relations = extract_relations(doc, noun_chunk_map)

    all_entities = list(raw_entities)
    consolidation_map = consolidate_entities(all_entities)
    final_entities = set(consolidation_map.values())
    final_relations = []

    for subj, verb, obj in raw_relations:
        final_subj = consolidation_map.get(subj, subj)
        final_obj = consolidation_map.get(obj, obj)
        if final_subj in final_entities and final_obj in final_entities and final_subj != final_obj:
            clean_verb = re.sub(r'\s+','_', verb.strip().lower())
            relation_tuple = (final_subj, clean_verb, final_obj)
            if relation_tuple not in final_relations:
                final_relations.append(relation_tuple)

    # Ensure all entities are connected or at least present
    connected_entities = set()
    for s, v, o in final_relations:
        connected_entities.add(s)
        connected_entities.add(o)
    
    for e in final_entities:
        if e not in connected_entities:
            pass

    return list(final_entities), final_relations
