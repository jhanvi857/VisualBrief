import sys, json
from ML_module import parse_file, generate_summary, generate_diagram

mode = sys.argv[1]

if mode in ["summary", "diagram"]:
    if len(sys.argv) > 2 and sys.argv[2] == "-t":
        text = sys.argv[3]
        diagram_type = sys.argv[4] if len(sys.argv) > 4 else "flowchart"
    elif len(sys.argv) > 2:
        file_path = sys.argv[2]
        text = parse_file(file_path)
        diagram_type = sys.argv[3] if len(sys.argv) > 3 else "flowchart"
    else:
        text = sys.stdin.read()
        diagram_type = "flowchart"
else:
    file_path = sys.argv[2]
    text = parse_file(file_path)

if mode == "parse":
    print(text)

elif mode == "summary":
    print(json.dumps(generate_summary(text), ensure_ascii=False))

elif mode == "diagram":
    print(json.dumps(generate_diagram(text, diagram_type), ensure_ascii=False))
