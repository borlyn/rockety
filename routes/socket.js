
var io = require('socket.io');


exports.initialize = function(server) {
    io = io.listen(server);
    var self = this;
  //system messages and events channel
    this.chatSys = io.of("/chat_Sys");
    this.chatSys.on("connection", function(socket){
      socket.on('set_name', function(data) {
	socket.set('nickname', data.name, function() {
	  socket.emit('name_set', data);
			
          socket.send(JSON.stringify({type: 'serverMessage',
            message: 'Welcome to the most interesting chat room on earth!'}));
          socket.broadcast.emit('user_entered', data);
        });
      socket.on("join_room", function (room) {
        socket.get('nickname', function (err, nickname) {
           socket.join(room.name);
           var comSocket = self.chatCom.sockets[socket.id];
           comSocket.join(room.name);
           comSocket.room = room.name;
           socket.in(room.name).broadcast
.emit('user_entered', {'name':nickname});
        });
       });
     });
    });

  //users messages and channel
    this.chatCom = io.of("/chat_com");
    this.chatCom.on("connection", function(socket){   
      socket.on('message', function(message) {
        message = JSON.parse(message);
        if(message.type == "userMessage") {
	    socket.get('nickname', function(err, nickname) {
		message.username = nickname;
		socket.in(socket.room).broadcast.send(JSON.stringify(message));
                
		message.type = "myMessage";
		socket.send(JSON.stringify(message));
	    });
        }
      });
  
    });
}
