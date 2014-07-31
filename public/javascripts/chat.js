//var io = require('socket.io');
/**
*handles the client side of the side
*/
var chatSys = io.connect('/chat_Sys'),
    chatCom = io.connect('/chat_com');

var roomName = decodeURI(
(RegExp("room" + '=' + '(.+?)(&|$)').exec(location.search)
|| [, null])[1]);
if (roomName) {
  chatSys.on('name_set', function(data) {
    chatSys.emit('join_room', {'name':roomName});
  chatSys.on('user_entered', function(user) {
    $('#messages').append('<div class = "systemMessages">' + user.name + ' has joined the room.' +'</div>');
  });

  chatSys.on('message', function(message) {
    var message = JSON.parse(message);
    $('#messages').append('<div class="' + message.type + '">' + message.message + '</div>');
  });

  chatCom.on('message', function(message) {
    var message = JSON.parse(message);
      $('#messages').append('<div class="' + message.type + '"><span class = "name">' + message.username + ':</span> ' + message.message + '</div>');
  });

  $('#nameform').hide();
  $('#messages').append('<div class = "systemMessage">Hello ' + data.name + '</div>');
 
  $('#send').click(function() {
    var data = {
      message:$('#message').val(),
      type:'userMessage'
    };
    chatCom.send(JSON.stringify(data));
    $('#message').val('');
  });
});
}

$(function() {
  $('#setname').click(function() {
    chatSys.emit('set_name', {name: $('#nickname').val()});
  });
});
