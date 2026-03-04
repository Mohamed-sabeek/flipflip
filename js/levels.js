const levelScreen = document.getElementById("levelScreen");
const levelGrid = document.getElementById("levelGrid");
const backBtn = document.getElementById("backToStart");

const TOTAL_LEVELS = 20;
const coinCountLevel = document.getElementById("coinCountLevel");

// load progress
let unlockedLevel = parseInt(localStorage.getItem("unlockedLevel")) || 1;

function showLevels() {
  playMenuMusic();

  levelScreen.classList.remove("hidden");
  updateLevelCoinUI();

  generateLevels();

  updateTotalStars();

  const unlockLevel = Number(localStorage.getItem("animateUnlock"));
  if (Number.isInteger(unlockLevel) && unlockLevel > 0) {
    setTimeout(() => animateUnlock(unlockLevel), 300);
    localStorage.removeItem("animateUnlock");
  }
}
function updateLevelCoinUI() {
  if (!coinCountLevel) return;

  const coins = parseInt(localStorage.getItem("coins")) || 0;
  coinCountLevel.textContent = coins;
}

function animateUnlock(level) {
  const buttons = levelGrid.querySelectorAll(".level-btn.level-badge");
  const btn = Array.from(buttons).find(
    (b) => b.querySelector(".level-number")?.textContent == level,
  );

  if (!btn) return;

  // POP
  btn.classList.add("unlock-pop");

  // SHAKE
  setTimeout(() => {
    if (!btn) return;

    btn.disabled = true;
    btn.classList.remove("unlock-pop");
    btn.classList.add("unlock-shake");
    playSound("match");
  }, 300);

  // GLOW
  setTimeout(() => {
    btn.classList.remove("unlock-shake");
    btn.classList.add("unlock-glow");
  }, 700);

  // CLEAN UP
  setTimeout(() => {
    btn.classList.remove("unlock-glow");
    btn.disabled = false;
  }, 1600);
}
function hideLevels() {
  levelScreen.classList.add("hidden");
}

/* generate levels */
function generateLevels() {
  unlockedLevel = parseInt(localStorage.getItem("unlockedLevel")) || 1;

  levelGrid.innerHTML = "";

  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    const btn = document.createElement("button");
    btn.classList.add("level-btn");

    if (i <= unlockedLevel) {
      btn.classList.add("unlocked", "level-badge");

      const stars = parseInt(localStorage.getItem(`stars_level_${i}`)) || 0;

      // ⭐ STAR CROWN (TOP)
      const starCrown = document.createElement("div");
      starCrown.className = "star-crown";

      for (let s = 1; s <= 3; s++) {
        const star = document.createElement("span");
        star.textContent = s <= stars ? "★" : "☆";
        if (s <= stars) star.classList.add("filled");
        starCrown.appendChild(star);
      }

      // 🔢 LEVEL NUMBER
      const levelNum = document.createElement("div");
      levelNum.className = "level-number";
      levelNum.textContent = i;

      btn.appendChild(starCrown);
      btn.appendChild(levelNum);

      btn.addEventListener("click", () => {
        playSound("click");
        hideLevels();
        if (typeof startGame === "function") {
          startGame(i);
        } else {
          console.error("startGame is not available");
        }
      });
    } else {
      btn.classList.add("locked");
      btn.innerHTML = `<span class="lock">🔒</span>`;
      btn.disabled = true;
    }

    levelGrid.appendChild(btn);
  }
}
if (backBtn) {
  backBtn.addEventListener("click", () => {
    playSound("click");

    levelScreen.classList.add("hidden");
    document.getElementById("startScreen").classList.remove("hidden");

    // optional but recommended
    if (typeof updateStartCoinUI === "function") {
      updateStartCoinUI();
    }
  });
}

function completeLevel(level) {
  if (level === unlockedLevel && unlockedLevel < TOTAL_LEVELS) {
    unlockedLevel++;
    localStorage.setItem("unlockedLevel", unlockedLevel);
  }

  updateTotalStars();
}

function resetLevels() {
  localStorage.setItem("unlockedLevel", 1);
  unlockedLevel = 1;

  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    localStorage.removeItem(`stars_level_${i}`);
  }

  updateTotalStars();
}


window.showLevels = showLevels;
window.completeLevel = completeLevel;
function updateTotalStars() {
  const starsEl = document.getElementById("totalStars");
  if (!starsEl) return;

  let total = 0;

  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    total += parseInt(localStorage.getItem(`stars_level_${i}`)) || 0;
  }

  const maxStars = TOTAL_LEVELS * 3;
  starsEl.textContent = `⭐ ${total} / ${maxStars}`;
}
