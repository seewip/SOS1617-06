var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");

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


var gdp = [{ 
    country: "Spain", 
    year: 2013, 
    gdp :1369261671179.01, 
    gdp_growth :-1.7,
    gdp_deflator :100.6
    
},
{ country: "Poland", 
  year: 2014,
  gdp :545158979236,
  gdp_growth :3.3,
  gdp_deflator :106.5
    
},
{ country: "Morocco",
  year: 2015,
  gdp :100593283696.7,
  gdp_growth :4.5,
  gdp_deflator :108.9
    
},
{ country: "United_Kingdom",
  year: 2011,
  gdp :2608995353308.8,
  gdp_growth :1.5,
  gdp_deflator :102.0
    
}];

// GET a collection
app.get(BASE_API_PATH + "/gdp", function (request, response) {
    //TBD
     console.log("INFO: Redirecting to /gdp");
     response.send(gdp);
     
});

// GET a single resource
app.get(BASE_API_PATH + "/gdp/:country", function (request, response) {
    //TBD
    
    var country = request.params.country;
    if(!country){
        console.log("Warning : New Request to /gdp/:country without country");
        response.sendStatus(400); //bad request
    }else{
        console.log("INFO: Redirecting to /gdp/"+country);
        var filteredGdp = gdp.filter((g)=>{
            return g.country===country;
        });
       
        if (filteredGdp.length > 0) {
            var g = filteredGdp[0];
            console.log("INFO: Redirecting to contact:"+JSON.stringify(g,2,null));
            response.send(g);
           
        }else{
             console.log("Warning there are not any contact with country" +country);
             response.sendStatus(404);
        }
    }
        
});

//POST over a collection
app.post(BASE_API_PATH + "/gdp", function (request, response) {
    //TBD
    var newGdp = request.body;
   /* console.log("INFO: new Post request to /gdp with body :" +JSON.stringify(newGdp,2,null));
    gdp.push(newGdp);
    response.sendStatus(201);*/
    
   if(!newGdp){
        console.log("Warning : New POST Request to /gdp/:country without country");
        response.sendStatus(400); //bad request
    }else{
        console.log("INFO: Redirecting to newgdp:"+JSON.stringify(newGdp,2,null));
        if(!newGdp.country || !newGdp.year || !newGdp.gdp || !newGdp.gdp_growth || !newGdp.gdp_deflator){
            console.log("INFO: Redirecting to contact:"+JSON.stringify(newGdp,2,null));
            response.sendStatus(422);
        }else{
            var gdpBeforeInserction = gdp.filter((g)=>{
                return g.country===newGdp.country;
            });
            if(gdpBeforeInserction.length>0){
                console.log("INFO: Redirecting to newgdp:"+JSON.stringify(newGdp,2,null));
                response.sendStatus(409);
            }else{
                console.log("INFO: Redirecting to newgdp:"+JSON.stringify(newGdp,2,null));
                gdp.push(newGdp);
                response.sendStatus(201);
            }
             
             
        }
    }
});

//POST over a single resource
app.post(BASE_API_PATH + "/gdp/:country", function (request, response) {
    //TBD
    response.sendStatus(405);
});

//PUT over a collection
app.put(BASE_API_PATH + "/gdp", function (request, response) {
    //TBD
    response.sendStatus(405);
});

//PUT over a single resource
app.put(BASE_API_PATH + "/gdp/:country", function (request, response) {
    //TBD
    var UpadatedGdp = request.body;
    var countryParam = request.params.country;
    gdp =gdp.map((g)=>{
        if(g.country ===countryParam){
            return UpadatedGdp;
        }else{
            return g;
        }
    });
    response.send(UpadatedGdp);
    
});

//DELETE over a collection
app.delete(BASE_API_PATH + "/gdp", function (request, response) {
    //TBD
    gdp.length=0;
    response.sendStatus(204);
});

//DELETE over a single resource
app.delete(BASE_API_PATH + "/gdp", function (request, response) {
    //TBD
    var country=request.params.country;
    var l1 = gdp.length;
    gdp =gdp.filter((g)=>{
        g.country!==country;
    });
    var l2 = gdp.length;
    if(l1==l2){
        response.sendStatus(404);
    }else{
        response.sendStatus(204);
    }
    
    
});

app.listen(port, (err) => {
    if (!err)
        console.log("Web Server is running and listening on port: " + port);
    else
        console.log("ERROR initializing server on port " + port + ":" + err);
});
