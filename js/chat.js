import { loadMessages, saveMessages } from './storage.js';
import { renderMessages, appendMessage, showTyping, hideTyping, clearUI } from './ui.js';

const form = document.getElementById('chat-form');
const input = document.getElementById('messageInput');
const toggleThemeBtn = document.getElementById('toggle-theme');
const clearBtn = document.getElementById('clear-chat');
const container = document.getElementById('chat-container');

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

// Инициализация
let messages = loadMessages();
renderMessages(messages);

// Смена темы
toggleThemeBtn.addEventListener('click', () => {
  const theme = container.dataset.theme === 'dark' ? 'light' : 'dark';
  container.dataset.theme = theme;
});

// Очистка чата
clearBtn.addEventListener('click', () => {
  if (confirm('Очистить всю историю чата?')) {
    messages = [];
    saveMessages(messages);
    clearUI();
  }
});

// Отправка сообщения
form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const userMsg = { text, author: 'user', time: new Date().toISOString() };
  messages.push(userMsg);
  appendMessage(userMsg);
  saveMessages(messages);

  input.value = '';
  input.focus();

  // Имитация «печатает...»
  showTyping();
  setTimeout(() => {
    hideTyping();
    const reply = fakeReplies[Math.floor(Math.random() * fakeReplies.length)];
    const botMsg = { text: reply, author: 'bot', time: new Date().toISOString() };
    messages.push(botMsg);
    appendMessage(botMsg);
    saveMessages(messages);
  }, 800);
});
