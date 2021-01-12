//api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
//api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}


const weatherApi = {
    key: '2ece28a4f1bef9938dee1e93c2746ec1',
    baseUrlR: 'https://api.openweathermap.org/data/2.5/weather',
    baseUrlF: 'https://api.openweathermap.org/data/2.5/forecast'
}


const searchInputBox = document.getElementById('input-box');
const submitButton = document.querySelector('.submit');

function clearSearch() {
    searchInputBox.value = '';
};

submitButton.addEventListener('click', () => {

    getWeatherReport(searchInputBox.value);
    getWeatherForecast(searchInputBox.value);
    clearSearch();
    
});

searchInputBox.addEventListener('keypress', (event) =>{

    if(event.keyCode == 13) {
        getWeatherReport(searchInputBox.value);
        getWeatherForecast(searchInputBox.value);
    }
});

// Get Weather Report
function getWeatherReport(city) {
    fetch(`${weatherApi.baseUrlR}?q=${city}&appid=${weatherApi.key}&units=metric`)
    .then(weatherRep => {
        return weatherRep.json();
    }).then(showWeatherReport);

};

// Get Weather Forecast
function getWeatherForecast(city) {
    fetch(`${weatherApi.baseUrlF}?q=${city}&appid=${weatherApi.key}&units=metric`)
    .then(weatherFor => {
        return weatherFor.json();
    }).then(showWeatherForecast);

};

//Show Weather Report
function showWeatherReport(weather) {
    
    try {
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
        imgDOM.src = typeOfWeather + '.svg';
        
        
        document.getElementById('wind').innerHTML = `Wind: ${weather.wind.speed} km/hr`;
        
        document.getElementById('humidity').innerHTML = `Humidity: ${weather.main.humidity}%`;
        
        document.getElementById('realFeel').innerHTML = `Real Feel: ${Math.round(weather.main.feels_like)}&deg;C`;
        
        document.getElementById('visibilty').innerHTML = `Visibility: ${(weather.visibility)/1000}km`;
        
        
        
        const date = document.getElementById('date');
        const todayDate = new Date();
        date.innerText = dateManage(todayDate);
    } catch (error) {
        document.querySelector('.error').style.display = 'flex';
    }

}

// Show Weather Forecast
function showWeatherForecast(weather) {
    try {
        for (let i = 1; i < 5; i++) {
        
            const time = `${weather.list[i].dt_txt}`;

            let hour = parseInt(time.slice(11, 13));
            if (hour > 12) {
                hour = hour - 12 +':00 PM';

            } else if (hour === 0) {
                hour = 12 + ':00 AM';

            } else if (hour === 12) {
                hour = 12 + ':00 PM';

            } else {
                hour = hour + ':00 AM';
            }
            const des = `${weather.list[i].weather[0].description}`;

            document.getElementById('forecast-' + i).innerHTML = hour + '<br>' + des;

            const imgFDOM = document.getElementById('forecast-image-' + i);
            imgFDOM.src = des + '.svg';
        }
    }
    catch(error) {
        document.querySelector('.error').style.display = 'flex';
    }  
};


// For current date and time
function dateManage(dateArg) {


    const months = ['January', ' February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const year = dateArg.getFullYear();
    const month = months[dateArg.getMonth()];
    const date = dateArg.getDate();

    let hr = dateArg.getHours();
    let sec;
    if (hr > 12) {
        hr = dateArg.getHours() - 12;
        sec = dateArg.getSeconds() + ' PM';
    } else if (hr == 0) {
        hr = dateArg.getHours() + 12;
        sec = dateArg.getSeconds() + ' AM';
    } else if (hr == 12) {
        hr = dateArg.getHours();
        sec = dateArg.getSeconds() + ' PM';
    } else {
        hr = dateArg.getHours();
        sec = dateArg.getSeconds() + ' AM';
    }

    const min = dateArg.getMinutes();

    return `${date} ${month}, ${year}
     ${hr}:${min}:${sec} (IST)`;
    
};

const init = function(){
    document.querySelector('.error').style.display = 'none';
}

const errorClose = document.getElementById('close-button');
errorClose.addEventListener('click', init);                
