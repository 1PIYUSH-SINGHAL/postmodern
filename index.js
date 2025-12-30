const manifesto = document.querySelector(".manifesto");
const topLine = document.querySelector(".line.top");
const bottomLine = document.querySelector(".line.bottom");
const strongWord = document.querySelector(".manifesto strong");
const impactClosing = document.querySelector(".impact-closing");
const homeImpact = document.querySelector(".home-impact");

const MAX_SHIFT = 48;

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

function updateParallax() {
  const rect = manifesto.getBoundingClientRect();
  const vh = window.innerHeight;

  if (rect.bottom <= 0 || rect.top >= vh) {
    topLine.style.transform = "translateX(0)";
    bottomLine.style.transform = "translateX(0)";
    strongWord.style.transform = "translateX(0)";
    return;
  }

  const progress = clamp(1 - rect.top / vh, 0, 1);
  const shift = progress * MAX_SHIFT;

  topLine.style.transform = `translateX(${-shift}px)`;
  bottomLine.style.transform = `translateX(${shift}px)`;
  strongWord.style.transform = `translateX(${shift * 0.5}px)`;
}

function scrollResistance() {
  const rect = manifesto.getBoundingClientRect();
  if (rect.top < 120 && rect.top > -120) {
    manifesto.style.transform = "translateY(6px)";
  } else {
    manifesto.style.transform = "translateY(0)";
  }
}

function memoryLock() {
  const rect = impactClosing.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.6) {
    impactClosing.classList.add("lock");
  }
}

function fadeExit() {
  const rect = homeImpact.getBoundingClientRect();
  if (rect.bottom < window.innerHeight * 0.5) {
    homeImpact.classList.add("fade-out");
  } else {
    homeImpact.classList.remove("fade-out");
  }
}

window.addEventListener("scroll", () => {
  updateParallax();
  scrollResistance();
  memoryLock();
  fadeExit();
}, { passive: true });

updateParallax();

const inertiaEls = document.querySelectorAll(
  ".impact-title, .impact-card h3"
);

let lastScroll = window.scrollY;

window.addEventListener("scroll", () => {
  const delta = window.scrollY - lastScroll;
  lastScroll = window.scrollY;

  inertiaEls.forEach(el => {
    el.style.transform = `translateY(${clamp(delta * 0.08, -6, 6)}px)`;
  });
}, { passive: true });

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let w, h, particles;

function resize() {
  const rect = canvas.parentElement.getBoundingClientRect();
  w = canvas.width = rect.width;
  h = canvas.height = rect.height;
}
window.addEventListener("resize", resize);

class Particle {
  constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = 1.2;
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(31,41,55,0.55)";
    ctx.fill();
  }
}

function init() {
  resize();
  particles = Array.from({ length: 60 }, () => new Particle());
}

function connect() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.strokeStyle = `rgba(31,41,55,${0.25 - dist / 600})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, w, h);
  particles.forEach(p => {
    p.move();
    p.draw();
  });
  connect();
  requestAnimationFrame(animate);
}

init();
animate();

const slides = document.querySelectorAll(".slides img");
const nextBtn = document.querySelector(".slide-btn.next");
const prevBtn = document.querySelector(".slide-btn.prev");

let i = 0;

const show = (n) => {
  slides[i].classList.remove("active");
  i = (n + slides.length) % slides.length;
  slides[i].classList.add("active");
};

let timer = setInterval(() => show(i + 1), 4000);

const resetTimer = () => {
  clearInterval(timer);
  timer = setInterval(() => show(i + 1), 4000);
};

nextBtn.onclick = () => {
  show(i + 1);
  resetTimer();
};

prevBtn.onclick = () => {
  show(i - 1);
  resetTimer();
};
