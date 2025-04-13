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

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage(userMessage, 'chat-message');
  input.value = '';
  input.focus();

  setTimeout(() => {
    const randomReply = fakeReplies[Math.floor(Math.random() * fakeReplies.length)];
    appendMessage(randomReply, 'chat-message bot-message');
  }, 800);
});

function appendMessage(text, className) {
  const message = document.createElement('div');
  message.className = className;
  message.textContent = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
