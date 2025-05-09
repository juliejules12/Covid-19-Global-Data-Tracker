import React, { useMemo } from 'react';
import { VaccinationData } from '../types';

interface VaccinationProgressProps {
  data: VaccinationData[];
  maxCountries?: number;
}

const VaccinationProgress: React.FC<VaccinationProgressProps> = ({
  data,
  maxCountries = 10
}) => {
  const sortedData = useMemo(() => {
    return [...data]
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, maxCountries);
  }, [data, maxCountries]);

  if (!sortedData.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-4">Vaccination Progress</h3>
        <div className="flex justify-center items-center h-[300px]">
          <p className="text-gray-500">Loading vaccination data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Vaccination Progress</h3>
      <p className="text-sm text-gray-500 mb-4">
        Percentage of population vaccinated
      </p>
      
      <div className="space-y-4 mt-4">
        {sortedData.map(country => (
          <div key={country.country}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{country.country}</span>
              <span className="text-sm font-medium">{country.percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-teal-600 h-2.5 rounded-full" 
                style={{ width: `${country.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VaccinationProgress;