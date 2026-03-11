import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine
} from "recharts";
import "./GameFormula.scss";

// ============================================================
// FORMULA: XP(n) = floor(BASE * n^POLY * EXP_FACTOR^n)
// ============================================================
function calcXP(level, { base, poly, expF }) {
  if (level < 1) return 0;
  return Math.floor(base * Math.pow(level, poly) * Math.pow(expF, level));
}
function calcRange(fromLvl, toLvl, params) {
  let total = 0;
  for (let i = fromLvl; i < toLvl; i++) total += calcXP(i, params);
  return total;
}
function fmt(n) {
  if (!isFinite(n) || isNaN(n)) return "—";
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9)  return (n / 1e9).toFixed(2)  + "B";
  if (n >= 1e6)  return (n / 1e6).toFixed(2)  + "M";
  if (n >= 1e3)  return (n / 1e3).toFixed(1)  + "K";
  return Math.round(n).toString();
}
function fmtFull(n) {
  if (!isFinite(n) || isNaN(n)) return "—";
  return Math.round(n).toLocaleString("de-DE");
}
function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

const DEFAULTS     = { base: 80, poly: 2.0, expF: 1.065 };
const ACTIVE_MULT  = 1.0;
const OFFLINE_MULT = 0.65;

const C = {
  bg:       "#111318",
  surface:  "#1a1d24",
  border:   "#2a2e38",
  borderHi: "#3a3f4d",
  text:     "#ffffff",
  muted:    "#a0a8b8",
  faint:    "#6b7280",
  early:    "#7dd3fc",
  mid:      "#86efac",
  late:     "#fbbf24",
  endgame:  "#f87171",
  active:   "#34d399",
  offline:  "#94a3b8",
  accent:   "#818cf8",
};

// ============================================================
// DATA
// ============================================================
const CLASS_MODIFIERS = [
  { name: "— No Bonus —",        mult: 1.00, desc: "Base XP gain, no modifier active" },
  { name: "📿 XP Amulet",        mult: 1.25, desc: "Common accessory. +25% XP from all sources" },
  { name: "📖 Scholar's Tome",   mult: 1.50, desc: "Rare consumable. +50% XP for 1 hour" },
  { name: "🧣 Blessed Robe",     mult: 1.75, desc: "Epic armor. +75% XP while worn" },
  { name: "👑 EXP Crown",        mult: 2.00, desc: "Legendary headgear. Doubles all XP gained" },
  { name: "⚔️  Warrior Class",    mult: 1.20, desc: "Warrior passive: +20% XP from combat kills" },
  { name: "🔮 Mage Class",       mult: 1.60, desc: "Mage passive: +60% XP from spell kills" },
  { name: "🌿 Ranger Class",     mult: 1.40, desc: "Ranger passive: +40% XP from ranged kills" },
  { name: "☠️  Berserker Class",  mult: 1.80, desc: "Berserker passive: +80% XP — high risk builds" },
  { name: "✨ Full Set Bonus",    mult: 2.50, desc: "Wearing full XP gear set. +150% total XP" },
];

const ENEMIES = [
  { name: "— Custom —",        xp: null    },
  { name: "Slime       Lv 1",  xp: 11      },
  { name: "Rat         Lv 2",  xp: 18      },
  { name: "Goblin      Lv 5",  xp: 76      },
  { name: "Wolf        Lv 8",  xp: 145     },
  { name: "Orc         Lv 12", xp: 380     },
  { name: "Golem       Lv 15", xp: 890     },
  { name: "Troll       Lv 20", xp: 1800    },
  { name: "Wyvern      Lv 25", xp: 4200    },
  { name: "Dragon      Lv 30", xp: 12400   },
  { name: "Lich        Lv 50", xp: 85000   },
  { name: "Titan       Lv 100",xp: 950000  },
];

const PHASES = [
  { id: "early",   label: "EARLY GAME",  range: [1,   25],  color: C.early   },
  { id: "mid",     label: "MID GAME",    range: [26,  80],  color: C.mid     },
  { id: "late",    label: "LATE GAME",   range: [81,  200], color: C.late    },
  { id: "endgame", label: "ENDGAME",     range: [201, 999], color: C.endgame },
];

function getPhase(lvl) {
  return PHASES.find(p => lvl >= p.range[0] && lvl <= p.range[1]) || PHASES[3];
}

const attributeData = [
  { attr: "VIT", icon: "❤️", label: "Vitality",
    grants: [{ stat: "MaxHP", formula: "100 + VIT × 15", example: "10 VIT → 250 HP" }] },
  { attr: "STR", icon: "⚔️", label: "Strength",
    grants: [{ stat: "Damage", formula: "10 + STR × 2", example: "10 STR → 30 Dmg" }] },
  { attr: "WIS", icon: "💧", label: "Wisdom",
    grants: [{ stat: "MaxMP", formula: "50 + WIS × 5", example: "10 WIS → 100 MP" }] },
  { attr: "AGI", icon: "💨", label: "Agility",
    grants: [
      { stat: "CritChance", formula: "5% + AGI × 0.5%", example: "10 AGI → 10%" },
      { stat: "Accuracy",   formula: "80 + AGI × 1",    example: "10 AGI → 90"   }
    ] },
  { attr: "END", icon: "🛡️", label: "Endurance",
    grants: [
      { stat: "Defence%",    formula: "0% + END × 0.3%", example: "10 END → 3% Red." },
      { stat: "CarryWeight", formula: "END × 2",          example: "10 END → +20 kg"  }
    ] },
  { attr: "LCK", icon: "🍀", label: "Luck",
    grants: [
      { stat: "CritDmg",    formula: "1.5x + LCK × 0.02", example: "10 LCK → 1.7x"  },
      { stat: "DropRarity", formula: "LCK × 1%",           example: "10 LCK → +10%" }
    ] }
];

// ============================================================
// BASE UI COMPONENTS
// ============================================================
function Card({ children, className = "", style = {} }) {
  return <div className={`card ${className}`} style={style}>{children}</div>;
}
function Label({ children }) {
  return <div className="label">{children}</div>;
}
function SectionTitle({ children, className = "" }) {
  return <div className={`section-title ${className}`}>{children}</div>;
}
function NumInput({ label, value, onChange, min, max }) {
  return (
    <div className="num-input">
      <Label>{label}</Label>
      <input type="number" min={min} max={max} value={value}
        onChange={e => onChange(clamp(parseInt(e.target.value) || min, min, max))} />
    </div>
  );
}
function TabBtn({ active, onClick, children }) {
  return (
    <button className={`tab-btn${active ? " tab-btn--active" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

// ============================================================
// SIDEBAR: MODIFIERS CONTROLS
// ============================================================
function ModifierSidebar({ baseVal, setBaseVal, flat, setFlat, pctAdd, setPctAdd, pctMult, setPctMult }) {
  const result = (baseVal + flat) * (1 + pctAdd) * (1 + pctMult);

  const sliders = [
    { label: "BASE VALUE",     val: baseVal, set: setBaseVal, min: 0, max: 500,  step: 1,    dec: 0  },
    { label: "FLAT BONUS",     val: flat,    set: setFlat,    min: 0, max: 300,  step: 1,    dec: 0  },
    { label: "PERCENT ADD",    val: pctAdd,  set: setPctAdd,  min: 0, max: 1,    step: 0.05, dec: 2, note: `= +${(pctAdd*100).toFixed(0)}%` },
    { label: "PERCENT MULT",   val: pctMult, set: setPctMult, min: 0, max: 1,    step: 0.05, dec: 2, note: `= ×${(1+pctMult).toFixed(2)}` },
  ];

  return (
    <>
      <div className="sidebar__section-title">MODIFIER DEMO</div>
      <div className="sidebar__formula-box">
        (Base + Flat) × (1 + Add) × (1 + Mult)
      </div>

      <div style={{ height: 10 }} />

      {sliders.map(({ label, val, set, min, max, step, dec, note }) => (
        <div key={label} className="sidebar__slider-row">
          <div className="slider-header">
            <span className="slider-label">{label}{note ? ` — ${note}` : ""}</span>
            <span className="slider-value">{dec > 0 ? val.toFixed(dec) : val}</span>
          </div>
          <input type="range" min={min} max={max} step={step} value={val}
            style={{ accentColor: C.accent }}
            onChange={e => set(Number(e.target.value))} />
          <div className="slider-range">
            <span>{min}</span><span>{max}</span>
          </div>
        </div>
      ))}

      <div className="sidebar__section-title" style={{ marginTop: 4 }}>RESULT</div>

      <div className="sidebar__result-box">
        <div className="res-label">BASE</div>
        <div className="res-value">{baseVal}</div>
      </div>
      <div className="sidebar__result-box">
        <div className="res-label">+ FLAT</div>
        <div className="res-value res-value--accent">+{flat} → {baseVal + flat}</div>
      </div>
      <div className="sidebar__result-box">
        <div className="res-label">FINAL</div>
        <div className="res-value res-value--big">{result.toFixed(1)}</div>
      </div>

      <div className="sidebar__formula-box">
        ({baseVal} + {flat}) × (1 + {pctAdd.toFixed(2)}) × (1 + {pctMult.toFixed(2)}){" "}
        = <span>{result.toFixed(1)}</span>
      </div>
    </>
  );
}

// ============================================================
// SIDEBAR: ELEMENTS CONTROLS
// ============================================================
function ElementSidebar({ atkFire, setAtkFire, physBase, setPhysBase, physAtk, setPhysAtk,
                          resIce, setResIce, resFire, setResFire }) {
  const softCap     = (r) => r <= 50 ? r : 50 + (r - 50) * 0.5;
  const totalWeight = resIce + resFire;
  const avgEffect   = totalWeight > 0 ? (2.0 * resIce + 0.5 * resFire) / totalWeight : 1.0;
  const physDmg     = Math.round((physBase + physAtk) * (1 - softCap(0) / 100));
  const fireDmg     = Math.max(0, Math.round(atkFire * (1 - softCap(resFire) / 100) * avgEffect));
  const total       = physDmg + fireDmg;

  const attackSliders = [
    { label: "BASE DAMAGE",     val: physBase, set: setPhysBase, max: 200 },
    { label: "PHYSICAL ATTACK", val: physAtk,  set: setPhysAtk,  max: 100 },
    { label: "🔥 FIRE ATTACK",  val: atkFire,  set: setAtkFire,  max: 100 },
  ];
  const resistSliders = [
    { label: "❄️ ICE RESIST",  val: resIce,  set: setResIce,  eff: softCap(resIce).toFixed(0)  },
    { label: "🔥 FIRE RESIST", val: resFire, set: setResFire, eff: softCap(resFire).toFixed(0) },
  ];

  return (
    <>
      <div className="sidebar__section-title">ATTACKER</div>
      {attackSliders.map(({ label, val, set, max }) => (
        <div key={label} className="sidebar__slider-row">
          <div className="slider-header">
            <span className="slider-label">{label}</span>
            <span className="slider-value">{val}</span>
          </div>
          <input type="range" min={0} max={max} value={val}
            style={{ accentColor: C.accent }}
            onChange={e => set(Number(e.target.value))} />
          <div className="slider-range"><span>0</span><span>{max}</span></div>
        </div>
      ))}

      <div className="sidebar__divider" />

      <div className="sidebar__section-title">DEFENDER RESIST</div>
      {resistSliders.map(({ label, val, set, eff }) => (
        <div key={label} className="sidebar__slider-row">
          <div className="slider-header">
            <span className="slider-label">{label}</span>
            <span className="slider-value">{val}% → {eff}%</span>
          </div>
          <input type="range" min={0} max={100} value={val}
            style={{ accentColor: C.accent }}
            onChange={e => set(Number(e.target.value))} />
          <div className="slider-range"><span>0</span><span>100</span></div>
        </div>
      ))}

      <div className="sidebar__effectiveness">
        🔥 vs ❄️ = ×2.0 (strong)<br />
        🔥 vs 🔥 = ×0.5 (weak)<br />
        weighted avg: <span>×{avgEffect.toFixed(2)}</span>
      </div>

      <div className="sidebar__divider" />

      <div className="sidebar__section-title">DAMAGE RESULT</div>
      <div className="sidebar__result-box">
        <div className="res-label">⚔️ PHYSICAL</div>
        <div className="res-value">{physDmg}</div>
      </div>
      <div className="sidebar__result-box">
        <div className="res-label">🔥 FIRE</div>
        <div className="res-value res-value--accent">{fireDmg}</div>
      </div>
      <div className="sidebar__result-box">
        <div className="res-label">TOTAL DAMAGE</div>
        <div className="res-value res-value--big">{total}</div>
      </div>

      <div className="sidebar__formula-box">
        soft cap: 100% → max <span>75%</span> effective
      </div>
    </>
  );
}

// ============================================================
// APP
// ============================================================
export default function App() {
  const [params,        setParams]        = useState(DEFAULTS);
  const [tab,           setTab]           = useState("calc");
  const [monsterXP,     setMonsterXP]     = useState(75);
  const [selectedEnemy, setSelectedEnemy] = useState(0);
  const [currentLvl,    setCurrentLvl]    = useState(1);
  const [targetLvl,     setTargetLvl]     = useState(50);
  const [chartMode,     setChartMode]     = useState("needed");
  const [selectedMod,   setSelectedMod]   = useState(0);
  const [customMult,    setCustomMult]    = useState(1.0);

  // Modifier Demo state (hoisted for sidebar)
  const [modBaseVal, setModBaseVal] = useState(100);
  const [modFlat,    setModFlat]    = useState(50);
  const [modPctAdd,  setModPctAdd]  = useState(0.10);
  const [modPctMult, setModPctMult] = useState(0.20);

  // Element Demo state (hoisted for sidebar)
  const [atkFire,  setAtkFire]  = useState(50);
  const [physBase, setPhysBase] = useState(100);
  const [physAtk,  setPhysAtk]  = useState(20);
  const [resIce,   setResIce]   = useState(60);
  const [resFire,  setResFire]  = useState(30);

  const activeMod       = CLASS_MODIFIERS[selectedMod];
  const classMultiplier = selectedMod === 0 ? customMult : activeMod.mult;
  const from            = clamp(currentLvl, 1, 998);
  const to              = clamp(targetLvl, from + 1, 999);
  const effectiveXPPerKill = monsterXP * classMultiplier;

  function handleEnemySelect(idx) {
    setSelectedEnemy(idx);
    const enemy = ENEMIES[idx];
    if (enemy.xp !== null) setMonsterXP(enemy.xp);
  }

  const journey = useMemo(() => {
    const totalXP      = calcRange(from, to, params);
    const killsActive  = Math.ceil(totalXP / (effectiveXPPerKill * ACTIVE_MULT));
    const killsOffline = Math.ceil(totalXP / (effectiveXPPerKill * OFFLINE_MULT));
    return { totalXP, killsActive, killsOffline, levels: to - from };
  }, [from, to, params, effectiveXPPerKill]);

  const phaseBreakdown = useMemo(() =>
    PHASES.map(p => {
      const s = Math.max(from, p.range[0]);
      const e = Math.min(to, p.range[1]);
      if (s >= e) return null;
      const xp    = calcRange(s, e, params);
      const kills = Math.ceil(xp / (effectiveXPPerKill * ACTIVE_MULT));
      return { ...p, start: s, end: e, xp, kills, levels: e - s };
    }).filter(Boolean),
  [from, to, params, effectiveXPPerKill]);

  const chartData = useMemo(() => {
    const cap  = Math.min(to + 20, 999);
    const step = cap > 300 ? 5 : cap > 100 ? 2 : 1;
    const pts  = [];
    for (let l = 1; l <= cap; l += step)
      pts.push({ level: l, needed: calcXP(l, params), total: calcRange(1, l + 1, params) });
    return pts;
  }, [params, to]);

  const nextXP       = calcXP(from, params);
  const nextKillsA   = Math.ceil(nextXP / effectiveXPPerKill);
  const nextKillsO   = Math.ceil(nextXP / (effectiveXPPerKill * OFFLINE_MULT));
  const killsWithout = Math.ceil(journey.totalXP / (monsterXP * ACTIVE_MULT));
  const killsSaved   = killsWithout - journey.killsActive;

  const TABLE_BASE  = [1, 2, 5, 10, 20, 30, 50, 75, 100, 150, 200, 300, 500, 750, 999];
  const tableLevels = [...new Set([...TABLE_BASE, from, to])].sort((a, b) => a - b);

  const PARAM_SLIDERS = [
    { key: "base", label: "BASE", min: 10,    max: 1000, step: 10,    dec: 0, color: C.early },
    { key: "poly", label: "POLY", min: 1.0,   max: 4.0,  step: 0.05,  dec: 2, color: C.mid   },
    { key: "expF", label: "EXP",  min: 1.005, max: 1.15, step: 0.005, dec: 3, color: C.late  },
  ];

  // Which tabs show the sidebar?
  const SIDEBAR_TABS = ["calc", "chart", "modifiers", "elements"];
  const hasSidebar   = SIDEBAR_TABS.includes(tab);

  // ============================================================
  // SIDEBAR CONTENT — varies per tab
  // ============================================================
  function renderSidebar() {
    if (tab === "modifiers") {
      return (
        <aside className="sidebar">
          <ModifierSidebar
            baseVal={modBaseVal} setBaseVal={setModBaseVal}
            flat={modFlat}       setFlat={setModFlat}
            pctAdd={modPctAdd}   setPctAdd={setModPctAdd}
            pctMult={modPctMult} setPctMult={setModPctMult}
          />
        </aside>
      );
    }

    if (tab === "elements") {
      return (
        <aside className="sidebar">
          <ElementSidebar
            atkFire={atkFire}   setAtkFire={setAtkFire}
            physBase={physBase} setPhysBase={setPhysBase}
            physAtk={physAtk}   setPhysAtk={setPhysAtk}
            resIce={resIce}     setResIce={setResIce}
            resFire={resFire}   setResFire={setResFire}
          />
        </aside>
      );
    }

    // calc + chart: standard sidebar
    return (
      <aside className="sidebar">
        {/* Enemy Preset */}
        <div>
          <Label>ENEMY PRESET</Label>
          <select className="styled-select" value={selectedEnemy}
            onChange={e => handleEnemySelect(parseInt(e.target.value))}>
            {ENEMIES.map((enemy, idx) => (
              <option key={idx} value={idx}>
                {enemy.name}{enemy.xp !== null ? `  —  ${fmt(enemy.xp)} XP` : ""}
              </option>
            ))}
          </select>
        </div>

        <NumInput label="MONSTER XP VALUE" value={monsterXP}
          onChange={v => { setMonsterXP(v); setSelectedEnemy(0); }} min={1} max={10000000} />

        <div className="grid-2">
          <NumInput label="CURRENT LVL" value={currentLvl}
            onChange={v => setCurrentLvl(Math.min(v, targetLvl - 1))} min={1} max={998} />
          <NumInput label="TARGET LVL" value={targetLvl}
            onChange={v => setTargetLvl(Math.max(v, currentLvl + 1))} min={2} max={999} />
        </div>

        <hr className="sidebar__divider" />

        {/* Class Modifier */}
        <div>
          <Label>CLASS / ITEM XP MODIFIER</Label>
          <div className="sidebar__modifier-info">
            Multiplies effective XP per kill.<br />
            <span>eff. XP = monsterXP × {classMultiplier.toFixed(2)}</span>
          </div>

          <select className="styled-select styled-select--hi" value={selectedMod}
            onChange={e => {
              const idx = parseInt(e.target.value);
              setSelectedMod(idx);
              if (idx > 0) setCustomMult(CLASS_MODIFIERS[idx].mult);
            }}>
            {CLASS_MODIFIERS.map((m, idx) => (
              <option key={idx} value={idx}>{m.name}  ×{m.mult.toFixed(2)}</option>
            ))}
          </select>

          {selectedMod > 0 && (
            <div className="sidebar__modifier-desc">{activeMod.desc}</div>
          )}

          <div>
            <div className="sidebar__custom-multiplier-header">
              <span className="label-text">CUSTOM MULTIPLIER</span>
              <span className="value-display">×{classMultiplier.toFixed(2)}</span>
            </div>
            <input type="range" min={1.0} max={5.0} step={0.05} value={classMultiplier}
              style={{ accentColor: C.accent }}
              onChange={e => { setCustomMult(parseFloat(e.target.value)); setSelectedMod(0); }} />
            <div className="sidebar__custom-multiplier-range">
              <span>×1.00</span><span>×5.00</span>
            </div>
          </div>

          <div className="sidebar__xp-pill">
            <div className="sidebar__xp-pill-item">
              <div className="pill-label">BASE XP/KILL</div>
              <div className="pill-value">{fmt(monsterXP)}</div>
            </div>
            <div className="sidebar__xp-pill-item">
              <div className="pill-label">EFF. XP/KILL</div>
              <div className="pill-value pill-value--accent">{fmt(effectiveXPPerKill)}</div>
            </div>
          </div>
        </div>

        <hr className="sidebar__divider" />

        <Label>FORMULA PARAMETERS</Label>

        {PARAM_SLIDERS.map(({ key, label, min, max, step, dec, color }) => (
          <div key={key}>
            <div className="sidebar__param-slider-header">
              <span className="param-label">{label}</span>
              <span className="param-value" style={{ color }}>{params[key].toFixed(dec)}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={params[key]}
              style={{ accentColor: color }}
              onChange={e => setParams(p => ({ ...p, [key]: parseFloat(e.target.value) }))} />
            <div className="sidebar__param-slider-range">
              <span>{min}</span><span>{max}</span>
            </div>
          </div>
        ))}

        {/* Quick Preview */}
        <div className="sidebar__quick-preview">
          <Label>QUICK PREVIEW</Label>
          {[
            { lvl: 5,   label: "Lv 5→6",     color: C.early   },
            { lvl: 30,  label: "Lv 30→31",   color: C.mid     },
            { lvl: 100, label: "Lv 100→101", color: C.late    },
            { lvl: 300, label: "Lv 300→301", color: C.endgame },
          ].map(({ lvl, label, color }) => (
            <div key={lvl} className="sidebar__quick-preview-item">
              <span className="preview-label">{label}</span>
              <span className="preview-value" style={{ color }}>
                {fmt(calcXP(lvl, params))} XP
              </span>
            </div>
          ))}
        </div>

        <button className="reset-btn"
          onClick={() => { setParams(DEFAULTS); setSelectedMod(0); setCustomMult(1.0); }}>
          RESET TO DEFAULT
        </button>
      </aside>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="app">

      {/* HEADER */}
      <div className="header-wrapper">
        <header className="header">
          <div>
            <div className="header__subtitle">IDLE GAME SYSTEM</div>
            <h1 className="header__title">XP Formula Builder</h1>
          </div>
          <nav className="header__tabs">
            {[
              { id: "calc",       label: "CALCULATOR" },
              { id: "formula",    label: "FORMULA"    },
              { id: "chart",      label: "CHART"      },
              { id: "attributes", label: "ATTRIBUTES" },
              { id: "modifiers",  label: "STAT MODS"  },
              { id: "elements",   label: "ELEMENTS"   },
            ].map(({ id, label }) => (
              <TabBtn key={id} active={tab === id} onClick={() => setTab(id)}>{label}</TabBtn>
            ))}
          </nav>
        </header>
      </div>

      {/* LAYOUT — conditional sidebar */}
      <div className={`layout${hasSidebar ? "" : " layout--full"}`}>

        {hasSidebar && renderSidebar()}

        {/* MAIN CONTENT */}
        <main className="main">

          {/* ========== CALCULATOR ========== */}
          {tab === "calc" && (
            <>
              <SectionTitle>JOURNEY — LEVEL {from} TO {to}</SectionTitle>

              {classMultiplier > 1.0 && (
                <div className="calc__modifier-banner">
                  <div className="calc__modifier-banner-name">
                    {selectedMod > 0 ? CLASS_MODIFIERS[selectedMod].name : "Custom Modifier"} active
                    &nbsp;—&nbsp;×{classMultiplier.toFixed(2)} XP per kill
                  </div>
                  <div className="calc__modifier-banner-saves">
                    Kills saved vs no modifier:&nbsp;
                    <span>{fmt(killsSaved)}</span>
                    &nbsp;({((1 - 1 / classMultiplier) * 100).toFixed(0)}% fewer kills)
                  </div>
                </div>
              )}

              <div className="calc__stat-cards">
                {[
                  { label: "TOTAL XP NEEDED",   val: fmt(journey.totalXP),  sub: fmtFull(journey.totalXP), color: C.accent },
                  { label: "LEVELS TO GAIN",    val: journey.levels,         sub: `Level ${from} to ${to}`, color: C.text   },
                  { label: "XP FOR NEXT LEVEL", val: fmt(nextXP),            sub: fmtFull(nextXP),          color: C.early  },
                ].map(({ label, val, sub, color }) => (
                  <Card key={label}>
                    <Label>{label}</Label>
                    <div className="calc__stat-card-value" style={{ color }}>{val}</div>
                    <div className="calc__stat-card-sub">{sub}</div>
                  </Card>
                ))}
              </div>

              <SectionTitle>
                FARMING COMPARISON — {fmt(effectiveXPPerKill)} EFF. XP / KILL
                {classMultiplier > 1 ? ` (×${classMultiplier.toFixed(2)})` : ""}
              </SectionTitle>
              <div className="calc__farming-grid">
                <Card style={{ borderColor: C.active + "55" }}>
                  <Label>ACTIVE FARMING — 100% EFFICIENCY</Label>
                  <div className="calc__farming-stats">
                    <div className="calc__farming-stat">
                      <div className="stat-mini-label">NEXT LEVEL</div>
                      <div className="stat-mini-value" style={{ color: C.active }}>{fmt(nextKillsA)}</div>
                      <div className="stat-mini-unit">kills</div>
                    </div>
                    <div className="calc__farming-stat">
                      <div className="stat-mini-label">FULL JOURNEY</div>
                      <div className="stat-mini-value" style={{ color: C.active }}>{fmt(journey.killsActive)}</div>
                      <div className="stat-mini-unit">kills</div>
                    </div>
                  </div>
                  <div className="calc__farming-note">
                    Full XP per kill. Rare drops, boss procs and skill bonuses only available while active. Best for fast milestone runs.
                  </div>
                </Card>

                <Card style={{ borderColor: C.offline + "44" }}>
                  <Label>OFFLINE FARMING — 65% EFFICIENCY</Label>
                  <div className="calc__farming-stats">
                    <div className="calc__farming-stat">
                      <div className="stat-mini-label">NEXT LEVEL</div>
                      <div className="stat-mini-value" style={{ color: C.offline }}>{fmt(nextKillsO)}</div>
                      <div className="stat-mini-unit">kills</div>
                    </div>
                    <div className="calc__farming-stat">
                      <div className="stat-mini-label">FULL JOURNEY</div>
                      <div className="stat-mini-value" style={{ color: C.offline }}>{fmt(journey.killsOffline)}</div>
                      <div className="stat-mini-unit">kills</div>
                    </div>
                  </div>
                  <div className="calc__farming-note">
                    35% XP penalty. No drop bonuses. Steady passive income. Keeps players invested between sessions.
                  </div>
                </Card>
              </div>

              {classMultiplier > 1.0 && (
                <>
                  <SectionTitle>CLASS MODIFIER COMPARISON — FULL JOURNEY</SectionTitle>
                  <Card className="modifier-table card--no-pad">
                    <table className="data-table">
                      <thead>
                        <tr className="data-table__head-row">
                          {["MODIFIER","MULT","EFF. XP/KILL","ACTIVE KILLS","SAVES"].map(h => (
                            <th key={h} className="data-table__th">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {CLASS_MODIFIERS.slice(0, 7).map((m, i) => {
                          const eff      = monsterXP * m.mult;
                          const kills    = Math.ceil(journey.totalXP / (eff * ACTIVE_MULT));
                          const saved    = killsWithout - kills;
                          const isActive = Math.abs(m.mult - classMultiplier) < 0.001;
                          return (
                            <tr key={i}
                              className={`data-table__row data-table__row--${i%2===0?"even":"odd"}`}
                              style={{ background: isActive ? `${C.borderHi}40` : undefined }}>
                              <td className="data-table__td" style={{ fontWeight: isActive ? 700 : 400, color: C.text }}>
                                {m.name}
                                {isActive && <span className="data-table__badge-tag" style={{ color: C.faint }}>← ACTIVE</span>}
                              </td>
                              <td className="data-table__td data-table__td--bold">×{m.mult.toFixed(2)}</td>
                              <td className="data-table__td data-table__td--muted">{fmt(eff)}</td>
                              <td className="data-table__td data-table__td--muted">{fmt(kills)}</td>
                              <td className="data-table__td" style={{ color: saved > 0 ? C.text : C.faint, fontWeight: saved > 0 ? 700 : 400 }}>
                                {saved > 0 ? `-${fmt(saved)}` : "—"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </Card>
                </>
              )}

              {phaseBreakdown.length > 0 && (
                <>
                  <SectionTitle>PHASE BREAKDOWN</SectionTitle>
                  <div className="calc__phase-list">
                    {phaseBreakdown.map(p => {
                      const pct = journey.totalXP > 0 ? (p.xp / journey.totalXP) * 100 : 0;
                      return (
                        <Card key={p.id} className="calc__phase-card">
                          <div className="calc__phase-inner">
                            <div className="calc__phase-info">
                              <div className="phase-label" style={{ color: p.color }}>{p.label}</div>
                              <div className="phase-range">Level {p.start}–{p.end} &nbsp;({p.levels} levels)</div>
                            </div>
                            <div className="calc__phase-stats">
                              {[
                                { lbl: "XP REQUIRED",  val: fmt(p.xp),           color: p.color  },
                                { lbl: "ACTIVE KILLS", val: fmt(p.kills),         color: C.text   },
                                { lbl: "% OF JOURNEY", val: pct.toFixed(1) + "%", color: C.muted  },
                              ].map(({ lbl, val, color }) => (
                                <div key={lbl} className="calc__phase-stat">
                                  <div className="pstat-label">{lbl}</div>
                                  <div className="pstat-value" style={{ color }}>{val}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="calc__phase-bar-track">
                            <div className="calc__phase-bar-fill" style={{ width: `${pct}%`, background: p.color }} />
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </>
              )}

              <SectionTitle>LEVEL REFERENCE TABLE</SectionTitle>
              <Card className="card--no-pad">
                <table className="data-table">
                  <thead>
                    <tr className="data-table__head-row">
                      {["LEVEL","XP THIS LEVEL","ACTIVE KILLS","OFFLINE KILLS","PHASE"].map(h => (
                        <th key={h} className="data-table__th">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableLevels.map((lvl, i) => {
                      const xp     = calcXP(lvl, params);
                      const kA     = Math.ceil(xp / effectiveXPPerKill);
                      const kO     = Math.ceil(xp / (effectiveXPPerKill * OFFLINE_MULT));
                      const ph     = getPhase(lvl);
                      const isMe   = lvl === from;
                      const isGoal = lvl === to;
                      return (
                        <tr key={lvl}
                          className={`data-table__row data-table__row--${i%2===0?"even":"odd"}`}
                          style={{ background: isMe || isGoal ? `${ph.color}0d` : undefined }}>
                          <td className="data-table__td">
                            <span className="data-table__level-badge"
                              style={isMe || isGoal ? { background: ph.color, color: "#000" } : {}}>
                              {lvl}
                            </span>
                            {isMe   && <span className="data-table__badge-tag" style={{ color: C.accent }}>YOU</span>}
                            {isGoal && <span className="data-table__badge-tag" style={{ color: ph.color }}>GOAL</span>}
                          </td>
                          <td className="data-table__td data-table__td--bold">{fmt(xp)}</td>
                          <td className="data-table__td data-table__td--muted">{fmt(kA)}</td>
                          <td className="data-table__td data-table__td--faint">{fmt(kO)}</td>
                          <td className="data-table__td">
                            <span className="data-table__phase-tag"
                              style={{ color: ph.color, background: `${ph.color}18`, border: `1px solid ${ph.color}44` }}>
                              {ph.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            </>
          )}

          {/* ========== FORMULA ========== */}
          {tab === "formula" && (
            <>
              <SectionTitle>FORMULA DETAILS</SectionTitle>
              <Card className="formula__hero mb-20" style={{ borderColor: C.accent + "44" }}>
                <Label>LEVEL XP COST</Label>
                <div className="formula-display">
                  XP(n) = BASE &times; n<sup>POLY</sup> &times; EXP<sup>n</sup>
                </div>
                <div className="formula-live">
                  XP(n) = <span style={{ color: C.early }}>{params.base}</span>
                  &times; n<sup style={{ color: C.mid }}>{params.poly.toFixed(2)}</sup>
                  &times; <span style={{ color: C.late }}>{params.expF.toFixed(3)}</span><sup>n</sup>
                </div>
                {classMultiplier > 1.0 && (
                  <div className="formula-kills">
                    kills = XP(n) ÷ (<span style={{ color: C.text }}>monsterXP × {classMultiplier.toFixed(2)}</span>)
                  </div>
                )}
              </Card>

              <div className="formula__params-grid">
                {[
                  { key: "BASE", val: params.base.toFixed(0), color: C.early,
                    title: "BASE MULTIPLIER",
                    what:   "Sets the absolute XP floor. Level 1→2 costs roughly BASE × EXP.",
                    effect: "Raise to make ALL levels more expensive. Lower to shift the whole curve down.",
                    tip:    "Recommended: 50 — 300" },
                  { key: "POLY", val: params.poly.toFixed(2), color: C.mid,
                    title: "POLYNOMIAL POWER",
                    what:   "Controls early-game ramp shape. Polynomial growth — the n² part.",
                    effect: "2.0 = gentle start. 3.5 = steep early wall. Affects feel of first 50 levels most.",
                    tip:    "Recommended: 1.8 — 2.5" },
                  { key: "EXP",  val: params.expF.toFixed(3), color: C.late,
                    title: "EXPONENTIAL FACTOR",
                    what:   "Applied as EXP^n — multiplies on every level. Dominates at high levels.",
                    effect: "This is the endgame killer. 1.07+ means level 500+ is practically unreachable.",
                    tip:    "Recommended: 1.05 — 1.08" },
                ].map(({ key, val, color, title, what, effect, tip }) => (
                  <Card key={key} style={{ borderColor: color + "44" }}>
                    <div className="formula__param-card-label">{title}</div>
                    <div className="formula__param-card-value" style={{ color }}>{val}</div>
                    <div className="formula__param-card-what">{what}</div>
                    <div className="formula__param-card-effect">{effect}</div>
                    <div className="formula__param-card-tip" style={{ color }}>{tip}</div>
                  </Card>
                ))}
              </div>

              <Card className="mb-20">
                <SectionTitle>PSYCHOLOGICAL DESIGN — WHY THIS FORMULA WORKS</SectionTitle>
                <div className="formula__design-grid">
                  {[
                    { h: "EARLY GAME (Lv 1–25)",  c: C.early,
                      b: "Polynomial term dominates. Players level multiple times per session. Each level-up is a fast dopamine hit. This is where retention is won or lost — the loop must feel rewarding immediately." },
                    { h: "MID GAME (Lv 26–80)",   c: C.mid,
                      b: "Both formula terms balance each other. Progression slows to feel meaningful. Offline farming becomes a real strategy. Community benchmarks form naturally here." },
                    { h: "LATE GAME (Lv 81–200)",  c: C.late,
                      b: "Exponential term takes over. Days or weeks per level. Idle farming pays off. Active players keep a clear efficiency edge through bonuses. Status value of high levels emerges." },
                    { h: "ENDGAME (Lv 201–999)",   c: C.endgame,
                      b: "No cap. EXP^n makes each level exponentially more expensive. 999 exists but is unreachable in practice. This creates prestige without needing seasons or artificial caps." },
                  ].map(({ h, c, b }) => (
                    <div key={h} className="formula__design-item">
                      <div className="design-label" style={{ color: c }}>{h}</div>
                      <div className="design-body">{b}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <SectionTitle>SUGGESTED MONSTER XP FORMULA</SectionTitle>
                <div className="formula__monster-formula">
                  monsterXP(n) = 10 &times; n<sup>1.4</sup> &times; 1.04<sup>n</sup>
                </div>
                <div className="formula__enemy-grid">
                  {ENEMIES.filter(e => e.xp !== null).slice(0, 4).map(({ name, xp }) => {
                    const cols = [C.early, C.mid, C.late, C.endgame];
                    const idx  = ENEMIES.filter(e => e.xp !== null).findIndex(e => e.name === name);
                    const color = cols[Math.min(idx, cols.length - 1)];
                    return (
                      <div key={name} className="formula__enemy-card" style={{ border: `1px solid ${color}33` }}>
                        <div className="enemy-name">{name.trim()}</div>
                        <div className="enemy-xp" style={{ color }}>{fmt(xp)} XP</div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </>
          )}

          {/* ========== CHART ========== */}
          {tab === "chart" && (
            <>
              <div className="chart__header">
                <SectionTitle className="section-title--inline">CURVE VISUALIZATION</SectionTitle>
                <div className="chart__toggle">
                  <TabBtn active={chartMode === "needed"} onClick={() => setChartMode("needed")}>XP PER LEVEL</TabBtn>
                  <TabBtn active={chartMode === "total"}  onClick={() => setChartMode("total") }>CUMULATIVE XP</TabBtn>
                </div>
              </div>

              <Card className="chart__card">
                <ResponsiveContainer width="100%" height={380}>
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="2 5" stroke={C.border} />
                    <XAxis dataKey="level" stroke={C.border} tick={{ fill: C.faint, fontSize: 11 }}
                      label={{ value: "LEVEL", position: "insideBottom", fill: C.faint, fontSize: 11, offset: -10 }} />
                    <YAxis stroke={C.border} tick={{ fill: C.faint, fontSize: 11 }} tickFormatter={v => fmt(v)} width={72} />
                    <Tooltip
                      contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "8px" }}
                      labelStyle={{ color: C.text, fontSize: "12px", fontWeight: 700 }}
                      formatter={v => [fmt(v) + " XP"]}
                      labelFormatter={v => `Level ${v}`}
                    />
                    <ReferenceLine x={from} stroke={C.accent}  strokeDasharray="4 3"
                      label={{ value: "YOU",  fill: C.accent,  fontSize: 10, fontWeight: 700 }} />
                    <ReferenceLine x={to}   stroke={C.endgame} strokeDasharray="4 3"
                      label={{ value: "GOAL", fill: C.endgame, fontSize: 10, fontWeight: 700 }} />
                    {PHASES.map(p => (
                      <ReferenceLine key={p.id} x={p.range[0]} stroke={p.color}
                        strokeDasharray="1 6" strokeOpacity={0.4} />
                    ))}
                    <Line type="monotone" dataKey={chartMode} stroke={C.accent} strokeWidth={2.5}
                      dot={false} activeDot={{ r: 5, fill: C.accent, stroke: C.surface, strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <SectionTitle>XP DISTRIBUTION ACROSS PHASES (Lv 1–999)</SectionTitle>
              {(() => {
                const totalRef = calcRange(1, 999, params);
                return PHASES.map(p => {
                  const xp  = calcRange(p.range[0], Math.min(p.range[1], 999), params);
                  const pct = (xp / totalRef) * 100;
                  return (
                    <div key={p.id} className="chart__phase-bar">
                      <div className="chart__phase-bar-header">
                        <span className="phase-name" style={{ color: p.color }}>
                          {p.label}&nbsp;<span className="phase-range-label">Lv {p.range[0]}–{p.range[1]}</span>
                        </span>
                        <span className="phase-xp">
                          {fmt(xp)} XP &nbsp; <span className="phase-pct">{pct.toFixed(1)}%</span>
                        </span>
                      </div>
                      <div className="chart__phase-bar-track">
                        <div className="chart__phase-bar-fill" style={{ width: `${pct}%`, background: p.color }} />
                      </div>
                    </div>
                  );
                });
              })()}
            </>
          )}

          {/* ========== ATTRIBUTES ========== */}
          {tab === "attributes" && (
            <>
              <SectionTitle>PRIMARY ATTRIBUTES → DERIVED STATS</SectionTitle>
              <Card className="attributes__intro">
                <p>
                  The player distributes <strong>Stat Points (+5 per level)</strong> across 6 primary attributes.
                  Each point automatically increases the derived stats via <code>AttributeScalingRules</code> in the config.
                  Element stats are <strong>only available through gear</strong>, never from attribute points.
                </p>
              </Card>

              <div className="attributes__grid">
                {attributeData.map(({ attr, icon, label, grants }) => (
                  <Card key={attr}>
                    <div className="attributes__card-header">
                      <span className="attr-icon">{icon}</span>
                      <div>
                        <div className="attr-name">{attr}</div>
                        <div className="attr-label">{label}</div>
                      </div>
                    </div>
                    {grants.map(({ stat, formula, example }) => (
                      <div key={stat} className="attributes__grant">
                        <div className="grant-stat">→ {stat}</div>
                        <div className="grant-formula">{formula}</div>
                        <div className="grant-example">{example}</div>
                      </div>
                    ))}
                  </Card>
                ))}
              </div>

              <div className="attributes__tables">
                <Card>
                  <SectionTitle>STAT POINTS PER LEVEL</SectionTitle>
                  {[
                    { level: "Every level", pts: "+5 Stat Points, +1 Skill Point" },
                    { level: "Level 100",   pts: "+5 + 10 BONUS = 15 total"       },
                    { level: "Level 200",   pts: "+5 + 15 BONUS = 20 total"       },
                    { level: "Level 300",   pts: "+5 + 20 BONUS = 25 total"       },
                    { level: "Every ×100",  pts: "+5 + 5 BONUS = 10 total"        },
                  ].map(({ level, pts }) => (
                    <div key={level} className="attributes__table-row">
                      <span className="row-key">{level}</span>
                      <span className="row-val">{pts}</span>
                    </div>
                  ))}
                </Card>
                <Card>
                  <SectionTitle>STARTING VALUES</SectionTitle>
                  {[
                    { label: "Start Stat Points",  val: "5"         },
                    { label: "Start Skill Points", val: "0"         },
                    { label: "Start Gold",         val: "1,000"     },
                    { label: "Max Level",          val: "99"        },
                    { label: "EXP at Max Level",   val: "0 (reset)" },
                  ].map(({ label, val }) => (
                    <div key={label} className="attributes__table-row">
                      <span className="row-key">{label}</span>
                      <span className="row-val">{val}</span>
                    </div>
                  ))}
                </Card>
              </div>
            </>
          )}

          {/* ========== STAT MODIFIERS ========== */}
          {tab === "modifiers" && (
            <>
              <SectionTitle>STAT MODIFIER SYSTEM</SectionTitle>
              <Card className="modifiers__intro">
                <p>
                  All equipment, buff, and debuff bonuses go through the <strong>StatModifier system</strong>.
                  There are 3 types — applied in the correct order. Use the sidebar sliders to interact with the live demo.
                </p>
              </Card>

              <div className="modifiers__type-grid">
                {[
                  { type: "Flat",        icon: "+N",  title: "FLAT BONUS",        desc: "Adds a fixed value. Applied first. Best for equipment with clear stat numbers.",          example: "+50 HP, +15 Damage, +20 Defence" },
                  { type: "PercentAdd",  icon: "%+",  title: "PERCENT ADDITIVE",  desc: "Percentage bonus — multiple PercentAdd modifiers stack additively. Applied second.",      example: "0.1 = +10%  |  0.25 = +25%"     },
                  { type: "PercentMult", icon: "×",   title: "PERCENT MULTIPLIER",desc: "Multiplied at the very end. Stacks multiplicatively. Used for powerful buffs.",           example: "0.2 = ×1.2  |  0.5 = ×1.5"     },
                ].map(({ type, icon, title, desc, example }) => (
                  <Card key={type} className="modifiers__type-card">
                    <div className="type-icon">{icon}</div>
                    <div className="type-title">{title}</div>
                    <div className="type-desc">{desc}</div>
                    <div className="type-example">{example}</div>
                  </Card>
                ))}
              </div>

              <Card>
                <SectionTitle>EXAMPLE — SWORD + STRENGTH BUFF</SectionTitle>
                <div className="modifiers__example">
                  {[
                    { label: "Base Damage (10 + STR 10 × 2)", val: "= 30",        note: "from StatCalculator"   },
                    { label: "+ Flat modifier (sword bonus)",  val: "+15 → 45",    note: "StatModifier.Flat"     },
                    { label: "× (1 + PercentAdd 0.0)",        val: "× 1.0 → 45",  note: "no additive bonus"     },
                    { label: "× (1 + PercentMult 0.2)",       val: "× 1.2 → 54",  note: "strength buff +20%"    },
                  ].map(({ label, val, note }) => (
                    <div key={label} className="modifiers__example-row">
                      <span className="ex-label">{label}</span>
                      <span className="ex-val">{val}</span>
                      <span className="ex-note">{note}</span>
                    </div>
                  ))}
                  <div className="modifiers__example-total">FINAL DAMAGE = 54</div>
                </div>
              </Card>
            </>
          )}

          {/* ========== ELEMENTS ========== */}
          {tab === "elements" && (
            <>
              <SectionTitle>ELEMENT DAMAGE SYSTEM</SectionTitle>
              <Card className="elements__intro">
                <p>
                  Damage runs through <strong>2 separate pipelines</strong>.
                  Physical ignores elemental barriers. Elemental damage is modified by barriers, resistances and a Rock-Paper-Scissors effectiveness system.
                  Use the sidebar sliders to interact with the live demo.
                </p>
              </Card>

              <div className="elements__pipeline-grid">
                {[
                  {
                    title: "⚔️  PHYSICAL PIPELINE",
                    steps: [
                      { n: 1, s: "Base Damage + Physical Attack from equipment" },
                      { n: 2, s: "Apply Physical Resistance (soft cap: max 75% reduction)" },
                      { n: 3, s: "Completely ignores all elemental barriers" },
                    ]
                  },
                  {
                    title: "🔥 ELEMENTAL PIPELINE",
                    steps: [
                      { n: 1, s: "Element Attack value (e.g. Fire Attack: 50)" },
                      { n: 2, s: "× Barrier Multiplier (0.5× – 2.0×) based on total resist" },
                      { n: 3, s: "× Element-specific resistance (soft cap applies)" },
                      { n: 4, s: "× Effectiveness multiplier (Rock-Paper-Scissors)" },
                    ]
                  }
                ].map(({ title, steps }) => (
                  <Card key={title}>
                    <div className="elements__pipeline-title">{title}</div>
                    {steps.map(({ n, s }) => (
                      <div key={n} className="elements__step">
                        <span className="step-num">{n}.</span>
                        <span className="step-text">{s}</span>
                      </div>
                    ))}
                  </Card>
                ))}
              </div>

              <Card>
                <SectionTitle>RESISTANCE SOFT CAP FORMULA</SectionTitle>
                <div className="elements__softcap-grid">
                  {[
                    { input: "25%",  output: "25%",   note: "linear zone"  },
                    { input: "50%",  output: "50%",   note: "breakpoint"   },
                    { input: "75%",  output: "62.5%", note: "diminishing"  },
                    { input: "100%", output: "75%",   note: "hard ceiling" },
                  ].map(({ input, output, note }) => (
                    <div key={input} className="elements__softcap-item">
                      <div className="sc-in">IN: {input}</div>
                      <div className="sc-out">{output}</div>
                      <div className="sc-note">{note}</div>
                    </div>
                  ))}
                </div>
                <div className="elements__formula-block">
                  if (resist &lt;= 50%) → effective = resist<br />
                  if (resist &gt;  50%) → effective = 50 + (resist - 50) × 0.5<br />
                  <span>maximum effective resistance = 75% (never full immunity)</span>
                </div>
              </Card>
            </>
          )}

        </main>
      </div>
    </div>
  );
}