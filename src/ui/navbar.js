export function renderNavbar() {
  return `
    <nav class="nav">
      <div class="nav-left">
        <a href="/pages/index.html" class="brand">Qantas VA</a>
        <a href="/pages/map.html">Map</a>
        <a href="/pages/dashboard.html">Dashboard</a>
        <a href="/pages/apply.html">Apply</a>
        <a href="/pages/staff.html">Staff</a>
      </div>
      <div class="nav-right">
        <button id="loginBtn">Login</button>
      </div>
    </nav>
  `;
}
