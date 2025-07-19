#!/usr/bin/env python3
"""
Simple test script to verify the backend is working
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_server():
    print("🔧 Testing Backend Server...")
    
    # Test 1: Register a user
    print("\n1. Testing user registration...")
    try:
        response = requests.post(f"{BASE_URL}/register", 
                               json={"username": "testuser", "password": "testpass"})
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test 2: Login
    print("\n2. Testing login...")
    try:
        response = requests.post(f"{BASE_URL}/login", 
                               json={"username": "testuser", "password": "testpass"})
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Response: {data}")
        
        if response.status_code == 200:
            session_token = data.get('session_token')
            print(f"   Session token: {session_token[:20]}...")
            
            # Test 3: Test feedback with auth
            print("\n3. Testing feedback endpoint...")
            headers = {"Authorization": f"Bearer {session_token}"}
            feedback_data = {
                "topics": ["Python", "JavaScript"],
                "scores": [75, 60],
                "feedback_mode": "rule"
            }
            
            response = requests.post(f"{BASE_URL}/feedback", 
                                   json=feedback_data, 
                                   headers=headers)
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                result = response.json()
                print(f"   Feedback length: {len(result.get('feedback', ''))}")
                print(f"   Summary score: {result.get('summary_score')}")
                print(f"   Resources: {len(result.get('resources', []))}")
            else:
                print(f"   Error: {response.json()}")
        
    except Exception as e:
        print(f"   Error: {e}")
    
    print("\n✅ Backend test completed!")

if __name__ == "__main__":
    test_server()