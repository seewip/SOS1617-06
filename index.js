var moment = require("moment");
var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');
var cors = require('cors');
var publicFolder = path.join(__dirname, '/public');

var educationAPIv1 = require('./api/v1/education.js');
var educationAPIv2 = require('./api/v2/education.js');

var gdpV1 = require('./api/v1/gdp.js');
var gdpV2 = require('./api/v2/gdp.js');

var gdp_per_capitaAPIv1 = require('./api/v1/gdp-per-capita.js');
var gdp_per_capitaAPIv2 = require('./api/v2/gdp-per-capita.js');

var app = express();

var MongoClient = require('mongodb').MongoClient;
var mdbURL = "mongodb://crileaech:admin@ds133260.mlab.com:33260/sos1617-06-cle-sandbox";

var port = (process.env.PORT || 10000);
var BASE_API_PATH_V1 = "/api/v1";
var BASE_API_PATH_V2 = "/api/v2";
var dbCle;
var dbJf;
var dbMd;

var API_KEY = "secret";

// Helper method to check for apikey
var checkApiKeyFunction = function(request, response) {
    if (!request.query.apikey) {
        console.error('WARNING: No apikey was sent!');
        response.sendStatus(401);
        return false;
    }
    if (request.query.apikey !== API_KEY) {
        console.error('WARNING: Incorrect apikey was used!');
        response.sendStatus(403);
        return false;
    }
    return true;
};

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

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

    educationAPIv1.register(app, dbMd, BASE_API_PATH_V1, checkApiKeyFunction);
    educationAPIv2.register(app, dbMd, BASE_API_PATH_V2, checkApiKeyFunction);

    gdpV1.register(app, dbCle, BASE_API_PATH_V1, checkApiKeyFunction);
    gdpV2.register(app, dbCle, BASE_API_PATH_V2, checkApiKeyFunction);

    gdp_per_capitaAPIv1.register(app, dbJf, BASE_API_PATH_V1, checkApiKeyFunction);
    gdp_per_capitaAPIv2.register(app, dbJf, BASE_API_PATH_V2, checkApiKeyFunction);

    app.listen(port, () => {
        console.log("Web server is listening on port " + port);
    });

});

app.use("/", express.static(publicFolder));
//=================================BOTTON FOR RUN POSTMAN====================================================//

app.use("/api/v1/tests", express.static(path.join(__dirname, "public/tests.html")));

//==========================================PROXY============================================================//

// Education proxy - G04 - Import and export statistics of olive oil

app.get("/proxy/education", (req, res) => {
    console.log("INFO: New GET request to /proxy/education/");
    var http = require('http');

    var options = {
        host: 'sos1617-04.herokuapp.com',
        path: '/api/v3/export-and-import?apikey=12345'
    };

    var request = http.request(options, (response) => {
        var input = '';

        response.on('data', function(chunk) {
            input += chunk;
        });

        response.on('end', function() {
            console.log("INFO: Proxy request to /proxy/education/ completed successfully");
            res.send(input);
        });
    });

    request.on('error', function(e) {
        console.log("WARNING: New GET request to /proxy/education/ - failed to access the proxied website, sending 503...");
        res.sendStatus(503);
    });

    request.end();
});

// Gdp proxy -G04 - PRICE OF OLIVE OIL INN ANDALUSSIAN

app.get("/proxy/gdp", (req, res) => {
    console.log("INFO: New GET request to /proxy/gdp/");
    var http = require('http');

    var options = {
        host: 'sos1617-04.herokuapp.com',
        path: '/api/v2/price-stats?apikey=12345'
    };

    var request = http.request(options, (response) => {
        var input = '';

        response.on('data', function(chunk) {
            input += chunk;
        });

        response.on('end', function() {
            console.log("INFO: Proxy request to /proxy/gdp/ completed successfully");
            res.send(input);
        });
    });

    request.on('error', function(e) {
        console.log("WARNING: New GET request to /proxy/gdp/ - ERROR TRYING TO ACCESS, sending 503...");
        res.sendStatus(503);
    });

    request.end();
});

// Gdp proxy External API - Exchange Rates

app.get("/proxy/gdp", (req, res) => {
    console.log("INFO: New GET request to /proxy/gdp/");
    var http = require('http');

    var options = {
        host: 'api.fixer.io',
        path: '/latest?symbols=USD,GBP'
    };

    var request = http.request(options, (response) => {
        var input = '';

        response.on('data', function(chunk) {
            input += chunk;
        });

        response.on('end', function() {
            console.log("INFO: Proxy request to /proxy/gdp/ completed successfully");
            res.send(input);
        });
    });

    request.on('error', function(e) {
        console.log("WARNING: New GET request to /proxy/gdp/ - ERROR TRYING TO ACCESS, sending 503...");
        res.sendStatus(503);
    });

    request.end();
});

// Gdp-per-capita proxy -  G03 - Early school leavers
app.get("/proxy/gdp-per-capita", (req, res) => {
    console.log("INFO: New GET request to /proxy/gdp-per-capita/");
    var http = require('http');

    var options = {
        host: 'sos1617-03.herokuapp.com',
        path: '/api/v2/earlyleavers/?apikey=apisupersecreta'
    };

    var request = http.request(options, (response) => {
        var input = '';

        response.on('data', function(chunk) {
            input += chunk;
        });

        response.on('end', function() {
            console.log("INFO: Proxy request to /proxy/gdp-per-capita/ completed successfully");
            res.send(input);
        });
    });

    request.on('error', function(e) {
        console.log("WARNING: New GET request to /proxy/gdp-per-capita/ - failed to access the proxied website, sending 503...");
        res.sendStatus(503);
    });

    request.end();
});

//===========================================================================================================//

console.log("Proxy registered successfully");

console.log("The current date is: " + getDate());

function getDate() {

    return moment().format('MMMM Do YYYY, h:mm:ss');
}
