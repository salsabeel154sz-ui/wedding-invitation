/* ═══════════════════════════════════════════════════════════════
   WEDDING INVITE, script
   Countdown, scroll animations, gallery, RSVP.
   ═══════════════════════════════════════════════════════════════ */

/* CUSTOMIZE: date and time of the ceremony (used by the countdown).
   "+01:00" is British Summer Time, adjust for your own timezone. */
const WEDDING_DATE = new Date("2026-11-02T17:00:00+02:00");

/* CUSTOMIZE: the email address RSVPs are sent to, when the form uses
   the "mailto" mode (the default). */
const COUPLE_EMAIL = "emma.james@example.com";

/* ── Countdown ────────────────────────────────────────────────── */

const cd = {
  days: document.getElementById("cd-days"),
  hours: document.getElementById("cd-hours"),
  minutes: document.getElementById("cd-minutes"),
  seconds: document.getElementById("cd-seconds"),
};

function updateCountdown() {
  const diff = WEDDING_DATE - new Date();

  if (diff <= 0) {
    document.getElementById("countdown").innerHTML =
      '<p class="cd-today" style="font-style:italic">Today is the big day!</p>';
    clearInterval(countdownTimer);
    return;
  }

  const sec = Math.floor(diff / 1000);
  cd.days.textContent = Math.floor(sec / 86400);
  cd.hours.textContent = String(Math.floor((sec % 86400) / 3600)).padStart(2, "0");
  cd.minutes.textContent = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  cd.seconds.textContent = String(sec % 60).padStart(2, "0");
}

const countdownTimer = setInterval(updateCountdown, 1000);
updateCountdown();

/* ── Gentle reveal of sections on scroll ───────────────────────── */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* ── Gallery: lightbox ────────────────────────────────────────── */

const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector("img");

document.querySelectorAll(".gallery-grid img").forEach((img) => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.showModal();
  });
});

lightbox.addEventListener("click", () => lightbox.close());

