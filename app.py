from flask import Flask, request
from Connections.eli5 import explain_like_im_5

app = Flask(__name__)

@app.get("/")
def home():
    return {"message": "Hello and welcome."}

@app.post("/submit")
def handle_request():
    data = request.get_json()
    if (data):
        answer = explain_like_im_5(data["request"])
        return {"response": answer}
    else:
        return {"error": "Error processing your request"}