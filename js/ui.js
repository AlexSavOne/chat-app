// Отрисовка сообщений и работы интерфейса
const chatWindow = document.getElementById('chat-window');

function formatTime(date) {
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export function renderMessages(messages) {
  chatWindow.innerHTML = '';

  let currentDate = null;

  messages.forEach(message => {
    const messageDate = new Date(message.time).toLocaleDateString();
    
    if (messageDate !== currentDate) {
      const dateDivider = document.createElement('div');
      dateDivider.className = 'date-divider';
      dateDivider.textContent = messageDate;
      chatWindow.appendChild(dateDivider);
      currentDate = messageDate;
    }

    appendMessage(message);
  });

  chatWindow.scrollTop = chatWindow.scrollHeight;
}

export function appendMessage(message) {
  const chatWindow = document.getElementById('chat-window');
  const messageElement = document.createElement('div');
  messageElement.className = `chat-message ${message.author}`;
  messageElement.dataset.messageId = message.time;

  const content = document.createElement('div');
  content.className = 'message-content';

  // Текст сообщения
  if (message.text) {
    const textElement = document.createElement('div');
    textElement.className = 'message-text';
    textElement.textContent = message.text;
    content.appendChild(textElement);
  }

  // Файл
  if (message.file) {
    if (message.file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = message.file.data;
      img.className = 'file-preview';
      img.alt = message.file.name;
      content.appendChild(img);
    } else {
      const fileLink = document.createElement('a');
      fileLink.href = message.file.data;
      fileLink.className = 'file-link';
      fileLink.download = message.file.name;
      fileLink.innerHTML = `📎 ${message.file.name}`;
      content.appendChild(fileLink);
    }
  }

  // Действия с сообщением (только для пользовательских сообщений)
  if (message.author === 'user') {
    const actions = document.createElement('div');
    actions.className = 'message-actions';
    
    const editButton = document.createElement('button');
    editButton.innerHTML = '✏️';
    editButton.onclick = () => window.editMessage(message.time);
    editButton.title = 'Редактировать';
    
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '🗑️';
    deleteButton.onclick = () => window.deleteMessage(message.time);
    deleteButton.title = 'Удалить';
    
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    messageElement.appendChild(actions);
  }

  // Временная метка и статус
  const timestamp = document.createElement('div');
  timestamp.className = 'timestamp';
  
  const time = new Date(message.time).toLocaleTimeString();
  timestamp.textContent = time;
  
  if (message.edited) {
    timestamp.textContent += ' (ред.)';
  }
  
  if (message.author === 'user') {
    const status = document.createElement('span');
    status.className = 'read-status';
    status.textContent = message.read ? '✓✓' : '✓';
    timestamp.appendChild(status);
  }
  
  content.appendChild(timestamp);
  messageElement.appendChild(content);
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

let typingEl = null;
export function showTyping() {
  if (typingEl) return;
  typingEl = document.createElement('div');
  typingEl.className = 'typing-indicator';
  typingEl.textContent = 'Бот печатает...';
  chatWindow.appendChild(typingEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

export function hideTyping() {
  if (!typingEl) return;
  chatWindow.removeChild(typingEl);
  typingEl = null;
}

export function clearUI() {
  chatWindow.innerHTML = '';
}
