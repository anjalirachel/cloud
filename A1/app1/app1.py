# app1.py
from flask import Flask, request, jsonify
import requests
import os

app1 = Flask(__name__)

@app1.route('/calculate', methods=['POST'])
def calculate():
    data = request.json

    if not data or 'file' not in data or data['file'] is None:
        return jsonify({"file": None, "error": "Invalid JSON input."})

    filename = os.path.join('/app', data['file'])
    product = data.get('product', '')

    if not os.path.exists(filename):
        return jsonify({"file": data['file'], "error": "File not found."})

    response = requests.post('http://app2:7000/process', json={"file": filename, "product": product})
    return jsonify(response.json())

if __name__ == '__main__':
    app1.run(host='0.0.0.0', port=6000)
