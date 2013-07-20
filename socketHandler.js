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
	
	
	
//	var frontEnds= io
//	.of('/frontEnd')
//	.on('connection', function(socket){
//		test.push(socket.id);
//		console.log("frontend connected");
//	
//		
//	});

	
	
			
		
}





/*
 * 		FRONTENDS
 */

var frontEndIds = [];

Handler.prototype.setupFrontEnds = function(socket) {	
	

	frontEnds = io
		.of('/frontEnd')
		.on('connection', function(socket) {
			console.log("frontend connected");
			
			db.getCollection("localNets",function(err,collection){
				collection.find().toArray(function(err,items){
					
					for( i in items ) {
						
						console.log(items[i]);
						socket.emit( "addLocalNet", items[i] );
						
						
						
						
						
						
					}
				})
			});
			
			
			
			
			
			
			frontEndIds[socket.id] = {};
			
			console.log( socket.id )

			
			socket.on("openLocalNet", function (data,fn) {					
				var name = data.name;				
				console.log( "openLocalNet " + name );				
				db.getCollection("localNets", function(err,collection){
					if(!err){		
						
						
						collection.findOne({ name: name },
							function(err,result){				
								console.log(result);
								
								if(result != null)
								for( i in result.prots ) {
									if( result )
										if( result.prots ){
											
											var obj = {
												localNet: {
													name: result.name,
													location: result.location
												},
												prototype: {
													name: result.prots[i].prototypeName,
													address: result.prots[i].prototypeAddress,
												}
												
											};
											
										} else {
											

											var obj = {
												localNet: {
													name: result.name,
													location: result.location
												}	
											};
											
											
										}
										
									
									console.log( obj );
									socket.emit("addPrototype", obj );
								} 
								db.getCollection("Messages",function(err,messages){
									messages.find({ "name": name }).toArray(
										function(err,msgs){	
											fn(msgs);
										}
									);
								})
						});			
					}
				})
			});
			
			
			
			socket.emit("clearMessages");
			db.getCollection("Messages",function(err,messages){
				messages.find().sort( { epoch: 1 } ).toArray(
					function(err,msgs){	
						for(  i in msgs ) {
							
							var msg = msgs[i];
							
							var obj = {
								localNet: {
									name:msg.name,
									location:msg.location,
								},
								epoch:msg.epoch,
								messageText:msg.messageText,
								user:msg.user,
								receiver:msg.receiver,
								prototype: {
									name:msg.prototypeName,
									address:msg.prototypeAddress
								}
							};
							
							socket.emit("addMessage", msg );
						}
					}
				);
			})
			
			

			
			
			

			
			
			
			
			
			socket.on("addMessage", function (data,fn) {
				
				console.log("add Message " + data.name );
				
				db.save("Messages", data, function(err,collection){
					collection.ensureIndex({"name" : 1});
//					socket.emit()
//					collection.find().toArray(
//						function(err,array){																		
//							fn( array );									
//						});
//						
				});
				
				var response = {
					epoch: data.epoch,
					user: data.user,
					messageText: data.messageText,
					messageID: data.messageID
				};
				
				if(data.name != "")
					io.of('/localNet').socket( localNetNames[data.name] ).emit( "addMessage", response );
				else
//					if not, send to all
					io.of('/localNet').emit( "addMessage", response );
				
				socket.broadcast.emit( "addMessage", response );
			
				fn(response);
				//fn(response);
										

			});
			
			
			
			
			
	});

	
	
	
	
	
	
	
	
};




/*
 * 		LOCALNETS
 */


Handler.prototype.setupLocalNets = function(socket) {	
	
	localNets = io
		.of('/localNet')
		.on('connection', function(socket){
			console.log("localnet connected");
	
			var printLocalNets = function() {
				console.log("print");
				db.getCollection("localNets", function(err,collection){
					if(!err){						
						collection.find().toArray(
						function(err,array){			
							socket.emit("showLocalNets", array );									
						});															
					}				
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
					active : data.active,
					rcvrs : data.rcvrs,
					prots : [],
					hashtags : data.hashtags, 
					epoch: epoch
					
				}

				localNetNames[ data.name ] = socket.id;
//				
//				db.getCollection("localNets", function(err,collection){
//					collection.insert(data, {},function(err,coll) {        	
//						console.log(coll);
////						coll.find().toArray(function(err,array){
////							console.log(array);
////						});
//				     
//				    });
//				});
//				db.getCollection("localNets", function(err,collection){
//					console.log("array");
//					collection.find().toArray(function(err,array){
//						console.log(array);
//					});
//				});
		
				db.saveLocalNet(obj, function(err,collection){
					if(!err){

						printLocalNets();
						var response = { 
							epoch: epoch,
						};
						
						fn( response );
					}
					else
						console.log(err);
				});
				
			});
			
			
			 
			
		socket.on( "disconnect", function () {

			var name = localNetNames[socket.id];
			if( name != "undefined" ) {
				
			console.log( "disconnect " + name );
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
			}

		});
		
	
		socket.on( "Disconnect", function (data, fn) {
			
			console.log( "disconnect " + data.localNet.name );

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
				
				console.log("add Message " + data.name );
				
				db.save("Messages", data, function(err,collection){
					collection.ensureIndex({"name" : 1});
					
					collection.find().toArray(
						function(err,array){																		
							fn( array );									
						});
						
				});
				
				console.log(data);
				
				if( data.user == "" || data.user == "undefined" || typeof(data.user) == "undefined" )
					user = data.name;
				else
					user = data.user;
					
				var response = {
//					epoch: data.epoch, 
					epoch: (new Date()).getTime(), 
					user: user,
					messageText: data.messageText,
					messageID: data.messageID
				};
				

				io.of('/frontEnd').emit( "addMessage", response );
			
				
				fn(response);
										
		
			});

			
			socket.on("addPrototype", function (data,fn) {
				console.log("addPrototype " + data.prototypeName );		
				
				var prot = {
					prototypeName		: data.prototypeName,
					prototypeAddress 	: data.prototypeAddress
//					, description			: data.prototypeDescription
				};

				db.getCollection("localNets", function(err,collection){									
					collection.findAndModify(
						{ name : data.name }
						, [], { $addToSet: { prots: prot } },{ new: 1 },
						
						function(err,result){
							if(!err) {								
								var response = {
									address: data.prototypeAddress
								}
								fn(response);										
							}
						}
					);									
				})		
			});
		
		
			
		
			socket.on("removePrototype", function (data,fn) {
				console.log( "removePrototype " + data.prototypeName );				
				
				var prot = {
					prototypeName		: data.prototypeName,
					prototypeAddress	: data.prototypeAddress
//					, description	: data.prototypeDescription
				};
				
				db.getCollection("localNets", function(err,collection){									
					collection.findAndModify(
						{ name : data.name }
						, [], { $pull: { prots: prot } }, {},
						
						function(err,result){
							if(!err)
								if(!err) {								
									var response = {
										address: data.prototypeAddress
									}
									fn(response);										
								}										
						}
					);								
				})		

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
									messages.find({ "name": name }).toArray(
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