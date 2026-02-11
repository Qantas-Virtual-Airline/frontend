const map = L.map("map").setView([-25, 135], 4);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 10,
  attribution: "© OpenStreetMap"
}).addTo(map);

const aircraftLayer = L.layerGroup().addTo(map);
const trailLayer = L.layerGroup().addTo(map);
const labelLayer = L.layerGroup().addTo(map);

const trails = {};

async function loadFIR() {
  const res = await fetch("../src/map/fir-au.json");
  const fir = await res.json();

  L.geoJSON(fir, {
    style: { color: "#00c2ff", weight: 2, fillOpacity: 0.05 }
  }).addTo(map);
}

function altitudeColor(flightLevel = 0) {
  if (flightLevel < 100) return "#00ff6a";   // low
  if (flightLevel < 250) return "#ffd000";   // medium
  return "#ff4d4d";                          // high
}

function aircraftIcon(heading, flightLevel) {
  const color = altitudeColor(flightLevel);

  return L.divIcon({
    className: "aircraft-icon",
    html: `
      <svg width="26" height="26" viewBox="0 0 24 24"
           style="transform: rotate(${heading}deg)">
        <path fill="${color}"
          d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9L2 14v2l8-2.5V19l-2 1.5V22l3-1 3 1v-1.5L13 19v-5.5z"/>
      </svg>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
}

async function loadVatsim() {
  aircraftLayer.clearLayers();
  trailLayer.clearLayers();
  labelLayer.clearLayers();

  const res = await fetch("https://data.vatsim.net/v3/vatsim-data.json");
  const data = await res.json();

  const pilots = data.pilots.filter(p => p.callsign.startsWith("QFA"));

  pilots.forEach(p => {
    if (!p.latitude || !p.longitude) return;

    // Trails
    if (!trails[p.callsign]) trails[p.callsign] = [];
    trails[p.callsign].push([p.latitude, p.longitude]);
    trails[p.callsign] = trails[p.callsign].slice(-25);

    L.polyline(trails[p.callsign], {
      color: "#ffb000",
      weight: 2,
      opacity: 0.6
    }).addTo(trailLayer);

    // Aircraft icon (altitude colored)
    L.marker([p.latitude, p.longitude], {
      icon: aircraftIcon(p.heading ?? 0, p.flight_level ?? 0)
    })
      .bindPopup(`
        <strong>${p.callsign}</strong><br/>
        ${p.departure} → ${p.arrival}<br/>
        FL${p.flight_level}<br/>
        HDG ${p.heading ?? "—"}°
      `)
      .addTo(aircraftLayer);

    // Callsign label
    L.marker([p.latitude, p.longitude], {
      icon: L.divIcon({
        className: "aircraft-label",
        html: p.callsign,
        iconSize: [60, 16],
        iconAnchor: [30, -18]
      })
    }).addTo(labelLayer);
  });
}

loadFIR();
loadVatsim();
setInterval(loadVatsim, 30000);
