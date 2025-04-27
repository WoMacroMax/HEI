// ==========================
// SETUP
// ==========================
const areas = document.getElementById("areas");
const listItems = document.getElementById("listItems");
const stopForm = document.getElementById("stopForm");
const stopModal = new bootstrap.Modal(document.getElementById("stopModal"));
const stopAddressInput = document.getElementById("stopAddress");
const stopQuantityInput = document.getElementById("stopQuantity");
const awadNumberInput = document.getElementById("awadNumber");
const searchInput = document.getElementById("searchInput");

const areaItemsModal = new bootstrap.Modal(document.getElementById("areaItemsModal"));
const areaItemsContent = document.getElementById("areaItemsContent");
const areaItemsModalLabel = document.getElementById("areaItemsModalLabel");

let AREA_NAMES = ["Area 1"];
let stops = [];
let selectedArea = null;
let sortAsc = true;
let sortField = "number";
let lockedArea = null;
let lastDeletedStop = null;

// ==========================
// SAVE & LOAD
// ==========================
function saveAll() {
  localStorage.setItem("areas", JSON.stringify(AREA_NAMES));
  localStorage.setItem("stops", JSON.stringify(stops));
  const toast = new bootstrap.Toast(document.getElementById('saveToast'));
  toast.show();
}

function loadFromLocal() {
  const savedAreas = localStorage.getItem("areas");
  const savedStops = localStorage.getItem("stops");
  if (savedAreas) {
    AREA_NAMES = JSON.parse(savedAreas);
    if (!AREA_NAMES.length) AREA_NAMES = ["Area 1"]; // Ensure "Area 1" exists
  } else {
    AREA_NAMES = ["Area 1"]; // Ensure "Area 1" exists
  }

  if (savedStops) {
    stops = JSON.parse(savedStops);
  } else {
    stops = [];
  }

  renderAreas();
  renderStops();
}

// ==========================
// AREAS
// ==========================
function renderAreas() {
  areas.innerHTML = "";
  AREA_NAMES.forEach(area => {
    const totalQty = stops.filter(s => s.area === area).reduce((sum, s) => sum + s.quantity, 0);
    const card = document.createElement("div");
    card.className = "area-card vertical"; // Default vertical layout
    card.innerHTML = `
      <div class="area-grid">
        <div class="area-name">${area}</div>
        <button class="btn btn-sm btn-outline-warning" onclick="renameAreaPrompt('${area}')">✎</button>
        <div class="count">${totalQty} items</div>
        <button class="btn btn-sm btn-outline-success" onclick="openAddStopModal('${area}')">➕ Add</button>
      </div>
      <div class="awad-list" id="awadList-${area}">
        <!-- AWAD list will be dynamically populated here -->
      </div>
    `;

    // Adding AWAD# links for this area
    const awadList = card.querySelector(`#awadList-${area}`);
    const awadLinks = stops.filter(s => s.area === area).map(stop => {
      return `<a href="#" onclick="scrollToStop(${stop.number})">${stop.awad}</a>`;
    }).join("");

    awadList.innerHTML = awadLinks;

    // Toggle between vertical and horizontal layout
    card.addEventListener("click", function () {
      toggleAreaLayout(area, card);
    });

    areas.appendChild(card);
  });
}

function renameAreaPrompt(oldName) {
  event.stopPropagation();
  const newName = prompt("Rename area:", oldName);
  if (newName && newName.trim() !== "" && !AREA_NAMES.includes(newName.trim())) {
    AREA_NAMES = AREA_NAMES.map(name => (name === oldName ? newName.trim() : name));
    stops.forEach(s => { if (s.area === oldName) s.area = newName.trim(); });
    saveAll();
    renderAreas();
    renderStops();
  }
}

function toggleAreaLayout(area, card) {
  if (card.classList.contains('vertical')) {
    card.classList.remove('vertical');
    card.classList.add('horizontal');
  } else {
    card.classList.remove('horizontal');
    card.classList.add('vertical');
  }
}

function openAddStopModal(area) {
  event.stopPropagation();
  selectedArea = area;
  stopAddressInput.value = "";
  stopQuantityInput.value = "1";
  awadNumberInput.value = "";
  stopModal.show();
}

function openAreaStops(area) {
  event.stopPropagation();
  const stopsInArea = stops.filter(s => s.area === area);
  areaItemsContent.innerHTML = "";

  stopsInArea.forEach(stop => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "p-2 mb-2 bg-secondary rounded";
    itemDiv.innerHTML = `
      <strong>Stop ${stop.number}</strong><br/>
      AWAD#: ${stop.awad}<br/>
      Address: ${stop.address}<br/>
      Quantity: ${stop.quantity}
    `;
    areaItemsContent.appendChild(itemDiv);
  });

  areaItemsModalLabel.textContent = `Area: ${area}`;
  areaItemsModal.show();
}

// ==========================
// STOPS
// ==========================
function renderStops() {
  const query = searchInput.value.toLowerCase();
  const filtered = stops.filter(s => {
    const matchesQuery = s.awad.toLowerCase().includes(query) || 
                         s.address.toLowerCase().includes(query) || 
                         s.area.toLowerCase().includes(query) ||
                         String(s.number).toLowerCase().includes(query); // Added check for Stop Number
    const matchesArea = lockedArea ? s.area === lockedArea : true;
    return matchesQuery && matchesArea;
  });

  const sorted = filtered.sort((a, b) => {
    if (!a[sortField] || !b[sortField]) return 0;
    return sortAsc
      ? String(a[sortField]).localeCompare(String(b[sortField]))
      : String(b[sortField]).localeCompare(String(a[sortField]));
  });

  listItems.innerHTML = "";
  sorted.forEach((stop, index) => {
    const label = document.createElement("label");
    label.className = stop.checked ? "checked" : "unchecked";

    const span = document.createElement("span");
    span.className = "checklist-item";

    span.innerHTML = `
      <div class="row text-center align-items-center g-1">
        <div class="col-1">
          <input type="checkbox" ${stop.checked ? 'checked' : ''} onchange="toggleCheck(${index})" />
        </div>
        <div class="col-2 fw-bold">${stop.area}</div>
        <div class="col-2">Stop ${stop.number}</div>
        <div class="col-2 editable awad" contenteditable="true">${stop.awad}</div>
        <div class="col-3" contenteditable="false">${stop.address}</div>
        <div class="col-1 editable quantity" contenteditable="true">${stop.quantity}</div>
        <div class="col-1">
          <button class="btn btn-sm btn-danger delete-btn" onclick="deleteStop(${index})">X</button>
        </div>
      </div>
    `;

    // Add listener to trigger long-tap copy on address field
    span.querySelector(".col-3").addEventListener("touchstart", function(e) {
      const touchStart = Date.now();

      span.querySelector(".col-3").addEventListener("touchend", function(e) {
        const touchEnd = Date.now();
        if (touchEnd - touchStart > 500) { // Detect long tap (500ms)
          copyAddressToClipboard(stop.address);
        }
      });
    });

    label.appendChild(span);
    listItems.appendChild(label);
  });

  renderAreas();
  enableDragDrop();
  enableLongTapCopy();  // Re-enable long-tap copying after rendering the stops
}

function toggleCheck(index) {
  stops[index].checked = !stops[index].checked;
  saveAll();
  renderStops();
}

function deleteStop(index) {
  if (confirm(`Delete Stop ${stops[index].number}?`)) {
    lastDeletedStop = stops[index];
    stops.splice(index, 1);
    reassignNumbers();
    saveAll();
    renderStops();
  }
}

function reassignNumbers() {
  stops.forEach((stop, index) => {
    stop.number = index + 1;
  });
}

function moveStopToArea(awadId, newArea) {
  stops.forEach(stop => {
    if (stop.awad === awadId) {
      stop.area = newArea;
    }
  });
  reassignNumbers();
  saveAll();
  renderStops();
}

// ==========================
// SORT and DELETE
// ==========================
function toggleSort() { sortField = "number"; sortAsc = !sortAsc; renderStops(); }
function toggleSortAddress() { sortField = "address"; sortAsc = !sortAsc; renderStops(); }
function toggleSortQuantity() { sortField = "quantity"; sortAsc = !sortAsc; renderStops(); }
function toggleSortAWAD() { sortField = "awad"; sortAsc = !sortAsc; renderStops(); }

function deleteSelected() {
  if (confirm("Delete selected stops?")) {
    stops = stops.filter(stop => !stop.checked);
    reassignNumbers();
    saveAll();
    renderStops();
  }
}

// ==========================
// UNDO DELETE
// ==========================
function undoDelete() {
  if (lastDeletedStop) {
    stops.push(lastDeletedStop);
    lastDeletedStop = null;
    reassignNumbers();
    saveAll();
    renderStops();
  } else {
    alert("No recently deleted stop to undo.");
  }
}

// ==========================
// DRAG & DROP
// ==========================
function enableDragDrop() {
  Sortable.create(listItems, {
    animation: 150,
    onEnd: function () {
      const newStops = [];
      const labels = Array.from(listItems.querySelectorAll("label"));
      labels.forEach(label => {
        const awadSpan = label.querySelector(".awad");
        if (awadSpan) {
          const awadText = awadSpan.textContent.trim();
          const stop = stops.find(s => s.awad === awadText);
          if (stop) newStops.push(stop);
        }
      });
      stops = newStops;
      reassignNumbers();
      saveAll();
    }
  });
}

// ==========================
// STOP FORM (Double-click Add)
/* ========================= */
stopForm.addEventListener("submit", function(e) {
  e.preventDefault();
  stops.push({
    number: stops.length + 1,
    area: selectedArea || AREA_NAMES[0],
    address: stopAddressInput.value.trim(),
    quantity: parseInt(stopQuantityInput.value),
    awad: awadNumberInput.value.trim(),
    checked: false
  });
  reassignNumbers();
  saveAll();
  renderStops();
  stopModal.hide();
});

// ==========================
// LONG-TAP TO COPY ADDRESS
// ==========================
function enableLongTapCopy() {
  const stopItems = document.querySelectorAll(".checklist-item");

  stopItems.forEach(item => {
    const addressElement = item.querySelector(".col-3");  // The address column in each stop

    addressElement.addEventListener("touchstart", function(e) {
      // Track the touch start time
      const touchStart = Date.now();

      // When touch ends, check if it was long press
      addressElement.addEventListener("touchend", function(e) {
        const touchEnd = Date.now();
        if (touchEnd - touchStart > 500) {  // Long press duration (500ms)
          copyAddressToClipboard(addressElement.textContent.trim());
        }
      });
    });
  });
}

// Function to copy text to clipboard
function copyAddressToClipboard(address) {
  navigator.clipboard.writeText(address).then(() => {
    const copyToast = new bootstrap.Toast(document.getElementById('copyToast'));
    copyToast.show();
  }).catch(err => {
    console.error('Failed to copy address: ', err);
  });
}

// ==========================
// INITIALIZE
// ==========================
loadFromLocal();
renderAreas();
renderStops();
