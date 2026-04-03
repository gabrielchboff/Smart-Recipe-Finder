import { loadHeaderFooter, qs, alertMessage } from "./utils.mjs";
import { registerUser } from "./StorageService.mjs";

loadHeaderFooter();

const form = qs("#signupForm");

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const fullName = qs("#signupName").value.trim();
  const email = qs("#signupEmail").value.trim();
  const password = qs("#signupPassword").value;
  const confirm = qs("#signupConfirm").value;

  // Reset errors
  ["nameError", "emailError", "passwordError", "confirmError", "signupError"].forEach(
    (id) => {
      qs(`#${id}`).textContent = "";
    },
  );
  ["signupName", "signupEmail", "signupPassword", "signupConfirm"].forEach(
    (id) => {
      qs(`#${id}`).classList.remove("form-input--error");
    },
  );

  let valid = true;

  if (!fullName) {
    qs("#nameError").textContent = "Full name is required.";
    qs("#signupName").classList.add("form-input--error");
    valid = false;
  }

  if (!email) {
    qs("#emailError").textContent = "Email is required.";
    qs("#signupEmail").classList.add("form-input--error");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    qs("#emailError").textContent = "Enter a valid email address.";
    qs("#signupEmail").classList.add("form-input--error");
    valid = false;
  }

  if (!password) {
    qs("#passwordError").textContent = "Password is required.";
    qs("#signupPassword").classList.add("form-input--error");
    valid = false;
  } else if (password.length < 6) {
    qs("#passwordError").textContent = "Password must be at least 6 characters.";
    qs("#signupPassword").classList.add("form-input--error");
    valid = false;
  }

  if (password !== confirm) {
    qs("#confirmError").textContent = "Passwords do not match.";
    qs("#signupConfirm").classList.add("form-input--error");
    valid = false;
  }

  if (!valid) return;

  const result = registerUser({ fullName, email, password });

  if (result.success) {
    alertMessage("Account created!");
    window.location.href = "/";
  } else {
    qs("#signupError").textContent = result.error;
  }
});
