const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const magneticItems = document.querySelectorAll(".magnetic");
const zoomBrands = document.querySelectorAll(".zoom-brand");
const revealItems = document.querySelectorAll(".reveal");
const floatItems = document.querySelectorAll("[data-float]");
const tiltCards = document.querySelectorAll(".tilt-card");

const pointer = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  ringX: window.innerWidth / 2,
  ringY: window.innerHeight / 2
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateCursor() {
  if (!cursorDot || !cursorRing) return;
  pointer.ringX += (pointer.x - pointer.ringX) * 0.18;
  pointer.ringY += (pointer.y - pointer.ringY) * 0.18;
  cursorDot.style.transform = `translate(${pointer.x}px, ${pointer.y}px) translate(-50%, -50%)`;
  cursorRing.style.transform = `translate(${pointer.ringX}px, ${pointer.ringY}px) translate(-50%, -50%)`;
  if (!reducedMotion) window.requestAnimationFrame(animateCursor);
}

window.addEventListener("mousemove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  if (reducedMotion && cursorDot && cursorRing) {
    cursorDot.style.transform = `translate(${pointer.x}px, ${pointer.y}px) translate(-50%, -50%)`;
    cursorRing.style.transform = `translate(${pointer.x}px, ${pointer.y}px) translate(-50%, -50%)`;
  }
});

magneticItems.forEach((item) => {
  item.addEventListener("mousemove", (event) => {
    if (reducedMotion) return;
    const rect = item.getBoundingClientRect();
    const moveX = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    const moveY = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
    item.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
  item.addEventListener("mouseenter", () => cursorRing?.classList.add("active"));
  item.addEventListener("mouseleave", () => {
    item.style.transform = "";
    cursorRing?.classList.remove("active", "brand-active");
  });
});

zoomBrands.forEach((item) => {
  item.addEventListener("mousemove", (event) => {
    const rect = item.getBoundingClientRect();
    item.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    item.style.setProperty("--my", `${event.clientY - rect.top}px`);
    item.style.setProperty("--spotlight-size", "32px");
  });
  item.addEventListener("mouseenter", () => {
    cursorRing?.classList.add("brand-active");
    item.style.setProperty("--spotlight-size", "32px");
  });
  item.addEventListener("mouseleave", () => {
    item.style.setProperty("--spotlight-size", "0px");
    cursorRing?.classList.remove("brand-active");
  });
});

floatItems.forEach((item, index) => {
  if (reducedMotion) return;
  const amount = Number(item.dataset.float) || 10;
  item.animate(
    [
      { transform: "translate3d(0, 0, 0)" },
      { transform: `translate3d(0, ${amount}px, 0)` },
      { transform: "translate3d(0, 0, 0)" }
    ],
    { duration: 3200 + index * 450, iterations: Infinity, easing: "ease-in-out" }
  );
});

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    if (reducedMotion || window.innerWidth < 761) return;
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    card.style.transform = `perspective(1200px) rotateX(${(0.5 - py) * 10}deg) rotateY(${(px - 0.5) * 10}deg)`;
  });
  card.addEventListener("mouseleave", () => { card.style.transform = ""; });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => {
  if (reducedMotion) { item.classList.add("is-visible"); return; }
  revealObserver.observe(item);
});

if (!reducedMotion) window.requestAnimationFrame(animateCursor);
