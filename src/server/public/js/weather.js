const getTime = (time) => {
    const date = new Date(time * 1000);
    // adds a 0 at the start if it's a single digit = 5 -> 05
    const mins = String(date.getMinutes()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    return `${hours}:${mins}`;
}
const generateWeatherCard = (data) => {
    console.log(data);
    return `<div class="container py-5">

    <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-md-12 col-lg-8 col-xl-6">
    
        <div class="card" style="color: #4B515D; border-radius: 35px;">
            <div class="card-body p-4">
    
            <div class="d-flex">
                <h6 class="flex-grow-1">${data.name}</h6>
                <h6>${getTime(data.dt)}</h6>
            </div>
    
            <div class="d-flex flex-column text-center mt-5 mb-4">
                <h6 class="display-4 mb-0 font-weight-bold" style="color: #1C2331;"> ${data.main.temp}°C </h6>
                <span class="small" style="color: #868B94">${data.weather[0].description}</span>
            </div>
    
            <div class="d-flex align-items-center">
                <div class="flex-grow-1" style="font-size: 1rem;">
                <div><i class="fas fa-wind fa-fw" style="color: #868B94;"></i> <span class="ms-1"> ${data.wind.speed} m/s </span></div>
                <div><i class="fas fa-tint fa-fw" style="color: #868B94;"></i> <span class="ms-1"> ${data.main.humidity}% </span></div>
                <div><i class="fas fa-sun fa-fw" style="color: #868B94;"></i> <span class="ms-1"> ${getTime(data.sys.sunrise)} </span></div>
                <div><i class="fas fa-moon fa-fw" style="color: #868B94;"></i> <span class="ms-1"> ${getTime(data.sys.sunset)} </span></div>

                </div>
                <div>

                </div>
            </div>
    
            </div>
        </div>
    
        </div>
    </div>
    
    </div>`;
};

const inputField = document.getElementById("weather-city");

const btn = document.getElementById("weather-submit");

const section = document.getElementById("section");

const getWeather = (city) => {
    let url = `/api/weather/${city}`;
    fetch(url).then(res => res.json()).then(response => {
        if(response?.name == "Error") {
            return Swal.fire("City not found", "Check the city name and try again", "error");
        }
        section.innerHTML = "";
        console.log(response);
        section.innerHTML += generateWeatherCard(response);
    });
}

btn.addEventListener('click', e => {
    const value = inputField.value;
    if (!value) {
        return Swal.fire("Input a city name", "", "error");
    }
    getWeather(value);
});

getWeather("me");