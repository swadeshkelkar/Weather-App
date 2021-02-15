//api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
//api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
//api.ipgeolocation.io/timezone?apiKey=API_KEY&lat=-27.4748&long=153.017

const Api = {
    key0: '2ece28a4f1bef9938dee1e93c2746ec1',
    key1: '9f1d515d78264504a9c7835b069d341c',
    baseURLR: 'https://api.openweathermap.org/data/2.5/weather',
    baseURLF: 'https://api.openweathermap.org/data/2.5/forecast',
    timeURL: 'https://api.ipgeolocation.io/timezone'
};

const searchInputBox = document.getElementById('input-box');
const submitButton = document.querySelector('.submit');

function clearSearch() {
    searchInputBox.value = '';
};

// Event Listener on click
submitButton.addEventListener('click', () => {

    getWeatherReport(searchInputBox.value);
    getWeatherForecast(searchInputBox.value);
    clearSearch();
    
});

// Event Listener on keypress
searchInputBox.addEventListener('keypress', (event) =>{

    if(event.keyCode == 13) {
        // console.log(searchInputBox.value);
        getWeatherReport(searchInputBox.value);
        getWeatherForecast(searchInputBox.value);
        clearSearch();
    }
});

// Get Weather Report
function getWeatherReport(city) {
    fetch(`${Api.baseURLR}?q=${city}&appid=${Api.key0}&units=metric`)
    .then(weatherRep => {
        return weatherRep.json();
    }).then(showWeatherReport);
};


// Get Weather Forecast
function getWeatherForecast(city) {
    fetch(`${Api.baseURLF}?q=${city}&appid=${Api.key0}&units=metric`)
    .then(weatherFor => {
        return weatherFor.json();
    }).then(showWeatherForecast);

};

// function getTime2(lat, lon) {
//     fetch(`${Api.timeURL}?apiKey=${Api.key1}&lat=${lat}&long=${lon}`)
//     .then(time => {
//         return time.json();
//     }).then(showTime);
// };

//Show Weather Report
function showWeatherReport(weather) {
    // console.log(weather);
    
    try {
        getTime(weather.coord.lat, weather.coord.lon);
        function getTime(lat, lon) {
            fetch(`${Api.timeURL}?apiKey=${Api.key1}&lat=${lat}&long=${lon}`)
            .then(time => {
                return time.json();
            }).then(showTime);
        };

        function showTime(time) {
            const dateTime = document.getElementById('date');
            // console.log(time)
            // const date = time.date_time_wti.slice(0, 17);
            const date = time.date_time

            // console.log(time.date_time_wti);
            const cTime = moment(time.date_time).format('h:mm A');
            // console.log(cTime);
            
            dateTime.innerHTML = date + '<br>' + cTime;
        };

        
        const city = document.getElementById('city');
        city.innerHTML = `${weather.name}, ${weather.sys.country}`;
        
        
        const temperature = document.getElementById('temp');
        temperature.innerHTML = `${Math.round(weather.main.temp)}&deg;C`;
        
        const minMax = document.getElementById('min-max');
        minMax.innerHTML = `${Math.floor(weather.main.temp_min)}&deg;C (min) /
        ${Math.ceil(weather.main.temp_max)}&deg;C (max)`;
        
        const weatherType = document.getElementById('weather');
        weatherType.innerHTML = `${weather.weather[0].description}`;
        
    
        const typeOfWeather = `${weather.weather[0].description}`;
        
        const imgDOM = document.getElementById('img-weather');
        imgDOM.src = "./svgs/"+ typeOfWeather + '.svg';
        
        
        document.getElementById('wind').innerHTML = `Wind: ${weather.wind.speed} km/hr`;
        
        document.getElementById('humidity').innerHTML = `Humidity: ${weather.main.humidity}%`;
        
        document.getElementById('realFeel').innerHTML = `Real Feel: ${Math.round(weather.main.feels_like)}&deg;C`;
        
        document.getElementById('visibilty').innerHTML = `Visibility: ${(weather.visibility)/1000}km`;
        
    } catch (error) {
        document.querySelector('.error').style.display = 'flex';
    }

}

// Show Weather Forecast
async function showWeatherForecast(weather) {
    // console.log(weather);
    const res =  await fetch(`${Api.timeURL}?apiKey=${Api.key1}&lat=${weather.city.coord.lat}&long=${weather.city.coord.lon}`);
    const data = await res.json()
    // console.log(data)
    // console.log(moment.tz.zonesForCountry('US'))
    const timezone = data.timezone

    try {
        for (let i = 1; i < 5; i++) {
        
            const time = `${weather.list[i].dt_txt}`;
            const hour = moment(time).tz(timezone).format('h:mm A');
    
            const des = `${weather.list[i].weather[0].description}`;

            document.getElementById('forecast-title').textContent = 'Forecast';

            document.getElementById('forecast-' + i).innerHTML = hour + '<br>' + des;

            const imgFDOM = document.getElementById('forecast-image-' + i);
            imgFDOM.src = "./svgs/"+des + '.svg';
        }
    }
    catch(error) {
        document.querySelector('.error').style.display = 'flex';
    }  
};

const init = function(){
    document.querySelector('.error').style.display = 'none';
}

const errorClose = document.getElementById('close-button');
errorClose.addEventListener('click', init);                