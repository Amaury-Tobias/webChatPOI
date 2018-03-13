var socket = io.connect('http://localhost:8080', { 'forceNew': true });
const userColor = getRandomColor();

var user = prompt('Ingrese su nombre');

console.log(socket);
var id = socket.id;

var video;
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');

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
  video = document.getElementById("video");
  var constraints = {audio:true, video:true};
  context.width = 120;
  context.height = 120;

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    navigator.mediaDevices.getUserMedia({video:true}).then(success)
  else
    alert("Your browser does not support getUserMedia()");

    function success(stream) {
      video.src = window.URL.createObjectURL(stream);
      video.play();
    }
});

function sendFrame(video, context) {
  context.drawImage(video, 0, 0, context.width, context.height);
  socket.emit('stream',canvas.toDataURL('image/webp'));
}
setInterval(function () {
  sendFrame(video, context);
  console.log("FrameEnviado");
}, 1000);



function getRandomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

register();