var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

DB = function(host, port) {
  this.db= new Db('tst', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
  
};


DB.prototype.getCollection= function(coll_name,callback) {
  this.db.collection(coll_name, function(error, collection) {
    if( error ) callback(error);
    else callback(null, collection);
  });
};


DB.prototype.printCollection= function(coll_name,callback) {
  this.db.collection(coll_name, function(error, collection) {
    if( error ) callback(error);
    else collection.count(function(err,cnt){
    	console.log(cnt);
    })
  });
};



//find all coll_items
DB.prototype.findAll = function(callback) {
    this.getCollection('coll_items',function(error, collection) {
      if( error ) callback(error)
      else {
        collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};


//find all coll_items
DB.prototype.find = function(coll_name, query, callback) {
    this.getCollection(coll_name,function(error, collection) {
      if( error ) callback(error)
      else {
        collection.find(query).toArray(function(error, results) {
          if( error )
        	  callback(error)
          else
        	  callback(null, results)
        });
      }
    });
};



//save new message


		
DB.prototype.saveLocalNet = function(data, callback) {
	this.getCollection("localNets",function(error, collection) {
		
		data.epoch = new Date();
		data.active = true;
		var localNet = data;

		if( error ) callback(error)
		else {    	     	  
			var name = data.name;
			
			var coords = data.location.coordinates;
			collection.update(
			{	
				name: name, 
				"location:coordinates" : coords
			},
			
			{	$set: localNet	},			
			{	safe:true, upsert: true, new: 1	},
			function(err,num){
				if(!err)
					callback( null, collection );
				else callback(err)
			});

			
					
			
		}

	});
};


//save new message
DB.prototype.save = function(coll_name, coll_items, callback) {
	this.getCollection(coll_name,function(error, collection) {
	  if( error ) callback(error)
	  else {    	     	  
		if( typeof(coll_items.length)=="undefined")
	      coll_items = [coll_items];    	    	
		for( var i =0;i< coll_items.length;i++ ) {
		  coll_item = coll_items[i];
		  coll_item.created_at = new Date();
	    }
		
		collection.insert(coll_items, function() {        	
	      callback(null, collection);
	    });
	  }
	});
};


DB.prototype.clear = function(coll_name, callback) {

	this.getCollection(coll_name,function(error, collection) {
		if (error)
			callback(error)
			else {					
				collection.remove();
				console.log( " cleared DB : " + coll_name );
				callback();
			}
	})

}

DB.prototype.clearUsers = function(callback) {
	
}











exports.DB = DB;