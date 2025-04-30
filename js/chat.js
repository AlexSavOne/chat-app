import { loadMessages, saveMessages } from './storage.js';
import { renderMessages, appendMessage, showTyping, hideTyping, clearUI } from './ui.js';

const form = document.getElementById('chat-form');
const input = document.getElementById('messageInput');
const fileInput = document.getElementById('file-input');
const fileButton = document.getElementById('file-button');
const toggleThemeBtn = document.getElementById('toggle-theme');
const clearBtn = document.getElementById('clear-chat');
const container = document.getElementById('chat-container');
const modal = document.getElementById('modal');
const modalCancel = document.getElementById('modal-cancel');
const modalConfirm = document.getElementById('modal-confirm');

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

// Загрузка сохраненной темы
const savedTheme = localStorage.getItem('theme') || 'light';
container.dataset.theme = savedTheme;

// Инициализация
let messages = loadMessages();
renderMessages(messages);

// Смена темы
toggleThemeBtn.addEventListener('click', () => {
  const theme = container.dataset.theme === 'dark' ? 'light' : 'dark';
  container.dataset.theme = theme;
  localStorage.setItem('theme', theme);
});

// Модальное окно
function showModal() {
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function hideModal() {
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

// Очистка чата
clearBtn.addEventListener('click', showModal);

modalCancel.addEventListener('click', hideModal);
modalConfirm.addEventListener('click', () => {
  messages = [];
  saveMessages(messages);
  clearUI();
  hideModal();
  showNotification('История чата очищена', 'success');
});

// Закрытие модального окна при клике вне его
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    hideModal();
  }
});

// Закрытие модального окна по Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('show')) {
    hideModal();
  }
});

// Обработка файлов
fileButton.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const fileData = await readFile(file);
    const userMsg = {
      text: '',
      author: 'user',
      time: new Date().toISOString(),
      file: {
        name: file.name,
        type: file.type,
        data: fileData
      }
    };
    messages.push(userMsg);
    appendMessage(userMsg);
    saveMessages(messages);
    fileInput.value = '';
  } catch (error) {
    console.error('Ошибка при чтении файла:', error);
    alert('Не удалось загрузить файл');
  }
});

// Чтение файла
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

// Отправка сообщения
form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const userMsg = {
    text,
    author: 'user',
    time: new Date().toISOString(),
    read: false
  };
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
    const botMsg = {
      text: reply,
      author: 'bot',
      time: new Date().toISOString(),
      read: true
    };
    messages.push(botMsg);
    appendMessage(botMsg);
    saveMessages(messages);

    // Отмечаем сообщение пользователя как прочитанное
    userMsg.read = true;
    updateMessageStatus(userMsg);
  }, 800);
});

// Обновление статуса сообщения
function updateMessageStatus(message) {
  const messageElement = document.querySelector(`[data-message-id="${message.time}"]`);
  if (messageElement) {
    const statusElement = messageElement.querySelector('.read-status');
    if (statusElement) {
      statusElement.textContent = message.read ? '✓✓' : '✓';
    }
  }
}

// Показ уведомления
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Редактирование сообщения
function editMessage(messageId) {
  const message = messages.find(m => m.time === messageId);
  if (!message || message.author !== 'user') return;

  const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
  const textElement = messageElement.querySelector('.message-text');
  const originalText = textElement.textContent;

  messageElement.classList.add('editing');
  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'message-edit-input';
  editInput.value = originalText;
  textElement.replaceWith(editInput);
  editInput.focus();
  editInput.select();

  const saveEdit = () => {
    const newText = editInput.value.trim();
    if (newText && newText !== originalText) {
      message.text = newText;
      message.edited = true;
      saveMessages(messages);
      renderMessages(messages);
      showNotification('Сообщение отредактировано', 'success');
    } else {
      textElement.textContent = originalText;
      editInput.replaceWith(textElement);
    }
    messageElement.classList.remove('editing');
  };

  const cancelEdit = () => {
    textElement.textContent = originalText;
    editInput.replaceWith(textElement);
    messageElement.classList.remove('editing');
  };

  editInput.addEventListener('blur', saveEdit);
  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  });
}

// Удаление сообщения
function deleteMessage(messageId) {
  const index = messages.findIndex(m => m.time === messageId);
  if (index === -1 || messages[index].author !== 'user') return;

  messages.splice(index, 1);
  saveMessages(messages);
  renderMessages(messages);
  showNotification('Сообщение удалено', 'error');
}

// Экспортируем функции для использования в ui.js
window.editMessage = editMessage;
window.deleteMessage = deleteMessage;
