from fastapi import APIRouter,HTTPException
from pydantic import BaseModel,EmailStr
from supabase_client import supabase
from utils.password import hash_password,verify_password
router = APIRouter()

class signup(BaseModel):
    email:EmailStr
    password:str
    name:str

class Login(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup")
def signup(body:signup):
    existing_user = supabase.table("users").select("*").eq("email", body.email).execute()
    if existing_user.data and len(existing_user.data) > 0:
        raise HTTPException(400, "User with this email already exists")
    
    hashed_pw = hash_password(body.password)
    auth_response = supabase.auth.sign_up({
        "email": body.email,
        "name":body.name,
        "password": hashed_pw,
        "role": "free",
        "credits": 5
    })

    if auth_response.get("error"):
        raise HTTPException(400, auth_response["error"]["message"])

    user = auth_response["data"]["user"]
    
    
    db_response = supabase.table("users").insert({
        "id": user["id"],
        "email": body.email,
        "name": body.name,
        "role": "free",
        "credits": 5
    }).execute()

    if db_response.error:
        raise HTTPException(500, db_response.error.message)

    return {"user": user}

@router.post("/login")
def login(body: Login):
    user_resp = supabase.table("users").select("*").eq("email", body.email).execute()
    if not user_resp.data or len(user_resp.data) == 0:
        raise HTTPException(400, "Invalid credentials")
    
    user = user_resp.data[0]

    if not verify_password(body.password, user["password"]):
        raise HTTPException(400, "Invalid credentials")

    from utils.jwt_handler import create_access_token
    access_token = create_access_token({"user_id": user["id"], "email": user["email"]})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.post("/logout")
def logout():
    supabase.auth.sign_out()
    return {"message": "Logged out"}