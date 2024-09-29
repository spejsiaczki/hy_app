import os
import psutil
import uuid
import logging

from flasgger import Swagger
from flask import Flask, jsonify, request, send_from_directory, flash
from werkzeug.utils import secure_filename

from job_manager.artifact_manager import ArtifactManager
from job_manager.manager import JobManager

app = Flask(__name__, static_folder="../web/build")
swagger = Swagger(app)

# Job manager instances
artifacts = ArtifactManager(os.path.join(app.root_path, "temp"))
manager = JobManager(os.path.join(app.root_path, "modules"), artifacts)
job = manager.load_job(os.path.join(app.root_path, "job.yaml"))

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


@app.route("/get_job/<job_id>", methods=["GET"])
def get_job(job_id):
    path_to_result = os.path.join(app.root_path, "temp", "temp", job_id, "public", "output_merged.txt")
    
    if os.path.exists(path_to_result):
        with open(path_to_result, "r") as file:
            return jsonify(file.read())
    else:
        return jsonify({"message": "No result available"}), 102


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
        # Generate job ID
        job_id = uuid.uuid4().hex

        # Copy uploaded file to job artifact folder
        input_artifact_path = artifacts.get_artifact_path(job.input_artifact, job_id)
        file.save(os.path.join(input_artifact_path))

        artifacts.set_job_input_artifact(job_id, job.input_artifact)

        return jsonify({"message": "File uploaded successfully", "job_id": job_id}), 200
    else:
        return jsonify({"error": "Invalid file format"}), 400

@app.route("/run_job/<job_id>", methods=["POST"])
async def run_job(job_id):
    print(f"Job ID: {job_id}")
    if not str.isalnum(job_id):
        return jsonify("error", {"message": "Invalid job ID"})
    
    # if not artifacts.does_job_exist(job_id):
    #     return jsonify("error", {"message": "Job not found"})

    def update_callback(message):
        print(f"Job update: {message}")
        # emit("update", {"message": "dupa23"})

    await manager.run_job(job, job_id, update_callback)
    
    return jsonify({"message": "Job completed"})

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


# @socketio.on("start_job")
# async def handle_updates(job_id):
#     print(f"Job ID: {job_id}")
#     if not str.isalnum(job_id):
#         return emit("error", {"message": "Invalid job ID"})
    
#     if not artifacts.does_job_exist(job_id):
#         return emit("error", {"message": "Job not found"})

#     def update_callback(message):
#         print(f"Job update: {message}")
#         emit("update", {"message": "dupa23"})

#     await manager.run_job(job, job_id, update_callback)


if __name__ == "__main__":
    flask.run(app, debug=True, host="0.0.0.0", port=5000)
