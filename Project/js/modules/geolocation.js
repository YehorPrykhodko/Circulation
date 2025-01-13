// Fonction principale pour obtenir la géolocalisation via IP
export async function getGeolocation(onSuccess) {
    try {
        // Requête vers ipinfo.io
        const response = await fetch('https://ipinfo.io/json');
        
        // Vérifier si la réponse est valide (code 2xx)
        if (!response.ok) {
            console.error('Erreur : réponse du serveur avec un statut invalide');
            return;
        }

        const data = await response.json();

        const [lat, lon] = data.loc.split(',');

        console.log(`Géolocalisation réussie : ${lat}, ${lon}`);
        console.log(`Région : ${data.region}, Ville : ${data.city}`);
        
        onSuccess(lat, lon, data.region, data.city);
      
    } catch (error) {
        console.error('Erreur lors de la requête API IP :', error.message);
    }
}
