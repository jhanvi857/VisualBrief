import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class LLMService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("Warning: GEMINI_API_KEY not found in environment.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    def normalize_to_arrow_format(self, user_input: str, diagram_type: str) -> str:
        prompts = {
            "flowchart": "Convert the following natural language description into a strict flowchart arrow format. Use 'Start' and 'End' nodes. Decisions should be followed by 'Yes' or 'No' labels on edges. Format: Source -> Target |Label|",
            "er": "Convert the following description into a strict Entity-Relationship arrow format. Entities are nodes, relationships are edges with labels. Format: Entity1 -> Entity2 |Relationship|",
            "conceptMap": "Convert the following into a concept map using arrow format. Concepts are nodes, connections are edges with labels. Format: Concept1 -> Concept2 |Relationship|",
            "mindMap": "Convert the following into a mind map arrow format. Central idea branches into themes and sub-themes. Format: Parent -> Child |Label|"
        }
        
        system_prompt = f"""
        You are a diagram normalization engine. Your task is to extract structural relationships from natural language and output ONLY a strict arrow-based format.
        
        RULES:
        1. Output format: Source -> Target |Label|
        2. The label between pipes || is optional but preferred for flowcharts (Yes/No) and ER diagrams (Relationship).
        3. Do NOT include any conversation, explanation, or markdown formatting (like ```).
        4. Each relationship MUST be on a new line.
        5. Normalize messy or inconsistent input into clear, logical steps.
        
        Context: Generating a {diagram_type}.
        {prompts.get(diagram_type, prompts['flowchart'])}
        """
        
        full_input = f"{system_prompt}\n\nUser Input:\n{user_input}\n\nNormalized Output:"
        
        try:
            response = self.model.generate_content(full_input)
            return response.text.strip()
        except Exception as e:
            print(f"Error calling Gemini: {e}")
            return ""

llm_service = LLMService()
