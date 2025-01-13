const AIR_QUALITY_API =
  "https://services3.arcgis.com/Is0UwT37raQYl9Jj/arcgis/rest/services/ind_grandest/FeatureServer/0/query?where=lib_zone%3D%27Nancy%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=";

// Fonction pour trouver les données les plus récentes
function getLatestFeature(features) {
  return features.reduce((latest, current) => {
    return current.attributes.date_ech > latest.attributes.date_ech ? current : latest;
  });
}

// Fonction pour récupérer les données de l'API
export async function fetchAirQualityData() {
  try {
    const response = await fetch(AIR_QUALITY_API);
    if (!response.ok) throw new Error("Erreur lors de la requête à l'API de qualité de l'air");
    const data = await response.json();
    if (!data.features || data.features.length === 0) {
      throw new Error("Aucune donnée de qualité de l'air disponible");
    }
    // Sélectionner les données les plus récentes
    return getLatestFeature(data.features);
  } catch (error) {
    console.error("Erreur lors de la récupération des données de qualité de l'air :", error);
    return null;
  }
}

// Fonction pour afficher la qualité de l'air dans le bloc
export function displayAirQualityInfo(airQualityData) {
  if (!airQualityData) {
    console.error("Les données de qualité de l'air sont absentes.");
    return;
  }

  const { lib_qual, coul_qual, source, date_ech } = airQualityData.attributes;

  const airQualityInfoDiv = document.getElementById("air-quality-info");

  airQualityInfoDiv.innerHTML = `
    <h3>Qualité de l'air</h3>
    <ul>
      <li><strong>Qualité :</strong> <span style="color: ${coul_qual}">${lib_qual}</span></li>
      <li><strong>Source :</strong> ${source}</li>
      <li><strong>Date de mise à jour :</strong> ${new Date(date_ech).toLocaleDateString()}</li>
    </ul>
  `;
}
