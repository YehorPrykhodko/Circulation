// URL de l'API météo
const WEATHER_API_URL =
  "https://www.infoclimat.fr/public-api/gfs/xml?_ll=48.67103,6.15083&_auth=ARsDFFIsBCZRfFtsD3lSe1Q8ADUPeVRzBHgFZgtuAH1UMQNgUTNcPlU5VClSfVZkUn8AYVxmVW0Eb1I2WylSLgFgA25SNwRuUT1bPw83UnlUeAB9DzFUcwR4BWMLYwBhVCkDb1EzXCBVOFQoUmNWZlJnAH9cfFVsBGRSPVs1UjEBZwNkUjIEYVE6WyYPIFJjVGUAZg9mVD4EbwVhCzMAMFQzA2JRMlw5VThUKFJiVmtSZQBpXGtVbwRlUjVbKVIuARsDFFIsBCZRfFtsD3lSe1QyAD4PZA%3D%3D&_c=19f3aa7d766b6ba91191c8be71dd1ab2";

// Fonction pour récupérer les données météo au format XML
export async function fetchWeatherData() {
    try {
        const response = await fetch(WEATHER_API_URL);
        if (!response.ok) throw new Error("Erreur lors du chargement des données météo.");
        const xmlData = await response.text();
        const xmlDoc = new window.DOMParser().parseFromString(xmlData, "application/xml");
        console.log("Objet XML reçu :", xmlDoc);
        return xmlDoc;
    } catch (error) {
        console.error("Erreur dans fetchWeatherData :", error);
        return null;
    }
}

// Fonction pour appliquer le modèle XSLT
export async function applyXSLTToWeather(xmlDoc, xslUrl) {
    try {
        // Charger le modèle XSL
        const xslResponse = await fetch(xslUrl);
        const xslText = await xslResponse.text();
        const xslDoc = new DOMParser().parseFromString(xslText, "application/xml");

        // Créer un XSLTProcessor
        const xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xslDoc);

        // Appliquer le XSLT au XML
        const resultFragment = xsltProcessor.transformToFragment(xmlDoc, document);

        // Insérer le résultat dans le conteneur
        const weatherInfoDiv = document.getElementById("weather-info");
        weatherInfoDiv.innerHTML = ""; // Vider le conteneur
        weatherInfoDiv.appendChild(resultFragment); // Insérer le résultat

        console.log("XSLT appliqué avec succès et les données sont affichées.");
    } catch (error) {
        console.error("Erreur lors de l'application de XSLT :", error);
    }
}
