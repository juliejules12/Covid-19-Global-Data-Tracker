# COVID-19 Global Data Tracker

## Description

🦠 The **COVID-19 Global Data Tracker** is a comprehensive analysis tool that provides insights into global COVID-19 trends. This project leverages publicly available datasets to explore case counts, recovery rates, and fatalities, as well as geographical and temporal trends. Interactive visualizations help users understand the impact across different regions and time periods.

## Objectives

* Analyze global COVID-19 trends
* Visualize geographical spread and hotspots
* Understand vaccination progress across regions
* Identify high-risk areas for better awareness

## Tools and Libraries Used

* **Pandas** - Data manipulation and analysis
* **Matplotlib & Seaborn** - Data visualization
* **Plotly** - Interactive visualizations
* **Geopandas** - Geospatial data analysis
* **Jupyter Notebook** - Interactive data exploration

## Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/juliejules12/Covid-19-Global-Data-Tracker.git
   cd Covid-19-Global-Data-Tracker
   ```
2. Create a virtual environment and activate it:

   ```bash
   python3 -m venv venv
   source venv/bin/activate   # On Windows use `venv\Scripts\activate`
   ```
3. Install the required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

## Usage

To launch the notebook for analysis:

```bash
jupyter notebook Covid19_Global_Data_Tracker.ipynb
```

Follow the step-by-step sections to perform data analysis and visualization.

## Data Sources

* 🌐 [Johns Hopkins University COVID-19 Data](https://github.com/CSSEGISandData/COVID-19)
* 🏥 [World Health Organization (WHO) COVID-19 Dashboard](https://covid19.who.int/)

## Visualizations & Analysis

The notebook provides:

* 📌 Global case and death trends
* 🗺️ Heatmaps of high-risk regions
* 📅 Country-specific trend analysis
* 💉 Vaccination progress comparisons

## Insights and Reflections

The analysis revealed:

* Significant geographical disparities in COVID-19 spread.
* Clear correlations between government policies and infection rates.
* Regions with higher vaccination rates showed reduced case severity.
* Visualization of hotspot zones highlighted the importance of timely intervention.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

Special thanks to data providers like Johns Hopkins University, WHO, and all contributors involved in global data collection efforts.
