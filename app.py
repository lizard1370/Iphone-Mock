from flask import Flask, request, jsonify, send_from_directory, render_template, abort
from werkzeug.utils import secure_filename
from pathlib import Path
import json
import time
import threading

# Configuration
UPLOAD_FOLDER = Path("uploads")
METADATA_FILE = Path("videos.json")
ALLOWED_EXT = {".mp4", ".webm", ".ogg", ".mov", ".m4v"}  # common video formats
MAX_CONTENT_LENGTH = 1024 * 1024 * 1024  # 1 GB limit per upload (adjust if you want)

UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)
if not METADATA_FILE.exists():
    METADATA_FILE.write_text("[]", encoding="utf-8")

lock = threading.Lock()

app = Flask(__name__, static_folder="static", template_folder="templates")
app.config["UPLOAD_FOLDER"] = str(UPLOAD_FOLDER)
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH

def read_metadata():
    with lock:
        try:
            return json.loads(METADATA_FILE.read_text(encoding="utf-8"))
        except Exception:
            return []

def write_metadata(data):
    with lock:
        METADATA_FILE.write_text(json.dumps(data, indent=2), encoding="utf-8")

def allowed_file(filename):
    return Path(filename).suffix.lower() in ALLOWED_EXT

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload():
    """
    Expects form-data with:
     - file (video)
     - title (optional)
    Returns JSON with new video metadata on success.
    """
    if "file" not in request.files:
        return jsonify({"error": "no file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "no file selected"}), 400
    filename = secure_filename(file.filename)
    if not allowed_file(filename):
        return jsonify({"error": "file type not allowed"}), 400

    # ensure unique filename
    base = Path(filename).stem
    ext = Path(filename).suffix
    timestamp = int(time.time() * 1000)
    out_name = f"{base}_{timestamp}{ext}"
    out_path = UPLOAD_FOLDER / out_name
    file.save(out_path)

    title = request.form.get("title") or Path(filename).stem
    desc = request.form.get("desc") or ""

    meta = {
        "id": f"{int(time.time())}_{timestamp}",
        "title": title,
        "desc": desc,
        "filename": out_name,
        "url": f"/uploads/{out_name}",
        "created_at": int(time.time())
    }

    data = read_metadata()
    # newest first
    data.insert(0, meta)
    write_metadata(data)
    return jsonify(meta), 201

@app.route("/videos", methods=["GET"])
def videos():
    """Return metadata array."""
    data = read_metadata()
    return jsonify(data)

@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    # serve file from uploads folder
    file_path = UPLOAD_FOLDER / filename
    if not file_path.exists():
        abort(404)
    return send_from_directory(str(UPLOAD_FOLDER), filename)

# Simple static file serving for CSS/JS happens via Flask static folder (/static/...)
# Run
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
