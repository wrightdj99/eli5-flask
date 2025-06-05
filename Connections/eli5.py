import cohere
import os
import re
from flask import jsonify

co = cohere.Client(os.getenv("API_KEY"))

def clean_escaped_newlines(text: str) -> str:
    return text.replace("\\n", "\n").replace("\\t", "\t").replace('\\"', '"')

def explain_like_im_5(concept: str, age: str, history=None):
    try:
        
        response = co.chat(
            model="command-nightly",
            preamble=f"You are talking to someone who is {age} years old, but they need a concept broken down into simple terms. They were originally going to just look up r/eli5, but came to you instead! Please also use backticks and good (non-markdown) formatting in your response.",
            message=concept,
            chat_history=history
        )
        
        return {"text": response.text, "history": response.chat_history}
    except Exception as e:
        return {"text": str(e), "history": "None"}