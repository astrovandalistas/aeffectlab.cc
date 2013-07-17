
var messages = [
	{
		localNet: { name:"Five42",location:{city:Oakland, state:CA, country:USA, coordinates:[37.8044, -122.2697]} },
		dateTime: yyyy/mm/dd hh:mm:ss,
		epoch: 1373260515,
		messageId: 12,
		messageText: "hello I'm a message",
		hashTags: ["#aeLab"],
		user: "thiago",
		receiver:["twitter","sms","etc"],
		prototypes:["192.168.2.23:7878", "192.168.2.13:7878", "192.168.2.23:7777"]

	},
	{
		localNet: { name:"MOLAA",{city:"Long Beach", state:"CA", country:"USA", coordinates:[33.7669, -118.1883]} },
		location:{city:DvA, state:CLA, country:MX, coordinates:[37.8044, -122.2697]},
		dateTime: yyyy/mm/dd hh:mm:ss,
		epoch: 1373220515,
		messageId: 13,
		messageText: "goodbye .",
		hashTags: ["#aeLab"],
		user: "furenku",
		receiver:["twitter","sms","etc"],
		prototypes:["192.168.2.23:7878", "192.168.2.13:7878", "192.168.2.23:7777"]
	
	}
]


var nets = [{name: "MOLAA",
location: {city:"Long Beach", state:"CA", country:"USA", coordinates:[33.7669, -118.1883]},
description: "MOLAA blah blah blah",
image: "http://i.imgur.com/OV5JNjB.jpg",
active: true,
rcvrs: [{name:"sms"},
{name:"twitter"},
{name:"freenet"},
{name:"http"}],
_prots: [{name: "AST",
address: [""192.168.23.12",4555],
description: "ohh lalalala",
image: "http://i.imgur.com/OV5JNjB.jpg",
active: true},
     {name: "CAU",
     address: [""192.168.23.15",4555],
     description: "ohh lalalala",
image: "http://i.imgur.com/OV5JNjB.jpg",
active: true},
{name: "ISO",
address: [""192.168.23.18",4555],
description: "ohh lalalala",
image: "http://i.imgur.com/OV5JNjB.jpg",
active: true},
{name: "VLE",
address: [""192.168.23.20",4555],
description: "ohh lalalala",
image: "http://i.imgur.com/OV5JNjB.jpg",
active: true}]
},
{name: "SESC",
location: {city:"São Paulo", state:"SP", country:"Brazil", coordinates:[-23.5000, -46.6167]},
description: "SP blah blah blah",
image: "http://i.imgur.com/OV5JNjB.jpg",
active: true,
rcvrs: [{name:"sms"},
{name:"twitter"},
{name:"freenet"},
{name:"http"}],
_prots: [{name: "AST",
address: [""192.168.2.2",4555],
description: "ohh lalalala",
image: "http://i.imgur.com/OV5JNjB.jpg",
active: true},
{name: "AST",
address: [""192.168.2.2",4444],
description: "ohh lalalala",
image: "http://i.imgur.com/OV5JNjB.jpg",
active: true},
{name: "ISO",
address: [""192.168.2.2",4599],
description: "ohh lalalala",
image: "http://i.imgur.com/OV5JNjB.jpg",
active: true}]
},
{name: "Five42",
location: {city:"Oakland", state:"CA", country:"USA", coordinates:[37.8044, -122.2697]},
description: "542 blah blah blah",
image: "http://i.imgur.com/OV5JNjB.jpg",
active: false,
rcvrs: [{name:"sms"},
{name:"twitter"},
{name:"freenet"},
{name:"http"}],
_prots: [{name: "ProcessingTest",
address: ["localhost",9000],
description: "ohh lalalala",
image: "http://i.imgur.com/OV5JNjB.jpg",
active: true},
{name: "AST",
address: [""192.168.2.2",4555],
description: "ohh lalalala",
image: "http://i.imgur.com/OV5JNjB.jpg",
active: true},
     {name: "CAU",
     address: [""192.168.2.20",4556],
     description: "ohh lalalala",
image: "http://i.imgur.com/OV5JNjB.jpg",
active: true},
{name: "ISO",
address: ["192.168.2.30",4588],
description: "ohh lalalala",
image: "http://i.imgur.com/OV5JNjB.jpg",
active: true},
{name: "VLE",
address: ["192.168.2.2",4556],
description: "ohh lalalala",
image: "http://i.imgur.com/OV5JNjB.jpg",
active: true}]
}];









$(document).ready(function(){
	var URL = document.URL;
    
    var socket = io.connect( URL );
    var field = $("#field");
    var nickname = $("#nickname");

    var disconnectButton = $("#disconnect");
    var removeProtButton = $("#removeProt");
    var addProtButton = $("#addProt");
    var addLocalNetButton = $("#addLocalNet");
    var addMessageButton = $("#addMessage");
    var clearButton = $("#clear");
    
    var infoDiv = $("#info");
    var localNetDiv = $("#localNets");
    var messagesDiv = $("#messages");
    var db = $("#db");


    var localNets;

    var lastLocalNet;    
    
    
    var updateClicks = function( ) {
    	var lis = localNetDiv.find('li');

    	lis.css('cursor','pointer');
    	
    	lis.click(function(){
    		var li = $(this);

    		var name = li.html();
    		
    		
    		socket.emit("openLocalNet", { name: name }, function(data){    			
    			lastLocalNet = data.name;
    			infoDiv.html( JSON.stringify( data ) );
    		});

    		return false;
    	})
    }
    

    
    
    socket.on('clear_db', function (data) {
    	db.html("")        
    })


    addLocalNetButton.click(function() {
    	var obj = { };
    	
    	obj = nets[ Math.floor(Math.random() * nets.length) ];
    	
    	socket.emit(
    		'addLocalNet'
    		, obj
    		, function(data){
    			var li = $('<li>');
    			li.html( data.localnet.name );
    			localNetDiv.append( li );
    			infoDiv.html( JSON.stringify( data ) );
    			updateClicks();
    	});    	
    });
    
    addMessageButton.click(function() {
    	var obj = { name: lastLocalNet, message: "Lorem ipsum dolor sit."};    	
    	socket.emit('addMessage', obj );    	
    });
    
    addProtButton.click(function() {
    	var obj = { };    	
    	socket.emit('addProt', obj );    	
    });
    
    addMessageButton.click(function() {
    	var obj = { };    	
    	socket.emit('addMessage', obj );    	
    });

    disconnectButton.click(function() {
    	var obj = { };    	
    	socket.emit('disconnect', obj );    	
    });
    clearButton.click(function() {
    	var obj = { };    	
    	socket.emit(
        		'clear'
        		, obj
        		, function(){
        			localNetDiv.html("")
    	});    	
    });
    
    
    
 
    
    
    
});
