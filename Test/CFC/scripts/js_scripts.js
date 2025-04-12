const contentData = {
  "Home": {
    title: "<h2><span class='black-text'>Welcome to Community Family Clinic</span></h2>"
  },
  "Mission": {
    title: "<h2>Our <span class='black-text'>Mission</span></h2>"
  },
  "Services": {
    title: "<h2>Our <span class='black-text'>Services</span></h2>"
  },
  "Credentials": {
    title: "<h2>Our <span class='black-text'>Credentials</span></h2>"
  },
  "Contact Us": {
    title: "<h2><span class='black-text'>Contact Us</span></h2>"
  },
  "Team": {
    title: "<h2>Meet Our <span class='black-text'>Team</span></h2>"
  },
  "About Us": {
    title: "<h2><span class='black-text'>About Us</span></h2>"
  },
  "Blog": {
    title: "<h2><span class='black-text'>Blog & News</span></h2>"
  },
  "FAQ": {
    title: "<h2><span class='black-text'>FAQs</span></h2>"
  },
  "Promotions": {
    title: "<h2><span class='black-text'>Promotions</span></h2>"
  }
};

let breadcrumbHistory = [];

function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("open");
  document.querySelector(".menu-icon").setAttribute("aria-expanded", menu.classList.contains("open"));
}

function showCard(menuItem) {
  document.getElementById("homePage").style.display = "none";
  breadcrumbHistory.push(menuItem);
  updateContent(menuItem);
  toggleMenu();
}

function updateContent(menuItem) {
  const content = contentData[menuItem];
  const card = document.getElementById("card");
  const textCard = document.getElementById("text-card");
  const breadcrumb = document.getElementById("breadcrumb");

  if (!content || !content.title.trim()) {
    card.style.display = "none";
    textCard.style.display = "none";
    breadcrumb.style.display = "none";
    card.classList.remove("show");
    textCard.classList.remove("show");
    return;
  }

  card.innerHTML = content.title;
  card.style.display = "flex";
  textCard.innerHTML = "";
  textCard.style.display = "block";
  breadcrumb.innerHTML = generateBreadcrumbHTML();
  breadcrumb.style.display = "block";

  card.classList.remove("show");
  textCard.classList.remove("show");

  // Smooth scroll to top of cards
  card.scrollTo({ top: 0, behavior: "smooth" });
  textCard.scrollTo({ top: 0, behavior: "smooth" });

  const folderName = menuItem.replace(/\s+/g, '').toLowerCase();
  const filePath = `partials/${folderName}/${folderName}.html`;

  fetch(filePath)
    .then(response => {
      if (!response.ok) throw new Error("File not found");
      return response.text();
    })
    .then(data => {
      textCard.innerHTML = data;
      requestAnimationFrame(() => {
        card.classList.add("show");
        textCard.classList.add("show");
      });
    })
    .catch(() => {
      textCard.innerHTML = "<p>Unable to load content at this time.</p>";
      requestAnimationFrame(() => {
        card.classList.add("show");
        textCard.classList.add("show");
      });
    });
}

function generateBreadcrumbHTML() {
  return `
    <a href="#" onclick="showhomePage()">Home</a>
    ${breadcrumbHistory.map((item, i) =>
      i === breadcrumbHistory.length - 1
        ? `<span>› ${item}</span>`
        : `<a href="#" onclick="navigateTo(${i})">› ${item}</a>`
    ).join('')}`;
}

function navigateTo(index) {
  breadcrumbHistory = breadcrumbHistory.slice(0, index + 1);
  updateContent(breadcrumbHistory[index]);
}

function showhomePage() {
  document.getElementById("homePage").style.display = "block";
  document.getElementById("card").style.display = "none";
  document.getElementById("text-card").style.display = "none";
  document.getElementById("breadcrumb").style.display = "none";
  document.getElementById("card").classList.remove("show");
  document.getElementById("text-card").classList.remove("show");
  breadcrumbHistory = [];
}

// Close menu when mouse leaves
document.getElementById("menu").addEventListener("mouseleave", () => {
  document.getElementById("menu").classList.remove("open");
  document.querySelector(".menu-icon").setAttribute("aria-expanded", false);
});

// Close menu on outside tap (mobile)
document.addEventListener("touchstart", (e) => {
  const menu = document.getElementById("menu");
  const icon = document.querySelector(".menu-icon");
  if (menu.classList.contains("open") && !menu.contains(e.target) && !icon.contains(e.target)) {
    menu.classList.remove("open");
    icon.setAttribute("aria-expanded", false);
  }
});

// Smooth scroll cards on page load
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".card, .text-card").forEach(card => {
    card.scrollTo({ top: 0, behavior: "smooth" });
  });
});
