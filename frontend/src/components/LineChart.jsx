import React from 'react';

const LineChart = ({ data, width, height }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64 text-gray-500">
        <p className="text-sm sm:text-base">No data available</p>
      </div>
    );
  }

  // Responsive sizing
  const getResponsiveSize = () => {
    if (width && height) return { width, height };
    
    // Default responsive sizing
    return {
      width: typeof window !== 'undefined' && window.innerWidth < 640 ? 300 : 400,
      height: typeof window !== 'undefined' && window.innerWidth < 640 ? 200 : 300
    };
  };

  const { width: svgWidth, height: svgHeight } = getResponsiveSize();
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue || 1;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * (svgWidth - 40) + 20;
    const y = svgHeight - 20 - ((item.value - minValue) / range) * (svgHeight - 40);
    return { x, y, value: item.value, label: item.label };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  return (
    <div className="w-full">
      <svg width={svgWidth} height={svgHeight} className="w-full max-w-full h-auto">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const y = svgHeight - 20 - (ratio * (svgHeight - 40));
          const value = minValue + (ratio * range);
          return (
            <g key={index}>
              <line
                x1={20}
                y1={y}
                x2={svgWidth - 20}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
                  <text
                    x={15}
                    y={y + 4}
                    textAnchor="end"
                    className="text-xs fill-gray-500"
                    style={{ fontSize: '9px' }}
                  >
                    {Math.round(value)}
                  </text>
            </g>
          );
        })}

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          className="hover:opacity-80 transition-opacity"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3B82F6"
              className="hover:r-6 transition-all cursor-pointer"
            />
                <text
                  x={point.x}
                  y={point.y - 8}
                  textAnchor="middle"
                  className="text-xs fill-gray-700"
                  style={{ fontSize: '9px' }}
                >
                  {point.value}
                </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default LineChart;
