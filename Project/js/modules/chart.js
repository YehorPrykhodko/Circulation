import Chart from "chart.js/auto";

let sarsChart = null; // Variable globale pour stocker le graphique actuel

export function renderSarsChart(data) {
    const labels = data.map(item => item.semaine); // Utilisation de la valeur `semaine`
    const values = data.map(item => item.value);   // Utilisation de la valeur `value`

    console.log("Étiquettes pour le graphique :", labels);
    console.log("Valeurs pour le graphique :", values);

    // Vérifier l'existence du conteneur pour le graphique
    const chartContainer = document.getElementById("sars-chart-container");
    if (!chartContainer) {
        console.error("Le conteneur pour le graphique est introuvable !");
        return;
    }

    // Si le graphique existe déjà, on le détruit
    if (sarsChart) {
        sarsChart.destroy();
    }

    // Créer ou mettre à jour le graphique
    const ctx = document.getElementById("sarsChart").getContext("2d");
    sarsChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Concentration SARS-CoV-2 (eq/L)",
                    data: values,
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top"
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Semaine"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Concentration (eq/L)"
                    }
                }
            }
        }
    });
}
