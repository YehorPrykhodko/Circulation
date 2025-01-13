<?php
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

$traficUrl = "https://carto.g-ny.org/data/cifs/cifs_waze_v2.json";
$traficResponse = file_get_contents($traficUrl, false, $context);
if ($traficResponse === false) {
    die("Erreur : impossible de récupérer les données de trafic.");
}

$traficData = json_decode($traficResponse, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    die("Erreur : JSON trafic invalide.");
}

$incidents = $traficData['incidents'] ?? [];
