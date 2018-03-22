var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const readLine = require('readline');

var users = []



app.use(express.static('public'));

app.use(function (req, res, next) {
  res.status(404).send('Error 404');
});


io.on('connection', (socket) => {
  
  socket.on('add user', (data) => {
    console.log(`New user: ${data.user}, ${socket.id}`);
    users.push({
      user: data.user,
      id: socket.id
    });
    socket.emit('login', data);
    //io.emit(`userList`, users);
  });

  socket.on('new message', (data) => {
    users.forEach(element => {
      if (element.user == data.to) {
        //console.log(`From ${data.username}\nto ${element.user}\n`);
        io.to(element.id).emit('new message', {
          username: data.username,
          message: data.message
        });
      }
    });
  });
  
  socket.on('callFromTo', (data) =>{
    users.forEach(element => {
      if (element.user == data.callTO) {
        console.log(`Call from ${data.callFrom} \nto ${element.id}`);
        io.to(element.id).emit('NewCall', data);
      }
    });
  });

  socket.on('stream', (data) => {
    io.emit('frameStream',data);
  });

  socket.on('disconnect', () => {
    console.log(`\nUser ${socket.id} disconnected`);
    users.splice(users.indexOf(socket.id), 1);
  });
});




//////READ_LINE
const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'chatLOG > '
});
rl.prompt();
rl.on('line', (input) => {
  switch (input) {
    case ':u':
      users.forEach(user => {
        console.log(`${user.user}, ${user.id}`);
      });
      break;
    default:
      break;
  }
  rl.prompt();
});

server.listen(8080, function() {
  console.log("\nServidor corriendo en http://localhost:8080");
});
