const KEY = "qva_session";

export function saveSession(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getSession() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem(KEY);
}
