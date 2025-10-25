import sys
import json
import io
from ML_module import parse_file, generate_summary, generate_diagram
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
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
    print(text)

elif mode == "summary":
    print(json.dumps(generate_summary(text), ensure_ascii=False))

elif mode == "diagram":
    diagram_data = generate_diagram(text, diagram_type)
    print(json.dumps(diagram_data, ensure_ascii=False))