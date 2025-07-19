import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ScoreChart = ({ topics, scores }) => {
  const getBarColor = (score) => {
    if (score >= 80) return 'rgba(34, 197, 94, 0.8)'; // Green
    if (score >= 60) return 'rgba(234, 179, 8, 0.8)'; // Yellow
    if (score >= 40) return 'rgba(249, 115, 22, 0.8)'; // Orange
    return 'rgba(239, 68, 68, 0.8)'; // Red
  };

  const getBorderColor = (score) => {
    if (score >= 80) return 'rgba(34, 197, 94, 1)';
    if (score >= 60) return 'rgba(234, 179, 8, 1)';
    if (score >= 40) return 'rgba(249, 115, 22, 1)';
    return 'rgba(239, 68, 68, 1)';
  };

  const data = {
    labels: topics,
    datasets: [
      {
        label: 'Score',
        data: scores,
        backgroundColor: scores.map(score => getBarColor(score)),
        borderColor: scores.map(score => getBorderColor(score)),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
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
            const score = context.parsed.y;
            let level = '';
            if (score >= 80) level = 'Excellent';
            else if (score >= 60) level = 'Good';
            else if (score >= 40) level = 'Average';
            else level = 'Needs Improvement';
            return `Score: ${score}/100 (${level})`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
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

  return (
    <div className="h-64 w-full">
      <Bar data={data} options={options} />
    </div>
  );
};

export default ScoreChart;