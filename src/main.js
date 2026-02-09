/* ===== MAP SETUP ===== */
const map = L.map("map", { zoomControl: false }).setView([20, 0], 2);
L.control.zoom({ position: "topright" }).addTo(map);

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  { attribution: "&copy; OpenStreetMap & CartoDB", maxZoom: 19 }
).addTo(map);

/* ===== STATE ===== */
let firLayer = null;

/* ===== FIR TOGGLE (ADSBEXCHANGE DIRECT) ===== */
async function toggleFIR(show) {
  if (show && !firLayer) {
    const res = await fetch(
      "https://data.adsbexchange.com/firs.geojson"
    );
    const geo = await res.json();

    firLayer = L.geoJSON(geo, {
      style: feature => ({
        color: "#00ffff",
        weight: 1,
        opacity: 0.6,
        fillOpacity: 0
      }),
      onEachFeature: (feature, layer) => {
        const name =
          feature.properties?.name ||
          feature.properties?.icao ||
          "FIR";
        layer.bindTooltip(name, {
          sticky: true,
          direction: "center",
          className: "fir-tooltip"
        });
      }
    }).addTo(map);
  }

  if (!show && firLayer) {
    map.removeLayer(firLayer);
    firLayer = null;
  }
}

/* ===== UI HOOK ===== */
/* assumes you have a checkbox like:
   <input type="checkbox" id="firToggle">
*/
const firToggle = document.getElementById("firToggle");
if (firToggle) {
  firToggle.addEventListener("change", e => {
    toggleFIR(e.target.checked);
  });
}
