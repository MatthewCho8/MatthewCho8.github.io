// Edit this object to make the portfolio yours.
const portfolio = {
  name: "Matthew Cho",
  initials: "MC",
  role: "Computational researcher & engineer",
  email: "chomatt10@gmail.com",
  availability: "Open to research & engineering opportunities",
  bio: "I’m a computational researcher with an M.Sc. in Biological and Biomedical Engineering from McGill. My work combines molecular modeling, machine learning, data analysis, and scientific software.",
  links: {
    github: "https://github.com/MatthewCho8",
    linkedin: "https://www.linkedin.com/in/matthewcho8",
    resume: "CV - no phone.pdf",
  },
  projects: [
    {
      title: "Edgework Analytics",
      description: "A data and machine-learning platform for analyzing professional sports performance, game outcomes, and betting markets.",
      tags: ["MLB analytics", "Data engineering", "ML"],
      url: "edgework-analytics.html",
      featured: true,
      color: "#3f63f2",
    },
    {
      title: "ProMS",
      description: "A standalone PyMOL-based plugin for molecular surface analysis and visualization.",
      tags: ["Python", "C", "PyMOL"],
      url: "proms.html",
      color: "#ff5c35",
    },
    {
      title: "Biological Agent Simulations",
      description: "Agent-based models for studying how bacteria and fungi navigate complex environments.",
      tags: ["Python", "Java", "MATLAB"],
      url: "biological-simulations.html",
      color: "#8c62cc",
    },
  ],
  experience: [
    { company: "McGill University", role: "Research Assistant", date: "2025—Present" },
    { company: "McGill University", role: "M.Sc., Biological & Biomedical Engineering · GPA 4.0", date: "2023—2025" },
    { company: "McGill University", role: "Research Assistant", date: "2021—2022" },
    { company: "McGill University", role: "B.Eng., Bioengineering · With distinction", date: "2018—2022" },
    { company: "Charles River Laboratories", role: "Summer Intern, Toxicology", date: "2019" },
  ],
  publications: [
    {
      year: "2026",
      venue: "Master’s thesis · McGill University",
      title: "ProMS: An Integrated Computational Framework for Molecular Surface Analysis and Atomic-Level Hydrophobicity Mapping",
      url: "https://mcgill.scholaris.ca/items/531e8ee0-2ae3-4483-a081-c20ea6d5f3c3",
    },
    {
      year: "2026",
      venue: "Nature Microsystems & Nanoengineering",
      title: "Amplification of computational power by the multiplication of bacteria exploring microfluidic networks encoding mathematical problems",
      url: "https://www.nature.com/articles/s41378-026-01341-x",
    },
    {
      year: "2024",
      venue: "ACS Applied Materials & Interfaces",
      title: "Protein adsorption on solid surfaces: Data mining, database, molecular surface-derived properties, and semiempirical relationships",
      url: "https://doi.org/10.1021/acsami.4c06759",
    },
  ],
  skills: [
    "Python", "PyTorch", "scikit-learn", "Pandas", "Java", "MATLAB", "SQL",
    "JavaScript", "C", "Machine learning", "Data visualization", "Molecular modeling",
  ],
  awards: [
    { name: "McGill Engineering Undergraduate Student Master’s Award", year: "2023" },
    { name: "J.W. McConnell Scholarship", year: "2018" },
    { name: "Governor General’s Academic Medal", year: "2017" },
  ],
};

document.querySelectorAll("[data-profile]").forEach((element) => {
  const key = element.dataset.profile;
  if (portfolio[key]) element.textContent = portfolio[key];
});

document.querySelectorAll("[data-profile-link]").forEach((element) => {
  const key = element.dataset.profileLink;
  element.href = key === "email" ? `mailto:${portfolio.email}` : portfolio.links[key];
});

document.title = `${portfolio.name} — ${portfolio.role}`;
document.querySelector('meta[name="description"]').content =
  `Portfolio of ${portfolio.name} — ${portfolio.role}.`;

const projectList = document.querySelector("#project-list");
portfolio.projects.forEach((project, index) => {
  const item = document.createElement("a");
  item.className = "project reveal";
  if (project.featured) item.classList.add("project-featured");
  item.href = project.url;
  item.target = project.url === "#" || project.url.endsWith(".html") ? "_self" : "_blank";
  item.rel = "noreferrer";
  item.innerHTML = `
    <span class="project-number">0${index + 1}</span>
    <span class="project-copy">
      <h3>${project.title}</h3>
      <span class="project-description">${project.description}</span>
    </span>
    <span class="project-tags">${project.tags.map((tag) => `<span>${tag}</span>`).join("")}</span>
    <span class="project-arrow" aria-hidden="true">↗</span>
    <span class="project-preview" style="--preview: ${project.color}" aria-hidden="true"></span>
  `;
  item.addEventListener("click", (event) => {
    if (project.url === "#") event.preventDefault();
  });
  item.addEventListener("mousemove", (event) => {
    const preview = item.querySelector(".project-preview");
    preview.style.left = `${event.clientX}px`;
    preview.style.top = `${event.clientY}px`;
  });
  projectList.appendChild(item);
});

const experienceList = document.querySelector("#experience-list");
portfolio.experience.forEach((job) => {
  const row = document.createElement("article");
  row.className = "experience-row reveal";
  row.innerHTML = `
    <h3>${job.company}</h3>
    <p class="experience-role">${job.role}</p>
    <p class="experience-date">${job.date}</p>
  `;
  experienceList.appendChild(row);
});

const publicationList = document.querySelector("#publication-list");
portfolio.publications.forEach((publication) => {
  const item = document.createElement("article");
  item.className = "publication reveal";
  item.innerHTML = `
    <span class="publication-year">${publication.year}</span>
    <div>
      <h3><a href="${publication.url}" target="_blank" rel="noreferrer">${publication.title}<span class="publication-arrow" aria-hidden="true"> ↗</span></a></h3>
      <p>${publication.venue}</p>
    </div>
  `;
  publicationList.appendChild(item);
});

const skillsList = document.querySelector("#skills-list");
portfolio.skills.forEach((skill) => {
  const item = document.createElement("span");
  item.textContent = skill;
  skillsList.appendChild(item);
});

const awardsList = document.querySelector("#awards-list");
portfolio.awards.forEach((award) => {
  const item = document.createElement("p");
  item.innerHTML = `<span>${award.name}</span><span>${award.year}</span>`;
  awardsList.appendChild(item);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#back-to-top").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
