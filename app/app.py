import os
import psutil
from flasgger import Swagger
from flask import Flask, jsonify, request, send_from_directory, flash
from werkzeug.utils import secure_filename
from flask_socketio import SocketIO, emit, disconnect
import time
import asyncio

app = Flask(__name__, static_folder="../web/build")
swagger = Swagger(app)

# Secret key for JWT and app
app.secret_key = os.getenv("SECRET_KEY", "super_secret_key")

# Configure JWT
app.config["JWT_SECRET_KEY"] = app.secret_key  # Change this to a secure value

# Custom config
app.config["UPLOAD_PATH"] = os.path.join(app.root_path, "uploads")
app.config["ALLOWED_EXTENSIONS"] = ["mp4", "avi", "mov", "mkv"]
app.config["MAX_CONTENT_LENGTH"] = 500 * 1024 * 1024  # 100MB file size limit

# Ensure the upload directory exists
if not os.path.exists(app.config["UPLOAD_PATH"]):
    os.makedirs(app.config["UPLOAD_PATH"])

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in app.config["ALLOWED_EXTENSIONS"]
    )


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


@app.route("/process_test", methods=["PUT"])
async def process_test():
    await asyncio.sleep(5)
    return jsonify({"message": "Processing complete"})

@app.route("/video", methods=["POST"])
def upload_file():
    """
    Upload a video file to the server.
    ---
    tags:
      - File Upload
    consumes:
      - multipart/form-data
    parameters:
      - name: file
        in: formData
        type: file
        required: true
        description: The video file to upload
    responses:
      200:
        description: File successfully uploaded
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "File uploaded successfully"
      400:
        description: Invalid file format or no file provided
    """
    if "file" not in request.files:
        flash("No file part")
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config["UPLOAD_PATH"], filename))
        return jsonify({"message": "File uploaded successfully"}), 200
    else:
        return jsonify({"error": "Invalid file format"}), 400


@app.route("/telemetry", methods=["GET"])
def telemetry():
    """
    Retrieve system telemetry data like CPU, memory, and disk usage.
    ---
    tags:
      - Telemetry
    responses:
      200:
        description: Returns telemetry data
        content:
          application/json:
            schema:
              type: object
              properties:
                cpu_usage:
                  type: number
                  example: 45.5
                memory_usage:
                  type: object
                  properties:
                    total:
                      type: number
                      example: 17179869184
                    available:
                      type: number
                      example: 8589934592
                    percent:
                      type: number
                      example: 50.0
                disk_usage:
                  type: object
                  properties:
                    total:
                      type: number
                      example: 107374182400
                    used:
                      type: number
                      example: 53687091200
                    free:
                      type: number
                      example: 53687091200
                    percent:
                      type: number
                      example: 50.0
    """
    # CPU usage percentage
    cpu_usage = psutil.cpu_percent(interval=1)

    # Memory usage info
    memory_info = psutil.virtual_memory()
    memory_usage = {
        "total": memory_info.total,
        "available": memory_info.available,
        "percent": memory_info.percent,
    }

    # Disk usage info
    disk_info = psutil.disk_usage("/")
    disk_usage = {
        "total": disk_info.total,
        "used": disk_info.used,
        "free": disk_info.free,
        "percent": disk_info.percent,
    }

    telemetry_data = {
        "cpu_usage": cpu_usage,
        "memory_usage": memory_usage,
        "disk_usage": disk_usage,
    }

    return jsonify(telemetry_data)


@socketio.on("start_updates")
def handle_updates():
    """
    After file upload, this WebSocket connection is established.
    Sends 3 update messages, one every second, and then disconnects.
    """
    # Send 3 updates, 1 per second
    for i in range(1, 4):
        update_message = f"Processing update {i}/3"
        emit("update", {"message": update_message})
        time.sleep(1)  # Simulate delay in sending updates

    # Disconnect the WebSocket after sending the updates
    emit("complete", {"message": "All updates sent, closing connection."})
    disconnect()


if __name__ == "__main__":
    socketio.run(app, debug=True, host="0.0.0.0", port=5000)
