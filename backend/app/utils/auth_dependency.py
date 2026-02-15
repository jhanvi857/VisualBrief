from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uuid
from app.supabase_client import supabase

security = HTTPBearer()

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> uuid.UUID:
    token = credentials.credentials
    
    try:
        # Verify token with Supabase Auth
        user_response = supabase.auth.get_user(token)
        
        if not user_response.user:
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token.",
            )
            
        user_id_str = user_response.user.id
        return uuid.UUID(user_id_str)
        
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed.",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    return credentials.credentials

def get_optional_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False))) -> uuid.UUID | None:
    if not credentials:
        return None
    
    token = credentials.credentials
    try:
        user_response = supabase.auth.get_user(token)
        if user_response.user:
            return uuid.UUID(user_response.user.id)
    except:
        pass
    return None
