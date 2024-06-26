from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

# Database configuration for Amazon RDS
DB_HOST = 'a2-cloud-db.cexbdtzbfx7n.us-east-1.rds.amazonaws.com'
DB_USER = 'admin'
DB_PASSWORD = 'admin123'
DB_DATABASE = 'database_a2'

# Function to establish database connection
def connect_db():
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_DATABASE
        )
        return conn
    except mysql.connector.Error as err:
        return None

# Function to set up the database table
def setup_database():
    conn = connect_db()
    if conn:
        cursor = conn.cursor()

        # Drop table if exists
        cursor.execute("DROP TABLE IF EXISTS products")

        # Create table
        cursor.execute("""
            CREATE TABLE products (
                name VARCHAR(100),
                price VARCHAR(100),
                availability BOOLEAN
            )
        """)
        conn.commit()
        cursor.close()
        conn.close()

# Initialize the database table on application startup
setup_database()

# Endpoint to store products
@app.route('/store-products', methods=['POST'])
def store_products():
    try:
        # Receive and parse JSON body
        data = request.json

        # Connect to the database
        conn = connect_db()
        if conn:
            cursor = conn.cursor()
            for product in data.get('products', []):
                cursor.execute("""
                    INSERT INTO products (name, price, availability)
                    VALUES (%s, %s, %s)
                """, (product['name'], product['price'], product['availability']))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"message": "Success."}), 200  # Response format adjusted to match the requirement
        else:
            return jsonify({"error": "Failed to connect to database"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Endpoint to list products
@app.route('/list-products', methods=['GET'])
def list_products():
    try:
        # Connect to the database
        conn = connect_db()
        if conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name, price, availability FROM products")
            products = cursor.fetchall()
            cursor.close()
            conn.close()
            result = [{'name': row[0], 'price': row[1], 'availability': bool(row[2])} for row in products]
            return jsonify({'products': result}), 200  # Response formatted as required
        else:
            return jsonify({"error": "Failed to connect to database"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)
