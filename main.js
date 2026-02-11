import { renderNavbar, bindNavEvents } from "./src/ui/navbar.js";
import { renderFooter } from "./src/ui/footer.js";
import { getUser, isLoggedIn } from "./src/auth/auth.js";

// Inject UI
const navbar = document.getElementById("navbar");
const footer = document.getElementById("footer");

if (navbar) navbar.innerHTML = renderNavbar();
if (footer) footer.innerHTML = renderFooter();
bindNavEvents();

// ---- ROUTE PROTECTION ----
const path = window.location.pathname;
const user = getUser();

// Pages that require login
const protectedPages = [
  "/pages/dashboard.html",
  "/pages/staff.html"
];

// Admin‑only pages
const adminPages = [
  "/pages/staff.html"
];

// Require login
if (protectedPages.includes(path)) {
  if (!isLoggedIn()) {
    window.location.href = "/pages/index.html";
  }
}

// Require admin role
if (adminPages.includes(path)) {
  if (!isLoggedIn() || user?.role !== "admin") {
    alert("Admin access only");
    window.location.href = "/pages/index.html";
  }
}
