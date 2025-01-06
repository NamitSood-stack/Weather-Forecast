// Function to load and display search history
function loadHistory() {
    const historyTab = document.getElementById("history-tab");
    const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    if (searchHistory.length === 0) {
        historyTab.innerHTML = "<p>No history available.</p>";
        return;
    }

    searchHistory.forEach(item => {
        const historyItem = document.createElement("div");
        historyItem.classList.add("history-item");

        historyItem.innerHTML = `
            <h4>${item.city}</h4>
            <p>Temperature: ${item.temperature}°C</p>
            <p>Description: ${item.description}</p>
            <p>Date: ${item.date}</p>
            <img src="http://openweathermap.org/img/wn/${item.icon}@2x.png" alt="Weather Icon">
        `;

        historyTab.appendChild(historyItem);
    });
}

// Function to clear the search history
function clearHistory() {
    localStorage.removeItem("searchHistory");
    document.getElementById("history-tab").innerHTML = "<p>History cleared.</p>";
}

// Load history on page load
window.onload = loadHistory;
