/* ============================================================
   DATABASE — SPEED / FAMILY MAP
   ============================================================ */
const speedMap = {
  "SS": { type: "Schottky Diode",          desc: "Low forward voltage drop, fast switching", isFR: false },
  "RS": { type: "Fast Recovery Diode",     desc: "Standard fast recovery rectifier",         isFR: false },
  "US": { type: "Ultra Fast Diode",        desc: "Ultra-fast recovery rectifier",            isFR: false },
  "ES": { type: "Super Fast Diode",        desc: "Super-fast recovery, low reverse leakage", isFR: false },
  "FR": { type: "Fast Recovery Rectifier", desc: "FR series fast recovery, 50V–1000V",       isFR: true  }
};

/* ============================================================
   STANDARD MAPS (SS / RS / US / ES)
   ============================================================ */
const currentMap = {
  "1": { current: "1.0 A" },
  "2": { current: "2.0 A" },
  "3": { current: "3.0 A" },
  "4": { current: "4.0 A" }
};

const voltageMap = {
  "A":  { voltage: "50 V",        used: true  },
  "B":  { voltage: "100 V",       used: true  },
  "C":  { voltage: "150 V",       used: true  },
  "D":  { voltage: "200 V",       used: true  },
  "E":  { voltage: "300 V",       used: true  },
  "F":  { voltage: "300 – 500 V", used: true  },
  "G":  { voltage: "400 V",       used: true  },
  "H":  { voltage: "500 V",       used: true  },
  "I":  { voltage: "Not used",    used: false },
  "J":  { voltage: "600 V",       used: true  },
  "K":  { voltage: "800 V",       used: true  },
  "L":  { voltage: "Not used",    used: false },
  "M":  { voltage: "1000 V",      used: true  },
  "T4": { voltage: "30 V",        used: true  }
};

/* ============================================================
   FR-SPECIFIC MAPS
   Current: 10/1=1A, 15=1.5A, 20/2=2A, 30/3=3A, 60/6=6A
   Voltage: 1=50V, 2=100V, 3=200V, 4=400V, 5=600V, 6=800V, 7=1000V
   ============================================================ */
const frCurrentMap = {
  "10": { current: "1.0 A" },
  "15": { current: "1.5 A" },
  "20": { current: "2.0 A" },
  "30": { current: "3.0 A" },
  "60": { current: "6.0 A" }
};

const frVoltageMap = {
  "1": { voltage: "50 V"   },
  "2": { voltage: "100 V"  },
  "3": { voltage: "200 V"  },
  "4": { voltage: "400 V"  },
  "5": { voltage: "600 V"  },
  "6": { voltage: "800 V"  },
  "7": { voltage: "1000 V" }
};

/* ============================================================
   BUILD UNIFIED DATABASE
   Standard codes: SS2A, RS1M, US4T4, etc.
   FR codes: FR101, FR157, FR201, FR307, FR605, etc. (5 chars)
   ============================================================ */
const diodeDatabase = {};

// Standard families
for (const sc of Object.keys(speedMap)) {
  if (speedMap[sc].isFR) continue;
  for (const cc of Object.keys(currentMap)) {
    for (const vc of Object.keys(voltageMap)) {
      if (!voltageMap[vc].used) continue;
      const code = sc + cc + vc;
      diodeDatabase[code] = {
        family: speedMap[sc].type.split(" ")[0] + " Family",
        speedCode: sc, type: speedMap[sc].type, desc: speedMap[sc].desc,
        currentCode: cc, current: currentMap[cc].current,
        voltageCode: vc, voltage: voltageMap[vc].voltage, voltageRms: null,
        isFR: false
      };
    }
  }
}

// FR family — generates FR101, FR102, ... FR607 (all 5 chars)
for (const cc of Object.keys(frCurrentMap)) {
  for (const vc of Object.keys(frVoltageMap)) {
    const code = "FR" + cc + vc;
    diodeDatabase[code] = {
      family: "FR Series (Fast Recovery)",
      speedCode: "FR", type: "FR Series — Fast Recovery Rectifier",
      desc: "Fast recovery, high efficiency rectifier",
      currentCode: cc, current: frCurrentMap[cc].current,
      voltageCode: vc, voltage: frVoltageMap[vc].voltage, voltageRms: null,
      isFR: true
    };
  }
}

/* ============================================================
   M-SERIES & 400x DATABASES
   ============================================================ */
const mSeriesDatabase = {
  "M1": { family: "M-Series (SMA)", type: "M1 — Surface Mount Rectifier", current: "1.0 A", voltage: "50 V", voltageRms: "35 Vrms", equivalent: "1N4001" },
  "M2": { family: "M-Series (SMA)", type: "M2 — Surface Mount Rectifier", current: "1.0 A", voltage: "100 V", voltageRms: "70 Vrms", equivalent: "1N4002" },
  "M3": { family: "M-Series (SMA)", type: "M3 — Surface Mount Rectifier", current: "1.0 A", voltage: "200 V", voltageRms: "140 Vrms", equivalent: "1N4003" },
  "M4": { family: "M-Series (SMA)", type: "M4 — Surface Mount Rectifier", current: "1.0 A", voltage: "400 V", voltageRms: "280 Vrms", equivalent: "1N4004" },
  "M5": { family: "M-Series (SMA)", type: "M5 — Surface Mount Rectifier", current: "1.0 A", voltage: "600 V", voltageRms: "420 Vrms", equivalent: "1N4005" },
  "M6": { family: "M-Series (SMA)", type: "M6 — Surface Mount Rectifier", current: "1.0 A", voltage: "800 V", voltageRms: "560 Vrms", equivalent: "1N4006" },
  "M7": { family: "M-Series (SMA)", type: "M7 — Surface Mount Rectifier", current: "1.0 A", voltage: "1000 V", voltageRms: "700 Vrms", equivalent: "1N4007" },
  "M":  { family: "M-Series (SMA)", type: "M — Surface Mount Rectifier", current: "1.0 A", voltage: "1000 V DC", voltageRms: null, equivalent: "1N4007" },
  "T4": { family: "Switching Diode", type: "T4 — Small Signal Switching Diode", current: "0.3 A", voltage: "30 V DC", voltageRms: null, equivalent: "1N4148" }
};

const series400Database = {
  "4001": { family: "400x Series (1N400x)", type: "4001 — General Purpose Rectifier", current: "1.0 A", voltage: "50 V", voltageRms: "35 Vrms", equivalent: "1N4001" },
  "4002": { family: "400x Series (1N400x)", type: "4002 — General Purpose Rectifier", current: "1.0 A", voltage: "100 V", voltageRms: "70 Vrms", equivalent: "1N4002" },
  "4003": { family: "400x Series (1N400x)", type: "4003 — General Purpose Rectifier", current: "1.0 A", voltage: "200 V", voltageRms: "140 Vrms", equivalent: "1N4003" },
  "4004": { family: "400x Series (1N400x)", type: "4004 — General Purpose Rectifier", current: "1.0 A", voltage: "400 V", voltageRms: "280 Vrms", equivalent: "1N4004" },
  "4005": { family: "400x Series (1N400x)", type: "4005 — General Purpose Rectifier", current: "1.0 A", voltage: "600 V", voltageRms: "420 Vrms", equivalent: "1N4005" },
  "4006": { family: "400x Series (1N400x)", type: "4006 — General Purpose Rectifier", current: "1.0 A", voltage: "800 V", voltageRms: "560 Vrms", equivalent: "1N4006" },
  "4007": { family: "400x Series (1N400x)", type: "4007 — General Purpose Rectifier", current: "1.0 A", voltage: "1000 V", voltageRms: "700 Vrms", equivalent: "1N4007" }
};

/* ============================================================
   SMART FR PARSER
   Accepts flexible FR formats and normalizes to 5-char code.
   
   Decoding rule:
     "FR" = speed (first 2 chars)
     Next 1-2 digits = current:  1/10→1A, 15→1.5A, 2/20→2A, 3/30→3A, 6/60→6A
     Last 1-2 digits = voltage:  1/01→50V, 2/02→100V, ... 7/07→1000V
   
   Examples:
     FR101  → FR + 1  + 01 → FR101  (1A, 50V)
     FR1001 → FR + 10 + 01 → FR101  (1A, 50V)
     FR151  → FR + 15 + 1  → FR151  (1.5A, 50V)
     FR207  → FR + 2  + 07 → FR207  (2A, 1000V)
     FR2007 → FR + 20 + 07 → FR207  (2A, 1000V)
     FR65   → FR + 6  + 5  → FR605  (6A, 600V)
     FR6005 → FR + 60 + 05 → FR605  (6A, 600V)
   ============================================================ */
function parseFRCode(input) {
  const code = input.toUpperCase();
  if (!code.startsWith("FR")) return null;

  const digits = code.substring(2);
  if (!/^\d{2,4}$/.test(digits)) return null;

  // Normalize current: "1"→"10", "10"→"10", "15"→"15", "2"→"20", etc.
  const curNorm = {
    "1": "10", "10": "10",
    "15": "15",
    "2": "20", "20": "20",
    "3": "30", "30": "30",
    "6": "60", "60": "60"
  };

  // Normalize voltage: "1"→"1", "01"→"1", "2"→"2", "02"→"2", etc.
  const vltNorm = {
    "1": "1", "01": "1",
    "2": "2", "02": "2",
    "3": "3", "03": "3",
    "4": "4", "04": "4",
    "5": "5", "05": "5",
    "6": "6", "06": "6",
    "7": "7", "07": "7"
  };

  // Try all valid splits: current(1-2 digits) + voltage(1-2 digits)
  for (let cLen = 1; cLen <= Math.min(2, digits.length - 1); cLen++) {
    const vLen = digits.length - cLen;
    if (vLen < 1 || vLen > 2) continue;

    const cPart = digits.substring(0, cLen);
    const vPart = digits.substring(cLen);

    const nc = curNorm[cPart];
    const nv = vltNorm[vPart];

    if (nc && nv) {
      const fullCode = "FR" + nc + nv;
      if (diodeDatabase[fullCode]) {
        return { code: fullCode, data: diodeDatabase[fullCode] };
      }
    }
  }

  return null;
}

/* ============================================================
   UNIFIED LOOKUP
   ============================================================ */
function findDiode(code) {
  code = (code || "").toUpperCase();

  // 1. Direct lookup in builder database (SS/RS/US/ES + FR canonical)
  if (diodeDatabase[code]) return { source: "builder", data: diodeDatabase[code], inputCode: null };

  // 2. Smart FR parser for flexible formats
  if (code.startsWith("FR")) {
    const parsed = parseFRCode(code);
    if (parsed) return { source: "builder", data: parsed.data, inputCode: code !== parsed.code ? code : null };
  }

  // 3. M-Series
  if (mSeriesDatabase[code]) return { source: "m-series", data: mSeriesDatabase[code], inputCode: null };

  // 4. 400x Series
  if (series400Database[code]) return { source: "400x", data: series400Database[code], inputCode: null };

  return null;
}

/* ============================================================
   STATE
   ============================================================ */
const state = { speed: null, current: null, voltage: null, mode: "standard" };

/* ============================================================
   DOM
   ============================================================ */
const $ = (id) => document.getElementById(id);
const cell1 = $("cell1"), cell2 = $("cell2"), cell3 = $("cell3"), cell4 = $("cell4");
const panel1 = $("panel1"), panel2 = $("panel2"), panel3 = $("panel3");
const speedGrid = $("speedGrid"), currentGrid = $("currentGrid"), voltageGrid = $("voltageGrid");
const speedSummary = $("speedSummary"), currentSummary = $("currentSummary"), voltageSummary = $("voltageSummary");
const currentSub = $("currentSub"), voltageSub = $("voltageSub");
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
    btn.innerHTML = `<div class="opt-code">${code}</div><div class="opt-label">${info.type}</div>`;
    btn.addEventListener("click", () => selectSpeed(code));
    speedGrid.appendChild(btn);
  }
}

function renderStandardCurrentGrid() {
  currentGrid.innerHTML = "";
  currentSub.textContent = "Choose the forward current rating code (third character).";
  for (const [code, info] of Object.entries(currentMap)) {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.dataset.value = code;
    btn.innerHTML = `<div class="opt-code">${code}</div><div class="opt-label">Current Code</div><div class="opt-value">${info.current}</div>`;
    btn.addEventListener("click", () => selectCurrent(code));
    currentGrid.appendChild(btn);
  }
}

function renderFRCurrentGrid() {
  currentGrid.innerHTML = "";
  currentSub.innerHTML = "FR current code. <strong>10=1A · 15=1.5A · 20=2A · 30=3A · 60=6A</strong>.";
  for (const [code, info] of Object.entries(frCurrentMap)) {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.dataset.value = code;
    btn.innerHTML = `<div class="opt-code">${code}</div><div class="opt-label">Current Code</div><div class="opt-value">${info.current}</div>`;
    btn.addEventListener("click", () => selectCurrent(code));
    currentGrid.appendChild(btn);
  }
}

function renderStandardVoltageGrid() {
  voltageGrid.innerHTML = "";
  voltageSub.textContent = "Choose the reverse voltage code (last character(s)). Codes I and L are reserved.";
  const order = ["A","B","C","D","E","F","G","H","I","J","K","L","M","T4"];
  for (const code of order) {
    const info = voltageMap[code];
    const btn = document.createElement("button");
    btn.className = "option" + (info.used ? "" : " unused");
    btn.dataset.value = code;
    btn.innerHTML = `<div class="opt-code">${code}</div><div class="opt-label">Voltage Code</div><div class="opt-value">${info.used ? info.voltage : "⊘ Not used"}</div>`;
    if (info.used) {
      btn.addEventListener("click", () => selectVoltage(code));
    } else {
      btn.addEventListener("click", () => showToast(`${code} is not used`));
      btn.title = "Reserved / not used";
    }
    voltageGrid.appendChild(btn);
  }
}

function renderFRVoltageGrid() {
  voltageGrid.innerHTML = "";
  voltageSub.innerHTML = "FR voltage code. <strong>All FR diodes: 50V to 1000V</strong>.";
  for (const [code, info] of Object.entries(frVoltageMap)) {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.dataset.value = code;
    btn.innerHTML = `<div class="opt-code">${code}</div><div class="opt-label">Voltage Code</div><div class="opt-value">${info.voltage}</div>`;
    btn.addEventListener("click", () => selectVoltage(code));
    voltageGrid.appendChild(btn);
  }
}

/* ============================================================
   SELECTION HANDLERS
   ============================================================ */
function selectSpeed(code) {
  state.speed = code;
  state.mode = speedMap[code].isFR ? "fr" : "standard";
  [...speedGrid.children].forEach(c => c.classList.toggle("selected", c.dataset.value === code));
  speedSummary.innerHTML = `<strong>Selected Speed:</strong> ${code} &nbsp;·&nbsp; <strong>Type:</strong> ${speedMap[code].type}`;
  speedSummary.classList.add("show");

  state.current = null; state.voltage = null;
  currentSummary.classList.remove("show");
  voltageSummary.classList.remove("show");
  panel2.classList.remove("completed");
  panel3.classList.remove("completed", "active");

  if (state.mode === "fr") { renderFRCurrentGrid(); renderFRVoltageGrid(); }
  else { renderStandardCurrentGrid(); renderStandardVoltageGrid(); }

  panel2.classList.add("active");
  updateCodeDisplay(); updateResult();
}

function selectCurrent(code) {
  state.current = code;
  [...currentGrid.children].forEach(c => c.classList.toggle("selected", c.dataset.value === code));
  const info = state.mode === "fr" ? frCurrentMap[code] : currentMap[code];
  currentSummary.innerHTML = `<strong>Current:</strong> ${info.current} &nbsp;·&nbsp; <strong>Code:</strong> ${code}`;
  currentSummary.classList.add("show");
  panel2.classList.add("completed");
  panel3.classList.add("active");
  updateCodeDisplay(); updateResult();
}

function selectVoltage(code) {
  state.voltage = code;
  [...voltageGrid.children].forEach(c => c.classList.toggle("selected", c.dataset.value === code));
  const info = state.mode === "fr" ? frVoltageMap[code] : voltageMap[code];
  voltageSummary.innerHTML = `<strong>Voltage Code:</strong> ${code} &nbsp;·&nbsp; <strong>Reverse Voltage:</strong> ${info.voltage}`;
  voltageSummary.classList.add("show");
  panel3.classList.add("completed");
  updateCodeDisplay(); updateResult();
  setTimeout(() => resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

/* ============================================================
   LIVE CODE DISPLAY
   ============================================================ */
function setCell(cell, value, filled) {
  cell.querySelector(".cell-val").textContent = value || "—";
  cell.classList.toggle("filled", !!filled);
  cell.classList.toggle("compact", !!value && value.length >= 2);
}

function updateCodeDisplay() {
  setCell(cell1, state.speed, !!state.speed);
  setCell(cell2, state.current, !!state.current);
  setCell(cell3, state.voltage, !!state.voltage);
  const code = buildCode();
  if (code) { setCell(cell4, "✓", true); cell4.querySelector(".cell-label").textContent = ""; }
  else { setCell(cell4, "—", false); cell4.querySelector(".cell-label").textContent = "—"; }
}

function buildCode() {
  if (!state.speed || !state.current || !state.voltage) return "";
  return state.speed + state.current + state.voltage;
}

/* ============================================================
   RESULT CARD
   ============================================================ */
function renderResult(code, source, data, inputCode) {
  $("resultCode").textContent = code;
  $("resultType").textContent = data.type;

  const familyEl = $("resultFamily");
  if (data.family) { familyEl.textContent = data.family; familyEl.style.display = "inline-block"; }
  else { familyEl.style.display = "none"; }

  // Show "also known as" if user typed a different format
  const alsoEl = $("resultAlso");
  if (inputCode && inputCode !== code) {
    alsoEl.innerHTML = `Also searched as: <code>${inputCode}</code> → normalized to <code>${code}</code>`;
    alsoEl.style.display = "block";
  } else {
    alsoEl.style.display = "none";
  }

  const grid = $("resultGrid");
  grid.innerHTML = "";

  if (source === "builder") {
    const speedLabel = data.isFR ? "⚡ Family" : "⚡ Speed / Type";
    const speedValue = data.isFR ? "FR · Fast Recovery" : `${data.speedCode} · ${data.type.split(" ")[0]}`;

    // For FR, show the decoding breakdown
    let decodeHtml = "";
    if (data.isFR) {
      decodeHtml = `
        <div class="badge speed">
          <div class="b-label">📖 Code Breakdown</div>
          <div class="b-value" style="font-size:0.85rem;">FR + ${data.currentCode} + ${data.voltageCode}</div>
          <div style="font-size:0.7rem;color:var(--text-2);margin-top:4px;">Speed + Amp + Volt</div>
        </div>
      `;
    }

    grid.innerHTML = `
      <div class="badge speed"><div class="b-label">${speedLabel}</div><div class="b-value">${speedValue}</div></div>
      <div class="badge current"><div class="b-label">🔌 Current</div><div class="b-value">${data.current}</div></div>
      <div class="badge voltage"><div class="b-label">⚡ Reverse Voltage</div><div class="b-value">${data.voltage}</div></div>
      ${decodeHtml}
      <div class="badge code"><div class="b-label">📋 Part Code</div><div class="b-value">${code}</div></div>
    `;
  } else {
    let rmsHtml = data.voltageRms ? `<div class="badge rms"><div class="b-label">∿ RMS Voltage</div><div class="b-value">${data.voltageRms}</div></div>` : "";
    let equivHtml = data.equivalent ? `<div class="badge speed"><div class="b-label">🔁 Equivalent</div><div class="b-value">${data.equivalent}</div></div>` : "";
    grid.innerHTML = `
      <div class="badge current"><div class="b-label">🔌 Forward Current</div><div class="b-value">${data.current}</div></div>
      <div class="badge voltage"><div class="b-label">⚡ Reverse Voltage (DC)</div><div class="b-value">${data.voltage}</div></div>
      ${rmsHtml}${equivHtml}
      <div class="badge code"><div class="b-label">📋 Part Code</div><div class="b-value">${code}</div></div>
    `;
  }

  resultCard.classList.add("show");
  addRecent(inputCode || code);
}

function updateResult() {
  const code = buildCode();
  if (!code) { resultCard.classList.remove("show"); return; }
  const found = findDiode(code);
  if (!found) { resultCard.classList.remove("show"); return; }
  renderResult(code, found.source, found.data, found.inputCode);
}

/* ============================================================
   SEARCH
   ============================================================ */
function lookupCode(raw) {
  raw = (raw || "").trim().toUpperCase();
  if (!raw || raw.length < 2) {
    searchResult.innerHTML = `<span style="color: var(--danger)">⚠️ Enter a valid diode code.</span>`;
    searchResult.classList.add("show");
    return;
  }

  const found = findDiode(raw);
  if (!found) {
    searchResult.innerHTML = `<span style="color: var(--danger)">❌ Code <strong>${raw}</strong> not found in database.</span>`;
    searchResult.classList.add("show");
    resultCard.classList.remove("show");
    return;
  }

  const d = found.data;
  const canonical = found.inputCode ? found.inputCode : raw;
  let summary = `✅ <strong>${raw}</strong>`;
  if (found.inputCode && found.inputCode !== raw) summary = `✅ <strong>${raw}</strong> → <strong>${canonical}</strong>`;
  // Use the actual canonical code from the database
  const displayCode = found.inputCode ? Object.keys(diodeDatabase).find(k => diodeDatabase[k] === d) || canonical : raw;
  summary = `✅ <strong>${raw}</strong>`;
  if (found.inputCode) summary += ` → normalized to <strong>${displayCode}</strong>`;
  summary += ` → ${d.type}`;
  summary += ` · Current: <strong>${d.current}</strong>`;
  summary += ` · Voltage: <strong>${d.voltage}</strong>`;
  if (d.voltageRms) summary += ` · RMS: <strong>${d.voltageRms}</strong>`;
  if (d.equivalent) summary += ` · Equivalent: <strong>${d.equivalent}</strong>`;

  searchResult.innerHTML = summary;
  searchResult.classList.add("show");

  if (found.source === "builder") {
    state.speed = d.speedCode;
    state.current = d.currentCode;
    state.voltage = d.voltageCode;
    state.mode = d.isFR ? "fr" : "standard";

    if (state.mode === "fr") { renderFRCurrentGrid(); renderFRVoltageGrid(); }
    else { renderStandardCurrentGrid(); renderStandardVoltageGrid(); }

    [...speedGrid.children].forEach(c => c.classList.toggle("selected", c.dataset.value === d.speedCode));
    [...currentGrid.children].forEach(c => c.classList.toggle("selected", c.dataset.value === d.currentCode));
    [...voltageGrid.children].forEach(c => c.classList.toggle("selected", c.dataset.value === d.voltageCode));

    speedSummary.innerHTML = `<strong>Selected Speed:</strong> ${d.speedCode} &nbsp;·&nbsp; <strong>Type:</strong> ${d.type}`;
    speedSummary.classList.add("show");
    const curInfo = state.mode === "fr" ? frCurrentMap[d.currentCode] : currentMap[d.currentCode];
    currentSummary.innerHTML = `<strong>Current:</strong> ${curInfo.current} &nbsp;·&nbsp; <strong>Code:</strong> ${d.currentCode}`;
    currentSummary.classList.add("show");
    const vltInfo = state.mode === "fr" ? frVoltageMap[d.voltageCode] : voltageMap[d.voltageCode];
    voltageSummary.innerHTML = `<strong>Voltage Code:</strong> ${d.voltageCode} &nbsp;·&nbsp; <strong>Reverse Voltage:</strong> ${vltInfo.voltage}`;
    voltageSummary.classList.add("show");
    panel1.classList.add("completed");
    panel2.classList.add("active", "completed");
    panel3.classList.add("active", "completed");
    updateCodeDisplay();
  } else {
    state.speed = state.current = state.voltage = null;
    state.mode = "standard";
    renderStandardCurrentGrid(); renderStandardVoltageGrid();
    [...speedGrid.children].forEach(c => c.classList.remove("selected"));
    [speedSummary, currentSummary, voltageSummary].forEach(s => s.classList.remove("show"));
    [panel1, panel2, panel3].forEach(p => p.classList.remove("completed"));
    panel2.classList.remove("active"); panel3.classList.remove("active");
    updateCodeDisplay();
  }

  renderResult(displayCode, found.source, d, found.inputCode);
  setTimeout(() => resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

$("searchBtn").addEventListener("click", () => lookupCode(searchInput.value));
searchInput.addEventListener("keydown", (e) => { if (e.key === "Enter") lookupCode(searchInput.value); });
searchInput.addEventListener("input", () => {
  searchInput.value = searchInput.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
});

document.querySelectorAll(".hint-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    searchInput.value = chip.dataset.code;
    lookupCode(chip.dataset.code);
  });
});

/* ============================================================
   COPY / FAVORITE / RESET
   ============================================================ */
$("copyBtn").addEventListener("click", async () => {
  const code = buildCode();
  if (!code) { showToast("Select all values first"); return; }
  try { await navigator.clipboard.writeText(code); showToast(`${code} copied!`); }
  catch {
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
  state.mode = "standard";
  renderStandardCurrentGrid(); renderStandardVoltageGrid();
  [...speedGrid.children].forEach(c => c.classList.remove("selected"));
  [speedSummary, currentSummary, voltageSummary, searchResult].forEach(s => s.classList.remove("show"));
  [panel1, panel2, panel3].forEach(p => p.classList.remove("completed"));
  panel2.classList.remove("active"); panel3.classList.remove("active");
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
const LS_FAV = "smd_favorites", LS_REC = "smd_recent";
function loadJSON(k, fb) { try { return JSON.parse(localStorage.getItem(k)) || fb; } catch { return fb; } }
function saveJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

function toggleFavorite(code) {
  const f = loadJSON(LS_FAV, []);
  const i = f.indexOf(code);
  if (i >= 0) { f.splice(i, 1); showToast(`${code} removed`); }
  else { f.unshift(code); showToast(`${code} added to favorites`); }
  saveJSON(LS_FAV, f.slice(0, 20)); renderFavorites();
}

function addRecent(code) {
  const r = loadJSON(LS_REC, []).filter(c => c !== code);
  r.unshift(code); saveJSON(LS_REC, r.slice(0, 10)); renderRecent();
}

function renderFavorites() {
  const f = loadJSON(LS_FAV, []), w = $("favChips");
  if (!f.length) { w.innerHTML = `<span class="empty">No favorites yet. Tap "Favorite" to save a code.</span>`; return; }
  w.innerHTML = "";
  f.forEach(code => {
    const c = document.createElement("button"); c.className = "chip";
    c.innerHTML = `<span class="fav">★</span> ${code} <span class="remove" title="Remove">×</span>`;
    c.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove")) { e.stopPropagation(); toggleFavorite(code); }
      else lookupCode(code);
    });
    w.appendChild(c);
  });
}

function renderRecent() {
  const r = loadJSON(LS_REC, []), w = $("recentChips");
  if (!r.length) { w.innerHTML = `<span class="empty">No recent searches.</span>`; return; }
  w.innerHTML = "";
  r.forEach(code => {
    const c = document.createElement("button"); c.className = "chip"; c.textContent = code;
    c.addEventListener("click", () => lookupCode(code));
    w.appendChild(c);
  });
}

/* ============================================================
   THEME
   ============================================================ */
const sunIcon = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;
const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  $("themeIcon").innerHTML = t === "light" ? sunIcon : moonIcon;
  document.querySelector('meta[name="theme-color"]').setAttribute("content", t === "light" ? "#f4f6fb" : "#0a0e1a");
}
$("themeToggle").addEventListener("click", () => {
  const n = (document.documentElement.getAttribute("data-theme") || "dark") === "dark" ? "light" : "dark";
  applyTheme(n); try { localStorage.setItem("smd_theme", n); } catch {}
});
try { const s = localStorage.getItem("smd_theme"); applyTheme(s || "dark"); } catch { applyTheme("dark"); }

/* ============================================================
   INIT
   ============================================================ */
renderSpeedGrid(); renderStandardCurrentGrid(); renderStandardVoltageGrid();
renderFavorites(); renderRecent(); updateCodeDisplay();