// Authors: Cristina Leal Echevarria, Jihane Fahri, Mateusz Dominik
// Passport implementation by Mateusz Dominik

var passport = require("passport");
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Replace the line below with your own database connection
var mdbURL = "mongodb://sosuser:root@ds127153.mlab.com:27153/sos1617-06-md";
// Set the api key used on the server
var API_KEY = "secret";

var moment = require("moment");
var express = require("express");
var session = require('express-session');
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

var port = (process.env.PORT || 10000);
var BASE_API_PATH_V1 = "/api/v1";
var BASE_API_PATH_V2 = "/api/v2";
var dbCle;
var dbJf;
var dbMd;
var users;

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
app.use(session({
    secret: 'my_precious',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

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
    users = database.collection("users");

    educationAPIv1.register(app, dbMd, BASE_API_PATH_V1, checkApiKeyFunction);
    educationAPIv2.register(app, dbMd, BASE_API_PATH_V2, checkApiKeyFunction);

    gdpV1.register(app, dbCle, BASE_API_PATH_V1, checkApiKeyFunction);
    gdpV2.register(app, dbCle, BASE_API_PATH_V2, checkApiKeyFunction);

    gdp_per_capitaAPIv1.register(app, dbJf, BASE_API_PATH_V1, checkApiKeyFunction);
    gdp_per_capitaAPIv2.register(app, dbJf, BASE_API_PATH_V2, checkApiKeyFunction);

    // Configure passport authentication with google
    passport.use(new GoogleStrategy({
            clientID: "266378955954-g0l25dmnfruejkhjscd6c7a22fj3d4e4.apps.googleusercontent.com",
            clientSecret: "O0vWp3-RQASV2URX_8YpO4_l",
            // Choose a proper callback path depending on use case:
            callbackURL: "https://sos1617-06-md.herokuapp.com/auth/google/callback"
            //callbackURL: "http://localhost:10000/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            users.findOne({
                'googleId': profile.id
            }, function(err, user) {
                if (err) {
                    console.log("Err");
                    return done(err);
                }
                if (!user) {
                    users.insert({
                        googleId: profile.id,
                        token: accessToken,
                        name: profile.displayName,
                        email: profile.emails[0].value
                    }, function(err) {
                        if (err) console.log(err);
                        console.log("New user logged in: " + profile.id);
                        return done(null, {
                            googleId: profile.id,
                            token: accessToken,
                            name: profile.displayName,
                            email: profile.emails[0].value
                        });
                    });
                }
                else {
                    console.log("Returning user logged in: " + user.name);
                    return done(err, user);
                }
            });
        }
    ));

    app.listen(port, () => {
        console.log("Web server is listening on port " + port);
    });

});

app.use("/", express.static(publicFolder));

//===================================PASSPORT SUPPORT========================================================//

// 
app.get('/analytics.html', function(req, res) {
    if (req.isAuthenticated()) {
        console.log("User " + req.user.name + " has used analytics");
        var html = require('fs').readFileSync(path.join(__dirname, 'private/analytics.html'), 'utf8');
        if (html)
            res.send(html.replace('<!--loginfo-->', 'Welcome <b>' + req.user.name + "</b> (" + req.user.email + ") to analytics! "));
        else
            res.sendStatus(500);
        //res.sendFile(path.join(__dirname, 'private/analytics.html'));
    }
    else {
        console.log("Unauthenticated user tried to access analytics, redirecting to login");
        res.sendFile(path.join(__dirname, 'public/login.html'));
    }

});

app.get('/logout', function(req, res) {
    console.log("The following user has logged off: " + req.user.name);
    req.logout();
    res.redirect('/#!/analytics');
});

app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

app.get('/auth/google/callback',
    passport.authenticate('google'),
    function(req, res) {
        res.redirect('/#!/analytics');
    });

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

app.get("/proxy/education/twitter", (req, res) => {
    console.log("INFO: New GET request to /proxy/education/twitter");
    var http = require('https');

    var options = {
        host: 'api.twitter.com',
        path: '/1.1/friends/list.json?cursor=-1&screen_name=mafiu95&skip_status=true&include_user_entities=false',
        headers: {
            'Authorization': 'bearer ' + req.query.token
        }
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
        path: '/api/v3/price-stats'
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
    var http = require('https');

    var options = {
        host: 'api.fixer.io',
        path: '/latest'
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

// Gdp proxy External API - Population

app.get("/proxy/gdp", (req, res) => {
    console.log("INFO: New GET request to /proxy/gdp/");
    var http = require('http');

    var options = {
        host: 'api.population.io',
        path: '/1.0/countries'
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

// Gdp-per-capita proxy -  api2
app.get("/proxyApi2/gdp-per-capita", (req, res) => {
    console.log("INFO: New GET request to /proxy/gdp-per-capita/");
    var https = require('https');

    var options = {
        host: 'api.football-data.org',
        path: '/v1/competitions/?season=2015'
    };

    var request = https.request(options, (response) => {
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
