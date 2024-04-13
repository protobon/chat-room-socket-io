const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

const username = prompt("What's your name?");
socket.emit("new-user", username)

// Receive new messages
socket.on('chat-message', (data) => {
  appendMessage(`${data.username}: ${data.msg}`)
});

socket.on("user-connected", (username) => {
  appendMessage(`${username} connected`)
})

socket.on("user-disconnected", (username) => {
  appendMessage(`${username} left`)
})


// Send new message
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    appendMessage(`You: ${input.value}`)
    socket.emit('send-chat-message', input.value);
    input.value = '';
  }
});

// Show new message
function appendMessage(msg) {
  const msgItem = document.createElement('li');
  msgItem.textContent = msg;
  messages.appendChild(msgItem);
  window.scrollTo(0, document.body.scrollHeight);
}
