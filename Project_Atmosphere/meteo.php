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

// URL d'Infoclimat (ou autre)
$meteoUrl = "https://www.infoclimat.fr/public-api/gfs/xml?_ll=48.67103,6.15083&_auth=ARsDFFIsBCZRfFtsD3lSe1Q8ADUPeVRzBHgFZgtuAH1UMQNgUTNcPlU5VClSfVZkUn8AYVxmVW0Eb1I2WylSLgFgA25SNwRuUT1bPw83UnlUeAB9DzFUcwR4BWMLYwBhVCkDb1EzXCBVOFQoUmNWZlJnAH9cfFVsBGRSPVs1UjEBZwNkUjIEYVE6WyYPIFJjVGUAZg9mVD4EbwVhCzMAMFQzA2JRMlw5VThUKFJiVmtSZQBpXGtVbwRlUjVbKVIuARsDFFIsBCZRfFtsD3lSe1QyAD4PZA%3D%3D&_c=19f3aa7d766b6ba91191c8be71dd1ab2";

$xmlContent = file_get_contents($meteoUrl, false, $context);
if ($xmlContent === false) {
    die("Erreur : impossible de récupérer les données météo.");
}

// Conversion en SimpleXML
$xmlObj = simplexml_load_string($xmlContent);
if ($xmlObj === false) {
    die("Erreur : XML météo invalide.");
}

$nbEcheances = count($xmlObj->echeance);

// XSLT
$domXml = new DOMDocument();
$domXml->loadXML($xmlContent);

$xslPath = __DIR__ . '/meteo.xsl';
if (!file_exists($xslPath)) {
    die("Erreur : fichier meteo.xsl introuvable.");
}

$xslDoc = new DOMDocument();
$xslDoc->load($xslPath);

$proc = new XSLTProcessor();
$proc->importStylesheet($xslDoc);

$meteoHtml = $proc->transformToXML($domXml);
if (!$meteoHtml) {
    $meteoHtml = "<p>Erreur lors de la transformation XSL</p>";
}
