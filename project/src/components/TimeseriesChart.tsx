import React, { useMemo } from 'react';
import { TimeseriesData } from '../types';

interface TimeseriesChartProps {
  data: TimeseriesData[];
  countries: string[];
  metric: string;
  title: string;
  colors: string[];
}

const TimeseriesChart: React.FC<TimeseriesChartProps> = ({ 
  data, 
  countries, 
  metric, 
  title,
  colors
}) => {
  const chartData = useMemo(() => {
    if (!data.length) return [];
    
    // Filter to relevant dates and countries
    return data;
  }, [data]);

  // Get min/max values to set chart scale
  const maxValue = useMemo(() => {
    if (!chartData.length) return 0;
    
    let max = 0;
    chartData.forEach(point => {
      countries.forEach(country => {
        const value = point[country] as number;
        if (value && value > max) max = value;
      });
    });
    return max;
  }, [chartData, countries]);

  // Chart height and scaling constants
  const chartHeight = 300;
  const chartWidth = '100%';
  const padding = { top: 20, right: 20, bottom: 30, left: 60 };

  // If we don't have data yet, show loading
  if (!chartData.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        <div className="flex justify-center items-center h-[300px]">
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      </div>
    );
  }

  // Format large numbers for readability
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Calculate x and y scales
  const totalPoints = chartData.length;
  const xScale = (index: number) => {
    const availableWidth = 100 - (padding.left + padding.right) / 10;
    return padding.left / 10 + (index / (totalPoints - 1)) * availableWidth;
  };
  
  const yScale = (value: number) => {
    const availableHeight = chartHeight - padding.top - padding.bottom;
    return chartHeight - padding.bottom - (value / maxValue) * availableHeight;
  };

  // Generate SVG path for each country
  const generatePath = (country: string, index: number) => {
    if (chartData.length < 2) return '';
    
    let path = `M `;
    let validPoints = 0;
    
    chartData.forEach((point, i) => {
      const value = point[country] as number;
      if (value !== undefined) {
        const x = `${xScale(i)}%`;
        const y = yScale(value);
        
        if (validPoints === 0) {
          path += `${x} ${y}`;
        } else {
          path += ` L ${x} ${y}`;
        }
        validPoints++;
      }
    });
    
    return validPoints > 1 ? path : '';
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div style={{ height: `${chartHeight}px`, width: chartWidth, position: 'relative' }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0" style={{ width: `${padding.left}px` }}>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <div 
              key={i} 
              className="absolute text-xs text-gray-500"
              style={{ 
                top: `${yScale(maxValue * ratio)}px`, 
                right: '10px', 
                transform: 'translateY(-50%)' 
              }}
            >
              {formatNumber(maxValue * ratio)}
            </div>
          ))}
        </div>
        
        {/* X-axis grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <div 
            key={ratio}
            className="absolute border-t border-gray-100" 
            style={{
              top: `${yScale(maxValue * ratio)}px`,
              left: `${padding.left}px`,
              right: `${padding.right}px`
            }}
          />
        ))}
        
        {/* Chart SVG */}
        <svg 
          width="100%" 
          height={chartHeight} 
          style={{ overflow: 'visible' }}
        >
          {/* Country lines */}
          {countries.map((country, i) => (
            <path
              key={country}
              d={generatePath(country, i)}
              fill="none"
              stroke={colors[i % colors.length]}
              strokeWidth="2"
            />
          ))}
        </svg>
        
        {/* X-axis labels */}
        <div className="absolute left-0 right-0 flex justify-between px-[60px]" style={{ top: `${chartHeight - 20}px` }}>
          <span className="text-xs text-gray-500">
            {chartData[0]?.date?.substring(0, 7)}
          </span>
          <span className="text-xs text-gray-500">
            {chartData[Math.floor(chartData.length / 2)]?.date?.substring(0, 7)}
          </span>
          <span className="text-xs text-gray-500">
            {chartData[chartData.length - 1]?.date?.substring(0, 7)}
          </span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4">
        {countries.map((country, i) => (
          <div key={country} className="flex items-center">
            <div 
              className="w-3 h-3 mr-2 rounded-full" 
              style={{ backgroundColor: colors[i % colors.length] }} 
            />
            <span className="text-sm">{country}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeseriesChart;