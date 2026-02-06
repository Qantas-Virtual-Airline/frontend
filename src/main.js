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
let selectedMarker = null;

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
  selectedMarker = null;
}

function renderMarkers(list) {
  clearMarkers();

  list.forEach(p => {
    const heading = p.heading ?? 0;

    const icon = L.divIcon({
      className: "",
      html: `
        <div
          class="aircraft-icon"
          style="transform: rotate(${heading}deg)"
        ></div>
      `,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });

    const marker = L.marker([p.latitude, p.longitude], { icon }).addTo(map);

    marker.on("click", () => {
      // remove previous selection
      if (selectedMarker) {
        selectedMarker
          .getElement()
          ?.querySelector(".aircraft-icon")
          ?.classList.remove("aircraft-selected");
        selectedMarker.setZIndexOffset(0);
      }

      // set new selection
      selectedMarker = marker;
      marker
        .getElement()
        ?.querySelector(".aircraft-icon")
        ?.classList.add("aircraft-selected");

      marker.setZIndexOffset(1000);
      showPilotInfo(p);
    });

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
    <p><b>Heading:</b> ${pilot.heading ?? "—"}°</p>
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
setInterval(refresh, 30000);
