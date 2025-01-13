import { getStations, addStationsToMap } from './modules/stations.js';
import { fetchAirQualityData, displayAirQualityInfo } from './modules/airQuality.js';
import { initMap } from './modules/map.js';
import { getGeolocation, displayError } from './modules/geolocation.js';
import { fetchWeatherData, applyXSLTToWeather } from './modules/weather.js';
import { fetchSarsData, parseCsvData, getStationData } from './modules/sarsData.js';
import { populateStationSelect } from './modules/select.js';
import { renderSarsChart } from './modules/chart.js'; 


async function displayWeatherInfo() {
    const xmlDoc = await fetchWeatherData();
    if (xmlDoc) {
        await applyXSLTToWeather(xmlDoc, './meteo.xsl');
    }
}

async function displayMapWithStationsAndAirQuality(latitude, longitude) {
    const map = initMap(latitude, longitude);
  
    try {
      // Загружаем данные о станциях
      const stations = await getStations();
      addStationsToMap(stations, map);
  
      // Загружаем и отображаем данные качества воздуха в блоке
      const airQualityData = await fetchAirQualityData();
      displayAirQualityInfo(airQualityData);
  
      // Загружаем и отображаем погоду
      await displayWeatherInfo();
  
      // Загружаем данные SARS-CoV-2
      const sarsCsvData = await fetchSarsData();
      const sarsData = parseCsvData(sarsCsvData);
  
      // Создаём выпадающий список для станций
      populateStationSelect(sarsData, selectedStation => {
        if (selectedStation) {
          const filteredData = getStationData(selectedStation, sarsData);
          renderSarsChart(filteredData);
        }
      });
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
}

// Инициализация геолокации и отображение данных
getGeolocation(displayMapWithStationsAndAirQuality, displayError);
