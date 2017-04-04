var exports = module.exports = {};

// Register all the functions used in this module

exports.register = function(app, dbJf, BASE_API_PATH, checkApiKeyFunction) {
    
    var insertSearchFields = function(request, query) {
        var q;
        if(request.query[q = "gdp-per-capita-growth"] && !isNaN(request.query[q])) query[q] = Number(request.query[q]);
        if(request.query[q = "gdp-per-capita"] && !isNaN(request.query[q])) query[q] = Number(request.query[q]);
        if(request.query[q = "gdp-per-capita-ppp"] && !isNaN(request.query[q])) query[q] = Number(request.query[q]);
        return query;
    };
    
    
    // GET load initial data if dataabase is empty
    app.get(BASE_API_PATH + "/gdp-per-capita/loadInitialData", function(request, response) {
        console.log("INFO: New GET request to /gdp_per_capita/loadInitialData");
        if (!checkApiKeyFunction(request, response)) return;
        
        dbJf.find({}).toArray(function(err, gdp_per_capita){
            if (err) {
                console.error('WARNING: Error while getting initial data from DB');
                response.sendStatus(500);
            }
            console.log("INFO: Country gdp_per_capita: " + gdp_per_capita);
            
            if (gdp_per_capita.length === 0) {
                var gdp_per_capitaEd = [{
                    "country": "spain",
                    "year": "2015",
                    "gdp-per-capita-growth": "3.4",
                    "gdp-per-capita": "25831.60",
                    "gdp-per-capita-ppp": "34906.40"
                },
                {
                 "country": "poland",
                 "year": "2015",
                 "gdp-per-capita-growth": "4",
                 "gdp-per-capita": "12554.50",
                 "gdp-per-capita-ppp": "26862.30"
                },
                {
                 "country": "morocco",
                 "year": "2015",
                 "gdp-per-capita-growth": "3.1",
                 "gdp-per-capita": "2878.20",
                 "gdp-per-capita-ppp": "7841.50"
                }
              ];
                console.log("INFO: Initial data created succesfully!");
                
                dbJf.insert(gdp_per_capitaEd);
                response.sendStatus(201);//created
        
            } else {
                console.log('INFO: DB has ' + gdp_per_capita.length + 'gdp-per-capitaEd');
                response.sendStatus(409);//conflict
            }
    });

});




// GET a collection
app.get(BASE_API_PATH + "/gdp-per-capita", function (request, response) {
    
    console.log("INFO: New GET request to /gdp-per-capita");
    if (!checkApiKeyFunction(request, response)) {return;}
    var query = insertSearchFields(request, {});
    dbJf.find({}).toArray(function (err, gdp_per_capita) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            // Pagination
            if (request.query.offset && !isNaN(request.query.offset)) {
                     if (!(request.query.limit && !isNaN(request.query.limit))) request.query.limit = gdp_per_capita.length;
                     gdp_per_capita = gdp_per_capita.slice(Number(request.query.offset), Number(request.query.limit) + Number(request.query.offset));
 
            }
            console.log("INFO: Sending gdp-per-capita: " + JSON.stringify(gdp_per_capita, 2, null));
            response.send(gdp_per_capita);
        }
    });
});

// GET a collection over a single resource - country/year

app.get(BASE_API_PATH + "/gdp-per-capita/:country", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    var country = request.params.country;
    var year = request.params.year;
    var queryYear = insertSearchFields(request, {
        year:Number(year)
    });
    var queryCountry = insertSearchFields(request, {
        country: country
    });
    if (isNaN(request.params.year.charAt(0))){
        if (!country) {
            console.log("WARNING: New GET request to /gdp-per-capita/:country without country, sending 400...");
            response.sendStatus(400); // bad request
        } else {
            console.log("INFO: New GET request to /gdp-per-capita/" + country);
            dbJf.find(queryCountry).toArray(function (err, results) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else if (results.length > 0) { 
                    // Pagination
                    if (request.query.offset && !isNaN(request.query.offset)) {
                        if (!(request.query.limit && !isNaN(request.query.limit))) request.query.limit = results.length;
                            results = results.slice(Number(request.query.offset), Number(request.query.limit) + Number(request.query.offset));
                        }
                    var gpc = results; //since we expect to have exactly ONE gdp with this country
                    console.log("INFO: Sending gdp_per_capita: " + JSON.stringify(gpc, 2, null));
                    response.send(gpc);
                } else {
                    console.log("WARNING: There are not any gdp-per-capita with country " + country);
                    response.sendStatus(404); // not found
                
                }
            });
        }
    } else {
        /*if (!year) {
                 console.log("WARNING: New GET request to /gdp-per-capita/:year without year, sending 400...");
                 response.sendStatus(400); // bad request
             }else {
                 console.log("INFO: New GET request to /gdp-per-capita/" + year);*/
                 dbJf.find(queryYear).toArray(function(err, results) {
                     if (err) {
                         console.error('WARNING: Error getting data from DB');
                         response.sendStatus(500); // internal server error
                     }else if (results.length > 0) {
                         // Pagination
                         if (request.query.offset && !isNaN(request.query.offset)) {
                                if (!(request.query.limit && !isNaN(request.query.limit))) request.query.limit = results.length;
                                results = results.slice(Number(request.query.offset), Number(request.query.limit) + Number(request.query.offset));
                            }
                         var gpc = results; //since we expect to have exactly ONE contact with this name
                         console.log("INFO: Sending result: " + JSON.stringify(gpc, 2, null));
                         response.send(gpc);
                     }else {
                         console.log("WARNING: There are not any result with year " + year);
                         response.sendStatus(404); // not found
 
                     }
                 
             });     
        }            
    }
);


//GET to specify resource
 
     app.get(BASE_API_PATH + "/gdp-per-capita/:country/:year", function(request, response) {
         if (!checkApiKeyFunction(request, response)) return;
         var country = request.params.country;
         var year = request.params.year;
         var query = insertSearchFields(request, {
            country: country,
            year: Number(year)
        });
         if (!country || !year) {
             console.log("WARNING: New GET request to /gdp-per-capita/:country without name or without year, sending 400...");
             response.sendStatus(400); // bad request
         }
         else {
             console.log("INFO: New GET request to /gdp-per-capita/" + country + "/" + year);
             dbJf.find(query).toArray(function(err, results) {
                 if (err) {
                     console.error('WARNING: Error getting data from DB');
                     response.sendStatus(500); // internal server error
                 }
                 else if (results.length > 0) {
                     var gpc = results[0]; //since we expect to have exactly ONE contact with this name
                     console.log("INFO: Sending result: " + JSON.stringify(gpc, 2, null));
                     response.send(gpc);
                 }
                 else {
                     console.log("WARNING: There are not any country with name " + country + "and year " + year);
                     response.sendStatus(404); // not found
 
                 }
             });
         }
     });


//POST a una colección

app.post(BASE_API_PATH + "/gdp-per-capita", function (request, response) {
    if (!checkApiKeyFunction(request,response)) return;
    var newGdpPerCapita = request.body;
    if (!newGdpPerCapita) {
        console.log("WARNING: New POST request to /gdp-per-capita/ without gdp-per-capita, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /gdp-per-capita with body: " + JSON.stringify(newGdpPerCapita, 2, null));
        if (!newGdpPerCapita["country"] || !newGdpPerCapita["year"] || !newGdpPerCapita["gdp-per-capita-growth"] || !newGdpPerCapita["gdp-per-capita"] || !newGdpPerCapita[ "gdp-per-capita-ppp"] || isNaN(newGdpPerCapita["year"]) || isNaN(newGdpPerCapita["gdp-per-capita-growth"]) || isNaN(newGdpPerCapita["gdp-per-capita"]) || isNaN(newGdpPerCapita[ "gdp-per-capita-ppp"])) {
            console.log("WARNING: The gdp-per-capita " + JSON.stringify(newGdpPerCapita, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            newGdpPerCapita["year"] = Number(newGdpPerCapita["year"]);
            newGdpPerCapita["gdp-per-capita-growth"] = Number(newGdpPerCapita["gdp-per-capita-growth"]);
            newGdpPerCapita["gdp-per-capita"] = Number(newGdpPerCapita["gdp-per-capita"]);
            newGdpPerCapita[ "gdp-per-capita-ppp"] = Number(newGdpPerCapita[ "gdp-per-capita-ppp"]);
            dbJf.find({}).toArray(function (err, gdp_per_capita) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var gpcBeforeInsertion = gdp_per_capita.filter((gpc) => {
                        return (gpc.country.localeCompare(newGdpPerCapita.country, "en", {'sensitivity': 'base'}) === 0);
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

app.post(BASE_API_PATH + "/gdp-per-capita/:country", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    var country = request.params.country;
    console.log("WARNING: New POST request to /country/" + country + ", sending 405...");
    response.sendStatus(405); // method not allowed
});



//Put a una coleccion (Prohibido)
app.put(BASE_API_PATH + "/gdp-per-capita", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    console.log("WARNING: New PUT request to /gdp-per-capita, sending 405...");
    response.sendStatus(405); // method not allowed
});


// Delete a un recurso concreto

app.delete(BASE_API_PATH + "/gdp-per-capita/:country/:year", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    var country = request.params.country;
    var year = request.params.year;
    if (!country || !year) {
        console.log("WARNING: New DELETE request to /gdp-per-capita/:country/:year without country or year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /gdp-per-capita/" + country);
        dbJf.remove({country:country, year: Number(year)},{},function (err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: GDPPC removed: " + numRemoved.result.n);
                if (numRemoved.result.n === 1) {
                    console.log("INFO: The gdp-per-capita with country " + country + "and year " + year + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else if (numRemoved.result.n === 0){
                    console.log("WARNING: There are no countries to delete");
                    response.sendStatus(404); // not found
               } else {
                   console.log("INFO: gdp-per-capita with country " + country + " and year " + year + " has been succesfully deleted, sending 204...")
                   response.sendStatus(204); // no content
               } 
            }
        });
    }
});


//PUT sobre un recurso concreto


app.put(BASE_API_PATH + "/gdp-per-capita/:country/:year", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    var updatedGdpPerCapita = request.body;
    var country = request.params.country;
    var year = request.params.year;
    if (!updatedGdpPerCapita) {
        console.log("WARNING: New PUT request to /gdp-per-capita/ without result, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /gdp-per-capita/" + country + " with data " + JSON.stringify(updatedGdpPerCapita, 2, null));
        if (!updatedGdpPerCapita.country || !updatedGdpPerCapita.year || !updatedGdpPerCapita.gdp_per_capita_growth || !updatedGdpPerCapita.gdp_per_capita || !updatedGdpPerCapita.gdp_per_capita_ppp || updatedGdpPerCapita.year !== year || updatedGdpPerCapita.country !== country) {
            console.log("WARNING: The gdp-per-capita " + JSON.stringify(updatedGdpPerCapita, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(400); // bad request
        } else {
            updatedGdpPerCapita["year"] = Number(updatedGdpPerCapita["year"]);
            updatedGdpPerCapita["gdp-per-capita-growth"] = Number(updatedGdpPerCapita["gdp-per-capita-growth"]);
            updatedGdpPerCapita["gdp-per-capita"] = Number(updatedGdpPerCapita["gdp-per-capita"]);
            updatedGdpPerCapita[ "gdp-per-capita-ppp"] = Number(updatedGdpPerCapita[ "gdp-per-capita-ppp"]);
            
            dbJf.find({country:updatedGdpPerCapita.country,year:Number(updatedGdpPerCapita.year)}).toArray(function (err, gdp_per_capita) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else if (gdp_per_capita.length > 0) {
                        dbJf.update({country: updatedGdpPerCapita.country, year: Number(updatedGdpPerCapita.year)}, updatedGdpPerCapita);
                        console.log("INFO: Modifying gdp-per-capita with country " + country + " with data " + JSON.stringify(updatedGdpPerCapita, 2, null));
                        response.send(updatedGdpPerCapita); // return the updated contact
                    } else {
                        console.log("WARNING: There are not any gdp-per-capita with country " + country);
                        response.sendStatus(404); // not found
                    }
                }
            )};
        }
});

//DELETE a una coleccion
app.delete(BASE_API_PATH + "/gdp-per-capita", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    console.log("INFO: New DELETE request to /gdp-per-capita");
    dbJf.remove({}, {justOne: false}, function (err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (numRemoved.result.n > 0) {
                console.log("INFO: All the gdp-per-capita (" + numRemoved.result.n + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no gdp-per-capita to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});
console.log("Education data REST API registered succesfully");
};