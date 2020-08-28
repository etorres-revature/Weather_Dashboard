//openweather api call
//https://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&exclude=hourly,minutely&appid=340e329562e29bd2ff2b681d0bf2d492

//opencage api call to reverse geocode
//https://api.opencagedata.com/geocode/v1/json?q=chicago%2C%20IL&key=ef6e5295fc1b4624b73a959b2fee725e&language=en&pretty=1

//document ready function to have this run when document is created
$(document).ready(function () {
  //global variables
  //base URL for open weather
  const baseWeatherURL = `https://api.openweathermap.org/data/2.5/onecall?appid=340e329562e29bd2ff2b681d0bf2d492&exclude=hourly,minutely`;
  //base URL for open cage
  const baseGeoCodeURL = `https://api.opencagedata.com/geocode/v1/json?key=ef6e5295fc1b4624b73a959b2fee725e&language=en&pretty=1`;
  //moment date for failed experiment (moment and jquery don't play well together)
  const todayDate = moment().format("llll");
  //current city variable
  let currentCity = "";
  //current Date - not used
  let currentDate = "";
  //current Temperature
  let currentTemp = "";
  //current humidity
  let currentHumidity = "";
  //current wind speed
  let currentWindSpeed = "";
  //current UVI
  let currentUVI = "";
  //current feels like
  let currentFeelsLike = "";
  //current weather icon
  let currentWeatherIcon = "";
  //variable for latitude
  let lat = 0;
  //variable for longitude
  let long = 0;

  //function called to render last searched location
  renderLast();
  //function called to render the cities that have been searched previously
  renderStoredSearch();

  //function to get the latitude and longitude of a city name
  function getLatLong(requestedLocation) {
    //emptying informaton from the current date div and the five day div
    getEmpty();
    // console.log("inside get lat long function");
    //creating an updated query string by adding onto the base open cage url with the name of the city searched by the user
    var searchGeoCodeURL = baseGeoCodeURL + "&q=" + requestedLocation;
    // console.log(searchGeoCodeURL);

    //nested ajax calls - what I am calling synchronous asynchronous javascript
    $.when(
      //using ajax to go to the correct search url with get method
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
        //setting lat variable to latitude from open cage
        lat = geoCodeData.results[0].geometry.lat;
        //setting long variable to longitude from open cage
        long = geoCodeData.results[0].geometry.lng;
        //using the split method to create a string to hold current city
        currentCity = geoCodeData.results[0].formatted.split(",", 1);
        // console.log(lat);
        // console.log(long);
        // console.log(currentCity);

        //creating a search url on open weather with the latitute and longitude from open cage
        searchWeatherURL = baseWeatherURL + "&lon=" + long + "&lat=" + lat;
        // console.log(searchWeatherURL);
        //this ajax call waits until the first one comes back with the lat and long to run
        $.ajax({
          url: searchWeatherURL,
          method: "GET",
        })
          //current weather js promise
          .then(function (weatherData) {
            console.log("this is weather data", weatherData);
            //setting current temp from returned object
            currentTemp = weatherData.current.temp;
            console.log("current temp", currentTemp);
            //setting current humidity from returned object
            currentHumidity = weatherData.current.humidity;
            console.log("current humidity", currentHumidity);
            //setting current wind speed from returned object
            currentWindSpeed = weatherData.current.wind_speed;
            console.log("current wind speed", currentWindSpeed);
            //setting current UV Index from returned object
            currentUVI = weatherData.current.uvi;
            console.log("current uvi", currentUVI);
            //setting current "feels like"
            currentFeelsLike = weatherData.current.feels_like;
            console.log("current feels like", currentFeelsLike);
            //getting the code for the current weather icon
            currentWeatherIcon = weatherData.current.weather[0].icon;
            //iserting the code for the current weather icon into the open weather URL to retrieve icons
            currentWeatherIconURL =
              "http://openweathermap.org/img/w/" + currentWeatherIcon + ".png";
            console.log("this is current icon", currentWeatherIcon);

            //current temp conversion to celsius
            let tempCelsius = currentTemp - 273.15;
            //current temp conversion to fahrenheit
            let tempFahrenheit = (currentTemp - 273.15) * 1.8 + 32;

            //current feels like temp conversion to celsius
            let feelsLikeTempCelsius = currentFeelsLike - 273.15;
            //current feels like conversion to fahrenheit
            let feelsLikeTempFahrenheit =
              (currentFeelsLike - 273.15) * 1.8 + 32;

            let city = $("#current-city").text(currentCity);
            //creating variable for jQuery of current feels like in html
            let feelsLike = $("#feels-like");
            //crating variable for jQuery of current temp in html
            let temp = $("#current-temp");
            //creating variable for jQuery of current weather icon in html
            //and adding current weather icon URL to it
            let icon = $("#current-weather-icon").attr(
              "src",
              currentWeatherIconURL
            );
            //creating variable for jQuery of current humidity in html
            let humidity = $("#current-humidity");
            //creating variable for jQuery of current wind in html
            let wind = $("#current-wind");
            //creating variable for jQuery of current UVI in html
            let uvi = $("#uvi");
            //creating variable for jQuery of current date in html
            let date = $("#current-date");

            //appending the feels like variables into the html
            feelsLike.append(
              //element and information to append
              "<p style='display: inline;'>",
              "FEELS-LIKE: " +
                //making feels like fahrenheit variable fixed to 2 decimal places
                feelsLikeTempFahrenheit.toFixed(2) +
                "*F / " +
                //making feels like celsius variable fixed to 2 decimal places
                feelsLikeTempCelsius.toFixed(2) +
                "*C "
            ).show;
            //appending the temperature variable into the html
            temp.append(
              //element and information to append
              "<p style='display: inline;'>",
              "TEMPERATURE: " +
                //making temperature fahrenheit variable fixed to 2 decimal places
                tempFahrenheit.toFixed(2) +
                "*F / " +
                //making temperature celsius variable fixed to 2 decimal places
                tempCelsius.toFixed(2) +
                "*C "
            ).show;
            //appending current humidity to html
            humidity.append(
              //element and information to append
              "<p style='display: inline; padding-left: 12px'>",
              "Humidity: " + currentHumidity + "%"
            );
            //appending current wind speed to html
            wind.append(
              //element and information to append
              "<p style='display: inline; padding-left: 12px'>",
              "Wind speed: " + currentWindSpeed + " meter/second"
            );
            //appending current UV Index to html
            uvi.append(
              //element and information to append
              "<p id='uvIndexPara' data-uvi=" +
                currentUVI +
                " style='display: inline; padding-left: 12px'>",
              "UV Index: " + currentUVI
            );
            //setting the value attribute for UV Index for background function purposes
            uvi.attr("value", currentUVI);
            //setting icon to diaply inline-block
            icon.css("display", "inline-block");
            //using append to get moment date into current informaton div
            date.append(todayDate);

            //calling the function that sets the UV background, passing in the current UVI variable
            uvIndexBackground(currentUVI);

            //five day forecast

            // console.log(weatherData.daily[0])
            //for loop to go through object AND divs
            for (var i = 1; i < 6; i++) {
              //getting the icon info from object
              let fiveDayIcon = weatherData.daily[i].weather[0].icon;
              // console.log(fiveDayIcon);
              //doing the open weather URL to get the appropriate icon
              let fiveDayWeatherIcon =
                "http://openweathermap.org/img/w/" + fiveDayIcon + ".png";
              //pulling the five day temp
              let fiveDayTemp = weatherData.daily[i].temp.day;
              //pulling the five day "feels like"
              let fiveDayFeelsLike = weatherData.daily[i].feels_like.day;
              //pulling the five day humidity
              let fiveDayHumidity = weatherData.daily[i].humidity;
              //pulling the five day date in UNIX
              let fiveDayDate = weatherData.daily[i].sunrise;
              // console.log(fiveDayDate);
              //converting UNIX to milliseconds
              let fiveDayDateMS = fiveDayDate * 1000;
              //creating a date object with the milliseconds
              let dateObj = new Date(fiveDayDateMS);
              //turning the date object into a human readable format
              let humanDateFormat = dateObj.toLocaleDateString();

              //converting fiveday temp to celsius
              let fiveDayTempCelsius = fiveDayTemp - 273.15;
              //converting fiveday temp to fahrenheit
              let fiveDayTempFahrenheit = (fiveDayTemp - 273.15) * 1.8 + 32;

              //converting fiveday "feels like" to celsius
              let fiveDayFeelsLikeTempCelsius = fiveDayFeelsLike - 273.15;
              //converting fiveday "feels like" to fahrenheit
              let fiveDayFeelsLikeTempFahrenheit =
                (fiveDayFeelsLike - 273.15) * 1.8 + 32;

              //using jQuery to target the day div dynamically
              let fiveDayDiv = $("#day-" + i);
              //appending the date to the div
              fiveDayDiv.append("<p>", humanDateFormat);
              //appending an <img> tag
              let displayIcon = fiveDayDiv.append(`<img SameSite="none">`);
              //setting the img tag's src attribute
              displayIcon.children().attr("src", fiveDayWeatherIcon);
              //appending the fiveday temperature
              fiveDayDiv.append(
                "<p>",
                "Temp: " +
                  //making sure the decimals are fixed at two spots
                  fiveDayTempFahrenheit.toFixed(2) +
                  "*F/" +
                  fiveDayTempCelsius.toFixed(2) +
                  "*C"
              );
              fiveDayDiv.append(
                //appending the five day "feels like"
                "<p>",
                "Feels Like: " +
                  //making sure the decimals are dixed to two spots
                  fiveDayFeelsLikeTempFahrenheit.toFixed(2) +
                  "*F/" +
                  fiveDayFeelsLikeTempCelsius.toFixed(2) +
                  "*C"
              );
              //appdning the five
              fiveDayDiv.append("<p>", "Humidity: " + fiveDayHumidity + "%");
            }
          });
      });
  }

  //function to add search items to a list
  function addSearch(location) {
    //setting css display on html element
    $("#search-title").css("display", "block");
    $("#search-div").css("display", "block");
    //appending the li to the search div with the locaiton information
    $(".search-ul").append(
      "<li id='" +
        location +
        "' class='list-group-item' data-location='" +
        location +
        "'>" +
        location +
        "</li>"
    );
  }

  //funciton to clear searched items
  function clearSearch() {
    //setting display on html element to none
    $("#search-title").css("display", "none");
    $("#search-div").css("display", "none");
    //clearing out the li elements in the search ul
    $("#search-ul").empty();
    //emptying local storage
    localStorage.clear();
  }

  //funciton to add searched items to local storage
  function addSearchToLocalStorage(location) {
    // console.log("I'm in addSearch localStorage function");
    // console.log(location);
    // creating a protype object to put into local storage
    let newSearchLocation = {
      searchLocation: location,
    };
    // console.log(newSearchLocation);
    //creating an array to hold objects pulled from local storage
    let locationArray = [];
    //if logic to set array to hold objects to empty is there is nothing in local storage
    if (JSON.parse(localStorage.getItem("searchLocations")) === null) {
      locationArray = [];
      // console.log("1st", locationArray);
      //what to do if there are items in local storage
    } else {
      //parse out the items in local storage to JSON
      locationArray = JSON.parse(localStorage.getItem("searchLocations"));
      // console.log(locationArray);
      // console.log(typeof locationArray);
    }
    //push the new searched prototype object onto the array
    locationArray.push(newSearchLocation);
    //stringify the array and put it back into local storage
    localStorage.setItem("searchLocations", JSON.stringify(locationArray));
  }

  //function to show the items stored in local storage as previously searched
  function renderStoredSearch() {
    // console.log("Im in render stored search locations func");
    //creating a variable to hold the items in local storage parsed into JSON
    var searchArray = JSON.parse(localStorage.getItem("searchLocations"));
    //if there are items in local storage
    if (searchArray != null) {
      // console.log("searchArray", searchArray);
      //do this for loop for the entire length of the new array
      for (var i = 0; i < searchArray.length; i++) {
        //run the add search function above add the previously searched items to the ul as lis
        addSearch(searchArray[i].searchLocation);
      }
    }
  }

  //function to render the last searched location
  function renderLast() {
    //create a variable to hold the local storage item holding the last searched location
    var location = localStorage.getItem("lastLocation", location);
    //run the function to display the weather
    getLatLong(location);
  }

  //funciton to put the last searched location into storage
  function insertStorage(location) {
    //add the last searched item to local storage
    localStorage.setItem("lastLocation", location);
  }

  //funciton to empty out the weather information
  function getEmpty() {
    $("#feels-like").empty();
    $("#current-temp").empty();
    $("#current-humidity").empty();
    $("#current-wind").empty();
    $("#uvi").empty();
    $("#current-date").empty();
    $("#current-weather-icon").attr("src", "");
    $("#current-city").empty();
    //for loop to empty out the five day divs
    for (let i = 1; i < 6; i++) {
      $("#day-" + i).empty();
    }
  }

  //function to change the UV Index background based on severity
  function uvIndexBackground(uviNum) {
    let uvi = $("#uvi");
    console.log("uvi", uviNum);
    // let uvIndP = $("#uvIndexPara");
    if (uviNum >= 0 && uviNum < 3) {
      uvi.css("background", "greenyellow");
    } else if (uviNum >= 3 && uviNum <= 5) {
      uvi.css("background", "yellow");
    } else if (uviNum > 5 && uviNum <= 7) {
      uvi.css("background", "darkorange");
    } else if (uviNum > 7 && uviNum <= 10) {
      uvi.css("background", "orangered");
    } else if (uviNum > 10) {
      uvi.css("background", "darkorchid");
    }
  }

  //jQuery to run a function when the search button is clicked
  $("#searchBtn").on("click", function () {
    event.preventDefault();
    //setting value of location
    let location = $("#inputSearch").val().trim();
    // console.log(location);
    //validation that location isn't blank
    if (location === "") {
      alert("Please enter a city and state/country to continue.");
      //logic to run if something is entered
    } else {
      //runs the get lat/long and display weather function (synchronous asynchronous javascript)
      getLatLong(location);
      //inserts location into local storage as last searched
      insertStorage(location);
      //adds location into the ul as an li of previously searched locations
      addSearch(location);
      //add locaiton into local storage to persist the previoulsy searched locations
      addSearchToLocalStorage(location);
      //clears the input search text box
      $("#inputSearch").val("");
    }
  });

  //sets up a click event on the location cards
  $(".list-group-item").on("click", function () {
    //makes the location to search the one that was in the li
    let location = $(this).data("location");
    //runs the get lat/long and dsiplay weather function
    getLatLong(location);
    //adds this locaiton into local storage as last searched
    insertStorage(location);
  });

  $(document).on("click", ".list-group-item", function () {
    let location = $(this).data("location");
    console.log("the click for previous search", location)
    getLatLong(location);
    insertStorage(location);
  });

  //click event for the clear search button
  $("#clear-search").on("click", function () {
    event.preventDefault();
    //runs function that clears the ul and hides previous search elements, also clears local storage
    clearSearch();
  });

  //click event for the clear weahter button
  $("#clear-weather").on("click", function () {
    event.preventDefault();
    //clears out the current weather and five day weather divs
    getEmpty();
  });
});
