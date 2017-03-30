var moment = require("moment");
var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');
var publicFolder = path.join(__dirname, '/public');

var educationAPI = require('./api/v1/education.js');

var gdp = require('./api/v1/gdp.js');

var gdp_per_capitaAPI = require('./api/v1/gdp-per-capita.js');

var app = express();

var MongoClient = require('mongodb').MongoClient;
var mdbURL = "mongodb://crileaech:admin@ds133260.mlab.com:33260/sos1617-06-cle-sandbox";

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";
var dbCle;
var dbJf;
var dbMd;

var API_KEY = "secret";

// Helper method to check for apikey
var checkApiKeyFunction = function(request, response) {
    if (!request.query.apikey) {
        console.error('WARNING: No apikey was sent!');
        response.sendStatus(401)
        return false;
    }
    if (request.query.apikey !== API_KEY) {
        console.error('WARNING: Incorrect apikey was used!');
        response.sendStatus(403)
        return false;
    }
    return true;
};

app.use(bodyParser.json());
app.use(helmet());

MongoClient.connect(mdbURL, {
    native_parser: true
}, function(err, database) {

    if (err) {
        console.log("CAN NOT CONNECT TO DB: " + err);
        process.exit(1);
    }

    dbCle = database.collection("gdp");
    dbJf = database.collection("gdp-per-capita");
    dbMd = database.collection("education");

    educationAPI.register(app, dbMd, BASE_API_PATH, checkApiKeyFunction);

    gdp.register(app, dbCle, BASE_API_PATH);

    gdp_per_capitaAPI.register(app, dbJf, BASE_API_PATH);

    app.listen(port, () => {
        console.log("Web server is listening on port " + port);
    });

});

app.use("/", express.static(publicFolder));
//=================================BOTTON FOR RUN POSTMAN====================================================//

app.use("/api/v1/tests", express.static(path.join(__dirname, "public/tests.html")));



console.log("The current date is: " + getDate());

function getDate() {

    return moment().format('MMMM Do YYYY, h:mm:ss');
}
