export function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
export const setStoredUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeStoredUser = () => {
  localStorage.removeItem("user");
};