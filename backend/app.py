from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import sqlite3
import os
from dotenv import load_dotenv

# Load environment variables (JWT_SECRET_KEY, etc.)
load_dotenv()

from flask_limiter import Limiter

from flask_limiter.util import get_remote_address
from functools import wraps

app = Flask(__name__)
# Secure Configuration - ideally these would be in a .env file
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'default-key-for-dev-only') 
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # Reduced to 16MB for better security

# 1. CORS Configuration
# Restricts access to trusted origins (change 'http://localhost:3000' to your frontend URL)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"]}},
     methods=["GET", "POST", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])


# 2. Rate Limiting Configuration
# Limits API requests to 100 requests per 15 minutes per IP
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per 15 minutes"],
    storage_uri="memory://",
)


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

# Security Utility: Input Sanitization
def sanitize_input(data):
    """Basic sanitization for string inputs"""
    if isinstance(data, str):
        return data.strip()
    return data

# Authentication & Authorization Middleware
def role_required(allowed_roles):
    """Custom decorator for role-based access control"""
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            current_user_id = get_jwt_identity()
            conn = get_db_connection()
            user = conn.execute('SELECT role FROM users WHERE uid = ?', (current_user_id,)).fetchone()
            conn.close()
            
            if not user or user['role'].lower() not in [r.lower() for r in allowed_roles]:
                return jsonify({"error": f"Access denied. Required roles: {', '.join(allowed_roles)}"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator

# Specific version for admin-only
def admin_required(fn):
    return role_required(['admin'])(fn)

# Version for donor or admin (e.g. for funding)
def funder_required(fn):
    return role_required(['admin', 'donor'])(fn)

def get_db_connection():
    try:
        conn = sqlite3.connect('scholarchain.db')
        conn.row_factory = sqlite3.Row
        return conn
    except Exception as e:
        app.logger.error(f"Database connection error: {e}")
        return None


# File Upload Security Fix
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/register', methods=['POST'])
@limiter.limit("5 per minute") # Rate limit registration attempts
def register():
    data = request.json
    # Validation
    if not data or not all(k in data for k in ('uid', 'password', 'role')):
        return jsonify({'error': 'Missing required registration fields'}), 400
        
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
        app.logger.error(f"Registration Error: {e}")
        return jsonify({'error': 'An internal error occurred during registration'}), 500


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
@limiter.limit("10 per hour") # Prevent application spam
def apply_scholarship():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'No data provided'}), 400
        
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

    # Security: Input validation
    required_fields = {
        'name': name,
        'amount': amount,
        'reason': reason,
        'recipient_wallet': recipient_wallet,
        'parent_income': parent_income
    }

    for field, val in required_fields.items():
        if not val or (isinstance(val, str) and not val.strip()):
            return jsonify({'error': f'Invalid or missing field: {field}'}), 400

    if not all([marks_10th, marks_12th, income_cert]):
        return jsonify({'error': 'Please upload all 3 documents (10th, 12th, Income Certificate)'}), 400

    try:
        amount_float = float(amount)
        parent_income_int = int(parent_income)

        conn = get_db_connection()
        c = conn.cursor()
        c.execute("""INSERT INTO applications 
                     (uid, name, amount, reason, recipient_wallet, parent_income, marks_10th, marks_12th, income_cert) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""", 
                  (student_id, name, amount_float, reason, recipient_wallet, parent_income_int, marks_10th, marks_12th, income_cert))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Application created successfully'}), 201
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid numeric data for amount or income.'}), 400
    except Exception as e:
        app.logger.error(f"Apply Error: {e}")
        return jsonify({'error': 'Internal server failure'}), 500


@app.route('/api/fund', methods=['POST'])
@funder_required # Admins or Donors can fund/allocate
@limiter.limit("5 per minute") 
def fund_scholarship():
    data = request.get_json(silent=True)
    if not data or 'app_id' not in data:
        return jsonify({'error': 'Missing app_id'}), 400
        
    app_id = data.get('app_id')
    uid = get_jwt_identity()
    
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("UPDATE applications SET funded = 1, funded_by = ? WHERE id = ?", (uid, app_id))
    conn.commit()
    conn.close()

    return jsonify({'message': f'Application {app_id} successfully marked as funded.'}), 200

@app.route('/api/transactions', methods=['GET'])
@limiter.limit("50 per minute")
def get_transactions():
    """Public route to view funded transactions (unauthenticated)"""
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT id, name, amount, funded_by FROM applications WHERE funded = 1")
    txs = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify({'transactions': txs}), 200

@app.route('/api/admin/allocate', methods=['POST'])
@admin_required # Strictly for admin role
@limiter.limit("2 per minute") # Very strict rate limit for sensitive actions
def allocate_funds():
    """Example admin-only route for scholarship allocation"""
    data = request.get_json(silent=True)
    if not data or 'app_id' not in data:
        return jsonify({'error': 'Missing application ID'}), 400
        
    # Logic to record allocation in a central ledger or triggering further logic
    return jsonify({'message': f'Allocation for application {data["app_id"]} has been formally approved by admin.'}), 200


@app.route('/api/applications', methods=['GET'])
@jwt_required()
def get_applications():
    # Return all applications for donors to view, including student profile pics
    conn = get_db_connection()
    c = conn.cursor()
    # Join with users table to get the student's actual registered name and profile pic
    c.execute("""
        SELECT a.*, u.profile_pic as student_real_pic, u.name as user_name 
        FROM applications a 
        LEFT JOIN users u ON a.uid = u.uid
    """)
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
