import L from 'leaflet';

// Создаем кастомный красный маркер
const redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Initialise la carte avec Leaflet.js
export function initMap(latitude, longitude) {
  const map = L.map('map').setView([latitude, longitude], 13);

  console.log("Карта успешно инициализирована:", map); // Проверяем объект карты

  // Добавляем слой OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  // Добавляем маркер текущего местоположения с кастомной иконкой
  L.marker([latitude, longitude], { icon: redIcon })
    .addTo(map)
    .bindPopup('Vous êtes ici.') // Сообщение в попапе
    .openPopup(); // Открыть попап по умолчанию

  return map; // Возвращаем объект карты
}
