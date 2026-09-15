/* ============================================================
   DATABASES
   ============================================================ */
const speedMap = {
  "SS": { type: "Schottky Diode",          desc: "Low forward voltage drop, fast switching", isFR: false },
  "RS": { type: "Fast Recovery Diode",     desc: "Standard fast recovery rectifier",         isFR: false },
  "US": { type: "Ultra Fast Diode",        desc: "Ultra-fast recovery rectifier",            isFR: false },
  "ES": { type: "Super Fast Diode",        desc: "Super-fast recovery, low reverse leakage", isFR: false },
  "FR": { type: "Fast Recovery Rectifier", desc: "FR series fast recovery, 50V–1000V",       isFR: true  }
};

const currentMap = {
  "1": { current: "1.0 A" }, "2": { current: "2.0 A" },
  "3": { current: "3.0 A" }, "4": { current: "4.0 A" }
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

const frCurrentMap = {
  "10": { current: "1.0 A", alt: "1" },
  "15": { current: "1.5 A", alt: null },
  "20": { current: "2.0 A", alt: "2" },
  "30": { current: "3.0 A", alt: "3" },
  "60": { current: "6.0 A", alt: "6" }
};

const frVoltageMap = {
  "1": { voltage: "50 V"   }, "2": { voltage: "100 V"  },
  "3": { voltage: "200 V"  }, "4": { voltage: "400 V"  },
  "5": { voltage: "600 V"  }, "6": { voltage: "800 V"  },
  "7": { voltage: "1000 V" }
};

/* ---------- Builder DB ---------- */
const diodeDatabase = {};
for (const sc of Object.keys(speedMap)) {
  if (speedMap[sc].isFR) continue;
  for (const cc of Object.keys(currentMap)) {
    for (const vc of Object.keys(voltageMap)) {
      if (!voltageMap[vc].used) continue;
      diodeDatabase[sc + cc + vc] = {
        family: speedMap[sc].type.split(" ")[0] + " Family",
        speedCode: sc, type: speedMap[sc].type, desc: speedMap[sc].desc,
        currentCode: cc, current: currentMap[cc].current,
        voltageCode: vc, voltage: voltageMap[vc].voltage, voltageRms: null, isFR: false
      };
    }
  }
}
for (const cc of Object.keys(frCurrentMap)) {
  for (const vc of Object.keys(frVoltageMap)) {
    diodeDatabase["FR" + cc + vc] = {
      family: "FR Series (Fast Recovery)",
      speedCode: "FR", type: "FR Series — Fast Recovery Rectifier",
      desc: "Fast recovery, high efficiency rectifier",
      currentCode: cc, current: frCurrentMap[cc].current,
      voltageCode: vc, voltage: frVoltageMap[vc].voltage, voltageRms: null, isFR: true
    };
  }
}
const frCurrentAliases = { "1": "10", "2": "20", "3": "30", "6": "60" };
for (const [alias, main] of Object.entries(frCurrentAliases)) {
  for (const vc of Object.keys(frVoltageMap)) {
    const code = "FR" + alias + vc;
    if (!diodeDatabase[code]) {
      diodeDatabase[code] = {
        family: "FR Series (Fast Recovery)",
        speedCode: "FR", type: "FR Series — Fast Recovery Rectifier",
        desc: "Fast recovery, high efficiency rectifier",
        currentCode: alias, current: frCurrentMap[main].current,
        voltageCode: vc, voltage: frVoltageMap[vc].voltage, voltageRms: null, isFR: true
      };
    }
  }
}

/* ---------- M-Series ---------- */
const mSeriesDatabase = {
  "M1": { family: "M-Series (SMA)", type: "M1 — Surface Mount Rectifier", current: "1.0 A", voltage: "50 V", voltageRms: "35 Vrms", equivalent: "1N4001" },
  "M2": { family: "M-Series (SMA)", type: "M2 — Surface Mount Rectifier", current: "1.0 A", voltage: "100 V", voltageRms: "70 Vrms", equivalent: "1N4002" },
  "M3": { family: "M-Series (SMA)", type: "M3 — Surface Mount Rectifier", current: "1.0 A", voltage: "200 V", voltageRms: "140 Vrms", equivalent: "1N4003" },
  "M4": { family: "M-Series (SMA)", type: "M4 — Surface Mount Rectifier", current: "1.0 A", voltage: "400 V", voltageRms: "280 Vrms", equivalent: "1N4004" },
  "M5": { family: "M-Series (SMA)", type: "M5 — Surface Mount Rectifier", current: "1.0 A", voltage: "600 V", voltageRms: "420 Vrms", equivalent: "1N4005" },
  "M6": { family: "M-Series (SMA)", type: "M6 — Surface Mount Rectifier", current: "1.0 A", voltage: "800 V", voltageRms: "560 Vrms", equivalent: "1N4006" },
  "M7": { family: "M-Series (SMA)", type: "M7 — Surface Mount Rectifier", current: "1.0 A", voltage: "1000 V", voltageRms: "700 Vrms", equivalent: "1N4007" },
  "M":  { family: "M-Series (SMA)", type: "M — Surface Mount Rectifier", current: "1.0 A", voltage: "1000 V DC", voltageRms: null, equivalent: "1N4007" }
};

/* ---------- 400x Series ---------- */
const series400Database = {
  "4001": { family: "400x Series (1N400x)", type: "4001 — General Purpose Rectifier", current: "1.0 A", voltage: "50 V", voltageRms: "35 Vrms", equivalent: "1N4001" },
  "4002": { family: "400x Series (1N400x)", type: "4002 — General Purpose Rectifier", current: "1.0 A", voltage: "100 V", voltageRms: "70 Vrms", equivalent: "1N4002" },
  "4003": { family: "400x Series (1N400x)", type: "4003 — General Purpose Rectifier", current: "1.0 A", voltage: "200 V", voltageRms: "140 Vrms", equivalent: "1N4003" },
  "4004": { family: "400x Series (1N400x)", type: "4004 — General Purpose Rectifier", current: "1.0 A", voltage: "400 V", voltageRms: "280 Vrms", equivalent: "1N4004" },
  "4005": { family: "400x Series (1N400x)", type: "4005 — General Purpose Rectifier", current: "1.0 A", voltage: "600 V", voltageRms: "420 Vrms", equivalent: "1N4005" },
  "4006": { family: "400x Series (1N400x)", type: "4006 — General Purpose Rectifier", current: "1.0 A", voltage: "800 V", voltageRms: "560 Vrms", equivalent: "1N4006" },
  "4007": { family: "400x Series (1N400x)", type: "4007 — General Purpose Rectifier", current: "1.0 A", voltage: "1000 V", voltageRms: "700 Vrms", equivalent: "1N4007" }
};

/* ---------- 1N54 Series (3A) ---------- */
const series1N54Database = {
  "1N5400": { family: "1N54 Series (3A)", type: "1N5400 — General Purpose Rectifier", current: "3.0 A", voltage: "50 V", equivalent: "1N5400" },
  "1N5401": { family: "1N54 Series (3A)", type: "1N5401 — General Purpose Rectifier", current: "3.0 A", voltage: "100 V", equivalent: "1N5401" },
  "1N5402": { family: "1N54 Series (3A)", type: "1N5402 — General Purpose Rectifier", current: "3.0 A", voltage: "200 V", equivalent: "1N5402" },
  "1N5403": { family: "1N54 Series (3A)", type: "1N5403 — General Purpose Rectifier", current: "3.0 A", voltage: "300 V", equivalent: "1N5403" },
  "1N5404": { family: "1N54 Series (3A)", type: "1N5404 — General Purpose Rectifier", current: "3.0 A", voltage: "400 V", equivalent: "1N5404" },
  "1N5405": { family: "1N54 Series (3A)", type: "1N5405 — General Purpose Rectifier", current: "3.0 A", voltage: "500 V", equivalent: "1N5405" },
  "1N5406": { family: "1N54 Series (3A)", type: "1N5406 — General Purpose Rectifier", current: "3.0 A", voltage: "600 V", equivalent: "1N5406" },
  "1N5407": { family: "1N54 Series (3A)", type: "1N5407 — General Purpose Rectifier", current: "3.0 A", voltage: "800 V", equivalent: "1N5407" },
  "1N5408": { family: "1N54 Series (3A)", type: "1N5408 — General Purpose Rectifier", current: "3.0 A", voltage: "1000 V", equivalent: "1N5408" }
};

/* ============================================================
   ZENER DIODE DATABASE (W1–Z5)
   ============================================================ */
const zenerDatabase = {
  "W1": { family: "Zener Diode (SOD-123)", type: "W1 — 3.3V Zener",   zenerV: "3.3 V",  equivalent: "BZT52C3V3", package: "SOD-123" },
  "W2": { family: "Zener Diode (SOD-123)", type: "W2 — 3.6V Zener",   zenerV: "3.6 V",  equivalent: "BZT52C3V6", package: "SOD-123" },
  "W3": { family: "Zener Diode (SOD-123)", type: "W3 — 3.9V Zener",   zenerV: "3.9 V",  equivalent: "BZT52C3V9", package: "SOD-123" },
  "W4": { family: "Zener Diode (SOD-123)", type: "W4 — 4.3V Zener",   zenerV: "4.3 V",  equivalent: "BZT52C4V3", package: "SOD-123" },
  "W5": { family: "Zener Diode (SOD-123)", type: "W5 — 4.7V Zener",   zenerV: "4.7 V",  equivalent: "BZT52C4V7", package: "SOD-123" },
  "W8": { family: "Zener Diode (SOD-123)", type: "W8 — 5.1V Zener",   zenerV: "5.1 V",  equivalent: "BZT52C5V1", package: "SOD-123" },
  "W9": { family: "Zener Diode (SOD-123)", type: "W9 — 5.6V Zener",   zenerV: "5.6 V",  equivalent: "BZT52C5V6", package: "SOD-123" },
  "WA": { family: "Zener Diode (SOD-123)", type: "WA — 6.2V Zener",   zenerV: "6.2 V",  equivalent: "BZT52C6V2", package: "SOD-123" },
  "WB": { family: "Zener Diode (SOD-123)", type: "WB — 6.8V Zener",   zenerV: "6.8 V",  equivalent: "BZT52C6V8", package: "SOD-123" },
  "WC": { family: "Zener Diode (SOD-123)", type: "WC — 7.5V Zener",   zenerV: "7.5 V",  equivalent: "BZT52C7V5", package: "SOD-123" },
  "Z1": { family: "Zener Diode (SOD-123)", type: "Z1 — 10V Zener",    zenerV: "10 V",   equivalent: "BZT52C10",  package: "SOD-123" },
  "Z2": { family: "Zener Diode (SOD-123)", type: "Z2 — 11V Zener",    zenerV: "11 V",   equivalent: "BZT52C11",  package: "SOD-123" },
  "Z3": { family: "Zener Diode (SOD-123)", type: "Z3 — 12V Zener",    zenerV: "12 V",   equivalent: "BZT52C12",  package: "SOD-123" },
  "Z4": { family: "Zener Diode (SOD-123)", type: "Z4 — 13V Zener",    zenerV: "13 V",   equivalent: "BZT52C13",  package: "SOD-123" },
  "Z5": { family: "Zener Diode (SOD-123)", type: "Z5 — 15V Zener",    zenerV: "15 V",   equivalent: "BZT52C15",  package: "SOD-123" }
};

/* ============================================================
   SCHOTTKY DIODE CODES (SMD Markings)
   ============================================================ */
const schottkyDatabase = {
  "SS14": { family: "Schottky Diode (SMA)",  type: "SS14 — Schottky Barrier",     current: "1.0 A",   voltage: "40 V",  equivalent: "SS14",  package: "SMA" },
  "SS34": { family: "Schottky Diode (SMC)",  type: "SS34 — Schottky Barrier",     current: "3.0 A",   voltage: "40 V",  equivalent: "SS34",  package: "SMC" },
  "B120": { family: "Schottky Diode (SMA)",  type: "B120 — Schottky Rectifier",   current: "1.0 A",   voltage: "20 V",  equivalent: "B120",  package: "SMA" },
  "B140": { family: "Schottky Diode (SMA)",  type: "B140 — Schottky Rectifier",   current: "1.0 A",   voltage: "40 V",  equivalent: "B140",  package: "SMA" },
  "KL3":  { family: "Schottky Diode (SOT-23)", type: "KL3 — BAT54",               current: "200 mA",  voltage: "30 V",  equivalent: "BAT54",   package: "SOT-23" },
  "KL4":  { family: "Schottky Diode (SOT-23)", type: "KL4 — BAT54S (Dual)",       current: "200 mA",  voltage: "30 V",  equivalent: "BAT54S",  package: "SOT-23" },
  "JV3":  { family: "Schottky Diode (SOT-23)", type: "JV3 — BAT54C (Dual)",       current: "200 mA",  voltage: "30 V",  equivalent: "BAT54C",  package: "SOT-23" },
  "L4":   { family: "Schottky Diode (SOT-23)", type: "L4 — BAT54A (Dual)",        current: "200 mA",  voltage: "30 V",  equivalent: "BAT54A",  package: "SOT-23" },
  "SL":   { family: "Schottky Diode (SOD-123)", type: "SL — B5819W",              current: "1.0 A",   voltage: "40 V",  equivalent: "B5819W",  package: "SOD-123" },
  "S4":   { family: "Schottky Diode (SOD-123)", type: "S4 — SD103AW",             current: "350 mA",  voltage: "40 V",  equivalent: "SD103AW", package: "SOD-123" }
};

/* ============================================================
   SWITCHING DIODE CODES
   ============================================================ */
const switchingDatabase = {
  "A2":  { family: "Switching Diode (SOD-123)", type: "A2 — 1N4148W",                current: "0.3 A",   voltage: "100 V", config: "Single",              equivalent: "1N4148W",  package: "SOD-123" },
  "T4":  { family: "Switching Diode (SOD-323)", type: "T4 — 1N4148WS",               current: "0.3 A",   voltage: "100 V", config: "Single",              equivalent: "1N4148WS", package: "SOD-323" },
  "A7":  { family: "Switching Diode (SOT-23)",  type: "A7 — BAV99",                  current: "0.2 A",   voltage: "70 V",  config: "Dual Series",         equivalent: "BAV99",    package: "SOT-23" },
  "A4":  { family: "Switching Diode (SOT-23)",  type: "A4 — BAV70",                  current: "0.2 A",   voltage: "70 V",  config: "Dual Common Cathode", equivalent: "BAV70",    package: "SOT-23" },
  "A1":  { family: "Switching Diode (SOT-23)",  type: "A1 — BAW56",                  current: "0.2 A",   voltage: "70 V",  config: "Dual Common Anode",   equivalent: "BAW56",    package: "SOT-23" },
  "5D":  { family: "Switching Diode (SOT-23)",  type: "5D — MMBD4148",               current: "0.2 A",   voltage: "100 V", config: "Single",              equivalent: "MMBD4148", package: "SOT-23" },
  "JV":  { family: "Switching Diode (SOT-363)", type: "JV — BAV70S",                 current: "0.2 A",   voltage: "70 V",  config: "Dual Common Anode",   equivalent: "BAV70S",   package: "SOT-363" },
  "KJM": { family: "Switching Diode (SOD-123)", type: "KJM — BAV19W",                current: "0.2 A",   voltage: "250 V", config: "Single",              equivalent: "BAV19W",   package: "SOD-123" },
  "T6":  { family: "Switching Diode (SOD-323)", type: "T6 — 1N4448WS",               current: "0.25 A",  voltage: "100 V", config: "Single",              equivalent: "1N4448WS", package: "SOD-323" },
  "A6":  { family: "Switching Diode (SOT-23)",  type: "A6 — BAS16",                  current: "0.25 A",  voltage: "100 V", config: "Single",              equivalent: "BAS16",    package: "SOT-23" }
};

/* ============================================================
   TVS DIODE CODES
   ============================================================ */
const tvsDatabase = {
  "LE": { family: "TVS Diode (SMA)", type: "LE — 6.4V TVS",   breakdown: "6.4 V",  standoff: "5.0 V",  package: "SMA" },
  "CA": { family: "TVS Diode (SMA)", type: "CA — 13.3V TVS",  breakdown: "13.3 V", standoff: "12.0 V", package: "SMA" },
  "BM": { family: "TVS Diode (SMA)", type: "BM — 26.7V TVS",  breakdown: "26.7 V", standoff: "24.0 V", package: "SMA" },
  "HE": { family: "TVS Diode (SMB)", type: "HE — 6.4V TVS",   breakdown: "6.4 V",  standoff: "5.0 V",  package: "SMB" },
  "PX": { family: "TVS Diode (SMC)", type: "PX — 16.7V TVS",  breakdown: "16.7 V", standoff: "15.0 V", package: "SMC" }
};

/* ============================================================
   PACKAGE REFERENCE TABLE
   ============================================================ */
const packageReference = [
  { name: "SOD-523",        dims: "1.2mm × 0.8mm",    current: "< 200 mA",         app: "Ultra-small mobile devices & wearables" },
  { name: "SOD-323",        dims: "1.7mm × 1.25mm",   current: "~ 200mA – 500mA",  app: "Signal processing / small power" },
  { name: "SOD-123",        dims: "2.7mm × 1.6mm",    current: "~ 1 A",            app: "Moderate power / signal isolation" },
  { name: "SMA (DO-214AC)", dims: "4.3mm × 2.6mm",    current: "1 A – 2 A",        app: "Rectifiers / main power paths" },
  { name: "SMB (DO-214AA)", dims: "4.3mm × 3.6mm",    current: "2 A – 3 A",        app: "Heavy rectifiers / TVS protection" }
];

/* ============================================================
   FR CODE PARSER
   ============================================================ */
function parseFRCode(code) {
  code = code.toUpperCase();
  if (!code.startsWith("FR")) return null;
  const after = code.substring(2);
  if (!after) return null;
  if (after.length >= 3) {
    const cc2 = after.substring(0, 2);
    const vc = after.substring(2);
    if (frCurrentMap[cc2] && frVoltageMap[vc]) {
      return { currentCode: cc2, current: frCurrentMap[cc2].current, voltageCode: vc, voltage: frVoltageMap[vc].voltage };
    }
  }
  if (after.length >= 2) {
    const cc1 = after.substring(0, 1);
    const vc = after.substring(1);
    if (frCurrentAliases[cc1] && frVoltageMap[vc]) {
      const main = frCurrentAliases[cc1];
      return { currentCode: cc1, current: frCurrentMap[main].current, voltageCode: vc, voltage: frVoltageMap[vc].voltage };
    }
  }
  return null;
}

/* ============================================================
   UNIFIED LOOKUP
   ============================================================ */
function findDiode(code) {
  code = (code || "").toUpperCase();
  // Package reference lookup
  if (packageReference.some(p => p.name.toUpperCase().replace(/[^A-Z0-9]/g,"") === code.replace(/[^A-Z0-9]/g,""))) {
    const pkg = packageReference.find(p => p.name.toUpperCase().replace(/[^A-Z0-9]/g,"") === code.replace(/[^A-Z0-9]/g,""));
    if (pkg) return { source: "package", data: pkg };
  }
  if (diodeDatabase[code]) return { source: "builder", data: diodeDatabase[code] };
  if (mSeriesDatabase[code]) return { source: "m-series", data: mSeriesDatabase[code] };
  if (series400Database[code]) return { source: "400x", data: series400Database[code] };
  if (series1N54Database[code]) return { source: "1n54", data: series1N54Database[code] };
  if (zenerDatabase[code]) return { source: "zener", data: zenerDatabase[code] };
  if (schottkyDatabase[code]) return { source: "schottky", data: schottkyDatabase[code] };
  if (switchingDatabase[code]) return { source: "switching", data: switchingDatabase[code] };
  if (tvsDatabase[code]) return { source: "tvs", data: tvsDatabase[code] };
  return null;
}

/* ============================================================
   STATE & DOM
   ============================================================ */
const state = { speed: null, current: null, voltage: null, mode: "standard" };
const $ = (id) => document.getElementById(id);
const cell1 = $("cell1"), cell2 = $("cell2"), cell3 = $("cell3"), cell4 = $("cell4");
const panel1 = $("panel1"), panel2 = $("panel2"), panel3 = $("panel3");
const speedGrid = $("speedGrid"), currentGrid = $("currentGrid"), voltageGrid = $("voltageGrid");
const speedSummary = $("speedSummary"), currentSummary = $("currentSummary"), voltageSummary = $("voltageSummary");
const currentSub = $("currentSub"), voltageSub = $("voltageSub");
const resultCard = $("resultCard");
const searchInput = $("searchInput"), searchResult = $("searchResult");
const toast = $("toast"), toastMsg = $("toastMsg");

/* ============================================================
   RENDER GRIDS
   ============================================================ */
function renderSpeedGrid() {
  speedGrid.innerHTML = "";
  for (const [code, info] of Object.entries(speedMap)) {
    const btn = document.createElement("button");
    btn.className = "option"; btn.dataset.value = code;
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
    btn.className = "option"; btn.dataset.value = code;
    btn.innerHTML = `<div class="opt-code">${code}</div><div class="opt-label">Current Code</div><div class="opt-value">${info.current}</div>`;
    btn.addEventListener("click", () => selectCurrent(code));
    currentGrid.appendChild(btn);
  }
}
function renderFRCurrentGrid() {
  currentGrid.innerHTML = "";
  currentSub.innerHTML = "FR current code: <strong>10 or 1 = 1A · 15 = 1.5A · 20 or 2 = 2A · 30 or 3 = 3A · 60 or 6 = 6A</strong>";
  for (const [code, info] of Object.entries(frCurrentMap)) {
    const btn = document.createElement("button");
    btn.className = "option"; btn.dataset.value = code;
    const altText = info.alt ? ` (or ${info.alt})` : "";
    btn.innerHTML = `<div class="opt-code">${code}</div><div class="opt-label">Current Code${altText}</div><div class="opt-value">${info.current}</div>`;
    btn.addEventListener("click", () => selectCurrent(code));
    currentGrid.appendChild(btn);
  }
}
function renderStandardVoltageGrid() {
  voltageGrid.innerHTML = "";
  voltageSub.textContent = "Choose the reverse voltage code (last character(s)). Codes I and L are reserved.";
  for (const code of ["A","B","C","D","E","F","G","H","I","J","K","L","M","T4"]) {
    const info = voltageMap[code];
    const btn = document.createElement("button");
    btn.className = "option" + (info.used ? "" : " unused"); btn.dataset.value = code;
    btn.innerHTML = `<div class="opt-code">${code}</div><div class="opt-label">Voltage Code</div><div class="opt-value">${info.used ? info.voltage : "⊘ Not used"}</div>`;
    if (info.used) btn.addEventListener("click", () => selectVoltage(code));
    else { btn.addEventListener("click", () => showToast(`${code} is not used`)); btn.title = "Reserved / not used"; }
    voltageGrid.appendChild(btn);
  }
}
function renderFRVoltageGrid() {
  voltageGrid.innerHTML = "";
  voltageSub.innerHTML = "FR voltage code: <strong>1=50V · 2=100V · 3=200V · 4=400V · 5=600V · 6=800V · 7=1000V</strong>";
  for (const code of ["1","2","3","4","5","6","7"]) {
    const info = frVoltageMap[code];
    const btn = document.createElement("button");
    btn.className = "option"; btn.dataset.value = code;
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
  currentSummary.classList.remove("show"); voltageSummary.classList.remove("show");
  panel2.classList.remove("completed"); panel3.classList.remove("completed", "active");
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
  panel2.classList.add("completed"); panel3.classList.add("active");
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
   FR BREAKDOWN
   ============================================================ */
function renderFRBreakdown(code, data) {
  const container = $("frBreakdownContainer");
  if (!data.isFR) { container.innerHTML = ""; return; }
  const parsed = parseFRCode(code);
  if (!parsed) { container.innerHTML = ""; return; }
  container.innerHTML = `
    <div class="fr-breakdown">
      <div class="fr-breakdown-title">📖 FR Code Breakdown</div>
      <div class="fr-breakdown-row">
        <div class="fr-segment speed-seg">
          <div class="fr-seg-code">FR</div>
          <div class="fr-seg-label">Speed / Family</div>
          <div class="fr-seg-value">Fast Recovery</div>
        </div>
        <div class="fr-segment current-seg">
          <div class="fr-seg-code">${parsed.currentCode}</div>
          <div class="fr-seg-label">Current Code</div>
          <div class="fr-seg-value">${parsed.current}</div>
        </div>
        <div class="fr-segment voltage-seg">
          <div class="fr-seg-code">${parsed.voltageCode}</div>
          <div class="fr-seg-label">Voltage Code</div>
          <div class="fr-seg-value">${parsed.voltage}</div>
        </div>
      </div>
    </div>
  `;
}

/* ============================================================
   RESULT CARD RENDERER
   ============================================================ */
function renderResult(code, source, data) {
  $("resultCode").textContent = code;
  $("resultType").textContent = data.type;
  const familyEl = $("resultFamily");
  if (data.family) { familyEl.textContent = data.family; familyEl.style.display = "inline-block"; }
  else familyEl.style.display = "none";

  renderFRBreakdown(code, data);

  const grid = $("resultGrid");
  grid.innerHTML = "";

  if (source === "builder") {
    const speedLabel = data.isFR ? "⚡ Family" : "⚡ Speed / Type";
    const speedValue = data.isFR ? "FR · Fast Recovery" : `${data.speedCode} · ${data.type.split(" ")[0]}`;
    grid.innerHTML = `
      <div class="badge speed"><div class="b-label">${speedLabel}</div><div class="b-value">${speedValue}</div></div>
      <div class="badge current"><div class="b-label">🔌 Current</div><div class="b-value">${data.current}</div></div>
      <div class="badge voltage"><div class="b-label">⚡ Reverse Voltage</div><div class="b-value">${data.voltage}</div></div>
      <div class="badge code"><div class="b-label">📋 Part Code</div><div class="b-value">${code}</div></div>
    `;
  } else if (source === "zener") {
    grid.innerHTML = `
      <div class="badge zener"><div class="b-label">⚡ Zener Voltage (Vz)</div><div class="b-value">${data.zenerV}</div></div>
      <div class="badge speed"><div class="b-label">🔁 Standard Part</div><div class="b-value">${data.equivalent}</div></div>
      <div class="badge code"><div class="b-label">📦 Package</div><div class="b-value">${data.package}</div></div>
      <div class="badge code"><div class="b-label">📋 SMD Code</div><div class="b-value">${code}</div></div>
    `;
  } else if (source === "schottky") {
    grid.innerHTML = `
      <div class="badge schottky"><div class="b-label">🔌 Forward Current</div><div class="b-value">${data.current}</div></div>
      <div class="badge schottky"><div class="b-label">⚡ Reverse Voltage</div><div class="b-value">${data.voltage}</div></div>
      <div class="badge speed"><div class="b-label">🔁 Standard Part</div><div class="b-value">${data.equivalent}</div></div>
      <div class="badge code"><div class="b-label">📦 Package</div><div class="b-value">${data.package}</div></div>
    `;
  } else if (source === "switching") {
    grid.innerHTML = `
      <div class="badge switch"><div class="b-label">🔌 Forward Current</div><div class="b-value">${data.current}</div></div>
      <div class="badge switch"><div class="b-label">⚡ Reverse Voltage</div><div class="b-value">${data.voltage}</div></div>
      <div class="badge speed"><div class="b-label">⚙️ Configuration</div><div class="b-value">${data.config}</div></div>
      <div class="badge speed"><div class="b-label">🔁 Standard Part</div><div class="b-value">${data.equivalent}</div></div>
      <div class="badge code"><div class="b-label">📦 Package</div><div class="b-value">${data.package}</div></div>
    `;
  } else if (source === "tvs") {
    grid.innerHTML = `
      <div class="badge tvs"><div class="b-label">⚡ Breakdown Voltage</div><div class="b-value">${data.breakdown}</div></div>
      <div class="badge tvs"><div class="b-label">🛡️ Stand-off Voltage</div><div class="b-value">${data.standoff}</div></div>
      <div class="badge code"><div class="b-label">📦 Package</div><div class="b-value">${data.package}</div></div>
      <div class="badge code"><div class="b-label">📋 SMD Code</div><div class="b-value">${code}</div></div>
    `;
  } else if (source === "package") {
    grid.innerHTML = `
      <div class="badge code"><div class="b-label">📦 Package</div><div class="b-value">${data.name}</div></div>
      <div class="badge speed"><div class="b-label">📏 Dimensions (L × W)</div><div class="b-value">${data.dims}</div></div>
      <div class="badge current"><div class="b-label">🔌 Typical Current</div><div class="b-value">${data.current}</div></div>
      <div class="badge voltage"><div class="b-label">⚙️ Typical Application</div><div class="b-value" style="font-size:0.85rem; word-break:break-word;">${data.app}</div></div>
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
  addRecent(code);
}

function updateResult() {
  const code = buildCode();
  if (!code) { resultCard.classList.remove("show"); return; }
  const found = findDiode(code);
  if (!found) { resultCard.classList.remove("show"); return; }
  renderResult(code, found.source, found.data);
}

/* ============================================================
   SEARCH
   ============================================================ */
function lookupCode(code) {
  code = (code || "").trim().toUpperCase();
  if (!code || code.length < 1) {
    searchResult.innerHTML = `<span style="color: var(--danger)">⚠️ Enter a valid diode code.</span>`;
    searchResult.classList.add("show"); return;
  }

  const found = findDiode(code);
  if (!found) {
    searchResult.innerHTML = `<span style="color: var(--danger)">❌ Code <strong>${code}</strong> not found in database.</span>`;
    searchResult.classList.add("show"); resultCard.classList.remove("show"); return;
  }

  const d = found.data;
  let summary = `✅ <strong>${code}</strong> → ${d.type || d.name}`;
  if (d.current) summary += ` · Current: <strong>${d.current}</strong>`;
  if (d.voltage) summary += ` · Voltage: <strong>${d.voltage}</strong>`;
  if (d.zenerV) summary += ` · Vz: <strong>${d.zenerV}</strong>`;
  if (d.breakdown) summary += ` · Breakdown: <strong>${d.breakdown}</strong>`;
  if (d.standoff) summary += ` · Stand-off: <strong>${d.standoff}</strong>`;
  if (d.voltageRms) summary += ` · RMS: <strong>${d.voltageRms}</strong>`;
  if (d.equivalent) summary += ` · Part: <strong>${d.equivalent}</strong>`;
  if (d.config) summary += ` · Config: <strong>${d.config}</strong>`;
  if (d.package) summary += ` · Pkg: <strong>${d.package}</strong>`;
  searchResult.innerHTML = summary;
  searchResult.classList.add("show");

  if (found.source === "builder") {
    state.speed = d.speedCode; state.current = d.currentCode; state.voltage = d.voltageCode;
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
    state.speed = state.current = state.voltage = null; state.mode = "standard";
    renderStandardCurrentGrid(); renderStandardVoltageGrid();
    [...speedGrid.children].forEach(c => c.classList.remove("selected"));
    [speedSummary, currentSummary, voltageSummary].forEach(s => s.classList.remove("show"));
    [panel1, panel2, panel3].forEach(p => p.classList.remove("completed"));
    panel2.classList.remove("active"); panel3.classList.remove("active");
    updateCodeDisplay();
  }

  renderResult(code, found.source, d);
  setTimeout(() => resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

$("searchBtn").addEventListener("click", () => lookupCode(searchInput.value));
searchInput.addEventListener("keydown", (e) => { if (e.key === "Enter") lookupCode(searchInput.value); });
searchInput.addEventListener("input", () => { searchInput.value = searchInput.value.toUpperCase().replace(/[^A-Z0-9\-]/g, ""); });
document.querySelectorAll(".hint-chip").forEach(chip => {
  chip.addEventListener("click", () => { searchInput.value = chip.dataset.code; lookupCode(chip.dataset.code); });
});

/* ============================================================
   PACKAGE TABLE RENDER
   ============================================================ */
function renderPackageTable() {
  const tbody = document.querySelector("#pkgTable tbody");
  tbody.innerHTML = "";
  packageReference.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.dims}</td>
      <td>${p.current}</td>
      <td>${p.app}</td>
    `;
    tr.style.cursor = "pointer";
    tr.addEventListener("click", () => {
      // Extract package code (e.g., "SMA" from "SMA (DO-214AC)")
      const code = p.name.split(" ")[0];
      searchInput.value = code;
      lookupCode(code);
    });
    tbody.appendChild(tr);
  });
}

/* ============================================================
   COPY / FAVORITE / RESET
   ============================================================ */
$("copyBtn").addEventListener("click", async () => {
  const code = buildCode();
  if (!code) { showToast("Select all values first"); return; }
  try { await navigator.clipboard.writeText(code); showToast(`${code} copied!`); }
  catch { const ta = document.createElement("textarea"); ta.value = code; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); showToast(`${code} copied!`); }
});
$("favBtn").addEventListener("click", () => { const code = buildCode(); if (!code) { showToast("Select all values first"); return; } toggleFavorite(code); });
$("resetBtn").addEventListener("click", () => {
  state.speed = state.current = state.voltage = null; state.mode = "standard";
  renderStandardCurrentGrid(); renderStandardVoltageGrid();
  [...speedGrid.children].forEach(c => c.classList.remove("selected"));
  [speedSummary, currentSummary, voltageSummary, searchResult].forEach(s => s.classList.remove("show"));
  [panel1, panel2, panel3].forEach(p => p.classList.remove("completed"));
  panel2.classList.remove("active"); panel3.classList.remove("active");
  resultCard.classList.remove("show"); $("frBreakdownContainer").innerHTML = "";
  searchInput.value = ""; updateCodeDisplay(); showToast("Reset complete");
});

/* ============================================================
   TOAST / FAVORITES / RECENT / THEME
   ============================================================ */
let toastTimer;
function showToast(msg) { toastMsg.textContent = msg; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2000); }

const LS_FAV = "smd_favorites", LS_REC = "smd_recent";
function loadJSON(key, fb) { try { return JSON.parse(localStorage.getItem(key)) || fb; } catch { return fb; } }
function saveJSON(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

function toggleFavorite(code) {
  const favs = loadJSON(LS_FAV, []);
  const idx = favs.indexOf(code);
  if (idx >= 0) { favs.splice(idx, 1); showToast(`${code} removed from favorites`); }
  else { favs.unshift(code); showToast(`${code} added to favorites`); }
  saveJSON(LS_FAV, favs.slice(0, 20)); renderFavorites();
}
function addRecent(code) {
  const rec = loadJSON(LS_REC, []);
  rec.unshift(code); saveJSON(LS_REC, [...new Set(rec)].slice(0, 12)); renderRecent();
}
function renderFavorites() {
  const favs = loadJSON(LS_FAV, []), wrap = $("favChips");
  if (!favs.length) { wrap.innerHTML = `<span class="empty">No favorites yet. Tap "Favorite" to save a code.</span>`; return; }
  wrap.innerHTML = "";
  favs.forEach(code => {
    const chip = document.createElement("button"); chip.className = "chip";
    chip.innerHTML = `<span class="fav">★</span> ${code} <span class="remove" title="Remove">×</span>`;
    chip.addEventListener("click", (e) => { if (e.target.classList.contains("remove")) { e.stopPropagation(); toggleFavorite(code); } else lookupCode(code); });
    wrap.appendChild(chip);
  });
}
function renderRecent() {
  const rec = loadJSON(LS_REC, []), wrap = $("recentChips");
  if (!rec.length) { wrap.innerHTML = `<span class="empty">No recent searches.</span>`; return; }
  wrap.innerHTML = "";
  rec.forEach(code => {
    const chip = document.createElement("button"); chip.className = "chip"; chip.textContent = code;
    chip.addEventListener("click", () => lookupCode(code)); wrap.appendChild(chip);
  });
}

const themeToggle = $("themeToggle"), themeIcon = $("themeIcon");
const sunIcon = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;
const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
function applyTheme(t) { document.documentElement.setAttribute("data-theme", t); themeIcon.innerHTML = t === "light" ? sunIcon : moonIcon; document.querySelector('meta[name="theme-color"]').setAttribute("content", t === "light" ? "#f4f6fb" : "#0a0e1a"); }
themeToggle.addEventListener("click", () => { const c = document.documentElement.getAttribute("data-theme") || "dark"; const n = c === "dark" ? "light" : "dark"; applyTheme(n); try { localStorage.setItem("smd_theme", n); } catch {} });
try { const s = localStorage.getItem("smd_theme"); applyTheme(s || "dark"); } catch { applyTheme("dark"); }

/* ============================================================
   HIDE / SHOW BUILDER & PACKAGE REFERENCE TOGGLE
   ============================================================ */
(function() {
  const toggleBtn  = $("togglePanelsBtn");
  const toggleWrap = $("togglePanelsWrap");
  const collapsible = $("panelsCollapsible");
  const label      = $("togglePanelsLabel");
  let expanded = true;

  function syncToggleVisibility() {
    // Show the button only when the result card is visible
    toggleWrap.style.display = resultCard.classList.contains("show") ? "flex" : "none";
  }

  toggleBtn.addEventListener("click", () => {
    expanded = !expanded;
    if (expanded) {
      collapsible.classList.remove("hidden");
      toggleBtn.classList.remove("collapsed");
      toggleBtn.setAttribute("aria-expanded", "true");
      label.textContent = "Hide Builder & Package Reference";
    } else {
      collapsible.classList.add("hidden");
      toggleBtn.classList.add("collapsed");
      toggleBtn.setAttribute("aria-expanded", "false");
      label.textContent = "Show Builder & Package Reference";
    }
  });

  // Patch renderResult to keep the toggle button in sync
  const _origRenderResult = renderResult;
  window.renderResult = function(code, source, data) {
    _origRenderResult(code, source, data);
    // When a result is shown, make sure the collapsible is revealed
    // (user may have hidden it before; we reveal it so they can still build)
    syncToggleVisibility();
  };

  // Also patch the remove-show path
  const _origUpdateResult = updateResult;
  window.updateResult = function() {
    _origUpdateResult();
    syncToggleVisibility();
  };

  // Sync on reset
  const resetBtn = $("resetBtn");
  resetBtn.addEventListener("click", () => {
    setTimeout(syncToggleVisibility, 50);
  }, true);
})();

/* ============================================================
   INIT
   ============================================================ */
renderSpeedGrid(); renderStandardCurrentGrid(); renderStandardVoltageGrid();
renderPackageTable();
renderFavorites(); renderRecent(); updateCodeDisplay();