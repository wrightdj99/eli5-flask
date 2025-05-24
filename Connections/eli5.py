import cohere
import os

co = cohere.Client(os.getenv("API_KEY"))

def explain_like_im_5(concept: str) -> str:
    prompt = f"Explain like I'm 5: {concept}"
    
    response = co.generate(
        model="command",  # Use "command" or "command-light"
        prompt=prompt,
        max_tokens=200,
        temperature=0.7,
        stop_sequences=["--"]  # optional, good for truncating long generations
    )
    
    return response.generations[0].text.strip()