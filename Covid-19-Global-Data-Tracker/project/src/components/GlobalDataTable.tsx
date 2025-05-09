import React, { useState, useMemo } from 'react';
import { CountryData } from '../types';

interface SortConfig {
  key: keyof CountryData;
  direction: 'asc' | 'desc';
}

interface GlobalDataTableProps {
  data: CountryData[];
}

const GlobalDataTable: React.FC<GlobalDataTableProps> = ({ data }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'totalCases',
    direction: 'desc'
  });
  
  // Get latest data for each country
  const latestCountryData = useMemo(() => {
    const latestByCountry = new Map<string, CountryData>();
    
    data.forEach(item => {
      const existing = latestByCountry.get(item.country);
      if (!existing || new Date(item.date) > new Date(existing.date)) {
        latestByCountry.set(item.country, item);
      }
    });
    
    return Array.from(latestByCountry.values());
  }, [data]);
  
  // Apply sorting
  const sortedData = useMemo(() => {
    return [...latestCountryData].sort((a, b) => {
      const aValue = a[sortConfig.key] as number;
      const bValue = b[sortConfig.key] as number;
      
      if (sortConfig.direction === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }, [latestCountryData, sortConfig]);
  
  const handleSort = (key: keyof CountryData) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'desc' ? 'asc' : 'desc'
    }));
  };
  
  // Format large numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };
  
  // Calculate mortality rate
  const calculateMortalityRate = (country: CountryData) => {
    return country.totalCases > 0 ? (country.totalDeaths / country.totalCases) * 100 : 0;
  };
  
  // Configure table columns
  const columns = [
    { key: 'country', label: 'Country' },
    { key: 'totalCases', label: 'Total Cases' },
    { key: 'totalDeaths', label: 'Total Deaths' },
    { key: 'mortalityRate', label: 'Mortality Rate' },
    { key: 'totalVaccinations', label: 'Vaccinations' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="text-lg font-medium p-4 border-b">Global Data by Country</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th 
                  key={column.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(column.key as keyof CountryData)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {sortConfig.key === column.key && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map(country => (
              <tr key={country.country} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {country.country}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatNumber(country.totalCases)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatNumber(country.totalDeaths)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {calculateMortalityRate(country).toFixed(2)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatNumber(country.totalVaccinations || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GlobalDataTable;