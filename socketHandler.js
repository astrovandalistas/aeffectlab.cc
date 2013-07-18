/********************************
 		socket.io funcs		 
********************************/
    

var io, db, self;
var localNets;
var localNetNames = [];

Handler = function(_io, _db) {

	io = this.io = _io;
	db = this.db = _db;
	self = this;

}


Handler.prototype.refreshDB = function( namespace ){
	
	io.of(namespace).emit('clear_db');					

	db.getCollection('messages',function(error, collection) {
		if (error)
			callback(error)
		else {			

			collection.find({}).sort( { $natural: -1 } ).toArray(function(err, mssgs){
				
				console.log( "refreshDB" );
				for( x in  mssgs ) {
					var message = mssgs[ x ];
					var response = { message: message.message, created_at: message.created_at }    		    	
					io.of(namespace).emit('add_message', response );					
			
				}
			})
		}
	});		
}


//
//Handler.prototype.printTree = function(){
//	io.sockets.emit('clear_db');					
//	db.getCollection('tree',function(error, collection) {
//		if (error)
//			callback(error)
//		else {			
//			collection.find({}).sort( { $natural: -1 } ).toArray(function(err, mssgs){
//				console.log( "printTree" );
//				for( x in  mssgs ) {
//					
//					var message = mssgs[ x ];
//
//					var msgs = message.message.arr;
//					if( typeof(msgs) != "undefined")
//						for(y in msgs )
//							console.log( message.message.nickname + "said: " + msgs[y].nickname + ": "+ msgs[y].text );
//					
//					var response = { message: message.message, created_at: message.created_at }    ;		    	
//
//					io.of(namespace).emit('add_message', response );					
//			
//				}
//			})
//		}
//	});
//}









var clients = {};
var localNets = {};
var frontEnds = {};





Handler.prototype.setup = function(socket) {
	var self = this;

	var test = [];

	var chat = io
	  .of('/chat')
	  .on('connection', function (socket) {
		  
		  console.log("connect to chat 2");
		  
		  
		  socket.emit('message', { message: 'conectado' });

		  		
			self.refreshDB('/chat');	
			
			
			socket.on('send', function (data) {
				
				db.save('messages', {
					message: data.message
				}, function( error, docs) {										
					console.log("saved");
				});
					
				var response = { id: socket.id, message: data.message }    	
				
				chat.emit('message', response );
				
				self.refreshDB('/chat');
				
			});
			
			
			socket.on('show', function () {
				
				db.getCollection('messages', function(error,collection){
					var messages = collection.find({ nickname: "usr1" }).toArray(function(err,messages){
						
						if( messages.length > 0 )
							for ( mssg in messages )
								console.log( messages[mssg] )

					});
					
				});
					
//				var response = { id: socket.id, message: data.message }    	
//				
//				chat.emit('message', response );
//				
//				self.refreshDB('/chat');
				
			});
			socket.on('save', function (data) {
				db.save("users"
						, { nickname:data.message.nickname }
						, function(err,collection){
								
					collection.find( { nickname: "user" } ).toArray(function(err,result){												
						console.log("results: " + result)
					});
				});
				db.save("messages"
						, { message:data.message.text, nickname:data.message.nickname }
						, function(err,collection){
							
				collection.find( { nickname: "user" } ).toArray(function(err,results){												
					console.log("save results: ");
					for (i in results)
						console.log( results[i] )
				});
			});
				var response = { id: socket.id, message: data.message }    	
				chat.emit('message', response );
				self.refreshDB('/chat');
			});
			
		
			
		    socket.on('tree', function (data) {
			
		    	self.printTree();
		    	
		    });
		
		    socket.on('clear', function (data) {		
		    	
		    	db.clear('messages',function(error){});
		    	
		    	db.clear('users',function(error){});
		    	
		    	
			})    
		    
			
			
//		  socket.emit
		  socket.on("tst",function(data, fn){	
			  console.log(data);
			  console.log(test);
			  
			  fn({message:{nickname:"callback",text:"working"}});
		  });

	  });
	
	
	
	var frontEnds= io
	.of('/frontEnd')
	.on('connection', function(socket){
		test.push(socket.id);
		console.log("frontend connected");
	
		
		socket.emit("addLocalNet", 
				{name: "MOLAA",
					location: "Los Angeles, CA",
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
					image: "http://i.imgur.com/OV5JNjB.jpg"},
					     {name: "CAU",
					     address: ["192.168.23.15",4555],
					     description: "ohh lalalala",
					image: "http://i.imgur.com/OV5JNjB.jpg"},
					{name: "ISO",
					address: ["192.168.23.18",4555],
					description: "ohh lalalala",
					image: "http://i.imgur.com/OV5JNjB.jpg"},
					{name: "VLE",
					address: ["192.168.23.20",4555],
					description: "ohh lalalala",
					image: "http://i.imgur.com/OV5JNjB.jpg"}]
					});
		
		socket.on("addMessage", function(data){//,fn){
			
			console.log("frontend add message");
			console.log(data);
			
			var response = {
				user: data.user,
				messageText: data.messageText,
				epoch: data.epoch,
				localNetName: data.localNetName,
				prototype: data.prototype 				
			};
			
//			if has selected localnet, send to only that one
			if(data.localNetName != "")
				io.of('/localNet').socket( localNets[data.localNetName] ).emit( "addMessage", response );
			else
//			if not, send to all
				io.of('/localNet').emit( "addMessage", response );
				
				
//
//	    ? add hashtag to list of hashtags?
//
			
		});

//	"openLocalNet"

//	    get data
//	    ** localNet
//
//	    send messages
//	    ** get NUM_MSSGS latest messages
//
//	    front-end -> "sendServerMessagesToFrontEnd" **
//	    ** **data: messages: (message object array)

//	"getMessages"
//	** data: epoch
//	** get NUM_MSSGS latest messages before epoch
//
//	    front-end -> "sendServerMessagesToFrontEnd" **
//	    ** data:
//	    ** **data: messages: (message object array)

//	"openPrototype"
//
//	    get data:
//	    ** localNet
//	    ** prototypeName
//
//	** get latest NUM_MSSGS messages
//	*** check if there are any differences inside every messages' prototypeName field
//	**** if so, show only those messages associated with prototypeName
//
//	    front-end -> "sendServerMessages" **
//	    ** data:
//	    ** **data: messages: (message object array)
	
	});

	
	
			
		
}










Handler.prototype.localNets = function(socket) {	
	

	localNets = io
		.of('/localNet')
		.on('connection', function(socket){
			console.log("localnet connected");
	
			var printLocalNets = function() {
				db.getCollection("localNets", function(err,collection){
					if(!err)						
						collection.find().toArray(
								function(err,array){																		
									socket.emit("showLocalNets", array );									
								});															
				});
			};
			
			printLocalNets();
					
			socket.on("addLocalNet", function (data, fn) {
			
				localNetNames[ socket.id ] = data.name;

				console.log("add LocalNet " + data.name );

				epoch = (new Date()).getTime();
			
				obj = {
						
					name : data.name,
					location : data.location, //{ city:"Long Beach", state:"CA", country:"USA", coordinates:[33.7669, -118.1883]}
					description : data.description, 
					image: data.image,
					active : data.active,
					rcvrs : data.rcvrs,
					prots : [],
					hashtags : data.hashtags, 
					epoch: epoch
					
				}

				localNetNames[ data.name ] = socket.id;
				
				db.saveLocalNet(obj, function(err,collection){
					if(!err)
						printLocalNets();
				});

//				fn({});
//				
//		    	var response = { 
//		    		epoch: epoch,
//		    		localnet: obj
//				};
//		
//				fn(response)
//		
				
			});
			
			
			 
			
		socket.on( "disconnect", function () {

			var name = localNetNames[socket.id];
			
//			console.log( "disconnect " + data.localNet.name );
//			
//			db.getCollection('localNets', function(err,collection) {
//				collection.findAndModify(
//						{ name : data.localNet.name }
//						, [], { active: false }, {}	,
//						function(err,result){
//							if(!err)
//								fn(result);
//						}
//				);							
//			});
		});
		
	
		socket.on( "Disconnect", function (data, fn) {
			console.log( "disconnect " + data.localNet.name );
			console.log(data);
			data.active = false;
			db.getCollection('localNets', function(err,collection) {
				collection.update(
				{ name : data.localNet.name },
				{  $set: { active: false } }, 
				{
					new: 1
				},
				function(err,numAffected){							
					collection.find().toArray( function(err,array) {
						fn(array);
					});
				});
				
//				collection.findOne().toArray(
//					function(err,array){
//						console.log(array);
//						if(!err)
//							fn(array);
//					}
//				);							
			});
		});
			

			socket.on("addMessage", function (data,fn) {
				
				console.log("add Message " + data.localNet.name );
				
				db.save("Messages", data, function(err,collection){
					collection.ensureIndex({"localNet.name" : 1});
					collection.find().toArray(function(err,array){
						fn(array);
					});
				})
					
		
			});

			
			socket.on("addPrototype", function (data,fn) {
				console.log("addPrototype " + data.localNet.name );				
				db.getCollection("localNets", function(err,collection){									
					collection.findAndModify(
						{ name : data.localNet.name }
						, [], { $addToSet: { prots: data.prot } },{ new: 1 },
						
						function(err,result){
							if(!err)
								fn(result);										
						}
					);									
				})		
			});
		
		
			
		
			socket.on("removePrototype", function (data,fn) {
				console.log( "removePrototype " + data.localNet.name );				
				db.getCollection("localNets", function(err,collection){									
					collection.findAndModify(
						{ name : data.localNet.name }
						, [], { $pull: { prots: data.prot } }, {},
						
						function(err,result){
							if(!err)
								fn(result);										
						}
					);								
				})		

				var response = {			
		    		prototypeAddress:	data.prototypeAddress
				};
				fn(response);
			});
		
		
			


			socket.on("clear", function (data,fn) {
				console.log("clear");
				db.getCollection("localNets",function(err,collection){
					collection.remove();
					fn();
				})
				db.getCollection("Messages",function(err,collection){
					collection.remove();
					fn();
				})
				
				
			});


					

					
					
					
/*
 * 
 * 		GUI TESTING FUNCTIONS:
 * 
 */					
					
	
			

			
			
			
			socket.on("openLocalNet", function (data,fn) {					
				var name = data.name;				
				console.log( "openLocalNet" + name );				
				db.getCollection("localNets", function(err,collection){
					if(!err){						
						collection.findOne({ name: name },
							function(err,result){				
								
								db.getCollection("Messages",function(err,messages){
									messages.find({ "localNet.name": name }).toArray(
										function(err,array){																		
											fn({ localNet: result, messages: array });									
										}
									);
								})
							}
						);			
					}
				})
			});
			
								
								
								
						
						
		  });


}









exports.Handler = Handler;