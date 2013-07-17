/********************************
 		socket.io funcs		 
********************************/
    

var io, db, self;
var localnets;


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










Handler.prototype.localnets = function(socket) {	
	

	localnets = io
		.of('/localNet')
		.on('connection', function(socket){
			console.log("localnet connected");

					 
					
					socket.on("addLocalNet", function (data, fn) {
				
						console.log("add LocalNet" + data.localNetName );

						epoch = (new Date()).getTime();
					
						obj = {
								
							name : data.name,
							location : data.location, //{ city:"Long Beach", state:"CA", country:"USA", coordinates:[33.7669, -118.1883]}
							description : data.description, 
							image: data.image,
							active : data.active,
							rcvrs : data.rcvrs,
							hashtags : data.hashtags, 
							epoch: epoch
							
						}

						localNets[ data.name ] = socket.id;
						
						db.save("localnets", obj, function(err,collection){
							collection.find().toArray(function(err,array){
//								for( i in array )
//									console.log( array[i] );
							});
						})
						
						
				    	var response = { 
				    		epoch: epoch,
				    		localnet: obj
						};
				
						fn(response)
				
						
					});
					
					
					 
					
//					socket.on("disconnect", function (data, fn) {
//						collection.findAndModify( {
//							query: { name: "Tom", state: "active", rating: { $gt: 10 } },
//							sort: { rating: 1 },
//							update: { $inc: { score: 1 } }
//						} );
//					});
					
					
					
					
					// on prototype addition, send json with:
					socket.on("addPrototype", function (data,fn) {
								
						console.log( "adding" );
						console.log( data );
						
						var response = { 
//					    		localNetName:	data.localNetName,
//					    		location:	data.location,  //:{city:Oakland, state:CA, country:USA, coordinates:[37.8044, -122.2697]}
//					    		prototypeName:	data.prototypeName,  //:text about this localNet, location, project, etc etc
				    		prototypeAddress:	data.prototypeAddress
						};
						
						fn(response);
				
					});
				
				
					
				
					// on prototype deletion, send json with:
					

					socket.on("removePrototype", function (data,fn) {
						console.log( "REMOVEing" );

						console.log( data );
						var response = {			
				    		prototypeAddress:	data.prototypeAddress
						};
						fn(response);
				
					});
				
					// on unpublished messages, send json with:
				
					socket.on("clear", function (data,fn) {
						
						db.getCollection("localnets",function(err,collection){
							collection.remove();
							fn();
						})
						
						
					});
					
					
					socket.on("addMessage", function (data,fn) {
							
						console.log( data );
						var response = {
							messageId: data.messageId,
							messageText: data.messageText
						}

							
							
//							var response = {
//								localNetName: data.localNetName, //:542
//								location: data.location, //{city:Oakland, state:CA, country:USA, coordinates:[37.8044, -122.2697]}
//								dateTime: data.dateTime, //yyyy/mm/dd hh:mm
//								epoch: data.epoch, //
//								messageId: data.messageId, //12
//								messageText: data.messageText, //hello I'm a message
//								receiver: data.twitter, //|sms|etc
//								hashTag: data.hashTag, // #aeLab
//								prototypes: data.prototypes//[AST,CAU,ISO,VLE]
//							};

						
						fn( response );
				
					});


					
					
					
/*
 * 
 * 		GUI TESTING FUNCTIONS:
 * 
 */					
					


socket.on("openLocalNet", function (data,fn) {
		
	var name = data.name;
	
	console.log( "openLocalNet" + name );
	
	db.getCollection("localnets", function(err,collection){
		if(!err){
			
			collection.findOne({name: name},function(err,result){				
				fn(result)
			})

		}
	})
	

});

					
					
					
					
					
		  });


}









exports.Handler = Handler;