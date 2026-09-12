/* ============================================================
   SMD DIODE DATABASE
   ------------------------------------------------------------
   Edit these mappings to match your manufacturer's datasheet.
   ============================================================ */

// Digit 1-2: Speed / Technology type
const speedMap = {
  "SS": { type: "Schottky Diode",        desc: "Low forward voltage drop, fast switching" },
  "RS": { type: "Fast Recovery Diode",   desc: "Standard fast recovery rectifier" },
  "US": { type: "Ultra Fast Diode",      desc: "Ultra-fast recovery rectifier" },
  "ES": { type: "Super Fast Diode",      desc: "Super-fast recovery, low reverse leakage" }
};

// Digit 3: Forward current (A)
const currentMap = {
  "1": { current: "1.0 A" },
  "2": { current: "2.0 A" },
  "3": { current: "3.0 A" },
  "4": { current: "4.0 A" }
};

// Last position: Reverse voltage code (A–M, T4)
// "I" and "L" are reserved / not used — included for completeness but disabled.
const voltageMap = {
  "A":  { voltage: "50 V",           used: true  },
  "B":  { voltage: "100 V",          used: true  },
  "C":  { voltage: "150 V",          used: true  },
  "D":  { voltage: "200 V",          used: true  },
  "E":  { voltage: "300 V",          used: true  },
  "F":  { voltage: "300 – 500 V",    used: true  },
  "G":  { voltage: "400 V",          used: true  },
  "H":  { voltage: "500 V",          used: true  },
  "I":  { voltage: "Not used",       used: false },
  "J":  { voltage: "600 V",          used: true  },
  "K":  { voltage: "800 V",          used: true  },
  "L":  { voltage: "Not used",       used: false },
  "M":  { voltage: "1000 V",         used: true  },
  "T4": { voltage: "30 V",           used: true  }
};

// Auto-build the full diode database
const diodeDatabase = {};
for (const sc of Object.keys(speedMap)) {
  for (const cc of Object.keys(currentMap)) {
    for (const vc of Object.keys(voltageMap)) {
      if (!voltageMap[vc].used) continue; // skip unused codes
      const code = sc + cc + vc;
      diodeDatabase[code] = {
        speedCode: sc,
        type: speedMap[sc].type,
        desc: speedMap[sc].desc,
        currentCode: cc,
        current: currentMap[cc].current,
        voltageCode: vc,
        voltage: voltageMap[vc].voltage
      };
    }
  }
}

/* ============================================================
   STATE
   ============================================================ */
const state = { speed: null, current: null, voltage: null };

/* ============================================================
   DOM
   ============================================================ */
const $ = (id) => document.getElementById(id);
const cell1 = $("cell1"), cell2 = $("cell2"), cell3 = $("cell3"), cell4 = $("cell4");
const panel1 = $("panel1"), panel2 = $("panel2"), panel3 = $("panel3");
const speedGrid = $("speedGrid"), currentGrid = $("currentGrid"), voltageGrid = $("voltageGrid");
const speedSummary = $("speedSummary"), currentSummary = $("currentSummary"), voltageSummary = $("voltageSummary");
const resultCard = $("resultCard");
const searchInput = $("searchInput");
const searchResult = $("searchResult");
const toast = $("toast"), toastMsg = $("toastMsg");

/* ============================================================
   RENDER GRIDS
   ============================================================ */
function renderSpeedGrid() {
  speedGrid.innerHTML = "";
  for (const [code, info] of Object.entries(speedMap)) {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.dataset.value = code;
    btn.innerHTML = `
      <div class="opt-code">${code}</div>
      <div class="opt-label">${info.type}</div>
    `;
    btn.addEventListener("click", () => selectSpeed(code));
    speedGrid.appendChild(btn);
  }
}

function renderCurrentGrid() {
  currentGrid.innerHTML = "";
  for (const [code, info] of Object.entries(currentMap)) {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.dataset.value = code;
    btn.innerHTML = `
      <div class="opt-code">${code}</div>
      <div class="opt-label">Current Code</div>
      <div class="opt-value">${info.current}</div>
    `;
    btn.addEventListener("click", () => selectCurrent(code));
    currentGrid.appendChild(btn);
  }
}

function renderVoltageGrid() {
  voltageGrid.innerHTML = "";
  // Display order: A-M then T4
  const order = ["A","B","C","D","E","F","G","H","I","J","K","L","M","T4"];
  for (const code of order) {
    const info = voltageMap[code];
    const btn = document.createElement("button");
    btn.className = "option" + (info.used ? "" : " unused");
    btn.dataset.value = code;
    btn.innerHTML = `
      <div class="opt-code">${code}</div>
      <div class="opt-label">Voltage Code</div>
      <div class="opt-value">${info.used ? info.voltage : "⊘ Not used"}</div>
    `;
    if (info.used) {
      btn.addEventListener("click", () => selectVoltage(code));
    } else {
      btn.addEventListener("click", () => {
        showToast(`${code} is not used`);
      });
      btn.title = "This code is reserved / not used";
    }
    voltageGrid.appendChild(btn);
  }
}

/* ============================================================
   SELECTION HANDLERS
   ============================================================ */
function selectSpeed(code) {
  state.speed = code;
  [...speedGrid.children].forEach(c => c.classList.toggle("selected", c.dataset.value === code));
  const info = speedMap[code];
  speedSummary.innerHTML = `<strong>Selected Speed:</strong> ${code} &nbsp;·&nbsp; <strong>Type:</strong> ${info.type}`;
  speedSummary.classList.add("show");
  panel1.classList.add("completed");
  panel2.classList.add("active");
  updateCodeDisplay();
  updateResult();
}

function selectCurrent(code) {
  state.current = code;
  [...currentGrid.children].forEach(c => c.classList.toggle("selected", c.dataset.value === code));
  const info = currentMap[code];
  currentSummary.innerHTML = `<strong>Current:</strong> ${info.current} &nbsp;·&nbsp; <strong>Code:</strong> ${code}`;
  currentSummary.classList.add("show");
  panel2.classList.add("completed");
  panel3.classList.add("active");
  updateCodeDisplay();
  updateResult();
}

function selectVoltage(code) {
  state.voltage = code;
  [...voltageGrid.children].forEach(c => c.classList.toggle("selected", c.dataset.value === code));
  const info = voltageMap[code];
  voltageSummary.innerHTML = `<strong>Voltage Code:</strong> ${code} &nbsp;·&nbsp; <strong>Reverse Voltage:</strong> ${info.voltage}`;
  voltageSummary.classList.add("show");
  panel3.classList.add("completed");
  updateCodeDisplay();
  updateResult();
}

/* ============================================================
   LIVE CODE DISPLAY
   ============================================================ */
function setCell(cell, value, filled) {
  const val = cell.querySelector(".cell-val");
  val.textContent = value || "—";
  cell.classList.toggle("filled", !!filled);
  // Shrink font if the value is 2 characters (e.g. T4)
  cell.classList.toggle("compact", !!value && value.length >= 2);
}

function updateCodeDisplay() {
  setCell(cell1, state.speed, !!state.speed);
  setCell(cell2, state.current, !!state.current);
  setCell(cell3, state.voltage, !!state.voltage);

  const code = buildCode();
  if (code) {
    // Final cell shows a checkmark when complete
    setCell(cell4, "✓", true);
    // Hide the 4th cell's label when we have a complete code
    cell4.querySelector(".cell-label").textContent = "";
  } else {
    setCell(cell4, "—", false);
    cell4.querySelector(".cell-label").textContent = "—";
  }
}

function buildCode() {
  if (!state.speed || !state.current || !state.voltage) return "";
  return state.speed + state.current + state.voltage;
}

/* ============================================================
   RESULT CARD
   ============================================================ */
function updateResult() {
  const code = buildCode();
  if (!code) { resultCard.classList.remove("show"); return; }
  const info = diodeDatabase[code];
  if (!info) { resultCard.classList.remove("show"); return; }
  $("resultCode").textContent = code;
  $("resultType").textContent = info.type;
  $("resSpeed").textContent = info.speedCode + " · " + info.type.split(" ")[0];
  $("resCurrent").textContent = info.current;
  $("resVoltage").textContent = info.voltage;
  $("resCode").textContent = code;
  resultCard.classList.add("show");
  addRecent(code);
}

/* ============================================================
   SEARCH
   ============================================================ */
function lookupCode(code) {
  code = (code || "").trim().toUpperCase();
  // Accept 4 or 5 character codes (letters + digits)
  if (!/^[A-Z0-9]{4,5}$/.test(code)) {
    searchResult.innerHTML = `<span style="color: var(--danger)">⚠️ Enter a valid 4–5 character code.</span>`;
    searchResult.classList.add("show");
    return;
  }
  const info = diodeDatabase[code];
  if (!info) {
    searchResult.innerHTML = `<span style="color: var(--danger)">❌ SMD code <strong>${code}</strong> not found in database.</span>`;
    searchResult.classList.add("show");
    return;
  }
  searchResult.innerHTML = `
    ✅ <strong>${code}</strong> → ${info.type} · Current: <strong>${info.current}</strong> · Voltage: <strong>${info.voltage}</strong>
  `;
  searchResult.classList.add("show");

  state.speed = info.speedCode;
  state.current = info.currentCode;
  state.voltage = info.voltageCode;

  [...speedGrid.children].forEach(c => c.classList.toggle("selected", c.dataset.value === info.speedCode));
  [...currentGrid.children].forEach(c => c.classList.toggle("selected", c.dataset.value === info.currentCode));
  [...voltageGrid.children].forEach(c => c.classList.toggle("selected", c.dataset.value === info.voltageCode));

  speedSummary.innerHTML = `<strong>Selected Speed:</strong> ${info.speedCode} &nbsp;·&nbsp; <strong>Type:</strong> ${info.type}`;
  speedSummary.classList.add("show");
  currentSummary.innerHTML = `<strong>Current:</strong> ${info.current} &nbsp;·&nbsp; <strong>Code:</strong> ${info.currentCode}`;
  currentSummary.classList.add("show");
  voltageSummary.innerHTML = `<strong>Voltage Code:</strong> ${info.voltageCode} &nbsp;·&nbsp; <strong>Reverse Voltage:</strong> ${info.voltage}`;
  voltageSummary.classList.add("show");

  panel1.classList.add("completed");
  panel2.classList.add("active", "completed");
  panel3.classList.add("active", "completed");

  updateCodeDisplay();
  updateResult();
  addRecent(code);
}

$("searchBtn").addEventListener("click", () => lookupCode(searchInput.value));
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") lookupCode(searchInput.value);
});
searchInput.addEventListener("input", () => {
  searchInput.value = searchInput.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
});

/* ============================================================
   COPY / FAVORITE / RESET
   ============================================================ */
$("copyBtn").addEventListener("click", async () => {
  const code = buildCode();
  if (!code) { showToast("Select all values first"); return; }
  try {
    await navigator.clipboard.writeText(code);
    showToast(`${code} copied!`);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = code; document.body.appendChild(ta);
    ta.select(); document.execCommand("copy"); ta.remove();
    showToast(`${code} copied!`);
  }
});

$("favBtn").addEventListener("click", () => {
  const code = buildCode();
  if (!code) { showToast("Select all values first"); return; }
  toggleFavorite(code);
});

$("resetBtn").addEventListener("click", () => {
  state.speed = state.current = state.voltage = null;
  [...speedGrid.children, ...currentGrid.children, ...voltageGrid.children].forEach(c => c.classList.remove("selected"));
  [speedSummary, currentSummary, voltageSummary, searchResult].forEach(s => s.classList.remove("show"));
  [panel1, panel2, panel3].forEach(p => p.classList.remove("completed"));
  panel2.classList.remove("active");
  panel3.classList.remove("active");
  resultCard.classList.remove("show");
  searchInput.value = "";
  updateCodeDisplay();
  showToast("Reset complete");
});

/* ============================================================
   TOAST
   ============================================================ */
let toastTimer;
function showToast(msg) {
  toastMsg.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

/* ============================================================
   FAVORITES & RECENT
   ============================================================ */
const LS_FAV = "smd_favorites";
const LS_REC = "smd_recent";

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
}
function saveJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

function toggleFavorite(code) {
  const favs = loadJSON(LS_FAV, []);
  const idx = favs.indexOf(code);
  if (idx >= 0) {
    favs.splice(idx, 1);
    showToast(`${code} removed from favorites`);
  } else {
    favs.unshift(code);
    showToast(`${code} added to favorites`);
  }
  saveJSON(LS_FAV, favs.slice(0, 20));
  renderFavorites();
}

function addRecent(code) {
  const rec = loadJSON(LS_REC, []);
  const filtered = rec.filter(c => c !== code);
  filtered.unshift(code);
  saveJSON(LS_REC, filtered.slice(0, 8));
  renderRecent();
}

function renderFavorites() {
  const favs = loadJSON(LS_FAV, []);
  const wrap = $("favChips");
  if (!favs.length) {
    wrap.innerHTML = `<span class="empty">No favorites yet. Tap "Favorite" to save a code.</span>`;
    return;
  }
  wrap.innerHTML = "";
  favs.forEach(code => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.innerHTML = `<span class="fav">★</span> ${code} <span class="remove" title="Remove">×</span>`;
    chip.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove")) {
        e.stopPropagation();
        toggleFavorite(code);
      } else {
        lookupCode(code);
      }
    });
    wrap.appendChild(chip);
  });
}

function renderRecent() {
  const rec = loadJSON(LS_REC, []);
  const wrap = $("recentChips");
  if (!rec.length) {
    wrap.innerHTML = `<span class="empty">No recent searches.</span>`;
    return;
  }
  wrap.innerHTML = "";
  rec.forEach(code => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = code;
    chip.addEventListener("click", () => lookupCode(code));
    wrap.appendChild(chip);
  });
}

/* ============================================================
   THEME
   ============================================================ */
const themeToggle = $("themeToggle");
const themeIcon = $("themeIcon");
const sunIcon = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;
const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeIcon.innerHTML = theme === "light" ? sunIcon : moonIcon;
  document.querySelector('meta[name="theme-color"]').setAttribute("content", theme === "light" ? "#f4f6fb" : "#0a0e1a");
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("smd_theme", next); } catch {}
});

try {
  const savedTheme = localStorage.getItem("smd_theme");
  if (savedTheme) applyTheme(savedTheme);
  else applyTheme("dark");
} catch { applyTheme("dark"); }

/* ============================================================
   INIT
   ============================================================ */
renderSpeedGrid();
renderCurrentGrid();
renderVoltageGrid();
renderFavorites();
renderRecent();
updateCodeDisplay();