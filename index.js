var weather_data;
fetch("data.json")
.then(data=>data.json())
.then(result=>{
    weather_data = result;
    console.log(weather_data);
    setCity();
})

function setCity() {
    var  city = Object.keys(weather_data);
    var option = ``;
    for (var i=0; i<city.length; i++) {
        option+= `<option>${city[i]}</option>`;}
    document.querySelector("#dropdown").innerHTML = option;
}

//get temperature in farenheit
let far;
function changetoFarenheit(val){
    let farenheit = (val * 1.8) + 32;
    return farenheit;
}

function change(){

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
        "Dec"
    ];

    const weatherImages = [
        document.getElementById(`weather-image1`),
        document.getElementById(`weather-image2`),
        document.getElementById(`weather-image3`),
        document.getElementById(`weather-image4`),
        document.getElementById(`weather-image5`),
        document.getElementById(`weather-image6`)
    ];

    const weatherArray = [];

    var  city = Object.keys(weather_data);
    var current_city = document.querySelector("#change-values").value;
    console.log(current_city);
    grid_element = ``;

    //change the logo image
    var logo = document.getElementById("logo");
    logo.src=  `/images/Icons_for_cities/${current_city}.svg`;

     //temperature C
    document.getElementById("celsius").innerHTML = weather_data[current_city].temperature;

    //temperature F
    let cel = weather_data[current_city].temperature.slice(0, -2);
    far = changetoFarenheit(cel);
    console.log(far);
    far = far.toPrecision(3);
    far += " F";
    console.log(far);
    document.getElementById("faren").innerHTML = far;

    // humidity level
    document.getElementById("humid-num").innerHTML = weather_data[current_city].humidity;

    //precipitation
    document.getElementById("precip-level").innerHTML =weather_data[current_city].precipitation;

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
    let dateInWords = String(dateArr[1].padStart(2,'0')) + "-" + monthArr[dateArr[0] - 1] + "-" + dateArr[2];
    document.getElementById("header-date").innerHTML = dateInWords;

    //getting timeline on the right side of header
    let amPm = time.slice(-2);
    time = time.slice(0,2);
    time = parseInt(time) +1;
    console.log(time);
    for(var i=1; i<6; i++)
    {
        if(time > 12){
            time = time - 12;
            console.log(time);
            if (amPm == "AM"){
                 amPm = "PM"; 
                } 
            else{ amPm = "AM"; }
        }
        document.getElementById(`current-time${i}`).innerHTML = time + amPm;
        time++;
    };
       
    //getting temperature values on the right side of header
    /*const tempArr = new Array;
    for (var i=0; i<4; i++)
    {
        tempArr[i] = weather_data[current_city].nextFiveHrs[i];
        tempArr[i] = tempArr[i].slice(0,-2);
        console.log(tempArr[i]);
    }
    for(var i=0; i<4; i++)
    {
        document.getElementById(`temp${i}`).innerHTML = tempArr[1];
    }
    //document.getElementById(`temp2`).innerHTML = weather_data[current_city].nextFiveHrs[0];
    */
    //var temp = weather_data[current_city].nextFiveHrs[0].subString(0,2);

    document.getElementById(`temp1`).innerHTML = weather_data[current_city].temperature.slice(0,2);
    weatherArray[0] = weather_data[current_city].temperature.slice(0,2);
    weatherArray[5] = weather_data[current_city].temperature.slice(0,2);
    for( var i=2; i<6; i++){
        document.getElementById(`temp${i}`).innerHTML = weather_data[current_city].nextFiveHrs[i-2].slice(0,2);
        weatherArray[i-1] = weather_data[current_city].nextFiveHrs[i-2].slice(0,2);
    }
    document.getElementById(`temp6`).innerHTML = weather_data[current_city].temperature.slice(0,2);

    //getting the image icon for weather 
    for (var i=0; i<5 ; i++){
        console.log(weatherArray, 'tmep')
        if(parseInt(weatherArray[i]) >= 23 && parseInt(weatherArray[i]) < 29)
        {
             weatherImages[i].src = `/images/Weather_Icons/cloudyIcon.svg`;
        }
        
        else if(parseInt(weatherArray[i]) >= 18 && parseInt(weatherArray[i]) < 22)
        {
            weatherImages[i].src = `/images/Weather_Icons/windyIcon.svg`;
        }

        else if(parseInt(weatherArray[i]) < 18)
        {
            weatherImages[i].src = `/images/Weather_Icons/rainyIcon.svg`;
        }

        else if(parseInt(weatherArray[i]) > 29)
        {
            weatherImages[i].src = `/images/Weather_Icons/sunnyIcon.svg`;
        }
    };
    

    


}

