import json
import logging
import asyncio
from typing import Optional, Dict, Any
from backend.app.config import settings

logger = logging.getLogger(__name__)

class LLMClient:
    def __init__(self):
        self.gemini_key = settings.GEMINI_API_KEY
        self.groq_key = settings.GROQ_API_KEY

    async def generate_json(self, prompt: str, schema_desc: str = "", temperature: float = 0.1) -> Optional[Dict[str, Any]]:
        """
        Generate structured JSON from LLM.
        Primary: Gemini (gemini-2.5-flash). Fallback: Groq (openai/gpt-oss-120b).
        """
        # Try Gemini first
        if self.gemini_key:
            for model_name in ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.5-flash-lite"]:
                try:
                    res = await self._call_gemini_json(prompt, schema_desc, temperature, model_name)
                    if res is not None:
                        return res
                except Exception as e:
                    logger.warning(f"Gemini {model_name} call failed: {e}. Trying next...")

        # Fallback to Groq
        if self.groq_key:
            for model_name in ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"]:
                try:
                    res = await self._call_groq_json(prompt, schema_desc, temperature, model_name)
                    if res is not None:
                        return res
                except Exception as e:
                    logger.warning(f"Groq {model_name} call failed: {e}. Trying next...")

        logger.error("No working LLM available or all providers failed.")
        return None

    async def _call_gemini_json(self, prompt: str, schema_desc: str, temperature: float, model_name: str) -> Optional[Dict[str, Any]]:
        import google.generativeai as genai
        genai.configure(api_key=self.gemini_key)
        
        model = genai.GenerativeModel(
            model_name=model_name,
            generation_config={
                "response_mime_type": "application/json",
                "temperature": temperature
            }
        )
        
        full_prompt = f"{prompt}\n\nYou MUST return valid JSON adhering strictly to: {schema_desc}" if schema_desc else prompt
        
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, lambda: model.generate_content(full_prompt))
        
        if response and response.text:
            cleaned = response.text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            return json.loads(cleaned.strip())
        return None

    async def _call_groq_json(self, prompt: str, schema_desc: str, temperature: float, model_name: str) -> Optional[Dict[str, Any]]:
        from groq import Groq
        client = Groq(api_key=self.groq_key)
        
        full_prompt = f"{prompt}\n\nYou MUST return strictly valid JSON. Format schema: {schema_desc}" if schema_desc else prompt
        
        loop = asyncio.get_event_loop()
        chat_completion = await loop.run_in_executor(
            None,
            lambda: client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a precise data extractor that outputs only valid JSON."},
                    {"role": "user", "content": full_prompt}
                ],
                model=model_name,
                response_format={"type": "json_object"},
                temperature=temperature
            )
        )
        
        if chat_completion.choices and chat_completion.choices[0].message.content:
            raw = chat_completion.choices[0].message.content.strip()
            return json.loads(raw)
        return None

llm_client = LLMClient()
