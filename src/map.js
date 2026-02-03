import L from "leaflet";

let map;
let markers = [];

export function initMap() {
  map = L.map("map").setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  return map;
}

export function clearMarkers() {
  markers.forEach(m => m.remove());
  markers = [];
}

export function renderMarkers(pilots) {
  clearMarkers();

  pilots.forEach(p => {
    const m = L.marker([p.lat, p.lon])
      .addTo(map)
      .bindPopup(`
        <b>${p.callsign}</b><br>
        ${p.dep} → ${p.arr}<br>
        ${p.aircraft}<br>
        FL${Math.floor(p.altitude / 100)}
      `);
    markers.push(m);
  });
}
