var weather_data;
let getArr = [];
let weatherChoice;

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

(function() {
  fetch("data.json")
  .then((data) => data.json())
  .then((result) => {
    weather_data = result;
    setCity();
    initCity(); 
    displayCards('sunny');
  });
})();
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
    document.querySelector("#change-values").value = city[1];
    change();
};

//Function to check whether the input given by the user is valid or invalid and display results accordingly
function callChange() {
     var city = Object.keys(weather_data);
     let cityGiven = document.querySelector("#change-values").value.toLowerCase();
     let flag = 0;
     for(let userInput = 0; userInput < city.length; userInput++)
     {
         if(cityGiven == city[userInput]){
            change();
            flag = 1;
        }
    } 
    if (flag === 0){
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

  let weatherImages = [];
  let weatherArray = [];
  var city = Object.keys(weather_data);

  var current_city = document.querySelector("#change-values").value.toLowerCase();
  var logo = document.getElementById("logo");
  let cel = weather_data[current_city].temperature.slice(0, -2);
  var tzone = weather_data[current_city].timeZone;
  var time = new Date().toLocaleString("en-US", {
    timeZone: tzone,
    timeStyle: "medium",
    hourCycle: "h12",
  });
  let dateTimeArr = weather_data[current_city].dateAndTime.split(",");
  let dateSplit = dateTimeArr[0];
  let dateArr = dateSplit.split("/");
  let dateInWords =
    String(dateArr[1].padStart(2, "0")) +
    "-" +
    monthArr[dateArr[0] - 1] +
    "-" +
    dateArr[2];
  let amPm = time.slice(-2);


  //change the logo image
  logo.src = `/images/Icons_for_cities/${current_city}.svg`;

  //Box Border
  document.querySelector("#change-values").style.borderColor = "black";

  //temperature C
  document.getElementById("celsius").innerHTML =
    weather_data[current_city].temperature;

  //temperature F
  far = changetoFarenheit(cel);
  far = far.toPrecision(3);
  far += " F";
  document.getElementById("faren").innerHTML = far;

  // humidity level
  document.getElementById("humid-num").innerHTML =
    weather_data[current_city].humidity;

  //precipitation
  document.getElementById("precip-level").innerHTML =
    weather_data[current_city].precipitation;

  //date and time
  dateTimeArr = weather_data[current_city].dateAndTime.split(",");

  //Real time
  document.getElementById("header-time").innerHTML = time;

  //date
  document.getElementById("header-date").innerHTML = dateInWords;

  //getting timeline on the right side of header
  document.getElementById(`current-time0`).innerHTML = "NOW";
  time = time.slice(0, 2);
  time = parseInt(time)+1;
  console.log(time);
  for (let timeDisplay = 1; timeDisplay < 6; timeDisplay++) {
    if (time > 12) {
      time = time - 12;
    }

    document.getElementById(`current-time${timeDisplay}`).innerHTML = time +" "+ amPm;

    if(time=== (11||12) && amPm=== "AM")
    {
        amPm= "PM";
    } 
    else if(time=== (11||12) && amPm === "PM"){
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
  for (let iterator = 0; iterator <= 5; iterator++) {
    if (parseInt(weatherArray[i]) >= 23 && parseInt(weatherArray[i]) < 29) {
      document.getElementById(`weather-image${i+1}`).src = "./images/Weather_Icons/cloudyIcon.svg";
    } else if (
      parseInt(weatherArray[i]) >= 18 && parseInt(weatherArray[i]) <= 22) {
        document.getElementById(`weather-image${i+1}`).src = "./images/Weather_Icons/windyIcon.svg";
    } else if (parseInt(weatherArray[i]) <=0) {
      document.getElementById(`weather-image${i+1}`).src = "./images/Weather_Icons/snowflakeIcon.svg";
    } else if (parseInt(weatherArray[i]) < 18) {
      document.getElementById(`weather-image${i+1}`).src = "./images/Weather_Icons/rainyIcon.svg";
    } else if (parseInt(weatherArray[i]) >= 29) {
      document.getElementById(`weather-image${i+1}`).src = "./images/Weather_Icons/sunnyIcon.svg";
    } 
  }
};
setInterval(callChange,1000);

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
         document.getElementById(`current-time${hourlyTime}`).innerHTML = "-";
     }
    //Hourly Temperature
    for(let hourlyTemp=1; hourlyTemp<=6; hourlyTemp++){
        document.getElementById(`temp${hourlyTemp}`).innerHTML = "NA";
    }
    //Weather icon for hourly temperature
    for(let hourlyWeather=1; hourlyWeather<=6; hourlyWeather++)
    {
        document.getElementById(`weather-image${hourlyWeather}`).src=`/images/Weather_Icons/close.png`;
    }
};

//Middle section
//Displaying time by the minute
setInterval( function() { displayCards(weatherChoice); },60000);
//Function to display the city cards based on user display choice and weather choice
function display(slicedArr)
{ 
  let weatherCards = "";
  for(let iterator=0; iterator<slicedArr.length; iterator++)
  {
    
    var tzone = slicedArr[i].timeZone;
    var time = new Date().toLocaleString("en-US", {
    timeZone: tzone,
    timeStyle: "short",
    hourCycle: "h12",
    });
    dateTimeArr = slicedArr[i].dateAndTime.split(",");
    let dateSplit = dateTimeArr[0];
    let dateArr = dateSplit.split("/");
    let dateInWords = String(dateArr[1].padStart(2, "0")) + "-" + monthArr[dateArr[0] - 1] + "-" + dateArr[2];

    
    weatherCards += `<div class="card${i}">
    <div class="city-temp">
        <p>${slicedArr[i].cityName}</p>
        <div class="mid-temp">
            <img class="sun" src="/images/Weather_Icons/${weatherChoice}Icon.svg">
            <p>${slicedArr[i].temperature}</p>
        </div>
    </div>
    <div class="changesize time">${time}</div>
    <div class="changesize date">${dateInWords}</div>
    <div class="dandt">
        <p class="mid-humidity"><img src="/images/Weather_Icons/humidityIcon.svg">${slicedArr[i].humidity}</p>
        <p class="mid-precip"><img src="/images/Weather_Icons/precipitationIcon.svg">${slicedArr[i].precipitation}</p>
    </div>
    </div>`

  }
  document.querySelector(".second-row").innerHTML = weatherCards;
  for(let iterator=0; iterator<slicedArr.length; iterator++)
    {
      document.querySelector(`.card${i}`).style.backgroundImage = `url(/images/Icons_for_cities/${slicedArr[i].cityName}.svg)`;
    }
    
  
}

//Function to specify the city cards to be displayed
function setMinMax()
{
  var filterLimit = document.getElementById("display-number").value;
  let slicedArr = [];
  if(getArr.length>filterLimit)
  {
    slicedArr = getArr.slice(0,filterLimit);
  }
  else{ 
    slicedArr = getArr;
  }  
  if(slicedArr.length < 4)
    {
      document.querySelector(".scroll-left").style.visibility = "hidden";
      document.querySelector(".scroll-right").style.visibility = "hidden";
    }
    else{
      document.querySelector(".scroll-left").style.visibility = "visible";
      document.querySelector(".scroll-right").style.visibility = "visible";
    }
  display(slicedArr);
}

//Function to sort the selected cities 
function sortCity()
{
  if(weatherChoice==="sunny")
  {
    getArr.sort((a,b)=>{
      return parseInt(b.temperature)-parseInt(a.temperature);
    })
  } 
  else if(weatherChoice==="snowflake")
  {
    getArr.sort((a,b)=>{
      return parseInt(b.precipitation)-parseInt(a.precipitation);
    })
  } 
  else
  {
    getArr.sort((a,b)=>{
      return parseInt(b.humidity)-parseInt(a.humidity);
    })
  } 
  setMinMax();
}

//Function to get user choice and select the cities based on the weather specifications for the given user choice
function displayCards(val){
  var cityValues = Object.values(weather_data);
  weatherChoice = val;
  getArr = [];

  if (weatherChoice === "sunny"){
    document.getElementById("sunny-button").style.borderBottom = "2px solid #1E90FF";
    document.getElementById("cold-button").style.borderBottom = "none";
    document.getElementById("rainy-button").style.borderBottom = "none";
    for(let citySort=0; citySort<cityValues.length; citySort++)
    {
      if( (parseInt(cityValues[i].temperature) > 29) 
        && (parseInt(cityValues[i].humidity) < 50) 
        && (parseInt(cityValues[i].precipitation) >= 50) ){
          getArr.push(cityValues[i]);
        }
    }
  } else if (weatherChoice === "snowflake")
  {
    document.getElementById("sunny-button").style.borderBottom = "none";
    document.getElementById("cold-button").style.borderBottom = "2px solid #1E90FF";
    document.getElementById("rainy-button").style.borderBottom = "none";
    for(let citySort=0; citySort<cityValues.length; citySort++)
    {
      if( (parseInt(cityValues[i].temperature)>=20 && parseInt(cityValues[i].temperature) < 28) 
      && (parseInt(cityValues[i].humidity) > 50) 
      && (parseInt(cityValues[i].precipitation) < 50))
      {
        getArr.push(cityValues[i]);
      }
    }
  } else if(weatherChoice === "rainy"){
    document.getElementById("sunny-button").style.borderBottom = "none";
    document.getElementById("cold-button").style.borderBottom = "none";
    document.getElementById("rainy-button").style.borderBottom = "2px solid #1E90FF";
    for(let citySort=0; citySort<cityValues.length; citySort++)
    {
      if( (parseInt(cityValues[i].temperature) < 20) 
        && (parseInt(cityValues[i].humidity) >= 50) ){
          getArr.push(cityValues[i])
        }
    }
  }
  sortCity();

}

//Function to scroll left while dislaying 4 or more cards
function scrolLeft(){
  document.querySelector(".with-arrow").scrollLeft -= 340;
}

//Function to scroll right while displaying 4 or more cards
function scrollRight(){
  document.querySelector(".with-arrow").scrollLeft +=340;
}


