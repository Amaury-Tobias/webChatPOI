$(function () {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
  '#e21400', '#91580f', '#f8a700', '#f78b00',
  '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
  '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  var $window = $(window);
  var $usernameInput = $('.usernameInput');
  var $messages = $('.messages');
  var $inputMessage = $('.inputMessage');
  var $inputMessageU = $('.inputMessageU');
  var $title = $('#title');
  var $contactList = $('.contactList')
  var $contact = $('.contact');

  var $loginPage = $('.login.page');
  var $chatPage = $('.chat.page');

  var username;
  var typing = false;
  var $currentInput = $usernameInput.focus();

  var currentChat;

  var socket = io();

  function setUsername () {
    username = cleanInput($usernameInput.val().trim());
    
    if (username) {      
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

      // Tell the server your username
      socket.emit('add user', {
        user: username
      });
    }
  }
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }
  function log (message, options) {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }
  function addMessageElement (el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }
  function sendMessage () {
    var message = $inputMessage.val();    
    message = cleanInput(message);

    dataMessage = {
      username: username,
      message: message,
      to: currentChat
    };
    if (message) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message,
      });
      socket.emit('new message', dataMessage);
    }
  }
  function getUsernameColor (username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
     hash = username.charCodeAt(i) + (hash << 5) - hash;
   }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }
  function addChatMessage (data, options) {
    //var $typingMessages = getTypingMessages(data);
    options = options || {};
    /*if ($typingMessages.length !== 0) {
      options.fade = false;
      $typingMessages.remove();
    }*/

    var $usernameDiv = $('<span class="username"/>')
    .text(data.username)
    .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
    .text(data.message);

    var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"/>')
    .data('username', data.username)
    .addClass(typingClass)
    .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);
  }


  // Element Events
  $window.keydown( function (event) {
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });
  $loginPage.click( function () {
    $currentInput.focus();
  });
  $inputMessage.click( function () {
    $inputMessage.focus();
  });

  $contactList.on("click", ".contact", function () {
    currentChat = $(this).attr('id');
  });

/*  socket.on('login', (data) => {
    var message = "Login";
    log(message, {
      prepend: true
    });
  });
*/
  socket.on('usersList', function (data) {
    $contactList.html("");
    console.log(data);
    data.forEach(element => {
      if (element.user != username) {
        var $contactName = $('<p class="contactName" />')
        .text(element.user);
  
        var $contactImage = $('<img class="contactImage" />')
        .attr('src', "asd.jpg");
  
        var $newContact = $('<li />')
        .addClass('contact')
        .attr('id', element.id)
        .append($contactImage, $contactName);
        $contactList.append($newContact);
      }
    });
    //var $contact = $('.contact');
  });



  socket.on('new message', (data) => {
    addChatMessage(data);
    $title.text(`Nuevo mensaje de ${data.username}`);
  });

  socket.on('reconnect', () => {    
    log('Reconectado');
    if (username) {
      socket.emit('add user', {
        user: username
      });
    }
  });

  socket.on('disconnect', () => {
    log('Error de conexión');
  });

  socket.on('reconnect_error', () => {
    log('Error en el intento de reconexión');
  });

});


/*
var video;
var img;
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
var answer = false;
var constraints = {video: true, audio: true};
context.width = 120;
context.height = 120;


document.addEventListener('DOMContentLoaded',function () {
  document.getElementById("answerButton").disabled = true;
  document.getElementById("myName").innerHTML = user;
  video = document.getElementById("video");
  img = document.getElementById("reciver");

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    navigator.mediaDevices.getUserMedia({video:true}).then(success)
  else
    alert("Your browser does not support getUserMedia()");

    function success(stream) {
      video.src = window.URL.createObjectURL(stream);
      video.play();
    }
});



socket.on("frameStream", function (data) {
  document.getElementById(data.callFrom).src = data.data;
});

socket.on("NewCall",function (data) {
  document.getElementById("answerButton").disabled = false;
  setTimeout(() => {
    if (answer) {
      addCam(data.callFrom);
    }
  }, 5000);
});



function addCam(id) {
  var newCam = `<img id="${id}"></img>`
  var container = document.getElementById("callsContainer");
  container.innerHTML += newCam;
};

function answerFunction() {
  answer = true;
}

function callFunction() {
  var calling = {
    "callFrom": `${socket.id}`,
    "callTO": `${document.getElementById("username").value}`
  };
  socket.emit("callFromTo", calling);
}

function sendFrame(video, context) {
  context.drawImage(video, 0, 0, context.width, context.height);
  var callStream = {
    "callFrom": `${socket.id}`,
    "data": canvas.toDataURL('image/webp')
  };
  socket.emit('stream', callStream);
}

if (true) {
  setInterval(function () {
    sendFrame(video, context);
    console.log("FrameEnviado");
  }, 100);
};


*/