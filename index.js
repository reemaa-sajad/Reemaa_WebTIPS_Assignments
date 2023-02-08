var weather_data;
fetch("data.json")
  .then((data) => data.json())
  .then((result) => {
    weather_data = result;
    console.log(weather_data);
    setCity();
    initCity();
  });

function setCity() {
  var city = Object.keys(weather_data);
  var option = ``;
  for (var i = 0; i < city.length; i++) {
    option += `<option>${city[i]}</option>`;
  }
  document.querySelector("#dropdown").innerHTML = option;
}

function initCity() {
    city = Object.keys(weather_data); 
    console.log(city[0]);
    document.querySelector("#change-values").value = city[1];
    console.log(document.querySelector("#change-values").value);
    change();
};

function callChange() {
    console.log("Inside callChange function");
     var city = Object.keys(weather_data);
     console.log(city[3]);
     let cityGiven = document.querySelector("#change-values").value;
     console.log(cityGiven);
     let flag = 0;
     for(let i = 0; i < city.length; i++)
     {
         if(cityGiven == city[i]){
            change();
            flag = 1;
        }
    } 
    if (flag == 0){
         setNullVal(); 
    }
}

//get temperature in farenheit
let far;
function changetoFarenheit(val) {
  let farenheit = val * 1.8 + 32;
  return farenheit;
}

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

  const weatherImages = [
    document.getElementById(`weather-image1`),
    document.getElementById(`weather-image2`),
    document.getElementById(`weather-image3`),
    document.getElementById(`weather-image4`),
    document.getElementById(`weather-image5`),
    document.getElementById(`weather-image6`),
  ];

  const weatherArray = [];

  var city = Object.keys(weather_data);
  var current_city = document.querySelector("#change-values").value;

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
  for (var i = 1; i < 6; i++) {
    if (time > 12) {
      time = time - 12;
    }

    document.getElementById(`current-time${i}`).innerHTML = time +" "+ amPm;

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
      parseInt(weatherArray[i]) < 22
    ) {
      weatherImages[i].src = `/images/Weather_Icons/windyIcon.svg`;
    } else if (parseInt(weatherArray[i]) <=0) {
        weatherImages[i].src = `/images/Weather_Icons/snowflakeIcon.svg`;
    } else if (parseInt(weatherArray[i]) < 18) {
      weatherImages[i].src = `/images/Weather_Icons/rainyIcon.svg`;
    } else if (parseInt(weatherArray[i]) > 29) {
      weatherImages[i].src = `/images/Weather_Icons/sunnyIcon.svg`;
    } 
  }
};

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
     for(let i=0; i<6; i++)
     {
         document.getElementById(`current-time${i}`).innerHTML = "-";
     }
    //Hourly Temperature
    for(let i=1; i<=6; i++){
        document.getElementById(`temp${i}`).innerHTML = "NA";
    }
    //Weather icon for hourly temperature
    for(let i=1; i<=6; i++)
    {
        document.getElementById(`weather-image${i}`).src=`/images/Weather_Icons/close.png`;
    }
};
