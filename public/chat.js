window.onload = function() {
	var URL = document.URL;
    var db_list = [];
    var chat_list = [];
    var socket = io.connect( URL );
    var field = document.getElementById("field");
    var nickname = document.getElementById("nickname");
    var sendButton = document.getElementById("send");
    var clearButton = document.getElementById("clear");
    var treeButton = document.getElementById("tree");
    var content = document.getElementById("content");
    var db = document.getElementById("db");
    
    
    
    
    
    
    
    
    
    
    socket.on('message', function (data) {
    
    	if( data.message ) {
    		chat_list.push(
				data.message.nickname + ": " +
//	    				" (id: " + data.id + "): " +
				data.message.text	
	    	);
    		
    		var html = '';
    		for(var i=0; i<chat_list.length; i++) {
    			html += chat_list[i] + '<br />';
    		}
    		content.innerHTML = html;
    	} else {
    		console.log("There is a problem:", data);
    	}
    	
    });
 
    socket.on('clear_db', function (data) {
    	db.innerHTML = ''
    		db_list = []
    	
    })
    
    socket.on('add_message', function (data) {
    	
        if( data.message ) {
        	var t = new Date(data.created_at)
        	
        	var timeago = timeDifference( new Date() , t )
        	
        	db_list.push(
        		'<b style="font-size:80%; color:#aaa">' +
        		timeago + '</b> </br>' +
        		data.message.nickname + ' : ' + data.message.text
        	);
        	
            var html = '';
            for(var i=0; i<db_list.length; i++) {
                html += db_list[i] + '<br />';
            }
            db.innerHTML = html;
        } else {
            console.log("ERROR: CLIENT JS ADD:", data);
        }
        
    });
 
    sendButton.onclick = function() {
    	var text = field.value;
    	var nn = nickname.value;
    	
    	socket.emit('send', { message: { text: text, nickname: nn } } );
    };
    clearButton.onclick = function() {
    	socket.emit('clear');
    };
    treeButton.onclick = function() {
    	socket.emit('tree');
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