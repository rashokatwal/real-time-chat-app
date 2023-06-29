const createRoom = document.getElementById('create-room');
const joinRoom = document.getElementById('join-room');
const backButton = document.getElementById('back-button');
const inputCode = document.getElementById('input-room-code');
const inputName = document.getElementById('input-name');

let username;
let enteredRoomCode;
let requestType;
let roomId;

//const rooms = [];

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function randomRoomId() {
    var id = '';
    for(var i = 0; i < 8; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
}


let generatedRoomCode = randomRoomId();

if (joinRoom) {
    joinRoom.addEventListener('click', () => {
        backButton.style.display = 'none';
        if (inputName.value != '' && inputCode.value != '') {
            sessionStorage.setItem('username', inputName.value);
            sessionStorage.setItem('enteredRoomCode', inputCode.value);
            sessionStorage.setItem('requestType', 'join');
            window.location.href = '/' + inputCode.value;
        }
    })
}

if (createRoom) {
    createRoom.addEventListener('click', () => {
        inputCode.style.display = 'none';
        inputName.style.display = 'block';
        joinRoom.style.display = 'none';
        document.getElementById('or').style.display = 'none';
        roomId = generatedRoomCode;
        backButton.style.display = 'block';
        if (inputName.value != '') {
            sessionStorage.setItem('username', inputName.value);
            sessionStorage.setItem('roomId', generatedRoomCode);
            sessionStorage.setItem('requestType', 'create');
            window.location.href = '/' + roomId;
        }
    })
}

backButton.addEventListener('click', () => {
    inputCode.style.display = 'block';
    inputName.style.display = 'block';
    joinRoom.style.display = 'block';
    document.getElementById('or').style.display = 'block';
    backButton.style.display = 'none';
})



