import L from 'leaflet';

const AIR_QUALITY_API =
  "https://services3.arcgis.com/Is0UwT37raQYl9Jj/arcgis/rest/services/ind_grandest/FeatureServer/0/query?where=lib_zone%3D%27Nancy%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=";

// Функция для поиска самых актуальных данных
function getLatestFeature(features) {
  return features.reduce((latest, current) => {
    return current.attributes.date_ech > latest.attributes.date_ech ? current : latest;
  });
}

// Функция для получения данных API
export async function fetchAirQualityData() {
  try {
    const response = await fetch(AIR_QUALITY_API);
    if (!response.ok) throw new Error("Ошибка при запросе API качества воздуха");
    const data = await response.json();
    if (!data.features || data.features.length === 0) {
      throw new Error("Нет данных о качестве воздуха");
    }
    // Выбираем самые последние данные
    return getLatestFeature(data.features);
  } catch (error) {
    console.error("Ошибка получения данных качества воздуха:", error);
    return null;
  }
}

// Функция для отображения качества воздуха в блоке
export function displayAirQualityInfo(airQualityData) {
  if (!airQualityData) {
    console.error("Данные качества воздуха отсутствуют.");
    return;
  }

  const { lib_qual, coul_qual, source, date_ech } = airQualityData.attributes;

  const airQualityInfoDiv = document.getElementById("air-quality-info");

  airQualityInfoDiv.innerHTML = `
    <h3>Качество воздуха</h3>
    <ul>
      <li><strong>Качество:</strong> <span style="color: ${coul_qual}">${lib_qual}</span></li>
      <li><strong>Источник:</strong> ${source}</li>
      <li><strong>Дата обновления:</strong> ${new Date(date_ech).toLocaleDateString()}</li>
    </ul>
  `;
}