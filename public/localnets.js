
var messages = [
	{
		localNet: {
			name:"Five42",
			location: {
				city:"Oakland",
				state:"CA",
				country:"USA",
				coordinates:[37.8044, -122.2697]
			},
		},
		dateTime: "yyyy/mm/dd hh:mm:ss",
		epoch: 1373260515,
		messageId: 12,
		messageText: "hello I'm a message",
		hashTags: ["#aeLab"],
		user: "thiago",
		receiver:["twitter","sms","etc"],
		prototypes:["192.168.2.23:7878", "192.168.2.13:7878", "192.168.2.23:7777"]

	},
	{
		localNet: {
			name:"MOLAA",
			location: {
				city:"Long Beach",
				state:"CA",
				country:"USA",
				coordinates:[33.7669, -118.1883]
			},
		},
		dateTime: "yyyy/mm/dd hh:mm:ss",
		epoch: 1373220515,
		messageId: 13,
		messageText: "goodbye .",
		hashTags: ["#aeLab"],
		user: "furenku",
		receiver:["twitter","sms","etc"],
		prototypes:["192.168.2.23:7878", "192.168.2.13:7878", "192.168.2.23:7777"]
	
	},
	{
		localNet: {
			name: "SESC",
			location: {
				city:"São Paulo",
				state:"SP",
				country:"Brazil",
				coordinates:[-23.5000, -46.6167]
			},
		},
		dateTime: "yyyy/mm/dd hh:mm:ss",
		epoch: 1373210515,
		messageId: 14,
		messageText: "brazil .",
		hashTags: ["#aeLab"],
		user: "brazil",
		receiver:["brazil","sms","etc"],
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
address: ["192.168.23.12",4555],
description: "ohh lalalala",
image: "http://i.imgur.com/OV5JNjB.jpg",
active: true},
     {name: "CAU",
     address: ["192.168.23.15",4555],
     description: "ohh lalalala",
image: "http://i.imgur.com/OV5JNjB.jpg",
active: true},
{name: "ISO",
address: ["192.168.23.18",4555],
description: "ohh lalalala",
image: "http://i.imgur.com/OV5JNjB.jpg",
active: true},
{name: "VLE",
address: ["192.168.23.20",4555],
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
address: ["192.168.2.2",4555],
description: "ohh lalalala",
image: "http://i.imgur.com/OV5JNjB.jpg",
active: true},
{name: "AST",
address: ["192.168.2.2",4444],
description: "ohh lalalala",
image: "http://i.imgur.com/OV5JNjB.jpg",
active: true},
{name: "ISO",
address: ["192.168.2.2",4599],
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
address: ["192.168.2.2",4555],
description: "ohh lalalala",
image: "http://i.imgur.com/OV5JNjB.jpg",
active: true},
     {name: "CAU",
     address: ["192.168.2.20",4556],
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
    var allMessagesDiv = $("#allMessages");
    
    var db = $("#db");


    var localNets;

    var lastLocalNet;    
    
    
    var updateClicks = function( ) {
    	var lis = localNetDiv.find('li');

    	lis.css('cursor','pointer');
    	
    	lis.each(function(i){
    		var li = $(this);
    		li.click(function(){
	
	    		var name = li.html();
	    		
	    		socket.emit("openLocalNet", { name: name }, function(data){    			    			
	    			lastLocalNet = data.name;    			
	    			
	    			var ul = $('<ul>');
	    			
	    			
	    			for(var property in data.localNet) {
	    				
	    				var sub_li;
	    				
	    				sub_li = $('<li>').html( property );
	    				sub_li.css('color','#fa8');
	    				sub_li.css('fontSize','90%');

	    				ul.append( sub_li );

	    				
	    				sub_li  = $('<li>').html( JSON.stringify( data.localNet[ property ] ) );

	    				ul.append(sub_li );
					
	    			}

	    			infoDiv.html( ul.html() );
	    			messagesDiv.html("");
	    			
	    			for ( i in data.messages )
	    				messagesDiv.append( $('<li>').html( data.messages[i].messageText ) );
	    			
	    			return false;

	    		});
    		});
		});

	};
    
    

    
    
    socket.on('clear_db', function (data) {
    	db.html("")        
    })


    addLocalNetButton.click(function() {
    	var obj = nets[ Math.floor(Math.random() * nets.length) ];
    	
    	socket.emit(
    		'addLocalNet'
    		, obj
    		, function(data){
    			var li = $('<li>');
    			li.html( data.localnet.name );
    			localNetDiv.append( li );
//    			infoDiv.html( JSON.stringify( data ) );
    			updateClicks();
    		}
    	);    	
    });
    
    addMessageButton.click(function() {
    	var obj = messages[ Math.floor(Math.random() * messages.length) ];
    	
    	socket.emit(
    		'addMessage'
    		, obj
    		, function(array){
    			
    			var ul = $('<ul>');
    			var li;
    			for( i in array ) {    				    				
    				li = $('<li>').html(array[i].localNet.name + ": ").css('color','#aaa');
    				ul.append(li);
	    			li = $('<li>').html(array[i].messageText + ": ");
	    			ul.append(li);
    			}
    			
    			allMessagesDiv.html(
    				ul.html()
    			)
    		}
    	);    	
    });
    
    addProtButton.click(function() {
    	var localNet	=	nets[ 0 ];
    	var prots 		= 	localNet._prots;
    	var prot 		=	prots[ Math.floor( Math.random() * prots.length ) ];
    	
    	var obj = {
    		localnet: { name: localNet.name },
    	 	prot: prot
    	};    	
    	
    	socket.emit('addPrototype', obj, function(data){
    		
    		allMessagesDiv.html( JSON.stringify( prot ) );
    	});  
    	
    	
//    	prototypeAddress(address, port)
//    	callbacks.html(   );
    	
    });
    
    
    removeProtButton.click(function() {
    	var obj = { };    	
    	socket.emit('removePrototype', obj );    	
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
    	});    	
    });
    
    
    
 
    
    
    
});
