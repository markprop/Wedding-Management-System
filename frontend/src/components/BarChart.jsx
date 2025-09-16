import React from 'react';

const BarChart = ({ data, width, height }) => {
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
  const barWidth = svgWidth / data.length * 0.8;
  const barSpacing = svgWidth / data.length * 0.2;

  return (
    <div className="w-full">
      <svg width={svgWidth} height={svgHeight} className="w-full max-w-full h-auto">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (svgHeight - 40);
          const x = index * (barWidth + barSpacing) + barSpacing / 2;
          const y = svgHeight - barHeight - 20;
          
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
                    style={{ fontSize: '10px' }}
                  >
                    {item.value}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y={svgHeight - 5}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                    style={{ fontSize: '9px' }}
                    transform={`rotate(-45, ${x + barWidth / 2}, ${svgHeight - 5})`}
                  >
                    {item.label.length > 8 ? item.label.substring(0, 8) + '...' : item.label}
                  </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default BarChart;
