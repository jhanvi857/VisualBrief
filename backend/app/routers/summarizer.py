from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os
import shutil
import uuid
from app.config import UPLOAD_DIR
from app.services.nlp_service import generate_summary
from app.services.diagram_service import generate_diagram_from_text
from app.summaries import get_current_user_id_inline
from app.supabase_client import supabase
import pdfplumber
import docx

router = APIRouter()
security = HTTPBearer()
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
    """Upload file, generate summary & diagram, and save to database."""
    file_path = None
    
    try:
        unique_filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        text = extract_text(file_path)
        summary = generate_summary(text)
        diagram = generate_diagram_from_text(text, diagramType)

        new_summary_id = str(uuid.uuid4())
        insert_data = {
            "id": new_summary_id,
            "user_id": str(current_user_id),
            "file_name": file.filename,
            "summary_type": diagramType,
            "summary_content": summary,
            "diagram_content": diagram,
        }
        
        response = supabase.table("summaries").insert(insert_data).execute()

        if not response.data:
            raise Exception("Failed to insert into database - no data returned")

        if file_path and os.path.exists(file_path):
            os.remove(file_path)

        return {
            "success": True,
            "summaryId": new_summary_id,
            "summary": summary,
            "diagram": diagram
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

def get_optional_user_id(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[uuid.UUID]:
    """
    Optional authentication - returns user ID if authenticated, None if not.
    This allows demo users to use the endpoint without being logged in.
    """
    if not credentials:
        return None
    
    try:
        from app.utils.jwt_handler import decode_access_token
        token = credentials.credentials
        payload = decode_access_token(token)
        
        if payload is None:
            return None
            
        user_id_str = payload.get("user_id")
        if user_id_str:
            return uuid.UUID(user_id_str)
            
    except Exception:
        pass
    
    return None

@router.post("/upload-demo")
async def upload_file_demo(
    file: UploadFile = File(...),
    diagramType: str = Form("flowchart")
):
    """
    Demo upload endpoint - NO authentication required, NO database save.
    Just processes the file and returns results for demo users.
    """
    file_path = None
    
    try:
        # Create unique filename
        unique_filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file temporarily
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract and process
        text = extract_text(file_path)
        summary = generate_summary(text)
        diagram = generate_diagram_from_text(text, diagramType)

        # Clean up temporary file
        if file_path and os.path.exists(file_path):
            os.remove(file_path)

        # ✅ Return results WITHOUT saving to database
        return {
            "success": True,
            "summary": summary,
            "diagram": diagram
            # NO summaryId - because nothing was saved
        }

    except Exception as e:
        # Clean up file on error
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
            
        print(f"❌ Demo upload processing failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Processing failed: {str(e)}"
        )


# Keep existing /diagram endpoint (no auth needed for both demo and logged-in users)
@router.post("/diagram")
async def custom_diagram(body: dict):
    """
    Generate custom diagram from text - works for everyone (demo + logged-in).
    No authentication needed, no database save.
    """
    text = body.get("text")
    diagramType = body.get("diagramType")

    if not text or diagramType is None:
        raise HTTPException(
            status_code=400,
            detail="Missing text or diagramType"
        )

    try:
        diagram = generate_diagram_from_text(text, diagramType)
        return {"diagram": diagram}
    except Exception as e:
        print(f"Diagram generation failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Diagram generation failed: {str(e)}"
        )