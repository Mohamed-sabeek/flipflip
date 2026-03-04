const DAILY_REWARD_COINS = 10;

const dailyPopup = document.getElementById("dailyRewardPopup");
const claimBtn = document.getElementById("claimDailyReward");

function getTodayKey() {
  const today = new Date();
  return today.toISOString().split("T")[0]; // yyyy-mm-dd
}

function checkDailyReward() {
  const todayKey = getTodayKey();
  const lastClaimed = localStorage.getItem("dailyRewardDate");

  if (lastClaimed !== todayKey) {
    showDailyReward();
  }
}

function showDailyReward() {
  dailyPopup.classList.remove("hidden");
  playSound("reward"); // optional 🎉
}

function claimDailyReward() {
  let coins = parseInt(localStorage.getItem("coins")) || 0;
  coins += DAILY_REWARD_COINS;

  localStorage.setItem("coins", coins);
  localStorage.setItem("dailyRewardDate", getTodayKey());

  dailyPopup.classList.add("hidden");

  // update UI if visible
  if (typeof updateCoinUI === "function") updateCoinUI();
  if (typeof updateLevelCoinUI === "function") updateLevelCoinUI();
}

claimBtn.addEventListener("click", claimDailyReward);

// 🔥 AUTO CHECK ON GAME LOAD
window.addEventListener("load", checkDailyReward);
