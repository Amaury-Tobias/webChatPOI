var socket = io.connect('http://localhost:8080', { 'forceNew': true });
const userColor = getRandomColor();

var user = prompt('Ingrese su nombre');

console.log(socket);
var id = socket.id;

socket.on('messages', function(data) {
  render(data);
});

function render (data) {
  console.log(data);
  var html = `<div>
              <font color=${data.color}><strong color=${data.color}>${data.author}</strong>:</font>
              <em>${data.text}</em>
            </div>`;

  document.getElementById('messages').innerHTML += html;
}

function addMessage(e) {
  var message = {
    author: user,
    text: document.getElementById('texto').value,
    color: userColor,
    id: socket.id,
    to: document.getElementById('username').value
  };
  
  socket.emit('new-message', message);
  render(message);
  return false;
}

function register() {
  let registro = {
    user: user,
    id: socket.id
  }
  console.log(id);
  
  socket.emit('new-connection', registro);
}

$(document).ready(function () {
  document.getElementById("myName").innerHTML = user;
})

function getRandomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

register();