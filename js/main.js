/* ═══════════════════════════════════════════════════════════════
   WEDDING INVITATION
   Countdown, scroll animations, gallery, music and auto-scroll
   ═══════════════════════════════════════════════════════════════ */

/* تاريخ ووقت الزفاف */
const WEDDING_DATE = new Date("2026-11-02T17:00:00+02:00");

/* البريد الإلكتروني */
const COUPLE_EMAIL = "emma.james@example.com";


/* ── Countdown ───────────────────────────────────────────────── */

const cd = {
  days: document.getElementById("cd-days"),
  hours: document.getElementById("cd-hours"),
  minutes: document.getElementById("cd-minutes"),
  seconds: document.getElementById("cd-seconds"),
};

function updateCountdown() {
  const countdown = document.getElementById("countdown");
  const diff = WEDDING_DATE - new Date();

  if (diff <= 0) {
    if (countdown) {
      countdown.innerHTML =
        '<p class="cd-today" style="font-style:italic">Today is the big day!</p>';
    }
    clearInterval(countdownTimer);
    return;
  }

  const sec = Math.floor(diff / 1000);

  if (cd.days) cd.days.textContent = Math.floor(sec / 86400);
  if (cd.hours) {
    cd.hours.textContent = String(
      Math.floor((sec % 86400) / 3600)
    ).padStart(2, "0");
  }
  if (cd.minutes) {
    cd.minutes.textContent = String(
      Math.floor((sec % 3600) / 60)
    ).padStart(2, "0");
  }
  if (cd.seconds) {
    cd.seconds.textContent = String(sec % 60).padStart(2, "0");
  }
}

const countdownTimer = setInterval(updateCountdown, 1000);
updateCountdown();


/* ── Reveal sections on scroll ───────────────────────────────── */

if ("IntersectionObserver" in window) {
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

  document.querySelectorAll(".reveal").forEach((el) => {
    observer.observe(el);
  });
} else {
  document.querySelectorAll(".reveal").forEach((el) => {
    el.classList.add("visible");
  });
}


/* ── Gallery: lightbox ───────────────────────────────────────── */

const lightbox = document.getElementById("lightbox");

if (lightbox) {
  const lightboxImg = lightbox.querySelector("img");

  if (lightboxImg) {
    document.querySelectorAll(".gallery-grid img").forEach((img) => {
      img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;

        if (typeof lightbox.showModal === "function") {
          lightbox.showModal();
        }
      });
    });
  }

  lightbox.addEventListener("click", () => {
    if (typeof lightbox.close === "function" && lightbox.open) {
      lightbox.close();
    }
  });
}


/* ── Music and automatic scrolling ───────────────────────────── */

(() => {
  const welcome = document.getElementById("welcome-screen");
  const openButton = document.getElementById("open-invitation");
  const music = document.getElementById("wedding-music");
  const controls = document.getElementById("invitation-controls");
  const musicButton = document.getElementById("toggle-music");

  if (!welcome || !openButton || !music || !musicButton) {
    console.warn("Invitation controls or music elements were not found.");
    return;
  }

  let scrolling = false;
  let animationFrame = null;
  let lastTime = 0;
  let musicStarted = false;
  let lastTouchY = null;
  let userInterruptedScroll = false;

  /* إيقاف التمرير التلقائي */
  function stopScrolling() {
    scrolling = false;

    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    lastTime = 0;
  }

  /* تحريك الصفحة تدريجيًا */
  function scrollStep(time) {
    if (!scrolling || userInterruptedScroll) return;

    if (!lastTime) lastTime = time;

    const elapsed = Math.min(time - lastTime, 50);
    lastTime = time;

    const scroller = document.scrollingElement;

    if (!scroller) {
      stopScrolling();
      return;
    }

    const maxScroll = Math.max(
      0,
      scroller.scrollHeight - window.innerHeight
    );

    const currentPosition = scroller.scrollTop;

    if (currentPosition >= maxScroll - 2) {
      stopScrolling();
      return;
    }

    /* السرعة: كلما قل الرقم أصبح التمرير أبطأ */
    const nextPosition = Math.min(
      currentPosition + elapsed * 0.035,
      maxScroll
    );

    scroller.scrollTop = nextPosition;

    animationFrame = requestAnimationFrame(scrollStep);
  }

  /* بدء التمرير */
 function startScrolling() {
  stopScrolling();
  userInterruptedScroll = false;
  scrolling = true;
  lastTime = 0;

  function begin() {
    if (!scrolling) return;
    animationFrame = requestAnimationFrame(scrollStep);
  }

  begin();
}

  /* تشغيل الموسيقى من الثانية 8 */
  async function playMusic() {
    try {
      if (!musicStarted) {
        if (music.readyState < 1) {
          await new Promise((resolve, reject) => {
            music.addEventListener("loadedmetadata", resolve, {
              once: true,
            });

            music.addEventListener("error", reject, {
              once: true,
            });

            music.load();
          });
        }

        if (Number.isFinite(music.duration) && music.duration > 8) {
          music.currentTime = 8;
        } else {
          music.currentTime = 0;
        }
      }

      await music.play();

      musicStarted = true;
      musicButton.textContent = "♫ إيقاف الموسيقى";
    } catch (error) {
      musicButton.textContent = "♫ تشغيل الموسيقى";
      console.error("تعذر تشغيل الموسيقى:", error);
    }
  }

  /* فتح الدعوة */
  openButton.addEventListener("click", () => {
    welcome.classList.add("is-hidden");

    if (controls) {
      controls.hidden = false;
    }

    startScrolling();
    playMusic();
  });

  /* زر تشغيل وإيقاف الموسيقى */
  musicButton.addEventListener("click", async () => {
    if (!music.paused) {
      music.pause();
      musicButton.textContent = "♫ تشغيل الموسيقى";
    } else {
      await playMusic();
    }
  });

  /* إعادة الموسيقى من الثانية 8 عند انتهائها */
  music.addEventListener("ended", async () => {
    musicStarted = false;
    await playMusic();
  });

  /* إيقاف التمرير إذا اختارت الزائرة تحريك الصفحة بنفسها */
  window.addEventListener(
    "wheel",
    () => {
      userInterruptedScroll = true;
      stopScrolling();
    },
    { passive: true }
  );

  window.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length > 0) {
        lastTouchY = event.touches[0].clientY;
      }
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    (event) => {
      if (lastTouchY === null || event.touches.length === 0) return;

      const currentY = event.touches[0].clientY;

      if (Math.abs(currentY - lastTouchY) > 10) {
        userInterruptedScroll = true;
        stopScrolling();
      }

      lastTouchY = currentY;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    () => {
      lastTouchY = null;
    },
    { passive: true }
  );

  window.addEventListener("keydown", (event) => {
    const scrollKeys = [
      "ArrowDown",
      "ArrowUp",
      "PageDown",
      "PageUp",
      "Home",
      "End",
      " ",
    ];

    if (scrollKeys.includes(event.key)) {
      userInterruptedScroll = true;
      stopScrolling();
    }
  });
})();
