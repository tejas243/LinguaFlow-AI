
import logging
import os
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai

# --------------------------------------------------
# Logging and environment configuration
# --------------------------------------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("linguaflow")

load_dotenv(Path(__file__).with_name(".env"))

MODEL_NAME = "gemini-3.8-flash"

CHROME_EXTENSION_ORIGIN = (
    "chrome-extension://ealkgdjdgpamlcfbegibhbponbhimefce"
)

# --------------------------------------------------
# FastAPI application
# --------------------------------------------------

app = FastAPI(
    title="LinguaFlow AI API",
    description="AI writing assistant backend for LinguaFlow AI.",
    version="0.4.0",
)

# --------------------------------------------------
# CORS configuration
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[CHROME_EXTENSION_ORIGIN],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

# --------------------------------------------------
# Request and response models
# --------------------------------------------------

class ConvertRequest(BaseModel):
    text: str = Field(min_length=1, max_length=3000)
    mode: Literal["professional", "casual", "grammar"] = "professional"


class ConvertResponse(BaseModel):
    status: str
    mode: str
    result: str


# --------------------------------------------------
# API endpoints
# --------------------------------------------------

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

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key or api_key == "PASTE_YOUR_KEY_HERE":
        raise HTTPException(
            status_code=503,
            detail=(
                "AI service is not configured. "
                "Check the GEMINI_API_KEY environment variable."
            ),
        )

    instructions = {
        "professional": (
            "Translate the message into natural English and rewrite it "
            "in a polished, respectful, professional style suitable "
            "for work or college communication."
        ),
        "casual": (
            "Translate the message into natural, friendly English. "
            "Make it sound casual, conversational, and human."
        ),
        "grammar": (
            "Translate the message into English and correct grammar, "
            "spelling, and punctuation. Keep the meaning and intended "
            "tone as close to the original as possible."
        ),
    }

    prompt = f"""
You are LinguaFlow AI, a multilingual writing and translation assistant.

TASK:
{instructions[request.mode]}

MANDATORY LANGUAGE RULES:
- The final output MUST ALWAYS be in English.
- The input may be Marathi, Hindi, Hinglish, English, or any other language.
- Understand the complete meaning of the input before translating.
- If the input mixes languages, express its complete meaning in natural English.
- Never return Marathi, Hindi, Hinglish, or another non-English language.
- Do not merely transliterate non-English words into English letters.
- Use correct, natural English rather than a word-for-word translation.

STYLE RULES:
- Professional: polite, clear, polished, and professional English.
- Casual: friendly, natural, conversational English.
- Grammar: accurate English with corrected grammar, spelling, and punctuation.

CONTENT RULES:
- Preserve the original meaning, intent, names, facts, and important details.
- Do not invent details or change the user's intended message.
- If the input is already in English, apply the selected writing style.
- Return ONLY the final English message.
- Do not include explanations, headings, labels, or quotation marks.

User's selected mode: {request.mode}

Message to convert:
{text}
"""

    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
        )

        result = (response.text or "").strip()

        if not result:
            raise HTTPException(
                status_code=502,
                detail=(
                    "The AI returned an empty response. "
                    "Please try again."
                ),
            )

        return ConvertResponse(
            status="success",
            mode=request.mode,
            result=result,
        )

    except HTTPException:
        raise

    except Exception:
        logger.exception("Gemini conversion request failed")

        raise HTTPException(
            status_code=502,
            detail=(
                "AI conversion failed. Check the server logs "
                "for details and try again."
            ),
        )
