var express = require("express");
var moment = require("moment");

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
    res.send("<html><body><p> The Current time is: " + getDate() + "</p></body></html>");
});

console.log("The current date is: " + getDate());

function getDate() {
    return moment().format('MMMM Do YYYY, h:mm:ss');
}
