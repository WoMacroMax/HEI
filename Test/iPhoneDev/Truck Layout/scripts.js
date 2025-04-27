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

const addItemModal = new bootstrap.Modal(document.getElementById("addItemModal"));
const addItemForm = document.getElementById("addItemForm");
const newAreaSelect = document.getElementById("newArea");
const newAddress = document.getElementById("newAddress");
const newQuantity = document.getElementById("newQuantity");
const newAWAD = document.getElementById("newAWAD");

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
  if (savedAreas) AREA_NAMES = JSON.parse(savedAreas);
  if (savedStops) stops = JSON.parse(savedStops);
  if (!AREA_NAMES.length) AREA_NAMES = ["Area 1"];
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
    card.className = "area-card" + (selectedArea === area ? " selected" : "");
    card.innerHTML = `
      <div class="area-name">${area}</div>
      <div class="count">${totalQty} items</div>
    `;
    card.addEventListener("click", () => { lockArea(area); });
    card.addEventListener("dblclick", (e) => { e.preventDefault(); selectArea(area); });
    card.addEventListener("dragover", (e) => { e.preventDefault(); card.classList.add("area-hover"); });
    card.addEventListener("dragleave", () => { card.classList.remove("area-hover"); });
    card.addEventListener("drop", (e) => {
      e.preventDefault();
      const awadId = e.dataTransfer.getData("awad");
      if (awadId) moveStopToArea(awadId, area);
      card.classList.remove("area-hover");
    });
    areas.appendChild(card);
  });
}

function addArea() {
  AREA_NAMES.push(`Area ${AREA_NAMES.length + 1}`);
  saveAll();
  renderAreas();
}

function removeArea() {
  if (AREA_NAMES.length > 1) {
    const lastArea = AREA_NAMES[AREA_NAMES.length - 1];
    if (stops.some(s => s.area === lastArea)) {
      alert("Cannot remove an area that still contains items.");
      return;
    }
    if (confirm(`Remove "${lastArea}"?`)) {
      AREA_NAMES.pop();
      saveAll();
      renderAreas();
      renderStops();
    }
  } else {
    alert("At least one area must remain.");
  }
}

function lockArea(area) {
  lockedArea = area;
  renderStops();
}

function selectArea(area) {
  selectedArea = area;
  stopAddressInput.value = "";
  stopQuantityInput.value = "1";
  awadNumberInput.value = "";
  renderAreas();
  stopModal.show();
}

// ==========================
// STOPS
// ==========================
function renderStops() {
  const query = searchInput.value.toLowerCase();
  const filtered = stops.filter(s => {
    const matchesQuery = s.awad.toLowerCase().includes(query) || 
                         s.address.toLowerCase().includes(query) || 
                         s.area.toLowerCase().includes(query);
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

    label.setAttribute("draggable", "true");
    label.addEventListener("dragstart", function(e) {
      e.dataTransfer.setData("awad", stop.awad);
    });

    const span = document.createElement("span");
    span.className = "checklist-item";

    span.innerHTML = `
      <div class="row text-center align-items-center g-1">
        <div class="col-1">
          <input type="checkbox" ${stop.checked ? 'checked' : ''} onchange="toggleCheck(${index})" />
        </div>
        <div class="col-2 fw-bold">${stop.area}</div>
        <div class="col-2 editable awad" contenteditable="true">${stop.awad}</div>
        <div class="col-2">${stop.address}</div>
        <div class="col-2">Stop ${stop.number}</div>
        <div class="col-2 editable quantity" contenteditable="true">${stop.quantity}</div>
        <div class="col-1">
          <button class="btn btn-sm btn-danger delete-btn" onclick="deleteStop(${index})">X</button>
        </div>
      </div>
    `;

    span.querySelector(".awad").addEventListener("blur", function() {
      stops[index].awad = this.innerText.trim();
      saveAll();
    });

    span.querySelector(".quantity").addEventListener("blur", function() {
      const newQty = parseInt(this.innerText.trim());
      if (!isNaN(newQty) && newQty > 0) {
        stops[index].quantity = newQty;
        saveAll();
      }
    });

    label.appendChild(span);
    listItems.appendChild(label);
  });

  renderAreas();
  enableDragDrop();
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
// ADD ITEM MODAL
// ==========================
function openAddItemModal() {
  populateAreaDropdown();
  newAddress.value = "";
  newQuantity.value = 1;
  newAWAD.value = "";
  addItemModal.show();
}

function populateAreaDropdown() {
  newAreaSelect.innerHTML = "";
  AREA_NAMES.forEach(area => {
    const option = document.createElement("option");
    option.value = area;
    option.textContent = area;
    newAreaSelect.appendChild(option);
  });
}

addItemForm.addEventListener("submit", function(e) {
  e.preventDefault();
  stops.push({
    number: stops.length + 1,
    area: newAreaSelect.value,
    address: newAddress.value.trim(),
    quantity: parseInt(newQuantity.value),
    awad: newAWAD.value.trim(),
    checked: false
  });
  reassignNumbers();
  saveAll();
  renderStops();
  addItemModal.hide();
});

// ==========================
// ADD STOP MODAL (double-click Area)
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
// INITIALIZE
// ==========================
loadFromLocal();
renderAreas();
renderStops();
