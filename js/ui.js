// Отрисовка сообщений и работы интерфейса
const chatWindow = document.getElementById('chat-window');

function formatTime(date) {
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export function renderMessages(messages) {
  chatWindow.innerHTML = '';
  let lastDate = null;

  messages.forEach(msg => {
    const msgDate = new Date(msg.time).toDateString();
    if (msgDate !== lastDate) {
      const divider = document.createElement('div');
      divider.className = 'date-divider';
      divider.textContent = new Date(msg.time).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
      chatWindow.appendChild(divider);
      lastDate = msgDate;
    }

    appendMessage(msg);
  });

  chatWindow.scrollTop = chatWindow.scrollHeight;
}

export function appendMessage(msg) {
  const container = document.createElement('div');
  container.className = `chat-message ${msg.author}`;
  container.textContent = msg.text;

  const timeEl = document.createElement('div');
  timeEl.className = 'timestamp';
  timeEl.textContent = formatTime(new Date(msg.time));
  container.appendChild(timeEl);

  chatWindow.appendChild(container);
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
