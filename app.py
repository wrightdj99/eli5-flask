from flask import Flask, request, jsonify, send_from_directory
from Connections.eli5 import explain_like_im_5, clean_escaped_newlines
from flask_cors import CORS
import os


app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)

# --- Serve React Frontend ---
@app.route("/")
def serve_index():
    return send_from_directory(app.static_folder or "static", "index.html")

@app.route("/<path:path>")
def serve_react_app(path):
    if path.startswith("api") or path in ["submit"]:  # allow API routes through
        return "Not Found", 404
    if os.path.exists(os.path.join(app.static_folder or "static", path)):
        return send_from_directory(app.static_folder or "static", path)
    else:
        return send_from_directory(app.static_folder or "static", "index.html")


# --- Routes ---
@app.get("/api")
def home():
    return jsonify({"message": "Hello and welcome."}), 200

@app.post("/api/submit")
def handle_request():
    data = request.get_json()
    if (data):
        answer = explain_like_im_5(data["request"], data["age"], data["history"] or [])
        serialized_history = [
            {
                "role": getattr(msg, "role", "unknown"), 
                "message": getattr(msg, "message", str(msg))
            }
            for msg in answer.get("history", [])
            if isinstance(msg, (str, object))
        ]

        return jsonify({
            "response": clean_escaped_newlines(answer.get("text", "")),
            "history": serialized_history
        }), 200
    else:
        return jsonify({"error": "Error processing your request"}), 500