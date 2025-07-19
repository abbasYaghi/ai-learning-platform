import React, { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProgressChart = ({ makeAuthenticatedRequest }) => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState('summary');

  const fetchProgressData = useCallback(async () => {
    try {
      const response = await makeAuthenticatedRequest('http://localhost:5000/progress');
      if (!response) return;

      const data = await response.json();
      setProgressData(data.progress || []);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  }, [makeAuthenticatedRequest]);

  useEffect(() => {
    fetchProgressData();
  }, [fetchProgressData]);

  const getAllTopics = () => {
    const topics = new Set();
    progressData.forEach(entry => {
      entry.topics.forEach(topic => topics.add(topic));
    });
    return Array.from(topics);
  };

  const createChartData = () => {
    if (progressData.length === 0) return { labels: [], datasets: [] };

    const labels = progressData.map(entry => 
      new Date(entry.timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    );

    if (selectedTopic === 'summary') {
      return {
        labels,
        datasets: [
          {
            label: 'Overall Score',
            data: progressData.map(entry => entry.summary_score),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointBorderColor: 'white',
            pointBorderWidth: 2,
          },
        ],
      };
    } else {
      return {
        labels,
        datasets: [
          {
            label: selectedTopic,
            data: progressData.map(entry => {
              const topicIndex = entry.topics.indexOf(selectedTopic);
              return topicIndex !== -1 ? entry.scores[topicIndex] : null;
            }),
            borderColor: 'rgb(168, 85, 247)',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: 'rgb(168, 85, 247)',
            pointBorderColor: 'white',
            pointBorderWidth: 2,
          },
        ],
      };
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `Score: ${context.parsed.y.toFixed(1)}/100`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6B7280',
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          stepSize: 20,
          color: '#6B7280',
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  const calculateTrend = () => {
    if (progressData.length < 2) return null;

    const data = selectedTopic === 'summary' 
      ? progressData.map(entry => entry.summary_score)
      : progressData.map(entry => {
          const topicIndex = entry.topics.indexOf(selectedTopic);
          return topicIndex !== -1 ? entry.scores[topicIndex] : null;
        }).filter(score => score !== null);

    if (data.length < 2) return null;

    const firstScore = data[0];
    const lastScore = data[data.length - 1];
    const change = lastScore - firstScore;
    
    return {
      change: change.toFixed(1),
      percentage: ((change / firstScore) * 100).toFixed(1),
      isPositive: change > 0,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <span>Loading your progress...</span>
        </div>
      </div>
    );
  }

  if (progressData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📈</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No progress data yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Complete multiple assessments to see your progress over time
        </p>
      </div>
    );
  }

  const trend = calculateTrend();
  const allTopics = getAllTopics();

  return (
    <div className="space-y-6">
      {/* Topic Selector */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTopic('summary')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedTopic === 'summary'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          📊 Overall Score
        </button>
        {allTopics.map(topic => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTopic === topic
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Trend Indicator */}
      {trend && (
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Progress trend:
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
            trend.isPositive 
              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
          }`}>
            <span>{trend.isPositive ? '📈' : '📉'}</span>
            <span>
              {trend.isPositive ? '+' : ''}{trend.change} points ({trend.percentage}%)
            </span>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-80">
        <Line data={createChartData()} options={chartOptions} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            Total Assessments
          </div>
          <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
            {progressData.length}
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="text-sm text-green-600 dark:text-green-400 font-medium">
            Best Score
          </div>
          <div className="text-2xl font-bold text-green-800 dark:text-green-300">
            {Math.max(...progressData.map(p => p.summary_score)).toFixed(1)}/100
          </div>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
            Average Score
          </div>
          <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">
            {(progressData.reduce((sum, p) => sum + p.summary_score, 0) / progressData.length).toFixed(1)}/100
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;