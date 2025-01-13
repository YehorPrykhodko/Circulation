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

$geoUrl = "http://ip-api.com/xml";
$geoData = file_get_contents($geoUrl, false, $context);
if ($geoData === false) {
    die("Erreur : impossible de contacter l'API de géolocalisation.");
}

$geoXml = simplexml_load_string($geoData);
if ($geoXml === false) {
    die("Erreur : XML de géolocalisation invalide.");
}

// On récupère la ville, la latitude, la longitude
$ville     = (string)$geoXml->city;
$latitude  = (string)$geoXml->lat;
$longitude = (string)$geoXml->lon;

// Si la ville n'est pas Nancy, on force Nancy
if (strtolower($ville) !== "nancy") {
    $ville     = "Nancy (IUT Charlemagne)";
    $latitude  = "48.693722";
    $longitude = "6.184417";
}
