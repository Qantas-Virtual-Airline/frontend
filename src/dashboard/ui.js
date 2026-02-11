import { getPilotStats, getRecentFlights } from "./data.js";
import { isLoggedIn } from "../auth/auth.js";

if (!isLoggedIn()) {
  window.location.href = "/pages/index.html";
}

const stats = getPilotStats();

document.getElementById("totalFlights").textContent = stats.flights;
document.getElementById("totalHours").textContent = stats.hours.toFixed(1);
document.getElementById("rank").textContent = stats.rank;

const table = document.getElementById("flightsTable");
getRecentFlights().forEach(f => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${f.callsign}</td>
    <td>${f.route}</td>
    <td>${f.hours}</td>
    <td>${f.date}</td>
  `;
  table.appendChild(row);
});
