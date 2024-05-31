import os
import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/calculate", methods=["POST"])
def calculate():
    data = request.get_json()

    # 1. Validate input JSON to ensure file name was provided
    try:
        if data["file"] is None:
            return jsonify({"file": None, "error": "Invalid JSON input: 'file' parameter missing."}), 400
    except KeyError:
        return jsonify({"file": None, "error": "Invalid JSON input: 'file' parameter missing."}), 400

    # 2. Construct the relative path to the file from the parent directory
    file_name = data["file"]
    file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'files', file_name)
    
    # Verify that the file exists
    if not os.path.isfile(file_path):
        return jsonify({"file": file_name, "error": "File not found."}), 404

    # 3. Send the "file" and "product" parameters to Container 2 and return response
    response = requests.post(url="http://app2_container:7000/sum", json=data, headers={'Content-Type': 'application/json'})
    return jsonify(response.json())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6000)