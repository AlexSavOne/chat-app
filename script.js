const form = document.getElementById('chat-form');
const input = document.getElementById('messageInput');
const chatWindow = document.getElementById('chat-window');

const fakeReplies = [
  'Привет!',
  'Как дела?',
  'Интересно...',
  'Расскажи ещё!',
  'Ха-ха, смешно 😂',
  'Согласен с тобой!',
  'Не уверен в этом 🤔',
  'Может быть позже...',
  'Погода сегодня хорошая!',
  'Ты классный 👍'
];

function appendMessage(text, className) {
  const message = document.createElement('div');
  message.className = className;
  message.textContent = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function saveChat() {
  localStorage.setItem('chatMessages', chatWindow.innerHTML);
}

function loadChat() {
  const saved = localStorage.getItem('chatMessages');
  if (saved) {
    chatWindow.innerHTML = saved;
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage(userMessage, 'chat-message');
  saveChat();
  input.value = '';
  input.focus();

  setTimeout(() => {
    const randomReply = fakeReplies[Math.floor(Math.random() * fakeReplies.length)];
    appendMessage(randomReply, 'chat-message bot-message');
    saveChat();
  }, 800);
});

loadChat();
