import os

from flask import Flask, jsonify, send_from_directory

app = Flask(__name__, static_folder='../web/build')
app.secret_key = os.getenv('SECRET_KEY', 'secret string')

# Custom config
app.config['UPLOAD_PATH'] = os.path.join(app.root_path, 'uploads')
app.config['ALLOWED_EXTENSIONS'] = ['png', 'jpg', 'jpeg', 'gif']


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@app.route('/api', methods=['GET'])
def home():
    return jsonify({'message': 'Hello from Flask backend!'})


if __name__ == '__main__':
    app.run(debug=True)
