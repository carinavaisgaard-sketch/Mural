const locations = window.GALLERY || [];

const nav = document.getElementById("nav");
const work = document.getElementById("work");
const stats = document.getElementById("stats");
const header = document.querySelector(".site-header");

document.getElementById("year").textContent = new Date().getFullYear();

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else node.setAttribute(key, value);
  }
  for (const child of [].concat(children)) if (child) node.append(child);
  return node;
}

// ---------- Stats + hero ----------
const totalImages = locations.reduce((n, loc) => n + loc.images.length, 0);
stats.append(
  el("div", { class: "stat" }, [el("strong", { text: locations.length }), el("span", { text: "Steder" })]),
  el("div", { class: "stat" }, [el("strong", { text: totalImages }), el("span", { text: "Billeder" })])
);

if (totalImages) {
  const all = locations.flatMap((loc) => loc.images);
  const src = all[Math.floor(Math.random() * all.length)];
  const heroBg = document.getElementById("hero-bg");
  const probe = new Image();
  probe.onload = () => {
    heroBg.style.backgroundImage = `url("${src}")`;
    heroBg.classList.add("loaded");
  };
  probe.src = src;
}

// ---------- Galleries ----------
if (!locations.length) {
  work.append(
    el("p", { class: "empty" }, [
      "Ingen vægmalerier fundet. Tilføj mapper under ",
      el("code", { text: "assets/images/" }),
      " og kør ",
      el("code", { text: "node build-gallery.js" }),
      ".",
    ])
  );
}

const reveal = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        reveal.unobserve(entry.target);
      }
    }
  },
  { rootMargin: "0px 0px -60px 0px" }
);

locations.forEach((loc, locIndex) => {
  nav.append(el("a", { href: `#${loc.id}`, text: loc.title, "data-id": loc.id }));

  const meta = [loc.place, loc.year].filter(Boolean).join(" · ");
  const head = el("div", { class: "location-head" }, [
    el("span", { class: "location-index", text: String(locIndex + 1).padStart(2, "0") }),
    el("div", {}, [
      el("h2", { text: loc.title }),
      meta || loc.description ? el("p", { class: "location-meta", text: [meta, loc.description].filter(Boolean).join(" — ") }) : null,
    ]),
    el("span", { class: "location-count", text: `${loc.images.length} ${loc.images.length === 1 ? "billede" : "billeder"}` }),
  ]);

  const gallery = el("div", { class: "gallery" });
  loc.images.forEach((src, imgIndex) => {
    const img = el("img", { src, alt: `Vægmaleri ${loc.title}, billede ${imgIndex + 1}`, loading: "lazy", decoding: "async" });
    const tile = el("button", { class: "tile", type: "button", "aria-label": `Åbn ${loc.title} billede ${imgIndex + 1}` }, img);
    tile.style.transitionDelay = `${(imgIndex % 3) * 80}ms`;
    tile.addEventListener("click", () => openLightbox(locIndex, imgIndex));
    gallery.append(tile);
    reveal.observe(tile);
  });

  work.append(el("section", { class: "location", id: loc.id }, [head, gallery]));
});

// ---------- Header state + active nav link ----------
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const navSpy = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      nav.querySelectorAll("a").forEach((a) => {
        const isActive = a.dataset.id === entry.target.id;
        a.classList.toggle("active", isActive);
        // Keep the active chip visible when the nav scrolls sideways (phones)
        if (isActive && nav.scrollWidth > nav.clientWidth) {
          nav.scrollTo({ left: a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2, behavior: "smooth" });
        }
      });
    }
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll(".location").forEach((s) => navSpy.observe(s));

// ---------- Lightbox ----------
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCaption = document.getElementById("lb-caption");
let current = { loc: 0, img: 0 };
let lastFocus = null;

function showImage() {
  const loc = locations[current.loc];
  lbImg.src = loc.images[current.img];
  lbImg.alt = `Vægmaleri ${loc.title}, billede ${current.img + 1}`;
  lbImg.style.animation = "none";
  void lbImg.offsetWidth; // restart the pop-in animation
  lbImg.style.animation = "";
  const fileName = decodeURIComponent(loc.images[current.img].split("/").pop()).replace(/\.[^.]+$/, "");
  lbCaption.replaceChildren(
    el("strong", { text: loc.title }),
    ` — ${current.img + 1} / ${loc.images.length}`,
    el("span", { class: "lb-file", text: fileName })
  );
}

function openLightbox(locIndex, imgIndex) {
  current = { loc: locIndex, img: imgIndex };
  lastFocus = document.activeElement;
  showImage();
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("lb-close").focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}

function step(dir) {
  const count = locations[current.loc].images.length;
  current.img = (current.img + dir + count) % count;
  showImage();
}

document.getElementById("lb-close").addEventListener("click", closeLightbox);
document.getElementById("lb-prev").addEventListener("click", () => step(-1));
document.getElementById("lb-next").addEventListener("click", () => step(1));
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") closeLightbox();
  else if (e.key === "ArrowLeft") step(-1);
  else if (e.key === "ArrowRight") step(1);
});

// Swipe on touch devices
let touchX = null;
lightbox.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
lightbox.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  touchX = null;
});
