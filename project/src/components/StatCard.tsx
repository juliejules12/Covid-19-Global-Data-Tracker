import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, change }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-500 font-medium">{title}</span>
        <div className={`p-2 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold mb-2">{value}</div>
      {change && (
        <div className={`text-sm flex items-center ${change.isPositive ? 'text-green-500' : 'text-red-500'}`}>
          <span className="mr-1">{change.isPositive ? '↑' : '↓'}</span>
          <span>{Math.abs(change.value)}%</span>
          <span className="ml-1 text-gray-500">from previous period</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;