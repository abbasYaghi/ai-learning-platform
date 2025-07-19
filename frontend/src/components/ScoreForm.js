import React, { useState } from 'react';

const ScoreForm = ({ topics, scores, onSubmit, isLoading }) => {
  const [localTopics, setLocalTopics] = useState(topics);
  const [localScores, setLocalScores] = useState(scores);
  const [feedbackMode, setFeedbackMode] = useState('ai');

  const handleTopicChange = (index, value) => {
    const newTopics = [...localTopics];
    newTopics[index] = value;
    setLocalTopics(newTopics);
  };

  const handleScoreChange = (index, value) => {
    const newScores = [...localScores];
    // Ensure score is between 0 and 100
    const numValue = Math.max(0, Math.min(100, parseInt(value) || 0));
    newScores[index] = numValue;
    setLocalScores(newScores);
  };

  const addTopic = () => {
    setLocalTopics([...localTopics, '']);
    setLocalScores([...localScores, 0]);
  };

  const removeTopic = (index) => {
    if (localTopics.length > 1) {
      const newTopics = localTopics.filter((_, i) => i !== index);
      const newScores = localScores.filter((_, i) => i !== index);
      setLocalTopics(newTopics);
      setLocalScores(newScores);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localTopics.some(topic => topic.trim() === '')) {
      alert('Please fill in all topic names');
      return;
    }
    // Pass feedback mode to parent
    onSubmit(localTopics, localScores, feedbackMode);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900';
    if (score >= 40) return 'bg-orange-100 dark:bg-orange-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Feedback Mode Toggle */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Feedback Mode
        </h3>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="feedbackMode"
              value="ai"
              checked={feedbackMode === 'ai'}
              onChange={(e) => setFeedbackMode(e.target.value)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              🤖 AI Agent Feedback
            </span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="feedbackMode"
              value="rule"
              checked={feedbackMode === 'rule'}
              onChange={(e) => setFeedbackMode(e.target.value)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              📋 Rule-based Feedback
            </span>
          </label>
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Rate your understanding of each topic on a scale of 0-100
      </div>

      {localTopics.map((topic, index) => (
        <div key={index} className="space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => handleTopicChange(index, e.target.value)}
              placeholder={`Topic ${index + 1}`}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
            {localTopics.length > 1 && (
              <button
                type="button"
                onClick={() => removeTopic(index)}
                className="px-3 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Score (0-100)
              </label>
              <span className={`text-lg font-bold ${getScoreColor(localScores[index])}`}>
                {localScores[index]}/100
              </span>
            </div>
            
            <div className={`p-3 rounded-lg ${getScoreBackground(localScores[index])}`}>
              <input
                type="number"
                min="0"
                max="100"
                value={localScores[index]}
                onChange={(e) => handleScoreChange(index, e.target.value)}
                placeholder="Enter score"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-center font-medium"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>0 - No Knowledge</span>
                <span>50 - Moderate</span>
                <span>100 - Expert</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={addTopic}
          className="flex-1 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors"
        >
          + Add Topic
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating {feedbackMode === 'ai' ? 'AI' : 'Rule-based'} Feedback...</span>
          </div>
        ) : (
          `🚀 Get ${feedbackMode === 'ai' ? 'AI' : 'Rule-based'} Feedback`
        )}
      </button>
    </form>
  );
};

export default ScoreForm;