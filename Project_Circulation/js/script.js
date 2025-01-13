import { getStations, addStationsToMap } from './modules/stations.js';
import { fetchAirQualityData, displayAirQualityInfo } from './modules/airQuality.js';
import { initMap } from './modules/map.js';
import { getGeolocation } from './modules/geolocation.js';
import { fetchWeatherData, applyXSLTToWeather } from './modules/weather.js';
import { fetchSarsData, parseCsvData, getDepartmentData } from './modules/sarsData.js';
import { depSelect } from './modules/select.js';
import { renderSarsChart } from './modules/chart.js';

// Fonction pour afficher les informations météo
async function displayWeatherInfo() {
    const xmlDoc = await fetchWeatherData();
    if (xmlDoc) {
        await applyXSLTToWeather(xmlDoc, './meteo.xsl');
    }
}

// Fonction pour afficher la carte avec les stations et les données de qualité de l'air
async function display(latitude, longitude) {
    const map = initMap(latitude, longitude);

    try {
        // Charger les données des stations
        const stations = await getStations();
        addStationsToMap(stations, map);

        // Charger et afficher les données de qualité de l'air
        const airQualityData = await fetchAirQualityData();
        displayAirQualityInfo(airQualityData);

        // Charger et afficher les données météo
        await displayWeatherInfo();

        // Charger les données SARS-CoV-2
        const sarsCsvData = await fetchSarsData();
        const sarsData = parseCsvData(sarsCsvData);

        // Créer une liste déroulante pour les départements
        depSelect(sarsData, selectedDepartment => {
          if (selectedDepartment) {
              const filteredData = getDepartmentData(selectedDepartment, sarsData);
              renderSarsChart(filteredData);
          }
        });

    } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
    }
}

// Initialisation de la géolocalisation et affichage des données
getGeolocation(display);
