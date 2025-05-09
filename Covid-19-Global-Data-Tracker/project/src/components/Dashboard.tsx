import React, { useState, useEffect } from 'react';
import { Activity, Users, Brush as Virus, Heart, Syringe } from 'lucide-react';
import { 
  fetchCovidData, 
  getCountryOptions, 
  calculateGlobalStats,
  prepareTimeseriesData,
  calculateVaccinationData
} from '../services/dataService';
import { CountryData, CountryOption, GlobalStats, TimeseriesData, VaccinationData } from '../types';
import StatCard from './StatCard';
import TimeseriesChart from './TimeseriesChart';
import CountrySelector from './CountrySelector';
import MetricSelector from './MetricSelector';
import VaccinationProgress from './VaccinationProgress';
import GlobalDataTable from './GlobalDataTable';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [covidData, setCovidData] = useState<CountryData[]>([]);
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [countryOptions] = useState<CountryOption[]>(getCountryOptions());
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['United States', 'India', 'Brazil']);
  const [selectedMetric, setSelectedMetric] = useState<string>('totalCases');
  const [timeseriesData, setTimeseriesData] = useState<TimeseriesData[]>([]);
  const [vaccinationData, setVaccinationData] = useState<VaccinationData[]>([]);

  // Metric options for selector
  const metricOptions = [
    { value: 'totalCases', label: 'Total Cases' },
    { value: 'newCases', label: 'New Cases' },
    { value: 'totalDeaths', label: 'Total Deaths' },
    { value: 'newDeaths', label: 'New Deaths' },
    { value: 'totalVaccinations', label: 'Vaccinations' },
  ];

  // Chart colors
  const chartColors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
  ];

  // Fetch data on component mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchCovidData();
        setCovidData(data);
        
        // Calculate global stats
        const stats = calculateGlobalStats(data);
        setGlobalStats(stats);
        
        // Prepare timeseries data for default countries and metric
        const timeseries = prepareTimeseriesData(data, selectedCountries, selectedMetric);
        setTimeseriesData(timeseries);
        
        // Calculate vaccination data
        const vaccinations = calculateVaccinationData(data);
        setVaccinationData(vaccinations);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading COVID data:', error);
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Update timeseries when countries or metric changes
  useEffect(() => {
    if (covidData.length) {
      const timeseries = prepareTimeseriesData(covidData, selectedCountries, selectedMetric);
      setTimeseriesData(timeseries);
    }
  }, [covidData, selectedCountries, selectedMetric]);

  // Format numbers for display
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading COVID-19 data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Global stats */}
      {globalStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Cases"
            value={formatNumber(globalStats.totalCases)}
            icon={<Virus className="h-5 w-5 text-white" />}
            color="bg-blue-600"
          />
          <StatCard
            title="Total Deaths"
            value={formatNumber(globalStats.totalDeaths)}
            icon={<Heart className="h-5 w-5 text-white" />}
            color="bg-red-600"
          />
          <StatCard
            title="Total Vaccinations"
            value={formatNumber(globalStats.totalVaccinations)}
            icon={<Syringe className="h-5 w-5 text-white" />}
            color="bg-teal-600"
          />
          <StatCard
            title="Countries"
            value={globalStats.countries}
            icon={<Users className="h-5 w-5 text-white" />}
            color="bg-purple-600"
          />
        </div>
      )}

      {/* Filters and chart section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 space-y-6">
          <CountrySelector
            options={countryOptions}
            selectedCountries={selectedCountries}
            onChange={setSelectedCountries}
          />
          <MetricSelector
            options={metricOptions}
            selectedMetric={selectedMetric}
            onChange={setSelectedMetric}
          />
          <VaccinationProgress data={vaccinationData} />
        </div>
        <div className="lg:col-span-2">
          <TimeseriesChart
            data={timeseriesData}
            countries={selectedCountries}
            metric={selectedMetric}
            title={`${metricOptions.find(m => m.value === selectedMetric)?.label} Over Time`}
            colors={chartColors}
          />
        </div>
      </div>

      {/* Data table */}
      <div className="mt-8">
        <GlobalDataTable data={covidData} />
      </div>
    </div>
  );
};

export default Dashboard;