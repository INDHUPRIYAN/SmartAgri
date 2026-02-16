# Try to import google.generativeai, but handle if not available
GEMINI_AVAILABLE = False
genai = None

try:
    import importlib
    genai_module = importlib.import_module("google.generativeai")
    from app.config import settings
    genai_module.configure(api_key=settings.GOOGLE_API_KEY)
    genai = genai_module
    GEMINI_AVAILABLE = True
except ImportError:
    pass

async def ask_gemini(prompt: str, target_lang: str = "en") -> str:
    """
    Sends prompt to Gemini and returns plain text response.
    """
    if not GEMINI_AVAILABLE or genai is None:
        return "Error: Gemini API not available. Please install google-generativeai package."
    
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = await model.generate_content_async(prompt)

        if hasattr(response, "text"):
            return response.text.strip()
        elif response.candidates:
            return response.candidates[0].content.parts[0].text.strip()
        else:
            return "Error: No response from Gemini"

    except Exception as e:
        return f"Error: {str(e)}"