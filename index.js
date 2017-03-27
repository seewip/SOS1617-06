var moment = require("moment");
var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');
var publicFolder = path.join(__dirname, '/public');

var educationAPI = require('./api/education.js');

var gdp = require('./api/gdp.js');


var app = express();

var MongoClient = require('mongodb').MongoClient;
var mdbURL = "mongodb://crileaech:admin@ds133260.mlab.com:33260/sos1617-06-cle-sandbox";

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
    
    educationAPI.register(app, dbMd, BASE_API_PATH);

    gdp.register(app,dbCle, BASE_API_PATH);



    app.listen(port, () => {
       console.log("Web server is listening on port " + port);
    });

});

app.use("/",express.static(publicFolder));
//=================================BOTTON FOR RUN POSTMAN====================================================//


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
                 "country": "poland",
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

app.post(BASE_API_PATH + "/gdp-per-capita/:country", function (request, response) {
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

app.delete(BASE_API_PATH + "/gdp-per-capita/:country", function (request, response) {
    var country = request.params.country;
    var year = request.params.year;
    if (!country) {
        console.log("WARNING: New DELETE request to /gdp-per-capita/:country/:year without country and year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /gdp-per-capita/" + country);
        dbJf.remove({country:country},function (err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: GDPPC removed: " + numRemoved);
               // if (numRemoved === 1) {
                    console.log("INFO: The gdp-per-capita with country " + country + "and year " + year + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
               // } else {
                //    console.log("WARNING: There are no countries to delete");
                 //   response.sendStatus(404); // not found
               // }
            }
        });
    }
});


//PUT sobre un recurso concreto


app.put(BASE_API_PATH + "/gdp-per-capita/:country", function (request, response) {
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
            dbJf.find({country:updatedGdpPerCapita.country}).toArray(function (err, gdp_per_capita) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else if (gdp_per_capita.length > 0) {
                        dbJf.update({country: updatedGdpPerCapita.country}, updatedGdpPerCapita);
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