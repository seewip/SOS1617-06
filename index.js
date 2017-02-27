var express = require("express");
var app = express();
var port = process.env.PORT  ;


app.listen(port, (err) => {
    if (!err)
        console.log("Web Server is running and listening on port: " + port);
    else
        console.log("ERROR initializing server on port " + port + ":" + err);
});


app.get("/", (req, res)=>{
    res.send("<html><body><h1> Hello SOS1617 from the group G06</h1></body></html>");
    
});


app.get("/time", (req, res)=>{
    res.send(getFecha());
});

console.log("La fecha actual es :" +getFecha());


function getFecha(){
    var mes = new Array("January","February", "March", "April", "May", "June", 
    "July", "August", "September", "November", "October", "DEcember");
    
    // var diasSemana = new Array("Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
    //+diasSemana[fecha.getDay()]+
    
    var fecha = new Date();
    
    var m = fecha.getMinutes();
    var s = fecha.getSeconds();
    
    var minutos  = (m < 10) ? '0' + m : m;
    var segundos = (s < 10) ? '0' +s : s; 
    
    var ret = fecha.getDate()+ " " +mes[fecha.getMonth()]
            + " of " +fecha.getFullYear()+ " , " +fecha.getHours()+ ":" +minutos+ ":" +segundos;
    return ret;
}

