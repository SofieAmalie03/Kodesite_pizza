/* ===== Burger (mobil) ===== */
const burger = document.querySelector(".burger");
const nav = document.querySelector(".site-nav");
const menuLinks = document.querySelectorAll(".menu a");

if (burger && nav) {
  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    nav.classList.toggle("active");
    burger.setAttribute(
      "aria-expanded",
      nav.classList.contains("active") ? "true" : "false"
    );
  });

  // Luk mobilmenu når man klikker et link
  menuLinks.forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("active");
      burger.classList.remove("active");
      burger.setAttribute("aria-expanded", "false");
    })
  );
}

/* ===== Overlay niveau 1: Opkrifter ===== */
const opsBtn = document.getElementById("opskrifterBtn");
const opsPanel = document.getElementById("opskrifterPanel");

function closeOps() {
  if (!opsPanel || !opsBtn) return;
  opsPanel.classList.remove("open");
  opsBtn.setAttribute("aria-expanded", "false");
}

if (opsBtn && opsPanel) {
  opsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const opened = opsPanel.classList.toggle("open");
    opsBtn.setAttribute("aria-expanded", opened ? "true" : "false");
  });

  // klik udenfor lukker
  document.addEventListener("click", (e) => {
    if (!opsPanel.contains(e.target) && !opsBtn.contains(e.target)) {
      closeOps();
      closeRaw(); // luk også niveau 2 hvis åbent
    }
  });

  // ESC lukker
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeRaw();
      closeOps();
    }
  });
}

/* ===== Overlay niveau 2: De bedste råvarer (modal) ===== */
const raavarerLink = document.getElementById("raavarerLink");
const raavarerPanel = document.getElementById("raavarerPanel");
const backdrop = document.getElementById("overlayBackdrop");

function openRaw() {
  if (!raavarerPanel || !backdrop) return;
  raavarerPanel.classList.add("open");
  raavarerPanel.setAttribute("aria-hidden", "false");
  backdrop.hidden = false;
  backdrop.classList.add("show");

  // fokus første link for tilgængelighed
  const firstLink = raavarerPanel.querySelector("a, button");
  firstLink?.focus();
}

function closeRaw() {
  if (!raavarerPanel || !backdrop) return;
  raavarerPanel.classList.remove("open");
  raavarerPanel.setAttribute("aria-hidden", "true");
  backdrop.classList.remove("show");
  setTimeout(() => {
    if (!backdrop.classList.contains("show")) backdrop.hidden = true;
  }, 180);
}

raavarerLink?.addEventListener("click", (e) => {
  e.preventDefault();
  // hvis niveau 1 ikke er åbent, åbnes det først
  if (!opsPanel?.classList.contains("open")) {
    opsPanel?.classList.add("open");
    opsBtn?.setAttribute("aria-expanded", "true");
  }
  openRaw();
});

// klik på backdrop lukker niveau 2
backdrop?.addEventListener("click", () => {
  closeRaw();
  closeLogin(); // <-- luk også login, hvis åbent
});

// ESC håndteres ovenfor (lukker begge)
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeRaw();
});

// Hvis niveau 1 lukkes, luk også niveau 2
opsBtn?.addEventListener("click", () => {
  setTimeout(() => {
    const l1Open = opsPanel?.classList.contains("open");
    if (!l1Open) closeRaw();
  }, 0);
});

// Klikker man et link i niveau 2 -> luk begge paneler
raavarerPanel?.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    closeRaw();
    closeOps();
  }
});
/* ===== LOGIN modal ===== */
// Henter knap og panel (backdrop findes allerede som 'backdrop')
const loginBtn = document.getElementById("loginBtn");
const loginPanel = document.getElementById("loginPanel");

function openLogin() {
  if (!loginPanel || !backdrop) return;

  // Luk andre paneler, så vi ikke har flere åbne samtidig
  if (typeof closeRaw === "function") closeRaw();
  if (typeof closeOps === "function") closeOps();

  loginPanel.classList.add("open");
  loginPanel.setAttribute("aria-hidden", "false");

  // Vis backdrop
  backdrop.hidden = false;
  backdrop.classList.add("show");

  // Fokus første felt for bedre tilgængelighed
  const first = loginPanel.querySelector("input, button, a");
  first?.focus();
}

function closeLogin() {
  if (!loginPanel || !backdrop) return;
  loginPanel.classList.remove("open");
  loginPanel.setAttribute("aria-hidden", "true");

  // Fjern backdrop hvis hverken login eller råvarer er åbne
  const rawOpen = document
    .getElementById("raavarerPanel")
    ?.classList.contains("open");
  if (!rawOpen) {
    backdrop.classList.remove("show");
    setTimeout(() => {
      if (!backdrop.classList.contains("show")) backdrop.hidden = true;
    }, 180);
  }
}

// Klik på "Log ind" i topmenuen — åbn/luk panelet
loginBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  const open = !loginPanel.classList.contains("open");
  if (open) openLogin();
  else closeLogin();
});

// Klik udenfor panelet lukker det
document.addEventListener("click", (e) => {
  if (loginPanel?.classList.contains("open")) {
    if (!loginPanel.contains(e.target) && !loginBtn.contains(e.target)) {
      closeLogin();
    }
  }
});

// ESC lukker login (vi bevarer dine eksisterende ESC-handlers for ops/raw)
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLogin();
});

// Hvis “Opkrifter” lukkes/åbnes, så luk login
opsBtn?.addEventListener("click", () => {
  // Hvis Opkrifter ender lukket, luk login
  setTimeout(() => {
    const opsOpen = opsPanel?.classList.contains("open");
    if (!opsOpen) closeLogin();
  }, 0);
});
