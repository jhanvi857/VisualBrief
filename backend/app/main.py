from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.summarizer import router as summarizer_router
from app.routers.auth import router as auth_router
import os
app = FastAPI(title="DocSummarizer",version=1.0)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://visual-brief.vercel.app/"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(summarizer_router, prefix="/api")
app.include_router(auth_router, prefix="/api")

@app.get("/ping")
def ping():
    return {"message": "pong"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000))
    )