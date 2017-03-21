
var moment = require("moment");
var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');
var publicFolder = path.join(__dirname, '/public');

var app = express();


var MongoClient = require('mongodb').MongoClient;
var mdbURL = "mongodb://crileaech:admin@ds133260.mlab.com:33260/sos1617-06-cle-sandbox";

//var mdbURLjihane = "mongodb://jihfah:admin@ds133260.mlab.com:33260/sos1617-06-jf-sandbox"

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";
var dbCle;
var dbJf;
var dbMd;

app.use(bodyParser.json()); 
app.use(helmet());

MongoClient.connect(mdbURL,{native_parser:true}, function(err,database){
    
    if(err){
        console.log("CAN NOT CONNECT TO DB: " +err);
        process.exit(1);
    }
    
    dbCle = database.collection("gdp");
    dbJf = database.collection("gdp-per-capita");
    dbMd = database.collection("education");
    

    app.listen(port, () => {
       console.log("Web server is listening on port " + port);
    });

});

app.use("/",express.static(publicFolder));

//====================================CODIGO API MATEUSZ==================================================================//
/*========================================Load Initial Data===============================================================*/

// GET Load inital data if database is empty
app.get(BASE_API_PATH + "/education/loadInitialData", function(request, response) {
    console.log("INFO: New GET request to /education/loadInitialData");
    dbMd.find({}).count((err, count) => {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        }
        console.log("INFO: Country count: " + count);
        if (count == 0) {
            // Load inital data
            dbMd.insertMany([{
                "country": "Spain",
                "year": 2013,
                "education-gdp-perc": 4.3,
                "education-primary-per-capita": 17.9,
                "education-secondary-per-capita": 22.5,
                "education-tertiary-per-capita": 22.9
            }, {
                "country": "Poland",
                "year": 2012,
                "education-gdp-perc": 4.8,
                "education-primary-per-capita": 25.5,
                "education-secondary-per-capita": 23.8,
                "education-tertiary-per-capita": 21.3
            }, {
                "country": "Morocco",
                "year": 2009,
                "education-gdp-perc": 5.3,
                "education-primary-per-capita": 16.6,
                "education-secondary-per-capita": 30.5,
                "education-tertiary-per-capita": 81.6
            }]);
            console.log("INFO: Initial data created succesfully!");
            response.sendStatus(201); // created
        }
        else {
            // Not empty
            console.log("WARNING: Database is not empty - initial data will not be created");
            response.sendStatus(409); // conflict
        }
    });
});

// GET a collection
app.get(BASE_API_PATH + "/education", function(request, response) {
    console.log("INFO: New GET request to /education");
    dbMd.find({}).toArray(function(err, education) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: Sending education data: " + JSON.stringify(education, 2, null));
            response.send(education);
        }
    });
});


// GET a single resource
app.get(BASE_API_PATH + "/education/:country", function(request, response) {
    var name = request.params.country;
    if (!name) {
        console.log("WARNING: New GET request to /education/:country without country name, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New GET request to /education/" + name);
        dbMd.find({
            "country": name
        }).toArray(function(err, countryList) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                if (countryList.length > 0) {
                    var country = countryList[0]; //since we expect to have exactly ONE country with this name
                    console.log("INFO: Sending country: " + JSON.stringify(country, 2, null));
                    response.send(country);
                }
                else {
                    console.log("WARNING: There are not any countries with name " + name);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});


//POST over a collection
app.post(BASE_API_PATH + "/education", function(request, response) {
    var newCountry = request.body;
    if (!newCountry) {
        console.log("WARNING: New POST request to /education/ without country, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New POST request to /education with body: " + JSON.stringify(newCountry, 2, null));
        if (!newCountry["country"] || !newCountry["year"] || !newCountry["education-gdp-perc"] || !newCountry["education-primary-per-capita"] || !newCountry["education-secondary-per-capita"] || !newCountry["education-tertiary-per-capita"]) {
            console.log("WARNING: The country " + JSON.stringify(newCountry, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbMd.find({}).toArray(function(err, country) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var countriesBeforeInsertion = country.filter((countryEntity) => {
                        return (countryEntity.country.localeCompare(newCountry.country, "en", {
                            'sensitivity': 'base'
                        }) === 0);
                    });
                    if (countriesBeforeInsertion.length > 0) {
                        console.log("WARNING: The country " + JSON.stringify(newCountry, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    }
                    else {
                        console.log("INFO: Adding country " + JSON.stringify(newCountry, 2, null));
                        dbMd.insert(newCountry);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//POST over a single resource
app.post(BASE_API_PATH + "/education/:country", function(request, response) {
    var name = request.params.country;
    console.log("WARNING: New POST request to /education/" + name + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a collection
app.put(BASE_API_PATH + "/education", function(request, response) {
    console.log("WARNING: New PUT request to /education, sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a single resource
app.put(BASE_API_PATH + "/education/:country", function(request, response) {
    var newCountry = request.body;
    var nameParam = request.params.country;
    if (!newCountry) {
        console.log("WARNING: New PUT request to /education/ without country, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New PUT request to /education/" + nameParam + " with data " + JSON.stringify(newCountry, 2, null));
        if (!newCountry["country"] || !newCountry["year"] || !newCountry["education-gdp-perc"] || !newCountry["education-primary-per-capita"] || !newCountry["education-secondary-per-capita"] || !newCountry["education-tertiary-per-capita"]) {
            console.log("WARNING: The country " + JSON.stringify(newCountry, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbMd.find({
                country: nameParam
            }).toArray(function(err, countries) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    if (countries.length > 0) {
                        dbMd.update({
                            country: nameParam
                        }, newCountry);
                        console.log("INFO: Modifying country with name " + nameParam + " with data " + JSON.stringify(newCountry, 2, null));
                        response.send(newCountry); // return the updated contact
                    }
                    else {
                        console.log("WARNING: There are not any countries with name " + nameParam);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});


//DELETE over a collection
app.delete(BASE_API_PATH + "/education", function(request, response) {
    console.log("INFO: New DELETE request to /education");
    dbMd.remove({}, {
        justOne: false
    }, function(err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        }
        else {
            if (numRemoved.result.n > 0) {
                console.log("INFO: All the countries (" + numRemoved.result.n + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            }
            else {
                console.log("WARNING: There are no countries to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/education/:country", function(request, response) {
    var name = request.params.country;
    if (!name) {
        console.log("WARNING: New DELETE request to /education/:country without country name, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New DELETE request to /education/" + name);
        dbMd.remove({
            country: name
        }, {}, function(err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                console.log("INFO: Countries removed: " + numRemoved.result.n);
                if (numRemoved.result.n === 1) {
                    console.log("INFO: The country with name " + name + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                }
                else {
                    console.log("WARNING: There are no countries to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

//====================================CODIGO API CRISTINA==================================================================//
/*========================================Load Initial Data===============================================================*/
app.get(BASE_API_PATH + "/gdp/loadInitialData", function(req, res) {
    dbCle.find({}).toArray(function(err, gdp) {
        if (err) {
            console.error('WARNING: Error while getting initial data from DB');
            return 0;
        }
        if (gdp.length === 0) {
            var initialGdp = [{ 
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
            dbCle.insert(initialGdp);
            console.log("Date insert in db");
            res.sendStatus(201, BASE_API_PATH + "/");
        }
        else {
            console.log("DB not empty")
        }
    });
});

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

//====================================CODIGO API Jihane==================================================================//
/*========================================Load Initial Data===============================================================*/
app.get(BASE_API_PATH + "/gdp-per-capita/loadInitialData", function(request, response) {
    
    dbJf.find({}).toArray(function(err, gdp_per_capita){
        
        if (err) {
            console.error('WARNING: Error while getting initial data from DB');
            return 0;
    }
    
      if (gdp_per_capita.length === 0) {
        console.log('INFO: Empty DB, loading initial data');

              var gdp_per_capitaEd = [
                {
                 "country": "spain",
                 "year": "2015",
                 "gdp-per-capita-growth": "3.4",
                 "gdp-per-capita": "25831.60 ",
                 "gdp-per-capita-ppp": "34906.40 "
                },
                {
                 "country ": "poland",
                 "year": "2015",
                 "gdp-per-capita-growth": "4",
                 "gdp-per-capita": "12554.50",
                 "gdp-per-capita-ppp": "26862.30 "
                },
                {
                 "country": "morocco",
                 "year": "2015",
                 "gdp-per-capita-growth": "3.1",
                 "gdp-per-capita": "2878.20",
                 "gdp-per-capita-ppp": "7841.50 "
                }
              ];

        
        dbJf.insert(gdp_per_capitaEd);
      } else {
        console.log('INFO: DB has ' + gdp_per_capita.length + 'gdp-per-capitaEd');
    }
});
});




// GET a collection
app.get(BASE_API_PATH + "/gdp-per-capita", function (request, response) {
    
    console.log("INFO: New GET request to /gdp-per-capita");
    dbJf.find({}).toArray(function (err, gdp_per_capita) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending gdp-per-capita: " + JSON.stringify(gdp_per_capita, 2, null));
            response.send(gdp_per_capita);
        }
    });
});

// GET a collection over a single resource

app.get(BASE_API_PATH + "/gdp-per-capita/:country", function (request, response) {
    var country = request.params.country;
    if (!country) {
        console.log("WARNING: New GET request to /gdp-per-capita/:country without country, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /gdp-per-capita/" + country);
        dbJf.find({country:country}).toArray(function (err, gdp_per_capita) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (gdp_per_capita.length > 0) { 
                    var gpc = gdp_per_capita; //since we expect to have exactly ONE gdp with this country
                    console.log("INFO: Sending gdp: " + JSON.stringify(gpc, 2, null));
                    response.send(gpc);
                } else {
                    console.log("WARNING: There are not any gdp-per-capita with country " + country);
                    response.sendStatus(404); // not found
                
                }
        });
}
});


//POST a una colección

app.post(BASE_API_PATH + "/gdp-per-capita", function (request, response) {
    var newGdpPerCapita = request.body;
    if (!newGdpPerCapita) {
        console.log("WARNING: New POST request to /gdp-per-capita/ without gdp-per-capita, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /gdp-per-capita with body: " + JSON.stringify(newGdpPerCapita, 2, null));
        if (!newGdpPerCapita.country || !newGdpPerCapita.year || !newGdpPerCapita.gdp_per_capita_growth || !newGdpPerCapita.gdp_per_capita || !newGdpPerCapita.gdp_per_capita_ppp ) {
            console.log("WARNING: The gdp-per-capita " + JSON.stringify(newGdpPerCapita, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbJf.find({country:newGdpPerCapita.country, $and:[{year:newGdpPerCapita.year}]}).toArray(function (err, gdp_per_capita) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var gpcBeforeInsertion = gdp_per_capita.filter((gpc) => {
                        return (gpc.country.localeCompare(gpc.country, "en", {'sensitivity': 'base'}) === 0);
                      
                      
                     
});

                    if (gpcBeforeInsertion.length > 0) {
                        console.log("WARNING: The gdp-per-capita " + JSON.stringify(newGdpPerCapita, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding gdp-per-capita " + JSON.stringify(newGdpPerCapita, 2, null));
                        dbJf.insert(newGdpPerCapita);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//Post a un recurso (PROHIBIDO)

app.post(BASE_API_PATH + "/gdp-per-capita/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    console.log("WARNING: New POST request to /country/" + country + " and year " + year + ", sending 405...");
    response.sendStatus(405); // method not allowed
});



//Put a una coleccion (Prohibido)
app.put(BASE_API_PATH + "/gdp-per-capita", function (request, response) {
    console.log("WARNING: New PUT request to /gdp-per-capita, sending 405...");
    response.sendStatus(405); // method not allowed
});


// Delete a un recurso concreto

app.delete(BASE_API_PATH + "/gdp-per-capita/:country/:year", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    if (!country || !year) {
        console.log("WARNING: New DELETE request to /gdp-per-capita/:country/:year without country and year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /gdp-per-capita/" + country + " and year " + year);
        dbJf.remove({country:country, $and:[{year:year}]}, {}, function (err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: GDPPC removed: " + numRemoved);
                if (numRemoved === 1) {
                    console.log("INFO: The gdp-per-capita with country " + country + "and year " + year + " has been succesfully deleted, sending 204...");
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


app.put(BASE_API_PATH + "/gdp-per-capita/:country/:year", function (request, response) {
    var updatedGdpPerCapita = request.body;
    var country = request.params.country;
    var year = request.params.year;
    if (!updatedGdpPerCapita) {
        console.log("WARNING: New PUT request to /gdp-per-capita/ without result, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /gdp-per-capita/" + country + " with data " + JSON.stringify(updatedGdpPerCapita, 2, null));
        if (!updatedGdpPerCapita.country || !updatedGdpPerCapita.year || !updatedGdpPerCapita.gdp_per_capita_growth || !updatedGdpPerCapita.gdp_per_capita || !updatedGdpPerCapita.gdp_per_capita_ppp ) {
            console.log("WARNING: The gdp-per-capita " + JSON.stringify(updatedGdpPerCapita, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbJf.find({country:updatedGdpPerCapita.country, $and:[{year:updatedGdpPerCapita.year}]}).toArray(function (err, gdp_per_capita) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else if (gdp_per_capita.length > 0) {
                        dbJf.update({country: updatedGdpPerCapita.country, year: updatedGdpPerCapita.year}, updatedGdpPerCapita);
                        console.log("INFO: Modifying gdp-per-capita with country " + country + " with data " + JSON.stringify(updatedGdpPerCapita, 2, null));
                        response.send(updatedGdpPerCapita); // return the updated contact
                    } else {
                        console.log("WARNING: There are not any gdp-per-capita with country " + country);
                        response.sendStatus(404); // not found
                    }
                }
            )}
        }
    });

//DELETE a una coleccion
app.delete(BASE_API_PATH + "/gdp-per-capita", function (request, response) {
    console.log("INFO: New DELETE request to /gdp-per-capita");
    dbJf.remove({}, {multi: true}, function (err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (numRemoved > 0) {
                console.log("INFO: All the gdp-per-capita (" + numRemoved + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no gdp-per-capita to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});

console.log("The current date is: " + getDate());

function getDate() {
   
    return moment().format('MMMM Do YYYY, h:mm:ss');
}
