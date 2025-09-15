import React from 'react';

const BarChart = ({ data, width = 400, height = 300 }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const barWidth = width / data.length * 0.8;
  const barSpacing = width / data.length * 0.2;

  return (
    <div className="w-full">
      <svg width={width} height={height} className="w-full">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 40);
          const x = index * (barWidth + barSpacing) + barSpacing / 2;
          const y = height - barHeight - 20;
          
          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#3B82F6"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                className="text-xs fill-gray-700"
              >
                {item.value}
              </text>
              <text
                x={x + barWidth / 2}
                y={height - 5}
                textAnchor="middle"
                className="text-xs fill-gray-600"
                transform={`rotate(-45, ${x + barWidth / 2}, ${height - 5})`}
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default BarChart;
