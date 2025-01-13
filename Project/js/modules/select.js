export function populateStationSelect(data, onSelectCallback) {
    const select = document.getElementById("station-select");
    if (!select) return;

    select.innerHTML = ""; 
    
    const stations = Object.keys(data[0]).filter(key => key !== "semaine");

    stations.forEach(station => {
        const option = document.createElement("option");
        option.value = station;
        option.textContent = station;
        select.appendChild(option);
    });

    select.addEventListener("change", () => {
        const selectedStation = select.value;
        onSelectCallback(selectedStation);
    });
}
