import { isLoggedIn, login, logout, getUser } from "../auth/auth.js";

export function renderNavbar() {
  const user = getUser();

  return `
    <nav class="nav">
      <div>
        <a href="/pages/index.html" class="brand">Qantas VA</a>
        <a href="/pages/map.html">Map</a>
        <a href="/pages/dashboard.html">Dashboard</a>
        <a href="/pages/apply.html">Apply</a>
        <a href="/pages/staff.html">Staff</a>
      </div>
      <div>
        ${
          isLoggedIn()
            ? `<span class="user">👤 ${user.user}</span>
               <button id="logoutBtn">Logout</button>`
            : `<button id="loginBtn">Login</button>`
        }
      </div>
    </nav>
  `;
}

export function bindNavEvents() {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loginBtn) loginBtn.onclick = login;
  if (logoutBtn) logoutBtn.onclick = logout;
}
