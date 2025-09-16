import React from 'react';

const PieChart = ({ data, width, height }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64 text-gray-500">
        <p className="text-sm sm:text-base">No data available</p>
      </div>
    );
  }

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  // Responsive sizing
  const getResponsiveSize = () => {
    if (width && height) return { width, height };
    
    // Default responsive sizing
    return {
      width: typeof window !== 'undefined' && window.innerWidth < 640 ? 200 : 300,
      height: typeof window !== 'undefined' && window.innerWidth < 640 ? 200 : 300
    };
  };

  const { width: svgWidth, height: svgHeight } = getResponsiveSize();
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const radius = Math.min(svgWidth, svgHeight) * 0.35;

  const createPath = (value, index) => {
    const percentage = value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    const x1 = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
    const y1 = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
    const x2 = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
    const y2 = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    currentAngle += angle;
    
    return pathData;
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full flex justify-center mb-4">
        <svg width={svgWidth} height={svgHeight} className="max-w-full h-auto">
          {data.map((item, index) => (
            <path
              key={index}
              d={createPath(item.value, index)}
              fill={colors[index % colors.length]}
              stroke="white"
              strokeWidth="2"
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          ))}
        </svg>
      </div>
      
          <div className="chart-legend">
            {data.map((item, index) => (
              <div key={index} className="chart-legend-item">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <div
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="chart-legend-label">{item.label}</span>
                </div>
                <span className="chart-legend-value">
                  {((item.value / total) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
    </div>
  );
};

export default PieChart;
