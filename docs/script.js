const items = document.querySelectorAll(".reveal");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
);

items.forEach((el) => {
  if (reduced) {
    el.classList.add("visible");
    return;
  }
  observer.observe(el);
});
