var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

DB = function(host, port) {
  this.db= new Db('tst_mssgs', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
  
};


DB.prototype.getCollection= function(coll_name,callback) {
  this.db.collection(coll_name, function(error, message_collection) {
    if( error ) callback(error);
    else callback(null, message_collection);
  });
};





//find all messages
DB.prototype.findAll = function(callback) {
    this.getCollection('messages',function(error, message_collection) {
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
DB.prototype.save = function(coll_name, messages, callback) {
    this.getCollection(coll_name,function(error, message_collection) {
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








exports.DB = DB;