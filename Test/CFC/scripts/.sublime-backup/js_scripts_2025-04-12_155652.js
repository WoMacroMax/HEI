const contentData = {
      "Home": {
        title: "<h2><span class='black-text'>Welcome to Community Family Clinic</span></h2>",
        text: "<p>We provide compassionate, high-quality care for families and individuals in our community.</p>"
      },
      "Mission": {
        title: "<h2>Our <span class='black-text'>Mission</span></h2>",
        text: "<p>To provide <strong>high-quality, affordable healthcare</strong> for all individuals and families.</p>"
      },
      "Services": {
        title: "<h2>Our <span class='black-text'>Services</span></h2>",
        text: `

  <p><strong>CFC provides primary care, including:</strong></p>
  <p><br />CFC provides primary care which covers a wide range of routine and preventive healthcare services, such as:</p>
  <ul style="list-style-type: circle;">
  <li>annual physicals</li>
  <li>laboratory testing, such as&nbsp;blood tests&nbsp;and urine tests</li>
  <li>vaccinations</li>
  <li>screening and treatment for conditions like&nbsp;high cholesterol,&nbsp;high blood pressure, or&nbsp;diabetes</li>
  <li>care for minor symptoms, such as sore throat, cough, or nasal congestion</li>
  <li>treatment for common illnesses like colds,&nbsp;the flu, or&nbsp;urinary tract infections (UTIs)</li>
  <li>treatment of some injuries, such as minor cuts or burns</li>
  </ul>
  <p>Others include:</p>
  <ul style="list-style-type: circle;">
  <li>Health education</li>
  <li>Health Promotion and Disease Prevention</li>
  <li>Diabetes and Hypertension education</li>
  <li>Test, screenings and physicals</li>
  <li>Nutrition guidance</li>
  <li>Immunization</li>
  <li>Anemia management</li>
  <li>Pregnancy test</li>
  <li>Annual physicals</li>
  <li>Blood tests</li>
  <li>Cardiology</li>
  <li>Case management</li>
  <li>Counseling</li>
  <li>Sexually transmitted infection</li>
  </ul>`
      },
      "Credentials": {
        title: "<h2>Our <span class='black-text'>Credentials</span></h2>",
        text: "<p>Board-certified physicians, licensed nurses, and experienced healthcare professionals.</p>"
      },
      "Contact Us": {
        title: "<h2><span class='black-text'>Contact Us</span></h2>",
        text: `
          <p>Reach out to us:</p>
          <ul>
            <li>Phone: (123) 456-7890</li>
            <li>Email: info@communityclinic.org</li>
            <li>Address: 123 Wellness Ave, Caretown, USA</li>
          </ul>`
      },
      "Team": {
        title: "<h2>Meet Our <span class='black-text'>Team</span></h2>",
        text: "<p>Meet our compassionate team dedicated to your care and well-being.</p>"
      },
      "About Us": {
        title: "<h2><span class='black-text'>About Us</span></h2>",
        text: "<h2>Biography</h2><p>Dr. Okunji is a Tenured Full Professor and Family Nurse Practitioner at Howard, College of Nursing and Allied Health Sciences. She obtained her BS and MS degrees in nursing and informatics, with nursing leadership minor respectively from the University of Maryland and earned her PhD in Health Sciences with a concentration in International Health Education and Research at the Trident International University, Cypress, California. Dr. Okunji has worked on multiple NIH grants that were funded through the National Institute on Minority Health and Health Disparities (IS22 MD00241-21, A. Wutoh, PI) and National Institute on Drug Abuse (5R24DA02 1470-04, S. Phillips, PI), as well as two Howard Advanced Faculty Seed grants (<em><strong>Okunji, PI</strong></em>) and two DC.gov grants (<em><strong>Okunji, PI</strong></em>). Dr. Okunji is the Howard Co-PI of the ongoing NIH-funded AIM-AHEAD Contract (OTA-21-017-1OT2OD032581-01,&nbsp;<em><strong>Okunji, Co-PI)</strong></em>. She is the lead investigator at using the academic electronic health record (EHR) to improve the data analytic skills of nursing students prior to clinical rotation/practice. She has just completed her latest seed grant funded by the Naval Office Research Human-Centered Artificial Intelligence (GRT00370B,&nbsp;<em><strong>Okunji, PI</strong></em>) titled, &ldquo;<em>Enhancing Academic EHR (SimChart) To Improve Patient Outcome (e-EHR)</em>&rdquo;. In addition, Dr. Okunji is a recipient of the 2023 HU&nbsp;<em><strong>President&rsquo;s Medal</strong></em>&nbsp;of Achievement, recipient of the 2022 Graduate School Medal for Teaching Excellence, 2026-2017 NIH Cardiovascular Disparities Programs for Inclusion and Diversity Among Individuals Engaged in Health-Related Research (PRIDE) award, 2015 NIH UCLA Mobile Health (mHealth) Scholar, 2014 NIH NIMHD Health Disparities Course Scholar, and 2012 Faculty Senate &ldquo;<em><strong>Emerging Scholar</strong></em>&rdquo; award. Her professional background merges over 25 years of teaching, clinical, and research experience in microbiology, nursing, leadership and informatics. Dr. Okunji is frequently invited to deliver presentations at both national and international conferences and has more than 60 publications, including 3-book chapters and&nbsp;<em><strong>Nursing Informatics textbook</strong></em>, for which she is a&nbsp;<em><strong>sole author</strong></em>. As a senior faculty, Dr. Okunji has mentored 15 junior and senior faculty in scholarship and grantsmanship, such as the just completed Artificial Intelligence/Machine Learning Consortium to Advance Health Equity and Researcher Diversity (AIM-AHEAD) program, which provided clinical research and stipend support for the DON faculty. She also mentored numerous graduate and undergraduate students on scholarly writings. Dr. Okunji served as a&nbsp;<em><strong>primary advisor</strong></em>&nbsp;for Dr. Karyn Onyenoho&rsquo;s PhD dissertation entitled &ldquo;<em>Genetic Determinants of Type 2 Diabetes Mellitus in African Adults: Identification of the Associated Factors</em>.&rdquo; Dr. Onyenoho is currently an advisor for Genomic Data Sharing in the Division of Neuroscience at the NIH National Institute on Aging. As an NIH Cardiovascular Health-Related Research PRIDE Cohort V Scholar, Dr. Okunji has been invited to mentor many new program applicants and helped disseminate flyers for the ongoing cohort XI recruitment and she is a member of the DC Cardiovascular Health and Obesity Collaborative (DC CHOC) Executive Community Advisory Committee through joint research with HU and NHLBI since 2013.&nbsp;</p>"
      },
      "Blog": {
        title: "<h2><span class='black-text'>Blog & News</span></h2>",
        text: "<p>Stay informed with health tips, updates, and community stories.</p>"
      },
      "FAQ": {
        title: "<h2><span class='black-text'>FAQs</span></h2>",
        text: `
          <p><strong>Q:</strong> Do I need insurance?</p>
          <p><strong>A:</strong> No, we provide care regardless of insurance status.</p>`
      },
      "Promotions": {
        title: "<h2><span class='black-text'>Promotions</span></h2>",
        text: "" // Will be loaded dynamically
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

  if (!content || (!content.title.trim() && !content.text.trim())) {
    card.style.display = "none";
    textCard.style.display = "none";
    breadcrumb.style.display = "none";
    return;
  }

  card.innerHTML = content.title;

  if (menuItem === "Promotions") {
    fetch("promotions/promotions.html")
      .then(response => response.text())
      .then(data => {
        textCard.innerHTML = data;
        card.style.display = content.title.trim() ? "flex" : "none";
        textCard.style.display = "block";
        breadcrumb.innerHTML = generateBreadcrumbHTML();
        breadcrumb.style.display = "block";
      })
      .catch(err => {
        textCard.innerHTML = "<p>Unable to load promotions at this time.</p>";
        card.style.display = content.title.trim() ? "flex" : "none";
        textCard.style.display = "block";
        breadcrumb.innerHTML = generateBreadcrumbHTML();
        breadcrumb.style.display = "block";
      });
  } else {
    textCard.innerHTML = content.text;
    card.style.display = content.title.trim() ? "flex" : "none";
    textCard.style.display = content.text.trim() ? "block" : "none";
    breadcrumb.innerHTML = generateBreadcrumbHTML();
    breadcrumb.style.display = "block";
  }
}


    function generateBreadcrumbHTML() {
      return `
        <a href="#" onclick="showhomePage()">Home</a>
        ${breadcrumbHistory.map((item, i) => i === breadcrumbHistory.length - 1
          ? `<span>› ${item}</span>`
          : `<a href="#" onclick="navigateTo(${i})">› ${item}</a>`).join('')}`;
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
      breadcrumbHistory = [];
    }

    document.getElementById("menu").addEventListener("mouseleave", () => {
      document.getElementById("menu").classList.remove("open");
      document.querySelector(".menu-icon").setAttribute("aria-expanded", false);
    });

    document.addEventListener("touchstart", (e) => {
      const menu = document.getElementById("menu");
      const icon = document.querySelector(".menu-icon");
      if (menu.classList.contains("open") && !menu.contains(e.target) && !icon.contains(e.target)) {
        menu.classList.remove("open");
        icon.setAttribute("aria-expanded", false);
      }
    });