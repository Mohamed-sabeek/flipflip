// ⚠️ DEV ONLY — DELETE BEFORE RELEASE
(function () {
  const TOTAL_LEVELS = 20;

  function resetAllProgress() {
    // 🔓 Reset levels
    localStorage.setItem("unlockedLevel", 1);

    // ⭐ Clear all stars
    for (let i = 1; i <= TOTAL_LEVELS; i++) {
      localStorage.removeItem(`stars_level_${i}`);
    }

    // 🪙 Reset coins
    localStorage.setItem("coins", 0);

    // 🧹 Cleanup animations
    localStorage.removeItem("animateUnlock");

    console.log("✅ DEV RESET: All progress cleared");
    alert("DEV RESET DONE");
  }

  // expose for console or buttons
  window.__devResetGame = resetAllProgress;
})();
