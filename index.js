
var moment = require("moment");
var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');
var publicFolder = path.join(__dirname, '/public');

var app = express();


var MongoClient = require('mongodb').MongoClient;
var mdbURL = "mongodb://crileaech:admin@ds133260.mlab.com:33260/sos1617-06-cle-sandbox";

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";
var dbCle;
/*
You both guy need to do exctly the same thing 
*/
//var dbJihane;
//var dbMateusz;


app.use(bodyParser.json()); 
app.use(helmet());

MongoClient.connect(mdbURL,{native_parser:true}, function(err,database){
    
    if(err){
        console.log("CAN NOT CONNECT TO DB: " +err);
        process.exit(1);
    }
    
    dbCle= database.collection("gdp");
    //dbJihane = database.collection("earlyleavers");
    //dbMateusz = database.collection("investmentseducation");
    

    app.listen(port, () => {
       console.log("Web server is listening on port" + port);
    
});

});

app.use("/",express.static(publicFolder));

//====================================CODIGO API CRISTINA==================================================================//
/*========================================Load Initial Data===============================================================*/
app.get(BASE_API_PATH + "/gdp/loadInitialData", function(request, response) {
    
    dbCle.find({}).toArray(function(err,gdp){
        
        if (err) {
            console.error('WARNING: Error while getting initial data from DB');
            return 0;
    }
    
      if (gdp.length === 0) {
        console.log('INFO: Empty DB, loading initial data');

              var gdpEducation = [{ 
                 "country": "Spain", 
                 "year": "2013", 
                 "gdp ":"1369261671179.01", 
                 "gdp_growth" :"-1.7",
                 "gdp_deflator ":"100.6"
    
                 },
                {"country": "Poland", 
                 "year": "2014",
                 "gdp ":"545158979236",
                 "gdp_growth ":"3.3",
                 "gdp_deflator ":"106.5"
    
                },
                {"country": "Morocco",
                 "year": "2015",
                 "gdp ":"100593283696.7",
                 "gdp_growth" :"4.5",
                 "gdp_deflator ":"108.9"
    
                },
                {"country": "United_Kingdom",
                 "year": "2011",
                 "gdp ":"2608995353308.8",
                 "gdp_growth" :"1.5",
                 "gdp_deflator ":"102.0"
    
                }
        ];
        
        dbCle.insert(gdpEducation);
      } else {
        console.log('INFO: DB has ' + gdp.length + 'gdpEducation');
    }
});
});

/*//Base GET
app.get("/", function (request, response) {
    console.log("INFO: Redirecting to /gdp");
    response.redirect(301, BASE_API_PATH + "/gdp");
});*/


// GET a collection
app.get(BASE_API_PATH + "/gdp", function (request, response) {
    
    console.log("INFO: New GET request to /gdp");
    dbCle.find({}).toArray(function (err, gdp) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending gdp: " + JSON.stringify(gdp, 2, null));
            response.send(gdp);
        }
    });
});

// GET a collection over a single resource

app.get(BASE_API_PATH + "/gdp/:country", function (request, response) {
    var country = request.params.country;
    if (!country) {
        console.log("WARNING: New GET request to /gdp/:country without country, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /gdp/" + country);
        dbCle.find({country:country}).toArray(function (err, gdp) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (gdp.length > 0) { 
                    var g = gdp; //since we expect to have exactly ONE gdp with this country
                    console.log("INFO: Sending gdp: " + JSON.stringify(g, 2, null));
                    response.send(g);
                } else {
                    console.log("WARNING: There are not any gdp with country " + country);
                    response.sendStatus(404); // not found
                
                }
        });
}
});


//POST a una colección

app.post(BASE_API_PATH + "/gdp", function (request, response) {
    var newGdp = request.body;
    if (!newGdp) {
        console.log("WARNING: New POST request to /gdp/ without gdp, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /gdp with body: " + JSON.stringify(newGdp, 2, null));
        if (!newGdp.country || !newGdp.year || !newGdp.gdp || !newGdp.gdp_growth || !newGdp.gdp_deflator ) {
            console.log("WARNING: The gdp " + JSON.stringify(newGdp, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbCle.find({country:newGdp.country, $and:[{year:newGdp.year}]}).toArray(function (err, gdp) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var gdpBeforeInsertion = gdp.filter((g) => {
                        return (g.country.localeCompare(g.country, "en", {'sensitivity': 'base'}) === 0);
                      
                      
                     
});

                    if (gdpBeforeInsertion.length > 0) {
                        console.log("WARNING: The gdp " + JSON.stringify(newGdp, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding gdp " + JSON.stringify(newGdp, 2, null));
                        dbCle.insert(newGdp);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//Post a un recurso (PROHIBIDO)

app.post(BASE_API_PATH + "/gdp/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    console.log("WARNING: New POST request to /country/" + country + " and year " + year + ", sending 405...");
    response.sendStatus(405); // method not allowed
});



//Put a una coleccion (Prohibido)
app.put(BASE_API_PATH + "/gdp", function (request, response) {
    console.log("WARNING: New PUT request to /gdp, sending 405...");
    response.sendStatus(405); // method not allowed
});


// Delete a un recurso concreto

app.delete(BASE_API_PATH + "/gdp/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    if (!country || !year) {
        console.log("WARNING: New DELETE request to /gdp/:country/:year without country and year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /gdp/" + country + " and year " + year);
        dbCle.remove({country:country, $and:[{year:year}]}, {}, function (err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: GDP removed: " + numRemoved);
                if (numRemoved === 1) {
                    console.log("INFO: The gdp with country " + country + "and year " + year + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no countries to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});


//PUT sobre un recurso concreto


app.put(BASE_API_PATH + "/gdp/:country/:year", function (request, response) {
    var updatedGdp = request.body;
    var country = request.params.country;
    var year = request.params.year;
    if (!updatedGdp) {
        console.log("WARNING: New PUT request to /gdp/ without result, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /gdp/" + country + " with data " + JSON.stringify(updatedGdp, 2, null));
        if (!updatedGdp.country || !updatedGdp.year || !updatedGdp.gdp || !updatedGdp.gdp_growth || !updatedGdp.gdp_deflator ) {
            console.log("WARNING: The gdp " + JSON.stringify(updatedGdp, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbCle.find({country:updatedGdp.country, $and:[{year:updatedGdp.year}]}).toArray(function (err, gdp) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else if (gdp.length > 0) {
                        dbCle.update({country: updatedGdp.country, year: updatedGdp.year}, updatedGdp);
                        console.log("INFO: Modifying gdp with country " + country + " with data " + JSON.stringify(updatedGdp, 2, null));
                        response.send(updatedGdp); // return the updated contact
                    } else {
                        console.log("WARNING: There are not any gdp with country " + country);
                        response.sendStatus(404); // not found
                    }
                }
            )}
        }
    });

//DELETE a una coleccion
app.delete(BASE_API_PATH + "/gdp", function (request, response) {
    console.log("INFO: New DELETE request to /gdp");
    dbCle.remove({}, {multi: true}, function (err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (numRemoved > 0) {
                console.log("INFO: All the gdp (" + numRemoved + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no gdp to delete");
                response.sendStatus(404); // not found
            }
        }
    });
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
