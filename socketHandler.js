/********************************
 		socket.io funcs		 
********************************/
    

var io, db, self;
Handler = function(_io, _db) {

	io = this.io = _io;
	db = this.db = _db;
	self = this;

}


Handler.prototype.refreshDB = function(){
	io.sockets.emit('clear_db');					

	db.getCollection('messages',function(error, message_collection) {
		if (error)
			callback(error)
		else {			
			message_collection.find({}).sort( { $natural: -1 } ).toArray(function(err, mssgs){
				console.log( "refreshDB" );
				for( x in  mssgs ) {
					
					var message = mssgs[ x ];
					var response = { message: message.message, created_at: message.created_at }    		    	
					io.sockets.emit('add_message', response );					
			
				}
			})
		}
	});		
}



Handler.prototype.printTree = function(){
	io.sockets.emit('clear_db');					

	db.getCollection('tree',function(error, message_collection) {
		if (error)
			callback(error)
		else {			
			message_collection.find({}).sort( { $natural: -1 } ).toArray(function(err, mssgs){
				console.log( "printTree" );
				for( x in  mssgs ) {
					
					var message = mssgs[ x ];

					var msgs = message.message.arr;
					if( typeof(msgs) != "undefined")
						for(y in msgs )
							console.log( message.message.nickname + "said: " + msgs[y].nickname + ": "+ msgs[y].text );
					
					var response = { message: message.message, created_at: message.created_at }    ;		    	

					io.sockets.emit('add_message', response );					
			
				}
			})
		}
	});	
	
	
	
	
}

var clients = {};
var localNets = {};
var frontEnds = {};

Handler.prototype.setup = function(socket) {
	var self = this;

	var test = [];

	var chat2 = io
	  .of('/2')
	  .on('connection', function (socket) {
		  console.log("connect to chat 2");
		  socket.on("tst",function(data,fn){	
			  console.log(data);
			  console.log(test);
			  
			  fn({message:{nickname:"hello",text:"world"}});
		  });

	  });
	
	
	
	
	var frontEnds= io
	.of('/frontEnd')
	.on('connection', function(socket){
		test.push(socket.id);
		console.log("frontend connected");
	
		socket.on("addMessage", function(data){//,fn){
			
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

	
	
	var localnets = io
		.of('/localNet')
		.on('connection', function(socket){
			test.push(socket.id);
			console.log("localnet connected");

					
					self.refreshDB();


					socket.emit('message', { message: 'conectado' });

					
					
					socket.on('send', function (data) {
						
						db.save('messages', {
							message: data.message
						}, function( error, docs) {
							console.log( "saved" )
						});
						
						
						console.log("new message: " + data.message.nickname + ": " + data.message.text);
						
						var response = { id: socket.id, message: data.message }    	
						
						io.sockets.emit('message', response );
						
						self.refreshDB();
						
					});
					
				
					
				    socket.on('tree', function (data) {
					
				    	self.printTree();
				    	
				    });
				
				    socket.on('clear', function (data) {
				
				    	db.getCollection('messages',function(error, message_collection) {
				    		if (error)
				    			callback(error)
				    			else {					
				    				message_collection.remove()		
				    				console.log( " clear ! 	");
				    			}
				    	})
				
				    	//self.refreshDB();
				    	self.printTree();

					})    
				    
				
					/* on LocalNet creation,
					 * check if all data is valid
					 * 		check if it exists i		  n the database
					 * 			? if so, check if there are any new messages
					 * 			 
					 * 		if not
					 * 			add it to db
					 * 
					 * 		update prototypes in DB LocalNet
					 */
						
						
					 
					
					socket.on("addLocalNet", function (data, fn) {
				
						console.log("ADD LocalNet" + data.localNetName );
				
						console.log( data );
						
						var epoch = 0; //(new Date()).getTime();
						
						localNets[ data.localNetName ] = socket.id;
						
				    	var response = { 
				    		epoch: epoch,
//					    		localNetName:	data.localNetName, 
//					    		location:	data.location,  //:{city:Oakland, state:CA, country:USA, coordinates:[37.8044, -122.2697]}
//					    		localNetDescription:	data.localNetDescription,  //:text about this localNet, location, project, etc etc
//					    		receivers:	data.receivers //:[twitter,sms,http]
						};
				
						fn(response)
				
						
					});
					
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
				
					socket.on("addMessage", function (data,fn) {
							
						console.log( data );
						var response = {
							messageId: data.messageId
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

					socket.on('disconnect', function () {
						delete clients[ socket.id ];

//							if( type == "localNet"){
//								name = hs.query.localNetName;
//								delete localNets[ name ];			
//							}
//							else if( type == "frontEnd" ) {
//								name = hs.query.frontEndName;
//								delete frontEnds[ name ];					
//							}
//							
//							var name = hs.query.localNetName ;
	//
//							
//							console.log( "removed_: " + name );
	//
//							var keys = [];
//							for(var k in clients) keys.push(k);
//							console.log("total clients " + keys.length + " keys: " + keys);

					});

		  });

			
		
}

exports.Handler = Handler;