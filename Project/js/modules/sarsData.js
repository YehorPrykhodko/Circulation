// URL файла CSV
const SARS_COV2_API_URL = "https://www.data.gouv.fr/fr/datasets/r/2963ccb5-344d-4978-bdd3-08aaf9efe514";

// Функция для загрузки данных SARS-CoV-2
export async function fetchSarsData() {
    try {
        const response = await fetch(SARS_COV2_API_URL);
        if (!response.ok) throw new Error("Ошибка загрузки данных SARS-CoV-2.");
        const csvData = await response.text();
        return csvData;
    } catch (error) {
        console.error("Ошибка в fetchSarsData:", error);
        return null;
    }
}

export function parseCsvData(csvData) {
    const rows = csvData.split("\n").map(row => row.split(";").map(cell => cell.replace(/^"|"$/g, "").trim()));
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, index) => {
            let value = row[index]?.replace(",", ".").trim(); // Заменяем запятую на точку
            obj[header] = value === "NA" || value === undefined ? null : parseFloat(value) || value;
        });
        return obj;
    });
    console.log("parseCsvData: " +  data)
    return data;
}


// Функция для фильтрации данных по станции
export function getStationData(stationName, data) {
    console.log("Входные данные:", data);
    
    // Фильтруем данные для выбранной станции
    const filteredData = data.map(row => ({
        semaine: row["semaine"], // Неделя
        value: row[stationName] // Значение для указанной станции
    })).filter(item => item.value !== null && item.value !== "NA"); // Исключаем пустые значения

    console.log(`Данные для станции ${stationName}:`, filteredData);

    return filteredData;
}
