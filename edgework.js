document.querySelectorAll(".pick-card[data-wager][data-odds]").forEach((pick) => {
  const wager = Number.parseFloat(pick.dataset.wager);
  const odds = Number.parseFloat(pick.dataset.odds);
  const output = pick.querySelector(".pick-to-win");

  if (!output || !Number.isFinite(wager) || !Number.isFinite(odds)) return;

  const potentialProfit = wager * (odds - 1);
  output.textContent = `${potentialProfit.toFixed(2)} U`;
});
