var express = require("express");
var moment = require("moment");
var app = express();

var db;

var api_gdp = require("./api/gdp.js");
app.use("/api/v1/gdp", api_gdp);

var path = require("path");

var MongoClient= require("mongodb").MongoClient;
var mdbURL = "mongodb://test:test@ds133260.mlab.com:33260/sos1617-06-cle-sandbox";

app.use("/", express.static(path.join(__dirname, "public")));

MongoClient.connect(mdbURL,{native_parser:true},function(err,database){
    if(err){
        console.log("CANNOT CONNECT"+err);
        process.exit(1);
    }
    db = database.collection("gdp");
    app.listen(port, (err) => {
        if (!err)
            console.log("Web Server is running and listening on port: " + port);
        else
            console.log("ERROR initializing server on port " + port + ":" + err);
});
    
    
});

var port = (process.env.PORT || 16778);




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
