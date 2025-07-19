from flask import Flask, request, jsonify
from feedback_agent import FeedbackAgent
from rule_feedback import RuleFeedbackEngine
from database import DatabaseManager
from auth import SimpleAuth
import csv
import io
import json
from datetime import datetime
from functools import wraps

app = Flask(__name__)

# Initialize database and feedback engines
db = DatabaseManager()
auth = SimpleAuth()
ai_feedback_agent = FeedbackAgent()
rule_feedback_engine = RuleFeedbackEngine()

# Single CORS handler
@app.after_request
def after_request(response):
    # Only add CORS headers if they don't already exist
    if not response.headers.get('Access-Control-Allow-Origin'):
        response.headers.add('Access-Control-Allow-Origin', '*')
    if not response.headers.get('Access-Control-Allow-Headers'):
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    if not response.headers.get('Access-Control-Allow-Methods'):
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Handle OPTIONS requests globally
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = jsonify({'status': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        session_token = request.headers.get('Authorization')
        if not session_token:
            return jsonify({'error': 'No session token provided'}), 401
        
        # Remove 'Bearer ' prefix if present
        if session_token.startswith('Bearer '):
            session_token = session_token[7:]
        
        session_result = auth.verify_session(session_token)
        if not session_result['success']:
            return jsonify({'error': 'Invalid or expired session'}), 401
        
        request.user_id = session_result['user_id']
        request.username = session_result['username']
        return f(*args, **kwargs)
    
    return decorated_function

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400
        
        if len(username) < 3:
            return jsonify({'error': 'Username must be at least 3 characters'}), 400
        
        if len(password) < 4:
            return jsonify({'error': 'Password must be at least 4 characters'}), 400
        
        result = auth.create_user(username, password)
        if result['success']:
            return jsonify({'message': 'User created successfully'})
        else:
            return jsonify({'error': result['error']}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400
        
        result = auth.verify_user(username, password)
        if result['success']:
            session_token = auth.create_session(result['user_id'])
            return jsonify({
                'success': True,
                'session_token': session_token,
                'username': result['username']
            })
        else:
            return jsonify({'error': result['error']}), 401
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/logout', methods=['POST'])
@require_auth
def logout():
    try:
        session_token = request.headers.get('Authorization')
        if session_token and session_token.startswith('Bearer '):
            session_token = session_token[7:]
            auth.logout(session_token)
        return jsonify({'message': 'Logged out successfully'})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/profile', methods=['GET'])
@require_auth
def profile():
    return jsonify({
        'username': request.username,
        'user_id': request.user_id
    })

@app.route('/feedback', methods=['POST'])
@require_auth
def get_feedback():
    try:
        data = request.get_json()
        topics = data.get('topics', [])
        scores = data.get('scores', [])
        feedback_mode = data.get('feedback_mode', 'ai')
        
        if not topics or not scores or len(topics) != len(scores):
            return jsonify({'error': 'Invalid topics or scores'}), 400
        
        # Validate scores are between 0-100
        for score in scores:
            if not isinstance(score, (int, float)) or score < 0 or score > 100:
                return jsonify({'error': 'Scores must be between 0 and 100'}), 400
        
        # Generate feedback based on selected mode
        if feedback_mode == 'ai':
            feedback_response = ai_feedback_agent.generate_feedback(topics, scores)
        else:
            feedback_response = rule_feedback_engine.generate_feedback(topics, scores)
        
        # Save to database with user_id
        submission_id = db.save_submission(
            topics=topics,
            scores=scores,
            feedback=feedback_response.get('feedback', ''),
            resources=feedback_response.get('resources', []),
            feedback_mode=feedback_mode,
            user_id=request.user_id
        )
        
        return jsonify({
            'id': submission_id,
            'feedback': feedback_response.get('feedback', ''),
            'resources': feedback_response.get('resources', []),
            'summary_score': sum(scores) / len(scores),
            'feedback_mode': feedback_mode
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/history', methods=['GET'])
@require_auth
def get_history():
    try:
        submissions = db.get_all_submissions(user_id=request.user_id)
        return jsonify({'submissions': submissions})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/progress', methods=['GET'])
@require_auth
def get_progress():
    try:
        progress_data = db.get_progress_data(user_id=request.user_id)
        return jsonify({'progress': progress_data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/export/csv', methods=['GET'])
@require_auth
def export_csv():
    try:
        submissions = db.get_all_submissions(user_id=request.user_id)
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write headers
        writer.writerow(['ID', 'Timestamp', 'Topics', 'Scores', 'Summary Score', 'Feedback Mode', 'Feedback'])
        
        # Write data
        for submission in submissions:
            writer.writerow([
                submission['id'],
                submission['timestamp'],
                ', '.join(submission['topics']),
                ', '.join(map(str, submission['scores'])),
                submission['summary_score'],
                submission.get('feedback_mode', 'ai'),
                submission['feedback'][:100] + '...' if len(submission['feedback']) > 100 else submission['feedback']
            ])
        
        output.seek(0)
        return output.getvalue(), 200, {
            'Content-Type': 'text/csv',
            'Content-Disposition': f'attachment; filename={request.username}_feedback_history.csv'
        }
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    import os
    
    # Create data directory if it doesn't exist
    os.makedirs('/app/data', exist_ok=True)
    
    # Use data directory for databases
    db = DatabaseManager('/app/data/history.db')
    auth = SimpleAuth('/app/data/users.db')
    
    # Run the app
    app.run(host='0.0.0.0', port=5000, debug=False)