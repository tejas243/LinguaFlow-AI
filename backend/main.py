from fastapi.middleware.cors import CORSMiddleware
from typing import Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(
    title="LinguaFlow AI API",
    description="Backend API for the LinguaFlow AI Chrome extension.",
    version="0.1.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["chrome-extension://ealkgdjdgpamlcfbegibhbponbhimefce"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class ConvertRequest(BaseModel):
    text: str = Field(min_length=1, max_length=3000)
    mode: Literal["professional", "casual", "grammar"] = "professional"


class ConvertResponse(BaseModel):
    status: str
    mode: str
    result: str


@app.get("/")
def home():
    return {
        "message": "Welcome to LinguaFlow AI API!",
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "LinguaFlow AI API",
    }


@app.post("/api/convert", response_model=ConvertResponse)
def convert_message(request: ConvertRequest):
    text = request.text.strip()

    if not text:
        raise HTTPException(
            status_code=422,
            detail="Message cannot contain only whitespace.",
        )

    mode_descriptions = {
        "professional": "rewritten professionally",
        "casual": "rewritten in a friendly, casual style",
        "grammar": "checked and corrected for grammar",
    }

    result = (
        f"DEMO ONLY: Your message would be "
        f"{mode_descriptions[request.mode]} here.\n\n"
        f"Original message: {text}\n\n"
        "Real AI conversion is not connected yet."
    )

    return ConvertResponse(
        status="demo",
        mode=request.mode,
        result=result,
    )
