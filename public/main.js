'use strict'

var MyKey;
var MyPKey;

var allChat = [{
  username: 'chatAll',
  messages: [
    {sender: 'server', message: "Bienvenido"}
  ]}]

var FADE_TIME = 150
var COLORS = [
  '#e21400', '#91580f', '#f8a700', '#f78b00',
  '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
  '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
]

  //VideoLlamada
var canvas = document.createElement('canvas')
var context = canvas.getContext('2d')
context.width = 120
context.height = 120
var $localVideo = $('#localVideo')


var $window = $(window)
var $usernameInput = $('.usernameInput')
var $passwordInput = $('.passwordInput')
var $messages = $('.messages')
var $inputMessage = $('.inputMessage')
var $title = $('#title')
var $contactList = $('.contactList')
var $contact = $('.contact')

//Pages
var $loginPage = $('.login.page')
var $chatPage = $('.chat.page')
var $settingsPage = $('.settings.page')
var $estadoInput = $('.estadoInput')
var $closeSession = $('#closeSession')
var $usernameTopbar = $('#UserNameTopBar')
var $userImage = $('.userImage')

var username
var estado
var password
var currentChat
var currentChatUser
var currentKey
var encoded = false
var beep = new Audio('beep.mp3')
var socket = io()

$(function () {
  username = localStorage.getItem('username')
  estado = localStorage.getItem('estado')
    
  $.post('api/signin')
  .done( (data) => {
    console.log(data);
    
    localStorage.setItem('username', data.dataUser[0].username)
    username = data.dataUser[0].username

    $loginPage.fadeOut()
    $chatPage.show()
    $chatPage.css("display", "grid")
    $('#listContainer').show()
    $loginPage.off('click')
    $usernameTopbar.text(username)
    $userImage.attr('src', `profilePictures/${data.dataUser[0].avatar}`)

    MyPKey = genKeyRSA(username).MyPKey
    MyKey = genKeyRSA(username).MyKey
    socket.emit('add user', {
      user: username,
      estado: estado,
      key: MyPKey
    })
    socket.emit('give message', {
      user: username
    })
  })
  .fail( (data) => {
    localStorage.removeItem('username')
    localStorage.removeItem('estado')    
    //$(location).attr('href', 'http://localhost:8080/api/registrar')
  })
})

Notification.requestPermission();

function setUsername () {
  username = cleanInput($usernameInput.val().trim())
  password = cleanInput($passwordInput.val().trim())
  
  if (username && password) {
    $.post('/api/signin', {username: username, password: password, session: '0'})
    .done( (data) => {
      $loginPage.fadeOut()
      $chatPage.show()
      $chatPage.css("display", "grid")
      $('#listContainer').show()
      $loginPage.off('click')
      $usernameTopbar.text(data.dataUser[0].username)
      $userImage.attr('src', `profilePictures/${data.dataUser[0].avatar}`)
      localStorage.setItem('username', data.dataUser[0].username)

      MyPKey = genKeyRSA(username).MyPKey
      MyKey = genKeyRSA(username).MyKey

      socket.emit('add user', {
        user: data.dataUser[0].username,
        estado: estado,
        key: MyPKey
      })
      socket.emit('give message', {
        user: username
      })
    })
    .fail( (data) => {
      $usernameInput.val("error de login")
    })

  }
}
function cleanInput (input) {
  return $('<div/>').text(input).text()
}
function log (message, options) {
  var $el = $('<li>').addClass('log').text(message)
  addMessageElement($el)
}
function addMessageElement (el) {
  var $el = $(el)
  $el.hide().fadeIn(FADE_TIME)
  $messages.append($el)
  $messages[0].scrollTop = $messages[0].scrollHeight
}
function sendMessage () {
  var message = cleanInput($inputMessage.val().trim())
  addChatMessage({ username: username, message: message })
  if (encoded == true) {
    message = cryptico.encrypt(message, currentKey, MyKey)
    var dataMessage = {
      username: username,
      message: message,
      to: currentChat,
      encoded: encoded,
      toU: currentChatUser
    }
  } else {
    var dataMessage = {
      username: username,
      message: message,
      to: currentChat,
      encoded: encoded,
      toU: currentChatUser
    }
  }

  $inputMessage.val('')
  socket.emit('new message', dataMessage)

  allChat.forEach(element => {
    if (element.username === dataMessage.to) {
      element.messages.push({ sender: dataMessage.username, message: dataMessage.message })
    } else {
      let innerMessage = { sender: dataMessage.username, message: dataMessage.message }
      let newChat = { username: dataMessage.to, messages: [] }
      newChat.messages.push(innerMessage)
      allChat.push(newChat)
    }
  })
}
function addChatMessage (data) {
  var $messageDiv

  if (data.username === username) {
    let $usernameDiv = $('<span class="username"/>')
    .text(`Me: `)
    .css('color', getUsernameColor(data.username))

    let $messageBodyDiv = $('<span class="messageBody">')
    .text(data.message)

    $messageDiv = $('<li class="message"/>')
    .data('username', data.username)
    .append($usernameDiv, $messageBodyDiv).addClass('req')

  } else {
    let $usernameDiv = $('<span class="username"/>')
    .text(`${data.username}: `)
    .css('color', getUsernameColor(data.username))
    
    var $messageBodyDiv

    if (data.encoded == true) {
      $messageBodyDiv = $('<span class="messageBody">')
      .text(cryptico.decrypt(data.message.cipher, MyKey).plaintext)
    } else {
      $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message)
    }


    $messageDiv = $('<li class="message"/>')
    .data('username', data.username)
    .append($usernameDiv, $messageBodyDiv).addClass('res')
  }
  addMessageElement($messageDiv)
}

function getUsernameColor (username) {
  var hash = 7
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + (hash <<5) - hash
  }
  var index = Math.abs(hash % COLORS.length)
  return COLORS[index]
}

  // Element Events
$inputMessage.keydown (function (event) {
  
  var emojiMessage = $inputMessage.val()

  var find = /:(cry):/
  var RE = new RegExp(find, 'g')
  emojiMessage = emojiMessage.replace(RE, '😭')

  find = /:(happy):/
  RE = new RegExp(find, 'g')
  emojiMessage = emojiMessage.replace(RE, '😃')
  
  find = /:(sad):/
  RE = new RegExp(find, 'g')
  emojiMessage = emojiMessage.replace(RE, '😢')

  find = /:(glass):/
  RE = new RegExp(find, 'g')
  emojiMessage = emojiMessage.replace(RE, '😎')

  find = /:(zanahoria):/
  RE = new RegExp(find, 'g')
  emojiMessage = emojiMessage.replace(RE, '🍆')

  find = /:(alien):/
  RE = new RegExp(find, 'g')
  emojiMessage = emojiMessage.replace(RE, '👽')

  find = /:(B):/
  RE = new RegExp(find, 'g')
  emojiMessage = emojiMessage.replace(RE, '🅱️')

  find = /:(A):/
  RE = new RegExp(find, 'g')
  emojiMessage = emojiMessage.replace(RE, '🅰️')

  $inputMessage.val(emojiMessage)

  if (event.which === 13) {
    sendMessage();
  }
})
$window.click( function () {
  $title.text(`FUSUFUM CHAT`);

  $('.contactList .contact').each(function () {
      $(this).removeClass('newMessageContact');
  });

})
$window.keydown( function (event) {
  if (event.which === 13) {
    if (username) {
      //sendMessage();
    } else {
      setUsername();
    }
  }
})
$inputMessage.click( function () {
  $inputMessage.focus();
})
$estadoInput.click( function () {
  $estadoInput.focus();
})
$estadoInput.keydown( function (event) {
  if (event.which === 13) {
    localStorage.setItem('estado', $estadoInput.val());
    estado = $estadoInput.val();
    $chatPage.fadeIn();
    $settingsPage.fadeOut();
    socket.emit('add user', {
      user: username,
      estado: estado,
      key: MyPKey
    });
  }
})
$contactList.on("click", ".contact", function () {
  currentChat = $(this).attr('id');
  currentKey = $(this).attr('key');
  currentChatUser = $(this).attr('username');
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
})
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
$('#formSUP').submit(function (event) {
  event.preventDefault();
  $(this).ajaxSubmit({
    url: 'api/signup',
    error: function (data) {
      console.log(data);
    },
    succes: function (data) {
      console.log(data);
    }
  })
})
$('#SignUp').click( function () {
  $('#formSUp').submit();
})
$('#encoded').click(function () {
  encoded = !encoded
  if (encoded) {
    $(this).text('🔐')
  } else {
    $(this).text('🔓')
  }
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
      if (typeof(element.avatar) == 'undefined') {
        var $contactImage = $('<img class="contactImage" />')
        .attr('src', `profilePictures/default.png`);
      } else {
        var $contactImage = $('<img class="contactImage" />')
        .attr('src', `profilePictures/${element.avatar}`);
      }
      var $newContact = $('<li />')
      .addClass('contact')
      .attr('id', element.id)
      .attr('key', `${element.key}`)
      .attr('username', element.user)
      .append($contactImage, $contactName);
      $contactList.append($newContact);
    }
  });
});

socket.on('new message', (data) => {  
  addChatMessage(data);
  $title.text(`Nuevo mensaje de ${data.username}`);
  if (data.encoded === true) {
    new Notification(`${data.username} dice:`,{
      body: `${cryptico.decrypt(data.message.cipher, MyKey).plaintext}`
    });
  } else {
    new Notification(`${data.username} dice:`,{
      body: `${data.message}`
    });
  }

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
      estado: estado,
      key: MyPKey
    });
  }
});

socket.on('disconnect', () => {
  log('Error de conexión');
});

socket.on('reconnect_error', () => {
  log('Error en el intento de reconexión');
});

function callWindow() {
  window.open(`http://localhost:8080/api/v/?v=${socket.id}`, '_blank')
  var dataMessage = {
    username: username,
    message: `hey estoy en una video llamada, Unete: http://localhost:8080/api/v/?v=${socket.id}`,
    to: currentChat,
    encoded: false,
    call: true
  }
  socket.emit('new message', dataMessage)
}