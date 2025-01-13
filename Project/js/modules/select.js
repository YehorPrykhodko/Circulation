export function depSelect(data, onSelectCallback) {
    const select = document.getElementById("dep-select");
    if (!select) return;

    select.innerHTML = ""; 
    
    const deps = Object.keys(data[0]).filter(key => key !== "semaine");

    deps.forEach(dep => {
        const option = document.createElement("option");
        option.value = dep;
        option.textContent = dep;
        select.appendChild(option);
    });

    select.addEventListener("change", () => {
        const selectedDep = select.value;
        onSelectCallback(selectedDep);
    });
}
