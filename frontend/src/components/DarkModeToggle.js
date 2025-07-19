import React from 'react';

const DarkModeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className="relative inline-flex items-center justify-center w-14 h-8 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Toggle dark mode"
    >
      <span
        className={`absolute left-1 top-1 w-6 h-6 bg-white dark:bg-gray-900 rounded-full shadow-md transform transition-transform duration-200 flex items-center justify-center ${
          darkMode ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {darkMode ? (
          <span className="text-yellow-400 text-xs">🌙</span>
        ) : (
          <span className="text-yellow-500 text-xs">☀️</span>
        )}
      </span>
    </button>
  );
};

export default DarkModeToggle;