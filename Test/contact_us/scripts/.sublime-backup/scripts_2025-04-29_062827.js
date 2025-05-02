let hoursData = {};

// Fetch working hours from Data/hours.json
fetch('Data/hours.json')
  .then(response => response.json())
  .then(data => {
    hoursData = data;
    restrictDateInput();
  })
  .catch(error => {
    console.error('Error loading working hours JSON:', error);
  });

const callbackDateInput = document.getElementById('callbackDate');
const callbackTimeInput = document.getElementById('callbackTime');
const welcomeText = document.getElementById('welcomeText');
const daySelect = document.getElementById('daySelect');
const timeSelect = document.getElementById('timeSelect');
const applyWorkingHours = document.getElementById('applyWorkingHours');
const workingHoursModal = new bootstrap.Modal(document.getElementById('workingHoursModal'));

// Setup Bootstrap tooltips globally
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Restrict available dates immediately based on working hours
function restrictDateInput() {
  callbackDateInput.addEventListener('input', () => {
    const selectedDate = new Date(callbackDateInput.value);
    const weekday = selectedDate.toLocaleString('en-US', { weekday: 'long' });

    if (!hoursData[weekday] || !hoursData[weekday].start || !hoursData[weekday].end) {
      showAlert(`We are closed on ${weekday}. Please select an open day.`);
      callbackDateInput.value = '';
      callbackTimeInput.value = '';
    } else {
      updateTimeInputLimits(weekday);
    }
  });
}

// Set min and max times dynamically
function updateTimeInputLimits(weekday) {
  const workingHours = hoursData[weekday];
  if (workingHours) {
    callbackTimeInput.min = workingHours.start;
    callbackTimeInput.max = workingHours.end;
  } else {
    callbackTimeInput.removeAttribute('min');
    callbackTimeInput.removeAttribute('max');
  }
}

// When fields change, validate
callbackDateInput.addEventListener('change', validateCallbackDateTime);
callbackTimeInput.addEventListener('change', validateCallbackDateTime);

// Show an alert inside Welcome Card
function showAlert(message) {
  welcomeText.innerHTML = `
    <div class="alert alert-danger text-center" role="alert">
      ${message}
    </div>
  `;
}

// Clear alert and restore Welcome text
function clearAlert() {
  welcomeText.innerHTML = `
    <p>
      We would love your business! Please tell us a little about yourself and the details of your inquiry.
      Feel free to attach pictures (if necessary). Someone from our team will call you back promptly.
    </p>
  `;
}

// Mark field as invalid (Bootstrap + tooltip)
function setInvalidField(field, message) {
  field.classList.add('is-invalid');
  field.setAttribute('data-bs-toggle', 'tooltip');
  field.setAttribute('data-bs-placement', 'top');
  field.setAttribute('title', message);
  bootstrap.Tooltip.getOrCreateInstance(field).show();
  field.focus();
}

// Remove invalid field styling
function clearInvalidField(field) {
  field.classList.remove('is-invalid');
  field.removeAttribute('data-bs-toggle');
  field.removeAttribute('data-bs-placement');
  field.removeAttribute('title');
  const tooltipInstance = bootstrap.Tooltip.getInstance(field);
  if (tooltipInstance) tooltipInstance.dispose();
}

// Populate Day options in Modal
function populateDayOptions() {
  daySelect.innerHTML = '';
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const weekday = date.toLocaleString('en-US', { weekday: 'long' });

    if (hoursData[weekday] && hoursData[weekday].start && hoursData[weekday].end) {
      const option = document.createElement('option');
      option.value = date.toISOString().split('T')[0];
      option.textContent = `${weekday} (${option.value})`;
      daySelect.appendChild(option);
    }
  }
}

// Populate Time options in Modal
function populateTimeOptions() {
  timeSelect.innerHTML = '';

  const selectedDate = daySelect.value;
  if (!selectedDate) return;

  const weekday = new Date(selectedDate).toLocaleString('en-US', { weekday: 'long' });

  if (hoursData[weekday]) {
    const start = hoursData[weekday].start;
    const end = hoursData[weekday].end;
    const startHour = parseInt(start.split(':')[0]);
    const startMinute = parseInt(start.split(':')[1]);
    const endHour = parseInt(end.split(':')[0]);
    const endMinute = parseInt(end.split(':')[1]);

    let current = new Date();
    current.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0, 0);

    while (current <= endTime) {
      const hours = current.getHours().toString().padStart(2, '0');
      const minutes = current.getMinutes().toString().padStart(2, '0');
      const option = document.createElement('option');
      option.value = `${hours}:${minutes}`;
      option.textContent = formatTime(`${hours}:${minutes}`);
      timeSelect.appendChild(option);

      current.setMinutes(current.getMinutes() + 30);
    }
  }
}

// Open Modal for Working Hours
function showWorkingHoursModal() {
  populateDayOptions();
  populateTimeOptions();
  workingHoursModal.show();
}

// When user changes day in Modal
daySelect.addEventListener('change', populateTimeOptions);

// When user clicks Apply in Modal
applyWorkingHours.addEventListener('click', () => {
  const selectedDate = daySelect.value;
  const selectedTime = timeSelect.value;

  if (selectedDate && selectedTime) {
    callbackDateInput.value = selectedDate;
    callbackTimeInput.value = selectedTime;
    workingHoursModal.hide();
  } else {
    showAlert('Please select both a valid day and time.');
  }
});

// Validate Callback Date and Time
function validateCallbackDateTime() {
  clearAlert();
  clearInvalidField(callbackDateInput);
  clearInvalidField(callbackTimeInput);

  const dateVal = callbackDateInput.value;
  const timeVal = callbackTimeInput.value;

  if (!dateVal) {
    setInvalidField(callbackDateInput, 'Please select a preferred callback date.');
    showAlert('Please select a preferred callback date.');
    showWorkingHoursModal();
    return false;
  }

  const selectedDate = new Date(dateVal);
  const weekday = selectedDate.toLocaleString('en-US', { weekday: 'long' });

  if (!hoursData[weekday] || !hoursData[weekday].start || !hoursData[weekday].end) {
    showAlert(`We are closed on ${weekday}. Please select a weekday.`);
    setInvalidField(callbackDateInput, 'We are closed on this day.');
    callbackDateInput.value = '';
    callbackTimeInput.value = '';
    showWorkingHoursModal();
    return false;
  }

  const startTime = hoursData[weekday].start;
  const endTime = hoursData[weekday].end;

  if (!timeVal) {
    setInvalidField(callbackTimeInput, 'Please select a preferred callback time.');
    showAlert('Please select a preferred callback time.');
    showWorkingHoursModal();
    return false;
  }

  if (timeVal < startTime || timeVal > endTime) {
    showAlert(`Selected time is outside working hours for ${weekday} (${formatTime(startTime)} - ${formatTime(endTime)}).`);
    setInvalidField(callbackTimeInput, `Allowed hours: ${formatTime(startTime)} - ${formatTime(endTime)}.`);
    callbackTimeInput.value = '';
    showWorkingHoursModal();
    return false;
  }

  return true;
}

// Format Time for Display
function formatTime(timeStr) {
  const [hour, minute] = timeStr.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const adjustedHour = hour % 12 || 12;
  return `${adjustedHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

// Handle Form Submission
document.getElementById('contactForm').addEventListener('submit', function (event) {
  event.preventDefault();
  clearAlert();
  clearInvalidField(callbackDateInput);
  clearInvalidField(callbackTimeInput);

  if (!validateCallbackDateTime()) {
    return;
  }

  const formData = new FormData(this);

  const firstname = document.getElementById('firstname').value.trim();
  const lastname = document.getElementById('lastname').value.trim();
  const company = document.getElementById('company').value.trim();
  const zipcode = document.getElementById('zipcode').value.trim();
  const email = document.getElementById('email').value.trim();
  const callbackDate = callbackDateInput.value.trim();
  const callbackTime = callbackTimeInput.value.trim();
  const originalMessage = document.getElementById('message').value.trim();

  const combinedMessage = `
[Firstname]: ${firstname}
[Lastname]: ${lastname}
[Company]: ${company}
[Zipcode]: ${zipcode}
[Email]: ${email}
[Preferred Callback Date]: ${callbackDate}
[Preferred Callback Time]: ${callbackTime}

[User Message]: ${originalMessage || '(No additional message provided.)'}
  `.trim();

  formData.set('message', combinedMessage);

  // Save full final summary
  localStorage.setItem('lastSubmission', JSON.stringify({
    summary: combinedMessage
  }));

  fetch(this.action, {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
  .finally(() => {
    window.location.href = "https://inquiries.womacromax.com/html/thanks.html";
  });
});
