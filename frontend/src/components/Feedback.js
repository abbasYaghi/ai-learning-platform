import React, { useState } from 'react';

const Feedback = ({ feedback, resources, feedbackMode, onExportPDF }) => {
  const [showResources, setShowResources] = useState(false);

  const getModeIcon = (mode) => {
    return mode === 'ai' ? '🤖' : '📋';
  };

  const getModeLabel = (mode) => {
    return mode === 'ai' ? 'AI Agent' : 'Rule-based';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getModeIcon(feedbackMode)}</span>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {getModeLabel(feedbackMode)} Feedback
          </h3>
        </div>
        <button
          onClick={onExportPDF}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          📄 Export PDF
        </button>
      </div>

      {/* Feedback Content */}
      <div className="prose dark:prose-invert max-w-none">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 border-blue-500">
          <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
            {feedback}
          </div>
        </div>
      </div>

      {/* Resources Section */}
      {resources && resources.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => setShowResources(!showResources)}
            className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            <span className={`transform transition-transform ${showResources ? 'rotate-90' : ''}`}>
              ▶
            </span>
            <span className="font-medium">
              📚 Recommended Resources ({resources.length})
            </span>
          </button>

          {showResources && (
            <div className="space-y-3 pl-6">
              {resources.map((resource, index) => (
                <div
                  key={index}
                  className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {resource.title || `Resource ${index + 1}`}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {resource.description || resource}
                      </p>
                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                          🔗 Learn More
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Feedback Actions */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
        <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
          <span>👍</span>
          <span>Helpful</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
          <span>👎</span>
          <span>Not Helpful</span>
        </button>
        <div className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Mode:</span>
          <span className="font-medium">{getModeLabel(feedbackMode)}</span>
        </div>
      </div>
    </div>
  );
};

export default Feedback;