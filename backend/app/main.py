from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.auth import router as auth_router
from app.routers.brief_generator import router as brief_generator
from app.briefs import router as briefs
from app.user import router as user_info
import os
app = FastAPI(title="VisualBrief", version=2.0)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://visual-brief.vercel.app"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(brief_generator, prefix="/api")
app.include_router(briefs, prefix="/api")
app.include_router(user_info, prefix="/api")

@app.get("/ping")
def ping():
    return {"message": "pong"}

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Service is healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000))
    )