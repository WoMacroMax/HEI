function openEmailModalWithServices() {
  const checked = Array.from(document.querySelectorAll('#servicesForm input[type=checkbox]:checked'));
  const selectedServices = checked.map(cb => `- ${cb.nextElementSibling.textContent.trim()}`).join('\n');
  const messageField = document.getElementById('emailMessage');
  const subjectField = document.getElementById('emailSubject');
  subjectField.value = "Resident Services Request";
  messageField.value = "I would like to request the following services:\n" + selectedServices;
  new bootstrap.Modal(document.getElementById('emailModal')).show();
}

function launchDialpad() {
  const input = document.getElementById('dialInput');
  input.value = '';
  const modal = new bootstrap.Modal(document.getElementById('dialpadModal'));
  modal.show();
  const number = "7035962482";
  let i = 0;
  const interval = setInterval(() => {
    if (i < number.length) {
      input.value += number[i++];
    } else {
      clearInterval(interval);
    }
  }, 200);
}

function appendDial(val) {
  const input = document.getElementById('dialInput');
  input.value += val;
}

function callNumber() {
  const number = document.getElementById('dialInput').value.replace(/[^0-9+]/g, '');
  if (number) {
    window.location.href = `tel:${number}`;
  }
}

function sendEmail() {
  const name = document.getElementById('emailName').value.trim();
  const zipcode = document.getElementById('yourZipcode').value.trim();
  const phone = document.getElementById('yourPhone').value.trim();
  const subject = encodeURIComponent(document.getElementById('emailSubject').value);
  const message = document.getElementById('emailMessage').value.trim();
  const to = document.getElementById('emailTo').value;
  const zipPattern = /^\d{5}$/;
  const phonePattern = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

  if (!name || !zipPattern.test(zipcode) || !phonePattern.test(phone)) {
    alert("Please enter a valid name, ZIP code, and phone number.");
    return;
  }

  localStorage.setItem("userName", name);
  localStorage.setItem("userZipcode", zipcode);
  localStorage.setItem("userPhone", phone);

  const fullMessage = `Name: ${name}\nZipcode: ${zipcode}\nPhone: ${phone}\n\n${message}`;
  const body = encodeURIComponent(fullMessage);
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  bootstrap.Modal.getInstance(document.getElementById('emailModal')).hide();
}

let currentServiceId = null;
const services = [
  { id: "rental", name: "Rental Assistance", details: "We help you find rental assistance programs in your area." },
  { id: "utility", name: "Utility Assistance", details: "Support for electric, water, and other essential utilities." },
  { id: "health", name: "Health and Wellness", details: "Access to health clinics, screenings, and mental health resources." },
  { id: "family", name: "Family Programming", details: "Programs that support children, parents, and family wellness." },
  { id: "more", name: "And much more", details: "Discover even more services tailored to your needs." }
];

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("emailName");
  const zipInput = document.getElementById("yourZipcode");
  const phoneInput = document.getElementById("yourPhone");

  nameInput.value = localStorage.getItem("userName") || "";
  zipInput.value = localStorage.getItem("userZipcode") || "";
  phoneInput.value = localStorage.getItem("userPhone") || "";

  nameInput.addEventListener("input", () => localStorage.setItem("userName", nameInput.value));
  zipInput.addEventListener("input", () => localStorage.setItem("userZipcode", zipInput.value));
  phoneInput.addEventListener("input", () => localStorage.setItem("userPhone", phoneInput.value));

  services.forEach(service => {
    const label = document.querySelector(`label[for="${service.id}"]`);
    if (label) {
      label.style.cursor = "pointer";
      label.addEventListener("click", () => {
        currentServiceId = service.id;
        showServiceModal(service);
      });
    }
  });

  document.getElementById("cancelServiceBtn").addEventListener("click", () => {
    if (currentServiceId) {
      document.getElementById(currentServiceId).checked = false;
    }
  });
});

function showServiceModal(service) {
  const modalTitle = document.getElementById("serviceModalLabel");
  const modalBody = document.getElementById("serviceModalBody");
  const acceptBtn = document.getElementById("acceptServiceBtn");

  modalTitle.textContent = service.name;
  modalBody.textContent = service.details;

  acceptBtn.onclick = () => {
    document.getElementById(service.id).checked = true;
    bootstrap.Modal.getInstance(document.getElementById("serviceModal")).hide();
  };

  new bootstrap.Modal(document.getElementById("serviceModal")).show();
}
