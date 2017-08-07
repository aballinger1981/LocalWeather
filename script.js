$(document).ready(function () {
  var currentLocation = "";
  var weatherData = {};

  function getWeather() {
    $("#fahrenheit").addClass("disabled");
    $("#zipInput").attr("placeholder", "Enter Zip");

    $.ajax({
      dataType: "json",
      url: "http://api.wunderground.com/api/908a7f8e099c8150/conditions/forecast/q/" + currentLocation + ".json",
      cache: false,
      success: function (data) {
        weatherData = Object.assign({}, data);
        console.log(data);

        setCurrentConditions(data);
        setExtendedConditions(data);
      },
      error: function () {
        $("#currentConditions").html("There was an error.  Please try again");
      }
    });
  }

  getLocation();

  function getLocation() {
    $.getJSON("http://ipinfo.io/json", function (response) {
      currentLocation = response.loc;
      getWeather();
    });
  }

  function setCurrentConditions(data) {
    var currentTempF = Math.floor(parseInt(data.current_observation.temp_f));
    var currentTempC = Math.floor(parseInt(data.current_observation.temp_c));
    var weather = data.current_observation.weather;

    $(".locationName").html(data.current_observation.display_location.full);
    $("#currentConditions").html(weather + "<br>" + "<strong style='font-size: 2em;'>" + currentTempF + "&#176;F" + "</strong>");
    $("#humidity").html(data.current_observation.relative_humidity);
    $("#wind").html(data.current_observation.wind_string);
    $("#dewpoint").html(data.current_observation.dewpoint_f + "&nbsp;F");
    $("#visibility").html(data.current_observation.visibility_mi + " mi");
    $("#feelsLike").html(Math.floor(parseInt(data.current_observation.feelslike_f)) + "&nbsp;F");
    $("#uvIndex").html(data.current_observation.UV);
    $("#conditionIconDiv").html("<img src='" + data.current_observation.icon_url + "'" + " id='conditionIcon'>");
    $("#weatherUndergroundIcon").html("<img src='" + data.current_observation.image.url + "'" + ">");
  }

  function setExtendedConditions(data) {
    var dayOfWeek = ["dayOne", "dayTwo", "dayThree", "dayFour"];
    var dayCount = 0;
    for (var i = 0; i < 4; i++) {
      if (i === 0) {
        $("#" + dayOfWeek[dayCount] + " .day").html("<strong>Today</strong>");
      } else {
        $("#" + dayOfWeek[dayCount] + " .day").html("<strong>" + data.forecast.simpleforecast.forecastday[i].date.weekday + "</strong>");
      }
      $("#" + dayOfWeek[dayCount] + " .extendedForecastImageDiv").html("<img src='" + data.forecast.simpleforecast.forecastday[i].icon_url + "'" + ">");
      $("#" + dayOfWeek[dayCount] + " .extendedConditions").html(data.forecast.simpleforecast.forecastday[i].conditions);
      $("#" + dayOfWeek[dayCount] + " .highTemp").html("<strong>High:&nbsp;</strong>" + data.forecast.simpleforecast.forecastday[i].high.fahrenheit + "&nbsp;F<br>");
      $("#" + dayOfWeek[dayCount] + " .lowTemp").html("<strong>Low:&nbsp</strong>" + data.forecast.simpleforecast.forecastday[i].low.fahrenheit + "&nbsp;F");
      dayCount++;
    }
  }

  $("form").submit(function (event) {
    var zip = $("#zipInput").val().toString();
    console.log(zip);
    if (zip.length === 5) {
      event.preventDefault();
      currentLocation = $("#zipInput").val();
      $("#zipInput").val("");
      $("#celsius").removeClass("disabled");
      getWeather();
    } else {
      $("#zipInput").attr("placeholder", "Invalid Zip");
      $("#zipInput").val("");
      $("#zipInput").addClass("invalidZip");
      event.preventDefault();
    }
  });

  $("#zipInput").on("focus", function () {
    $(this).removeClass("invalidZip");
    $(this).attr("placeholder", "Enter Zip");
  });

  $("#fahrenheit").on("click", function () {
    var currentTempF = Math.floor(parseInt(weatherData.current_observation.temp_f));
    var feelsLike = Math.floor(parseInt(weatherData.current_observation.feelslike_f));
    $("#currentConditions").html(weatherData.current_observation.weather + "<br>" + "<strong style='font-size: 2em;'>" + currentTempF + "&#176;F" + "</strong>");
    $("#dewpoint").html(weatherData.current_observation.dewpoint_f + "&nbsp;F");
    $("#feelsLike").html(feelsLike + "&nbsp;F");
    $("#fahrenheit").addClass("disabled");
    $("#celsius").removeClass("disabled");
    extendedForecastFahrenheit();
  });

  $("#celsius").on("click", function () {
    var currentTempC = Math.floor(parseInt(weatherData.current_observation.temp_c));
    var feelsLike = Math.floor(parseInt(weatherData.current_observation.feelslike_c));
    $("#currentConditions").html(weatherData.current_observation.weather + "<br>" + "<strong style='font-size: 2em;'>" + currentTempC + "&#176;C" + "</strong>");
    $("#dewpoint").html(weatherData.current_observation.dewpoint_c + "&nbsp;C");
    $("#feelsLike").html(feelsLike + "&nbsp;C");
    $("#celsius").addClass("disabled");
    $("#fahrenheit").removeClass("disabled");
    extendedForecastCelsius();
  });

  function extendedForecastCelsius() {
    var dayOfWeek = ["dayOne", "dayTwo", "dayThree", "dayFour"];
    var dayCount = 0;
    for (var i = 0; i < 4; i++) {
      $("#" + dayOfWeek[dayCount] + " .highTemp").html("<strong>High:&nbsp;</strong>" + weatherData.forecast.simpleforecast.forecastday[i].high.celsius + "&nbsp;C<br>");
      $("#" + dayOfWeek[dayCount] + " .lowTemp").html("<strong>Low:&nbsp</strong>" + weatherData.forecast.simpleforecast.forecastday[i].low.celsius + "&nbsp;C");
      dayCount++;
    }
  }

  function extendedForecastFahrenheit() {
    var dayOfWeek = ["dayOne", "dayTwo", "dayThree", "dayFour"];
    var dayCount = 0;
    for (var i = 0; i < 4; i++) {
      $("#" + dayOfWeek[dayCount] + " .highTemp").html("<strong>High:&nbsp;</strong>" + weatherData.forecast.simpleforecast.forecastday[i].high.fahrenheit + "&nbsp;F<br>");
      $("#" + dayOfWeek[dayCount] + " .lowTemp").html("<strong>Low:&nbsp</strong>" + weatherData.forecast.simpleforecast.forecastday[i].low.fahrenheit + "&nbsp;F");
      dayCount++;
    }
  }

});