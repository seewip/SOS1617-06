var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");

var mongodb = require("mongodb");


var path = require("path");

//Esto correspondería a iniciar una base de datos 
var dbFileName = path.join(__dirname,"gdp.db");
var db = new mongodb({
    filename: dbFileName,
    autoload: true
});

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";

var app = express();

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security


console.log("---BEGIN PROBAR LA API CON CURL---");
console.log("curl -v -XGET -H 'Content-type: application/json'  'http://localhost:8080/api/v1/gdp'");
console.log("curl -v -XPOST -H 'Content-type: application/json' -d '{ \"country\": \"Russian\", \"year\": \"2008\", \"gdp\": \"13671179.01\", \"gdp_growth\": \"2.7\", \"gdp_deflator\": \"99.6\" }' 'http://localhost:8080/api/v1/gdp'");
console.log("curl -v -XGET -H 'Content-type: application/json'  'http://localhost:8080/api/v1/gdp/Spain'");
console.log("curl -v -XPUT -H 'Content-type: application/json' -d '{ \"country\": \"Morocco\", \"year\": \"2015\", \"gdp\":\"100593283696.7 \",\"gdp_growth\": \"4.5\", \"gdp_deflator\": \"108.9\" }' 'http://localhost:8080/api/v1/gdp'");
console.log("curl -v -XPUT -H 'Content-type: application/json' -d '{  \"country\": \"Morocco\", \"year\": \"2009\", \"gdp\":\"100593283696.7 \",\"gdp_growth\": \"2.0\", \"gdp_deflator\": \"108.9\"  }' 'http://localhost:8080/api/v1/gdp/Spain'");
console.log("curl -v -XGET -H 'Content-type: application/json'  'http://localhost:8080/api/v1/gdp/Spain'");
console.log("curl -v -XGET -H 'Content-type: application/json'  'http://localhost:8080/api/v1/gdp/Morocco'");
console.log("curl -v -XDELETE -H 'Content-type: application/json'  'http://localhost:8080/api/v1/gdp/Morocco'");
console.log("curl -v -XGET -H 'Content-type: application/json'  'http://localhost:8080/api/v1/gdp/Morocco'");
console.log("curl -v -XDELETE -H 'Content-type: application/json'  'http://localhost:8080/api/v1/gdp'");
console.log("curl -v -XGET -H 'Content-type: application/json'  'http://localhost:8080/api/v1/gdp'");
console.log("---END PROBAR LA API CON CURL---");


db.find({}, function (err, gdp) {
    console.log('INFO: Initialiting DB...');

    if (err) {
        console.error('WARNING: Error while getting initial data from DB');
        return 0;
    }


    if (gdp.length === 0) {
        console.log('INFO: Empty DB, loading initial data');

        var pib = [{
            "country": "Spain",
            "year": "2013",
            "gdp ": "1369261671179.01",
            "gdp_growth": "-1.7",
            "gdp_deflator ": "100.6"
    
        }, {
            "country": "Poland",
            "year": "2014",
            "gdp ": "545158979236",
            "gdp_growth ": "3.3",
            "gdp_deflator ": "106.5"
    
        }, {
            "country": "Morocco",
            "year": "2015",
            "gdp ": "100593283696.7",
            "gdp_growth": "4.5",
            "gdp_deflator ": "108.9"
    
        }, {
            "country": "United_Kingdom",
            "year": "2011",
            "gdp ": "2608995353308.8",
            "gdp_growth": "1.5",
            "gdp_deflator ": "102.0"
    
        }];
    db.insert(pib);
    }else{
        console.log("INFO : DB has been initializing "+gdp.length+'gdp');
        
    }
    
});


// Base  GET
app.get("/", function (request, response) {
    //TBD
     console.log("INFO: Redirecting to /gdp");
     response.redirect(301,BASE_API_PATH + "/gdp");
     
});

// GET to collection 
app.get(BASE_API_PATH + "/gdp", function (request, response) {
    //TBD
     console.log("INFO: New GET request to /contacts");
    db.find({}, function (err, contacts) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending contacts: " + JSON.stringify(contacts, 2, null));
            response.send(contacts);
        }
    });
     
});

// GET a single resource
app.get(BASE_API_PATH + "/gdp/:country", function (request, response) {
    //TBD
    
    var country = request.params.country;
    // var filteredGdp = gdp.filter((c)=>{
    //     return g.country===country;
    // });
    if(!country){
        console.log("Warning : New GET Request to /gdp/:country without country");
        response.sendStatus(400); //bad request
    }else{
        console.log("INFO: New GET Request to /gdp/" + country);
        db.find({}, function (err, gdp){
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }else{
                var filteredGdp = gdp.filter((g) => {
                    return g.country===country;
                });
                if (filteredGdp.length > 0) {
                     var g = filteredGdp[0];
                     console.log("INFO: Sending  gdp to :"+JSON.stringify(g,2,null));
                     response.send(g);
            }else{
             console.log("Warning there are not any country with " +country);
             response.sendStatus(404);
            }   
        }
        });
    }
});

//POST over a collection
app.post(BASE_API_PATH + "/gdp", function (request, response) {
    //TBD
    var newGdp = request.body;
    /*console.log("INFO: new Post request to /gdp with body :" +JSON.stringify(newGdp,2,null));
    gdp.push(newGdp);
    response.sendStatus(201);
    
    */if(!newGdp){
        console.log("Warning : New POST Request to /gdp/ without gdp sending 400");
        response.sendStatus(400); //bad request
    }else{
        console.log("NEW: POST request to newgdp with body :"+JSON.stringify(newGdp,2,null));
        if(!newGdp.country || !newGdp.year || !newGdp.gdp || !newGdp.gdp_growth || !newGdp.gdp_deflator){
            console.log("WARNING: The newgdp :"+ JSON.stringify(newGdp, 2, null)+"the format it's not correct sending 422");
            response.sendStatus(422);
        }else{
            db.find({}, function (err, gdp){
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var gdpBeforeInserction = gdp.filter((g) => {
                        return (g.name.localeCompare(newGdp.name, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (gdpBeforeInserction.length > 0) {
                        console.log("WARNING: The gdp " + JSON.stringify(newGdp, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding gdp " + JSON.stringify(newGdp, 2, null));
                        db.insert(newGdp);
                        response.sendStatus(201); // created
                    }
           
            }
            });
             
        }
    }

});

//POST over a single resource
app.post(BASE_API_PATH + "/gdp/:country", function (request, response) {
    //TBD
    var country = request.params.country;
    console.log("WARNING: New POST request to /gdp/" + country + ", sending 405...");
    response.sendStatus(405);
});

//PUT over a collection
app.put(BASE_API_PATH + "/gdp", function (request, response) {
    //TBD
    console.log("WARNING: New PUT request to /gdp, sending 405...");
    response.sendStatus(405);
});

//PUT over a single resource
app.put(BASE_API_PATH + "/gdp/:country", function (request, response) {
    //TBD
    var UpdatedGdp = request.body;
    var countryParam = request.params.country;
    if(!UpdatedGdp){
        console.log("WARNING: New PUT request to /gdp/ without country, sending 400...");
        response.sendStatus(400);
    }
   else {
        console.log("INFO: New PUT request to /gdp/"+countryParam + " with data " + JSON.stringify(UpdatedGdp, 2, null));
        if (!UpdatedGdp.country || !UpdatedGdp.year || !UpdatedGdp.gdp || !UpdatedGdp.gdp_growth|| !UpdatedGdp.gdp_deflator) {
            console.log("WARNING: The gdp " + JSON.stringify(UpdatedGdp, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            db.find({}, function (err, gdp) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var gdpBeforeInsertion = gdp.filter((g) => {
                        return (g.country.localeCompare(countryParam, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (gdpBeforeInsertion.length > 0) {
                        db.update({country: countryParam}, UpdatedGdp);
                        console.log("INFO: Modifying gdp with country " + countryParam + " with data " + JSON.stringify(UpdatedGdp, 2, null));
                        response.send(UpdatedGdp); // return the updated gdp
                    } else {
                        console.log("WARNING: There are not any gdp with country " + countryParam);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
   }
});

//DELETE over a collection
app.delete(BASE_API_PATH + "/gdp", function (request, response) {
    //TBD
    console.log("INFO: New DELETE request to /gdp");
    db.remove({}, {multi: true}, function (err, numRemoved) {
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

//DELETE over a single resource

app.delete(BASE_API_PATH + "/gdp/:country", function (request, response) {
    var country = request.params.country;
    if (!country) {
        console.log("WARNING: New DELETE request to /gdp/:country without country, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /gdp/" + country);
        db.remove({country: country}, {}, function (err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: Gdp removed: " + numRemoved);
                if (numRemoved === 1) {
                    console.log("INFO: The gdp with country " + country + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no gdp to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});


app.listen(port, (err) => {
    if (!err)
        console.log("Web Server is running and listening on port: " + port);
    else
        console.log("ERROR initializing server on port " + port + ":" + err);
});
