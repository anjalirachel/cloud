# app2.py
from flask import Flask, request, jsonify
import csv
import os

app2 = Flask(__name__)

@app2.route('/process', methods=['POST'])
def process():
    data = request.json
    filename = "/app/data/"+ data['file']
    product = data['product']

    if not os.path.exists(filename):
        print("file does not exist")
        return jsonify({"file": filename, "error": "File not found."})
    try:
        total = 0
        with open(filename, newline='') as csvfile:
            reader = csv.reader(csvfile, delimiter=',')
            headers = next(reader, None)

            # Check if headers contain exactly two columns: 'product' and 'amount'
            if headers != ['product', 'amount']:
                return jsonify({"file": data['file'], "error": "Input file not in CSV format."})

            for row in reader:
                if len(row) != 2:
                    return jsonify({"file": data['file'], "error": "Input file not in CSV format."})

                row_product, row_amount = row
                row_amount = int(row_amount)
                if row_product == product:
                    total += row_amount

        return jsonify({"file": data['file'], "sum": total})
    except (csv.Error, ValueError):
        return jsonify({"file": data['file'], "error": "Input file not in CSV format."})

if __name__ == '__main__':
    app2.run(host='0.0.0.0', port=7000)
	