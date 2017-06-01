var exports = module.exports = {};

// Register all the functions used in this module

exports.register = function(app, dbJf, BASE_API_PATH, checkApiKeyFunction) {

    var insertSearchFields = function(request, query) {
        var q;
       // if (request.query[q = "country"] && !isNaN(request.query[q])) query[q] = Number(request.query[q]);
       // if (request.query[q = "year"] && !isNaN(request.query[q])) query[q] = Number(request.query[q]);
        if (request.query[q = "gdp-per-capita-growth"] && !isNaN(request.query[q])) query[q] = Number(request.query[q]);
        if (request.query[q = "gdp-per-capita"] && !isNaN(request.query[q])) query[q] = Number(request.query[q]);
        if (request.query[q = "gdp-per-capita-ppp"] && !isNaN(request.query[q])) query[q] = Number(request.query[q]);
        return query;
    };


    // GET load initial data if dataabase is empty
    app.get(BASE_API_PATH + "/gdp-per-capita/loadInitialData", function(request, response) {
        console.log("INFO: New GET request to /gdp_per_capita/loadInitialData");
        if (!checkApiKeyFunction(request, response)) return;

        dbJf.find({}).toArray(function(err, gdp_per_capita) {
            if (err) {
                console.error('WARNING: Error while getting initial data from DB');
                response.sendStatus(500);
            }
            console.log("INFO: Country gdp_per_capita: " + gdp_per_capita);

            if (gdp_per_capita.length === 0) {
                var gdp_per_capitaEd = [{
                    "country": "spain",
                    "year": 2015,
                    "gdp-per-capita-growth": 3.4,
                    "gdp-per-capita": 25831.60,
                    "gdp-per-capita-ppp": 34906.40
                }, {
                    "country": "poland",
                    "year": 2015,
                    "gdp-per-capita-growth": 4,
                    "gdp-per-capita": 30.50,
                    "gdp-per-capita-ppp": 26862.30
                }, {
                    "country": "morocco",
                    "year": 2015,
                    "gdp-per-capita-growth": 3.1,
                    "gdp-per-capita": 2878.20,
                    "gdp-per-capita-ppp": 7841.50
                }];
                console.log("INFO: Initial data created succesfully!");

                dbJf.insert(gdp_per_capitaEd);
                response.sendStatus(201); //created

            }
            else {
                console.log('INFO: DB has ' + gdp_per_capita.length + 'gdp-per-capitaEd');
                response.sendStatus(409); //conflict
            }
        });

    });




    // GET a collection
    app.get(BASE_API_PATH + "/gdp-per-capita", function(request, response) {

        console.log("INFO: New GET request to /gdp-per-capita");
        if (!checkApiKeyFunction(request, response)) {
            return;
        }
        var query = insertSearchFields(request, {});
        dbJf.find(query).toArray(function(err, gdp_per_capita) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                // Pagination
                if (request.query.offset && !isNaN(request.query.offset)) {
                    if (!(request.query.limit && !isNaN(request.query.limit))) request.query.limit = gdp_per_capita.length;
                    gdp_per_capita = gdp_per_capita.slice(Number(request.query.offset), Number(request.query.limit) + Number(request.query.offset));

                }
                console.log("INFO: Sending gdp-per-capita data: " + JSON.stringify(gdp_per_capita, 2, null));
                response.send(gdp_per_capita);
            }
        });
    });

    // GET a collection over a single resource - country/year

    app.get(BASE_API_PATH + "/gdp-per-capita/:country", function(request, response) {
        if (!checkApiKeyFunction(request, response)) return;
        var name = request.params.country;
        var queryName = insertSearchFields(request, {
            country: name
        });
        var queryYear = insertSearchFields(request, {
            year: Number(name)
        });
        if (!name) {
            console.log("WARNING: New GET request to /gdp-per-capita/:country without country name, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New GET request to /gdp-per-capita/" + name);

            if (!isNaN(name)) {
                dbJf.find(queryYear).toArray(function(err, countryList) {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        if (countryList.length > 0) {
                            // Pagination
                            if (request.query.offset && !isNaN(request.query.offset)) {
                                if (!(request.query.limit && !isNaN(request.query.limit))) request.query.limit = countryList.length;
                                countryList = countryList.slice(Number(request.query.offset), Number(request.query.limit) + Number(request.query.offset));
                            }
                            console.log("INFO: Sending countries: " + JSON.stringify(countryList, 2, null));
                            response.send(countryList);
                        }
                        else {
                            console.log("WARNING: There are not any countries with year " + name);
                            response.sendStatus(404); // not found
                        }
                    }
                });
            }
            else {
                dbJf.find(queryName).toArray(function(err, countryList) {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        if (countryList.length > 0) {
                            // Pagination
                            if (request.query.offset && !isNaN(request.query.offset)) {
                                if (!(request.query.limit && !isNaN(request.query.limit))) request.query.limit = countryList.length;
                                countryList = countryList.slice(Number(request.query.offset), Number(request.query.limit) + Number(request.query.offset));
                            }
                            console.log("INFO: Sending countries: " + JSON.stringify(countryList, 2, null));
                            response.send(countryList);
                        }
                        else {
                            console.log("WARNING: There are not any countries with name " + name);
                            response.sendStatus(404); // not found
                        }
                    }
                });
            }
        }
    });


    //GET to specify resource

    app.get(BASE_API_PATH + "/gdp-per-capita/:country/:year", function(request, response) {
        if (!checkApiKeyFunction(request, response)) return;
        var name = request.params.country;
        var year = request.params.year;
        var query = insertSearchFields(request, {
            country: name,
            year: Number(year)
        });
        if (!name || !year) {
            console.log("WARNING: New GET request to /gdp-per-capita/:country/:year without country name or year, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New GET request to /gdp-per-capita/" + name + "/" + year);
            dbJf.find(query).toArray(function(err, countryList) {
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

    //POST a una colección

    app.post(BASE_API_PATH + "/gdp-per-capita", function(request, response) {
        if (!checkApiKeyFunction(request, response)) return;
        var newGdpPerCapita = request.body;
        if (!newGdpPerCapita) {
            console.log("WARNING: New POST request to /gdp-per-capita/ without gdp-per-capita, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New POST request to /gdp-per-capita with body: " + JSON.stringify(newGdpPerCapita, 2, null));
            if (!newGdpPerCapita["country"] || !newGdpPerCapita["year"] || !newGdpPerCapita["gdp-per-capita-growth"] || !newGdpPerCapita["gdp-per-capita"] || !newGdpPerCapita["gdp-per-capita-ppp"] || isNaN(newGdpPerCapita["year"]) || isNaN(newGdpPerCapita["gdp-per-capita-growth"]) || isNaN(newGdpPerCapita["gdp-per-capita"]) || isNaN(newGdpPerCapita["gdp-per-capita-ppp"])) {
                console.log("WARNING: The gdp-per-capita " + JSON.stringify(newGdpPerCapita, 2, null) + " is not well-formed, sending 422...");
                response.sendStatus(422); // unprocessable entity
            }
            else {
                newGdpPerCapita["year"] = Number(newGdpPerCapita["year"]);
                newGdpPerCapita["gdp-per-capita-growth"] = Number(newGdpPerCapita["gdp-per-capita-growth"]);
                newGdpPerCapita["gdp-per-capita"] = Number(newGdpPerCapita["gdp-per-capita"]);
                newGdpPerCapita["gdp-per-capita-ppp"] = Number(newGdpPerCapita["gdp-per-capita-ppp"]);
                dbJf.find({
                    country: newGdpPerCapita.country,
                    year: newGdpPerCapita.year
                }).toArray(function(err, country) {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        var gpcBeforeInsertion = country.filter((gpc) => {
                            return (gpc.country.localeCompare(newGdpPerCapita.country, "en", {
                                'sensitivity': 'base'
                            }) === 0);
                        });

                        if (gpcBeforeInsertion.length > 0) {
                            console.log("WARNING: The country " + JSON.stringify(newGdpPerCapita, 2, null) + " already extis, sending 409...");
                            response.sendStatus(409); // conflict
                        }
                        else {
                            console.log("INFO: Adding country " + JSON.stringify(newGdpPerCapita, 2, null));
                            dbJf.insert(newGdpPerCapita);
                            response.sendStatus(201); // created
                        }
                    }
                });
            }
        }
    });


    //Post a un recurso (PROHIBIDO)

    app.post(BASE_API_PATH + "/gdp-per-capita/:country", function(request, response) {
        if (!checkApiKeyFunction(request, response)) return;
        var country = request.params.country;
        console.log("WARNING: New POST request to /country/" + country + ", sending 405...");
        response.sendStatus(405); // method not allowed
    });



    //Put a una coleccion (Prohibido)
    app.put(BASE_API_PATH + "/gdp-per-capita", function(request, response) {
        if (!checkApiKeyFunction(request, response)) return;
        console.log("WARNING: New PUT request to /gdp-per-capita, sending 405...");
        response.sendStatus(405); // method not allowed
    });


    // Delete a un recurso concreto

    app.delete(BASE_API_PATH + "/gdp-per-capita/:country/:year", function(request, response) {
        if (!checkApiKeyFunction(request, response)) return;
        var name = request.params.country;
        var year = request.params.year;
        if (!name || !year) {
            console.log("WARNING: New DELETE request to /gdp-per-capita/:country/:year without country or year, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New DELETE request to /gdp-per-capita/" + name + " and year " + year);
            dbJf.remove({
                country: name,
                year: Number(year)
            }, {}, function(err, numRemoved) {
                if (err) {
                    console.error('WARNING: Error removing data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    console.log("INFO: GDPPC removed: " + numRemoved.result.n);
                    if (numRemoved.result.n === 1) {
                        console.log("INFO: The gdp-per-capita with name " + name + "and year " + year + " has been succesfully deleted, sending 204...");
                        response.sendStatus(200); 
                    }
                    else /*if (numRemoved.result.n === 0) */{
                        console.log("WARNING: There are no countries to delete");
                        response.sendStatus(404); // not found
                    }
                    /*else {
                        console.log("INFO: gdp-per-capita with name " + name + " and year " + year + " has been succesfully deleted, sending 204...")
                        response.sendStatus(204); // no content
                    }*/
                }
            });
        }
    });


    //PUT sobre un recurso concreto
    app.put(BASE_API_PATH + "/gdp-per-capita/:country/:year", function(request, response) {
        console.log("BODY: " + JSON.stringify(request.body, null, 2));
        //A
        console.log("A");
        if (!checkApiKeyFunction(request, response)) return;
        var newGdpPerCapita = request.body;
        var nameParam = request.params.country;
        var yearParam = request.params.year;
        if (!newGdpPerCapita || nameParam !== newGdpPerCapita.country) {
            if(!newGdpPerCapita){
                console.log("WARNING: New PUT request to /gdp-per-capita/ without country, sending 400...");
            }else{
                console.log("WARNING: New PUT request to /gdp-per-capita/ con un país poniendole la url de otro país, sending 400...");
            //B
            console.log("B");
            }
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New PUT request to /gdp-per-capita/" + nameParam + "/" + yearParam + " with data " + JSON.stringify(newGdpPerCapita, 2, null));
            if (!newGdpPerCapita["country"] || !newGdpPerCapita["year"] || !newGdpPerCapita["gdp-per-capita-growth"] || !newGdpPerCapita["gdp-per-capita"] || !newGdpPerCapita["gdp-per-capita-ppp"] || isNaN(newGdpPerCapita["year"]) || isNaN(newGdpPerCapita["gdp-per-capita-growth"]) || isNaN(newGdpPerCapita["gdp-per-capita"]) || isNaN(newGdpPerCapita["gdp-per-capita-ppp"])) {
                console.log("WARNING: The gdp-per-capita " + JSON.stringify(newGdpPerCapita, 2, null) + " is not well-formed, sending 422...");
               //C
               console.log("C");
                response.sendStatus(422); // unprocessable entity
            }
            else {
                //D
                console.log("D");
                // Make sure that numeric fields are a number object
               newGdpPerCapita["year"] = Number(newGdpPerCapita["year"]);
                newGdpPerCapita["gdp-per-capita-growth"] = Number(newGdpPerCapita["gdp-per-capita-growth"]);
                newGdpPerCapita["gdp-per-capita"] = Number(newGdpPerCapita["gdp-per-capita"]);
                newGdpPerCapita["gdp-per-capita-ppp"] = Number(newGdpPerCapita["gdp-per-capita-ppp"]);
                dbJf.find({
                    country: nameParam,
                    year: Number(yearParam)
                }).toArray(function(err, countries) {
                    //E
                    console.log("E");
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        //F
                        console.log("F");
                        if (countries.length > 0) {
                            dbJf.update({
                                country: nameParam,
                                year: Number(yearParam)
                            }, newGdpPerCapita);
                            console.log("INFO: Modifying country with name " + nameParam + " and year " + yearParam + " with data " + JSON.stringify(newGdpPerCapita, 2, null));
                           //G
                           console.log("G");
                            response.send(newGdpPerCapita); // return the updated contact
                            //H
                            console.log("H");
                        }
                        else {
                            console.log("WARNING: There are not any countries with name " + nameParam + " and year " + yearParam);
                            response.sendStatus(404); // not found
                        }
                        //I
                        console.log("I");
                    }
                });
                //J
                console.log("J");
            }
        }
        //K
        console.log("K");
    });

    //DELETE a una coleccion
    app.delete(BASE_API_PATH + "/gdp-per-capita", function(request, response) {
        if (!checkApiKeyFunction(request, response)) return;
        console.log("INFO: New DELETE request to /gdp-per-capita");
        dbJf.remove({}, {
            justOne: false
        }, function(err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                if (numRemoved.result.n > 0) {
                    console.log("INFO: All the gdp-per-capita (" + numRemoved.result.n + ") have been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                }
                else {
                    console.log("WARNING: There are no gdp-per-capita to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    });
    console.log("Gdp-per-capita data REST API v1 registered succesfully");
};
