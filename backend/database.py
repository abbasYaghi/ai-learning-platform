import sqlite3
import json
from datetime import datetime
import os

class DatabaseManager:
    def __init__(self, db_path='history.db'):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the database with required tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create table with user_id column
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS submissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                topics TEXT NOT NULL,
                scores TEXT NOT NULL,
                feedback TEXT NOT NULL,
                resources TEXT,
                summary_score REAL,
                feedback_mode TEXT DEFAULT 'ai'
            )
        ''')
        
        # Check if user_id column exists, if not add it
        cursor.execute("PRAGMA table_info(submissions)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'user_id' not in columns:
            cursor.execute('ALTER TABLE submissions ADD COLUMN user_id INTEGER')
        
        if 'feedback_mode' not in columns:
            cursor.execute('ALTER TABLE submissions ADD COLUMN feedback_mode TEXT DEFAULT "ai"')
        
        conn.commit()
        conn.close()
    
    def save_submission(self, topics, scores, feedback, resources=None, feedback_mode='ai', user_id=None):
        """Save a new submission to the database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Calculate summary score
        summary_score = sum(scores) / len(scores) if scores else 0
        
        cursor.execute('''
            INSERT INTO submissions (user_id, topics, scores, feedback, resources, summary_score, feedback_mode)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            json.dumps(topics),
            json.dumps(scores),
            feedback,
            json.dumps(resources) if resources else None,
            summary_score,
            feedback_mode
        ))
        
        conn.commit()
        submission_id = cursor.lastrowid
        conn.close()
        
        return submission_id
    
    def get_all_submissions(self, user_id=None):
        """Get all submissions from the database for a specific user"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        if user_id:
            cursor.execute('''
                SELECT id, timestamp, topics, scores, feedback, resources, summary_score, feedback_mode
                FROM submissions
                WHERE user_id = ?
                ORDER BY timestamp DESC
            ''', (user_id,))
        else:
            cursor.execute('''
                SELECT id, timestamp, topics, scores, feedback, resources, summary_score, feedback_mode
                FROM submissions
                ORDER BY timestamp DESC
            ''')
        
        submissions = []
        for row in cursor.fetchall():
            submissions.append({
                'id': row[0],
                'timestamp': row[1],
                'topics': json.loads(row[2]),
                'scores': json.loads(row[3]),
                'feedback': row[4],
                'resources': json.loads(row[5]) if row[5] else None,
                'summary_score': row[6],
                'feedback_mode': row[7] if row[7] else 'ai'
            })
        
        conn.close()
        return submissions
    
    def get_progress_data(self, user_id=None):
        """Get progress data for line chart for a specific user"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        if user_id:
            cursor.execute('''
                SELECT timestamp, topics, scores, summary_score, feedback_mode
                FROM submissions
                WHERE user_id = ?
                ORDER BY timestamp ASC
            ''', (user_id,))
        else:
            cursor.execute('''
                SELECT timestamp, topics, scores, summary_score, feedback_mode
                FROM submissions
                ORDER BY timestamp ASC
            ''')
        
        progress_data = []
        for row in cursor.fetchall():
            progress_data.append({
                'timestamp': row[0],
                'topics': json.loads(row[1]),
                'scores': json.loads(row[2]),
                'summary_score': row[3],
                'feedback_mode': row[4] if row[4] else 'ai'
            })
        
        conn.close()
        return progress_data