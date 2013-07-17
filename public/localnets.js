window.onload = function() {
	var URL = document.URL;
    var db_list = [];
    var chat_list = [];
    
    var socket = io.connect( URL );
    var field = document.getElementById("field");
    var nickname = document.getElementById("nickname");

    var disconnectButton = document.getElementById("disconnect");
    var removeProtButton = document.getElementById("removeProt");
    var addProtButton = document.getElementById("addProt");
    var addLocalNetButton = document.getElementById("addLocalNet");
    var addMessageButton = document.getElementById("addMessage");
    
    var content = document.getElementById("content");
    var callbacks = document.getElementById("callbacks");
    var db = document.getElementById("db");


    
    
    socket.on('clear_db', function (data) {
    	db.innerHTML = ''
    		db_list = []        
    })


    addLocalNetButton.onclick = function() {
    	var obj = { };
    	
    	
    	socket.emit(
    		'addLocalNet'
    		, obj
    		, function(data){
    			callbacks.innerHTML = JSON.stringify(data)//parseString(data)//.message.nickname
//    									+ ": " + data.message.text;
    	});    	
    };
    
    addMessageButton.onclick = function() {
    	var obj = { };    	
    	socket.emit('addMessage', obj );    	
    };
    
    addProtButton.onclick = function() {
    	var obj = { };    	
    	socket.emit('addProt', obj );    	
    };
    
    addMessageButton.onclick = function() {
    	var obj = { };    	
    	socket.emit('addMessage', obj );    	
    };

    disconnectButton.onclick = function() {
    	var obj = { };    	
    	socket.emit('disconnect', obj );    	
    };
    
 
}



function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}