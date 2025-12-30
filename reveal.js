const observer = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(
  ".impact-card, .method, .impact-block, .impact-closing"
).forEach(el => {
  el.classList.add("reveal");
  observer.observe(el);
});

let locked = false;
const manifesto = document.querySelector(".manifesto");

window.addEventListener(
  "scroll",
  () => {
    if (locked || !manifesto) return;
    const r = manifesto.getBoundingClientRect();
    if (Math.abs(r.top + r.height / 2 - window.innerHeight / 2) < 10) {
      locked = true;
      document.body.style.pointerEvents = "none";
      setTimeout(() => {
        document.body.style.pointerEvents = "";
        locked = false;
      }, 120);
    }
  },
  { passive: true }
);

const footer = document.querySelector(".site-footer");

window.addEventListener(
  "scroll",
  () => {
    if (!footer) return;
    const r = footer.getBoundingClientRect();
    footer.classList.toggle("focus", r.top < window.innerHeight);
  },
  { passive: true }
);

document.addEventListener(
  "touchstart",
  e => {
    const el = e.target.closest(".impact-card, .method, .social-icon");
    if (!el) return;
    el.classList.add("tap-feedback");
    setTimeout(() => el.classList.remove("tap-feedback"), 200);
  },
  { passive: true }
);

const mobileObserver = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      e.target.classList.toggle(
        "mobile-dominant",
        e.intersectionRatio > 0.6
      );
    });
  },
  { threshold: [0.6] }
);

document
  .querySelectorAll(".impact-card, .method")
  .forEach(el => mobileObserver.observe(el));
