const express = require('express')
const port = 3000
const {allTimeZones,timeForOneCity,nextNhoursWeather} = require("./timeZone");
const app = express()

app.use(express.static("public"))
app.use(express.json());

app.get("/", (req,res)=>{
    console.log(req.url)
    res.render("/public/index.html")
})

app.get("/allCities", (req,res)=>{
    weatherResult = allTimeZones();
    res.json(weatherResult);
    // let currentTime = new Date();
    // if(currentTime - startTime > dayCheck){
    //     startTime = new Date()
    //     weatherResult = timeZones.allTimeZones()
    //     res.json(weatherResult)
    // }
    // else{
    //     if(weatherResult.length === 0){
    //         weatherResult = timeZones.allTimeZones()
    //     }
    //     res.json(weatherResult);
    // }
})

app.get("/cityData",(req,res)=>{
    var city = req.query.city;
    res.json(timeForOneCity(city));
})

app.post("/nextFiveHours",(req,res)=>{
    let cityTDN = req.body.city_Date_Time_Name;
    let hours = req.body.hours;
    res.json(nextNhoursWeather(cityTDN,hours,weatherResult))
})

app.listen(port,(err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log("Server running")
    }
})