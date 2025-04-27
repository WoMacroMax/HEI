// =========================
// Variables and Setup
// =========================

const areas = document.getElementById("areas");
const listItems = document.getElementById("listItems");
const stopForm = document.getElementById("stopForm");
const stopModal = new bootstrap.Modal(document.getElementById("stopModal"));
const stopAddressInput = document.getElementById("stopAddress");
const stopQuantityInput = document.getElementById("stopQuantity");
const awadNumberInput = document.getElementById("awadNumber");
const searchInput = document.getElementById("searchInput");

let AREA_NAMES = ["Area 1"];
let stops = [];
let selectedArea = null;
let sortAsc = true;
let sortField = "number";
let lockedArea = null;

// =========================
// Functions
// =========================

// Save All
function saveAll() {
  localStorage.setItem("areas", JSON.stringify(AREA_NAMES));
  localStorage.setItem("stops", JSON.stringify(stops));
  const toast = new bootstrap.Toast(document.getElementById('saveToast'));
  toast.show();
}

// Load from Local Storage
function loadFromLocal() {
  const savedAreas = localStorage.getItem("areas");
  const savedStops = localStorage.getItem("stops");
  if (savedAreas) AREA_NAMES = JSON.parse(savedAreas);
  if (savedStops) stops = JSON.parse(savedStops);
  renderAreas();
  renderStops();
}

// Reassign Stop Numbers
function reassignNumbers() {
  stops.forEach((stop, index) => {
    stop.number = index + 1;
  });
}

// Add New Area
function addArea() {
  AREA_NAMES.push(`Area ${AREA_NAMES.length + 1}`);
  saveAll();
  renderAreas();
}

// Remove Last Area (only if empty)
function removeArea() {
  if (AREA_NAMES.length > 1) {
    const lastArea = AREA_NAMES[AREA_NAMES.length - 1];
    if (stops.some(s => s.area === lastArea)) {
      alert("Cannot remove an area that still contains items.");
      return;
    }
    if (confirm(`Are you sure you want to remove "${lastArea}"?`)) {
      AREA_NAMES.pop();
      saveAll();
      renderAreas();
      renderStops();
    }
  } else {
    alert("At least one area must remain.");
  }
}

// Render Areas
function renderAreas() {
  areas.innerHTML = "";
  AREA_NAMES.forEach((area, index) => {
    const totalQty = stops.filter(s => s.area === area).reduce((sum, s) => sum + s.quantity, 0);
    const card = document.createElement("div");
    card.className = "area-card" + (selectedArea === area ? " selected" : "");
    card.innerHTML = `
      <span class="area-name" contenteditable="true"
        onblur="renameArea(${index}, this.textContent)"
        onkeydown="if(event.key==='Enter'){event.preventDefault(); this.blur();}">${area}</span>
      <div class="count">${totalQty} items</div>
    `;
    card.addEventListener("click", () => { lockArea(area); });
    card.addEventListener("dblclick", (e) => { e.preventDefault(); selectArea(area); });
    card.addEventListener("dragover", (e) => { e.preventDefault(); card.classList.add("area-hover"); });
    card.addEventListener("dragleave", () => { card.classList.remove("area-hover"); });
    card.addEventListener("drop", (e) => {
      e.preventDefault();
      const awadId = e.dataTransfer.getData("text/plain");
      moveStopToArea(awadId, area);
      card.classList.remove("area-hover");
    });
    areas.appendChild(card);
  });
}

// Lock View to Area
function lockArea(area) {
  lockedArea = area;
  renderStops();
}

// Open Modal to Add Stop
function selectArea(area) {
  selectedArea = area;
  stopAddressInput.value = "";
  stopQuantityInput.value = "1";
  awadNumberInput.value = "";
  renderAreas();
  stopModal.show();
}

// Rename Area
function renameArea(index, newName) {
  const old = AREA_NAMES[index];
  newName = newName.trim();
  if (newName && !AREA_NAMES.includes(newName)) {
    AREA_NAMES[index] = newName;
    stops.forEach(s => { if (s.area === old) s.area = newName; });
    saveAll();
    renderAreas();
    renderStops();
  }
}

// Render Stops
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

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerText = "X";
    deleteBtn.onclick = function (e) {
      e.stopPropagation();
      if (confirm(`Delete Stop ${stop.number}?`)) {
        stops = stops.filter(s => s.awad !== stop.awad);
        reassignNumbers();
        saveAll();
        renderStops();
      }
    };

    label.setAttribute("draggable", "true");
    label.addEventListener("dragstart", function(e) {
      e.dataTransfer.setData("text/plain", stop.awad);
    });

    let holdTimer;
    label.addEventListener("mousedown", function() {
      holdTimer = setTimeout(() => {
        navigator.clipboard.writeText(stop.address)
          .then(() => {
            const toast = new bootstrap.Toast(document.getElementById('copyToast'));
            toast.show();
          });
      }, 600);
    });
    label.addEventListener("mouseup", function() { clearTimeout(holdTimer); });
    label.addEventListener("mouseleave", function() { clearTimeout(holdTimer); });

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = stop.checked;
    checkbox.style.marginBottom = "0.5rem";
    checkbox.addEventListener("change", function () {
      stop.checked = checkbox.checked;
      label.classList.toggle("checked", checkbox.checked);
      label.classList.toggle("unchecked", !checkbox.checked);
      saveAll();
    });

    const span = document.createElement("span");
    span.className = "checklist-item";
    span.innerHTML = `
      Stop ${stop.number} (${stop.area}): ${stop.address}<br>
      <span class="quantity-edit">Qty: ${stop.quantity}</span><br>
      <span class="awad-edit">AWAD#: ${stop.awad}</span>
    `;
    // ✅ Allow clicking the span to edit the stop
    span.addEventListener("click", function(e) {
      e.stopPropagation();
      editStop(index);
    });

    label.appendChild(deleteBtn);
    label.appendChild(checkbox);
    label.appendChild(span);
    listItems.appendChild(label);
  });

  renderAreas();
  enableDragDrop();
}

// Edit the full Stop (address, quantity, awad)
function editStop(index) {
  const newAddress = prompt("Edit Address:", stops[index].address);
  if (newAddress && newAddress.trim() !== "") {
    stops[index].address = newAddress.trim();
  }
  const newQty = prompt("Edit Quantity:", stops[index].quantity);
  if (newQty && !isNaN(newQty) && parseInt(newQty) > 0) {
    stops[index].quantity = parseInt(newQty);
  }
  const newAWAD = prompt("Edit AWAD#:", stops[index].awad);
  if (newAWAD && newAWAD.trim() !== "") {
    stops[index].awad = newAWAD.trim();
  }
  saveAll();
  renderStops();
}

// Enable Drag-Drop Sort
function enableDragDrop() {
  Sortable.create(listItems, {
    animation: 150,
    onEnd: function () {
      const newStops = [];
      const labels = Array.from(listItems.querySelectorAll("label"));
      labels.forEach(label => {
        const awadSpan = label.querySelector(".awad-edit");
        if (awadSpan) {
          const awadText = awadSpan.textContent.replace("AWAD#: ", "").trim();
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

// Move Stop to New Area
function moveStopToArea(awadId, newArea) {
  stops.forEach(stop => {
    if (stop.awad === awadId) {
      stop.area = newArea;
    }
  });
  saveAll();
  renderStops();
}

// Toggle Sorts
function toggleSort() { sortField = "number"; sortAsc = !sortAsc; renderStops(); }
function toggleSortAddress() { sortField = "address"; sortAsc = !sortAsc; renderStops(); }
function toggleSortQuantity() { sortField = "quantity"; sortAsc = !sortAsc; renderStops(); }
function toggleSortAWAD() { sortField = "awad"; sortAsc = !sortAsc; renderStops(); }

// Delete Selected Checked Stops
function deleteSelected() {
  if (confirm("Are you sure you want to delete the selected stops?")) {
    stops = stops.filter(stop => {
      const label = Array.from(listItems.children).find(l => l.innerText.includes(stop.awad));
      if (label) {
        const checkbox = label.querySelector("input[type='checkbox']");
        return !(checkbox && checkbox.checked);
      }
      return true;
    });
    reassignNumbers();
    saveAll();
    renderStops();
  }
}

// =========================
// Initialize
// =========================

loadFromLocal();
renderAreas();
renderStops();
