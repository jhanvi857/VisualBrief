import sys
import json
import io
import os
import nltk
import contextlib
import tempfile
def silence_all():
    """Redirect stdout and stderr fully to /dev/null during setup."""
    sys.stdout.flush()
    sys.stderr.flush()
    devnull = open(os.devnull, 'w')
    sys.stdout = devnull
    sys.stderr = devnull

def restore_output():
    """Restore clean stdout and stderr after setup."""
    sys.stdout = io.TextIOWrapper(sys.__stdout__.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.__stderr__.buffer, encoding='utf-8')
silence_all()

try:
    nltk.data.find("tokenizers/punkt")
except LookupError:
    with contextlib.redirect_stdout(open(os.devnull, "w")), contextlib.redirect_stderr(open(os.devnull, "w")):
        nltk.download("punkt", quiet=True)

restore_output()
from ML_module import parse_file, generate_summary, generate_diagram

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

try:
    if mode == "parse":
        print(json.dumps({"text": text}, ensure_ascii=False))
    elif mode == "summary":
        print(json.dumps(generate_summary(text), ensure_ascii=False))
    elif mode == "diagram":
        diagram_data = generate_diagram(text, diagram_type)
        print(json.dumps(diagram_data, ensure_ascii=False))
    else:
        print(json.dumps({"error": "Invalid mode"}, ensure_ascii=False))
except Exception as e:
    print(json.dumps({"error": str(e)}, ensure_ascii=False))