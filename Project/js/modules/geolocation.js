// Fonction pour afficher un message d’erreur
export function displayError(message) {
    const locationInfo = document.getElementById('location-info');
    // Vérifier si l'élément existe
    if (!locationInfo) {
        console.error("L'élément #location-info est introuvable dans le DOM.");
        return;
    }
    locationInfo.innerHTML = `<p>${message}</p>`;
}

// Fonction principale pour obtenir la géolocalisation via IP
export async function getGeolocation(onSuccess, onError) {
    try {
        // Requête vers ipinfo.io
        const response = await fetch('https://ipinfo.io/json');
        
        // Vérifier si la réponse est valide (code 2xx)
        if (!response.ok) {
            console.error('Erreur : réponse du serveur avec un statut invalide');
            onError('Impossible d’obtenir votre localisation via l’adresse IP.');
            return;
        }

        const data = await response.json();

        if (data.loc) {
            const [lat, lon] = data.loc.split(',');

            console.log(`Géolocalisation réussie : ${lat}, ${lon}`);
            console.log(`Région : ${data.region}, Ville : ${data.city}`);

            // Appeler le callback onSuccess avec les données obtenues
            onSuccess(lat, lon, data.region, data.city);
        } else {
            console.error('Impossible d’extraire les coordonnées (lat, lon) depuis ipinfo.io');
            onError('Impossible d’obtenir votre localisation via l’adresse IP.');
        }
    } catch (error) {
        console.error('Erreur lors de la requête API IP :', error.message);
        onError('Une erreur s’est produite lors de la tentative de géolocalisation.');
    }
}
