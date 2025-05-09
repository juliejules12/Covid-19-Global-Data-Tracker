import { CountryData, CountryOption, GlobalStats, TimeseriesData, VaccinationData } from '../types';

// Sample country list for dropdown
const countryOptions: CountryOption[] = [
  { label: 'United States', value: 'United States', code: 'US' },
  { label: 'India', value: 'India', code: 'IN' },
  { label: 'Brazil', value: 'Brazil', code: 'BR' },
  { label: 'United Kingdom', value: 'United Kingdom', code: 'GB' },
  { label: 'Russia', value: 'Russia', code: 'RU' },
  { label: 'France', value: 'France', code: 'FR' },
  { label: 'Germany', value: 'Germany', code: 'DE' },
  { label: 'Italy', value: 'Italy', code: 'IT' },
  { label: 'Spain', value: 'Spain', code: 'ES' },
  { label: 'Kenya', value: 'Kenya', code: 'KE' },
];

// In a real app, this would fetch from an API or process CSV data
export async function fetchCovidData(): Promise<CountryData[]> {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Sample data (in a real app, this would come from an API or CSV import)
  return generateSampleData();
}

export function getCountryOptions(): CountryOption[] {
  return countryOptions;
}

export function calculateGlobalStats(data: CountryData[]): GlobalStats {
  // Get most recent data points for each country
  const latestByCountry = new Map<string, CountryData>();
  
  data.forEach(item => {
    const existing = latestByCountry.get(item.country);
    if (!existing || new Date(item.date) > new Date(existing.date)) {
      latestByCountry.set(item.country, item);
    }
  });
  
  const latestData = Array.from(latestByCountry.values());
  
  // Calculate global totals
  const totalCases = latestData.reduce((sum, item) => sum + item.totalCases, 0);
  const totalDeaths = latestData.reduce((sum, item) => sum + item.totalDeaths, 0);
  const totalVaccinations = latestData.reduce((sum, item) => sum + (item.totalVaccinations || 0), 0);
  
  return {
    totalCases,
    totalDeaths,
    totalVaccinations,
    countries: latestData.length,
    lastUpdated: new Date().toISOString().split('T')[0],
  };
}

export function prepareTimeseriesData(
  data: CountryData[],
  countries: string[],
  metric: string
): TimeseriesData[] {
  // Group by date
  const dateMap = new Map<string, {[country: string]: number}>();
  
  data.forEach(item => {
    if (countries.includes(item.country)) {
      if (!dateMap.has(item.date)) {
        dateMap.set(item.date, { date: item.date });
      }
      
      const dateEntry = dateMap.get(item.date)!;
      dateEntry[item.country] = item[metric as keyof CountryData] as number || 0;
    }
  });
  
  // Convert to array and sort by date
  return Array.from(dateMap.values())
    .sort((a, b) => new Date(a.date as string).getTime() - new Date(b.date as string).getTime());
}

export function calculateVaccinationData(data: CountryData[]): VaccinationData[] {
  // Get most recent data points for each country
  const latestByCountry = new Map<string, CountryData>();
  
  data.forEach(item => {
    if (item.peopleVaccinated && item.population) {
      const existing = latestByCountry.get(item.country);
      if (!existing || new Date(item.date) > new Date(existing.date)) {
        latestByCountry.set(item.country, item);
      }
    }
  });
  
  // Calculate vaccination percentages
  return Array.from(latestByCountry.values())
    .map(item => ({
      country: item.country,
      peopleVaccinated: item.peopleVaccinated || 0,
      population: item.population,
      percentage: ((item.peopleVaccinated || 0) / item.population) * 100,
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

// Helper function to generate sample data
function generateSampleData(): CountryData[] {
  const data: CountryData[] = [];
  const countries = countryOptions.map(option => option.value);
  const startDate = new Date('2020-03-01');
  const endDate = new Date('2023-01-01');
  
  // Population estimates (in millions)
  const populations: {[key: string]: number} = {
    'United States': 331,
    'India': 1380,
    'Brazil': 212,
    'United Kingdom': 67,
    'Russia': 144,
    'France': 65,
    'Germany': 83,
    'Italy': 60,
    'Spain': 47,
    'Kenya': 53,
  };
  
  // Generate time series
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
    const dateStr = d.toISOString().split('T')[0];
    const daysSinceStart = Math.floor((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    countries.forEach(country => {
      // Create different patterns for each country
      const countryIndex = countries.indexOf(country);
      const population = populations[country] * 1000000;
      
      // Generate case data with different growth patterns
      const totalCasesPercent = Math.min(0.3, (0.05 + countryIndex * 0.01) * (1 - Math.exp(-daysSinceStart / (100 + countryIndex * 20))));
      const totalCases = Math.floor(population * totalCasesPercent);
      
      const prevData = data.find(item => item.country === country && item.date === new Date(d.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      const prevTotalCases = prevData?.totalCases || 0;
      const newCases = totalCases - prevTotalCases;
      
      // Death rate varies by country
      const deathRate = 0.01 + (countryIndex % 5) * 0.005;
      const totalDeaths = Math.floor(totalCases * deathRate);
      const prevTotalDeaths = prevData?.totalDeaths || 0;
      const newDeaths = totalDeaths - prevTotalDeaths;
      
      // Vaccination data starting from 2021
      let totalVaccinations = 0;
      let peopleVaccinated = 0;
      
      if (d >= new Date('2021-01-01')) {
        const daysSinceVaccineStart = Math.floor((d.getTime() - new Date('2021-01-01').getTime()) / (1000 * 60 * 60 * 24));
        const vaccinationRate = Math.min(0.9, (0.2 + countryIndex * 0.05) * (1 - Math.exp(-daysSinceVaccineStart / (100 + countryIndex * 10))));
        totalVaccinations = Math.floor(population * vaccinationRate * 1.8); // Some people get 2 doses
        peopleVaccinated = Math.floor(population * vaccinationRate);
      }
      
      data.push({
        country,
        countryCode: countryOptions.find(c => c.value === country)?.code || '',
        date: dateStr,
        newCases: Math.max(0, newCases),
        totalCases,
        newDeaths: Math.max(0, newDeaths),
        totalDeaths,
        totalVaccinations,
        peopleVaccinated,
        population,
      });
    });
  }
  
  return data;
}