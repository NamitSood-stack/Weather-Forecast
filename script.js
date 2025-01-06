const apiKey = process.env.API_KEY;
const weatherContainer = document.getElementById("weather-container");
const cityInput = document.getElementById("city");
const tempDiv = document.getElementById("temp-div");
const weatherInfo = document.getElementById("weather-info");
const hourlyForecastDiv = document.getElementById("hourly-forecast");
const fiveDayForecastDiv = document.getElementById("five-day-forecast");
const weatherIcon = document.getElementById("weather-icon");

// Custom icon mapping
const iconMap = {
    atmosphere: "images/atmosphere.svg",
    clear: "images/clear.svg",
    clouds: "images/clouds.svg",
    drizzle: "images/drizzle.svg",
    rain: "images/rain.svg",
    snow: "images/snow.svg",
    thunderstorm: "images/thunderstorm.svg",
};

function getWeatherByCoordinates(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            getHourlyForecast(lat, lon);
            getFiveDayForecast(lat, lon);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("Could not retrieve weather data. Please try again.");
        });
}

// Function to get weather for a specific city entered by the user
function getWeather() {
    const city = cityInput.value;
    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayCurrentWeather(data);

                // Save search history to localStorage
                const historyItem = {
                    city: city,
                    temperature: data.main.temp,
                    description: data.weather[0].description,
                    icon: data.weather[0].icon,
                    date: new Date().toLocaleString(),
                };

                let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
                searchHistory.push(historyItem);
                localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
            } else {
                alert(`Error: ${data.message}`);
            }
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("Could not retrieve weather data. Please try again.");
        });
}

// Function to display the current weather
function displayCurrentWeather(data) {
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const condition = data.weather[0].main.toLowerCase();
    const iconPath = iconMap[condition] || "icons/default.svg";

    tempDiv.innerHTML = `<h3>${temperature}°C</h3>`;
    weatherInfo.innerHTML = `<p>${description}</p>`;
    weatherIcon.src = iconPath;

    // Display local time
    const timezoneOffset = data.timezone;
    const localTime = new Date(Date.now() + timezoneOffset * 1000).toLocaleString([], { timeZone: "UTC", timeZoneName: "short" });
    document.getElementById("local-time").innerHTML = `<p>Local Time: ${localTime}</p>`;
}

// Function to fetch and display hourly forecast
function getHourlyForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list.slice(0, 8));
        })
        .catch(error => {
            console.error("Error fetching hourly forecast:", error);
        });
}

// Function to display the hourly forecast
function displayHourlyForecast(hourlyData) {
    hourlyForecastDiv.innerHTML = "";
    hourlyData.forEach(hour => {
        const time = new Date(hour.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const temp = hour.main.temp;
        const condition = hour.weather[0].main.toLowerCase();
        const iconPath = iconMap[condition] || "icons/default.svg";

        hourlyForecastDiv.innerHTML += `
            <div>
                <p>${time} - ${temp}°C</p>
                <img src="${iconPath}" alt="weather icon">
            </div>`;
    });
}

// Function to fetch and display 5-day forecast
function getFiveDayForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            const dailyData = filterFiveDayForecast(data.list);
            displayFiveDayForecast(dailyData);
        })
        .catch(error => {
            console.error("Error fetching 5-day forecast:", error);
        });
}

// Function to filter 5-day forecast to get one forecast per day (12:00 PM)
function filterFiveDayForecast(forecastData) {
    return forecastData.filter(forecast => forecast.dt_txt.includes("12:00:00"));
}

// Function to display 5-day forecast
function displayFiveDayForecast(dailyData) {
    fiveDayForecastDiv.innerHTML = "";
    dailyData.forEach(day => {
        const date = new Date(day.dt_txt).toDateString();
        const temp = day.main.temp;
        const condition = day.weather[0].main.toLowerCase();
        const iconPath = iconMap[condition] || "icons/default.svg";

        fiveDayForecastDiv.innerHTML += `
            <div>
                <p>${date} - ${temp}°C</p>
                <img src="${iconPath}" alt="weather icon">
            </div>`;
    });
}

// Function to ask for the user's location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherByCoordinates(lat, lon);
        }, () => {
            alert("Geolocation is not supported or permission denied. Please enter a city manually.");
        });
    } else {
        alert("Geolocation is not supported by this browser. Please enter a city manually.");
    }
}

// Call getLocation() on page load to get default location
window.onload = function () {
    getLocation();
};

// Add Enter key event listener for city input
document.getElementById("city").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        getWeather();
    }
});
