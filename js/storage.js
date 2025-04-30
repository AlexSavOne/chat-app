// Хранение и загрузка сообщений
const STORAGE_KEY = 'chat-messages';
const MAX_MESSAGES = 100;

export function loadMessages() {
  try {
    const messages = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return messages.slice(-MAX_MESSAGES);
  } catch (error) {
    console.error('Ошибка при загрузке сообщений:', error);
    return [];
  }
}

export function saveMessages(messages) {
  try {
    const messagesToSave = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToSave));
  } catch (error) {
    console.error('Ошибка при сохранении сообщений:', error);
    // Если сообщение слишком большое, попробуем сохранить только текст
    try {
      const simplifiedMessages = messages.map(msg => ({
        text: msg.text,
        author: msg.author,
        time: msg.time,
        read: msg.read,
        edited: msg.edited
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(simplifiedMessages));
    } catch (e) {
      console.error('Не удалось сохранить даже упрощенные сообщения:', e);
    }
  }
}
