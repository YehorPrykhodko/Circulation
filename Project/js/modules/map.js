import L from 'leaflet';

// Création d'un marqueur rouge personnalisé
const redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Initialise la carte avec Leaflet.js
export function initMap(latitude, longitude) {
  const map = L.map('map').setView([latitude, longitude], 13);

  console.log("Carte initialisée avec succès :", map); // Vérifie l'objet carte

  // Ajouter une couche OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">Contributeurs OpenStreetMap',
    maxZoom: 19,
  }).addTo(map);

  // Ajouter un marqueur de position actuelle avec une icône personnalisée
  L.marker([latitude, longitude], { icon: redIcon })
    .addTo(map)
    .bindPopup('Vous êtes ici.') // Message dans la popup
    .openPopup(); // Ouvre la popup par défaut

  return map; // Retourne l'objet carte
}
