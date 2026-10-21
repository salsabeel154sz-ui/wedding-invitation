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
/* افتتاح الدعوة وتشغيل الموسيقى والتمرير التلقائي */
(() => {
  const welcome = document.getElementById("welcome-screen");
  const openButton = document.getElementById("open-invitation");
  const music = document.getElementById("wedding-music");
  const controls = document.getElementById("invitation-controls");
  
  const musicButton = document.getElementById("toggle-music");

  if (!welcome || !openButton || !music) return;

  let scrolling = false;
  let lastTime = 0;
  let animationFrame = null;
  let musicStarted = false;

  function stopScrolling() {
    scrolling = false;
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
   
  }

  function scrollStep(time) {
    if (!scrolling) return;

    if (!lastTime) lastTime = time;
    const delta = Math.min(time - lastTime, 50);
    lastTime = time;

    window.scrollBy(0, delta * 0.12);

    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2;

    if (atBottom) {
      stopScrolling();
      return;
    }

    animationFrame = requestAnimationFrame(scrollStep);
  }

  function startScrolling() {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      stopScrolling();
      return;
    }

    scrolling = true;
    lastTime = 0;
    
    animationFrame = requestAnimationFrame(scrollStep);
  }

  openButton.addEventListener("click", async () => {
    welcome.classList.add("is-hidden");
    controls.hidden = false;

    if (!musicStarted) {
      try {
        await music.play();
        musicStarted = true;
        musicButton.textContent = "إيقاف الموسيقى";
      } catch (error) {
        musicButton.textContent = "تشغيل الموسيقى";
      }
    }

    startScrolling();
  });

  

  musicButton.addEventListener("click", async () => {
    if (!music.paused) {
      music.pause();
      musicButton.textContent = "تشغيل الموسيقى";
      return;
    }

    try {
      await music.play();
      musicStarted = true;
      musicButton.textContent = "إيقاف الموسيقى";
    } catch (error) {
      musicButton.textContent = "إعادة المحاولة";
    }
  });

  window.addEventListener("wheel", () => {
    if (scrolling) stopScrolling();
  }, { passive: true });

  window.addEventListener("touchstart", () => {
    if (scrolling) stopScrolling();
  }, { passive: true });
})();/* افتتاح الدعوة وتشغيل الموسيقى والتمرير التلقائي */
(() => {
  const welcome = document.getElementById("welcome-screen");
  const openButton = document.getElementById("open-invitation");
  const music = document.getElementById("wedding-music");
  const controls = document.getElementById("invitation-controls");
  const scrollButton = document.getElementById("pause-scroll");
  const musicButton = document.getElementById("toggle-music");

  if (!welcome || !openButton || !music) return;

  let scrolling = false;
  let lastTime = 0;
  let animationFrame = null;
  let musicStarted = false;

  function stopScrolling() {
    scrolling = false;
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    scrollButton.textContent = "متابعة الحركة";
  }

  function scrollStep(time) {
    if (!scrolling) return;

    if (!lastTime) lastTime = time;
    const delta = Math.min(time - lastTime, 50);
    lastTime = time;

    window.scrollBy(0, delta * 0.025);

    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2;

    if (atBottom) {
      stopScrolling();
      return;
    }

    animationFrame = requestAnimationFrame(scrollStep);
  }

  function startScrolling() {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      stopScrolling();
      return;
    }

    scrolling = true;
    lastTime = 0;
    scrollButton.textContent = "إيقاف الحركة";
    animationFrame = requestAnimationFrame(scrollStep);
  }

  openButton.addEventListener("click", async () => {
    welcome.classList.add("is-hidden");
    controls.hidden = false;

    if (!musicStarted) {
      try {
        await music.play();
        musicStarted = true;
        musicButton.textContent = "إيقاف الموسيقى";
      } catch (error) {
        musicButton.textContent = "تشغيل الموسيقى";
      }
    }

    startScrolling();
  });

  scrollButton.addEventListener("click", () => {
    if (scrolling) {
      stopScrolling();
    } else {
      startScrolling();
    }
  });

  musicButton.addEventListener("click", async () => {
    if (!music.paused) {
      music.pause();
      musicButton.textContent = "تشغيل الموسيقى";
      return;
    }

    try {
      await music.play();
      musicStarted = true;
      musicButton.textContent = "إيقاف الموسيقى";
    } catch (error) {
      musicButton.textContent = "إعادة المحاولة";
    }
  });

  window.addEventListener("wheel", () => {
    if (scrolling) stopScrolling();
  }, { passive: true });

  window.addEventListener("touchstart", () => {
    if (scrolling) stopScrolling();
  }, { passive: true });
})();

