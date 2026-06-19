document.addEventListener("DOMContentLoaded", () => {
  const splash = document.querySelector(".splash-screen");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (splash) {
    if (prefersReducedMotion) {
      splash.remove();
    } else {
      document.body.classList.add("is-splashing");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          splash.classList.add("is-ready");
        });
      });

      window.setTimeout(() => {
        splash.classList.add("is-leaving");
      }, 2450);

      window.setTimeout(() => {
        document.body.classList.remove("is-splashing");
        splash.remove();
      }, 3350);
    }
  }

  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));

  const header = document.querySelector(".site-header");

  if (header) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      const farEnough = currentScrollY > 110;

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
  }

  document.querySelectorAll('a[href*="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      const hashIndex = href.indexOf("#");
      const samePage = href.startsWith("#") || href.startsWith(window.location.pathname.split("/").pop() + "#");

      if (hashIndex === -1 || !samePage) return;

      const selector = href.slice(hashIndex);
      const target = document.querySelector(selector);

      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      if (header) {
        header.classList.add("is-hidden");
        window.setTimeout(() => header.classList.remove("is-hidden"), 500);
      }
    });
  });

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      projectCards.forEach((card) => {
        const shouldShow = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightboxImage");
  const lightboxClose = document.querySelector("#lightboxClose");

  if (lightbox && lightboxImage && lightboxClose) {
    projectCards.forEach((card) => {
      card.addEventListener("click", () => {
        const image = card.querySelector("img");
        if (!image) return;

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt || "Projekt wnętrza";
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove("active");
      lightboxImage.src = "";
      document.body.style.overflow = "";
    };

    lightboxClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("active")) {
        closeLightbox();
      }
    });
  }
});
