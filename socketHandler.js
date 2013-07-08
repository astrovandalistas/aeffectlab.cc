/********************************
 		socket.io funcs		 
********************************/
    

var io, db;
Handler = function(_io, _db) {

	io = this.io = _io;
	db = this.db = _db;
	var self = this;
	this.db.createTree(function(error,tree_collection){
		
		tree_collection.count(function (err, count) {
			
			if(err)
		    
			if (!err ) {
				console.log(count);
			}
			if (!err && count === 0) {
//		        populateDB();
		    } 
		});
//		
		tree_collection.find({}).toArray(function(){ console.log("ay wey"); });
		console.log("callback tree");
//		self.db.readTree(tree);  

	});

}


Handler.prototype.refreshDB = function(){
	io.sockets.emit('clear_db');					

	db.getCollection(function(error, message_collection) {
		if (error)
			callback(error)
		else {			
			message_collection.find({}).sort( { $natural: -1 } ).toArray(function(err, mssgs){
				console.log( "load all" )
				for( x in  mssgs ) {
					
					var message = mssgs[ x ];
					var response = { message: message.message, created_at: message.created_at }    		    	
					io.sockets.emit('add_message', response );					
			
				}
			})
		}
	});		
}

Handler.prototype.hello = function(){
	console.log("hola");
}


Handler.prototype.setup = function(socket) {
	var self = this;

	io.sockets.on('connection', function (socket) {

			
		
		socket.emit("connectionSuccess", {});
		
		self.refreshDB();


		socket.emit('message', { message: 'conectado' });

	
		
	    socket.on('send', function (data) {
	
	    	db.save({
	    	    message: data.message
	    	}, function( error, docs) {
	    	    console.log( "saved" )
	    	});
	
	    	
	    	
	    	console.log("new message: " + data.message.nickname + ": " + data.message.text);
	
	    	var response = { id: socket.id, message: data.message }    	
	    	
	    	io.sockets.emit('message', response );
	    	
	    	self.refreshDB();
	    	
	    });
	
	    socket.on('clear', function (data) {
	
	    	db.getCollection(function(error, message_collection) {
	    		if (error)
	    			callback(error)
	    			else {					
	    				message_collection.remove()		
	    				console.log( " clear ! 	");
	    			}
	    	})
	
	    	self.refreshDB();
	
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
					
			console.log( data );
			
			var response = { 
//	    		localNetName:	data.localNetName,
//	    		location:	data.location,  //:{city:Oakland, state:CA, country:USA, coordinates:[37.8044, -122.2697]}
//	    		prototypeName:	data.prototypeName,  //:text about this localNet, location, project, etc etc
	    		prototypeAddress:	data.prototypeAddress//:[twitter,sms,http]
			};
			
			socket.emit("addPrototypeSuccess", response);
	
		});
	
	
		
	
		// on prototype deletion, send json with:
		
	
	
		socket.on("removePrototype", function (data) {
			console.log( data );
			socket.emit("removePrototypeSuccess")
			var response = {			
				localNetName: data.localNetName, //:542
				location: data.location, //:{city:Oakland, state:CA, country:USA, coordinates:[37.8044, -122.2697]}
				prototypeName: data.prototypeName//:AST@192.168.2.23:7878
			};
	
		});
	
		// on unpublished messages, send json with:
	
		socket.on("addMessage", function (data) {
				
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

			
			socket.emit( "addMessageSuccess", response);
	
		});

	
	});

}

exports.Handler = Handler;