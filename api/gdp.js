 var exports = module.exports = {};




 // Register all the functions used in this module
 exports.register = function(app, dbCle, BASE_API_PATH) {
     // GET Load inital data if database is empty
    app.get(BASE_API_PATH + "/gdp/loadInitialData", function(request, response) {
         console.log("INFO: New GET request to /gdp/loadInitialData");
         dbCle.find({}).count((err, count) => {
             if (err) {
                 console.error('WARNING: Error getting data from DB');
                 response.sendStatus(500); // internal server error
             }
             console.log("INFO: Country count: " + count);
             if (count.length === 0) {
             dbCle.insertMany = ([{ 
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
         ]);
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
     // GET a collection
 app.get(BASE_API_PATH + "/gdp", function (request, response) {
     console.log("INFO: New GET request to /gdp");
     dbCle.find({}).toArray( function (err, gdp) {
         if (err) {
             console.error('WARNING: Error getting data from DB');
             response.sendStatus(500); // internal server error
         } else {
             console.log("INFO: Sending gdp: " + JSON.stringify(gdp, 2, null));
             response.send(gdp);
         }
     });
 });
 // GET a collection de paises en un mismo año 

 app.get(BASE_API_PATH + "/gdp/:year", function (request, response) {
     var year = request.params.year;
     var country = request.params.year;
     if(isNaN(request.params.year.charAt(0))){
             if (!country) {
         console.log("WARNING: New GET request to /gdp/:country without name, sending 400...");
         response.sendStatus(400); // bad request
     } else {
         console.log("INFO: New GET request to /gdp/" + country);
         dbCle.find({country:country}).toArray(function (err, gdp) {
             if (err) {
                 console.error('WARNING: Error getting data from DB');
                 response.sendStatus(500); // internal server error
             } else if (gdp.length > 0) { 
                     var resultGdp = gdp; //since we expect to have exactly ONE contact with this name
                     console.log("INFO: Sending result: " + JSON.stringify(resultGdp, 2, null));
                     response.send(resultGdp);
                 } else {
                     console.log("WARNING: There are not any result with country " + country);
                     response.sendStatus(404); // not found
                 }
         });
 }
     }else{
     if (!year) {
         console.log("WARNING: New GET request to /gdp/:year without year, sending 400...");
         response.sendStatus(400); // bad request
     } else {
         console.log("INFO: New GET request to /gdp/" + year);
         dbCle.find({year:year}).toArray(function (err, gdp) {
             if (err) {
                 console.error('WARNING: Error getting data from DB');
                 response.sendStatus(500); // internal server error
             } else if (gdp.length > 0) { 
                     var resultGdp = gdp; //since we expect to have exactly ONE contact with this name
                     console.log("INFO: Sending resultGdp: " + JSON.stringify(resultGdp, 2, null));
                     response.send(resultGdp);
                 } else {
                     console.log("WARNING: There are not any result with year " + year);
                     response.sendStatus(404); // not found
            
                 }
         });
 }
}});


//GET a recurso concreto con 2 parametros

 app.get(BASE_API_PATH + "/gdp/:country/:year", function (request, response) {
     var country = request.params.country;
     var year = request.params.year;
     if (!country || !year) {
         console.log("WARNING: New GET request to /gdp/:country without country or without year, sending 400...");
         response.sendStatus(400); // bad request
     } else {
         console.log("INFO: New GET request to /gdp/" + country + "/" + year);
         dbCle.find({country:country, $and:[{year:year}]}).toArray(function (err, results) {
             if (err) {
                 console.error('WARNING: Error getting data from DB');
                 response.sendStatus(500); // internal server error
             } else if (gdp.length > 0) { 
                     var resultGdp = gdp[0]; //since we expect to have exactly ONE gdp with this name
                     console.log("INFO: Sending resultGdp: " + JSON.stringify(resultGdp, 2, null));
                     response.send(resultGdp);
                 } else {
                     console.log("WARNING: There are not any country with name " + country +  "and year " + year);
                     response.sendStatus(404); // not found
        
                 }
         });
 }
 });
 //POST over a collection cambiar porque es copiado del de julio 
 app.post(BASE_API_PATH + "/gdp", function (request, response) {
     var newGdp = request.body;
     if (!newGdp) {
         console.log("WARNING: New POST request to /gdp/ without newGdp, sending 400...");
         response.sendStatus(400); // bad request
     } else {
         console.log("INFO: New POST request to /gdp with body: " + JSON.stringify(newGdp, 2, null));
         if (!newGdp.country || !newGdp.year || !newGdp.gdp||!newGdp.gdp_growth||!newGdp.gdp_deflator) {
             console.log("WARNING: The newGdp " + JSON.stringify(newGdp, 2, null) + " is not well-formed, sending 422...");
             response.sendStatus(422); // unprocessable entity
         } else {
             dbCle.find().toArray(function (err, gdp) {
                 if (err) {
                     console.error('WARNING: Error getting data from DB');
                     response.sendStatus(500); // internal server error
                 } else {
                     var gdpBeforeInsertion = gdp.filter((g) => {
                         return (g.country.localeCompare(newGdp.country, "en", {'sensitivity': 'base'}) === 0);
                
                        
      });
                        
                        
                     if (gdpBeforeInsertion.length > 0) {
                         console.log("WARNING: The newGdp " + JSON.stringify(newGdp, 2, null) + " already extis, sending 409...");
                         response.sendStatus(409); // conflict
                     } else {
                         console.log("INFO: Adding gdp" + JSON.stringify(newGdp, 2, null));
                         dbCle.insert(newGdp);
                         response.sendStatus(201); // created
                     }
                 }
             });
         }
     }
 });
//POST over a single resource
 app.post(BASE_API_PATH + "/gdp/:country", function (request, response) {
     var country = request.params.country;
     console.log("WARNING: New POST request to /gdp/" + country + ", sending 405...");
     response.sendStatus(405); // method not allowed
 });
 //PUT over a collection
 app.put(BASE_API_PATH + "/gdp", function (request, response) {
     console.log("WARNING: New PUT request to /gdp, sending 405...");
     response.sendStatus(405); // method not allowed
 });
//PUT over a single resource
 app.put(BASE_API_PATH + "/gdp/:country", function (request, response) {
     var updatedgdp = request.body;
     var country = request.params.country;
     if (!updatedgdp) {
         console.log("WARNING: New PUT request to /gdp/ without this one, sending 400...");
         response.sendStatus(400); // bad request
     } else {
         console.log("INFO: New PUT request to /gdp/" + country + " with data " + JSON.stringify(updatedgdp, 2, null));
         if (!updatedgdp.country || !updatedgdp.year ) {
             console.log("WARNING: The gdp " + JSON.stringify(updatedgdp, 2, null) + " is not well-formed, sending 422...");
             response.sendStatus(422); // unprocessable entity
         } else {
             dbCle.find({}).toArray( function (err, gdp) {
                 if (err) {
                     console.error('WARNING: Error getting data from DB');
                     response.sendStatus(500); // internal server error
                 } else {
                     var gdpBeforeInsertion = gdp.filter((g) => {
                     return (g.country.localeCompare(country, "en", {'sensitivity': 'base'}) === 0);
                     });
                     if (gdpBeforeInsertion.length > 0) {
                         dbCle.update({country: country}, updatedgdp);
                         console.log("INFO: Modifying gdp with country " + country + " with data " + JSON.stringify(updatedgdp, 2, null));
                         response.send(updatedgdp); // return the updated gdp
                     } else {
                         console.log("WARNING: There are not any gdp with country " + country);
                         response.sendStatus(404); // not found
                     }
                 }
             });
         }
     }
 });
//DELETE over a collection
 app.delete(BASE_API_PATH + "/gdp", function (request, response) {
     console.log("INFO: New DELETE request to /gdp");
     dbCle.remove({}, {multi: true}, function (err, gdp) {
         var numRemoved = JSON.parse(gdp);
         if (err) {
             console.error('WARNING: Error removing data from DB');
             response.sendStatus(500); // internal server error
         } else {
             if (numRemoved.n > 0) {
                 console.log("INFO: All gdp(" + numRemoved.n + ") have been succesfully deleted, sending 204...");
                 response.sendStatus(204); // no content
             } else {
                 console.log("WARNING: There are no gdp to delete");
                 response.sendStatus(404); // not found
             }
         }
     });
 });
//DELETE over a single resource
app.delete(BASE_API_PATH + "/gdp/:country/:year", function (request, response) {
     var country = request.params.country;
     var year = request.params.year;
     if (!country || !year) {
         console.log("WARNING: New DELETE request to /gdp/:country/:year without country or year, sending 400...");
         response.sendStatus(400); // bad request
     } else {
         console.log("INFO: New DELETE request to /gdp/" + country + " and year " + year);
         dbCle.remove({country:country, $and:[{"year":year}]}, {}, function (err, gdp) {
         var numRemoved = JSON.parse(gdp);   
             if (err) {
                 console.error('WARNING: Error removing data from DB');
                 response.sendStatus(500); // internal server error
             } else {
                 console.log("INFO: gdp removed: " + numRemoved.n);
                 if (numRemoved.n === 1) {
                     console.log("INFO: The gdp with country " + country + " and year " + year + " has been succesfully deleted, sending 204...");
                     response.sendStatus(204); //no content
                 } else {
                     console.log("WARNING: There are no countries to delete");
                     response.sendStatus(404); // not found
                 }
             }
         });
     }
 });
//============================================================================================================//







