// Fade-in animation with cascade effect for service cards
const cards = document.querySelectorAll('.service-card');

cards.forEach((card, index) => {
  card.classList.add(`delay-${(index % 6) + 1}`);
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

cards.forEach(card => {
  observer.observe(card);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Navbar shadow on scroll
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

// ------------------------
// Modal Dynamic Loading
// ------------------------
const serviceCards = document.querySelectorAll('.service-card');
const modalContent = document.querySelector('#modalContent .modal-body');
let currentServiceName = ''; // Track current selected service
let selectedServices = [];   // Array of selected service names

serviceCards.forEach(card => {
  card.addEventListener('click', function() {
    const fileName = this.getAttribute('data-file');
    currentServiceName = this.getAttribute('data-service');

    if (fileName && modalContent) {
      fetch(`components/${fileName}`)
        .then(response => response.text())
        .then(data => {
          modalContent.innerHTML = data;
        })
        .catch(error => {
          modalContent.innerHTML = `<p class="text-danger">Error loading content. Please try again later.</p>`;
          console.error('Error loading modal content:', error);
        });
    }
  });
});

// Handle Select Service Button
const selectServiceBtn = document.getElementById('selectServiceBtn');
if (selectServiceBtn) {
  selectServiceBtn.addEventListener('click', function() {
    if (currentServiceName && !selectedServices.includes(currentServiceName)) {
      selectedServices.push(currentServiceName);
    }
    const serviceModal = bootstrap.Modal.getInstance(document.getElementById('serviceModal'));
    serviceModal.hide();
  });
}

// Build the Summary Modal checklist
function updateSummaryList() {
  const summaryList = document.getElementById('summaryList');
  if (selectedServices.length === 0) {
    summaryList.innerHTML = `<p>No services selected yet.</p>`;
    return;
  }

  const list = document.createElement('ul');
  list.className = 'list-group';
  selectedServices.forEach(service => {
    const item = document.createElement('li');
    item.className = 'list-group-item';
    item.textContent = service;
    list.appendChild(item);
  });

  summaryList.innerHTML = '';
  summaryList.appendChild(list);
}

// Update the Summary Modal every time it's opened
const summaryModal = document.getElementById('summaryModal');
summaryModal.addEventListener('show.bs.modal', updateSummaryList);

// Handle Request Services Button
const requestServicesBtn = document.getElementById('requestServicesBtn');
if (requestServicesBtn) {
  requestServicesBtn.addEventListener('click', function() {
    if (selectedServices.length === 0) return;

    const jsonOutput = document.getElementById('jsonOutput');
    jsonOutput.textContent = JSON.stringify(selectedServices, null, 2);

    const successBanner = document.getElementById('successBanner');
    successBanner.style.display = 'block';

    // Clear selections after request
    selectedServices = [];
    updateSummaryList();

    // Close Summary Modal
    const summaryModalInstance = bootstrap.Modal.getInstance(document.getElementById('summaryModal'));
    summaryModalInstance.hide();
  });
}
