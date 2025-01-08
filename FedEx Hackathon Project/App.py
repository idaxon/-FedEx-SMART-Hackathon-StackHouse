import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__, static_folder='client/build', static_url_path='/')
CORS(app)

# Database connection function
def get_db_connection():
    conn = sqlite3.connect('warehouse_sharing.db')
    conn.row_factory = sqlite3.Row
    return conn

# API endpoint to get available warehouses
@app.route('/api/warehouses', methods=['GET'])
def get_warehouses():
    location = request.args.get('location')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = '''SELECT * FROM warehouses 
               WHERE location = ? 
               AND available_from <= ? 
               AND available_until >= ?'''
    
    cursor.execute(query, (location, end_date, start_date))
    warehouses = cursor.fetchall()
    conn.close()

    return jsonify([dict(warehouse) for warehouse in warehouses])

# API endpoint to book a warehouse
@app.route('/api/book', methods=['POST'])
def book_warehouse():
    data = request.get_json()
    user_id = data['user_id']
    warehouse_id = data['warehouse_id']
    start_date = data['start_date']
    end_date = data['end_date']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''SELECT price_per_day FROM warehouses WHERE warehouse_id = ?''', (warehouse_id,))
    price_per_day = cursor.fetchone()[0]

    # Calculate duration
    start = datetime.strptime(start_date, '%Y-%m-%d')
    end = datetime.strptime(end_date, '%Y-%m-%d')
    duration = (end - start).days

    total_cost = price_per_day * duration

    cursor.execute('''INSERT INTO bookings (warehouse_id, user_id, start_date, end_date, total_cost)
                      VALUES (?, ?, ?, ?, ?)''', 
                   (warehouse_id, user_id, start_date, end_date, total_cost))
    conn.commit()
    conn.close()

    return jsonify({"message": "Booking successful", "total_cost": total_cost})

# Serve React frontend when the root route is accessed
@app.route('/')
def serve_react():
    return send_from_directory(app.static_folder, 'index.html')

# Serve static files after building the React app
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(os.path.join(app.static_folder, path))

# Initialize SQLite database before the first request
def initialize_db():
    conn = sqlite3.connect('warehouse_sharing.db')
    cursor = conn.cursor()

    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
    )''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS warehouses (
        warehouse_id INTEGER PRIMARY KEY,
        user_id INTEGER,
        location TEXT,
        size INTEGER,
        available_from TEXT,
        available_until TEXT,
        price_per_day REAL,
        FOREIGN KEY(user_id) REFERENCES users(user_id)
    )''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS bookings (
        booking_id INTEGER PRIMARY KEY,
        warehouse_id INTEGER,
        user_id INTEGER,
        start_date TEXT,
        end_date TEXT,
        total_cost REAL,
        FOREIGN KEY(warehouse_id) REFERENCES warehouses(warehouse_id),
        FOREIGN KEY(user_id) REFERENCES users(user_id)
    )''')

    conn.commit()
    conn.close()

# Call the initialization function manually before the first request
@app.before_first_request
def before_first_request():
    initialize_db()

if __name__ == '__main__':
    app.run(debug=True)
