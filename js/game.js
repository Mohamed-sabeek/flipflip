const gameScreen = document.getElementById("gameScreen");
const gameBoard = document.getElementById("gameBoard");
const movesText = document.getElementById("movesCount");
const timeText = document.getElementById("timeCount");

const winScreen = document.getElementById("winScreen");
const playAgainBtn = document.getElementById("playAgainBtn");
const nextLevelBtn = document.getElementById("nextLevelBtn");
const homeBtn = document.getElementById("homeBtn");

const failScreen = document.getElementById("failScreen");
const retryBtn = document.getElementById("retryBtn");
const failHomeBtn = document.getElementById("failHomeBtn");
const pauseScreen = document.getElementById("pauseScreen");
const pauseBtn = document.getElementById("pauseBtn");
pauseBtn.addEventListener("click", () => {
  playSound("click");
  pauseGame();
});
const resumeBtn = document.getElementById("resumeBtn");
const replayBtn = document.getElementById("replayBtn");
const pauseHomeBtn = document.getElementById("pauseHomeBtn");
const coinText = document.getElementById("coinCount");

/* ---------- COINS & REVIVE ---------- */
let coins = parseInt(localStorage.getItem("coins")) || 0;
let reviveCount = 0;

const revivePopup = document.getElementById("revivePopup");
const reviveYesBtn = document.getElementById("reviveYes");
const reviveNoBtn = document.getElementById("reviveNo");
const levelText = document.getElementById("levelText");

let isPaused = false;

/* ---------- GAME STATE ---------- */
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let moves = 0;
let timerInterval = null;
let timeLeft = 0;

let currentLevel = 1;
let matchedPairs = 0;
let totalPairs = 0;

let currentRule = null; // { type: "moves" | "time", limit }
let reviveTimer = null; // ✅ REQUIRED

/* ---------- SYMBOL SETS ---------- */
const SYMBOL_SETS = {
  fruits: [
    "🍎",
    "🍌",
    "🍇",
    "🍒",
    "🍉",
    "🥝",
    "🍍",
    "🥥",
    "🍑",
    "🍓",
    "🍋",
    "🍐",
  ],
  emojis: [
    "😀",
    "😎",
    "🥳",
    "😍",
    "🤖",
    "👻",
    "🎃",
    "😺",
    "🐶",
    "🐸",
    "🦄",
    "🐵",
  ],
  numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "①", "②"],
  shapes: [
    "❤️",
    "⭐",
    "⬛",
    "⬜",
    "🔺",
    "🔵",
    "🔶",
    "🟢",
    "🔷",
    "🟣",
    "⚫",
    "⚪",
  ],
};

/* get active symbols */
function getActiveSymbols() {
  const theme = localStorage.getItem("cardTheme") || "fruits";
  return SYMBOL_SETS[theme] || SYMBOL_SETS.fruits;
}

function pauseGame() {
  if (isPaused) return;
  playSound("pause");

  lockBoard = true;
  isPaused = true;
  stopTimer();
  gameScreen.classList.add("hidden");
  pauseScreen.classList.remove("hidden");
}
function updateCoinUI() {
  if (!coinText) return;
  coinText.textContent = coins;
}

function resumeGame() {
  if (!isPaused) return;

  isPaused = false;
  lockBoard = false;

  pauseScreen.classList.add("hidden");

  gameScreen.classList.remove("hidden");

  if (currentRule?.type === "time" && !timerInterval) {
    startTimer(timeLeft);
  }
}
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

/* ---------- START GAME ---------- */
function startGame(level) {
  coins = parseInt(localStorage.getItem("coins")) || 0;
  updateCoinUI();

  playGameMusic();
  reviveCount = 0;
  lockBoard = false;
  firstCard = null;
  secondCard = null;
  matchedPairs = 0;

  isPaused = false;

  currentLevel = level;
  if (levelText) {
    levelText.textContent = `Level ${level}`;
  }

  currentRule = getLevelRule(level);

  // HIDE ALL OTHER SCREENS
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("levelScreen").classList.add("hidden");
  document.getElementById("levelInfo").classList.add("hidden");
  winScreen.classList.add("hidden");
  failScreen.classList.add("hidden");
  pauseScreen.classList.add("hidden");

  // SHOW GAME
  gameScreen.classList.remove("hidden");
  gameBoard.innerHTML = ""; // ✅ ADD THIS

  resetStats();
  timeText.classList.remove("warning");

  if (currentRule.type === "time") {
    movesText.style.display = "none";
    timeText.style.display = "inline";
    startTimer(currentRule.limit);
  } else {
    movesText.style.display = "inline";
    timeText.style.display = "none";
    movesText.textContent = `Moves Left: ${currentRule.limit}`;
  }

  createBoard();
}

/* ---------- CREATE BOARD ---------- */
function createBoard() {
  const activeSymbols = getActiveSymbols(); // ✅ MOVE THIS TO TOP

  let pairs;

  if (currentLevel <= 2) pairs = 2;
  else if (currentLevel <= 5) pairs = 4;
  else if (currentLevel <= 8) pairs = 6;
  else if (currentLevel <= 11) pairs = 8;
  else if (currentLevel <= 14) pairs = 10;
  else pairs = 12; // levels 15–20

  totalPairs = pairs;
  matchedPairs = 0;

  const selectedSymbols = activeSymbols.slice(0, pairs);

  const cards = [...selectedSymbols, ...selectedSymbols].sort(
    () => Math.random() - 0.5,
  );

  const grid = document.createElement("div");
  grid.className = "game-grid";

  if (pairs <= 2) grid.style.gridTemplateColumns = "repeat(2, 1fr)";
  else if (pairs <= 3) grid.style.gridTemplateColumns = "repeat(3, 1fr)";
  else grid.style.gridTemplateColumns = "repeat(4, 1fr)";

  cards.forEach((symbol) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-front"></div>
        <div class="card-face card-back">${symbol}</div>
      </div>
    `;

    card.addEventListener("click", () => flipCard(card));
    grid.appendChild(card);
  });

  gameBoard.appendChild(grid);
}

/* ---------- FLIP LOGIC ---------- */
function flipCard(card) {
  if (isPaused) return;
  if (currentRule.type === "moves") {
    const movesLeft = currentRule.limit - moves;
    if (movesLeft <= 0) return;
  }

  if (
    lockBoard ||
    card === firstCard ||
    card.classList.contains("matched") // ✅ ADD THIS
  )
    return;

  card.classList.add("flipped");
  playSound("flip");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  moves++;

  if (currentRule.type === "moves") {
    const movesLeft = currentRule.limit - moves;

    movesText.textContent =
      movesLeft <= 2
        ? `Moves Left: ${movesLeft} ⚠️`
        : `Moves Left: ${movesLeft}`;

    if (movesLeft <= 2) {
      movesText.classList.add("moves-warning");
    } else {
      movesText.classList.remove("warning");
    }

    // 🎴 trigger revive immediately
    if (movesLeft <= 0) {
      setTimeout(() => {
        tryRevive();
      }, 300);
    }
  }

  checkMatch();
}
function checkMatch() {
  const isMatch =
    firstCard.querySelector(".card-back").textContent ===
    secondCard.querySelector(".card-back").textContent;

  if (isMatch) {
    playSound("match");
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    matchedPairs++;

    resetTurn();

    if (matchedPairs >= totalPairs) {
      console.log("WIN TRIGGERED"); // debug
      setTimeout(winLevel, 400);
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();

      // ✅ NOW check move-based failure AFTER animation
      if (currentRule.type === "moves") {
        const movesLeft = currentRule.limit - moves;
        if (movesLeft <= 0) {
          tryRevive();
        }
      }
    }, 700);
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}
function calculateStars() {
  let stars = 1;

  if (currentRule.type === "moves") {
    const used = moves;
    const limit = currentRule.limit;
    const ratio = used / limit;

    if (ratio <= 0.7) stars = 3;
    else if (ratio <= 0.9) stars = 2;
    else stars = 1;
  } else {
    const remaining = timeLeft;
    const total = currentRule.limit;
    const ratio = remaining / total;

    if (ratio >= 0.35) stars = 3;
    else if (ratio >= 0.15) stars = 2;
    else stars = 1;
  }

  return stars;
}

/* ---------- WIN ---------- */
function winLevel() {
  // SAFETY CLEANUP
  if (revivePopup) revivePopup.classList.add("hidden");
  isPaused = false;
  lockBoard = false;

  playSound("win");
  stopTimer();

  const stars = calculateStars();

  // save best stars per level
  const key = `stars_level_${currentLevel}`;
  const prevStars = parseInt(localStorage.getItem(key)) || 0;

  // ⭐⭐⭐ reward ONLY if improved to 3 stars
  if (stars === 3 && stars > prevStars) {
    coins += 10;
    localStorage.setItem("coins", coins);
    updateCoinUI();
  }

  if (stars > prevStars) {
    localStorage.setItem(key, stars);
  }

  const prevUnlocked = parseInt(localStorage.getItem("unlockedLevel")) || 1;

  window.completeLevel(currentLevel);

  const newUnlocked = parseInt(localStorage.getItem("unlockedLevel"));
  if (newUnlocked > prevUnlocked) {
    localStorage.setItem("animateUnlock", newUnlocked);
  }

  showStarsOnWin(stars);

  gameScreen.classList.add("hidden");
  pauseScreen.classList.add("hidden");
  failScreen.classList.add("hidden");
  winScreen.classList.remove("hidden");
}
function showStarsOnWin(stars) {
  const starBox = document.getElementById("winStars");
  starBox.innerHTML = "";

  for (let i = 1; i <= 3; i++) {
    starBox.innerHTML += i <= stars ? "⭐" : "☆";
  }
}

/* ---------- FAIL ---------- */
function failLevel() {
  playSound("fail");

  isPaused = false;
  stopTimer();
  gameScreen.classList.add("hidden");
  failScreen.classList.remove("hidden");
}
function tryRevive() {
  if (isPaused) return; // 🛑 prevent double calls

  if (reviveCount >= 2) {
    failLevel();
    return;
  }

  if (coins < 5) {
    failLevel();
    return;
  }

  showRevivePopup();
}

function showRevivePopup() {
  // stop any previous revive timer
  if (reviveTimer) {
    clearInterval(reviveTimer);
    reviveTimer = null;
  }

  lockBoard = true;
  isPaused = true;

  const text = revivePopup.querySelector("p");

  // minimal, clear message
  if (currentRule.type === "moves") {
    text.textContent = "+3 Moves · 5 🪙";
  } else {
    text.textContent = "+10 Seconds · 5 🪙";
  }

  revivePopup.classList.remove("hidden");
}

function hideRevivePopup() {
  if (reviveTimer) {
    clearInterval(reviveTimer);
    reviveTimer = null;
  }

  revivePopup.classList.add("hidden");
  lockBoard = false;
  isPaused = false;
}

function reviveGame() {
  if (coins < 5) {
    hideRevivePopup();
    failLevel();
    return;
  }

  coins -= 5;
  reviveCount++;
  localStorage.setItem("coins", coins);
  updateCoinUI();

  if (currentRule.type === "time") {
    timeLeft += 10; // ✅ +10 seconds
    startTimer(timeLeft);
  } else {
    moves = Math.max(0, moves - 3);

    const movesLeft = currentRule.limit - moves;
    movesText.textContent = `Moves Left: ${movesLeft}`;
  }

  hideRevivePopup();
}

/* ---------- TIMER (COUNTDOWN) ---------- */
function startTimer(seconds) {
  stopTimer();
  timeLeft = seconds;
  updateTimeUI();

  timerInterval = setInterval(() => {
    timeLeft--;

    updateTimeUI();

    if (timeLeft <= 0) {
      stopTimer();

      // 🔥 FORCE revive for time mode
      if (currentRule.type === "time") {
        tryRevive();
      }
    }
  }, 1000);
}

function updateTimeUI() {
  const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");
  timeText.textContent = `Time: ${m}:${s}`;

  if (timeLeft <= 10) {
    timeText.classList.add("time-warning");
  } else {
    timeText.classList.remove("warning");
  }
}

/* ---------- RESET ---------- */
function resetStats() {
  moves = 0;
  movesText.classList.remove("warning");

  if (currentRule?.type === "moves") {
    movesText.textContent = `Moves Left: ${currentRule.limit}`;
  } else {
    movesText.textContent = "Moves: 0";
  }
}

/* ---------- BUTTONS ---------- */
playAgainBtn.addEventListener("click", () => {
  winScreen.classList.add("hidden");
  startGame(currentLevel);
});

nextLevelBtn.addEventListener("click", () => {
  winScreen.classList.add("hidden");

  if (currentLevel < 20) {
    startGame(currentLevel + 1);
  } else {
    showLevels(); // finished all levels
  }
});

homeBtn.addEventListener("click", () => {
  playMenuMusic();
  winScreen.classList.add("hidden");
  showLevels();
});

retryBtn.addEventListener("click", () => {
  failScreen.classList.add("hidden");
  startGame(currentLevel);
});

failHomeBtn.addEventListener("click", () => {
  playMenuMusic();
  failScreen.classList.add("hidden");
  showLevels();
});
/* RESUME */
resumeBtn.addEventListener("click", () => {
  playSound("click"); // 🔊 ADD THIS
  resumeGame();
});

/* REPLAY */
replayBtn.addEventListener("click", () => {
  playSound("click");
  stopTimer(); // ✅ ADD
  pauseScreen.classList.add("hidden");
  isPaused = false;
  startGame(currentLevel);
});

pauseHomeBtn.addEventListener("click", () => {
  playSound("click");
  playMenuMusic(); // ✅ switch ONLY when leaving game
  pauseScreen.classList.add("hidden");
  isPaused = false;
  stopTimer();
  showLevels();
});
reviveYesBtn.addEventListener("click", () => {
  playSound("revive"); // 🔊 sound ONLY on YES
  reviveGame();
});

reviveNoBtn.addEventListener("click", () => {
  hideRevivePopup();
  failLevel();
});

window.startGame = startGame;
