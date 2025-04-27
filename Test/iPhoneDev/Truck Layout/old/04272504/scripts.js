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
let lockedArea = null;
let lockedAWAD = null;
let sortAsc = true;
let sortField = "number";
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
  }
  if (savedStops) {
    stops = JSON.parse(savedStops);
  }
  renderAreas();
  renderStops();
}

// ==========================
// AREAS
// ==========================
function addArea() {
  const name = prompt("Enter new Area name:");
  if (name && !AREA_NAMES.includes(name.trim())) {
    AREA_NAMES.push(name.trim());
    saveAll();
    renderAreas();  // <-- Add this
    renderStops();  // <-- Add this
  }
}

function removeArea() {
  const name = prompt("Enter Area name to remove:");
  if (name && AREA_NAMES.includes(name.trim())) {
    if (confirm(`Really remove Area "${name.trim()}" and its stops?`)) {
      AREA_NAMES = AREA_NAMES.filter(a => a !== name.trim());
      stops = stops.filter(s => s.area !== name.trim());
      saveAll();
      renderAreas();
      renderStops();
    }
  }
}

function renderAreas() {
  areas.innerHTML = "";
  const layouts = JSON.parse(localStorage.getItem('areaLayouts') || '{}');

  AREA_NAMES.forEach(area => {
    const totalQty = stops.filter(s => s.area === area).reduce((sum, s) => sum + s.quantity, 0);
    const card = document.createElement("div");
    card.className = "area-card square";
    card.setAttribute('data-area', area);

    card.innerHTML = `
      <div class="area-grid">
        <div class="d-flex justify-content-between align-items-center">
          <div class="area-name">${area}</div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-warning" onclick="renameAreaPrompt('${area}')">✎</button>
            <button class="btn btn-sm btn-outline-info" onclick="pivotAreaCard(this)"><i class="bi bi-arrow-repeat"></i></button>
            <button class="btn btn-sm btn-outline-success" onclick="openAddStopModal('${area}')">➕</button>
          </div>
        </div>
        <div class="count mt-2">${totalQty} items</div>
      </div>
      <div class="awad-list mt-2" id="awadList-${area}"></div>
    `;

    card.addEventListener('click', (e) => {
      if (!e.target.closest('button')) {
        lockedArea = area;
        lockedAWAD = null;
        renderStops();
      }
    });

    card.addEventListener('dragover', (e) => e.preventDefault());
    card.addEventListener('drop', (e) => {
      e.preventDefault();
      const awad = e.dataTransfer.getData('text/plain');
      moveStopToArea(awad, area);
    });

    if (layouts[area] === "horizontal") {
      card.classList.remove('square');
      card.classList.add('horizontal');
      const pivotButton = card.querySelector('.btn-outline-info i');
      if (pivotButton) pivotButton.className = "bi bi-arrows-expand";
    }

    const awadList = card.querySelector(`#awadList-${area}`);
    awadList.innerHTML = stops.filter(s => s.area === area)
      .map(stop => `<a href="#" onclick="lockAWAD('${stop.awad}')">${stop.awad}</a>`)
      .join("");

    areas.appendChild(card);
  });

  enableAreaDragDrop();
}

function renameAreaPrompt(oldName) {
  event.stopPropagation();
  const newName = prompt("Rename area:", oldName);
  if (newName && newName.trim() !== "" && !AREA_NAMES.includes(newName.trim())) {
    AREA_NAMES = AREA_NAMES.map(name => (name === oldName ? newName.trim() : name));
    stops.forEach(s => { if (s.area === oldName) s.area = newName.trim(); });

    let layouts = JSON.parse(localStorage.getItem('areaLayouts') || '{}');
    if (layouts[oldName]) {
      layouts[newName.trim()] = layouts[oldName];
      delete layouts[oldName];
      localStorage.setItem('areaLayouts', JSON.stringify(layouts));
    }

    saveAll();
    renderAreas();
    renderStops();
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

function pivotAreaCard(button) {
  event.stopPropagation();
  const card = button.closest('.area-card');
  const rotateIcon = button.querySelector('i');
  const areaName = card.querySelector('.area-name')?.textContent?.trim();

  card.classList.add('pivoting');
  setTimeout(() => card.classList.remove('pivoting'), 400);

  if (card.classList.contains('square')) {
    card.classList.remove('square');
    card.classList.add('horizontal');
    if (rotateIcon) rotateIcon.className = "bi bi-arrows-expand";
    saveAreaLayout(areaName, "horizontal");
  } else {
    card.classList.remove('horizontal');
    card.classList.add('square');
    if (rotateIcon) rotateIcon.className = "bi bi-arrow-repeat";
    saveAreaLayout(areaName, "square");
  }
}

function saveAreaLayout(area, layout) {
  let layouts = JSON.parse(localStorage.getItem('areaLayouts') || '{}');
  layouts[area] = layout;
  localStorage.setItem('areaLayouts', JSON.stringify(layouts));
}

// ==========================
// STOPS
// ==========================
function renderStops() {
  let stopsToShow = [];

  if (lockedAWAD) {
    stopsToShow = stops.filter(s => s.awad === lockedAWAD);
  } else if (lockedArea) {
    stopsToShow = stops.filter(s => s.area === lockedArea);
  } else {
    const query = searchInput.value.toLowerCase();
    stopsToShow = stops.filter(s => 
      s.awad.toLowerCase().includes(query) ||
      s.address.toLowerCase().includes(query) ||
      s.area.toLowerCase().includes(query) ||
      String(s.number).includes(query)
    );
  }

  const sorted = stopsToShow.sort((a, b) => {
    if (!a[sortField] || !b[sortField]) return 0;
    return sortAsc
      ? String(a[sortField]).localeCompare(String(b[sortField]))
      : String(b[sortField]).localeCompare(String(a[sortField]));
  });

  listItems.innerHTML = "";

  if (lockedAWAD || lockedArea) {
    listItems.innerHTML += `
      <div class="text-center mb-3">
        <button class="btn btn-warning btn-sm" onclick="clearFilters()">Clear Filter</button>
      </div>
    `;
  }

  sorted.forEach((stop, index) => {
    const label = document.createElement("label");
    label.className = stop.checked ? "checked" : "unchecked";

    label.setAttribute('draggable', 'true');
    label.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', stop.awad);
    });

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
        <div class="col-3 address-copy" contenteditable="false">${stop.address}</div>
        <div class="col-1 editable quantity" contenteditable="true">${stop.quantity}</div>
        <div class="col-1">
          <button class="btn btn-sm btn-danger" onclick="deleteStop(${index})">X</button>
        </div>
      </div>
    `;

    label.appendChild(span);
    listItems.appendChild(label);

    // Long-tap address copy
    const addressField = span.querySelector(".address-copy");
    addressField.addEventListener("touchstart", function(e) {
      const touchStart = Date.now();
      addressField.addEventListener("touchend", function(e) {
        const touchEnd = Date.now();
        if (touchEnd - touchStart > 500) {
          copyTextToClipboard(addressField.textContent.trim());
        }
      }, { once: true });
    });
  });

  enableStopDragDrop();
}

function moveStopToArea(awad, newArea) {
  stops.forEach(stop => {
    if (stop.awad === awad) {
      stop.area = newArea;
    }
  });
  reassignNumbers();
  saveAll();
  renderAreas();
  renderStops();
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

function deleteSelected() {
  if (confirm("Delete selected stops?")) {
    stops = stops.filter(stop => !stop.checked);
    reassignNumbers();
    saveAll();
    renderStops();
  }
}

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
// OTHER BUTTON FUNCTIONS
// ==========================
function clearFilters() {
  lockedAWAD = null;
  lockedArea = null;
  renderStops();
}

function toggleSort() {
  sortField = "number";
  sortAsc = !sortAsc;
  renderStops();
}

function toggleSortAddress() {
  sortField = "address";
  sortAsc = !sortAsc;
  renderStops();
}

function toggleSortQuantity() {
  sortField = "quantity";
  sortAsc = !sortAsc;
  renderStops();
}

function toggleSortAWAD() {
  sortField = "awad";
  sortAsc = !sortAsc;
  renderStops();
}

function exportCSV() {
  // Placeholder - coming up
}

function exportPDF() {
  // Placeholder - coming up
}

function copyAllAddresses() {
  const addresses = stops.map(s => s.address.trim()).filter(Boolean);
  copyTextToClipboard(addresses.join("\n"));
}

function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    const copyToast = new bootstrap.Toast(document.getElementById('copyToast'));
    copyToast.show();
  });
}

// ==========================
// DRAG AND DROP
// ==========================
function enableAreaDragDrop() {
  Sortable.create(areas, {
    animation: 150,
    onEnd: function () {
      const newAreaOrder = Array.from(areas.children).map(card => card.getAttribute('data-area'));
      AREA_NAMES = newAreaOrder;
      saveAll();
      renderAreas();
      renderStops();
    }
  });
}

function enableStopDragDrop() {
  Sortable.create(listItems, {
    animation: 150,
    onEnd: function () {
      const labels = Array.from(listItems.querySelectorAll("label"));
      const newStops = [];

      labels.forEach(label => {
        const awad = label.querySelector('.awad')?.textContent.trim();
        const stop = stops.find(s => s.awad === awad);
        if (stop) newStops.push(stop);
      });

      stops = newStops;
      reassignNumbers();
      saveAll();
    }
  });
}

// ==========================
// STOP FORM SUBMIT
// ==========================
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
