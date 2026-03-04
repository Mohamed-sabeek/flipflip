// ================== SOUND EFFECTS ==================
const sounds = {
  click: new Audio("assets/sounds/click.mp3"),
  flip: new Audio("assets/sounds/flip.mp3"),
  match: new Audio("assets/sounds/match.mp3"),
  win: new Audio("assets/sounds/win.mp3"),
  fail: new Audio("assets/sounds/fail.mp3"),
  pause: new Audio("assets/sounds/pause.mp3"),
  revive: new Audio("assets/sounds/revive.mp3"),
};
let audioUnlocked = false;

// ================== BACKGROUND MUSIC ==================
const menuMusic = new Audio("assets/sounds/menu.mp3");
const gameMusic = new Audio("assets/sounds/game.mp3");

menuMusic.loop = true;
gameMusic.loop = true;

// ================== SETTINGS ==================
let soundEnabled = JSON.parse(localStorage.getItem("soundEnabled"));
if (soundEnabled === null) soundEnabled = true;

let volume = parseFloat(localStorage.getItem("volume"));
if (isNaN(volume)) volume = 0.8;

// expose initial state
window.soundEnabled = soundEnabled;

// ================== APPLY VOLUME ==================
function applyVolume() {
  Object.values(sounds).forEach((s) => (s.volume = volume));
  menuMusic.volume = volume;
  gameMusic.volume = volume;
}
applyVolume();

// ================== SOUND EFFECTS ==================
function playSound(name) {
  if (!soundEnabled || !sounds[name]) return;

  // 🔒 block until unlocked
  if (!audioUnlocked) return;

  const s = sounds[name];
  s.currentTime = 0;
  s.play().catch(() => {});
}

// ================== MUSIC CONTROL ==================
function stopAllMusic() {
  menuMusic.pause();
  gameMusic.pause();
}

function playMenuMusic() {
  if (!soundEnabled) return;

  if (!menuMusic.paused) return; // already playing

  gameMusic.pause();
  menuMusic.currentTime = 0;
  menuMusic.play().catch(() => {});
}

function playGameMusic() {
  if (!soundEnabled) return;

  menuMusic.pause();
  gameMusic.currentTime = 0;
  gameMusic.play().catch(() => {});
}

// alias used in game
function playBackgroundMusic() {
  playGameMusic();
}

// ================== TOGGLE SOUND ==================
function toggleSound() {
  soundEnabled = !soundEnabled;

  // 🔑 CRITICAL FIX
  window.soundEnabled = soundEnabled;

  localStorage.setItem("soundEnabled", soundEnabled);

  if (!soundEnabled) {
    stopAllMusic();
  } else {
    playMenuMusic();
  }
}

// ================== MOBILE / BROWSER AUDIO UNLOCK ==================
function unlockAudio() {
  if (audioUnlocked) return;

  const a = sounds.click; // use ONE sound only

  a.muted = false;
  a.play()
    .then(() => {
      a.pause();
      a.currentTime = 0;
      audioUnlocked = true; // 🔑 THIS IS THE KEY
      console.log("🔓 Audio unlocked");
    })
    .catch(() => {});
}

// 🔥 MUST listen to touchstart FIRST
document.addEventListener("touchstart", unlockAudio, { once: true });
document.addEventListener("click", unlockAudio, { once: true });

// ================== EXPORT TO WINDOW ==================
window.playSound = playSound;
window.toggleSound = toggleSound;
window.playMenuMusic = playMenuMusic;
window.playGameMusic = playGameMusic;
window.playBackgroundMusic = playBackgroundMusic;
window.stopAllMusic = stopAllMusic;
