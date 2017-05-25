var exports = module.exports = {};

// Register all the functions used in this module
exports.register = function(app, dbMd, BASE_API_PATH, checkApiKeyFunction) {

    var insertSearchFields = function(request, query) {
        var q;
        if (request.query[q = "education-gdp-perc"] && !isNaN(request.query[q])) query[q] = Number(request.query[q]);
        if (request.query[q = "education-primary-per-capita"] && !isNaN(request.query[q])) query[q] = Number(request.query[q]);
        if (request.query[q = "education-secondary-per-capita"] && !isNaN(request.query[q])) query[q] = Number(request.query[q]);
        if (request.query[q = "education-tertiary-per-capita"] && !isNaN(request.query[q])) query[q] = Number(request.query[q]);
        return query;
    };

    // GET Load inital data if database is empty
    app.get(BASE_API_PATH + "/education/loadInitialData", function(request, response) {
        console.log("INFO: New GET request to /education/loadInitialData");
        if (!checkApiKeyFunction(request, response)) return;
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
        // if (!checkApiKeyFunction(request, response)) return;
        var query = insertSearchFields(request, {});
        dbMd.find(query).toArray(function(err, education) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                // Pagination
                if (request.query.offset && !isNaN(request.query.offset)) {
                    if (!(request.query.limit && !isNaN(request.query.limit))) request.query.limit = education.length;
                    education = education.slice(Number(request.query.offset), Number(request.query.limit) + Number(request.query.offset));
                }
                console.log("INFO: Sending education data: " + JSON.stringify(education, 2, null));
                response.send(education);
            }
        });
    });


    // GET a single resource - country/year
    app.get(BASE_API_PATH + "/education/:country", function(request, response) {
        //if (!checkApiKeyFunction(request, response)) return;
        var name = request.params.country;
        var queryName = insertSearchFields(request, {
            country: name
        });
        var queryYear = insertSearchFields(request, {
            year: Number(name)
        });
        if (!name) {
            console.log("WARNING: New GET request to /education/:country without country name, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New GET request to /education/" + name);

            if (!isNaN(name)) {
                dbMd.find(queryYear).toArray(function(err, countryList) {
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
                dbMd.find(queryName).toArray(function(err, countryList) {
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


    // GET a single resource country + year
    app.get(BASE_API_PATH + "/education/:country/:year", function(request, response) {
        //if (!checkApiKeyFunction(request, response)) return;
        var name = request.params.country;
        var year = request.params.year;
        var query = insertSearchFields(request, {
            country: name,
            year: Number(year)
        });
        if (!name || !year) {
            console.log("WARNING: New GET request to /education/:country/:year without country name or year, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New GET request to /education/" + name + "/" + year);
            dbMd.find(query).toArray(function(err, countryList) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    if (countryList.length > 0) {
                        var country = countryList[0]; //since we expect to have exactly ONE country with this name
                        console.log("INFO: Sending country: " + JSON.stringify([country], 2, null));
                        response.send([country]);
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
        //if (!checkApiKeyFunction(request, response)) return;
        var newCountry = request.body;
        if (!newCountry) {
            console.log("WARNING: New POST request to /education/ without country, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New POST request to /education with body: " + JSON.stringify(newCountry, 2, null));
            if (!newCountry["country"] || !newCountry["year"] || !newCountry["education-gdp-perc"] || !newCountry["education-primary-per-capita"] || !newCountry["education-secondary-per-capita"] || !newCountry["education-tertiary-per-capita"] ||
                isNaN(newCountry["year"]) || isNaN(newCountry["education-gdp-perc"]) || isNaN(newCountry["education-primary-per-capita"]) || isNaN(newCountry["education-secondary-per-capita"]) || isNaN(newCountry["education-tertiary-per-capita"])) {
                console.log("WARNING: The country " + JSON.stringify(newCountry, 2, null) + " is not well-formed, sending 400...");
                response.sendStatus(400); // unprocessable entity
            }
            else {
                // Make sure that numeric fields are a number object
                newCountry["year"] = Number(newCountry["year"]);
                newCountry["education-gdp-perc"] = Number(newCountry["education-gdp-perc"]);
                newCountry["education-primary-per-capita"] = Number(newCountry["education-primary-per-capita"]);
                newCountry["education-secondary-per-capita"] = Number(newCountry["education-secondary-per-capita"]);
                newCountry["education-tertiary-per-capita"] = Number(newCountry["education-tertiary-per-capita"]);
                dbMd.find({
                    country: newCountry.country,
                    year: newCountry.year
                }).toArray(function(err, country) {
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
        //if (!checkApiKeyFunction(request, response)) return;
        var name = request.params.country;
        console.log("WARNING: New POST request to /education/" + name + ", sending 405...");
        response.sendStatus(405); // method not allowed
    });


    //PUT over a collection
    app.put(BASE_API_PATH + "/education", function(request, response) {
        //if (!checkApiKeyFunction(request, response)) return;
        console.log("WARNING: New PUT request to /education, sending 405...");
        response.sendStatus(405); // method not allowed
    });


    //PUT over a single resource
    app.put(BASE_API_PATH + "/education/:country/:year", function(request, response) {
        //console.log("BODY: " + JSON.stringify(request.body, null, 2));
        //if (!checkApiKeyFunction(request, response)) return;
        var newCountry = request.body;
        var nameParam = request.params.country;
        var yearParam = request.params.year;
        if (!newCountry) {
            console.log("WARNING: New PUT request to /education/ without country, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New PUT request to /education/" + nameParam + "/" + yearParam + " with data " + JSON.stringify(newCountry, 2, null));
            if (!newCountry["country"] || !newCountry["year"] || !newCountry["education-gdp-perc"] || !newCountry["education-primary-per-capita"] || !newCountry["education-secondary-per-capita"] || !newCountry["education-tertiary-per-capita"] ||
                isNaN(newCountry["year"]) || isNaN(newCountry["education-gdp-perc"]) || isNaN(newCountry["education-primary-per-capita"]) || isNaN(newCountry["education-secondary-per-capita"]) || isNaN(newCountry["education-tertiary-per-capita"])) {
                console.log("WARNING: The country " + JSON.stringify(newCountry, 2, null) + " is not well-formed, sending 400...");
                response.sendStatus(400); // unprocessable entity
            }
            else {
                // Make sure that numeric fields are a number object
                newCountry["year"] = Number(newCountry["year"]);
                newCountry["education-gdp-perc"] = Number(newCountry["education-gdp-perc"]);
                newCountry["education-primary-per-capita"] = Number(newCountry["education-primary-per-capita"]);
                newCountry["education-primary-per-capita"] = Number(newCountry["education-primary-per-capita"]);
                newCountry["education-tertiary-per-capita"] = Number(newCountry["education-tertiary-per-capita"]);
                dbMd.find({
                    country: nameParam,
                    year: Number(yearParam)
                }).toArray(function(err, countries) {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        //console.log("Matching contries: " + JSON.stringify(countries, null, 2));
                        //console.log("Replace with: " + JSON.stringify(newCountry, null, 2));
                        if (countries.length > 0) {
                            dbMd.update({
                                country: nameParam,
                                year: Number(yearParam)
                            }, newCountry);
                            console.log("INFO: Modifying country with name " + nameParam + " and year " + yearParam + " with data " + JSON.stringify(newCountry, 2, null));
                            response.send(newCountry); // return the updated data
                        }
                        else {
                            console.log("WARNING: There are not any countries with name " + nameParam + " and year " + yearParam);
                            response.sendStatus(404); // not found
                        }
                    }
                });
            }
        }
    });


    //DELETE over a collection
    app.delete(BASE_API_PATH + "/education", function(request, response) {
        //if (!checkApiKeyFunction(request, response)) return;
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
    app.delete(BASE_API_PATH + "/education/:country/:year", function(request, response) {
        //if (!checkApiKeyFunction(request, response)) return;
        var name = request.params.country;
        var year = request.params.year;
        if (!name || !year) {
            console.log("WARNING: New DELETE request to /education/:country/:year without country name or year, sending 400...");
            response.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New DELETE request to /education/" + name);
            dbMd.remove({
                country: name,
                year: Number(year)
            }, {}, function(err, numRemoved) {
                if (err) {
                    console.error('WARNING: Error removing data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    console.log("INFO: Countries removed: " + numRemoved.result.n);
                    if (numRemoved.result.n === 1) {
                        console.log("INFO: The country with name " + name + " and year " + year + " has been succesfully deleted, sending 204...");
                        response.sendStatus(204); // no content
                    }
                    else if (numRemoved.result.n === 0) {
                        console.log("WARNING: There are no countries to delete");
                        response.sendStatus(404); // not found
                    }
                    else {
                        console.log("INFO: Countries with name " + name + " and year " + year + " has been succesfully deleted, sending 204...");
                        response.sendStatus(204); // no content
                    }
                }
            });
        }
    });


    console.log("Education data REST API v2 registered successfully");
};
