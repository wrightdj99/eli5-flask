from flask import Flask, request, jsonify
from Connections.eli5 import explain_like_im_5
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.get("/")
def home():
    return jsonify({"message": "Hello and welcome."}), 200

@app.post("/submit")
def handle_request():
    data = request.get_json()
    if (data):
        answer = explain_like_im_5(data["request"], data["age"], data["history"] or [])
        serialized_history = [
            {"role": getattr(msg, "role", "unknown"), "message": getattr(msg, "message", str(msg))}
            for msg in answer.get("history", [])
            if isinstance(msg, (str, object))
        ]

        return jsonify({
            "response": answer.get("text", ""),
            "history": serialized_history
        }), 200
    else:
        return jsonify({"error": "Error processing your request"}), 500