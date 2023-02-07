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
    console.log("This is inside farenheit function ");
    return farenheit;
}

function change(){
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
    far = far.toPrecision(2)
    far += " F";
    document.getElementById("faren").innerHTML = far;
    // humidity level
    document.getElementById("humid-num").innerHTML = weather_data[current_city].humidity;
    //precipitation
    document.getElementById("precip-level").innerHTML =weather_data[current_city].precipitation;
    //date and time
    dateArr = weather_data[current_city].dateAndTime.split(",");
    console.log(dateArr[1].slice(0, -2));
    document.getElementById("header-time").innerHTML = dateArr[1].slice(0, -2);
    document.getElementById("header-date").innerHTML = dateArr[0];

    /* for (var i = 0; i < city.length; i++) {
    var temp = weather_data[current_city].nextFiveHrs[i];
    var date = new Date().toLocaleString("en-US", {
        timeZone: "Asia/kolkata",
        timeStyle: "medium",
        hourCycle: "h24",
        });
    console.log(weather_data[select_value].temperature, temp, date);
    }
    var nxtdate = date.slice(0, 2);

    document.querySelector(`.right-item-${2}`).innerHTML = nxtdate;
    */

}


