class RuleFeedbackEngine:
    def __init__(self):
        self.score_categories = {
            'excellent': (80, 100),
            'good': (60, 79),
            'average': (40, 59),
            'poor': (0, 39)
        }
        
        self.feedback_templates = {
            'excellent': [
                "Outstanding performance! You demonstrate mastery in this area.",
                "Excellent work! Your understanding is comprehensive and well-developed.",
                "Exceptional knowledge! You're performing at an expert level."
            ],
            'good': [
                "Good understanding! You have a solid grasp of the fundamentals.",
                "Well done! Your knowledge is strong with room for minor improvements.",
                "Good progress! You're on the right track with solid comprehension."
            ],
            'average': [
                "Moderate understanding. Focus on strengthening your foundation.",
                "You're making progress, but there's room for improvement.",
                "Average performance. Consider dedicating more time to practice."
            ],
            'poor': [
                "This area needs significant attention and focused study.",
                "Consider starting with basic concepts and building up gradually.",
                "This topic requires immediate attention and additional resources."
            ]
        }
        
        self.improvement_suggestions = {
            'excellent': [
                "Share your knowledge with others through teaching or mentoring",
                "Explore advanced topics and real-world applications",
                "Consider taking on leadership roles in this area"
            ],
            'good': [
                "Practice with more complex examples and scenarios",
                "Seek out challenging projects to deepen your understanding",
                "Review and reinforce any remaining weak points"
            ],
            'average': [
                "Focus on consistent daily practice and review",
                "Break down complex concepts into smaller, manageable parts",
                "Seek additional resources like tutorials or study groups"
            ],
            'poor': [
                "Start with fundamental concepts and build gradually",
                "Consider one-on-one tutoring or structured courses",
                "Dedicate regular, focused study time to this area"
            ]
        }
    
    def categorize_score(self, score):
        for category, (min_score, max_score) in self.score_categories.items():
            if min_score <= score <= max_score:
                return category
        return 'poor'
    
    def generate_feedback(self, topics, scores):
        if not topics or not scores or len(topics) != len(scores):
            return {
                'feedback': 'Invalid input data. Please provide valid topics and scores.',
                'resources': []
            }
        
        overall_score = sum(scores) / len(scores)
        overall_category = self.categorize_score(overall_score)
        
        # Generate individual topic feedback
        topic_feedback = []
        weak_areas = []
        strong_areas = []
        
        for topic, score in zip(topics, scores):
            category = self.categorize_score(score)
            
            if category in ['poor', 'average']:
                weak_areas.append((topic, score))
            elif category == 'excellent':
                strong_areas.append((topic, score))
            
            feedback_template = self.feedback_templates[category][0]
            topic_feedback.append(f"• {topic} ({score}/100): {feedback_template}")
        
        # Generate overall feedback
        feedback_parts = []
        
        # Overall assessment
        feedback_parts.append(f"📊 Overall Performance: {overall_score:.1f}/100")
        feedback_parts.append(f"Your overall performance is {overall_category}.")
        feedback_parts.append("")
        
        # Individual topic analysis
        feedback_parts.append("📝 Topic Analysis:")
        feedback_parts.extend(topic_feedback)
        feedback_parts.append("")
        
        # Strengths
        if strong_areas:
            feedback_parts.append("💪 Your Strengths:")
            for topic, score in strong_areas:
                feedback_parts.append(f"• {topic} - You excel in this area!")
            feedback_parts.append("")
        
        # Areas for improvement
        if weak_areas:
            feedback_parts.append("🎯 Priority Areas for Improvement:")
            for topic, score in sorted(weak_areas, key=lambda x: x[1]):
                feedback_parts.append(f"• {topic} - Requires focused attention")
            feedback_parts.append("")
        
        # Recommendations
        feedback_parts.append("🚀 Recommendations:")
        if weak_areas:
            feedback_parts.append("• Focus on your weakest areas first for maximum impact")
            feedback_parts.append("• Set specific, measurable goals for improvement")
            feedback_parts.append("• Practice regularly and track your progress")
        
        if strong_areas:
            feedback_parts.append("• Leverage your strengths to build confidence")
            feedback_parts.append("• Consider helping others in your strong areas")
        
        # Study plan
        feedback_parts.append("")
        feedback_parts.append("📅 Suggested Study Plan:")
        
        if overall_score < 60:
            feedback_parts.append("• Dedicate 1-2 hours daily to your weakest topics")
            feedback_parts.append("• Start with basic concepts and build gradually")
            feedback_parts.append("• Seek additional help from instructors or peers")
        elif overall_score < 80:
            feedback_parts.append("• Spend 30-60 minutes daily on improvement areas")
            feedback_parts.append("• Practice with varied examples and scenarios")
            feedback_parts.append("• Review and reinforce your existing knowledge")
        else:
            feedback_parts.append("• Focus on advanced topics and real-world applications")
            feedback_parts.append("• Share your knowledge through teaching or mentoring")
            feedback_parts.append("• Challenge yourself with complex projects")
        
        # Generate resources
        resources = self.generate_resources(topics, scores)
        
        return {
            'feedback': '\n'.join(feedback_parts),
            'resources': resources
        }
    
    def generate_resources(self, topics, scores):
        resources = []
        
        # Add resources based on weak areas
        weak_topics = [(topic, score) for topic, score in zip(topics, scores) if score < 60]
        
        for topic, score in weak_topics:
            if score < 40:
                resources.append({
                    'title': f"Beginner's Guide to {topic}",
                    'description': f"Start with fundamental concepts and basic principles of {topic}",
                    'url': f"https://www.example.com/beginners-guide/{topic.lower().replace(' ', '-')}"
                })
            else:
                resources.append({
                    'title': f"Intermediate {topic} Practice",
                    'description': f"Practice exercises and examples to improve your {topic} skills",
                    'url': f"https://www.example.com/practice/{topic.lower().replace(' ', '-')}"
                })
        
        # Add general study resources
        if any(score < 70 for score in scores):
            resources.append({
                'title': "Study Techniques Guide",
                'description': "Effective study methods and techniques for better learning",
                'url': "https://www.example.com/study-techniques"
            })
        
        return resources[:5]  # Return max 5 resources