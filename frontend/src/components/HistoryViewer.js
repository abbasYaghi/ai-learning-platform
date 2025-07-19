import React, { useState, useEffect, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';

const HistoryViewer = ({ makeAuthenticatedRequest }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await makeAuthenticatedRequest('http://localhost:5000/history');
      if (!response) return;

      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  }, [makeAuthenticatedRequest]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900';
    if (score >= 40) return 'text-orange-600 bg-orange-100 dark:bg-orange-900';
    return 'text-red-600 bg-red-100 dark:bg-red-900';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return '🟢 Excellent';
    if (score >= 60) return '🟡 Good';
    if (score >= 40) return '🟠 Fair';
    return '🔴 Needs Work';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const createMiniChart = (topics, scores) => {
    return {
      labels: topics,
      datasets: [
        {
          data: scores,
          backgroundColor: scores.map(score => {
            if (score >= 80) return 'rgba(34, 197, 94, 0.8)';
            if (score >= 60) return 'rgba(234, 179, 8, 0.8)';
            if (score >= 40) return 'rgba(249, 115, 22, 0.8)';
            return 'rgba(239, 68, 68, 0.8)';
          }),
          borderRadius: 4,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y}/100`,
        },
      },
    },
    scales: {
      x: { display: false },
      y: { display: false, beginAtZero: true, max: 100 },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <span>Loading your history...</span>
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No assessments yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Complete your first assessment to see your history here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Showing {submissions.length} assessment{submissions.length !== 1 ? 's' : ''}
      </div>

      {submissions.map((submission) => (
        <div
          key={submission.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">
                  {submission.feedback_mode === 'ai' ? '🤖' : '📋'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Assessment #{submission.id}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(submission.timestamp)} • {submission.feedback_mode === 'ai' ? 'AI' : 'Rule-based'} feedback
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(submission.summary_score)}`}>
                  {getScoreBadge(submission.summary_score)}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {submission.summary_score.toFixed(1)}/100
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mini Chart */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topic Breakdown
                </h4>
                <div className="h-24">
                  <Bar
                    data={createMiniChart(submission.topics, submission.scores)}
                    options={chartOptions}
                  />
                </div>
              </div>

              {/* Topics List */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topics ({submission.topics.length})
                </h4>
                <div className="space-y-2">
                  {submission.topics.slice(0, 3).map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {topic}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {submission.scores[index]}/100
                      </span>
                    </div>
                  ))}
                  {submission.topics.length > 3 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      +{submission.topics.length - 3} more topics
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                <span className={`transform transition-transform ${expandedId === submission.id ? 'rotate-90' : ''}`}>
                  ▶
                </span>
                <span>{expandedId === submission.id ? 'Hide' : 'Show'} Details</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                📄 Print
              </button>
            </div>

            {/* Expanded Details */}
            {expandedId === submission.id && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    All Topics & Scores
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {submission.topics.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {topic}
                        </span>
                        <span className={`text-sm font-medium px-2 py-1 rounded ${getScoreColor(submission.scores[index])}`}>
                          {submission.scores[index]}/100
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Feedback ({submission.feedback_mode === 'ai' ? 'AI Generated' : 'Rule-based'})
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {submission.feedback.length > 500 
                        ? submission.feedback.substring(0, 500) + '...' 
                        : submission.feedback}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryViewer;