const picksEscape = value => String(value ?? "").replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);

const picksDate = value => new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Toronto", month: "short", day: "numeric",
}).format(new Date(value));

const picksTime = value => new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Toronto", hour: "numeric", minute: "2-digit",
}).format(new Date(value));

const marketLabel = pick => {
  const name = pick.market === "moneyline" ? "Moneyline" : pick.market === "spread" ? "Run line" : "Total";
  if (pick.line == null) return name;
  const line = Number(pick.line);
  return `${name} · ${line > 0 ? "+" : ""}${line}`;
};

const pickProfit = pick => pick.result === "win"
  ? Number(pick.wager) * (Number(pick.odds) - 1)
  : pick.result === "loss" ? -Number(pick.wager) : pick.result === "push" ? 0 : null;

function renderDailyPicks(picks) {
  const container = document.querySelector("#daily-picks");
  if (!picks.length) {
    container.innerHTML = '<p class="picks-empty">No picks have been published for today.</p>';
    return;
  }
  container.innerHTML = picks.map(pick => `
    <article class="pick-card">
      <div class="pick-matchup"><span>Matchup</span><strong>${picksEscape(pick.matchup)}</strong><small>${picksDate(pick.start)} · ${picksTime(pick.start)}</small></div>
      <div><span>Selection</span><strong>${picksEscape(pick.selection)}</strong><small>${picksEscape(marketLabel(pick))}</small></div>
      <div><span>Sportsbook</span><strong>${picksEscape(pick.sportsbook || "—")}</strong></div>
      <div><span>Odds</span><strong>${Number(pick.odds).toFixed(2)}</strong></div>
      <div><span>Wager</span><strong>${Number(pick.wager).toFixed(2)} U</strong></div>
      <div><span>To win</span><strong>${(Number(pick.wager) * (Number(pick.odds) - 1)).toFixed(2)} U</strong></div>
    </article>`).join("");
}

const previousPicksPageSize = 5;
let previousPicksPage = 1;
let previousPicksData = [];

function renderPreviousPicks(picks) {
  previousPicksData = picks;
  const settled = picks.filter(pick => ["win", "loss", "push"].includes(pick.result));
  const wins = settled.filter(pick => pick.result === "win").length;
  const losses = settled.filter(pick => pick.result === "loss").length;
  const pushes = settled.filter(pick => pick.result === "push").length;
  const profit = settled.reduce((sum, pick) => sum + pickProfit(pick), 0);
  const stake = settled.reduce((sum, pick) => sum + Number(pick.wager), 0);
  document.querySelector("#picks-record").textContent = `${wins}–${losses}${pushes ? `–${pushes}` : ""}`;
  document.querySelector("#picks-profit").textContent = `${profit >= 0 ? "+" : ""}${profit.toFixed(2)} units`;
  document.querySelector("#picks-roi").textContent = stake ? `${(profit / stake * 100).toFixed(1)}%` : "0.0%";

  const pages = Math.max(1, Math.ceil(picks.length / previousPicksPageSize));
  previousPicksPage = Math.min(previousPicksPage, pages);
  const start = (previousPicksPage - 1) * previousPicksPageSize;
  const visible = picks.slice(start, start + previousPicksPageSize);
  const body = document.querySelector("#previous-picks");
  body.innerHTML = visible.length ? visible.map(pick => {
    const profitValue = pickProfit(pick);
    const result = pick.result || "pending";
    return `<tr>
      <td><strong>${picksEscape(picksDate(pick.start))}</strong><small>${picksEscape(picksTime(pick.start))}</small></td>
      <td><strong>${picksEscape(pick.matchup)}</strong></td>
      <td><strong>${picksEscape(pick.selection)}</strong><small>${picksEscape(marketLabel(pick))}</small></td>
      <td>${Number(pick.odds).toFixed(2)}</td>
      <td>${picksEscape(result[0].toUpperCase() + result.slice(1))}</td>
      <td>${profitValue == null ? "—" : `${profitValue >= 0 ? "+" : ""}${profitValue.toFixed(2)} U`}</td>
    </tr>`;
  }).join("") : '<tr class="picks-table-empty"><td colspan="6">Settled picks will appear here.</td></tr>';

  const pagination = document.querySelector("#previous-picks-pagination");
  pagination.hidden = picks.length <= previousPicksPageSize;
  document.querySelector("#previous-picks-page").textContent = `Page ${previousPicksPage} of ${pages}`;
  document.querySelector("#previous-picks-prev").disabled = previousPicksPage === 1;
  document.querySelector("#previous-picks-next").disabled = previousPicksPage === pages;
}

document.querySelector("#previous-picks-prev").addEventListener("click", () => {
  if (previousPicksPage === 1) return;
  previousPicksPage -= 1;
  renderPreviousPicks(previousPicksData);
});

document.querySelector("#previous-picks-next").addEventListener("click", () => {
  if (previousPicksPage * previousPicksPageSize >= previousPicksData.length) return;
  previousPicksPage += 1;
  renderPreviousPicks(previousPicksData);
});

fetch("data/edgework-picks.json", { cache: "no-store" })
  .then(response => {
    if (!response.ok) throw new Error(`Picks request failed: ${response.status}`);
    return response.json();
  })
  .then(data => {
    const picks = Array.isArray(data.picks) ? data.picks : [];
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit",
    }).format(new Date());
    renderDailyPicks(picks.filter(pick => pick.date === today && pick.result === "pending"));
    renderPreviousPicks(picks.filter(pick => pick.date !== today || pick.result !== "pending"));
  })
  .catch(error => {
    console.warn("Could not load Edgework picks", error);
    document.querySelector("#daily-picks").innerHTML = '<p class="picks-empty">No picks have been published for today.</p>';
  });
