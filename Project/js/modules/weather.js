// URL API météo
const WEATHER_API_URL =
  "https://www.infoclimat.fr/public-api/gfs/xml?_ll=48.67103,6.15083&_auth=ARsDFFIsBCZRfFtsD3lSe1Q8ADUPeVRzBHgFZgtuAH1UMQNgUTNcPlU5VClSfVZkUn8AYVxmVW0Eb1I2WylSLgFgA25SNwRuUT1bPw83UnlUeAB9DzFUcwR4BWMLYwBhVCkDb1EzXCBVOFQoUmNWZlJnAH9cfFVsBGRSPVs1UjEBZwNkUjIEYVE6WyYPIFJjVGUAZg9mVD4EbwVhCzMAMFQzA2JRMlw5VThUKFJiVmtSZQBpXGtVbwRlUjVbKVIuARsDFFIsBCZRfFtsD3lSe1QyAD4PZA%3D%3D&_c=19f3aa7d766b6ba91191c8be71dd1ab2";

// Fonction pour récupérer les données météo au format XML
export async function fetchWeatherData() {
    try {
        const response = await fetch(WEATHER_API_URL);
        if (!response.ok) throw new Error("Erreur lors du chargement des données météo.");
        const xmlData = await response.text();
        const xmlDoc = new window.DOMParser().parseFromString(xmlData, "application/xml");
        console.log("Полученный XML-объект:", xmlDoc);
        return xmlDoc;
    } catch (error) {
        console.error("Erreur dans fetchWeatherData :", error);
        return null;
    }
}

// Fonction pour appliquer XSLT-шаблон
export async function applyXSLTToWeather(xmlDoc, xslUrl) {
    try {
        // Загружаем XSL-шаблон
        const xslResponse = await fetch(xslUrl);
        const xslText = await xslResponse.text();
        const xslDoc = new DOMParser().parseFromString(xslText, "application/xml");

        // Создаем XSLTProcessor
        const xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xslDoc);

        // Применяем XSLT к XML
        const resultFragment = xsltProcessor.transformToFragment(xmlDoc, document);

        // Вставляем результат в контейнер
        const weatherInfoDiv = document.getElementById("weather-info");
        weatherInfoDiv.innerHTML = ""; // Очищаем контейнер
        weatherInfoDiv.appendChild(resultFragment); // Вставляем результат

        console.log("XSLT успешно применен и данные отображены.");
    } catch (error) {
        console.error("Ошибка при применении XSLT:", error);
    }
}
