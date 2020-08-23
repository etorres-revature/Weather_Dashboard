//openweather api call
//https://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&exclude=hourly,minutely&appid=340e329562e29bd2ff2b681d0bf2d492

//opencage api call to reverse geocode
//https://api.opencagedata.com/geocode/v1/json?q=chicago%2C%20IL&key=ef6e5295fc1b4624b73a959b2fee725e&language=en&pretty=1

const baseWeatherURL = `https://api.openweathermap.org/data/2.5/onecall?appid=340e329562e29bd2ff2b681d0bf2d492&exclude=hourly,minutely`;
const baseGeoCodeURL = `https://api.opencagedata.com/geocode/v1/json?key=ef6e5295fc1b4624b73a959b2fee725e&language=en&pretty=1`;
let currentCity = '';
let currentDate = '';
let currentTemp = '';
let currentHumidity = '';
let currentWindSpeed = '';
let currentUVI = '';
let currentFeelsLike = "";
let currentWeatherIcon = "";
let lat = 0;
let long = 0;

function getLatLong(requestedLocation) {
    console.log("inside get lat long function");
    searchGeoCodeURL = baseGeoCodeURL + "&q=" + requestedLocation
    // console.log(searchGeoCodeURL);


    $.when($.ajax({
        url: searchGeoCodeURL,
        method: "GET"
    }))

        .then(function (geoCodeData) {
            // console.log("this is geocode data", geoCodeData);
            // console.log(searchGeoCodeURL);
            // console.log("this is latitude", geoCodeData.results[0].geometry.lat)
            // console.log("this is longitude", geoCodeData.results[0].geometry.lng)
            lat = geoCodeData.results[0].geometry.lat;
            long = geoCodeData.results[0].geometry.lng;
            currentCity = geoCodeData.results[0].formatted.split(",", 1)
            console.log(lat);
            console.log(long);
            console.log(currentCity);

            searchWeatherURL = baseWeatherURL + "&lon=" + long + "&lat=" + lat;
            console.log(searchWeatherURL);

            $.ajax({
                url: searchWeatherURL,
                method: "GET"
            })

                .then(function (weatherData) {
                    console.log("this is weather data", weatherData);
                    currentTemp = weatherData.current.temp;
                    console.log("current temp", currentTemp);
                    currentHumidity = weatherData.current.humidity;
                    console.log("current humidity", currentHumidity);
                    currentWindSpeed = weatherData.current.wind_speed;
                    console.log("current wind speed", currentWindSpeed);
                    currentUVI = weatherData.current.uvi;
                    console.log("current uvi", currentUVI);
                    currentFeelsLike = weatherData.current.feels_like;
                    console.log("current feels like", currentFeelsLike);
                    // currentWeatherIcon = weatherData.weather[0].currentWeather.icon;

                    let city = $("#current-city").text(currentCity);
                    let feelsLike = $("#feels-like");
                    let temp = $("#current-temp");
                    // let icon =  $("#current-weather-icon").attr("src", currentWeatherIcon).attr("style", "display: block;");
                    let humidity = $("#current-humidity");
                    let wind = $("#current-wind");
                    let uvi = $("#uvi");

                    feelsLike.append("<p style='display: inline; padding-left: 12px'>", currentFeelsLike).show;
                    temp.append("<p style='display: inline; padding-left: 12px'>", currentTemp).show
                    humidity.append("<p style='display: inline; padding-left: 12px'>", currentHumidity);
                    wind.append("<p style='display: inline; padding-left: 12px'>", currentWindSpeed)
                    uvi.append("<p style='display: inline; padding-left: 12px'>", currentUVI);

                });
        });
}

$("#searchBtn").on("click", function () {

    let location = $("#inputSearch").val().trim();
    // console.log(location);
    getLatLong(location);

});

