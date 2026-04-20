// App.jsx — Future You Generator
// Import your stylesheet in main.jsx: import './App.css' (rename styles.css → App.css)
// or import it here directly: import './styles.css'

import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";

// ─── Data ────────────────────────────────────────────────────────────────────

const SKILLS = [
  { id: "coding",    label: "💻 Coding"   },
  { id: "ai",        label: "🤖 AI/ML"    },
  { id: "design",    label: "🎨 Design"   },
  { id: "writing",   label: "✍️ Writing"  },
  { id: "business",  label: "📈 Business" },
  { id: "marketing", label: "📣 Marketing"},
  { id: "finance",   label: "💰 Finance"  },
  { id: "data",      label: "📊 Data"     },
  { id: "video",     label: "🎬 Video"    },
  { id: "music",     label: "🎵 Music"    },
];

const INTERESTS = [
  { id: "startups",  label: "🚀 Startups"     },
  { id: "gaming",    label: "🎮 Gaming"        },
  { id: "science",   label: "🔬 Science"       },
  { id: "health",    label: "🏋️ Health"       },
  { id: "travel",    label: "✈️ Travel"        },
  { id: "education", label: "📚 Education"     },
  { id: "social",    label: "🤝 Social Impact" },
  { id: "crypto",    label: "⛓️ Web3/Crypto"  },
  { id: "space",     label: "🌌 Space"         },
  { id: "food",      label: "🍜 Food"          },
];

// ─── Prediction Engine ────────────────────────────────────────────────────────

const ROLES = {
  ai: [
    { title: "AI Systems Architect", emoji: "🤖", skills: ["Prompt Engineering", "Neural Networks", "MLOps", "Python", "LangChain"] },
    { title: "AGI Researcher", emoji: "🧠", skills: ["Deep Learning", "Transformers", "Alignment", "PyTorch", "Math"] },
    { title: "AI Product Builder", emoji: "⚡", skills: ["LLMs", "Rapid Prototyping", "User Experience", "APIs", "GTM"] },
    { title: "Applied ML Engineer", emoji: "🔬", skills: ["TensorFlow", "Computer Vision", "NLP", "Data Engineering"] }
  ],
  coding: [
    { title: "Metaverse Staff Engineer", emoji: "💻", skills: ["Rust", "WebAssembly", "System Design", "Distributed Systems"] },
    { title: "Indie Hacker", emoji: "🏴‍☠️", skills: ["Full Stack", "Marketing", "Speed", "Growth", "Product"] },
    { title: "Open Source Maintainer", emoji: "🕊️", skills: ["Community Building", "TypeScript", "Architecture", "Patience"] },
    { title: "Senior Full Stack Dev", emoji: "🚀", skills: ["React", "Node.js", "Databases", "Cloud Architecture"] }
  ],
  design: [
    { title: "Spatial Experience Director", emoji: "🎨", skills: ["3D Design", "Motion Graphics", "Figma 3.0", "AR/VR Interfaces"] },
    { title: "Creative Technologist", emoji: "✨", skills: ["Generative Art", "Shaders", "CSS", "WebGL"] },
    { title: "UX Visionary", emoji: "👁️", skills: ["User Research", "Prototyping", "Design Systems", "Psychology"] }
  ],
  business: [
    { title: "Serial Tech Founder", emoji: "🚀", skills: ["Fundraising", "GTM Strategy", "Team Building", "Pitch Craft"] },
    { title: "Venture Capital Partner", emoji: "💼", skills: ["Deal Sourcing", "Market Analysis", "Networking", "Negotiation"] },
    { title: "Growth Product Manager", emoji: "📈", skills: ["Analytics", "Strategy", "Agile", "User Interviews"] }
  ],
  contentCreator: [
    { title: "Digital Media Mogul", emoji: "🎬", skills: ["Content Strategy", "Video Production", "Personal Brand", "Virality"] },
    { title: "Niche Newsletter Emperor", emoji: "📰", skills: ["Copywriting", "Audience Growth", "Curation", "Monetization"] },
    { title: "EdTech Creator", emoji: "🎓", skills: ["Course Design", "Public Speaking", "Community", "Writing"] }
  ],
  dataWizard: [
    { title: "Chief Data Alchemist", emoji: "📊", skills: ["Data Storytelling", "Predictive Modeling", "SQL++", "Tableau"] },
    { title: "Quantitative Analyst", emoji: "📈", skills: ["Statistics", "Python", "Algorithms", "Financial Math"] },
    { title: "AI Data Strategist", emoji: "🧠", skills: ["Data Governance", "Big Data", "Spark", "Ethics"] }
  ],
  financeGuru: [
    { title: "DeFi Protocol Architect", emoji: "🏦", skills: ["Smart Contracts", "Solidity", "Tokenomics", "Cryptography"] },
    { title: "Algorithmic Trader", emoji: "💹", skills: ["High Frequency Trading", "C++", "Market Microstructure", "Math"] },
    { title: "FinTech Founder", emoji: "💸", skills: ["Compliance", "Payments", "Product", "Fundraising"] }
  ],
  marketingGenius: [
    { title: "Growth Hacking Evangelist", emoji: "📣", skills: ["Performance Marketing", "AI Ads", "Conversion Science", "Analytics"] },
    { title: "Viral Campaign Director", emoji: "🔥", skills: ["Trend Forecasting", "Social Media", "Memetics", "Community"] },
    { title: "Brand Alchemist", emoji: "✨", skills: ["Storytelling", "Positioning", "Design", "Psychology"] }
  ],
  writer: [
    { title: "Thought Leadership Oracle", emoji: "✍️", skills: ["Long-form Essays", "Ghost Writing", "AI-Assisted Research", "Book Deals"] },
    { title: "Sci-Fi Visionary", emoji: "🛸", skills: ["Worldbuilding", "Storytelling", "Imagination", "Publishing"] },
    { title: "Technical Wordsmith", emoji: "💻", skills: ["Documentation", "API Design", "Clarity", "Developer Relations"] }
  ],
  default: [
    { title: "Future Innovation Specialist", emoji: "🔮", skills: ["Adaptability", "Continuous Learning", "Problem Solving", "Strategy"] },
    { title: "Tech Renaissance Person", emoji: "🌟", skills: ["Cross-domain Knowledge", "Rapid Skill Acquisition", "Curiosity"] }
  ]
};

const SALARY_RANGES = {
  beginner: { range: "₹3L – ₹6L", note: "Keep grinding! ☕" },
  intermediate: { range: "₹8L – ₹15L", note: "Comfortable zone 🎯" },
  advanced: { range: "₹20L – ₹40L", note: "Elite tier 🔥" },
  elite: { range: "₹50L – ₹1Cr+", note: "You broke the chart 📈" },
};

const RARITIES = [
  { level: "Common", color: "#a1a1aa", threshold: 0.5 },    // 50%
  { level: "Rare", color: "#3b82f6", threshold: 0.8 },      // 30%
  { level: "Epic", color: "#a855f7", threshold: 0.95 },     // 15%
  { level: "Legendary", color: "#f59e0b", threshold: 1.0 }  // 5%
];

const FUN_MESSAGES = [
  "LinkedIn followers will call you 'visionary' unironically.",
  "You'll get 3 unsolicited acquisition offers at a coffee shop.",
  "People will cite your tweets in academic papers.",
  "A 22-year-old will call your work 'classic'.",
  "You'll accidentally become famous in a country you've never visited.",
  "Your old boss will try to recruit you back.",
  "Someone will write a Medium article about how you changed their life.",
  "You'll keynote a conference you used to watch on YouTube.",
  "Your mom will finally understand what you do.",
  "A VC will DM you first.",
  "You will forget what weekends are 😭",
  "Coffee becomes your best friend ☕",
  "People will start asking YOU for advice 😎",
  "You accidentally build a startup 🚀",
  "Your GitHub becomes your personality 😂"
];

const ROAST_MESSAGES = [
  "You'll still have 11 unread courses on Udemy by 2028.",
  "Your 'side project' folder has 47 abandoned repos.",
  "You'll confidently say 'let's circle back' in meetings.",
  "You'll use 'AI-powered' to describe things that aren't AI.",
  "Your Notion workspace has 200 pages and zero done tasks.",
  "You'll spend 3 hours picking the right font for a personal site.",
  "You'll optimize your morning routine instead of sleeping.",
  "Your Figma canvas is wider than the observable universe.",
];

const ACHIEVEMENTS = [
  "First 10K followers on an obscure platform",
  "Featured in a newsletter you've never heard of",
  "Shipped something people actually paid for",
  "Survived a 48-hour hackathon without coffee",
  "Got a star from someone you admire on GitHub",
  "Turned a weekend project into a business",
  "Gave a talk without once saying 'um' more than 30 times",
  "Hired your first contractor",
  "Reached $1K/month passive income",
  "Wrote something that went viral (in a good way)",
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickN = (arr, n) => [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const formatSalary = (num) => "$" + num.toLocaleString();

function getRandomRarity() {
  const rand = Math.random();
  return RARITIES.find(r => rand <= r.threshold);
}

function predictFuture(skills, interests, effort, mode) {
  const s = new Set(skills);
  const i = new Set(interests);

  let roleCategory = "default";
  
  if ((s.has("ai") && s.has("coding")) || i.has("science")) roleCategory = "ai";
  else if (s.has("coding") || i.has("gaming")) roleCategory = "coding";
  else if (s.has("design")) roleCategory = "design";
  else if (s.has("business") || i.has("startups")) roleCategory = "business";
  else if (s.has("video") || s.has("music")) roleCategory = "contentCreator";
  else if (s.has("data")) roleCategory = "dataWizard";
  else if (s.has("finance") || i.has("crypto")) roleCategory = "financeGuru";
  else if (s.has("marketing") || i.has("social")) roleCategory = "marketingGenius";
  else if (s.has("writing") || i.has("education")) roleCategory = "writer";

  const role = pick(ROLES[roleCategory]);

  let level = "beginner";
  if (effort >= 8) level = "elite";
  else if (effort >= 6) level = "advanced";
  else if (effort >= 4) level = "intermediate";

  const salaryData = SALARY_RANGES[level];
  const rarity = getRandomRarity();
  const confidence = randomInt(60, 100);

  return {
    role,
    rarity,
    salary: {
      range: salaryData.range,
      note: salaryData.note
    },
    message: mode === "fun" ? pick(FUN_MESSAGES) : `With ${effort}h/day of focused work, you're on track to become one of the top 5% in your field.`,
    roast: mode === "fun" ? pick(ROAST_MESSAGES) : null,
    achievements: pickN(ACHIEVEMENTS, 3),
    skills: pickN(role.skills, Math.min(4, role.skills.length)),
    confidence
  };
}

// ─── Particle Canvas Background ───────────────────────────────────────────────

function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    let animId;
    let W, H;

    const particles = Array.from({ length: 80 }, () => ({
      x:     Math.random() * 1920,
      y:     Math.random() * 1080,
      r:     Math.random() * 1.5 + 0.3,
      vx:    (Math.random() - 0.5) * 0.3,
      vy:    (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.6 + 0.1,
      hue:   Math.random() > 0.5 ? 190 : 280,
    }));

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha})`;
        ctx.fill();
      }

      // Constellation lines
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx   = particles[a].x - particles[b].x;
          const dy   = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = `rgba(120,220,255,${0.06 * (1 - dist / 100)})`;
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}

// ─── Tag Selector ─────────────────────────────────────────────────────────────

function TagSelector({ items, selected, onToggle, color }) {
  return (
    <div className="tag-list">
      {items.map((item) => {
        const isSelected = selected.includes(item.id);
        const cls = isSelected
          ? `tag-btn ${color}-selected`
          : `tag-btn ${color}-unselected`;
        return (
          <button key={item.id} className={cls} onClick={() => onToggle(item.id)}>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Loading Card ─────────────────────────────────────────────────────────────

function LoadingCard() {
  const steps = [
    "Scanning your neural pathways...",
    "Simulating 10,000 timelines...",
    "Consulting the quantum oracle...",
    "Compiling your destiny matrix...",
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="loading-card">
      <div className="spinner-wrap">
        <div className="ring-outer" />
        <div className="ring-inner" />
        <div className="ring-emoji">🔮</div>
      </div>
      <div className="loading-title">Analyzing Your Future...</div>
      <div className="loading-step">{steps[step]}</div>
      <div className="loading-dots">
        <div className="loading-dot" />
        <div className="loading-dot" />
        <div className="loading-dot" />
      </div>
    </div>
  );
}

// ─── Result Card ──────────────────────────────────────────────────────────────

function ResultCard({ result, mode }) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  const downloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0a0a1e",
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Future-You-${result.role.title.replace(/\s+/g, "-")}.png`;
      link.click();
    } catch (err) {
      console.error("Failed to capture image", err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `I just used Future You Generator and discovered I'll be a ${result.role.title} by 2028, earning ${result.salary.range}! 🚀`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="result-wrap">
      <div className="result-card" ref={cardRef}>
        {/* Ambient glows */}
        <div className="result-glow-tr" />
        <div className="result-glow-bl" />

        {/* Header */}
        <div className="result-header">
          <div className="result-badge">◆ PREDICTION COMPLETE ◆</div>
          <div className="result-rarity" style={{ color: result.rarity.color, borderColor: result.rarity.color }}>
            {result.rarity.level} Destiny
          </div>
          <div className="result-year">🚀 Future You — Year 2028</div>

          <div className="result-avatar">{result.role.emoji}</div>
          <div className="result-role-title">{result.role.title}</div>

          {/* Confidence bar */}
          <div className="confidence-row">
            <span className="confidence-label">CONFIDENCE</span>
            <div className="confidence-track">
              <div
                className="confidence-fill"
                style={{ width: `${result.confidence}%` }}
              />
            </div>
            <span className="confidence-value">{result.confidence}%</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="stats-grid">
          {/* Salary */}
          <div className="stat-box">
            <div className="stat-box-label">EARNINGS</div>
            <div className="salary-value" style={{ color: "#34d399", textShadow: "0 0 10px rgba(52, 211, 153, 0.4)" }}>
              {result.salary.range}
            </div>
            <div className="salary-note">
              <span style={{ fontSize: "10px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>per year</span> <br/>
              {result.salary.note}
            </div>
          </div>

          {/* Skills */}
          <div className="stat-box">
            <div className="stat-box-label">SKILLS UNLOCKED</div>
            {result.skills.map((s) => (
              <div key={s} className="skill-item">
                <span className="skill-arrow">▸</span> {s}
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="achievements-box">
          <div className="stat-box-label">🏆 ACHIEVEMENTS UNLOCKED</div>
          {result.achievements.map((a, i) => (
            <div key={i} className="achievement-item">
              <div className="achievement-check">✓</div>
              <span className="achievement-text">{a}</span>
            </div>
          ))}
        </div>

        {/* Oracle message */}
        <div className="oracle-box">
          <div className="oracle-label">💬 ORACLE SPEAKS</div>
          <p className="oracle-text">{result.message}</p>
        </div>

        {/* Roast (fun mode only) */}
        {mode === "fun" && result.roast && (
          <div className="roast-box">
            <div className="roast-label">😂 BUT ALSO...</div>
            <p className="roast-text">{result.roast}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="result-actions">
          <button className="action-btn-green" onClick={downloadImage}>
            📸 Download
          </button>
          <button className="action-btn-cyan" onClick={handleShare}>
            {copied ? "✓ Copied!" : "📋 Share Result"}
          </button>
          <button
            className="action-btn-purple"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            🔮 Predict Again
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [skills,    setSkills]    = useState([]);
  const [interests, setInterests] = useState([]);
  const [effort,    setEffort]    = useState(5);
  const [mode,      setMode]      = useState("fun");
  const [phase,     setPhase]     = useState("idle"); // "idle" | "loading" | "result"
  const [result,    setResult]    = useState(null);

  const toggleSkill    = (id) => setSkills((p)    => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const toggleInterest = (id) => setInterests((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const canSubmit = skills.length > 0 || interests.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setPhase("loading");
    setTimeout(() => {
      setResult(predictFuture(skills, interests, effort, mode));
      setPhase("result");
    }, 2800);
  };

  const handleReset = () => {
    setPhase("idle");
    setResult(null);
  };

  return (
    <>
      {/* Fixed background layers */}
      <div className="app-bg" />
      <ParticleField />

      {/* Scrollable content */}
      <div className="app-content">
        <div className="container">

          {/* ── Hero ── */}
          <header className="hero">
            <div className="hero-badge">
              <span className="badge-dot" />
              AI PREDICTION ENGINE v2.8
            </div>
            <h1 className="hero-title">
              Future You
              <br />
              Generator
            </h1>
            <p className="hero-tagline">
              See who you become&nbsp;🚀
            </p>
          </header>

          {/* ── Form Phase ── */}
          {phase === "idle" && (
            <div className="form-area">

              {/* Mode toggle */}
              <div className="glass-card">
                <div className="section-label">⚙ Mode</div>
                <div className="mode-toggle">
                  <button
                    className={`mode-btn ${mode === "fun" ? "active-mode" : "inactive-mode"}`}
                    onClick={() => setMode("fun")}
                  >
                    😂 Fun Mode
                  </button>
                  <button
                    className={`mode-btn ${mode === "serious" ? "active-mode" : "inactive-mode"}`}
                    onClick={() => setMode("serious")}
                  >
                    🎯 Serious Mode
                  </button>
                </div>
              </div>

              {/* Skills */}
              <div className="glass-card">
                <div className="section-label">🧠 Your Skills</div>
                <TagSelector
                  items={SKILLS}
                  selected={skills}
                  onToggle={toggleSkill}
                  color="cyan"
                />
              </div>

              {/* Interests */}
              <div className="glass-card">
                <div className="section-label">🔥 Your Interests</div>
                <TagSelector
                  items={INTERESTS}
                  selected={interests}
                  onToggle={toggleInterest}
                  color="purple"
                />
              </div>

              {/* Effort slider */}
              <div className="glass-card">
                <div className="section-label">⚡ Daily Effort</div>
                <div className="effort-row">
                  <span className="effort-label">Hours per day</span>
                  <span className="effort-value">{effort}h</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={effort}
                  onChange={(e) => setEffort(Number(e.target.value))}
                />
                <div className="slider-hints">
                  <span className="slider-hint">😴 Casual (1h)</span>
                  <span className="slider-hint">🔥 Obsessed (10h)</span>
                </div>
              </div>

              {/* CTA */}
              <button
                className={`predict-btn ${canSubmit ? "active" : "disabled"}`}
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                {canSubmit ? "🔮 Predict My Future" : "Select skills or interests first"}
              </button>

              {!canSubmit && (
                <p className="hint-text">Pick at least one skill or interest to begin</p>
              )}
            </div>
          )}

          {/* ── Loading Phase ── */}
          {phase === "loading" && <LoadingCard />}

          {/* ── Result Phase ── */}
          {phase === "result" && result && (
            <div className="result-group">
              <ResultCard result={result} mode={mode} />
              <button className="start-over-btn" onClick={handleReset}>
                ← Start Over
              </button>
            </div>
          )}

          {/* Footer */}
          <footer className="footer">
            FUTURE YOU GENERATOR &nbsp;·&nbsp; POWERED BY QUANTUM SPECULATION™
          </footer>

        </div>
      </div>
    </>
  );
}
