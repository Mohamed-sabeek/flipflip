const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

/* ---------- START GAME ---------- */
startBtn.addEventListener("click", () => {
  playSound("click");

  // Hide start screen
  startScreen.classList.add("hidden");

  // Show level screen
  if (typeof showLevels === "function") {
    showLevels();
  } else {
    console.error("showLevels() not found");
  }
});

/* ---------- LEVEL RULES ---------- */
function getLevelRule(level) {
  // EASY
  if (level === 1) return { type: "moves", limit: 12 };
  if (level === 2) return { type: "moves", limit: 10 };

  // INTRO TIME
  if (level === 3) return { type: "time", limit: 50 };
  if (level === 4) return { type: "time", limit: 45 };

  // MIX
  if (level === 5) return { type: "moves", limit: 14 };

  // MEDIUM
  if (level === 6) return { type: "time", limit: 45 };
  if (level === 7) return { type: "time", limit: 40 };
  if (level === 8) return { type: "moves", limit: 16 };

  // MEDIUM–HARD
  if (level === 9) return { type: "time", limit: 40 };
  if (level === 10) return { type: "time", limit: 35 };
  if (level === 11) return { type: "moves", limit: 18 };

  // HARD
  if (level === 12) return { type: "time", limit: 35 };
  if (level === 13) return { type: "time", limit: 30 };
  if (level === 14) return { type: "moves", limit: 20 };

  // VERY HARD
  if (level === 15) return { type: "time", limit: 30 };
  if (level === 16) return { type: "time", limit: 28 };
  if (level === 17) return { type: "time", limit: 25 };
  if (level === 18) return { type: "moves", limit: 22 };
  if (level === 19) return { type: "time", limit: 25 };

  // FINAL BOSS 😈
  return { type: "time", limit: 20 };
}

// 🌍 Make global for game.js
window.getLevelRule = getLevelRule;
