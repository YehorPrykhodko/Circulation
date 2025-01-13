<?php
require_once __DIR__ . '/geo.php';    
require_once __DIR__ . '/meteo.php';    
require_once __DIR__ . '/airQual.php';  
require_once __DIR__ . '/trafic.php';   

$airHtml = getAirQualityHtml();
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Atmosphere</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin=""/>

    <style>
      body {
        margin: 0 auto;
        max-width: 1200px;
        font-family: sans-serif;
      }
      h1, h2, h3 {
        margin-top: 1em;
        margin-bottom: 0.5em;
      }
      #map {
        width: 100%;
        height: 600px;
        margin: 1em 0;
      }
      .meteo-block {
        border: 1px solid #ccc;
        padding: 10px;
        margin: 1em 0;
      }
    </style>
</head>
<body>

<h1>Atmosphere</h1>
<h2>
    Liens utiles :
    <a href="https://services3.arcgis.com/Is0UwT37raQYl9Jj/arcgis/rest/services/ind_grandest/FeatureServer/0/query?where=lib_zone%3D%27Nancy%27&outFields=*&f=pjson"
       target="_blank">API Qualité Air</a> |
    <a href="http://ip-api.com/xml"
       target="_blank">API Géolocalisation par IP</a> |
    <a href="https://www.infoclimat.fr/public-api/gfs/xml?_ll=48.67103,6.15083&_auth=ARsDFFIsBCZRfFtsD3lSe1Q8ADUPeVRzBHgFZgtuAH1UMQNgUTNcPlU5VClSfVZkUn8AYVxmVW0Eb1I2WylSLgFgA25SNwRuUT1bPw83UnlUeAB9DzFUcwR4BWMLYwBhVCkDb1EzXCBVOFQoUmNWZlJnAH9cfFVsBGRSPVs1UjEBZwNkUjIEYVE6WyYPIFJjVGUAZg9mVD4EbwVhCzMAMFQzA2JRMlw5VThUKFJiVmtSZQBpXGtVbwRlUjVbKVIuARsDFFIsBCZRfFtsD3lSe1QyAD4PZA%3D%3D&_c=19f3aa7d766b6ba91191c8be71dd1ab2"
       target="_blank">API Météo</a> |
    <a href="https://carto.g-ny.org/data/cifs/cifs_waze_v2.json"
       target="_blank">API Trafic</a> |
    <a href="https://github.com/YehorPrykhodko/Circulation"
       target="_blank">Mon GitHub</a>
</h2>

<!-- Bloc Météo -->
<h2>Météo</h2>
<div class="meteo-block">
  <?= $meteoHtml ?>
</div>

  <!-- Qualité de l'air -->
<h2>Qualité de l'air</h2>
<div class="air-block">
  <?= $airHtml ?>
</div>

<h2>Carte trafic</h2>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>
<script>
  // ----------------------------------------------------------------
  // 1) Initialisation de la carte
  // ----------------------------------------------------------------
  const lat   = parseFloat(<?= json_encode($latitude) ?>);
  const lon   = parseFloat(<?= json_encode($longitude) ?>);
  const ville = <?= json_encode($ville) ?>;

  const map = L.map('map').setView([lat, lon], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  const redIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

L.marker([lat, lon], { icon: redIcon })
 .addTo(map)
 .bindPopup(`<b>Vous êtes ici :</b><br>${ville}`);


  // ----------------------------------------------------------------
  // 2) Données de trafic (incidents Waze)
  // ----------------------------------------------------------------
  const incidents = <?= json_encode($incidents, JSON_HEX_TAG|JSON_HEX_QUOT|JSON_HEX_AMP|JSON_HEX_APOS) ?>;
  incidents.forEach(incident => {
    if (incident.location && incident.location.polyline) {
     const coords = incident.location.polyline.split(' ').map(Number);
      if (coords.length >= 2) {
        const latInc = coords[0];
        const lonInc = coords[1];

        L.marker([latInc, lonInc])
          .addTo(map)
          .bindPopup(`
            <b>${incident.short_description}</b><br>
            ${incident.description}<br><br>
            <b>Rue :</b> ${incident.location.street}<br>
            <b>Début :</b> ${incident.starttime}<br>
            <b>Fin :</b> ${incident.endtime}<br>
            <b>Source :</b> ${incident.source.name}
          `);
      }
    }
  });
</script>

</body>
</html>
