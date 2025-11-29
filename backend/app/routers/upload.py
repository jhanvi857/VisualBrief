from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
import uuid
from app.utils.jwt_handler import decode_access_token
from app.supabase_client import supabase 
from app.summaries import get_current_user_id_inline 

router = APIRouter()

@router.post("/upload")
async def upload_file_and_generate_summary(
    file: UploadFile = File(...),
    diagramType: str = Form(..., alias="diagramType"), 
    current_user_id: uuid.UUID = Depends(get_current_user_id_inline)
):
    summary_data = {
        "bullets": ["Mock key point 1", "Mock key point 2"],
        "keyQuotes": ["Mock quote"],
    }
    
    try:
        response = (
            supabase.table("summaries")
            .insert({
                "user_id": str(current_user_id), 
                "file_name": file.filename, 
                "summary_type": diagramType,
                "summary_content": summary_data, 
            })
            .execute()
        )
        
        return {"success": True, "summary_id": response.data[0]['id']}
        
    except Exception as e:
        print(f"Supabase INSERT failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save summary record to the database."
        )
