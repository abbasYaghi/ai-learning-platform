import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import ScoreForm from './components/ScoreForm';
import ScoreChart from './components/ScoreChart';
import Feedback from './components/Feedback';
import HistoryViewer from './components/HistoryViewer';
import ProgressChart from './components/ProgressChart';
import DarkModeToggle from './components/DarkModeToggle';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionToken, setSessionToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [topics, setTopics] = useState(['']);
  const [scores, setScores] = useState([0]);
  const [feedback, setFeedback] = useState('');
  const [resources, setResources] = useState([]);
  const [summaryScore, setSummaryScore] = useState(0);
  const [feedbackMode, setFeedbackMode] = useState('ai');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('assessment');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('session_token');
    const username = localStorage.getItem('username');
    
    console.log('Checking existing session:', { token: !!token, username });
    
    if (token && username) {
      // Verify session with server
      fetch('http://localhost:5000/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(response => {
        if (response.ok) {
          setSessionToken(token);
          setCurrentUser(username);
          setIsAuthenticated(true);
          console.log('Session verified:', username);
        } else {
          // Invalid session, clear storage
          localStorage.removeItem('session_token');
          localStorage.removeItem('username');
          console.log('Session invalid, cleared');
        }
      })
      .catch(error => {
        console.error('Session verification failed:', error);
        localStorage.removeItem('session_token');
        localStorage.removeItem('username');
      });
    }

    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleLogin = (token, username) => {
    console.log('Login successful:', { token: !!token, username });
    setSessionToken(token);
    setCurrentUser(username);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    console.log('Logging out...');
    try {
      await fetch('http://localhost:5000/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('session_token');
    localStorage.removeItem('username');
    setSessionToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setTopics(['']);
    setScores([0]);
    setFeedback('');
    setResources([]);
    setSummaryScore(0);
    setActiveTab('assessment');
    console.log('Logged out successfully');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const makeAuthenticatedRequest = async (url, options = {}) => {
    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...options, ...defaultOptions });
    
    if (response.status === 401) {
      // Session expired
      console.log('Session expired, logging out');
      handleLogout();
      return null;
    }
    
    return response;
  };

  const handleSubmit = async (topicsData, scoresData, feedbackModeData) => {
    console.log('Submitting feedback request:', { topicsData, scoresData, feedbackModeData });
    setIsLoading(true);
    setFeedbackMode(feedbackModeData);
    
    try {
      const response = await makeAuthenticatedRequest('http://localhost:5000/feedback', {
        method: 'POST',
        body: JSON.stringify({
          topics: topicsData,
          scores: scoresData,
          feedback_mode: feedbackModeData,
        }),
      });

      if (!response) {
        console.log('No response - session expired');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Feedback response:', data);
      setFeedback(data.feedback);
      setResources(data.resources || []);
      setSummaryScore(data.summary_score);
      setTopics(topicsData);
      setScores(scoresData);
    } catch (error) {
      console.error('Error getting feedback:', error);
      setFeedback('Error generating feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const exportCSV = async () => {
    try {
      const response = await makeAuthenticatedRequest('http://localhost:5000/export/csv');
      if (!response) return;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentUser}_feedback_history.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const exportPDF = () => {
    window.print();
  };

  // Debug: Log authentication state
  console.log('App state:', { isAuthenticated, sessionToken: !!sessionToken, currentUser });

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-6 py-3 font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-500 text-white shadow-lg'
          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className={`min-h-screen transition-colors ${
      darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              🎓 Learning Feedback Platform
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {currentUser}! 
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
          <TabButton
            id="assessment"
            label="📊 Assessment"
            isActive={activeTab === 'assessment'}
            onClick={setActiveTab}
          />
          <TabButton
            id="history"
            label="📈 History"
            isActive={activeTab === 'history'}
            onClick={setActiveTab}
          />
          <TabButton
            id="progress"
            label="📉 Progress"
            isActive={activeTab === 'progress'}
            onClick={setActiveTab}
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'assessment' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Self-Assessment
                </h2>
                <ScoreForm
                  topics={topics}
                  scores={scores}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              </div>

              {/* Summary Score Card */}
              {summaryScore > 0 && (
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
                  <div className="text-3xl font-bold">
                    {summaryScore.toFixed(1)}/100
                  </div>
                  <div className="text-sm opacity-90 mb-3">
                    {summaryScore >= 80 ? 'Excellent!' : 
                     summaryScore >= 60 ? 'Good progress!' : 
                     summaryScore >= 40 ? 'Keep improving!' : 'More practice needed!'}
                  </div>
                  <button
                    onClick={exportPDF}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    📄 Export PDF
                  </button>
                </div>
              )}
            </div>

            {/* Right Column - Results */}
            <div className="space-y-6">
              {/* Chart */}
              {topics.length > 0 && topics[0] !== '' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Score Breakdown
                  </h3>
                  <ScoreChart topics={topics} scores={scores} />
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">{feedbackMode === 'ai' ? '🤖' : '📋'}</span>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {feedbackMode === 'ai' ? 'AI Agent' : 'Rule-based'} Feedback
                    </h3>
                  </div>
                  <Feedback feedback={feedback} resources={resources} />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Your Assessment History
              </h2>
              <button
                onClick={exportCSV}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                📄 Export CSV
              </button>
            </div>
            <HistoryViewer makeAuthenticatedRequest={makeAuthenticatedRequest} />
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Your Progress Tracking
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <ProgressChart makeAuthenticatedRequest={makeAuthenticatedRequest} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;