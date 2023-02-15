var weather_data;
let getArr = [];
let weatherChoice;
var cityValues = [];
let continentOrder = 0;
let temperatureOrder = 0;
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
    sortContinent();
    setInterval(sortContinent,60000);
  });
})();

function setCity() {
  var city = Object.keys(weather_data);
  var option = ``;
  for (var i = 0; i < city.length; i++) {
    option += `<option>${city[i]}</option>`;
  }
  document.querySelector("#dropdown").innerHTML = option;
}

//Function to initially load page with city details
Base.prototype.initCity = function(){
  document.querySelector("#change-values").value = this.city[6];
  this.change();
}

//Function to change the weather values displayed in header section based on city chosen by user
Base.prototype.change = function(){
  const weatherImages = [
    document.getElementById(`weather-image1`),
    document.getElementById(`weather-image2`),
    document.getElementById(`weather-image3`),
    document.getElementById(`weather-image4`),
    document.getElementById(`weather-image5`),
    document.getElementById(`weather-image6`),
  ];

  const weatherArray = [];
  let current_city = document.querySelector("#change-values").value;
  let logo = document.getElementById("logo");

  //change the logo image
  logo.src = `/images/Icons_for_cities/${current_city}.svg`;

  //Box Border
  document.querySelector("#change-values").style.borderColor = "black";

  //temperature C
  document.getElementById("celsius").innerHTML =
    this.data[current_city].temperature;

  //temperature F
  let cel = this.data[current_city].temperature.slice(0, -2);
  let far = cel * 1.8 + 32;
  far = far.toPrecision(3);
  far += " F";
  document.getElementById("faren").innerHTML = far;

  // humidity level
  document.getElementById("humid-num").innerHTML =
    this.data[current_city].humidity;

  //precipitation
  document.getElementById("precip-level").innerHTML =
    this.data[current_city].precipitation;

  //date and time
  let dateTimeArr = this.data[current_city].dateAndTime.split(",");
  
  //Real time
  let tzone = this.data[current_city].timeZone;
  let time = new Date().toLocaleString("en-US", {
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
    this.monthArr[dateArr[0] - 1] +
    "-" +
    dateArr[2];
  document.getElementById("header-date").innerHTML = dateInWords;

  //getting timeline on the right side of header
  document.getElementById(`current-time0`).innerHTML = "NOW";
  let amPm = time.slice(-2);
  time = time.slice(0, 2);
  time = parseInt(time)+1;
  for (let i = 1; i < 6; i++) {
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
  document.getElementById(`temp1`).innerHTML = this.data[
    current_city
  ].temperature.slice(0, 2);
  weatherArray[0] = this.data[current_city].temperature.slice(0, 2);
  weatherArray[5] = this.data[current_city].temperature.slice(0, 2);
  for (let i = 2; i < 6; i++) {
    document.getElementById(`temp${i}`).innerHTML = this.data[current_city].nextFiveHrs[i - 2].slice(0, 2);
    weatherArray[i - 1] = this.data[current_city].nextFiveHrs[i - 2].slice(0, 2);
  }
  document.getElementById(`temp6`).innerHTML = this.data[
    current_city
  ].temperature.slice(0, 2);

  //getting the image icon for weather
  for (let i = 0; i <= 5; i++) {
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

}

//Function to set weather values to null on getting invalid city input from user
Base.prototype.setNullVal = function(){
  //Logo
  let logo = document.getElementById("logo");
  logo.src = `/images/Icons_for_cities/city.png`;
  //Box Border
  document.querySelector("#change-values").style.borderColor = "red";
  console.log("Wrong input")
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
}

//Function to check whether the input given by the user is valid or invalid and display results accordingly
Base.prototype.callChange = function(){
  let cityGiven = document.querySelector("#change-values").value;
  let flag = 0;
  for(let i = 0; i < this.city.length; i++)
    {
      if(cityGiven == this.city[i]){
        flag = 1;
        this.change();
      }
    } 
    if (flag == 0){
      this.setNullVal(); 
    }
}

//Middle section

//Function to get user choice and select the cities based on the weather specifications for the given user choice
Base.prototype.displayCards = function(val){
  this.weatherChoice = val;
  this.getArr = [];
  this.cityValues = Object.values(this.data);
  if (this.weatherChoice == "sunny"){
    document.getElementById("sunny-button").style.borderBottom = "2px solid #1E90FF";
    document.getElementById("cold-button").style.borderBottom = "none";
    document.getElementById("rainy-button").style.borderBottom = "none";
    for(let i=0; i<this.cityValues.length; i++)
    {
      if( (parseInt(this.cityValues[i].temperature) > 29) 
        && (parseInt(this.cityValues[i].humidity) < 50) 
        && (parseInt(this.cityValues[i].precipitation) >= 50) ){
          this.getArr.push(this.cityValues[i]);
        }
    }
  } else if (this.weatherChoice == "snowflake")
  {
    document.getElementById("sunny-button").style.borderBottom = "none";
    document.getElementById("cold-button").style.borderBottom = "2px solid #1E90FF";
    document.getElementById("rainy-button").style.borderBottom = "none";
    for(let i=0; i<this.cityValues.length; i++)
    {
      if( (parseInt(this.cityValues[i].temperature)>=20 && parseInt(this.cityValues[i].temperature) < 28) 
      && (parseInt(this.cityValues[i].humidity) > 50) 
      && (parseInt(this.cityValues[i].precipitation) < 50))
      {
        this.getArr.push(this.cityValues[i]);
      }
    }
  } else if(this.weatherChoice == "rainy"){
    document.getElementById("sunny-button").style.borderBottom = "none";
    document.getElementById("cold-button").style.borderBottom = "none";
    document.getElementById("rainy-button").style.borderBottom = "2px solid #1E90FF";
    for(let i=0; i<this.cityValues.length; i++)
    {
      if( (parseInt(this.cityValues[i].temperature) < 20) 
        && (parseInt(this.cityValues[i].humidity) >= 50) ){
          this.getArr.push(this.cityValues[i])
        }
    }
  }
  this.sortCity();
}

//Function to sort the selected cities 
Base.prototype.sortCity = function()
{
  if(this.weatherChoice=="sunny")
  {
    this.getArr.sort((a,b)=>{
      return parseInt(b.temperature)-parseInt(a.temperature);
    })
  } 
  else if(this.weatherChoice=="snowflake")
  {
    this.getArr.sort((a,b)=>{
      return parseInt(b.precipitation)-parseInt(a.precipitation);
    })
  } 
  else
  {
    this.getArr.sort((a,b)=>{
      return parseInt(b.humidity)-parseInt(a.humidity);
    })
  } 
  this.setMinMax();
}

//Function to specify the city cards to be displayed
Base.prototype.setMinMax = function()
{
  let filterLimit = document.getElementById("display-number").value;
  this.slicedArr = [];
  if(this.getArr.length>filterLimit)
  {
    this.slicedArr = this.getArr.slice(0,filterLimit);
  }
  else{ 
    this.slicedArr = this.getArr;
  }  
  this.display();
}

//Function to display the city cards based on user display choice and weather choice
Base.prototype.display = function()
{ 
  let weatherCards = "";
  for(let i=0; i<this.slicedArr.length; i++)
  {
    
    let tzone = this.slicedArr[i].timeZone;
    let time = new Date().toLocaleString("en-US", {
    timeZone: tzone,
    timeStyle: "medium",
    hourCycle: "h12",
    });

    dateTimeArr = this.slicedArr[i].dateAndTime.split(",");
    let dateSplit = dateTimeArr[0];
    let dateArr = dateSplit.split("/");
    let dateInWords = String(dateArr[1].padStart(2, "0")) + "-" + this.monthArr[dateArr[0] - 1] + "-" + dateArr[2];
    weatherCards += `<div class="card${i}">
    <div class="city-temp">
        <p>${this.slicedArr[i].cityName}</p>
        <div class="mid-temp">
            <img class="sun" src="/images/Weather_Icons/${this.weatherChoice}Icon.svg">
            <p>${this.slicedArr[i].temperature}</p>
        </div>
    </div>
    <div class="changesize time">${time}</div>
    <div class="changesize date">${dateInWords}</div>
    <div class="dandt">
        <p class="mid-humidity"><img src="/images/Weather_Icons/humidityIcon.svg">${this.slicedArr[i].humidity}</p>
        <p class="mid-precip"><img src="/images/Weather_Icons/precipitationIcon.svg">${this.slicedArr[i].precipitation}</p>
    </div>
    </div>`
    if(document.getElementById("display-number").value < 4)
    {
      document.querySelector(".scroll-left").style.visibility = "hidden";
      document.querySelector(".scroll-right").style.visibility = "hidden";
    }
    else{
      document.querySelector(".scroll-left").style.visibility = "visible";
      document.querySelector(".scroll-right").style.visibility = "visible";
    }

  }
  document.querySelector(".second-row").innerHTML = weatherCards;
  for(let i=0; i<this.slicedArr.length; i++)
    {
      document.querySelector(`.card${i}`).style.backgroundImage = `url(/images/Icons_for_cities/${this.slicedArr[i].cityName}.svg)`;
    }
  
}

//Function to scroll left while dislaying 4 or more cards
Base.prototype.scrolLeft = function(){
  document.querySelector(".with-arrow").scrollLeft -= 340;
}

//Function to scroll right while displaying 4 or more cards
Base.prototype.scrollRight = function(){
  document.querySelector(".with-arrow").scrollLeft +=340;
}

//Footer section

//Function to sort continents by alphabetical order
Base.prototype.sortContinent = function()
{
  if(this.continentOrder==0){ 
    if(this.temperatureOrder==0)
    {    
      cityVal.sort((a, b) => 
      {    
        console.log(a.timeZone.split("/")[0]);    
        if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) 
        {     
          return parseInt(a.temperature) < parseInt(b.temperature) ? -1 : 1;    
        } 
        else 
        {     
          return a.timeZone.split("/")[0] < b.timeZone.split("/")[0] ? -1 : 1;    
        }    
      });   
    }   
    else
    {    
      allCities.sort((a, b) => 
      {    
        console.log(a.timeZone.split("/")[0]);    
        if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) 
        {     
          return parseInt(b.temperature) < parseInt(a.temperature) ? -1 : 1;    
        } 
        else 
        {     
          return a.timeZone.split("/")[0] < b.timeZone.split("/")[0] ? -1 : 1;    
        }    
      });   
    }  
  }  

  else
  {     
    if (temperatureOrder == 0)
    {    cityVal.sort((a, b) => 
      {     
        console.log(a.timeZone.split("/")[0]);     
        if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) 
        {      
          return parseInt(a.temperature) < parseInt(b.temperature) ? -1 : 1;     
        } 
        else 
        {      
          return b.timeZone.split("/")[0] < a.timeZone.split("/")[0] ? -1 : 1;     
        }    
      });   
    } 
    else 
    {    
      cityVal.sort((a, b) => 
      {     
        console.log(a.timeZone.split("/")[0]);     
        if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) 
        {      
          return parseInt(b.temperature) < parseInt(a.temperature) ? -1 : 1;     
        } 
        else 
        {      
          return b.timeZone.split("/")[0] < a.timeZone.split("/")[0] ? -1 : 1;     
        }    
      });   
    }  
  }

  this.displayContinents();

}

//Function to call sortContinent function on clicking continent button
Base.prototype.continentButton = function(){
  if(this.continentOrder==0)
  {   
    this.continentOrder=1;
    document.querySelector(".cont-selector").src = "/images/General_Images_&_Icons/arrowDown.svg";  
  }  
  else if(this.continentOrder==1)
  {   
    this.continentOrder=0;   
    document.querySelector(".cont-selector").src = "/images/General_Images_&_Icons/arrowUp.svg";  
  }  
  this.sortContinent(); 
}

//Function to call sortContinent function on clicking temperature button
Base.prototype.tempButton = function(){
  if(this.temperatureOrder==0)
  {   
    this.temperatureOrder=1;
    document.querySelector(".temp-selector").src = "/images/General_Images_&_Icons/arrowDown.svg";  
  }  
  else if(this.temperatureOrder==1)
  {   
    this.temperatureOrder=0;   
    document.querySelector(".temp-selector").src = "/images/General_Images_&_Icons/arrowUp.svg";  
  }  
  this.sortContinent(); 
}

//Function to display the continents in user specified order
Base.prototype.displayContinents = function(){
  let continentCards = "";
  for (let i=0; i<12; i++){
    let currentTime = new Date().toLocaleString("en-US", {
      timeZone: this.cityValues[i].timeZone,
      timeStyle: "medium",
      hourCycle: "h12",
    });
    let timeArray = currentTime.split(" ");
    let amPm = timeArray[1]
    let hourMinSec = timeArray[0].split(":");
    let time = ", "+hourMinSec[0]+":"+hourMinSec[1]+" "+amPm;


    continentCards += `<div class="continent${i}">
    <div class="footer-continent">${this.cityValues[i].timeZone.split("/")[0]}</div>
    <div class="footer-temp">${this.cityValues[i].temperature}</div>
    <div class="city-name">
      <div>${this.cityValues[i].cityName}</div>
      <div class="current-time">${time}</div>
    </div>
    <div class="humid-percent">
        <p> ${this.cityValues[i].humidity} <img src="/images/Weather_Icons/humidityIcon.svg" alt="raindrop"></p>
    </div>
</div>`
  }

  document.querySelector(".continent-list").innerHTML = continentCards;

}