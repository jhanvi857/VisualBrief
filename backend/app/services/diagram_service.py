import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from ML.ML_module import generate_diagram

def generate_diagram_from_file(file_path: str, diagram_type: str):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()

        diagram = generate_diagram(text, diagram_type)
        return diagram

    except Exception as e:
        raise Exception(f"Diagram generation failed: {str(e)}")


def generate_diagram_from_text(text: str, diagram_type: str):
    try:
        diagram = generate_diagram(text, diagram_type)
        return diagram

    except Exception as e:
        raise Exception(f"Diagram generation failed: {str(e)}")
