from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.supabase_client import supabase
from app.utils.password import hash_password, verify_password
from app.utils.jwt_handler import create_access_token
import uuid
router = APIRouter()

class Signup(BaseModel):
    email: EmailStr
    password: str
    name: str

class Login(BaseModel):
    email: EmailStr
    password: str

class GoogleLogin(BaseModel):
    email: EmailStr
    name: str

def error_response(code: str, message: str, status: int = 400):
    raise HTTPException(
        status_code=status,
        detail={
            "success": False,
            "code": code,
            "message": message
        }
    )

# @router.post("/signup")
# def signup(body: Signup):
#     existing_user = supabase.table("users").select("*").eq("email", body.email).execute()
#     if existing_user.data:
#         error_response("USER_ALREADY_EXISTS", "User with this email already exists")

#     auth_response = supabase.auth.sign_up(
#         {"email": body.email, "password": body.password}
#     )

#     if auth_response.error:
#         error_response("SUPABASE_AUTH_ERROR", auth_response.error.message)

#     user = auth_response.user
#     if not user:
#         error_response("SERVER_ERROR", "Failed to create user in Supabase Auth", 500)

#     hashed_pw = hash_password(body.password)

#     db_response = supabase.table("users").insert({
#         "id": user.id,
#         "email": body.email,
#         "name": body.name,
#         "password_hash": hashed_pw,
#         "role": "free",
#         "credits": 5
#     }).execute()

#     if db_response.error:
#         error_response("DB_INSERT_ERROR", db_response.error.message, 500)

#     return {
#         "success": True,
#         "message": "Signup successful",
#         "user": {"id": user.id, "email": user.email, "name": body.name}
#     }
# ALL ENDPOINTS DEPRECATED IN FAVOR OF SUPABASE AUTH ON FRONTEND
# @router.post("/signup")
# def signup(body: Signup):
#     existing_user = supabase.table("users").select("*").eq("email", body.email).execute()
#     if existing_user.data:
#         error_response("USER_ALREADY_EXISTS", "User with this email already exists")
# 
#     try:
#         auth_response = supabase.auth.sign_up(
#             {"email": body.email, "password": body.password}
#         )
#         user = auth_response.user
#     except Exception as e:
#         error_response("SUPABASE_AUTH_ERROR", str(e))
# 
#     if not user:
#         error_response("SERVER_ERROR", "Failed to create user in Supabase Auth", 500)
# 
#     hashed_pw = hash_password(body.password)
# 
#     db_response = supabase.table("users").insert({
#         "id": user.id,
#         "email": body.email,
#         "name": body.name,
#         "password_hash": hashed_pw,
#         "role": "free",
#         "credits": 5
#     }).execute()
# 
#     if db_response.error:
#         error_response("DB_INSERT_ERROR", db_response.error.message, 500)
# 
#     token = create_access_token({"user_id": user.id, "email": body.email})
# 
#     return {
#         "success": True,
#         "message": "Signup successful",
#         "user": {"id": user.id, "email": user.email, "name": body.name},
#         "access_token": token,
#         "token_type": "bearer"
#     }
# 
# @router.post("/login")
# def login(body: Login):
#     try:
#         result = supabase.table("users").select("*").eq("email", body.email).execute()
#         if not result.data:
#             error_response("INVALID_CREDENTIALS", "Invalid email or password", 401)
# 
#         user = result.data[0]
# 
#         if not verify_password(body.password, user["password_hash"]):
#             error_response("INVALID_CREDENTIALS", "Invalid email or password", 401)
# 
#         from app.utils.jwt_handler import create_access_token
#         token = create_access_token({
#             "user_id": user["id"],
#             "email": user["email"]
#         })
# 
#         return {
#             "success": True,
#             "access_token": token,
#             "token_type": "bearer",
#             "user": {"id": user["id"], "email": user["email"], "name": user["name"]}
#         }
# 
#     except HTTPException:
#         raise
#     except Exception as e:
#         print("LOGIN ERROR:", e)
#         error_response("SERVER_ERROR", "Internal server error", 500)
# 
# @router.post("/logout")
# def logout():
#     supabase.auth.sign_out()
#     return {"success": True, "message": "Logged out successfully"}
# 
# @router.post("/google-login")
# def google_login(body: GoogleLogin):
#     # Check if user exists
#     result = supabase.table("users").select("*").eq("email", body.email).execute()
#     if result.data:
#         user = result.data[0]
#         user_id = user["id"]
#     else:
#         # Create new user
#         new_user_id = str(uuid.uuid4())
#         supabase.table("users").insert({
#             "id": new_user_id,
#             "email": body.email,
#             "name": body.name,
#             "password_hash": "",  
#             "role": "free",
#             "credits": 5
#         }).execute()
#         user_id = new_user_id
# 
#     token = create_access_token({"user_id": user_id, "email": body.email})
# 
#     return {
#         "success": True,
#         "access_token": token,
#         "token_type": "bearer",
#         "user": {"id": user_id, "email": body.email, "name": body.name}
#     }