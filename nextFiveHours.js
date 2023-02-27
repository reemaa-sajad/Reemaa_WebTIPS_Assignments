const {nextNhoursWeather,allTimeZones} = require("./timeZone");


process.on("message", message=>{
    console.log("Inside next five hours");
    const jsonResponse = nextNhoursWeather(message.city, message.hours, allTimeZones());
    process.send(jsonResponse);  
})