from fastapi import APIRouter, Depends, HTTPException, status
import uuid
from pydantic import BaseModel, EmailStr
from app.briefs import get_current_user_id_inline
from app.supabase_client import supabase

router = APIRouter()

class UserProfileUpdate(BaseModel):
    name: str
    email: EmailStr
    company: str = None

@router.get("/user/profile")
def get_user_profile(current_user_id: uuid.UUID = Depends(get_current_user_id_inline)):
    try:
        response = (
            supabase.table("users")
            .select("*")
            .eq("id", str(current_user_id))
            .limit(1)
            .execute()
        )
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user = response.data[0]
        return {
            "id": user["id"],
            "name": user.get("name", ""),
            "email": user.get("email", ""),
            "company": user.get("company", ""),
            "created_at": user.get("created_at")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching user profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch user profile"
        )

@router.put("/user/profile")
def update_user_profile(
    profile_data: UserProfileUpdate,
    current_user_id: uuid.UUID = Depends(get_current_user_id_inline)
):
    try:
        update_data = {
            "name": profile_data.name,
            "email": profile_data.email,
            "company": profile_data.company,
        }
        
        response = (
            supabase.table("users")
            .update(update_data)
            .eq("id", str(current_user_id))
            .execute()
        )
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        updated_user = response.data[0]
        return {
            "id": updated_user["id"],
            "name": updated_user["name"],
            "email": updated_user["email"],
            "company": updated_user.get("company", ""),
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating user profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user profile"
        )

@router.delete("/user/account")
def delete_user_account(current_user_id: uuid.UUID = Depends(get_current_user_id_inline)):
    try:
        supabase.table("visual_briefs").delete().eq("user_id", str(current_user_id)).execute()
        
        response = (
            supabase.table("users")
            .delete()
            .eq("id", str(current_user_id))
            .execute()
        )
        
        return {"message": "Account deleted successfully"}
        
    except Exception as e:
        print(f"Error deleting user account: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete account"
        )