window.setTimeout(function () { window.location.reload();}, 60000);
fetch("http://localhost:3000/allCities")
  .then((data) => data.json())
  .then((result) => {
    let cityList = {};
    for (let i = 0; i < result.length; i++) {
      cityList[result[i]["cityName"]] = result[i];
    }
    console.log(cityList);
    let obj = new Base(cityList);
    obj.setCity();
    obj.initCity();
    obj.change();
    //setInterval(obj.callChange.bind(obj), 60000);
    obj.displayCards("rainy");
    obj.sortContinent();
    //setInterval(obj.sortContinent.bind(obj),60000);
  });

class Base {
  constructor(data) {
    this.data = data;
    this.monthArr = [
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
    this.getArr = [];
    this.continentOrder = 0;
    this.temperatureOrder = 0;
    document
      .querySelector("#change-values")
      .addEventListener("input", this.callChange.bind(this));
    document
      .querySelector("#sunny-button")
      .addEventListener("click", this.displayCards.bind(this, "sunny"));
    document
      .querySelector("#cold-button")
      .addEventListener("click", this.displayCards.bind(this, "snowflake"));
    document
      .querySelector("#rainy-button")
      .addEventListener("click", this.displayCards.bind(this, "rainy"));
    document
      .querySelector("#display-number")
      .addEventListener("click", this.setMinMax.bind(this));
    document
      .querySelector(".scroll-left")
      .addEventListener("click", this.scrolLeft.bind(this));
    document
      .querySelector(".scroll-right")
      .addEventListener("click", this.scrollRight.bind(this));
    document
      .querySelector(".c-name")
      .addEventListener("click", this.continentButton.bind(this));
    document
      .querySelector(".temp")
      .addEventListener("click", this.tempButton.bind(this));
  }
  //Header section
  //Function to initialize city values in dropdown
  setCity() {
    this.city = Object.keys(this.data);
    let option = ``;
    for (let i = 0; i < this.city.length; i++) {
      option += `<option>${this.city[i]}</option>`;
    }
    document.querySelector("#dropdown").innerHTML = option;
  }

  //Function to initially load page with city details
  initCity() {
    document.querySelector("#change-values").value = this.city[6];
  }

  //Function to check whether the input given by the user is valid or invalid and display results accordingly
  callChange() {
    let cityGiven = document.querySelector("#change-values").value;
    let flag = 0;
    for (let i = 0; i < this.city.length; i++) {
      if (cityGiven == this.city[i]) {
        flag = 1;
        break;
      }
    }

    if (flag == 0) {
      this.setNullVal();
    }
    else{
      this.change();
    }
  }

  //Function to change the weather values displayed in header section based on city chosen by user
   change() {

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
      timeStyle: "short",
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
    time = parseInt(time) + 1;
    for (let i = 1; i < 6; i++) {
      if (time > 12) {
        time = time - 12;
      }

      document.getElementById(`current-time${i}`).innerHTML = time + " " + amPm;

      if ((time == 11 ) || (time == 12) && amPm == "AM") {
        amPm = "PM";
      } else if ((time == 11 ) || (time == 12) && amPm == "PM") {
        amPm = "AM";
      }

      time++;
    }

    fetch(`http://localhost:3000/cityData?city=${current_city}`)
      .then((data) => data.json())
      .then((result) => {
        fetch("http://localhost:3000/nextFiveHours", {
          method: "POST",
          body: JSON.stringify({
            ...result,
            hours: "5",
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((data) => data.json())
          .then((result) => {
            for (let i = 0; i < 5; i++) {
              console.log(result["temperature"][i]);
              this.setNextFiveHoursTemp(
                this.data[`${current_city}`].temperature,
                result
              );
            }
          });
      });

  }

  //Function to display hourly temperature and corresponding weather icons
  setNextFiveHoursTemp(currentTemp, hourlyTempObj) {
    let hourlyTemp = [];
    let weatherImages = [];
    for (let i = 0; i < 6; i++) {
      weatherImages[i] = document.getElementById(`weather-image${i + 1}`);
    }
    hourlyTemp[0] = parseInt(currentTemp);
    for(let i=1; i<6; i++)
    {
      hourlyTemp[i] = parseInt(hourlyTempObj["temperature"][i-1]);
    }
    console.log(hourlyTemp,"hourly temperature");
    for(let i=0; i<6; i++){
      console.log(hourlyTemp[i]);
    }
    for(let i=0; i<6; i++ ){
      document.getElementById(`temp${i+1}`).innerHTML = hourlyTemp[i];
      if(hourlyTemp[i] < 0){
        weatherImages[i].src = `/images/Weather_Icons/snowflakeIcon.svg`;
      }
      else if(hourlyTemp[i] < 18)
      {
        weatherImages[i].src = `/images/Weather_Icons/rainyIcon.svg`;
      }
      else if ((hourlyTemp[i] >= 18)&&(hourlyTemp[i] <= 22)){
        weatherImages[i].src = `/images/Weather_Icons/windyIcon.svg`;
      }
      else if((hourlyTemp[i] >= 23)&&(hourlyTemp[i] <= 29)){
        weatherImages[i].src = `/images/Weather_Icons/cloudyIcon.svg`;
      }
      else if(hourlyTemp[i] > 29){
        weatherImages[i].src = `/images/Weather_Icons/sunnyIcon.svg`;
      }
    }
  }

  //Function to set weather values to null on getting invalid city input from user
  setNullVal() {
    //Logo
    let logo = document.getElementById("logo");
    logo.src = `/images/Icons_for_cities/city.png`;
    //Box Border
    document.querySelector("#change-values").style.borderColor = "red";
    console.log("Wrong input");
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
    for (let i = 0; i < 6; i++) {
      document.getElementById(`current-time${i}`).innerHTML = "-";
    }
    //Hourly Temperature
    for (let i = 1; i <= 6; i++) {
      document.getElementById(`temp${i}`).innerHTML = "NA";
    }
    //Weather icon for hourly temperature
    for (let i = 1; i <= 6; i++) {
      document.getElementById(
        `weather-image${i}`
      ).src = `/images/Weather_Icons/close.png`;
    }
  }
  
  //Middle section
  //Function to get user choice and select the cities based on the weather specifications for the given user choice
  displayCards(val) {
    this.weatherChoice = val;
    this.getArr = [];
    this.cityValues = Object.values(this.data);
    if (this.weatherChoice == "sunny") {
      document.getElementById("sunny-button").style.borderBottom =
        "2px solid #1E90FF";
      document.getElementById("cold-button").style.borderBottom = "none";
      document.getElementById("rainy-button").style.borderBottom = "none";
      for (let i = 0; i < this.cityValues.length; i++) {
        if (
          parseInt(this.cityValues[i].temperature) > 29 &&
          parseInt(this.cityValues[i].humidity) < 50 &&
          parseInt(this.cityValues[i].precipitation) >= 50
        ) {
          this.getArr.push(this.cityValues[i]);
        }
      }
    } else if (this.weatherChoice == "snowflake") {
      document.getElementById("sunny-button").style.borderBottom = "none";
      document.getElementById("cold-button").style.borderBottom =
        "2px solid #1E90FF";
      document.getElementById("rainy-button").style.borderBottom = "none";
      for (let i = 0; i < this.cityValues.length; i++) {
        if (
          parseInt(this.cityValues[i].temperature) >= 20 &&
          parseInt(this.cityValues[i].temperature) < 28 &&
          parseInt(this.cityValues[i].humidity) > 50 &&
          parseInt(this.cityValues[i].precipitation) < 50
        ) {
          this.getArr.push(this.cityValues[i]);
        }
      }
    } else if (this.weatherChoice == "rainy") {
      document.getElementById("sunny-button").style.borderBottom = "none";
      document.getElementById("cold-button").style.borderBottom = "none";
      document.getElementById("rainy-button").style.borderBottom =
        "2px solid #1E90FF";
      document.getElementById("cold-button").classList.add("active");
      for (let i = 0; i < this.cityValues.length; i++) {
        if (
          parseInt(this.cityValues[i].temperature) < 20 &&
          parseInt(this.cityValues[i].humidity) >= 50
        ) {
          this.getArr.push(this.cityValues[i]);
        }
      }
    }
    this.sortCity();
  }
  //Function to sort the selected cities
  sortCity() {
    if (this.weatherChoice == "sunny") {
      this.getArr.sort((a, b) => {
        return parseInt(b.temperature) - parseInt(a.temperature);
      });
    } else if (this.weatherChoice == "snowflake") {
      this.getArr.sort((a, b) => {
        return parseInt(b.precipitation) - parseInt(a.precipitation);
      });
    } else {
      this.getArr.sort((a, b) => {
        return parseInt(b.humidity) - parseInt(a.humidity);
      });
    }
    this.setMinMax();
  }
  //Function to specify the city cards to be displayed
  setMinMax() {
    let filterLimit = document.getElementById("display-number").value;
    this.slicedArr = [];
    if (this.getArr.length > filterLimit) {
      this.slicedArr = this.getArr.slice(0, filterLimit);
    } else {
      this.slicedArr = this.getArr;
    }
    if (this.slicedArr.length < 4) {
      document.querySelector(".scroll-left").style.visibility = "hidden";
      document.querySelector(".scroll-right").style.visibility = "hidden";
    } else {
      document.querySelector(".scroll-left").style.visibility = "visible";
      document.querySelector(".scroll-right").style.visibility = "visible";
    }
    this.display();
  }
  //Function to display the city cards based on user display choice and weather choice
  display() {
    let weatherCards = "";
    for (let i = 0; i < this.slicedArr.length; i++) {
      let tzone = this.slicedArr[i].timeZone;
      let time = new Date().toLocaleString("en-US", {
        timeZone: tzone,
        timeStyle: "short",
        hourCycle: "h12",
      });

      let dateTimeArr = this.slicedArr[i].dateAndTime.split(",");
      let dateSplit = dateTimeArr[0];
      let dateArr = dateSplit.split("/");
      let dateInWords =
        String(dateArr[1].padStart(2, "0")) +
        "-" +
        this.monthArr[dateArr[0] - 1] +
        "-" +
        dateArr[2];
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
        <p class="mid-humidity"><img class="humid-icon" src="/images/Weather_Icons/humidityIcon.svg">${this.slicedArr[i].humidity}</p>
        <p class="mid-precip"><img class="precip-icon" src="/images/Weather_Icons/precipitationIcon.svg">${this.slicedArr[i].precipitation}</p>
    </div>
    </div>`;
    }
    document.querySelector(".second-row").innerHTML = weatherCards;
    for (let i = 0; i < this.slicedArr.length; i++) {
      document.querySelector(
        `.card${i}`
      ).style.backgroundImage = `url(/images/Icons_for_cities/${this.slicedArr[i].cityName}.svg)`;
    }
  }
  //Function to scroll left while dislaying 4 or more cards
  scrolLeft() {
    document.querySelector(".with-arrow").scrollLeft -= 340;
  }
  //Function to scroll right while displaying 4 or more cards
  scrollRight() {
    document.querySelector(".with-arrow").scrollLeft += 340;
  }
  //Footer section
  //Function to sort continents by alphabetical order
  sortContinent() {
    if (this.continentOrder == 0) {
      if (this.temperatureOrder == 0) {
        this.cityValues.sort((a, b) => {
          if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
            return parseInt(a.temperature) < parseInt(b.temperature) ? -1 : 1;
          } else {
            return a.timeZone.split("/")[0] < b.timeZone.split("/")[0] ? -1 : 1;
          }
        });
      } else {
        this.cityValues.sort((a, b) => {
          if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
            return parseInt(b.temperature) < parseInt(a.temperature) ? -1 : 1;
          } else {
            return a.timeZone.split("/")[0] < b.timeZone.split("/")[0] ? -1 : 1;
          }
        });
      }
    } else {
      if (this.temperatureOrder == 0) {
        this.cityValues.sort((a, b) => {
          if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
            return parseInt(a.temperature) < parseInt(b.temperature) ? -1 : 1;
          } else {
            return b.timeZone.split("/")[0] < a.timeZone.split("/")[0] ? -1 : 1;
          }
        });
      } else {
        this.cityValues.sort((a, b) => {
          if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
            return parseInt(b.temperature) < parseInt(a.temperature) ? -1 : 1;
          } else {
            return b.timeZone.split("/")[0] < a.timeZone.split("/")[0] ? -1 : 1;
          }
        });
      }
    }

    this.displayContinents();
  }
  //Function to call sortContinent function on clicking continent button
  continentButton() {
    if (this.continentOrder == 0) {
      this.continentOrder = 1;
      document.querySelector(".cont-selector").src =
        "/images/General_Images_&_Icons/arrowDown.svg";
    } else if (this.continentOrder == 1) {
      this.continentOrder = 0;
      document.querySelector(".cont-selector").src =
        "/images/General_Images_&_Icons/arrowUp.svg";
    }
    this.sortContinent();
  }
  //Function to call sortContinent function on clicking temperature button
  tempButton() {
    if (this.temperatureOrder == 0) {
      this.temperatureOrder = 1;
      document.querySelector(".temp-selector").src =
        "/images/General_Images_&_Icons/arrowDown.svg";
    } else if (this.temperatureOrder == 1) {
      this.temperatureOrder = 0;
      document.querySelector(".temp-selector").src =
        "/images/General_Images_&_Icons/arrowUp.svg";
    }
    this.sortContinent();
  }
  //Function to display the continents in user specified order
  displayContinents() {
    let continentCards = "";
    for (let i = 0; i < 12; i++) {
      let currentTime = new Date().toLocaleString("en-US", {
        timeZone: this.cityValues[i].timeZone,
        timeStyle: "medium",
        hourCycle: "h12",
      });
      let timeArray = currentTime.split(" ");
      let amPm = timeArray[1];
      let hourMinSec = timeArray[0].split(":");
      let time = ", " + hourMinSec[0] + ":" + hourMinSec[1] + " " + amPm;

      continentCards += `<div class="continent${i}">
    <div class="footer-continent">${
      this.cityValues[i].timeZone.split("/")[0]
    }</div>
    <div class="footer-temp">${this.cityValues[i].temperature}</div>
    <div class="city-name">
      <div>${this.cityValues[i].cityName}</div>
      <div class="current-time">${time}</div>
    </div>
    <div class="humid-percent">
        <p> ${
          this.cityValues[i].humidity
        } <img src="/images/Weather_Icons/humidityIcon.svg" alt="raindrop"></p>
    </div>
</div>`;
    }

    document.querySelector(".continent-list").innerHTML = continentCards;
  }
}