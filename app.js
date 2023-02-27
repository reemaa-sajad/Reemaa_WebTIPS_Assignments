const express = require('express')
const path = require('path')
const port = 3000
const app = express()
const {fork} = require('child_process');

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/allCities",(req,res)=>{
    const weatherData = fork('./allCities');
    weatherData.send("message");
    weatherData.on("message",(message)=>{
        res.json(message);
    })
    
})

app.get("/cityData",(req,res)=>{
    const cityData = fork('./cityData');
    cityData.send({"city":req.query.city})
    cityData.on("message",(message)=>{
        res.json(message);
    })
    
})

app.post("/nextFiveHours",(req,res)=>{
    const nextFiveHours = fork('./nextFiveHours');
    nextFiveHours.send({city:req.body.city_Date_Time_Name,
    hours:req.body.hours})
    nextFiveHours.on("message",(message)=>{
        res.json(message);
    })
})

app.listen(port,(err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log("Server running")
    }
})