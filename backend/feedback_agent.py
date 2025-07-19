import os
import requests
from dotenv import load_dotenv

load_dotenv()

class FeedbackAgent:
    def __init__(self):
        self.api_key = os.getenv('COHERE_API_KEY')
        self.base_url = "https://api.cohere.ai/v1"
    
    def generate_feedback(self, topics, scores):
        """Generate AI feedback based on topics and scores"""
        try:
            # Create prompt for Cohere
            prompt = f"""
            You are an AI learning assistant. A student has self-assessed their knowledge on the following topics:
            
            Topics and Scores (out of 10):
            {', '.join([f"{topic}: {score}" for topic, score in zip(topics, scores)])}
            
            Provide constructive feedback and learning recommendations. Include:
            1. Overall assessment of their knowledge
            2. Specific areas for improvement
            3. Actionable study suggestions
            4. Encouragement and motivation
            
            Keep the feedback concise but helpful.
            """
            
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'model': 'command-r-plus',
                'prompt': prompt,
                'max_tokens': 500,
                'temperature': 0.7
            }
            
            response = requests.post(f"{self.base_url}/generate", headers=headers, json=data)
            
            if response.status_code == 200:
                result = response.json()
                feedback = result.get('generations', [{}])[0].get('text', '').strip()
                
                # Generate some sample resources
                resources = self.generate_resources(topics, scores)
                
                return {
                    'feedback': feedback,
                    'resources': resources
                }
            else:
                return {
                    'feedback': 'Unable to generate feedback at this time. Please try again.',
                    'resources': []
                }
        
        except Exception as e:
            return {
                'feedback': f'Error generating feedback: {str(e)}',
                'resources': []
            }
    
    def generate_resources(self, topics, scores):
        """Generate sample learning resources"""
        resources = []
        
        for topic, score in zip(topics, scores):
            if score < 7:  # Suggest resources for topics with lower scores
                resources.append({
                    'title': f"Study Guide: {topic}",
                    'description': f"Comprehensive guide to improve your understanding of {topic}",
                    'url': f"https://www.example.com/study-guide/{topic.lower().replace(' ', '-')}"
                })
        
        return resources[:3]  # Return max 3 resources