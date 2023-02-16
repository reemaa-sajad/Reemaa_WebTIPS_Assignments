var weather_data;
fetch("data.json")
  .then((data) => data.json())
  .then((result) => {
    weather_data = result;
    console.log(weather_data);
    setCity();
    initCity();
  });
//Header section

//Function to initialize city values in dropdown 
function setCity() {
  var city = Object.keys(weather_data);
  var option = ``;
  for (let cityName = 0; cityName < city.length; cityName++) {
    option += `<option>${city[cityName]}</option>`;
  }
  document.querySelector("#dropdown").innerHTML = option;
}

//Function to initially load page with city details
function initCity() {
    city = Object.keys(weather_data); 
    console.log(city[0]);
    document.querySelector("#change-values").value = city[1];
    console.log(document.querySelector("#change-values").value);
    change();
};

//Function to check whether the input given by the user is valid or invalid and display results accordingly
function callChange() {
     var city = Object.keys(weather_data);
     console.log(city[3]);
     let cityGiven = document.querySelector("#change-values").value.toLowerCase();
     console.log(cityGiven);
     let flag = 0;
     for(let userInput = 0; userInput < city.length; userInput++)
     {
         if(cityGiven == city[userInput]){
            change();
            flag = 1;
        }
    } 
    if (flag == 0){
         setNullVal(); 
    }
}

//Function to get temperature in farenheit
let far;
function changetoFarenheit(val) {
  let farenheit = val * 1.8 + 32;
  return farenheit;
}
setInterval(callChange,1000);

//Function to change the weather values displayed in header section based on city chosen by user
function change() {
  const monthArr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const weatherImages = [];
  for(let weatherPic=0; weatherPic<6; weatherPic++){
    weatherImages[i] = document.getElementById(`weather-image${weatherPic+1}`);
  }

  const weatherArray = [];

  var city = Object.keys(weather_data);
  var current_city = document.querySelector("#change-values").value.toLowerCase();

  //change the logo image
  var logo = document.getElementById("logo");
  logo.src = `/images/Icons_for_cities/${current_city}.svg`;

  //Box Border
  document.querySelector("#change-values").style.borderColor = "black";

  //temperature C
  document.getElementById("celsius").innerHTML =
    weather_data[current_city].temperature;

  //temperature F
  let cel = weather_data[current_city].temperature.slice(0, -2);
  far = changetoFarenheit(cel);
  far = far.toPrecision(3);
  far += " F";
  console.log(far);
  document.getElementById("faren").innerHTML = far;

  // humidity level
  document.getElementById("humid-num").innerHTML =
    weather_data[current_city].humidity;

  //precipitation
  document.getElementById("precip-level").innerHTML =
    weather_data[current_city].precipitation;

  //date and time
  dateTimeArr = weather_data[current_city].dateAndTime.split(",");
  //var time = dateTimeArr[1].slice(0, -2);
  //Real time
  var tzone = weather_data[current_city].timeZone;
  var time = new Date().toLocaleString("en-US", {
    timeZone: tzone,
    timeStyle: "medium",
    hourCycle: "h12",
  });
  document.getElementById("header-time").innerHTML = time;

  //date
  let dateSplit = dateTimeArr[0];
  let dateArr = dateSplit.split("/");
  let dateInWords =
    String(dateArr[1].padStart(2, "0")) +
    "-" +
    monthArr[dateArr[0] - 1] +
    "-" +
    dateArr[2];
  document.getElementById("header-date").innerHTML = dateInWords;

  //getting timeline on the right side of header
  document.getElementById(`current-time0`).innerHTML = "NOW";
  let amPm = time.slice(-2);
  time = time.slice(0, 2);
  time = parseInt(time)+1;
  console.log(time);
  for (let timeDisplay = 1; timeDisplay < 6; timeDisplay++) {
    if (time > 12) {
      time = time - 12;
    }

    document.getElementById(`current-time${timeDisplay}`).innerHTML = time +" "+ amPm;

    if(time==(11||12) && amPm== "AM")
    {
        amPm= "PM";
    } 
    else if(time==(11||12) && amPm == "PM"){
        amPm = "AM";
    } 
    time++;
  }

  //getting temperature values on the right side of header
  document.getElementById(`temp1`).innerHTML = weather_data[
    current_city
  ].temperature.slice(0, 2);
  weatherArray[0] = weather_data[current_city].temperature.slice(0, 2);
  weatherArray[5] = weather_data[current_city].temperature.slice(0, 2);
  for (var i = 2; i < 6; i++) {
    document.getElementById(`temp${i}`).innerHTML = weather_data[current_city].nextFiveHrs[i - 2].slice(0, 2);
    weatherArray[i - 1] = weather_data[current_city].nextFiveHrs[i - 2].slice(0, 2);
  }
  document.getElementById(`temp6`).innerHTML = weather_data[
    current_city
  ].temperature.slice(0, 2);

  //getting the image icon for weather
  for (var i = 0; i <= 5; i++) {
    if (parseInt(weatherArray[i]) >= 23 && parseInt(weatherArray[i]) < 29) {
      weatherImages[i].src = `/images/Weather_Icons/cloudyIcon.svg`;
    } else if (
      parseInt(weatherArray[i]) >= 18 &&
      parseInt(weatherArray[i]) <= 22
    ) {
      weatherImages[i].src = `/images/Weather_Icons/windyIcon.svg`;
    } else if (parseInt(weatherArray[i]) <=0) {
        weatherImages[i].src = `/images/Weather_Icons/snowflakeIcon.svg`;
    } else if (parseInt(weatherArray[i]) < 18) {
      weatherImages[i].src = `/images/Weather_Icons/rainyIcon.svg`;
    } else if (parseInt(weatherArray[i]) >= 29) {
      weatherImages[i].src = `/images/Weather_Icons/sunnyIcon.svg`;
    } 
  }
};

//Function to set weather values to null on getting invalid city input from user
function setNullVal(){
    //Box Border
    document.querySelector("#change-values").style.borderColor = "red";
    //Logo
    var logo = document.getElementById("logo");
    logo.src = `/images/Icons_for_cities/city.png`;
    //Temp C
    document.getElementById("celsius").innerHTML = "NULL";
    //Temp f
    document.getElementById("faren").innerHTML = "NULL";
    //Humidity level
    document.getElementById("humid-num").innerHTML = "NULL";
    //Precipitation
    document.getElementById("precip-level").innerHTML = "NULL";
    //Date and Time
    document.getElementById("header-time").innerHTML = "Invalid city name!";
    document.getElementById("header-date").innerHTML = "";
     //Hourly Time
     for(let hourlyTime=0; hourlyTime<6; hourlyTime++)
     {
         document.getElementById(`current-time${hourlyTemp}`).innerHTML = "-";
     }
    //Hourly Temperature
    for(let i=hourlyTemp; i<=hourlyTemp; hourlyTemp++){
        document.getElementById(`temp${hourlyTemp}`).innerHTML = "NA";
    }
    //Weather icon for hourly temperature
    for(let hourlyWeather=1; hourlyWeather<=6; hourlyWeather++)
    {
        document.getElementById(`weather-image${hourlyWeather}`).src=`/images/Weather_Icons/close.png`;
    }
};
