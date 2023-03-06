const http = require("http");
const path = require("path");
var fs = require("fs");
const Port = 8000;

const {allTimeZones,timeForOneCity,nextNhoursWeather} = require("./timeZone");
let currentCity = "";

var app = http.createServer((req,res)=>{
    let file = path.join(req.url === "/" ? "index.html" : req.url.slice(1));
    let contentType = "text/html";
    let extension = path.extname(file);
    console.log(file);
    switch(extension)
    {
        case ".css": contentType= "text/css";
        break;
        case ".js": contentType= "text/javascript";
        break;
        case ".svg": contentType= "image/svg+xml";
        break;
        case ".png": contentType= "image/x-png";
        break;
    } 
   

    if(req.url === ".ico" || file === 'vars.css')
    {
        console.log("Inside if case for .ico file")
        res.end();
        return;
    }

    if(req.url == "/allCities")
    {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify(allTimeZones()));
        res.end();
    }
    
    else if (req.url.match("/cityData"))
    {
        currentCity = req.url.split("=")[1];
        console.log(currentCity,"current city value");
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify(timeForOneCity(currentCity)));
        res.end();
    }

    else if(req.url.match("/nextFiveHours"))
    {
        let body = '';
        req.on('data', (data) => body+= data.toString());
        req.on('end', ()=>{
           let currentCityDetails = JSON.parse(body);
           res.write(JSON.stringify(nextNhoursWeather(currentCityDetails.city_Date_Time_Name,currentCityDetails.hours, allTimeZones())));
           res.end();
        })
    }

    else{
        res.writeHead(200, {"Content-Type": contentType});
        fs.createReadStream(file).pipe(res);
    }
})

app.listen(Port,(err)=>{
    if(err)
    console.log(err);
    else
    console.log("Server Connected!");
})