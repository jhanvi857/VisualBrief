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
    return safe[:30] 

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
        import re
        raw_steps = [s.strip() for s in re.split(r'[\n;]+', text) if s.strip()]

        nodes_data = []
        edges = []
        node_map = {}
        node_counter = 1

        def get_node(label, shape="[]"):
            nonlocal node_counter
            label = " ".join(label.split())  
            if not label:
                label = " "
            if label not in node_map:
                node_id = f"N{node_counter}"
                node_counter += 1
                node_map[label] = node_id
                nodes_data.append((node_id, label, shape))
            return node_map[label]

        prev_node = None
        pending_no = None  

        start_id = get_node("Start", "()")
        prev_node = start_id

        for i, step in enumerate(raw_steps):
            s = step.strip()

            if "?" in s:
                cond_part, after = s.split("?", 1)
                decision_text = cond_part.strip().capitalize()
                decision_id = get_node(f"If {decision_text}?", "{}")
                if prev_node:
                    edges.append((prev_node, decision_id, ""))
                prev_node = decision_id

                yes_match = re.search(r'if yes (.+?)(?:$|;|,)', after, re.I)
                if yes_match:
                    yes_text = yes_match.group(1).strip().capitalize()
                    yes_id = get_node(yes_text)
                    edges.append((decision_id, yes_id, "Yes"))
                    prev_node = yes_id
                pending_no = decision_id
                continue

            m_arrow = re.match(r'if\s+(.+?)\s*(?:->|then)\s*(.+?)\s*(?:else\s*(.+))?$', s, re.I)
            if m_arrow:
                cond_text = m_arrow.group(1).strip().capitalize()
                yes_text = m_arrow.group(2).strip().capitalize()
                no_text = m_arrow.group(3).strip().capitalize() if m_arrow.group(3) else None

                decision_id = get_node(f"If {cond_text}?", "{}")  
                yes_id = get_node(yes_text)
                edges.append((prev_node, decision_id, ""))
                edges.append((decision_id, yes_id, "Yes"))

                if no_text:
                    no_id = get_node(no_text)
                    edges.append((decision_id, no_id, "No"))
                else:
                    pending_no = decision_id  

                prev_node = yes_id
                continue

            m_inline = re.match(r'if\s+(.+?)\s+(print .+?)\s+else\s+(print .+)', s, re.I)
            if m_inline:
                cond_text = m_inline.group(1).strip().capitalize()
                yes_text = m_inline.group(2).strip().capitalize()
                no_text = m_inline.group(3).strip().capitalize()

                decision_id = get_node(f"If {cond_text}?", "{}")
                yes_id = get_node(yes_text)
                no_id = get_node(no_text)

                if prev_node:
                    edges.append((prev_node, decision_id, ""))
                edges.append((decision_id, yes_id, "Yes"))
                edges.append((decision_id, no_id, "No"))

                prev_node = yes_id
                continue

            m_else = re.match(r'^(?:else|otherwise)\s*(?:->|:)?\s*(.+)$', s, re.I)
            if m_else and pending_no:
                no_text = m_else.group(1).strip().capitalize()
                no_id = get_node(no_text)
                edges.append((pending_no, no_id, "No"))
                pending_no = None
                continue
            
            lower = s.lower()
            if any(w in lower for w in ["start", "begin"]):
                cur_id = start_id
            elif any(w in lower for w in ["end", "stop", "finish", "terminate"]):
                cur_id = get_node("End", "()")
            else:
                cur_id = get_node(s.capitalize(), "[]")

            if prev_node and prev_node != cur_id:
                edges.append((prev_node, cur_id, ""))
            prev_node = cur_id

        if not any("end" in n[1].lower() for n in nodes_data):
            end_id = get_node("End", "()")
            if prev_node:
                edges.append((prev_node, end_id, ""))

        mermaid = "flowchart TD\n"
        for nid, label, shape in nodes_data:
            safe_lbl = label.replace('"', "'")
            if shape == "()":
                mermaid += f"  {nid}(\"{safe_lbl}\")\n"
            elif shape == "{}":
                mermaid += f"  {nid}{{\"{safe_lbl}\"}}\n"
            else:
                mermaid += f"  {nid}[\"{safe_lbl}\"]\n"

        for src, dst, lbl in edges:
            if src and dst:
                arrow = f" -->|{lbl}| " if lbl else " --> "
                mermaid += f"  {src}{arrow}{dst}\n"

        return {
            "nodes": [{"id": nid, "label": lbl} for nid, lbl, _ in nodes_data],
            "edges": [{"from": s, "to": d, "label": lbl} for s, d, lbl in edges if d],
            "mermaid": mermaid
        }

    elif diagram_type == "conceptMap":
        nodes = []
        edges = []
        node_map = {}
        node_counter = 1
        unique_edges = set() 

        def get_node(label):
            nonlocal node_counter
            label = label.strip()
            if not label:
                return None 
            if label not in node_map:
                node_id = f"N{node_counter}"
                node_counter += 1
                node_map[label] = node_id
                nodes.append({"id": node_id, "label": label})
            return node_map[label]

        segments = [s.strip() for s in text.split(';') if s.strip()]

        nlp_segments = [] 

        for segment in segments:
            if '->' in segment:
                try:
                    subject_phrase, object_phrase = [p.strip() for p in segment.split('->', 1)]
                    
                    relation = "includes" 
                    
                    objects_list = [o.strip() for o in object_phrase.split(',')]
                    
                    s_id = get_node(subject_phrase)

                    for obj in objects_list:
                        if obj:
                            o_id = get_node(obj)
                            if s_id and o_id:
                                edge_tuple = (s_id, o_id, relation)
                                if edge_tuple not in unique_edges:
                                    unique_edges.add(edge_tuple)
                                    edges.append({"from": s_id, "to": o_id, "label": relation})
                except ValueError:
                    nlp_segments.append(segment)
            else:
                nlp_segments.append(segment)
                
        nlp_text = ". ".join(nlp_segments)
        if not nlp_text:
            pass
        else:
            doc = nlp(nlp_text)

            for sent in doc.sents:
                for token in sent:
                    if token.pos_ == "VERB":
                        verb_token = token
                        subjects = []
                        objects = []
                        for child in verb_token.lefts:
                            if child.dep_ in ("nsubj", "nsubjpass"):
                                start_index = child.i 
                                end_index = list(child.subtree)[-1].i + 1
                                subject_span = doc[start_index:end_index] 
                                subjects.append(subject_span.text.strip()) 
                        
                        for child in verb_token.rights:
                            if child.dep_ in ("dobj", "attr", "oprd"): 
                                start_index = child.i 
                                end_index = list(child.subtree)[-1].i + 1
                                object_span = doc[start_index:end_index]
                                objects.append(object_span.text.strip())
                            
                            elif child.dep_ == "prep": 
                                pobj = [w for w in child.rights if w.dep_ == "pobj"]
                                if pobj:
                                    pobj_token = pobj[0]
                                    start_index = pobj_token.i 
                                    end_index = list(pobj_token.subtree)[-1].i + 1
                                    object_span = doc[start_index:end_index]
                                    objects.append(object_span.text.strip())
                            
                            elif child.dep_ in ("advcl", "xcomp"): 
                                inf_verb = child 
                                inf_objects = []
                                for inf_child in inf_verb.rights:
                                    if inf_child.dep_ in ("dobj", "attr"):
                                        start_index = inf_child.i 
                                        end_index = list(inf_child.subtree)[-1].i + 1
                                        object_span = doc[start_index:end_index]
                                        inf_objects.append(object_span.text.strip())

                                if subjects and inf_objects:
                                    for s in subjects:
                                        for o in inf_objects:
                                            s_id = get_node(s)
                                            o_id = get_node(o)
                                            relation_lemma = inf_verb.lemma_ 
                                            edge_tuple = (s_id, o_id, relation_lemma)
                                            if edge_tuple not in unique_edges:
                                                unique_edges.add(edge_tuple)
                                                edges.append({"from": s_id, "to": o_id, "label": relation_lemma})
                                continue
                        
                        for s in subjects:
                            for o in objects:
                                s_id = get_node(s)
                                o_id = get_node(o)
                                relation_lemma = verb_token.lemma_
                                edge_tuple = (s_id, o_id, relation_lemma)
                                if edge_tuple not in unique_edges:
                                    unique_edges.add(edge_tuple)
                                    edges.append({"from": s_id, "to": o_id, "label": relation_lemma})


        mermaid = "graph TD\n"
        for node in nodes:
            safe_label = node["label"].replace('"', "'")
            mermaid += f'  {node["id"]}[{safe_label}]\n'
        for edge in edges:
            lbl = edge.get("label", "")
            arrow = f" -->|{lbl}| " if lbl else " --> "
            mermaid += f'  {edge["from"]}{arrow}{edge["to"]}\n'

        return {
            "nodes": nodes,
            "edges": edges,
            "mermaid": mermaid
        }
    return result