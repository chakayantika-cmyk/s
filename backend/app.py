from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import sqlite3
import os

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'super-secret-key-scholarchain'
app.config['MAX_CONTENT_LENGTH'] = 32 * 1024 * 1024 # 32MB limit for base64 uploads
jwt = JWTManager(app)
CORS(app)

# Web3 Configuration
# Web3 has been removed from backend due to missing C++ build tools on this machine.
# All blockchain transactions will be handled directly via the React Frontend + MetaMask.
contract = None

# Database initialization
def init_db():
    conn = sqlite3.connect('scholarchain.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (uid TEXT PRIMARY KEY, password TEXT, role TEXT, name TEXT, wallet TEXT, extra_info TEXT, email TEXT, profile_pic TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS applications
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, uid TEXT, name TEXT, amount INTEGER, reason TEXT, 
                  recipient_wallet TEXT, funded BOOLEAN default 0, funded_by TEXT, 
                  parent_income TEXT, marks_10th TEXT, marks_12th TEXT, income_cert TEXT)''')
    
    # Migration logic for existing installations
    for col in ["parent_income", "marks_10th", "marks_12th", "income_cert"]:
        try:
            c.execute(f"ALTER TABLE applications ADD COLUMN {col} TEXT")
        except sqlite3.OperationalError:
            pass
            
    try:
        c.execute("ALTER TABLE applications ADD COLUMN funded_by TEXT")
    except sqlite3.OperationalError:
        pass
        
    try:
        c.execute("ALTER TABLE applications ADD COLUMN recipient_wallet TEXT")
    except sqlite3.OperationalError:
        pass

    try:
        c.execute("ALTER TABLE users ADD COLUMN profile_pic TEXT")
    except sqlite3.OperationalError:
        pass
        
    conn.commit()
    conn.close()

init_db()

def get_db_connection():
    conn = sqlite3.connect('scholarchain.db')
    conn.row_factory = sqlite3.Row
    return conn

# File Upload Security Fix
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    try:
        hashed_password = generate_password_hash(data['password'])
        
        conn = get_db_connection()
        c = conn.cursor()
        c.execute("INSERT INTO users (uid, password, role, name, wallet, extra_info, email, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                  (data['uid'].upper(), hashed_password, data['role'].lower(), data.get('name'), data.get('wallet'), data.get('extra_info'), data.get('email'), data.get('profile_pic')))
        conn.commit()
        conn.close()
        return jsonify({'message': 'User registered successfully'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'User already exists'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    if not data or not data.get('uid') or not data.get('password'):
        return jsonify({'error': 'Missing uid or password'}), 400

    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE uid = ?', (data['uid'].upper(),))
    user = c.fetchone()
    conn.close()

    if user and check_password_hash(user['password'], data['password']):
        access_token = create_access_token(identity=user['uid'])
        user_data = dict(user)
        del user_data['password'] # Don't return hash
        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'user': user_data
        }), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/apply', methods=['POST'])
@jwt_required()
def apply_scholarship():
    data = request.json
    uid = get_jwt_identity()

    student_id = uid
    name = data.get('name')
    amount = data.get('amount')
    reason = data.get('reason')
    recipient_wallet = data.get('recipient_wallet')
    parent_income = data.get('parent_income')
    marks_10th = data.get('marks_10th')
    marks_12th = data.get('marks_12th')
    income_cert = data.get('income_cert')

    print(f"DEBUG: Application submission attempt by {uid}")
    
    required_fields = {
        'name': name,
        'amount': amount,
        'reason': reason,
        'recipient_wallet': recipient_wallet,
        'parent_income': parent_income
    }

    for field, val in required_fields.items():
        if not val:
            print(f"DEBUG: Validation failed for field: {field}")
            return jsonify({'error': f'Missing field: {field}'}), 400

    if not all([marks_10th, marks_12th, income_cert]):
        print("DEBUG: Missing one or more document uploads")
        return jsonify({'error': 'Please upload all 3 documents (10th, 12th, Income Certificate)'}), 400

    try:
        # Pre-process numeric data
        amount_float = float(amount) if amount else 0.0
        parent_income_int = int(parent_income) if parent_income else 0

        # Store in DB
        conn = get_db_connection()
        c = conn.cursor()
        c.execute("""INSERT INTO applications 
                     (uid, name, amount, reason, recipient_wallet, parent_income, marks_10th, marks_12th, income_cert) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""", 
                  (student_id, name, amount_float, reason, recipient_wallet, parent_income_int, marks_10th, marks_12th, income_cert))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Application created successfully'}), 201
    except ValueError as ve:
        print(f"DEBUG: Data format error: {str(ve)}")
        return jsonify({'error': 'Invalid format for amount or income. Please enter numeric values.'}), 400
    except Exception as e:
        print(f"DEBUG: Unexpected server error: {str(e)}")
        return jsonify({'error': f'Internal server failure: {str(e)}'}), 500

@app.route('/api/fund', methods=['POST'])
@jwt_required()
def fund_scholarship():
    data = request.json
    app_id = data.get('app_id')
    amount_eth = data.get('amount_eth')
    uid = get_jwt_identity()
    
    # Real world: Frontend with MetaMask triggers real TX. Backend updates DB.
    # Here we simulate the backend updating the status upon successful frontend tx receipt.
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("UPDATE applications SET funded = 1, funded_by = ? WHERE id = ?", (uid, app_id))
    conn.commit()
    conn.close()

    return jsonify({'message': f'Application {app_id} successfully marked as funded.'}), 200

@app.route('/api/applications', methods=['GET'])
@jwt_required()
def get_applications():
    # Return all applications for donors to view
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM applications")
    apps = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify({'applications': apps}), 200

@app.route('/api/upload_doc', methods=['POST'])
@jwt_required()
def upload_doc():
    if 'document' not in request.files:
        return jsonify({'error': 'No document part'}), 400
    file = request.files['document']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Create uploads folder
        if not os.path.exists('uploads'):
            os.makedirs('uploads')
        file.save(os.path.join('uploads', filename))
        return jsonify({'message': 'File securely uploaded'}), 200
    return jsonify({'error': 'Invalid file format. Only PDF is allowed.'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
