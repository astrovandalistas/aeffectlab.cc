var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

DB = function(host, port) {
  this.db= new Db('tst_mssgs', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
  
};


DB.prototype.getCollection= function(callback) {
  this.db.collection('messages', function(error, message_collection) {
    if( error ) callback(error);
    else callback(null, message_collection);
  });
};





//find all messages
DB.prototype.findAll = function(callback) {
    this.getCollection(function(error, message_collection) {
      if( error ) callback(error)
      else {
        message_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//save new message
DB.prototype.save = function(messages, callback) {
    this.getCollection(function(error, message_collection) {
      if( error ) callback(error)
      else {
        if( typeof(messages.length)=="undefined")
          messages = [messages];

        for( var i =0;i< messages.length;i++ ) {
          message = messages[i];
          message.created_at = new Date();
        }

        message_collection.insert(messages, function() {
          callback(null, messages);
        });
      }
    });
};








/*
 * 
 * 	tree
 * 
 * 
 */


DB.prototype.getTree= function(callback) {
	
	console.log("find tree...");
	

	  this.db.collection('tree', function(error, tree_collection) {
	    if( error ) callback(error);
	    else
	    	callback(null, tree_collection);	
	  });
};

//save new message
DB.prototype.createTree = function(callback) {
    this.getTree(function(error, tree_collection) {
        if( error ) callback(error)
        else {        	
        	var leaves = [];
        	
        	for( var i =0;i< 20; i++ ) {
        		console.log("insert " + i );
				
				leaves.push(
						{
						localNetName: i,
						_id:i,
						/*,
						messages: [		
							{ nick: i+"wtf1", text:"1..." },
							{ nick: i+"wtf2", text:"2..." },
							{ nick: i+"wtf3", text:"3..." },	
							{ nick: i+"wtf4", text:"4..." },
							{ nick: i+"wtf5", text:"5..." },
							{ nick: i+"wtf6", text:"6..." },
							{ nick: i+"wtf7", text:"7..." },	
							{ nick: i+"wtf8", text:"8..." }			
						]*/				
					}
				);
		  
        	}
        	
        	console.log( "length: " + leaves.length );
        	tree_collection.insert({hello:'hello'}, callback(error,tree_collection));

        }
    });
        
};


DB.prototype.readTree = function(tree) {
	this.getTree(function(error, tree ) {
		
	      if( error ) callback(error)
	      else {
	    	  tree.find().toArray(function(error, results) {
	              if( error ) console.log(error);//callback(error));
	              else console.log(results);//callback(null, results)
	            });
			console.log("after found ");

			

	      }
    });

	
	tree.count(function (err, count) {
		
		if(err)
			console.log( "count_ :::"  );
	    
		if (!err && count === 0) {
//	        populateDB();
	    }
	});

	console.log("reading...");

};



exports.DB = DB;