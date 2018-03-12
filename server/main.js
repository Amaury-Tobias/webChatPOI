var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const readLine = require('readline');

var users = []

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'chatLOG > '
});

app.use(express.static('public'));

app.use(function (req, res, next) {
  res.status(404).send('Error 404');
});

io.on('connection', (socket) => {
  console.log(`New Conect: ${socket.id}`);

  socket.on('new-message', (data) => {
    users.forEach(element => {
      if (element.user == data.to) {
        console.log(`From ${data.author} (${data.id})\nto ${element.user} (${element.id})\nText:(${data.text})\n`);
        io.to(element.id).emit('messages', data);
      }
    });
  });

  socket.on('new-connection', (data) => {
    console.log(`New user: ${data.user}, ${data.id}`);
    users.push(data);
    io.emit(`userList`, users);
  })
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
  console.log("Servidor corriendo en http://localhost:8080");
});
