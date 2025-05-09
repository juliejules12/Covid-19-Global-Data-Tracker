import React from 'react';
import { CountryOption } from '../types';

interface CountrySelectorProps {
  options: CountryOption[];
  selectedCountries: string[];
  onChange: (countries: string[]) => void;
  maxSelection?: number;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  options,
  selectedCountries,
  onChange,
  maxSelection = 5
}) => {
  const handleToggleCountry = (country: string) => {
    if (selectedCountries.includes(country)) {
      onChange(selectedCountries.filter(c => c !== country));
    } else {
      if (selectedCountries.length < maxSelection) {
        onChange([...selectedCountries, country]);
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Compare Countries</h3>
      <p className="text-sm text-gray-500 mb-4">
        Select up to {maxSelection} countries to compare
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {options.map(country => (
          <button
            key={country.value}
            onClick={() => handleToggleCountry(country.value)}
            className={`py-2 px-3 text-sm rounded-md transition-all duration-200 flex items-center justify-between transform active:scale-95 ${
              selectedCountries.includes(country.value)
                ? 'bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50'
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50'
            } focus:outline-none`}
          >
            <span>{country.label}</span>
            {selectedCountries.includes(country.value) && (
              <span className="ml-2 text-blue-600">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CountrySelector;