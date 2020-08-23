//openweather api call
//https://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&exclude=hourly,minutely&appid=340e329562e29bd2ff2b681d0bf2d492

//opencage api call to reverse geocode
//https://api.opencagedata.com/geocode/v1/json?q=chicago%2C%20IL&key=ef6e5295fc1b4624b73a959b2fee725e&language=en&pretty=1

const baseWeatherURL = `https://api.openweathermap.org/data/2.5/onecall?appid=340e329562e29bd2ff2b681d0bf2d492`;
const baseGeoCodeURL = `https://api.opencagedata.com/geocode/v1/json?key=ef6e5295fc1b4624b73a959b2fee725e&language=en&pretty=1`;
let currentCity = '';
let currentDate = '';
let currentTemp = '';
let currentHumidity = '';
let currentWindSpeed = '';
let uvIndex = '';
let lat = 0;
let long = 0;

function getLatLong(requestedLocation) {

    searchGeoCodeURL = baseGeoCodeURL + "&q=" +requestedLocation
    
    $.ajax({
        url: searchGeoCodeURL,
        method: "GET"
    })

    .then(function(geoCodeData) {
        console.log(geoCodeData);
        console.log(searchGeoCodeURL);
    })
}