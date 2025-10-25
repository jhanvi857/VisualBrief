# VisualBrief : ML CONCEPTS 
### This module handles text parsing, summarization, and diagram generation. It uses Python and popular NLP libraries to convert raw documents into structured information.

# 1. File Parsing (parse_file)

### purpose: Convert uploaded documents (PDF, DOCX, TXT) into plain text.

### Libraries:

- pdfplumber : extract text from PDFs.

- python-docx : read DOCX files.

- Standard open() : read TXT files.

## How it works:
```bash
if file.endswith(".pdf"):
    use pdfplumber to read each page
elif file.endswith(".docx"):
    read paragraphs
else:
    read text file
```
#### Output: Plain text string for summarization or diagram generation.

# 2. Summary Generation (generate_summary)

### purpose: Create a short extractive summary from the document text by picking the most important sentences, instead of just taking the first few sentences. This ensures that the summary covers the main topics, key entities, and important ideas in the document.

### Library: NLTK:
- sent_tokenize → splits text into sentences.
- word_tokenize → splits sentences into words.
- stopwords → helps ignore common words like “the”, “is”, “and”.

Logic:

- Split the document into sentences using sent_tokenize.
- Flatten all words from the document, filter out stopwords and non-alphabetic words.
- Count word frequencies to understand which words are important.
- Score each sentence by summing the frequencies of words in that sentence.
- Pick top n sentences with the highest scores (default n=5).
- Combine selected sentences to form the summary.

## code snippet : 
```bash
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from collections import Counter
import nltk

nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)

def generate_summary(text, n=5):
    stop_words = set(stopwords.words('english'))
    sentences = sent_tokenize(text)
    words = [word.lower() for word in word_tokenize(text) 
             if word.isalpha() and word.lower() not in stop_words]
    freq = Counter(words)
    
    sentence_scores = {}
    for sent in sentences:
        sent_words = [w.lower() for w in word_tokenize(sent) if w.isalpha()]
        sentence_scores[sent] = sum(freq.get(w, 0) for w in sent_words)
    
    top_sentences = sorted(sentence_scores, key=sentence_scores.get, reverse=True)[:n]
    summary = " ".join(top_sentences)
    
    return {"title": "Document Summary", "content": summary}
```
### Output Format (JSON):
```bash
{
  "title": "Document Summary",
  "content": "Most important sentences from the text..."
}
```

# 3. Diagram Generation (generate_diagram)
### purpose: Convert text into structured diagrams.

### Steps:

1. Extract entities & relations with SpaCy:
```bash
import spacy
nlp = spacy.load("en_core_web_sm")

doc = nlp(text)
entities = set()
relations = []

for chunk in doc.noun_chunks:
    entities.add(chunk.text.strip())

for token in doc:
    if token.pos_ == "VERB":
        subjects = [child for child in token.children if child.dep_ in ["nsubj", "nsubjpass"]]
        objects = [child for child in token.children if child.dep_ in ["dobj", "pobj"]]
        for subj in subjects:
            for obj in objects:
                relations.append((subj.text, token.lemma_, obj.text))
```

2. Build nodes and edges:
```bash
nodes = [{"id": i, "label": entity} for i, entity in enumerate(entities)]
edges = [{"from": nodes.index(next(n for n in nodes if n["label"]==subj)),
          "to": nodes.index(next(n for n in nodes if n["label"]==obj)),
          "label": verb
         } for subj, verb, obj in relations]
```

3. Convert to Mermaid.js format:

graph TD
  1 [AI] --> |improve| 2 [Learning]


Output: JSON with nodes, edges, mermaid.

# 4. ML Processor (processor.py)

### purpose: Acts as a single entry point for Node.js.

### Usage:

- python processor.py parse <file> : parse file

- python processor.py summary <file> : generate summary

- python processor.py diagram <file> : generate diagram

## Workflow:

- Read file or stdin input.

- Call ML functions.

- Output JSON for Node.js to read.
