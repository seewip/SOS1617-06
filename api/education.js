var exports = module.exports = {};

// Register all the functions used in this module
exports.register = function(app, dbMd, BASE_API_PATH) {
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
    console.log("Education data REST API registered succesfully");
}
