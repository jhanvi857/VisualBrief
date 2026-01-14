import re

def normalize_text(text: str) -> str:
    if not text:
        return ""
    # refactoring user input.
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'^\s*[•\-\*]\s*', '', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*\d+[\.\)]\s*', '', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*[a-zA-Z][\.\)]\s*', '', text, flags=re.MULTILINE)
    lines = text.split('\n')
    processed_lines = []
    for line in lines:
        s = line.strip()
        if s:
            if not s[-1] in ".!?":
                s += "."
            processed_lines.append(s)
    
    text = " ".join(processed_lines)
    
    # 4. normalize punctuation
    text = re.sub(r'\s+([,.!?])', r'\1', text) 
    text = re.sub(r'([,.!?])(?=[^\s])', r'\1 ', text) 
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()
