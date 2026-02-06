import { state } from "../state/store.js";

export function renderSidebar(onChange) {
  const el = document.getElementById("sidebar");

  el.innerHTML = `
    <h2>QVA Live Map</h2>

    <div class="section" data-open="true">
      <h3 class="section-header">Pilot Filters</h3>
      <div class="section-body">
        <label>Callsign</label>
        <input id="callsign" placeholder="DAL123" />

        <label>Aircraft</label>
        <input id="aircraft" placeholder="A320" />
      </div>
    </div>

    <div class="section" data-open="true">
      <h3 class="section-header">Route</h3>
      <div class="section-body">
        <label>Departure</label>
        <input id="dep" placeholder="KJFK" />

        <label>Arrival</label>
        <input id="arr" placeholder="KLAX" />
      </div>
    </div>

    <div class="section" data-open="true">
      <h3 class="section-header">Region</h3>
      <div class="section-body">
        <label>FIR</label>
        <input id="fir" placeholder="KZNY" />
      </div>
    </div>

    <div class="section" data-open="true">
      <h3 class="section-header">Options</h3>
      <div class="section-body">
        <label class="checkbox">
          <input type="checkbox" id="airborne" />
          Airborne only
        </label>
      </div>
    </div>
  `;

  // hook filters
  ["callsign","aircraft","dep","arr","fir"].forEach(id => {
    el.querySelector(`#${id}`).oninput = e => {
      state.filters[id] = e.target.value;
      onChange();
    };
  });

  el.querySelector("#airborne").onchange = e => {
    state.filters.airborneOnly = e.target.checked;
    onChange();
  };

  // collapsible behavior
  el.querySelectorAll(".section-header").forEach(header => {
    header.onclick = () => {
      const section = header.parentElement;
      const open = section.dataset.open === "true";
      section.dataset.open = (!open).toString();
    };
  });
}
