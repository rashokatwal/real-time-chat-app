const code = document.getElementById('code');
const userCount = document.getElementById('user-count');
const chatBox = document.getElementById('show-chat');
const typingMessage = document.getElementById('typing-message');
const messageBox = document.getElementById('input-message');
const sendButton = document.getElementById('send');
const leaveButton = document.getElementById('leave');
var socket = io.connect('http://localhost:4000');

let username = sessionStorage.getItem('username');
let requestType = sessionStorage.getItem('requestType');
let roomId = sessionStorage.getItem('roomId');
let enteredRoomCode = sessionStorage.getItem('enteredRoomCode');

if (requestType == 'join') {
    socket.emit('joinroom', {
        id: enteredRoomCode,
        username: username
    })
}

else if (requestType == 'create') {
    socket.emit('createroom', {
        id: roomId,
        username: username
    })
}

if (sendButton) {
    sendButton.addEventListener('click', () => {       
        if (messageBox.value != '') {
            socket.emit('chat', {
                username: username,
                message: messageBox.value,
            })
            messageBox.value = '';
        }
    })
}

socket.on('enter', function(data, uid, action, count) {
    if (socket.id == uid) {
        chatBox.innerHTML += `<p class="joined-message"><strong>You</strong> ${action} the chat`;
    }
    else {
        chatBox.innerHTML += `<p class="joined-message"><strong>${data.username}</strong> ${action} the chat`;
    }
    
    if (count == 1) {
        userCount.innerHTML = `${count} Member`;
    }
    else {
        userCount.innerHTML = `${count} Members`;
    }
})

socket.on('chat', function(data, uid) {

    typingMessage.innerHTML = ''; 

    if (socket.id == uid) {
        chatBox.innerHTML += '<div class="chat-message" style="align-items: end;"><strong>You</strong><span> ' + data.message + '</span></div>'
    }
    else {
        chatBox.innerHTML += '<div class="chat-message"><strong>' + data.username + '</strong><span style="background-color: #EFEDEE;color:#1c1c1c"> ' + data.message + '</span></div>';
    }
})

code.addEventListener('click', () => {
    var copyText = code.innerHTML;
    navigator.clipboard.writeText(copyText);
    alert('Code copied to clipboard')
})

messageBox.addEventListener('keypress', () => {
    if (messageBox.value != '') {
        socket.emit('typing', {
            id: roomId,
            username: username
        });
    }
})

socket.on('typing', function(data) {
    typingMessage.innerHTML = `<p class="typing-message">${data.username} is typing...</p>`
})

leaveButton.addEventListener('click', () => {
    socket.emit('leave', {
        username: username
    })
})

socket.on('leave', function(data,count) {
    chatBox.innerHTML += `<p class="joined-message"><strong>${data}</strong> left the chat`;
    if (count == 1) {
        userCount.innerHTML = `${count} Member`;
    }
    else {
        userCount.innerHTML = `${count} Members`;
    }
})

socket.on('redirect', function(reason) {
    if (reason == 'doesNotExist') {
        alert('This room does not exist. Try joining another room.')
    }
    window.location.href = '/';
})