import cohere
import os
from flask import jsonify

co = cohere.Client(os.getenv("API_KEY"))

def explain_like_im_5(concept: str, age: str, history=None):
    try:
        
        response = co.chat(
            model="command-nightly",
            preamble=f"You are talking to someone who is {age} years old, but they need a concept broken down into simple terms. They were originally going to just look up r/eli5, but came to you instead!",
            message=concept,
            chat_history=history
        )
        
        return {"text": response.text, "history": response.chat_history}
    except Exception as e:
        return {"text": str(e), "history": "None"}