# app2.py
from flask import Flask, request, jsonify
import csv
import os

app2 = Flask(__name__)

@app2.route('/process', methods=['POST'])
def process():
    data = request.json
    filename = data['file']
    product = data['product']

    if not os.path.exists(filename):
        return jsonify({"file": filename, "error": "File not found."})

    try:
        total = 0
        with open(filename, newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row['product'] == product:
                    total += int(row['amount'])
        return jsonify({"file": filename, "sum": total})
    except Exception as e:
        return jsonify({"file": filename, "error": "Input file not in CSV format."})

if __name__ == '__main__':
    app2.run(host='0.0.0.0', port=7000)
