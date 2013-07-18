var express = require("express");
var app = express();
var port = 3700;
var db = require('./db').DB;
var socketHandler = require('./socketHandler');

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);




app.get("/", function(req, res){
	res.render("page");
});

app.get("/localNet", function(req, res){
    res.render("localNets");
});

app.get("/chat", function(req, res){
    res.render("page2");
});

app.get("/localNet", function(req, res){
	res.render("page3");
});

app.get("/frontEnd", function(req, res){
    res.render("page3");
});


app.use(express.static(__dirname + '/public'));




var Db = new DB('localhost', 27017);

console.log("db ready");

var io = require( 'socket.io' ).listen( app.listen(port), { log: false } );


console.log("Listening on port " + port);

var handler = new Handler(io, Db);

	
handler.setup();
	
handler.localNets();

    
    
    
    
    
    
    
    
    
    
    







