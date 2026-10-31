import os
import httpx
from typing import Dict, Any, Optional
from app.config import settings

class MultimodalAIService:
    """
    Multimodal AI Service Hub.
    Coordinates between external Multimodal LLMs (Google Gemini / OpenAI)
    and FoodVerse's local Computer Vision & NLP feature engines.
    """
    def __init__(self):
        self.gemini_api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        self.openai_api_key = settings.OPENAI_API_KEY or os.environ.get("OPENAI_API_KEY", "")

    def is_gemini_available(self) -> bool:
        return bool(self.gemini_api_key and len(self.gemini_api_key.strip()) > 10)

    async def call_gemini_chat(self, prompt: str, system_instruction: str = "") -> Optional[str]:
        if not self.is_gemini_available():
            return None
            
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={self.gemini_api_key}"
        headers = {"Content-Type": "application/json"}
        
        payload: Dict[str, Any] = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        }
        if system_instruction:
            payload["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }
            
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(url, json=payload, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts:
                            return parts[0].get("text", "")
        except Exception:
            return None
        return None

multimodal_ai_hub = MultimodalAIService()
