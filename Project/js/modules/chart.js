import Chart from "chart.js/auto";

let sarsChart = null; // Глобальная переменная для хранения текущего графика

export function renderSarsChart(data) {
    const labels = data.map(item => item.semaine); // Используем значение `semaine`
    const values = data.map(item => item.value);   // Используем значение `value`

    console.log("Метки для графика:", labels);
    console.log("Значения для графика:", values);

    // Проверяем существование контейнера для графика
    const chartContainer = document.getElementById("sars-chart-container");
    if (!chartContainer) {
        console.error("Контейнер для графика не найден!");
        return;
    }

    // Если график уже существует, удаляем его
    if (sarsChart) {
        sarsChart.destroy();
    }

    // Создаём или обновляем график
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
