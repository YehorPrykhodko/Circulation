// URL des API pour les informations et le statut des stations
const STATION_INFO_URL = "https://api.cyclocity.fr/contracts/nancy/gbfs/station_information.json";
const STATION_STATUS_URL = "https://api.cyclocity.fr/contracts/nancy/gbfs/station_status.json";

// Fonction pour récupérer les données depuis une API
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erreur lors du chargement : ${url}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Fonction pour récupérer et combiner les données des stations
export async function getStations() {
    const stationInfoData = await fetchData(STATION_INFO_URL);
    const stationStatusData = await fetchData(STATION_STATUS_URL);
  
    // console.log("Données des stations (information) :", stationInfoData); // Log des données d'information
    // console.log("Données des stations (statut) :", stationStatusData);    // Log des données de statut
  
    if (!stationInfoData || !stationStatusData) {
      console.error("Impossible de charger les données des stations.");
      return [];
    }
  
    // Création d'une map pour associer les informations aux statuts via station_id
    const stationInfoMap = new Map();
    stationInfoData.data.stations.forEach((station) => {
      stationInfoMap.set(station.station_id, station);
    });
  
    // Fusion des données
    const combinedStations = stationStatusData.data.stations.map((status) => {
      const info = stationInfoMap.get(status.station_id);
      if (!info) {
        console.warn(`Aucune information trouvée pour la station ID : ${status.station_id}`);
        return null;
      }
      return {
        id: status.station_id,
        name: info.name || "Nom inconnu",
        address: info.address || "Adresse inconnue",
        lat: info.lat || null,
        lon: info.lon || null,
        capacity: info.capacity || 0,
        numBikesAvailable: status.num_bikes_available || 0,
        numDocksAvailable: status.num_docks_available || 0,
      };
    });
  
    // console.log("Stations combinées :", combinedStations); // Log des stations combinées
    return combinedStations.filter((station) => station !== null); // Supprime les stations invalides
}  

// Fonction pour ajouter des stations sur la carte Leaflet
export function addStationsToMap(stations, map) {
  console.log(stations)

  stations.forEach((station) => {
    const popupContent = `
      <strong>${station.name}</strong><br>
      Adresse : ${station.address}<br>
      Vélos disponibles : ${station.numBikesAvailable}<br>
      Places libres : ${station.numDocksAvailable}
    `;
    // console.log(map)
    // console.log(L.marker([station.lat, station.lon]))
    // console.log([station.lat, station.lon])

    L.marker([station.lat, station.lon])
      .addTo(map)
      .bindPopup(popupContent)
  });
}
