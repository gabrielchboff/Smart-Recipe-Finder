import { loadHeaderFooter, qs, alertMessage } from "./utils.mjs";
import { loginUser } from "./StorageService.mjs";

loadHeaderFooter();

const form = qs("#loginForm");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = qs("#loginEmail").value.trim();
  const password = qs("#loginPassword").value;
  const emailError = qs("#emailError");
  const passwordError = qs("#passwordError");
  const loginError = qs("#loginError");

  // Reset errors
  emailError.textContent = "";
  passwordError.textContent = "";
  loginError.textContent = "";
  qs("#loginEmail").classList.remove("form-input--error");
  qs("#loginPassword").classList.remove("form-input--error");

  // Validate
  let valid = true;

  if (!email) {
    emailError.textContent = "Email is required.";
    qs("#loginEmail").classList.add("form-input--error");
    valid = false;
  }

  if (!password) {
    passwordError.textContent = "Password is required.";
    qs("#loginPassword").classList.add("form-input--error");
    valid = false;
  }

  if (!valid) return;

  const result = await loginUser({ email, password });

  if (result.success) {
    alertMessage("Welcome back!");
    window.location.href = "/";
  } else {
    loginError.textContent = result.error;
  }
});
