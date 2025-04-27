// Хранение и загрузка сообщений
const STORAGE_KEY = 'chatMessages';
const MAX_MESSAGES = 100;

export function loadMessages() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveMessages(messages) {
  // Обрезаем историю
  const trimmed = messages.slice(-MAX_MESSAGES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}
