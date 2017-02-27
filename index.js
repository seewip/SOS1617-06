var express = require("express");

var app = express();
var port = (process.env.PORT || 16778);

app.listen(port, (err) => {
    if (!err)
        console.log("Web Server is running and listening on port: " + port);
    else
        console.log("ERROR initializing server on port " + port + ":" + err);
});


app.get("/", (req, res) => {
    res.send('<html><body><h1>Hello SOS1617 from the group G06</h1></br><a href="time"> Get current time </a></body></html>');

});

app.get("/time", (req, res) => {
    res.send("<html><body><p>Current time is: " + getDate() + "</p></body></html>");
});

console.log("The current date is: " + getDate());

function getDate() {
    var month = new Array("January", "February", "March", "April", "May", "June",
        "July", "August", "September", "November", "October", "December");

    var date = new Date();

    // Set timezone to GMT+1, since the OS on cloud9 operates on GMT+0
    date.setTime(date.getTime() + 60 * 60 * 1000);

    var minute = date.getMinutes();
    var second = date.getSeconds();

    minute = (minute < 10) ? '0' + minute : minute;
    second = (second < 10) ? '0' + second : second;

    return date.getDate() + " " + month[date.getMonth()] +
        " of " + date.getFullYear() + ", " + date.getHours() + ":" + minute + ":" + second;
}
