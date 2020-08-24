//openweather api call
//https://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&exclude=hourly,minutely&appid=340e329562e29bd2ff2b681d0bf2d492

//opencage api call to reverse geocode
//https://api.opencagedata.com/geocode/v1/json?q=chicago%2C%20IL&key=ef6e5295fc1b4624b73a959b2fee725e&language=en&pretty=1

$(document).ready(function () {
  const baseWeatherURL = `https://api.openweathermap.org/data/2.5/onecall?appid=340e329562e29bd2ff2b681d0bf2d492&exclude=hourly,minutely`;
  const baseGeoCodeURL = `https://api.opencagedata.com/geocode/v1/json?key=ef6e5295fc1b4624b73a959b2fee725e&language=en&pretty=1`;
  const todayDate = moment().format("llll");
  let currentCity = "";
  let currentDate = "";
  let currentTemp = "";
  let currentHumidity = "";
  let currentWindSpeed = "";
  let currentUVI = "";
  let currentFeelsLike = "";
  let currentWeatherIcon = "";
  let lat = 0;
  let long = 0;

  renderLast();

  function getLatLong(requestedLocation) {
    getEmpty();
    console.log("inside get lat long function");
    searchGeoCodeURL = baseGeoCodeURL + "&q=" + requestedLocation;
    // console.log(searchGeoCodeURL);

    //nested ajax calls - one to open cage to get lat and long
    $.when(
      $.ajax({
        url: searchGeoCodeURL,
        method: "GET",
      })
    )
      //open cage js promise
      .then(function (geoCodeData) {
        // console.log("this is geocode data", geoCodeData);
        // console.log(searchGeoCodeURL);
        // console.log("this is latitude", geoCodeData.results[0].geometry.lat)
        // console.log("this is longitude", geoCodeData.results[0].geometry.lng)
        lat = geoCodeData.results[0].geometry.lat;
        long = geoCodeData.results[0].geometry.lng;
        currentCity = geoCodeData.results[0].formatted.split(",", 1);
        console.log(lat);
        console.log(long);
        console.log(currentCity);

        searchWeatherURL = baseWeatherURL + "&lon=" + long + "&lat=" + lat;
        console.log(searchWeatherURL);
        //this ajax call waits until the first one comes back with the lat and long to run
        $.ajax({
          url: searchWeatherURL,
          method: "GET",
        })
          //current weather js promise
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
            currentWeatherIcon = weatherData.current.weather[0].icon;
            currentWeatherIconURL =
              "http://openweathermap.org/img/wn/" + currentWeatherIcon + ".png";
            console.log("this is current icon", currentWeatherIcon);

            let tempCelsius = currentTemp - 273.15;
            let tempFahrenheit = (currentTemp - 273.15) * 1.8 + 32;

            let feelsLikeTempCelsius = currentFeelsLike - 273.15;
            let feelsLikeTempFahrenheit =
              (currentFeelsLike - 273.15) * 1.8 + 32;

            let city = $("#current-city").text(currentCity);
            let feelsLike = $("#feels-like");
            let temp = $("#current-temp");
            let icon = $("#current-weather-icon").attr(
              "src",
              currentWeatherIconURL
            );
            let humidity = $("#current-humidity");
            let wind = $("#current-wind");
            let uvi = $("#uvi");
            let date = $("#current-date");

            feelsLike.append(
              "<p style='display: inline;'>",
              "FEELS-LIKE: " +
                feelsLikeTempFahrenheit.toFixed(2) +
                "*F / " +
                feelsLikeTempCelsius.toFixed(2) +
                "*C "
            ).show;
            temp.append(
              "<p style='display: inline;'>",
              "TEMPERATURE: " +
                tempFahrenheit.toFixed(2) +
                "*F / " +
                tempCelsius.toFixed(2) +
                "*C "
            ).show;
            humidity.append(
              "<p style='display: inline; padding-left: 12px'>",
              "Humidity: " + currentHumidity + "%"
            );
            wind.append(
              "<p style='display: inline; padding-left: 12px'>",
              "Wind speed: " + currentWindSpeed + " meter/second"
            );
            uvi.append(
              "<p id='uvIndexPara' data-uvi=" +
                currentUVI +
                " style='display: inline; padding-left: 12px'>",
              "UV Index: " + currentUVI
            );
            uvi.attr("value", currentUVI);
            icon.css("display", "inline-block");
            date.append(todayDate);

            uvIndexBackground(currentUVI);

            //five day forecast

            // console.log(weatherData.daily[0])
            for (var i = 1; i < 6; i++) {
              let fiveDayIcon = weatherData.daily[i].weather[0].icon;
              // console.log(fiveDayIcon);
              let fiveDayWeatherIcon =
                "http://openweathermap.org/img/wn/" + fiveDayIcon + ".png";
              let fiveDayTemp = weatherData.daily[i].temp.day;
              let fiveDayFeelsLike = weatherData.daily[i].feels_like.day;
              let fiveDayHumidity = weatherData.daily[i].humidity;
              let fiveDayDate = weatherData.daily[i].sunrise;
              // console.log(fiveDayDate);
              let fiveDayDateMS = fiveDayDate * 1000;
              let dateObj = new Date(fiveDayDateMS);
              let humanDateFormat = dateObj.toLocaleDateString();

              let fiveDayTempCelsius = fiveDayTemp - 273.15;
              let fiveDayTempFahrenheit = (fiveDayTemp - 273.15) * 1.8 + 32;

              let fiveDayFeelsLikeTempCelsius = fiveDayFeelsLike - 273.15;
              let fiveDayFeelsLikeTempFahrenheit =
                (fiveDayFeelsLike - 273.15) * 1.8 + 32;

              let fiveDayDiv = $("#day-" + i);
              fiveDayDiv.append("<p>", humanDateFormat);
              let displayIcon = fiveDayDiv.append(`<img SameSite="none">`);
              displayIcon.children().attr("src", fiveDayWeatherIcon);
              fiveDayDiv.append(
                "<p>",
                "Temp: " +
                  fiveDayTempFahrenheit.toFixed(2) +
                  "*F/" +
                  fiveDayTempCelsius.toFixed(2) +
                  "*C"
              );
              fiveDayDiv.append(
                "<p>",
                "Feels Like: " +
                  fiveDayFeelsLikeTempFahrenheit.toFixed(2) +
                  "*F/" +
                  fiveDayFeelsLikeTempCelsius.toFixed(2) +
                  "*C"
              );
              fiveDayDiv.append("<p>", "Humidity: " + fiveDayHumidity + "%");
            }
          });
      });
  }

  function renderLast() {
    var location = localStorage.getItem("lastLocation", location);
    getLatLong(location);
  }

  function getEmpty() {
    $("#feels-like").empty();
    $("#current-temp").empty();
    $("#current-humidity").empty();
    $("#current-wind").empty();
    $("#uvi").empty();
    $("#current-date").empty();
    for (let i = 1; i < 6; i++) {
      $("#day-" + i).empty();
    }
  }

  function uvIndexBackground(uviNum) {
    let uvi = $("#uvi");
    console.log("uvi", uviNum)
    let uvIndP = $("#uvIndexPara");
    if (uviNum < 6) {
      uvi.css("background", "greenyellow");
    } else if (uviNum >= 6 && uviNum <= 7) {
      uvi.css("background", "yello");
    } else if (uviNum > 7 && uviNum < 11) {
      uvi.css("background", "darkorange");
    } else if (uviNum >= 11) {
      uvi.css("background", "red");
    }
  }

  $("#searchBtn").on("click", function () {
    event.preventDefault();
    let location = $("#inputSearch").val().trim();
    // console.log(location);
    getLatLong(location);
    localStorage.setItem("lastLocation", location);
    $("#inputSearch").val("");
  });

  $(".list-group-item").on("click", function () {
    event.preventDefault();
    let location = $(this).data("location");
    //console.log(location);
    getLatLong(location);
    localStorage.setItem("lastLocation", location);
    console.log("just before uvI background function");
  });
});
