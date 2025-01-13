<?php
function getAirQualityHtml()
{
    // 1) On récupère les données JSON depuis ArcGIS
    $context = stream_context_create([
        'http' => [
            'proxy' => 'tcp://www-cache:3128',
            'request_fulluri' => true,
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false
        ]
    ]);

    $airQualityUrl = "https://services3.arcgis.com/Is0UwT37raQYl9Jj/arcgis/rest/services/ind_grandest/FeatureServer/0/query?where=lib_zone%3D%27Nancy%27&outFields=*&f=pjson";
    $airResponse   = file_get_contents($airQualityUrl, false, $context);

    if ($airResponse === false) {
        return "<p style='color:red;'>Erreur : impossible de récupérer les données de qualité de l'air.</p>";
    }

    $airData = json_decode($airResponse, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return "<p style='color:red;'>Erreur : JSON qualité de l'air invalide.</p>";
    }

    $airFeatures = $airData['features'] ?? [];

    // 2) On construit un petit bloc HTML (par exemple, on affiche juste la première valeur)
    if (!empty($airFeatures)) {
        $premier = $airFeatures[0]; 
        $attrs   = $premier['attributes'];
        $qualite = $attrs['lib_qual'] ?? 'Inconnue';

        $html = "<p>Qualité : " . htmlspecialchars($qualite) . "</p>";
    } else {
        $html = "<p>Aucune donnée de qualité de l'air disponible.</p>";
    }

    return $html;
}
