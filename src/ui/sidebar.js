import { state } from "../state/store.js";

export function renderSidebar(onChange) {
  const sidebar = document.getElementById("sidebar");

  sidebar.innerHTML = `
    <h2>Filters</h2>

    <label>
      <input type="checkbox" id="filter-airborne" />
      Airborne only
    </label>

    <input id="filter-callsign" placeholder="Callsign" />
    <input id="filter-aircraft" placeholder="Aircraft (A320)" />
    <input id="filter-dep" placeholder="Departure (YSSY)" />
    <input id="filter-arr" placeholder="Arrival (KLAX)" />

    <select id="filter-altitude">
      <option value="">All Altitudes</option>
      <option value="LOW">Low (&lt; 10,000)</option>
      <option value="CRUISE">Cruise (10,000–29,999)</option>
      <option value="HIGH">High (30,000+)</option>
    </select>
  `;

  document.getElementById("filter-airborne").addEventListener("change", e => {
    state.filters.airborneOnly = e.target.checked;
    onChange();
  });

  document.getElementById("filter-callsign").addEventListener("input", e => {
    state.filters.callsign = e.target.value;
    onChange();
  });

  document.getElementById("filter-aircraft").addEventListener("input", e => {
    state.filters.aircraft = e.target.value;
    onChange();
  });

  document.getElementById("filter-dep").addEventListener("input", e => {
    state.filters.dep = e.target.value;
    onChange();
  });

  document.getElementById("filter-arr").addEventListener("input", e => {
    state.filters.arr = e.target.value;
    onChange();
  });

  document.getElementById("filter-altitude").addEventListener("change", e => {
    state.filters.altitudeBand = e.target.value;
    onChange();
  });
}
