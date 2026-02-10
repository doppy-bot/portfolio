// script.js (Part 1: menu open/close)
const menu = document.getElementById("menu");
const openBtn = document.querySelector(".menuBtn");
const closeBtn = document.querySelector(".menuClose");

function openMenu(){
  menu.classList.add("is-open");
  menu.setAttribute("aria-hidden", "false");
  openBtn.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMenu(){
  menu.classList.remove("is-open");
  menu.setAttribute("aria-hidden", "true");
  openBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

openBtn.addEventListener("click", openMenu);
closeBtn.addEventListener("click", closeMenu);

// close menu when clicking a link
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));

// close on Escape
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu.getAttribute("aria-hidden") === "false") closeMenu();
});
// Scroll reveal for sections
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

reveals.forEach(section => observer.observe(section));
// Projects: reveal + active state + subtle parallax
const projectBlocks = document.querySelectorAll(".projectBlock");
const revealProjects = document.querySelectorAll(".revealProject");

// Reveal each project once
const projRevealIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-visible");
    projRevealIO.unobserve(e.target);
  });
}, { threshold: 0.18 });

revealProjects.forEach(el => projRevealIO.observe(el));

// Active highlight while in view (feels like the reference site)
const activeIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("is-active");
    else e.target.classList.remove("is-active");
  });
}, { threshold: 0.55 });

projectBlocks.forEach(el => activeIO.observe(el));

// Super-light parallax for media (optional but nice)
const parallaxTargets = document.querySelectorAll("[data-parallax] .mediaFrame");

window.addEventListener("scroll", () => {
  const y = window.scrollY || 0;
  parallaxTargets.forEach((frame, i) => {
    const speed = 0.02 + (i * 0.005);
    frame.style.transform = `translateY(${(y * speed) % 14}px)`;
  });
}, { passive: true });
// ===== SKILLS — Editorial Interaction =====
const SKILLS = {
  analytics: {
    title: "Analytics",
    desc: "Designing KPIs, analysing funnels and trends, and translating data into clear, decision-ready insights.",
    skills: [
      "KPI design",
      "Funnel / conversion analysis",
      "Trend analysis",
      "Insight generation",
      "Data quality checks"
    ]
  },
  experimentation: {
    title: "Experimentation",
    desc: "Using experimentation concepts and quantitative methods to evaluate impact and uncertainty.",
    skills: [
      "A/B testing concepts",
      "Segmentation",
      "Forecasting",
      "Simulation",
      "Statistical analysis"
    ]
  },
  programming: {
    title: "Programming",
    desc: "Languages used for data analysis, automation, and lightweight web work.",
    skills: [
      "SQL",
      "Python",
      "R (basic)",
      "HTML"
    ]
  },
  bi: {
    title: "BI & Visualisation",
    desc: "Building stakeholder-ready dashboards and reports for business decision-making.",
    skills: [
      "Power BI",
      "Tableau",
      "Excel (PivotTables, formulas)",
      "Dashboard development",
      "Data visualisation"
    ]
  },
  tools: {
    title: "Libraries & Tools",
    desc: "Libraries and tooling used across data analysis, modelling, and collaboration.",
    skills: [
      "pandas",
      "NumPy",
      "scikit-learn",
      "Git",
      "Kafka"
    ]
  },
  ethics: {
    title: "Data Ethics",
    desc: "Evaluating fairness, bias, and ethical implications of analytical models.",
    skills: [
      "Fairness evaluation",
      "Bias analysis",
      "Responsible interpretation"
    ]
  }
};

const cats = document.querySelectorAll(".skillCat");
const panel = document.getElementById("skillsPanel");
const title = document.getElementById("panelTitle");
const desc = document.getElementById("panelDesc");
const list = document.getElementById("panelPills");

function setSkill(key){
  const d = SKILLS[key];
  if (!d) return;

  cats.forEach(c => c.classList.toggle("is-active", c.dataset.cat === key));

  title.textContent = d.title;
  desc.textContent = d.desc;
  list.innerHTML = d.skills.map(s => `<span>${s}</span>`).join("");

  panel.classList.remove("is-visible");
  void panel.offsetWidth;
  panel.classList.add("is-visible");
}

// Hover / focus / tap
cats.forEach(cat => {
  cat.addEventListener("mouseenter", () => setSkill(cat.dataset.cat));
  cat.addEventListener("focus", () => setSkill(cat.dataset.cat));
  cat.addEventListener("click", () => setSkill(cat.dataset.cat));
});

// Default
setSkill("analytics");
// Footer year
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();
// ===== POLISH: scroll progress =====
const progress = document.getElementById("progress");
window.addEventListener("scroll", () => {
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  const pct = scrollHeight ? (scrollTop / scrollHeight) * 100 : 0;
  if (progress) progress.style.width = pct + "%";
}, { passive: true });


// ===== POLISH: active menu link while scrolling =====
const navLinks = document.querySelectorAll(".menuLinks a[href^='#']");
const sections = Array.from(navLinks)
  .map(a => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const id = "#" + entry.target.id;
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === id));
  });
}, { threshold: 0.55 });

sections.forEach(sec => activeObserver.observe(sec));


// ===== POLISH: staggered section reveal =====
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Stagger children slightly
    const children = entry.target.querySelectorAll("h2,h3,p,li,article,div,aside");
    children.forEach((el, i) => {
      el.style.transitionDelay = (i * 35) + "ms";
    });

    entry.target.classList.add("is-visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.18 });

revealEls.forEach(el => revealObserver.observe(el));
// Disable parallax on small screens
const isMobile = window.matchMedia("(max-width: 700px)").matches;

if (!isMobile) {
  const parallaxTargets = document.querySelectorAll("[data-parallax] .mediaFrame");
  window.addEventListener("scroll", () => {
    const y = window.scrollY || 0;
    parallaxTargets.forEach((frame, i) => {
      const speed = 0.02 + (i * 0.005);
      frame.style.transform = `translateY(${(y * speed) % 14}px)`;
    });
  }, { passive: true });
}
const nav = document.querySelector(".nav");

window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    nav.classList.add("is-scrolled");
  } else {
    nav.classList.remove("is-scrolled");
  }
}, { passive: true });
menu.addEventListener("click", (e) => {
  if (e.target === menu) closeMenu();
});
