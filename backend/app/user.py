from fastapi import APIRouter, Depends, HTTPException, status
import uuid
from pydantic import BaseModel, EmailStr
from app.utils.auth_dependency import get_current_user_id, get_current_user_token
from app.supabase_client import supabase
from supabase import create_client
from app.config import SUPABASE_URL, SUPABASE_ANON_KEY

router = APIRouter()

class UserProfileUpdate(BaseModel):
    name: str
    email: EmailStr
    company: str = None

@router.get("/user/profile")
def get_user_profile(
    current_user_id: uuid.UUID = Depends(get_current_user_id),
    token: str = Depends(get_current_user_token)
):
    try:
        # Create a user-scoped client to respect RLS
        client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        client.postgrest.auth(token)
        
        response = (
            client.table("users")
            .select("*")
            .eq("id", str(current_user_id))
            .limit(1)
            .execute()
        )
        
        # If user missing in public table, sync from Auth
        if not response.data:
            user_response = client.auth.get_user(token)
            if user_response.user:
                email = user_response.user.email
                meta = user_response.user.user_metadata or {}
                name = meta.get("full_name", email.split("@")[0] if email else "User")
                
                # Attempt to insert/upsert
                try:
                    upsert_res = client.table("users").upsert({
                        "id": str(current_user_id),
                        "email": email,
                        "name": name,
                        "role": "free",
                        "credits": 5
                    }, on_conflict="id", ignore_duplicates=True).execute()
                except Exception as e:
                    # Check for email collision with different ID
                    if "duplicate key value violates unique constraint" in str(e) and "email" in str(e):
                        try:
                            print(f"Collision detected for email {email}. Manual cleanup required.")
                            pass 
                        except:
                            pass
                    else:
                        raise e

                # Retry fetch
                response = (
                    client.table("users")
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
            detail=f"Failed to fetch user profile: {str(e)}"
        )

@router.put("/user/profile")
def update_user_profile(
    profile_data: UserProfileUpdate,
    current_user_id: uuid.UUID = Depends(get_current_user_id),
    token: str = Depends(get_current_user_token)
):
    try:
        client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        client.postgrest.auth(token)

        update_data = {
            "name": profile_data.name,
            "email": profile_data.email,
            "company": profile_data.company,
        }
        
        response = (
            client.table("users")
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
def delete_user_account(
    current_user_id: uuid.UUID = Depends(get_current_user_id),
    token: str = Depends(get_current_user_token)
):
    try:
        client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        client.postgrest.auth(token)

        client.table("visual_briefs").delete().eq("user_id", str(current_user_id)).execute()
        
        response = (
            client.table("users")
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