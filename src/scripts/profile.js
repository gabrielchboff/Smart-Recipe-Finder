import { loadHeaderFooter, qs, alertMessage, renderWithTemplate } from "./utils.mjs";
import {
  getCurrentUser,
  logoutUser,
  getPreferences,
  savePreferences,
} from "./StorageService.mjs";

loadHeaderFooter();

function renderProfile() {
  const container = qs("#profileContent");
  const user = getCurrentUser();

  if (!user) {
    renderWithTemplate(
      `<div class="auth-page text-center">
        <h1 class="auth-page__title">Profile</h1>
        <p class="auth-page__subtitle">Sign in to manage your profile and dietary preferences.</p>
        <a href="/login/" class="btn btn--primary btn--lg">Sign In</a>
      </div>`,
      container,
    );
    return;
  }

  const prefs = getPreferences();
  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  renderWithTemplate(
    `<div class="profile-header">
        <div class="profile-avatar">${initials}</div>
        <div class="profile-info">
          <h1 class="profile-info__name">${user.fullName}</h1>
          <p class="profile-info__email">${user.email}</p>
        </div>
      </div>

      <div class="profile-section">
        <h2 class="profile-section__title">Dietary Preferences</h2>
        <div class="diet-option">
          <span>Vegan</span>
          <label class="toggle">
            <input type="checkbox" data-pref="vegan" ${prefs.vegan ? "checked" : ""} />
            <span class="toggle__slider"></span>
          </label>
        </div>
        <div class="diet-option">
          <span>Keto</span>
          <label class="toggle">
            <input type="checkbox" data-pref="keto" ${prefs.keto ? "checked" : ""} />
            <span class="toggle__slider"></span>
          </label>
        </div>
        <div class="diet-option">
          <span>Gluten-Free</span>
          <label class="toggle">
            <input type="checkbox" data-pref="glutenFree" ${prefs.glutenFree ? "checked" : ""} />
            <span class="toggle__slider"></span>
          </label>
        </div>
        <div class="diet-option">
          <span>Paleo</span>
          <label class="toggle">
            <input type="checkbox" data-pref="paleo" ${prefs.paleo ? "checked" : ""} />
            <span class="toggle__slider"></span>
          </label>
        </div>
      </div>

      <div class="profile-section">
        <h2 class="profile-section__title">Notifications</h2>
        <div class="diet-option">
          <span>Recipe Alerts</span>
          <label class="toggle">
            <input type="checkbox" checked />
            <span class="toggle__slider"></span>
          </label>
        </div>
        <div class="diet-option">
          <span>Inventory Reminders</span>
          <label class="toggle">
            <input type="checkbox" />
            <span class="toggle__slider"></span>
          </label>
        </div>
      </div>

      <div class="profile-section">
        <h2 class="profile-section__title">Account</h2>
        <div style="display:flex; flex-wrap:wrap; gap:12px;">
          <button class="btn btn--outline" id="changePasswordBtn">Change Password</button>
          <button class="btn btn--ghost" style="color:var(--color-error);" id="logoutBtn">Sign Out</button>
        </div>
      </div>`,
    container,
  );

  // Dietary preference toggles
  document.querySelectorAll("[data-pref]").forEach((toggle) => {
    toggle.addEventListener("change", () => {
      const currentPrefs = getPreferences();
      currentPrefs[toggle.dataset.pref] = toggle.checked;
      savePreferences(currentPrefs);
      alertMessage("Preferences updated");
    });
  });

  // Logout
  qs("#logoutBtn")?.addEventListener("click", () => {
    logoutUser();
    alertMessage("Signed out");
    window.location.href = "/";
  });

  // Change password
  qs("#changePasswordBtn")?.addEventListener("click", () => {
    alertMessage("Password change coming soon");
  });
}

renderProfile();
