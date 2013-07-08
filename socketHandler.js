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



Handler.prototype.setup = function(socket) {
	var self = this;

	io.sockets.on('connection', function (socket) {

			
		db.getCollection('tree',function(error, collection) {
    		if (error)
    			callback(error)
    			else {					
    				collection.remove()		
    				console.log( " clear ! 	");
    			}
    	});
    	
    	var dbmessages = [];
    	
    	for(var i=0; i <19999; i++)
    		dbmessages.push({text:"adios"+(19999-i),nickname:"hr"+i});
    		
    		console.log(dbmessages);
	    	db.save('tree', {
	    	    message: { text: "hola", nickname:"nick", arr: dbmessages }
	    	}, function( error, docs) {
	    		self.printTree();
	    	});
    	
    	
    	

		socket.emit("connectionSuccess", {});
		
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
		 * 		check if it exists in the database
		 * 			? if so, check if there are any new messages
		 * 			 
		 * 		if not
		 * 			add it to db
		 * 
		 * 		update prototypes in DB LocalNet
		 */
			
			
		 
		
		socket.on("addLocalNet", function (data) {
	
			console.log("ADD LocalNet");
	
			console.log( data );
			
			var epoch = 0; //(new Date()).getTime();
			
	    	var response = { 
	    		epoch: epoch,
//	    		localNetName:	data.localNetName, 
//	    		location:	data.location,  //:{city:Oakland, state:CA, country:USA, coordinates:[37.8044, -122.2697]}
//	    		localNetDescription:	data.localNetDescription,  //:text about this localNet, location, project, etc etc
//	    		receivers:	data.receivers //:[twitter,sms,http]
			};
	
			socket.emit("addLocalNetSuccess", response)
	
			
		});
		
		// on prototype addition, send json with:
	
		socket.on("addPrototype", function (data) {
					
			console.log( "adding" );
			console.log( data );
			
			var response = { 
//	    		localNetName:	data.localNetName,
//	    		location:	data.location,  //:{city:Oakland, state:CA, country:USA, coordinates:[37.8044, -122.2697]}
//	    		prototypeName:	data.prototypeName,  //:text about this localNet, location, project, etc etc
	    		prototypeAddress:	data.prototypeAddress
			};
			
			socket.emit("addPrototypeSuccess", response);
	
		});
	
	
		
	
		// on prototype deletion, send json with:
		
	
	
		socket.on("removePrototype", function (data) {
			console.log( "REMOVEing" );

			console.log( data );
			var response = {			
	    		prototypeAddress:	data.prototypeAddress
			};
			socket.emit("removePrototypeSuccess",response)
	
		});
	
		// on unpublished messages, send json with:
	
		socket.on("addLocalNetMessage", function (data) {
				
			console.log( data );
			var response = {
				messageId: data.messageId
			}

				
				
//			var response = {
//				localNetName: data.localNetName, //:542
//				location: data.location, //{city:Oakland, state:CA, country:USA, coordinates:[37.8044, -122.2697]}
//				dateTime: data.dateTime, //yyyy/mm/dd hh:mm
//				epoch: data.epoch, //
//				messageId: data.messageId, //12
//				messageText: data.messageText, //hello I'm a message
//				receiver: data.twitter, //|sms|etc
//				hashTag: data.hashTag, // #aeLab
//				prototypes: data.prototypes//[AST,CAU,ISO,VLE]
//			};

			
			socket.emit( "addLocalNetMessageSuccess", response);
	
		});

	
	});

}

exports.Handler = Handler;