

					db.getCollection('tree',function(error, collection) {
			    		if (error)
			    			callback(error)
			    			else {					
			    				collection.remove()		
			    				console.log( " clear ! 	");
			    			}
			    	});
			    	
//				    	var dbmessages = [];
//				    	
//				    	for(var i=0; i <19999; i++)
//				    		dbmessages.push({text:"adios"+(19999-i),nickname:"hr"+i});
//				    		
//				    		console.log(dbmessages);
//					    	db.save('tree', {
//					    	    message: { text: "hola", nickname:"nick", arr: dbmessages }
//					    	}, function( error, docs) {
//					    		self.printTree();
//					    	});
			    	
			    	
			    	
