import { getLocalStorage, setLocalStorage, hashPassword } from "./utils.mjs";

const KEYS = {
  USER: "srf_user",
  USERS_DB: "srf_users",
  FAVORITES: "srf_favorites",
  PREFERENCES: "srf_preferences",
};

// ===== User Auth =====

export function getUsers() {
  return getLocalStorage(KEYS.USERS_DB) || [];
}

function saveUsers(users) {
  setLocalStorage(KEYS.USERS_DB, users);
}

export function getCurrentUser() {
  return getLocalStorage(KEYS.USER);
}

export function setCurrentUser(user) {
  setLocalStorage(KEYS.USER, user);
}

export function clearCurrentUser() {
  localStorage.removeItem(KEYS.USER);
}

// Register a new user (async — password is hashed)
export async function registerUser({ fullName, email, password }) {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    return { success: false, error: "An account with this email already exists." };
  }

  const hashedPassword = await hashPassword(password);

  const user = {
    id: Date.now().toString(),
    fullName,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  saveUsers(users);

  const safeUser = { id: user.id, fullName: user.fullName, email: user.email };
  setCurrentUser(safeUser);

  return { success: true, user: safeUser };
}

// Log in an existing user (async — compares hashed passwords)
export async function loginUser({ email, password }) {
  const users = getUsers();
  const hashedPassword = await hashPassword(password);
  const user = users.find((u) => u.email === email && u.password === hashedPassword);

  if (!user) {
    return { success: false, error: "Invalid email or password." };
  }

  const safeUser = { id: user.id, fullName: user.fullName, email: user.email };
  setCurrentUser(safeUser);

  return { success: true, user: safeUser };
}

export function logoutUser() {
  clearCurrentUser();
}

// ===== Favorites =====

export function getFavorites() {
  const user = getCurrentUser();
  if (!user) return [];
  const all = getLocalStorage(KEYS.FAVORITES) || {};
  return all[user.id] || [];
}

export function saveFavorite(recipe) {
  const user = getCurrentUser();
  if (!user) return false;

  const all = getLocalStorage(KEYS.FAVORITES) || {};
  const userFavs = all[user.id] || [];

  if (userFavs.find((r) => r.id === recipe.id)) return false;

  userFavs.push({
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    readyInMinutes: recipe.readyInMinutes,
    savedAt: new Date().toISOString(),
  });

  all[user.id] = userFavs;
  setLocalStorage(KEYS.FAVORITES, all);
  return true;
}

export function removeFavorite(recipeId) {
  const user = getCurrentUser();
  if (!user) return;

  const all = getLocalStorage(KEYS.FAVORITES) || {};
  all[user.id] = (all[user.id] || []).filter((r) => r.id !== recipeId);
  setLocalStorage(KEYS.FAVORITES, all);
}

export function isFavorite(recipeId) {
  return getFavorites().some((r) => r.id === recipeId);
}

// ===== Dietary Preferences =====

export function getPreferences() {
  const user = getCurrentUser();
  if (!user)
    return { vegan: false, keto: false, glutenFree: false, paleo: false };

  const all = getLocalStorage(KEYS.PREFERENCES) || {};
  return (
    all[user.id] || { vegan: false, keto: false, glutenFree: false, paleo: false }
  );
}

export function savePreferences(prefs) {
  const user = getCurrentUser();
  if (!user) return;

  const all = getLocalStorage(KEYS.PREFERENCES) || {};
  all[user.id] = prefs;
  setLocalStorage(KEYS.PREFERENCES, all);
}
