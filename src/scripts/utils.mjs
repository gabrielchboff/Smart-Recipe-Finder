// wrapper for querySelector
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// get URL query parameter
export function getParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

// escape HTML to prevent XSS — use for all untrusted text content
export function escapeHTML(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// sanitize HTML — allows safe tags, strips dangerous ones (scripts, events)
export function sanitizeHTML(html) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  const ALLOWED_TAGS = new Set([
    "b", "i", "em", "strong", "p", "br", "ul", "ol", "li", "span", "a", "h1", "h2", "h3", "h4",
  ]);
  function clean(node) {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === 1) {
        const tag = child.tagName.toLowerCase();
        if (!ALLOWED_TAGS.has(tag)) {
          child.replaceWith(...child.childNodes);
          continue;
        }
        // strip all attributes except href on <a>
        for (const attr of [...child.attributes]) {
          if (tag === "a" && attr.name === "href") {
            // only allow http/https URLs
            if (!/^https?:\/\//i.test(attr.value)) {
              child.removeAttribute("href");
            }
          } else {
            child.removeAttribute(attr.name);
          }
        }
        // force links to open safely
        if (tag === "a") {
          child.setAttribute("rel", "noopener noreferrer");
          child.setAttribute("target", "_blank");
        }
        clean(child);
      }
    }
  }
  clean(doc.body);
  return doc.body.innerHTML;
}

// hash a string using SHA-256 (Web Crypto API)
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// render a list of items using a template function
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// render raw HTML into an element
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// load an HTML partial from a path
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

// show a toast notification
export function alertMessage(message, scroll = true) {
  // remove existing toast
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  // trigger animation
  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);

  if (scroll) window.scrollTo(0, 0);
}

// load header, footer, and bottom nav partials
export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const headerElement = qs("#main-header");
  renderWithTemplate(headerTemplate, headerElement);

  const footerTemplate = await loadTemplate("/partials/footer.html");
  const footerElement = qs("#main-footer");
  renderWithTemplate(footerTemplate, footerElement);

  const bottomNavTemplate = await loadTemplate("/partials/bottom-nav.html");
  const bottomNavElement = qs("#bottom-nav");
  if (bottomNavElement) {
    renderWithTemplate(bottomNavTemplate, bottomNavElement);
  }

  // set active nav link based on current path
  setActiveNav();

  // setup mobile menu toggle
  setupMobileMenu();
}

// highlight the active nav link
function setActiveNav() {
  const path = window.location.pathname;
  let activePage = "home";

  if (path.includes("/favorites")) activePage = "favorites";
  else if (
    path.includes("/profile") ||
    path.includes("/login") ||
    path.includes("/signup")
  )
    activePage = "profile";

  document.querySelectorAll("[data-page]").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === activePage);
  });
}

// toggle mobile hamburger menu
function setupMobileMenu() {
  const menuBtn = qs("#menuBtn");
  const nav = qs("#nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      menuBtn.classList.toggle("open");
      nav.classList.toggle("open");
    });

    nav.addEventListener("click", (e) => {
      if (e.target.classList.contains("nav__link")) {
        menuBtn.classList.remove("open");
        nav.classList.remove("open");
      }
    });
  }
}
