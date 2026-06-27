import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import emailjs from "@emailjs/browser";
import { Analytics } from "@vercel/analytics/next"
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ArrowUp,
  Menu,
  X,
  Download,
  Code2,
  Globe,
  Database,
  Monitor,
  Server,
  Brain,
  BarChart2,
  Settings2,
  Briefcase,
  GraduationCap,
  Zap,
  CheckCircle,
  Send,
} from "lucide-react";

// ── GLOBAL STYLES ─────────────────────────────────────────────────────────────
function GlobalStyles() {
  
  return (
    <style>{`
      .grad-text {
        background: linear-gradient(135deg, #60a5fa 0%, #818cf8 45%, #c084fc 100%);
        background-size: 200% auto;
        animation: gradShift 5s linear infinite;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      @keyframes gradShift {
        from { background-position: 0% center; }
        to   { background-position: 200% center; }
      }
      .glass {
        background: rgba(255,255,255,0.034);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.07);
      }
      .glass-hover:hover {
        border-color: rgba(99,102,241,0.35);
        background: rgba(99,102,241,0.055);
      }
      .blob-1 { animation: b1 18s ease-in-out infinite; }
      .blob-2 { animation: b2 22s ease-in-out infinite 4s; }
      .blob-3 { animation: b3 20s ease-in-out infinite 8s; }
      @keyframes b1 {
        0%,100% { transform: translate(0,0) scale(1); }
        40%     { transform: translate(5%,-7%) scale(1.08); }
        70%     { transform: translate(-4%,5%) scale(0.93); }
      }
      @keyframes b2 {
        0%,100% { transform: translate(0,0) scale(1); }
        40%     { transform: translate(-6%,5%) scale(1.1); }
        70%     { transform: translate(5%,-4%) scale(0.92); }
      }
      @keyframes b3 {
        0%,100% { transform: translate(0,0) scale(1); }
        40%     { transform: translate(4%,-4%) scale(0.95); }
        70%     { transform: translate(-3%,6%) scale(1.07); }
      }
      .mono { font-family: 'JetBrains Mono', 'Courier New', monospace; }
      .section-label {
        font-family: 'JetBrains Mono', 'Courier New', monospace;
        font-size: 0.68rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #818cf8;
      }
      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: #060611; }
      ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 3px; }
    `}</style>
  );
}

// ── HOOKS ─────────────────────────────────────────────────────────────────────
function useTypewriter(words: string[], speed = 90) {
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    const delay = deleting ? 45 : charIdx === word.length ? 2000 : speed;
    const t = setTimeout(() => {
      if (!deleting) {
        if (charIdx < word.length) setCharIdx((c) => c + 1);
        else setDeleting(true);
      } else {
        if (charIdx > 0) setCharIdx((c) => c - 1);
        else { setDeleting(false); setWordIdx((i) => (i + 1) % words.length); }
      }
    }, delay);
    return () => clearTimeout(t);
  }, [words, wordIdx, charIdx, deleting, speed]);

  return words[wordIdx].slice(0, charIdx);
}

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const h = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return p;
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const h = () => {
      const y = window.scrollY + 130;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y && el.offsetTop + el.offsetHeight > y) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, [ids]);
  return active;
}

// ── AMBIENT ───────────────────────────────────────────────────────────────────
function GradientOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="blob-1 absolute -top-[20%] -left-[12%] w-[60vw] h-[60vw] bg-indigo-950/55 rounded-full blur-[140px]" />
      <div className="blob-2 absolute top-[38%] -right-[18%] w-[50vw] h-[50vw] bg-purple-950/45 rounded-full blur-[130px]" />
      <div className="blob-3 absolute -bottom-[12%] left-[22%] w-[42vw] h-[42vw] bg-blue-950/50 rounded-full blur-[120px]" />
    </div>
  );
}

function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; vx: number; vy: number; r: number };
    const pts: P[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.3 + 0.4,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const n = pts.length;
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99,102,241,${0.13 * (1 - d / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(pts[i].x, pts[i].y, pts[i].r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(139,92,246,0.4)";
        ctx.fill();
        pts[i].x += pts[i].vx;
        pts[i].y += pts[i].vy;
        if (pts[i].x < 0 || pts[i].x > canvas.width) pts[i].vx *= -1;
        if (pts[i].y < 0 || pts[i].y > canvas.height) pts[i].vy *= -1;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0 opacity-55" />;
}

function CursorGlow() {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  useEffect(() => {
    const h = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return (
    <div
      className="fixed pointer-events-none z-10"
      style={{
        left: pos.x - 200,
        top: pos.y - 200,
        width: 400,
        height: 400,
        background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)",
        borderRadius: "50%",
        transition: "left 0.06s linear, top 0.06s linear",
      }}
    />
  );
}

function ScrollProgressBar() {
  const p = useScrollProgress();
  return (
    <div
      className="fixed top-0 left-0 z-[100] h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
      style={{ width: `${p}%`, transition: "width 0.1s linear" }}
    />
  );
}

function LoadingScreen({ done }: { done: boolean }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[999] bg-[#060611] flex flex-col items-center justify-center"
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="w-14 h-14 rounded-full border-[3px] border-t-indigo-500 border-r-purple-500 border-b-blue-500 border-l-transparent mb-7"
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-center space-y-2"
          >
            <p className="text-2xl font-extrabold text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>
              Muazzam Ali
            </p>
            <p className="section-label text-indigo-400">Loading portfolio<span className="animate-pulse">...</span></p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 w-11 h-11 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/30 flex items-center justify-center transition-colors"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ── NAVBAR ────────────────────────────────────────────────────────────────────
const NAV_IDS = ["home", "about", "skills", "projects", "experience", "contact"];
const NAV_LABELS: Record<string, string> = {
  home: "Home", about: "About", skills: "Skills",
  projects: "Projects", experience: "Experience", contact: "Contact",
};

function Navbar() {
  const active = useActiveSection(NAV_IDS);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  

  return (
    <header className="fixed top-3 left-0 right-0 z-50 px-4">
      <nav className={`max-w-6xl mx-auto rounded-2xl px-5 py-3.5 flex items-center justify-between transition-all duration-300 ${scrolled ? "glass shadow-xl shadow-black/40" : ""}`}>
        <motion.a href="#home" whileHover={{ scale: 1.04 }} className="flex items-center gap-2.5 select-none">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
            <span className="text-white font-extrabold text-xs" style={{ fontFamily: "'Manrope', sans-serif" }}>MA</span>
          </div>
          <span className="hidden sm:block font-bold text-white text-lg" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Muazzam<span className="text-indigo-400">.</span>
          </span>
        </motion.a>

        <ul className="hidden md:flex items-center gap-0.5">
          {NAV_IDS.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active === id ? "bg-indigo-500/20 text-indigo-300" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {NAV_LABELS[id]}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="mailto:mozambhali521@gmail.com"
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-indigo-500/20"
        >
          <Mail className="w-4 h-4" />
          Hire Me
        </a>

        <button onClick={() => setOpen((v) => !v)} className="md:hidden text-white p-1.5">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16 }}
            className="md:hidden mt-2 max-w-6xl mx-auto glass rounded-2xl px-3 py-3 shadow-2xl"
          >
            {NAV_IDS.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active === id ? "text-indigo-300 bg-indigo-500/15" : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {NAV_LABELS[id]}
              </a>
            ))}
            <div className="mx-4 mt-2 pt-3 border-t border-white/8">
              <a href="mailto:mozambhali521@gmail.com" className="flex items-center gap-2 text-sm text-indigo-400 font-medium">
                <Mail className="w-4 h-4" />mozambhali521@gmail.com
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ── SHARED SECTION HEADER ─────────────────────────────────────────────────────
function SectionHeader({ label, title, description }: { label: string; title: string; description?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="text-center mb-16"
    >
      <span className="section-label">{label}</span>
      <h2 className="text-3xl md:text-[2.6rem] font-extrabold text-white mt-2.5 mb-4 leading-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
        {title}
      </h2>
      {description && <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">{description}</p>}
      <div className="mt-5 h-[3px] w-14 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mx-auto rounded-full" />
    </motion.div>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function CodeWindow() {
  return (
    <div className="glass rounded-2xl overflow-hidden w-full max-w-[370px] shadow-2xl shadow-indigo-500/8">
      <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        <span className="ml-2 text-slate-600 mono text-xs">portfolio.ts</span>
      </div>
      <div className="p-5 mono text-[11px] leading-[1.7] space-y-0">
        <p><span className="text-blue-400">const </span><span className="text-green-400">developer</span><span className="text-slate-300"> = {"{"}</span></p>
        <p><span className="pl-5 text-slate-400">name: </span><span className="text-amber-300">"Muazzam Ali"</span><span className="text-slate-300">,</span></p>
        <p><span className="pl-5 text-slate-400">role: </span><span className="text-amber-300">"CS Student"</span><span className="text-slate-300">,</span></p>
        <p><span className="pl-5 text-slate-400">stack: [</span></p>
        <p><span className="pl-10 text-violet-400">"MERN Stack"</span><span className="text-slate-300">,</span></p>
        <p><span className="pl-10 text-violet-400">"AI / ML"</span><span className="text-slate-300">,</span></p>
        <p><span className="pl-10 text-violet-400">"React"</span><span className="text-slate-300">,</span></p>
        <p><span className="pl-5 text-slate-400">],</span></p>
        <p><span className="pl-5 text-slate-400">cgpa: </span><span className="text-cyan-400">3.45</span><span className="text-slate-300">,</span></p>
        <p><span className="pl-5 text-slate-400">openToWork: </span><span className="text-green-400">true</span></p>
        <p><span className="text-slate-300">{"}"}</span></p>
        <p className="text-green-400 animate-pulse pt-1">&#9612;</p>
      </div>
    </div>
  );
}

function Hero() {
  const typed = useTypewriter([
    "MERN Stack Developer",
    "AI / ML Enthusiast",
    "Full Stack Engineer",
    "React Developer",
    "CS Student @ UON",
  ]);

  const socials = [
    { Icon: Github,   href: "https://github.com/MuazzamAli777",                   label: "GitHub" },
    { Icon: Linkedin, href: "https://www.linkedin.com/in/muazzam-ali-32b6a7376", label: "LinkedIn" },
    { Icon: Mail,     href: "mailto:mozambhali521@gmail.com",                     label: "Email" },
  ];

  return (
    <section id="home" className="min-h-screen flex items-center pt-24 pb-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-6"
          >
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 glass rounded-full text-sm font-medium text-slate-300"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Available for opportunities
            </motion.span>

            <div>
              <p className="text-slate-400 text-lg mb-2">Hi, I&apos;m</p>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold leading-none" style={{ fontFamily: "'Manrope', sans-serif" }}>
                <span className="grad-text">Muazzam Ali</span>
              </h1>
            </div>

            <div className="text-lg md:text-xl text-slate-300 font-medium h-7 flex items-center gap-1">
              <span>{typed}</span>
              <span className="text-indigo-400 animate-pulse">|</span>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-lg">
              Passionate Computer Science student specializing in MERN Stack
              Development, Artificial Intelligence, Machine Learning, and modern web
              technologies. I enjoy building scalable web applications and integrating
              AI into real-world solutions.
            </p>

            <div className="flex flex-wrap gap-3">
              <motion.a
                 href="/Muazzam_Ali_CV.pdf"
  download="Muazzam_Ali_CV.pdf"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow"
              >
                <Download className="w-4 h-4" />
                Download CV
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 glass glass-hover text-slate-200 text-sm font-semibold rounded-xl transition-colors"
              >
                <Mail className="w-4 h-4" />
                Contact Me
              </motion.a>
            </div>

            <div className="flex items-center gap-3 pt-1">
              {socials.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  title={label}
                  className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-300 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
            className="flex flex-col items-center lg:items-end gap-5"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              
              
            </motion.div>

            <motion.div
  animate={{ y: [0, -10, 0] }}
  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
  className="relative"
>
  <div className="w-64 h-64 mt-5 rounded-full p-[3px] bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500">
    <img
      src="/profile photo.png"
      alt="Profile"
      className="w-full h-full rounded-full object-cover"
    />
  </div>

  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-2 border-[#060611] flex items-center justify-center">
    <CheckCircle className="w-4 h-4 text-white" />
  </div>
</motion.div>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
              {["React", "Node.js", "MongoDB", "Python", "AI/ML", "Express"].map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  className="px-3 py-1.5 glass rounded-lg text-xs text-indigo-300 mono"
                >
                  {t}
                </motion.span>
              ))}
            </div>

            <div className="flex gap-3">
              {[{ val: "3.45", label: "CGPA" }, { val: "2+", label: "Projects" }, { val: "1", label: "Internship" }].map((s) => (
                <div key={s.label} className="glass rounded-xl px-4 py-3 text-center">
                  <p className="text-xl font-extrabold text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>{s.val}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="section-label opacity-40">scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-indigo-500 to-transparent" />
      </motion.div>
    </section>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────
function About() {
  const cards = [
    { icon: GraduationCap, label: "BS Computer Science",  sub: "University of Narowal · 2022–2026" },
    { icon: Zap,           label: "CGPA: 3.45",           sub: "Final Year Student" },
    { icon: Code2,         label: "MERN Stack",           sub: "Full Stack Developer" },
    { icon: Brain,         label: "AI / ML",              sub: "Deep Learning Projects" },
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader label="Who I Am" title="About Me" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <p className="text-slate-300 leading-relaxed">
              I&apos;m a final-year Computer Science student at the University of Narowal
              (2022–2026) with a CGPA of 3.45, passionate about building technology that
              makes a real-world impact.
            </p>
            <p className="text-slate-400 leading-relaxed">
              I have a strong foundation in programming with expertise in the MERN Stack,
              Artificial Intelligence, and Machine Learning. Experienced in developing REST
              APIs, managing databases, and integrating AI into full-stack applications.
            </p>
            <p className="text-slate-400 leading-relaxed">
              My passion lies in solving real-world problems through code — from AI-powered
              medical applications to scalable web architectures. Actively seeking international
              opportunities and fully-funded Master&apos;s scholarships in CS and AI.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#contact" className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600/80 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors">
                <Mail className="w-4 h-4" /> Contact Me
              </a>
              <a href="https://github.com/MuazzamAli777" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 glass glass-hover text-slate-300 hover:text-white text-sm font-semibold rounded-xl transition-colors">
                <Github className="w-4 h-4" /> GitHub
              </a>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {cards.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass glass-hover rounded-2xl p-5 space-y-3 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                  <c.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{c.label}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{c.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── EDUCATION ─────────────────────────────────────────────────────────────────
function Education() {
  return (
    <section id="education" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader label="Academic Background" title="Education" />
        <div className="max-w-2xl mx-auto relative pl-12">
          <div className="absolute left-4 top-2 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-purple-500/50 to-transparent" />
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -left-[34px] top-2 w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_14px_rgba(99,102,241,0.8)]" />
            <div className="glass glass-hover rounded-2xl p-7 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <span className="section-label text-indigo-400">2022 — 2026</span>
                  <h3 className="text-xl font-extrabold text-white mt-1" style={{ fontFamily: "'Manrope', sans-serif" }}>
                    Bachelor of Computer Science
                  </h3>
                  <p className="text-purple-400 font-semibold mt-0.5">University of Narowal</p>
                </div>
                <span className="px-3 py-2 bg-indigo-500/15 text-indigo-300 rounded-xl mono text-sm font-semibold">
                  CGPA: 3.45
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Final-year student focused on software engineering, artificial intelligence,
                and web development. Completed multiple projects integrating AI into
                full-stack applications.
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                {["Data Structures", "Algorithms", "AI", "DBMS", "Web Dev", "Machine Learning", "OOP"].map((t) => (
                  <span key={t} className="px-2.5 py-1 bg-white/[0.04] text-slate-400 text-xs rounded-lg">{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── SKILLS ────────────────────────────────────────────────────────────────────
const SKILL_GROUPS = [
  {
    category: "Programming",
    icon: Code2,
    gradient: "from-blue-500 to-cyan-500",
    skills: [{ name: "Python", level: 85 }, { name: "C++", level: 75 }, { name: "JavaScript", level: 90 }],
  },
  {
    category: "Frontend",
    icon: Monitor,
    gradient: "from-purple-500 to-pink-500",
    skills: [{ name: "HTML", level: 95 }, { name: "CSS", level: 90 }, { name: "React", level: 85 }],
  },
  {
    category: "Backend",
    icon: Server,
    gradient: "from-green-500 to-emerald-500",
    skills: [{ name: "Node.js", level: 80 }, { name: "Express.js", level: 80 }],
  },
  {
    category: "Database",
    icon: Database,
    gradient: "from-orange-500 to-amber-500",
    skills: [{ name: "MongoDB", level: 80 }, { name: "SQL", level: 75 }, { name: "Appwrite", level: 70 }, { name: "Firebase", level: 72 }],
  },
  {
    category: "Data Science",
    icon: BarChart2,
    gradient: "from-cyan-500 to-blue-500",
    skills: [{ name: "NumPy", level: 78 }, { name: "Pandas", level: 75 }, { name: "Matplotlib", level: 72 }],
  },
  {
    category: "Artificial Intelligence",
    icon: Brain,
    gradient: "from-violet-500 to-purple-500",
    skills: [{ name: "Machine Learning", level: 75 }, { name: "Deep Learning", level: 70 }],
  },
  {
    category: "Tools",
    icon: Settings2,
    gradient: "from-slate-400 to-zinc-500",
    skills: [{ name: "Git", level: 85 }, { name: "GitHub", level: 85 }, { name: "VS Code", level: 90 }, { name: "XAMPP", level: 75 }],
  },
];

function Skills() {
  return (
    <section id="skills" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="What I Work With"
          title="Skills & Technologies"
          description="Technical proficiency across full-stack development, artificial intelligence, and data science — applied in real projects."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {SKILL_GROUPS.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.07 }}
              whileHover={{ y: -5 }}
              className="glass glass-hover rounded-2xl p-5 space-y-4 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${group.gradient} flex items-center justify-center shrink-0 shadow-md`}>
                  <group.icon className="text-white" style={{ width: 17, height: 17 }} />
                </div>
                <h3 className="font-semibold text-white text-sm leading-snug">{group.category}</h3>
              </div>
              <div className="space-y-3">
                {group.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-slate-300 text-xs font-medium">{skill.name}</span>
                      <span className="text-slate-600 mono text-[10px]">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${group.gradient} rounded-full`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PROJECTS ──────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    title: "Netflix Clone",
    description: "Developed a responsive Netflix landing page clone replicating the original homepage with responsive layouts, navigation bar, hero section, and modern UI.",
    tech: ["HTML", "CSS"],
    liveUrl: "#",
    githubUrl: "#",
    accent: "from-red-600 to-rose-700",
    featured: false,
  },
  {
    title: "Kidney Stone Detection using AI",
    description: "Built an AI-powered web application that detects kidney stones from uploaded medical images. Integrated an AI model for predictions while using Appwrite for authentication, database, and file storage.",
    tech: ["React", "Appwrite", "Artificial Intelligence"],
    liveUrl: null,
    githubUrl: "#",
    accent: "from-indigo-600 to-violet-600",
    featured: true,
  },
];

function Projects() {
  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="What I've Built"
          title="Projects"
          description="Selected projects showcasing AI integration, full-stack architecture, and frontend craftsmanship."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -7 }}
              className="glass glass-hover rounded-2xl overflow-hidden flex flex-col transition-all"
            >
              <div className={`h-[3px] bg-gradient-to-r ${p.accent}`} />
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-extrabold text-white text-lg leading-snug" style={{ fontFamily: "'Manrope', sans-serif" }}>
                    {p.title}
                  </h3>
                  {p.featured && (
                    <span className="shrink-0 px-2 py-0.5 bg-indigo-500/20 text-indigo-300 mono text-[9px] rounded-md uppercase tracking-widest">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed flex-1">{p.description}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span key={t} className="px-2.5 py-1 bg-white/[0.05] text-slate-400 mono text-[10px] rounded-lg">{t}</span>
                  ))}
                </div>
                <div className="flex gap-4 pt-1">
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-indigo-300 hover:text-indigo-200 transition-colors font-medium">
                      <ExternalLink className="w-4 h-4" />Live Demo
                    </a>
                  )}
                  <a href={p.githubUrl ?? "#"} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors font-medium">
                    <Github className="w-4 h-4" />GitHub
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── EXPERIENCE ────────────────────────────────────────────────────────────────
function Experience() {
  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader label="Work History" title="Experience" />
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass glass-hover rounded-2xl p-7 transition-all"
          >
            <div className="flex flex-wrap items-start justify-between gap-5 mb-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>
                    Remote Software Development Intern
                  </h3>
                  <p className="text-indigo-400 font-semibold">Elevvo Pathway</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="px-3 py-1.5 bg-green-500/12 text-green-400 mono text-xs rounded-lg">Remote</span>
                <span className="text-slate-500 mono text-xs">2024</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Completed a remote internship focused on practical software development tasks. Improved
              coding practices, problem-solving skills, GitHub workflow, and gained real-world
              professional experience in a collaborative environment.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Git", "GitHub", "Problem Solving", "Software Development", "Code Review", "Agile"].map((t) => (
                <span key={t} className="px-2.5 py-1 bg-white/[0.05] text-slate-400 text-xs rounded-lg">{t}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── GITHUB STATS ──────────────────────────────────────────────────────────────
function GitHubStats() {
  const u = "MuazzamAli777";
  const statCards = [
    {
      label: "GitHub Stats",
      src: `https://github-readme-stats.vercel.app/api?username=${u}&theme=tokyonight&hide_border=true&show_icons=true&bg_color=0d0d1a&title_color=818cf8&text_color=94a3b8&icon_color=6366f1`,
    },
    {
      label: "Top Languages",
      src: `https://github-readme-stats.vercel.app/api/top-langs/?username=${u}&theme=tokyonight&hide_border=true&layout=compact&bg_color=0d0d1a&title_color=818cf8&text_color=94a3b8`,
    },
    {
      label: "GitHub Streak",
      src: `https://streak-stats.demolab.com?user=${u}&theme=tokyonight&hide_border=true&stroke=818cf8&ring=6366f1&fire=c084fc&currStreakNum=f1f5f9&dates=64748b`,
    },
  ];

  return (
    <section id="github" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Open Source"
          title="GitHub Stats"
          description="Coding activity, language breakdown, and open-source contribution streak."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {statCards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-4 flex flex-col items-center gap-3"
            >
              <p className="section-label text-slate-600">{c.label}</p>
              <img src={c.src} alt={c.label} className="w-full rounded-xl" loading="lazy" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SERVICES ──────────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: Globe,   title: "Web Development",        desc: "Building modern, fast, responsive web apps with clean UI/UX and cross-device performance." },
  { icon: Code2,   title: "Full Stack Development",  desc: "End-to-end MERN stack — database schema design to polished React frontends." },
  { icon: Brain,   title: "AI Integration",          desc: "Integrating ML and deep learning models for intelligent, data-driven features." },
  { icon: Server,  title: "REST API Development",    desc: "Scalable RESTful APIs with Node.js and Express for secure, efficient data exchange." },
  { icon: Monitor, title: "React Applications",      desc: "Performant SPAs with React, hooks, and component-driven architecture." },
];

function Services() {
  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="What I Offer"
          title="Services"
          description="Professional development services for startups, research teams, and enterprise clients."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09 }}
              whileHover={{ y: -6 }}
              className="glass glass-hover rounded-2xl p-6 group transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 flex items-center justify-center mb-5 transition-colors">
                <s.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="font-bold text-white mb-2" style={{ fontFamily: "'Manrope', sans-serif" }}>{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── ACHIEVEMENTS ──────────────────────────────────────────────────────────────
const ACHIEVEMENTS = [
  { icon: GraduationCap, title: "Final Year CS Student",      sub: "University of Narowal · CGPA 3.45",  gradient: "from-blue-500 to-cyan-500" },
  { icon: Briefcase,     title: "Remote Internship Completed", sub: "Elevvo Pathway · 2024",              gradient: "from-indigo-500 to-purple-600" },
  { icon: Brain,         title: "AI Project Development",      sub: "Kidney Stone Detection · AI/ML",    gradient: "from-violet-500 to-fuchsia-600" },
  { icon: Code2,         title: "MERN Stack Developer",        sub: "Full Stack Web Development",        gradient: "from-green-500 to-emerald-600" },
];

function Achievements() {
  return (
    <section id="achievements" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader label="Milestones" title="Achievements" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ACHIEVEMENTS.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass glass-hover rounded-2xl p-6 text-center transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${a.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                <a.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-white text-sm mb-1 leading-snug" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {a.title}
              </h3>
              <p className="text-slate-500 text-xs">{a.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  setSending(true);

  try {
    await emailjs.send(
      "service_lpy998a",
      "template_mbbfbb9",
      {
        from_name: form.name,
        from_email: form.email,
        message: form.message,
      },
      "iuZmKzCg80kxjXnOV"
    );

    setSent(true);

    setForm({
      name: "",
      email: "",
      message: "",
    });

  } catch (error) {
    console.error("Email Error:", error);
    alert("Failed to send message.");
  }

  setSending(false);
}

  const info = [
    { icon: Phone,    label: "Phone",    val: "+92 3420315743",             href: "tel:+923420315743" },
    { icon: Mail,     label: "Email",    val: "mozambhali521@gmail.com",    href: "mailto:mozambhali521@gmail.com" },
    { icon: MapPin,   label: "Address",  val: "Family Gate Near Fortress Stadium, Lahore", href: "#" },
    { icon: Github,   label: "GitHub",   val: "github.com/MuazzamAli777",   href: "https://github.com/MuazzamAli777" },
    { icon: Linkedin, label: "LinkedIn", val: "muazzam-ali-32b6a7376",      href: "https://www.linkedin.com/in/muazzam-ali-32b6a7376" },
  ];

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Get In Touch"
          title="Contact Me"
          description="Have a project in mind or want to collaborate? I'd love to hear from you."
        />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {info.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ x: 5 }}
                className="flex items-start gap-4 glass glass-hover rounded-2xl p-4 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="min-w-0">
                  <p className="section-label text-slate-600">{item.label}</p>
                  <p className="text-slate-200 text-sm mt-0.5 truncate">{item.val}</p>
                </div>
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 glass rounded-2xl p-7"
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  Message Sent!
                </h3>
                <p className="text-slate-400 text-sm">I&apos;ll get back to you within 24 hours.</p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}
                  className="mt-5 text-indigo-400 text-sm hover:text-indigo-300 underline underline-offset-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="section-label text-slate-600 block mb-2">Name</label>
                    <input
                      type="text" placeholder="John Doe" required value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-indigo-500/60 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-700 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="section-label text-slate-600 block mb-2">Email</label>
                    <input
                      type="email" placeholder="john@example.com" required value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-indigo-500/60 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-700 outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="section-label text-slate-600 block mb-2">Message</label>
                  <textarea
                    rows={5} placeholder="Tell me about your project..." required value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-indigo-500/60 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-700 outline-none transition-colors resize-none"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={sending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow disabled:opacity-70 text-sm"
                >
                  {sending ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <><Send className="w-4 h-4" />Send Message</>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-10 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-extrabold text-xs" style={{ fontFamily: "'Manrope', sans-serif" }}>MA</span>
            </div>
            <span className="text-slate-400 text-sm">
              © 2026 <span className="text-white font-semibold">Muazzam Ali</span>
            </span>
          </div>
         {/* <p className="text-slate-500 text-sm">Made with React ❤️</p> */}
          <div className="flex items-center gap-2.5">
            {[
              { Icon: Github,   href: "https://github.com/MuazzamAli777" },
              { Icon: Linkedin, href: "https://www.linkedin.com/in/muazzam-ali-32b6a7376" },
              { Icon: Mail,     href: "mailto:mozambhali521@gmail.com" },
            ].map(({ Icon, href }, i) => (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-500 hover:text-indigo-300 transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <GlobalStyles />
      <LoadingScreen done={loaded} />

      <div className="relative bg-[#060611] min-h-screen text-foreground overflow-x-hidden">
        <GradientOrbs />
        <ParticleCanvas />
        <CursorGlow />
        <ScrollProgressBar />

        <div className="relative z-10">
          <Navbar />
          <main>
            <Hero />
            <About />
            <Education />
            <Skills />
            <Projects />
            <Experience />
            <GitHubStats />
            <Services />
            <Achievements />
            <Contact />
          </main>
          <Footer />
        </div>

        <BackToTop />
      </div>
    </>
  );
}
