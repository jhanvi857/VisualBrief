from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from app.services.llm_service import llm_service
from app.nlp.router import route_nlp
from app.nlp.mermaid_adapter import to_mermaid
from app.schema.diagram_schema import DiagramSchema
from app.utils.file_handler import extract_text_from_bytes
import logging

router = APIRouter(tags=["diagrams"])
logger = logging.getLogger(__name__)

@router.post("/generate-diagram")
async def generate_diagram(
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    diagram_type: str = Form(...),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
):
    from app.briefs import decode_access_token
    import uuid
    from app.supabase_client import supabase
    from app.renderers.logic_renderer import render_logic
    from app.renderers.step_renderer import render_steps
    
    current_user_id = None
    if credentials:
        try:
            payload = decode_access_token(credentials.credentials)
            if payload:
                current_user_id = payload.get("user_id")
        except:
            pass

    input_text = ""
    file_name = "Custom Text"
    
    if text:
        input_text = text
    
    if file:
        file_name = file.filename
        file_content = await file.read()
        extracted_text = extract_text_from_bytes(file_content, file.filename)
        input_text = (input_text + "\n" + extracted_text).strip()

    if not input_text:
        raise HTTPException(status_code=400, detail="No input provided.")

    # 1. Normalize
    arrow_format = llm_service.normalize_to_arrow_format(input_text, diagram_type)
    if not arrow_format:
        raise HTTPException(status_code=500, detail="Normalization failed.")

    # 2. Parse
    result_dict = route_nlp(arrow_format, diagram_type)
    
    # 3. Convert to Mermaid
    mermaid_code = ""
    steps = []
    logic = []
    
    try:
        schema_obj = DiagramSchema(**result_dict)
        mermaid_code = to_mermaid(schema_obj)
        steps = render_steps(schema_obj)
        logic = render_logic(schema_obj)
        result_dict["mermaid"] = mermaid_code
        result_dict["steps"] = steps
        result_dict["logic"] = logic
    except Exception as e:
        logger.error(f"Error converting to visual format: {e}")
        # We still return the result_dict but without mermaid if it failed
        result_dict["mermaid"] = None
        result_dict["success"] = False
        result_dict["detail"] = f"Visual conversion error: {str(e)}"
        return result_dict

    # 4. Save if logged in
    if current_user_id:
        new_id = str(uuid.uuid4())
        insert_data = {
            "id": new_id,
            "user_id": current_user_id,
            "file_name": file_name,
            "brief_type": diagram_type,
            "brief_content": logic,
            "diagram_content": {
                "mermaid": mermaid_code,
                "schema": result_dict,
                "steps": steps,
                "metadata": result_dict.get("metadata", {})
            }
        }
        supabase.table("visual_briefs").insert(insert_data).execute()
        result_dict["briefId"] = new_id

    result_dict["metadata"]["raw_arrow_format"] = arrow_format
    result_dict["success"] = True
    return result_dict
