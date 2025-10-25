import spacy
import os
import re
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from collections import Counter
import string
from nltk.tokenize import sent_tokenize

try:
    import pdfplumber
    import docx
except ImportError:
    pdfplumber = None
    docx = None

try:
    nltk.data.find('tokenizers/punkt')
except:
    nltk.download("punkt", quiet=True)

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading spaCy model 'en_core_web_sm'...")
    os.system("python -m spacy download en_core_web_sm --quiet")
    nlp = spacy.load("en_core_web_sm")

# here, we're normalizing entities 
def normalize_entity(name):
    """Standard cleanup: remove leading/trailing articles and common stop words for comparison."""
    name = name.strip().lower()
    
    name = re.sub(r'^(the|a|an|of|s)\s+', '', name)
    name = re.sub(r'\s+(the|a|an|of|s)$', '', name)
    
    name = re.sub(r'[.,;:`\'"]', '', name)
    return name.strip()

def consolidate_entities(entities):
    """
    Groups entities with similar normalized forms, prioritizing the longest entity
    as the 'master' name. Also checks for partial containment.
    """
    if not entities:
        return {}
    
    consolidation_map = {}
    
    sorted_entities = sorted(list(set(entities)), key=len, reverse=True)
    
    for entity in sorted_entities:
        norm = normalize_entity(entity)
        if norm and norm not in consolidation_map:
            consolidation_map[norm] = entity
            
    # doing final mapping here ..
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

# Parsing the file..
def parse_file(file_path):
    """Parses text from PDF, DOCX, or plain text files."""
    if file_path.endswith(".pdf") and pdfplumber:
        try:
            with pdfplumber.open(file_path) as pdf:
                return "\n".join([p.extract_text() or "" for p in pdf.pages])
        except Exception:
            pass
    elif file_path.endswith(".docx") and docx:
        try:
            doc = docx.Document(file_path)
            return "\n".join([p.text for p in doc.paragraphs])
        except Exception:
            pass
    elif os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        except Exception:
            pass
    return ""

# Summarizing..
def generate_summary(text, n=5):
    from nltk.corpus import stopwords
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
    
    stop_words = set(stopwords.words('english'))
    sentences = sent_tokenize(text)
    
    words = [word.lower() for word in word_tokenize(text) if word.isalpha() and word.lower() not in stop_words]
    freq = Counter(words)
    
    sentence_scores = {}
    for sent in sentences:
        sent_words = [w.lower() for w in word_tokenize(sent) if w.isalpha()]
        score = sum(freq.get(w,0) for w in sent_words)
        sentence_scores[sent] = score
    
    top_sentences = sorted(sentence_scores, key=sentence_scores.get, reverse=True)[:n]
    
    summary = " ".join(top_sentences)
    return {"title": "Document Summary", "content": summary}


def consolidate_entities(entities):
    mapping = {}
    for e in entities:
        key = e.lower().replace("\n"," ").strip()
        mapping[e] = key
    return mapping

def extract_entities_relations(text):
    if not text or not text.strip():
        return [], []

    doc = nlp(text)
    raw_entities = set()
    raw_relations = set()
    noun_chunk_map = {}

    for chunk in doc.noun_chunks:
        name = chunk.text.strip().replace("\n", " ")
        if chunk.root.pos_ in ["PROPN", "NOUN"] and name:
            raw_entities.add(name)
            noun_chunk_map[chunk.root] = name

    for ent in doc.ents:
        raw_entities.add(ent.text.strip().replace("\n"," "))
        if ent.root not in noun_chunk_map:
            noun_chunk_map[ent.root] = ent.text.strip()

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

                    for obj in [c for c in token.children if c.dep_=="dobj"]:
                        obj_name = get_entity_name(obj)
                        if obj_name and subj_name != obj_name:
                            raw_relations.add((subj_name, token.lemma_, obj_name))

                    for prep in [c for c in token.children if c.dep_=="prep"]:
                        prep_text = prep.text.lower()
                        for pobj in [c for c in prep.children if c.dep_=="pobj"]:
                            obj_name = get_entity_name(pobj)
                            if obj_name and subj_name != obj_name:
                                label = f"{token.lemma_}_{prep_text}" if prep_text not in ["of","by"] else token.lemma_
                                raw_relations.add((subj_name, label, obj_name))

                    for agent in [c for c in token.children if c.dep_=="agent"]:
                        for pobj in [c for c in agent.children if c.dep_=="pobj"]:
                            obj_name = get_entity_name(pobj)
                            if obj_name and subj_name != obj_name:
                                raw_relations.add((obj_name, f"{token.lemma_}_by", subj_name))

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

                for child in token.children:
                    if child.lower_ in ["which","who","that"]:
                        for c in child.children:
                            obj_name = get_entity_name(c)
                            if obj_name:
                                raw_relations.add((subj_name, f"{child.lemma_}_ref", obj_name))

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

    connected_entities = set()
    for s,o in [(x[0],x[2]) for x in final_relations]:
        connected_entities.add(s)
        connected_entities.add(o)
    for e in final_entities:
        if e not in connected_entities:
            main_entity = list(final_entities)[0]
            if e != main_entity:
                final_relations.append((main_entity,"related_to", e))

    return sorted(list(final_entities)), final_relations


# generating diag. according to type..

def create_safe_id(name):
    safe = re.sub(r'[^a-zA-Z0-9_]', '_', name.strip().lower())
    if not re.match(r'^[a-zA-Z]', safe):
        safe = "C_" + safe
    return safe[:30] # Limit length

def generate_diagram(text, diagram_type="erDiagram"):
    result = {"nodes": [], "edges": [], "mermaid": ""}
    
    if not text or not text.strip():
         return {"nodes": [], "edges": [], "mermaid": f"{diagram_type}\n  N1[\"No text provided\"]"}

    if diagram_type == "erDiagram":
        
        final_entities, final_relations = extract_entities_relations(text)

        if not final_entities:
            return {"nodes": [], "edges": [], "mermaid": "erDiagram\n  E1[\"No entities found\"]"}

        entity_ids = {e: create_safe_id(e) for e in final_entities}

        mermaid = "erDiagram\n"
        for e in final_entities:
            eid = entity_ids[e]
            # Memaid syntax..
            mermaid += f"  {eid} {{\n    string name \"{e}\"\n  }}\n"
            
        nodes = [{"id": entity_ids[label], "label": label} for label in final_entities]
        edges = []
            
        for s, v, o in final_relations:
            # rel. line..
            mermaid += f"  {entity_ids[s]} ||--o{{ {entity_ids[o]} : \"{v.replace('_', ' ')}\"\n"
            edges.append({"from": entity_ids[s], "to": entity_ids[o], "label": v})


        return {
            "nodes": nodes,
            "edges": edges,
            "mermaid": mermaid
        }

    elif diagram_type == "flowchart":
        
        steps = sent_tokenize(text)
        steps = [s.strip() for s in steps if s.strip()]

        if not steps:
            return {"nodes": [], "edges": [], "mermaid": "flowchart TD\n  N1[\"No steps found\"]"}

        nodes_data = [] 
        node_id_map = {}
        node_counter = 1
        edges = [] 
        pending_edges = []
        
        def get_or_create_node(label, shape="[]"):
            nonlocal node_counter
            label = label.strip()
            if label not in node_id_map:
                node_id = f"N{node_counter}"
                node_id_map[label] = node_id
                nodes_data.append((node_id, label, shape))
                node_counter += 1
            return node_id_map[label]

        i = 0
        prev_node_id = None
        
        if not steps[0].lower().startswith("start") and not steps[0].lower().startswith("begin"):
            start_id = get_or_create_node("START", "()")
            prev_node_id = start_id

        while i < len(steps):
            step_text = steps[i]
            lower_text = step_text.lower()
            current_id = None

            match = re.match(r'if (.+?),\s*(.+)', lower_text, re.I)
            if match:
                condition = match.group(1).strip().capitalize()
                yes_action_text = match.group(2).strip().capitalize()

                decision_id = get_or_create_node(f"If {condition}?", "{}")

                if prev_node_id:
                    edges.append((prev_node_id, decision_id, ""))
                
                # conditions : yes..
                yes_id = get_or_create_node(yes_action_text, "[]")
                edges.append((decision_id, yes_id, "Yes"))
                
                # else cond.. 
                no_match = re.search(r'(?:otherwise|else),?\s*(.+)', lower_text, re.I)
                
                if no_match:
                    no_action_text = no_match.group(1).strip().capitalize()
                    no_id = get_or_create_node(no_action_text, "[]")
                    edges.append((decision_id, no_id, "No"))
                    
                    pending_edges.append(yes_id)
                    pending_edges.append(no_id)
                else:
                    pending_edges.append(yes_id)
                    edges.append((decision_id, None, "No")) 
                
                prev_node_id = None 
                i += 1
                continue

            if any(term in lower_text for term in ["start", "begin"]):
                shape = "()"
            elif any(term in lower_text for term in ["end", "finish", "terminate", "stop"]):
                shape = "()"
            else:
                shape = "[]"

            current_id = get_or_create_node(step_text, shape)
            
            if pending_edges:
                decision_id_for_no = None
                
                for src, dst, label in list(edges): 
                    if dst is None and label == "No":
                         decision_id_for_no = src
                         edges.remove((src, dst, label))
                         edges.append((src, current_id, "No"))
                         break
                         
                for source_id in pending_edges:
                    if source_id != decision_id_for_no: 
                        edges.append((source_id, current_id, ""))
                pending_edges = []
            
            elif prev_node_id:
                edges.append((prev_node_id, current_id, ""))

            prev_node_id = current_id
            i += 1
            
        # generating mermaid flowchart diag..
        mermaid = "flowchart TD\n"
        final_edges = []
        for idx, lbl, shape in nodes_data:
            safe_lbl = lbl.replace('\\', '\\\\').replace('"', '\"').replace('\n', ' ')
            
            if shape == "()":
                mermaid += f"  {idx}(\"{safe_lbl}\")\n"
            elif shape == "{}":
                mermaid += f"  {idx}{{\"{safe_lbl}\"}}\n" 
            else:
                mermaid += f"  {idx}[\"{safe_lbl}\"]\n"

        for src, dst, label in edges:
            if src and dst:
                final_edges.append((src, dst, label))
                safe_label = label.replace('\\', '\\\\').replace('"', '\"').replace('\n', ' ')
                arrow = f" -->|{safe_label}| " if safe_label else " --> "
                mermaid += f"  {src}{arrow}{dst}\n"

        return {
            "nodes": [{"id": idx, "label": lbl} for idx, lbl, _ in nodes_data],
            "edges": [{"from": src, "to": dst, "label": lbl} for src, dst, lbl in final_edges],
            "mermaid": mermaid
        }

    elif diagram_type == "conceptMap":
        
        sentences = sent_tokenize(text)
        nodes = []
        edges = []

        for i, sent in enumerate(sentences):
            node_id = f"N{i+1}"
            nodes.append({"id": node_id, "label": sent.strip()})
            if i > 0:
                edges.append({"from": f"N{i}", "to": node_id, "label": ""})

        sub_nodes_map = {}
        sub_counter = 1
        for i, sent in enumerate(sentences):
            doc = nlp(sent)
            for chunk in doc.noun_chunks:
                sub_label = chunk.text.strip()
                if sub_label and sub_label != sent:
                    sub_id_key = (sub_label, i+1) 
                    if sub_id_key not in sub_nodes_map:
                        sub_id = f"S{sub_counter}"
                        sub_nodes_map[sub_id_key] = {"id": sub_id, "label": sub_label}
                        edges.append({"from": f"N{i+1}", "to": sub_id, "label": "contains"}) 
                        sub_counter += 1

        for data in sub_nodes_map.values():
            nodes.append(data)

        # Making mermaid diag..
        mermaid = "graph TD\n"
        for node in nodes:
            safe_label = node["label"].replace('\\', '\\\\').replace('"', '\\"').replace('\n', ' ')
            mermaid += f'  {node["id"]}[{safe_label}]\n'
            
        for edge in edges:
            lbl = edge.get("label", "")
            safe_lbl = lbl.replace('\\', '\\\\').replace('"', '\\"').replace('\n', ' ')
            arrow = f" -->|{safe_lbl}| " if safe_lbl else " --> "
            mermaid += f'  {edge["from"]}{arrow}{edge["to"]}\n'

        result["nodes"] = nodes
        result["edges"] = edges
        result["mermaid"] = mermaid
        return result

    return result

if __name__ == "__main__":
    # testing..
    text = """
    The financial institution's risk assessment department evaluates loan applications, which are submitted by clients, before the approval process is finalized by the board of directors. Artificial intelligence models trained on large datasets predict market trends and advise investors, helping optimize portfolio performance.
    """

    entities, relations = extract_entities_relations(text)

    print("=== Entities ===")
    for e in entities:
        print("-", e)

    print("\n=== Relations ===")
    for subj, verb, obj in relations:
        print(f"{subj} --[{verb}]--> {obj}")
    ans = generate_diagram(text,"erDiagram")
    print(ans)