import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = ({ transactions = [] }) => {
  // Filter for expenses and group them by category
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const expensesByCategory = safeTransactions
    .filter(t => t && t.amount < 0)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  // Prepare the data for the chart
  const data = {
    labels: Object.keys(expensesByCategory),
    datasets: [{
      label: 'Spending by Category',
      data: Object.values(expensesByCategory),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="p-4 flex justify-center items-center">
      <div
        style={{ width: '400px', height: '400px' }} // 👈 Control chart size here
        className="flex justify-center items-center"
      >
        {Object.keys(expensesByCategory).length > 0 ? (
          <Pie data={data} options={options} />
        ) : (
          <p className="text-center text-gray-500">
            No expenses to display in a chart.
          </p>
        )}
      </div>
    </div>

  );
};

export default CategoryChart;
