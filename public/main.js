'use strict';

$(function () {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
  '#e21400', '#91580f', '#f8a700', '#f78b00',
  '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
  '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];


  var allMessages = [{
    chattingWith: "all"
  }];

  var $window = $(window);
  var $usernameInput = $('.usernameInput');
  var $passwordInput = $('.passwordInput');
  var $messages = $('.messages');
  var $inputMessage = $('.inputMessage');
  var $title = $('#title');
  var $contactList = $('.contactList');
  var $contact = $('.contact');

  var $loginPage = $('.login.page');
  var $chatPage = $('.chat.page');

  var $settingsPage = $('.settings.page');
  var $estadoInput = $('.estadoInput');

  var $closeSession = $('#closeSession');

  var username = localStorage.getItem('username');
  var estado = localStorage.getItem('estado');
  var password;

  var beep = new Audio('beep.mp3');
  //var $currentInput = $usernameInput.focus();

  var currentChat;
  var socket = io();

  $.post('/api/signin', {username: username})
  .done( (data) => {
    $usernameInput.val = username;

    $loginPage.fadeOut();
    $chatPage.show();
    $chatPage.css("display", "grid");
    $loginPage.off('click');

    socket.emit('add user', {
      user: username,
      estado: estado
    });
  })
  .fail( (data) => {
    localStorage.removeItem('username');
    localStorage.removeItem('estado');
    console.log(data.status);
  });

  Notification.requestPermission();

  function setUsername () {
    username = cleanInput($usernameInput.val().trim());
    password = cleanInput($passwordInput.val().trim());
    localStorage.setItem('username', username);
    if (username && password) {
      $loginPage.fadeOut();
      $chatPage.show();
      $chatPage.css("display", "grid");
      $loginPage.off('click');

      $.post('/api/signup', {username: username})
      .done( (data) => {
        console.log(data);
      })
      .fail( (data) => {
        console.log(data.status);
      });

      socket.emit('add user', {
        user: username,
        estado: estado
      });
    }
  }
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }
  function log (message, options) {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el);
  }
  function addMessageElement (el) {
    var $el = $(el);

    var  options = {};
    options.fade = true;
    options.prepend = false;

    // Apply options
    $el.hide().fadeIn(FADE_TIME);
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

    var dataMessage = {
      username: username,
      message: message,
      to: currentChat
    };
    if (message) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message
      });
      socket.emit('new message', dataMessage);
    }
  }
  function getUsernameColor (username) {
    var hash = 7;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + (hash <<5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }
  function addChatMessage (data) {
    var $usernameDiv = $('<span class="username"/>')
    .text(`${data.username}: `)
    .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
    .text(data.message);

    var $messageDiv = $('<li class="message"/>')
    .data('username', data.username)
    .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv);
  }

  // Element Events
  $window.click( function () {
    $title.text(`FUSUFUM CHAT`);

    $('.contactList .contact').each(function () {
        $(this).removeClass('newMessageContact');
    });

  })
  $window.keydown( function (event) {
    if (event.which === 13) {
      if (username) {
        sendMessage();
      } else {
        setUsername();
      }
    }
  });
  $inputMessage.click( function () {
    $inputMessage.focus();
  });
  $estadoInput.click( function () {
    $estadoInput.focus();
  });
  $estadoInput.keydown( function (event) {
    if (event.which === 13) {
      localStorage.setItem('estado', $estadoInput.val());
      estado = $estadoInput.val();
      $chatPage.fadeIn();
      $settingsPage.fadeOut();
      socket.emit('add user', {
        user: username,
        estado: estado
      });
    }
  });
  $contactList.on("click", ".contact", function () {
    currentChat = $(this).attr('id');
    $('.contactList .contact').each(function () {
      $(this).removeClass('activeContact');
    });
    $(this).addClass('activeContact');
    if (currentChat == 'settings') {
      estado = localStorage.getItem('estado')
      $chatPage.fadeOut();
      $settingsPage.fadeIn();
      $estadoInput.val(estado);
    } else if (currentChat == 'chatAll') {
      socket.emit('print', 'print');
      $chatPage.fadeIn();
      $settingsPage.fadeOut();
    } else {
      $chatPage.fadeIn();
      $settingsPage.fadeOut();
    }
  });
  $closeSession.on('click', function () {
    localStorage.removeItem('username');
    $.post('/api/signout')
    .done( data => {
      $loginPage.fadeIn();
      $chatPage.fadeOut();
      $loginPage.on('click');
      $chatPage.off('click');
      location.reload();
    })
    .fail( data => {
    })
  })

  socket.on('usersList', (data) => {
    $contactList.html("");
    $contactList.append(`
    <li class="contact" id="settings">
    <img src="profilePictures/settings.png" class="contactImage">
    <p class="contactName">Settings</p>
    </li>
    `);
    $contactList.append(`
    <li class="contact" id="chatAll">
    <img src="profilePictures/general.png" class="contactImage">
    <p class="contactName">General (${data.length - 1})</p>
    </li>
    `);
    data.forEach(element => {
      if (element.user != username) {
        var $contactName = $('<p class="contactName" />')
        .text(`${element.user} (${element.estado})`);
        if (typeof(element.picture == 'undefined')) {
          var $contactImage = $('<img class="contactImage" />')
          .attr('src', `profilePictures/default.png`);
        } else {
          var $contactImage = $('<img class="contactImage" />')
          .attr('src', `profilePictures/${element.picture}`);
        }

        var $newContact = $('<li />')
        .addClass('contact')
        .attr('id', element.id)
        .attr('username', element.user)
        .append($contactImage, $contactName);
        $contactList.append($newContact);
      }
    });
  });

  socket.on('new message', (data) => {
    addChatMessage(data);
    $title.text(`Nuevo mensaje de ${data.username}`);
    new Notification(`${data.username} dice:`,{
      body: `${data.message}`
    });
    beep.play();
    $('.contactList .contact').each(function () {
      var newMessageUsername = $(this).attr('username');
      if (newMessageUsername == data.username) {
        $(this).addClass('newMessageContact');
      }
    });
  });

  socket.on('reconnect', () => {
    log('Reconectado');
    if (username) {
      socket.emit('add user', {
        user: username,
        estado: estado
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