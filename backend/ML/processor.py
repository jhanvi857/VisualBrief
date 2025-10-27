import sys
import json
import io
import os
import nltk
import contextlib
from ML_module import parse_file, generate_summary, generate_diagram

def suppress_output():
    """Temporarily disable stdout and stderr during setup tasks"""
    sys.stdout.flush()
    sys.stderr.flush()
    devnull = open(os.devnull, 'w')
    sys.stdout = devnull
    sys.stderr = devnull

def restore_output():
    """Restore stdout/stderr for JSON printing"""
    sys.stdout = io.TextIOWrapper(sys.__stdout__.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.__stderr__.buffer, encoding='utf-8')

suppress_output()
try:
    nltk.data.find("tokenizers/punkt")
except LookupError:
    nltk.download("punkt", quiet=True)
restore_output()

mode = sys.argv[1]
diagram_type = "flowchart"

if len(sys.argv) > 2:
    if sys.argv[2] == "-t":
        text = sys.argv[3]
        if len(sys.argv) > 4:
            diagram_type = sys.argv[4]
    else:
        file_path = sys.argv[2]
        text = parse_file(file_path)
        if len(sys.argv) > 3:
            diagram_type = sys.argv[3]
else:
    text = sys.stdin.read()

if mode == "parse":
    print(json.dumps({"text": text}, ensure_ascii=False))
elif mode == "summary":
    print(json.dumps(generate_summary(text), ensure_ascii=False))
elif mode == "diagram":
    diagram_data = generate_diagram(text, diagram_type)
    print(json.dumps(diagram_data, ensure_ascii=False))