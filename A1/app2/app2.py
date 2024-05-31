import csv
import os
from flask import Flask, request, jsonify

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

@app.route("/sum", methods=["POST"])
def sum_product():
    data = request.get_json()
    file = data.get("file")
    product = data.get("product")
    total_sum = 0

    # Construct the relative path to the file from the parent directory
    file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'files', file)
    
    try:
        with open(file_path) as csvfile:
            csv_reader = csv.reader(csvfile, delimiter=',')
            
            for row in csv_reader:
                if len(row) != 2:
                    return jsonify({ 
                        "file": file, 
                        "error": "Input file not in CSV format." 
                    }), 400
                if row[0] == product:
                    total_sum += int(row[1])

    except FileNotFoundError:
        return jsonify({ 
            "file": file, 
            "error": "File not found." 
        }), 404
    except Exception as e:
        return jsonify({
            "file": file,
            "error": str(e)
        }), 500

    return jsonify({ 
        "file": file, 
        "sum": total_sum 
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7000)
