const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.14 });

revealElements.forEach((element) => observer.observe(element));

// Animacja wejściowa z logo — pokazuje się tylko raz w danej sesji przeglądarki.
(() => {
  const splashKey = "archstudiokm_splash_seen";
  const alreadySeen = sessionStorage.getItem(splashKey) === "true";

  if (alreadySeen) return;

  sessionStorage.setItem(splashKey, "true");

  const splash = document.createElement("div");
  splash.className = "logo-splash";
  splash.innerHTML = `
    <div class="logo-splash-inner" aria-label="archstudiokm">
      <img src="logo male.png" alt="archstudiokm">
      <span>Studio projektowania wnętrz</span>
    </div>
  `;

  document.body.prepend(splash);

  window.setTimeout(() => {
    splash.classList.add("is-leaving");
  }, 1250);

  window.setTimeout(() => {
    splash.remove();
  }, 1850);
})();

// Header znika przy scrollowaniu w dół i wraca po scrollu w górę.
(() => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateHeader = () => {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    const farEnough = currentScrollY > 120;

    if (currentScrollY <= 20) {
      header.classList.remove("is-hidden");
    } else if (scrollingDown && farEnough) {
      header.classList.add("is-hidden");
    } else if (!scrollingDown) {
      header.classList.remove("is-hidden");
    }

    lastScrollY = Math.max(currentScrollY, 0);
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
})();

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
