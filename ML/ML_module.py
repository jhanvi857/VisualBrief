import pdfplumber, docx, spacy, nltk, json
from nltk.tokenize import sent_tokenize

nltk.download("punkt", quiet=True)
nlp = spacy.load("en_core_web_sm")  

def parse_file(file_path):
    if file_path.endswith(".pdf"):
        with pdfplumber.open(file_path) as pdf:
            return "\n".join([p.extract_text() for p in pdf.pages if p.extract_text()])
    elif file_path.endswith(".docx"):
        doc = docx.Document(file_path)
        return "\n".join([p.text for p in doc.paragraphs])
    else:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()


def generate_summary(text, sentences_count=5):
    sentences = sent_tokenize(text)
    if not sentences:
        return {"title": "Summary", "content": "No text found."}
    summary = " ".join(sentences[:sentences_count])
    return {"title": "Document Summary", "content": summary}


def extract_entities_relations(text):
    doc = nlp(text)
    entities, relations = set(), []
    for sent in doc.sents:
        subj, obj, verb = None, None, None
        for token in sent:
            if token.dep_ == "nsubj":
                subj = token.text
                entities.add(subj)
            elif token.dep_ == "dobj":
                obj = token.text
                entities.add(obj)
            elif token.pos_ == "VERB":
                verb = token.lemma_
        if subj and obj and verb:
            relations.append((subj, verb, obj))
    return list(entities), relations

def generate_diagram(text, diagram_type="flowchart"):
    entities, relations = extract_entities_relations(text)
    nodes = [{"id": i + 1, "label": ent} for i, ent in enumerate(entities)]
    edges = []
    for subj, verb, obj in relations:
        from_node = next((n for n in nodes if n["label"] == subj), None)
        to_node = next((n for n in nodes if n["label"] == obj), None)
        if from_node and to_node:
            edges.append({"from": from_node["id"], "to": to_node["id"], "label": verb})

    mermaid = "graph TD\n" if diagram_type == "flowchart" else "erDiagram\n"
    for n in nodes:
        mermaid += f"  {n['id']}[{n['label']}]\n"
    for e in edges:
        mermaid += f"  {e['from']} -->|{e['label']}| {e['to']}\n"

    return {"nodes": nodes, "edges": edges, "mermaid": mermaid}
