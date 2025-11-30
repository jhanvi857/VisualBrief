import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from ML.ML_module import generate_summary

def nlp_generate_summary(file_path: str):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()

        summary = generate_summary(text)
        return summary

    except Exception as e:
        raise Exception(f"Summary generation failed: {str(e)}")
