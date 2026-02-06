import { renderSidebar } from "./ui/sidebar.js";
import { state } from "./state/store.js";

/* ===== MAP SETUP ===== */
const map = L.map("map", {
  zoomControl: false
}).setView([20, 0], 2);

L.control.zoom({ position: "topright" }).addTo(map);

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  {
    attribution: "&copy; OpenStreetMap & CartoDB",
    maxZoom: 19
  }
).addTo(map);

/* ===== STATE ===== */
let pilots = [];
let markers = [];

/* ===== LOADING INDICATOR ===== */
const loadingEl = document.getElementById("loading");

/* ===== DATA FETCH ===== */
async function fetchVatsimPilots() {
  const res = await fetch("https://data.vatsim.net/v3/vatsim-data.json");
  const data = await res.json();
  return data.pilots || [];
}

/* ===== FILTERING ===== */
function applyFilters(list) {
  return list.filter(p => {
    if (state.filters.airborneOnly && p.groundspeed < 30) return false;
    if (state.filters.callsign && !p.callsign.includes(state.filters.callsign.toUpperCase())) return false;
    if (state.filters.aircraft && !p.flight_plan?.aircraft?.includes(state.filters.aircraft.toUpperCase())) return false;
    if (state.filters.dep && p.flight_plan?.departure !== state.filters.dep.toUpperCase()) return false;
    if (state.filters.arr && p.flight_plan?.arrival !== state.filters.arr.toUpperCase()) return false;
    if (state.filters.fir && !p.fir?.includes(state.filters.fir.toUpperCase())) return false;
    return true;
  });
}

/* ===== MARKERS ===== */
function clearMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
}

function renderMarkers(list) {
  clearMarkers();

  list.forEach(p => {
    const marker = L.circleMarker([p.latitude, p.longitude], {
      radius: 4,
      color: "#4da3ff",
      fillOpacity: 0.9
    }).addTo(map);

    marker.on("click", () => showPilotInfo(p));
    markers.push(marker);
  });
}

/* ===== PILOT PANEL ===== */
function showPilotInfo(pilot) {
  const panel = document.getElementById("pilot-panel");
  panel.innerHTML = `
    <h3>${pilot.callsign}</h3>
    <p><b>Aircraft:</b> ${pilot.flight_plan?.aircraft || "N/A"}</p>
    <p><b>Route:</b> ${pilot.flight_plan?.departure || "—"} → ${pilot.flight_plan?.arrival || "—"}</p>
    <p><b>Altitude:</b> ${pilot.altitude} ft</p>
    <p><b>Speed:</b> ${pilot.groundspeed} kts</p>
  `;
}

/* ===== REFRESH ===== */
async function refresh() {
  loadingEl.classList.remove("hidden");

  try {
    pilots = await fetchVatsimPilots();
    renderMarkers(applyFilters(pilots));
  } catch (err) {
    console.error("VATSIM fetch failed", err);
  } finally {
    loadingEl.classList.add("hidden");
  }
}

/* ===== INIT ===== */
renderSidebar(() => {
  renderMarkers(applyFilters(pilots));
});

refresh();
setInterval(refresh, 30000); // refresh every 30s
