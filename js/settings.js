document.addEventListener("DOMContentLoaded", () => {
  const openSettings = document.getElementById("openSettings");
  const closeSettings = document.getElementById("closeSettings");
  const settingsPopup = document.getElementById("settingsPopup");

  const toggleSoundBtn = document.getElementById("toggleSoundBtn");
  const themeButtons = document.querySelectorAll(".theme-btn");

  if (!openSettings || !closeSettings || !settingsPopup || !toggleSoundBtn) {
    console.error("❌ Settings elements not found");
    return;
  }

  const knob = toggleSoundBtn.querySelector(".knob");
  if (!knob) {
    console.error("❌ Toggle knob not found");
    return;
  }

  /* ---------- SOUND TOGGLE UI ---------- */
  function updateSoundToggleUI() {
    if (window.soundEnabled) {
      toggleSoundBtn.classList.remove("off");
      knob.textContent = "🔊";
    } else {
      toggleSoundBtn.classList.add("off");
      knob.textContent = "🔇";
    }
  }

  /* ---------- THEME UI ---------- */
  function updateThemeUI() {
    const activeTheme = localStorage.getItem("cardTheme") || "fruits";

    themeButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.theme === activeTheme);
    });
  }

  /* ---------- OPEN SETTINGS ---------- */
  openSettings.addEventListener("click", () => {
    playSound("click");
    settingsPopup.classList.remove("hidden");
  });

  /* ---------- CLOSE SETTINGS ---------- */
  closeSettings.addEventListener("click", () => {
    playSound("click");
    settingsPopup.classList.add("hidden");
  });

  /* ---------- TOGGLE SOUND ---------- */
  toggleSoundBtn.addEventListener("click", () => {
    playSound("click");
    toggleSound();
    updateSoundToggleUI();
  });

  /* ---------- THEME BUTTONS ---------- */
  themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      playSound("click");
      localStorage.setItem("cardTheme", btn.dataset.theme);
      updateThemeUI();
    });
  });

  /* ---------- INITIAL SYNC ---------- */
  updateSoundToggleUI();
  updateThemeUI();
});
