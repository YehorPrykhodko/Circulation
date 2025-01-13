// URL du fichier CSV
const SARS_COV2_API_URL = "https://www.data.gouv.fr/fr/datasets/r/2963ccb5-344d-4978-bdd3-08aaf9efe514";

// Fonction pour charger les données SARS-CoV-2
export async function fetchSarsData() {
    try {
        const response = await fetch(SARS_COV2_API_URL);
        if (!response.ok) throw new Error("Erreur lors du chargement des données SARS-CoV-2.");
        const csvData = await response.text();
        return csvData;
    } catch (error) {
        console.error("Erreur dans fetchSarsData :", error);
        return null;
    }
}

export function parseCsvData(csvData) {
    const rows = csvData.split("\n").map(row => row.split(";").map(cell => cell.replace(/^"|"$/g, "").trim()));
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, index) => {
            let value = row[index]?.replace(",", ".").trim(); // Remplace la virgule par un point
            obj[header] = value === "NA" || value === undefined ? null : parseFloat(value) || value;
        });
        return obj;
    });
    console.log("parseCsvData :", data);
    return data;
}

// Fonction pour filtrer les données par département
export function getDepartmentData(departmentName, data) {
    console.log("Données d'entrée :", data);
    
    // Filtrer les données pour le département sélectionné
    const filteredData = data.map(row => ({
        semaine: row["semaine"], // Semaine
        value: row[departmentName] // Valeur pour le département spécifié
    })).filter(item => item.value !== null && item.value !== "NA"); // Exclure les valeurs nulles

    console.log(`Données pour le département ${departmentName} :`, filteredData);

    return filteredData;
}
