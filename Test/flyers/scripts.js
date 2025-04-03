function loadAndShowModal(file, modalId, afterLoadCallback = null) {
  fetch(file)
    .then(response => response.text())
    .then(html => {
      document.getElementById('modalContainer').innerHTML = html;
      const modalElement = document.getElementById(modalId);
      const modal = new bootstrap.Modal(modalElement);
      if (afterLoadCallback) afterLoadCallback();
      modal.show();
    })
    .catch(err => console.error("Failed to load modal:", err));
}

function openEmailModalWithServices() {
  const checked = Array.from(document.querySelectorAll('#servicesForm input[type=checkbox]:checked'));
  const selectedServices = checked.map(cb => `- ${cb.nextElementSibling.textContent.trim()}`).join('\n');

  loadAndShowModal('modals/email-modal.html', 'emailModal', () => {
    const messageField = document.getElementById('emailMessage');
    const subjectField = document.getElementById('emailSubject');

    if (messageField && subjectField) {
      subjectField.value = "Resident Services Request";
      messageField.value = "I would like to request the following services:\n" + selectedServices;
    }

    // Pre-fill from localStorage
    document.getElementById("emailName").value = localStorage.getItem("userName") || "";
    document.getElementById("yourZipcode").value = localStorage.getItem("userZipcode") || "";
    document.getElementById("yourPhone").value = localStorage.getItem("userPhone") || "";

    // Save to localStorage on input
    document.getElementById("emailName").addEventListener("input", e => {
      localStorage.setItem("userName", e.target.value);
    });
    document.getElementById("yourZipcode").addEventListener("input", e => {
      localStorage.setItem("userZipcode", e.target.value);
    });
    document.getElementById("yourPhone").addEventListener("input", e => {
      localStorage.setItem("userPhone", e.target.value);
    });
  });
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

  const fullMessage = `Name: ${name}\nZipcode: ${zipcode}\nPhone: ${phone}\n\n${message}`;
  const body = encodeURIComponent(fullMessage);
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  bootstrap.Modal.getInstance(document.getElementById('emailModal')).hide();
}

function launchDialpad() {
  const number = "7035962482";
  loadAndShowModal('modals/dialpad.html', 'dialpadModal', () => {
    const input = document.getElementById('dialInput');
    input.value = "";

    let i = 0;
    const interval = setInterval(() => {
      if (i < number.length) {
        input.value += number[i++];
      } else {
        clearInterval(interval);
      }
    }, 200);
  });
}

function appendDial(val) {
  const input = document.getElementById('dialInput');
  if (input) input.value += val;
}

function callNumber() {
  const number = document.getElementById('dialInput').value.replace(/[^0-9+]/g, '');
  if (number) window.location.href = `tel:${number}`;
}

// Show service info
let currentServiceId = null;
const services = [
  { id: "rental", name: "Rental Assistance", details: "We help you find rental assistance programs in your area." },
  { id: "utility", name: "Utility Assistance", details: "Support for electric, water, and other essential utilities." },
  { id: "health", name: "Health and Wellness", details: "Access to health clinics, screenings, and mental health resources." },
  { id: "family", name: "Family Programming", details: "Programs that support children, parents, and family wellness." },
  { id: "more", name: "And much more", details: "Discover even more services tailored to your needs." }
];

document.addEventListener("DOMContentLoaded", () => {
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
});

function showServiceModal(service) {
  loadAndShowModal('modals/service-modal.html', 'serviceModal', () => {
    const modalTitle = document.getElementById("serviceModalLabel");
    const modalBody = document.getElementById("serviceModalBody");
    const acceptBtn = document.getElementById("acceptServiceBtn");
    const cancelBtn = document.getElementById("cancelServiceBtn");

    modalTitle.textContent = service.name;
    modalBody.textContent = service.details;

    acceptBtn.onclick = () => {
      document.getElementById(service.id).checked = true;
      bootstrap.Modal.getInstance(document.getElementById('serviceModal')).hide();
    };

    cancelBtn.onclick = () => {
      document.getElementById(service.id).checked = false;
    };
  });
}
