from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import shutil
from config import UPLOAD_DIR
from app.services.nlp_service import generate_summary
from app.services.diagram_service import generate_diagram_from_text
import pdfplumber
import docx

router = APIRouter()
os.makedirs(UPLOAD_DIR, exist_ok=True)


def extract_text(file_path: str) -> str:
    """Extract text from PDF, DOCX or TXT files."""
    if file_path.endswith(".pdf"):
        try:
            with pdfplumber.open(file_path) as pdf:
                return "\n".join(page.extract_text() or "" for page in pdf.pages)
        except Exception as e:
            raise Exception(f"PDF extraction failed: {str(e)}")
    elif file_path.endswith(".docx"):
        try:
            doc = docx.Document(file_path)
            return "\n".join([p.text for p in doc.paragraphs])
        except Exception as e:
            raise Exception(f"DOCX extraction failed: {str(e)}")
    else:  # txt or other plain text
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            raise Exception(f"Text file reading failed: {str(e)}")


@router.post("/upload")
async def upload_file(file: UploadFile = File(...), diagramType: str = "flowchart"):
    try:
        file_path = f"{UPLOAD_DIR}/{file.filename}"

        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract text
        text = extract_text(file_path)

        # Generate summary and diagram
        summary = generate_summary(text)
        diagram = generate_diagram_from_text(text, diagramType)

        # Delete uploaded file
        os.remove(file_path)

        return {"summary": summary, "diagram": diagram}

    except Exception as e:
        raise HTTPException(500, f"Processing failed: {str(e)}")


@router.post("/diagram")
async def custom_diagram(body: dict):
    text = body.get("text")
    diagramType = body.get("diagramType")

    if not text or not diagramType:
        raise HTTPException(400, "Missing text or diagramType")

    diagram = generate_diagram_from_text(text, diagramType)
    return {"diagram": diagram}
