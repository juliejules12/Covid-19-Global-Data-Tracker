export interface CountryData {
  country: string;
  countryCode: string;
  date: string;
  newCases: number;
  totalCases: number;
  newDeaths: number;
  totalDeaths: number;
  totalVaccinations: number;
  peopleVaccinated: number;
  population: number;
}

export interface GlobalStats {
  totalCases: number;
  totalDeaths: number;
  totalVaccinations: number;
  countries: number;
  lastUpdated: string;
}

export interface CountryOption {
  label: string;
  value: string;
  code: string;
}

export type TimeseriesMetric = 'totalCases' | 'totalDeaths' | 'newCases' | 'newDeaths' | 'totalVaccinations';

export interface TimeseriesData {
  date: string;
  [country: string]: string | number;
}

export interface VaccinationData {
  country: string;
  peopleVaccinated: number;
  population: number;
  percentage: number;
}