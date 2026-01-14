from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os
import shutil
import uuid
from app.config import UPLOAD_DIR
from app.api.generate_visual_brief import generate_visual_brief
from app.summaries import get_current_user_id_inline
from app.supabase_client import supabase
import pdfplumber
import docx

router = APIRouter()
security = HTTPBearer()
os.makedirs(UPLOAD_DIR, exist_ok=True)


def extract_text(file_path: str) -> str:
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
    else:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            raise Exception(f"Text file reading failed: {str(e)}")


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    diagramType: str = Form("flowchart"),
    current_user_id: uuid.UUID = Depends(get_current_user_id_inline)
):
    file_path = None
    
    try:
        unique_filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        text = extract_text(file_path)
        visual_brief = generate_visual_brief(text, diagramType)
        
        if not visual_brief.get("success", True):
            return visual_brief

        new_brief_id = str(uuid.uuid4())
        insert_data = {
            "id": new_brief_id,
            "user_id": str(current_user_id),
            "file_name": file.filename,
            "summary_type": diagramType,
            "summary_content": visual_brief.get("logic", []),
            "diagram_content": visual_brief,
        }
        
        response = supabase.table("summaries").insert(insert_data).execute()

        if not response.data:
            raise Exception("Failed to insert into database - no data returned")

        if file_path and os.path.exists(file_path):
            os.remove(file_path)

        return {
            "briefId": new_brief_id,
            **visual_brief
        }

    except HTTPException:
        raise
        
    except Exception as e:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
            
        print(f"Upload processing failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Processing failed: {str(e)}"
        )


@router.post("/upload-demo")
async def upload_file_demo(
    file: UploadFile = File(...),
    diagramType: str = Form("flowchart")
):
    # demo upload endpoint.
    file_path = None
    
    try:
        unique_filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        text = extract_text(file_path)
        visual_brief = generate_visual_brief(text, diagramType)

        if file_path and os.path.exists(file_path):
            os.remove(file_path)

        return visual_brief

    except Exception as e:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
            
        print(f"demo upload processing failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Processing failed: {str(e)}"
        )


@router.post("/diagram")
async def custom_diagram(body: dict):
    text = body.get("text")
    diagramType = body.get("diagramType", "flowchart")

    if not text:
        raise HTTPException(
            status_code=400,
            detail="Missing text"
        )

    try:
        visual_brief = generate_visual_brief(text, diagramType)
        return visual_brief
    except Exception as e:
        print(f"Visual brief generation failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Visual brief generation failed: {str(e)}"
        )