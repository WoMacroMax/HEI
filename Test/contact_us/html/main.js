import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getFirestore, doc, setDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

// ================== Firebase Setup ==================
const firebaseConfig = {
  apiKey: "AIzaSyCKpH3zexEOTDhZZ_GZc__ZZ20uyvnjAXM",
  authDomain: "womacromax-automation.firebaseapp.com",
  projectId: "womacromax-automation",
  storageBucket: "womacromax-automation.appspot.com",
  messagingSenderId: "50651858310",
  appId: "1:50651858310:web:411bc4aa3d8085b7b85807",
  measurementId: "G-D3HT2LSMT8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================== Constants & References ==================
const baseUrl = 'https://inquiries.womacromax.com/contactForm.html?message=';
const table = document.querySelector('#inputTable tbody');
const urlOutput = document.getElementById('urlOutput');
const urlLabel = document.getElementById('urlLabel');
const copyBtn = document.getElementById('copyBtn');
const sendBtn = document.getElementById('sendBtn');
const mainForm = document.getElementById('mainForm');
const MAX_URL_LENGTH = 2000;
const WARN_THRESHOLD = 1800;
let fullUrl = '';

// ================== Functions ==================

function generateGUID(ts, item, value) {
  return btoa(`${ts}|${item}|${value}`).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
}

function getSelectedFormat() {
  return document.querySelector('input[name="format"]:checked')?.value || 'bullet';
}

function updateUrls() {
  const rows = document.querySelectorAll('#inputTable tbody tr');
  const selectedRows = Array.from(rows).map(row => {
    const check = row.querySelector('.check-input')?.checked;
    const item = row.querySelector('.item-input')?.value.trim();
    const value = row.querySelector('.value-input')?.value.trim();
    return check && item ? { item, value } : null;
  }).filter(Boolean);

  if (selectedRows.length === 0) {
    fullUrl = '';
    urlOutput.textContent = '';
    copyBtn.disabled = true;
    sendBtn.disabled = true;
    return;
  }

  let messageText = '';
  if (getSelectedFormat() === 'bullet') {
    messageText = selectedRows.map(r => `• ${r.item}: ${r.value}`).join('\n');
  } else {
    const header = '| Item       | Value     |';
    const divider = '|------------|-----------|';
    const rows = selectedRows.map(r =>
      `| ${r.item.padEnd(10).slice(0, 10)} | ${r.value.padEnd(9).slice(0, 9)} |`);
    messageText = [header, divider, ...rows].join('\n');
  }

  fullUrl = baseUrl + encodeURIComponent(messageText);
  urlOutput.textContent = fullUrl;
  urlLabel.classList.toggle('warning', fullUrl.length > WARN_THRESHOLD);
  const valid = fullUrl.length <= MAX_URL_LENGTH;
  copyBtn.disabled = !valid;
  sendBtn.disabled = !valid;
}

function createRow() {
  const row = document.createElement('tr');
  const ts = new Date().toISOString();

  row.innerHTML = `
    <td><input type="checkbox" class="form-check-input check-input"></td>
    <td><input type="text" class="form-control item-input"></td>
    <td><input type="text" class="form-control value-input"></td>
    <td class="device-cell small-text"></td>
    <td class="ip-cell small-text"></td>
    <td class="timestamp-cell small-text">${ts}</td>
    <td class="guid-cell small-text"></td>
    <td><a class="preview-link small-text" target="_blank" style="display:none">Open</a></td>
    <td><button class="btn btn-sm btn-danger delete-btn">Delete</button></td>
  `;

  const itemInput = row.querySelector('.item-input');
  const valueInput = row.querySelector('.value-input');
  const checkbox = row.querySelector('.check-input');
  const guidCell = row.querySelector('.guid-cell');
  const deviceCell = row.querySelector('.device-cell');
  const ipCell = row.querySelector('.ip-cell');
  const preview = row.querySelector('.preview-link');

  const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
  deviceCell.textContent = deviceType;

  fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(data => { ipCell.textContent = data.ip; });

  const save = async () => {
    const item = itemInput.value.trim();
    const value = valueInput.value.trim();
    if (!item) return;
    const guid = generateGUID(ts, item, value);
    guidCell.textContent = guid;
    preview.href = value;
    preview.style.display = value.startsWith('http') ? 'inline' : 'none';

    await setDoc(doc(db, 'transactions', guid), {
      item, value, timestamp: ts, guid,
      device: deviceCell.textContent,
      ip: ipCell.textContent,
      updatedAt: new Date().toISOString()
    });

    row.classList.add('saved-row');
    updateUrls();
  };

  itemInput.addEventListener('input', save);
  valueInput.addEventListener('input', save);
  checkbox.addEventListener('change', updateUrls);
  row.querySelector('.delete-btn').addEventListener('click', async () => {
    const guid = guidCell.textContent;
    if (guid) await deleteDoc(doc(db, 'transactions', guid));
    row.remove();
    updateUrls();
  });

  table.appendChild(row);
}

// ================== Initialize ==================
for (let i = 0; i < 10; i++) createRow();
updateUrls();

document.querySelectorAll('input[name="format"]').forEach(radio =>
  radio.addEventListener('change', updateUrls)
);

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(fullUrl).then(() => alert('✅ URL copied!'));
});

sendBtn.addEventListener('click', () => {
  window.open(fullUrl, '_blank');
});

// ================== Form Submit Handler ==================
mainForm.addEventListener('submit', e => {
  const oldHidden = mainForm.querySelectorAll('.dynamic-hidden');
  oldHidden.forEach(input => input.remove());

  const rows = document.querySelectorAll('#inputTable tbody tr');
  let index = 0;
  rows.forEach(row => {
    const check = row.querySelector('.check-input')?.checked;
    if (check) {
      const item = row.querySelector('.item-input')?.value.trim();
      const value = row.querySelector('.value-input')?.value.trim();
      mainForm.appendChild(createHiddenInput(`item_${index}`, item));
      mainForm.appendChild(createHiddenInput(`value_${index}`, value));
      index++;
    }
  });
});

function createHiddenInput(name, value) {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = name;
  input.value = value || '';
  input.classList.add('dynamic-hidden');
  return input;
}
