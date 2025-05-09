import React from 'react';

interface MetricOption {
  value: string;
  label: string;
}

interface MetricSelectorProps {
  options: MetricOption[];
  selectedMetric: string;
  onChange: (metric: string) => void;
}

const MetricSelector: React.FC<MetricSelectorProps> = ({
  options,
  selectedMetric,
  onChange
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Choose Metric</h3>
      
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`py-2 px-4 rounded-md transition-all duration-200 transform active:scale-95 focus:outline-none ${
              selectedMetric === option.value
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MetricSelector;