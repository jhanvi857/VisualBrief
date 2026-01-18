from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uuid
from app.utils.jwt_handler import decode_access_token 
from jose import JWTError
from app.supabase_client import supabase

router = APIRouter()
security = HTTPBearer()

def get_current_user_id_inline(credentials: HTTPAuthorizationCredentials = Depends(security)) -> uuid.UUID:
    token = credentials.credentials
    
    try:
        payload = decode_access_token(token) 
        
        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token is invalid or expired.",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        user_id_str: str = payload.get("user_id")
        
        if user_id_str is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: User ID not found.",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        return uuid.UUID(user_id_str)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed.",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.get("/summaries")
def get_summaries(current_user_id: uuid.UUID = Depends(get_current_user_id_inline)):
    try:
        from datetime import datetime
        now = datetime.utcnow().isoformat()
        
        response = (
            supabase.table("summaries")
            .select("*")
            .eq("user_id", str(current_user_id))
            .gt("expire_at", now)
            .order("created_at", desc=True)
            .execute()
        )
        
        summaries_list = response.data
        return summaries_list
        
    except Exception as err:
        print("Supabase summaries fetch error.", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Failed to fetch summaries."
        )

@router.delete("/summaries/{summary_id}")
def delete_summary(
    summary_id: uuid.UUID,
    current_user_id: uuid.UUID = Depends(get_current_user_id_inline)
):
    try:
        response = (
            supabase.table("summaries")
            .delete()
            .eq("id", str(summary_id))
            .eq("user_id", str(current_user_id))
            .execute()
        )
        
        return {"success": True, "message": "Summary deleted successfully"}
        
    except Exception as err:
        print(f"Supabase delete error for ID {summary_id}.", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete summary."
        )

@router.get("/summaries/{summary_id}")
def get_single_summary(
    summary_id: uuid.UUID, 
    current_user_id: uuid.UUID = Depends(get_current_user_id_inline)
):
    try:
        from datetime import datetime
        now = datetime.utcnow().isoformat()

        response = (
            supabase.table("summaries")
            .select("*")
            .eq("id", str(summary_id)) 
            .eq("user_id", str(current_user_id)) 
            .gt("expire_at", now)
            .limit(1)
            .execute()
        )
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Summary not found, expired, or access denied."
            )
            
        return response.data[0] 
        
    except HTTPException:
        raise
    except Exception as err:
        print(f"Supabase single summary fetch error for ID {summary_id}.", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Failed to fetch summary details."
        )