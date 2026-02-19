import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink, Atom, Zap, Waves } from 'lucide-react';

interface Props {sections: LinkSection[];visible: boolean;}

const Q_COLORS = ['#38bdf8', '#a78bfa', '#34d399', '#f472b6', '#fbbf24', '#fb923c'];

/* ─── Quantum Canvas Background ─── */
const QuantumCanvas = ({ w, h }: {w: number;h: number;}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useRef(0);
  const tick = useRef(0);

  useEffect(() => {
    const c = ref.current;if (!c) return;
    const ctx = c.getContext('2d');if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = w * dpr;c.height = h * dpr;ctx.scale(dpr, dpr);

    // Generate static qubits once
    const qubits: {x: number;y: number;phase: number;speed: number;radius: number;hue: number;}[] = [];
    for (let i = 0; i < 30; i++) {
      qubits.push({
        x: Math.random() * w,
        y: Math.random() * h,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.8,
        radius: 8 + Math.random() * 16,
        hue: i * 37 % 360
      });
    }

    // Entanglement pairs
    const pairs: [number, number][] = [];
    for (let i = 0; i < 12; i++) {
      const a = Math.floor(Math.random() * qubits.length);
      let b = Math.floor(Math.random() * qubits.length);
      if (b === a) b = (a + 1) % qubits.length;
      pairs.push([a, b]);
    }

    const draw = () => {
      tick.current += 0.006;
      const t = tick.current;
      ctx.fillStyle = 'rgba(4,6,18,0.08)';
      ctx.fillRect(0, 0, w, h);

      // Entanglement lines
      for (const [a, b] of pairs) {
        const qa = qubits[a],qb = qubits[b];
        const pulse = Math.sin(t * 3 + a) * 0.5 + 0.5;
        ctx.strokeStyle = `hsla(${(qa.hue + qb.hue) / 2},60%,60%,${0.02 + pulse * 0.03})`;
        ctx.lineWidth = 0.5;
        ctx.setLineDash([3, 6]);
        ctx.beginPath();
        ctx.moveTo(qa.x, qa.y);
        // Curved entanglement
        const mx = (qa.x + qb.x) / 2 + Math.sin(t * 2 + a) * 30;
        const my = (qa.y + qb.y) / 2 + Math.cos(t * 2 + b) * 30;
        ctx.quadraticCurveTo(mx, my, qb.x, qb.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Qubits — Bloch sphere style
      for (const q of qubits) {
        const angle = t * q.speed + q.phase;
        const breathe = 1 + Math.sin(t * 2 + q.phase) * 0.15;
        const r = q.radius * breathe;

        // Outer glow
        const glow = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, r * 2);
        glow.addColorStop(0, `hsla(${q.hue},70%,60%,0.04)`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();ctx.arc(q.x, q.y, r * 2, 0, Math.PI * 2);ctx.fill();

        // Sphere outline
        ctx.strokeStyle = `hsla(${q.hue},60%,60%,0.08)`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();ctx.arc(q.x, q.y, r, 0, Math.PI * 2);ctx.stroke();

        // Equator ring (tilted)
        ctx.save();
        ctx.translate(q.x, q.y);
        ctx.rotate(angle * 0.3);
        ctx.strokeStyle = `hsla(${q.hue},60%,65%,0.06)`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // State vector arrow
        const sx = q.x + Math.cos(angle) * r * 0.7;
        const sy = q.y + Math.sin(angle) * r * 0.7;
        ctx.strokeStyle = `hsla(${q.hue},80%,70%,0.15)`;
        ctx.lineWidth = 1;
        ctx.beginPath();ctx.moveTo(q.x, q.y);ctx.lineTo(sx, sy);ctx.stroke();

        // Tip dot
        ctx.fillStyle = `hsla(${q.hue},80%,75%,0.3)`;
        ctx.beginPath();ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);ctx.fill();
      }

      // Quantum gate grid lines
      for (let y = 60; y < h; y += 80) {
        const wobble = Math.sin(t + y * 0.01) * 10;
        ctx.strokeStyle = `rgba(56,189,248,${0.015 + Math.sin(t * 2 + y * 0.02) * 0.005})`;
        ctx.lineWidth = 0.3;
        ctx.beginPath();
        ctx.moveTo(0, y + wobble);
        for (let x = 0; x < w; x += 5) {
          ctx.lineTo(x, y + Math.sin(t + x * 0.02 + y) * 3 + wobble);
        }
        ctx.stroke();
      }

      frame.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame.current);
  }, [w, h]);

  return <canvas data-ev-id="ev_d1e5d426bd" ref={ref} style={{ width: w, height: h }} className="absolute inset-0 pointer-events-none" aria-hidden="true" />;
};

/* ─── Qubit Card ─── */
const QubitCard = ({ link, sIdx, lIdx, delay, isActive, onHover


}: {link: LinkItem;sIdx: number;lIdx: number;delay: number;isActive: boolean;onHover: (id: string | null) => void;}) => {
  const [show, setShow] = useState(false);
  const color = Q_COLORS[sIdx % Q_COLORS.length];
  useEffect(() => {const t = setTimeout(() => setShow(true), delay);return () => clearTimeout(t);}, [delay]);

  // Deterministic quantum "state" from link id
  const seed = link.id.charCodeAt(0) + link.id.charCodeAt(link.id.length - 1);
  const prob0 = 20 + seed % 60;
  const prob1 = 100 - prob0;
  const coherence = 70 + seed % 30;
  const gateType = ['H', 'X', 'Y', 'Z', 'CNOT', 'T', 'S', 'RX', 'RY'][seed % 9];
  const state = prob0 > 50 ? '|0⟩' : prob1 > 60 ? '|1⟩' : '|ψ⟩';

  return (
    <a data-ev-id="ev_813da27f15" href={link.url} target="_blank" rel="noopener noreferrer"
    aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
    onMouseEnter={() => onHover(link.id)} onMouseLeave={() => onHover(null)}
    className={`block rounded-xl transition-all duration-500 group focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none ${
    show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${
    isActive ? 'scale-[1.03]' : 'hover:scale-[1.01]'}`}
    style={{
      background: 'rgba(6,8,22,0.75)',
      border: `1px solid ${isActive ? color + '30' : color + '08'}`,
      backdropFilter: 'blur(8px)',
      boxShadow: isActive ? `0 0 30px ${color}0c, inset 0 0 15px ${color}04` : 'none'
    }}>
      <div data-ev-id="ev_012ca6f2f7" className="p-3.5">
        {/* Top: icon + title + gate badge */}
        <div data-ev-id="ev_5e58818074" className="flex items-center gap-2.5">
          <div data-ev-id="ev_17f54f05a8" className="relative w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: `radial-gradient(circle, ${color}10, transparent)`, border: `1px solid ${color}15` }}>
            <AnimatedIcon icon={link.icon} animation={link.animation} color={color} size={17} />
            {/* Spinning ring */}
            <div data-ev-id="ev_ab6a046ebd" className="absolute inset-[-3px] rounded-full opacity-30" style={{
              border: `1px dashed ${color}25`,
              animation: `spin ${6 + lIdx}s linear infinite${lIdx % 2 === 0 ? ' reverse' : ''}`
            }} />
          </div>
          <div data-ev-id="ev_9aa9e9a714" className="flex-1 min-w-0">
            <div data-ev-id="ev_bf721a32cf" className="flex items-center gap-1.5">
              <h3 data-ev-id="ev_bc285d7f70" className="text-[11px] font-bold truncate" style={{ color: color + 'dd' }}>{link.title}</h3>
              <span data-ev-id="ev_45d7039871" className="flex-shrink-0 px-1 py-px rounded text-[7px] font-mono font-bold"
              style={{ color, backgroundColor: color + '12', border: `1px solid ${color}18` }}>
                {gateType}
              </span>
            </div>
            <p data-ev-id="ev_84f90ec02c" className="text-[9px] truncate" style={{ color: 'rgba(167,139,250,0.25)' }}>{link.subtitle}</p>
          </div>
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0" style={{ color }} />
        </div>

        {/* Probability bars */}
        <div data-ev-id="ev_9b319325fd" className="mt-3 space-y-1.5">
          <div data-ev-id="ev_13e45cef2f" className="flex items-center gap-2">
            <span data-ev-id="ev_02d4d1acde" className="text-[8px] font-mono font-bold w-4" style={{ color: '#38bdf880' }}>|0⟩</span>
            <div data-ev-id="ev_e54e464155" className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(56,189,248,0.06)' }}>
              <div data-ev-id="ev_2c95b0c480" className="h-full rounded-full transition-all duration-700" style={{
                width: `${prob0}%`,
                background: `linear-gradient(90deg, #38bdf850, #38bdf820)`
              }} />
            </div>
            <span data-ev-id="ev_7c56aaeee0" className="text-[7px] font-mono" style={{ color: '#38bdf830' }}>{prob0}%</span>
          </div>
          <div data-ev-id="ev_b565b4cb3a" className="flex items-center gap-2">
            <span data-ev-id="ev_e6de1b0554" className="text-[8px] font-mono font-bold w-4" style={{ color: '#a78bfa80' }}>|1⟩</span>
            <div data-ev-id="ev_660bb9d5d0" className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(167,139,250,0.06)' }}>
              <div data-ev-id="ev_fe7d1f0057" className="h-full rounded-full transition-all duration-700" style={{
                width: `${prob1}%`,
                background: `linear-gradient(90deg, #a78bfa50, #a78bfa20)`
              }} />
            </div>
            <span data-ev-id="ev_0aa76b0f64" className="text-[7px] font-mono" style={{ color: '#a78bfa30' }}>{prob1}%</span>
          </div>
        </div>

        {/* Bottom stats */}
        <div data-ev-id="ev_d68f34cce5" className="mt-2.5 flex items-center justify-between pt-2" style={{ borderTop: `1px solid ${color}08` }}>
          <div data-ev-id="ev_bfd9870647" className="flex items-center gap-1">
            <div data-ev-id="ev_3e5fb3ce1e" className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: coherence > 85 ? '#34d39960' : coherence > 70 ? '#fbbf2460' : '#f4724460' }} />
            <span data-ev-id="ev_df9290142c" className="text-[7px] font-mono" style={{ color: color + '30' }}>COHERENCE {coherence}%</span>
          </div>
          <span data-ev-id="ev_d2eefc57f8" className="text-[9px] font-mono font-bold" style={{ color: color + '50' }}>{state}</span>
          <span data-ev-id="ev_34297ab17d" className="text-[7px] font-mono" style={{ color: color + '20' }}>
            {link.tag === 'free' ? 'OPEN' : link.tag === 'deal' ? '⚡ SUPER' : 'STD'}
          </span>
        </div>
      </div>
    </a>);

};

/* ─── Main View ─── */
export const QuantumView = ({ sections, visible }: Props) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const containerRef = useRef<HTMLDivElement>(null);
  const total = sections.reduce((a, s) => a + s.links.length, 0);

  const handleResize = useCallback(() => {
    if (containerRef.current) {
      const r = containerRef.current.getBoundingClientRect();
      setSize((prev) => {
        const newW = r.width;
        const newH = Math.max(600, r.height);
        if (prev.w === newW && prev.h === newH) return prev;
        return { w: newW, h: newH };
      });
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    handleResize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [handleResize, sections.length]);

  return (
    <div data-ev-id="ev_c735140c40" className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div data-ev-id="ev_38f1a08db1" ref={containerRef}
      className="mx-auto max-w-5xl rounded-2xl overflow-hidden border relative"
      style={{
        background: 'linear-gradient(170deg, #04061a 0%, #080c24 40%, #06081c 100%)',
        borderColor: 'rgba(56,189,248,0.06)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(56,189,248,0.04)',
        minHeight: 600
      }}>

        <QuantumCanvas w={size.w} h={size.h} />

        {/* ── Header ── */}
        <div data-ev-id="ev_e0d9ec2456" className="relative z-10 flex items-center justify-between px-5 py-3.5 border-b"
        style={{ borderColor: 'rgba(56,189,248,0.05)', background: 'rgba(4,6,26,0.4)' }}>
          <div data-ev-id="ev_ee8ba18a3f" className="flex items-center gap-3">
            <div data-ev-id="ev_896944542a" className="relative">
              <Atom className="w-5 h-5 text-sky-400/50" />
              <div data-ev-id="ev_fe13d668dc" className="absolute inset-[-4px] rounded-full border border-dashed border-sky-400/10 animate-[spin_10s_linear_infinite]" />
            </div>
            <div data-ev-id="ev_225bcf3680">
              <span data-ev-id="ev_4cc214271a" className="text-sky-200/80 text-[13px] font-mono font-bold tracking-[0.2em]">QUANTUM COMPUTER</span>
              <span data-ev-id="ev_92de101af0" className="text-sky-400/20 text-[9px] font-mono block tracking-wider">CRYOGENIC LAB • 15 mK • SUPERCONDUCTING</span>
            </div>
          </div>
          <div data-ev-id="ev_2dc2213fae" className="flex items-center gap-5 text-[10px] font-mono text-sky-400/25">
            <span data-ev-id="ev_2172f2f186" className="flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5" />
              <span data-ev-id="ev_2f4c924f78">SUPERPOSITION</span>
            </span>
            <span data-ev-id="ev_6b1d466eef" className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span data-ev-id="ev_26828dcc34">{total} QUBITS</span>
            </span>
          </div>
        </div>

        {/* ── Quantum Circuits (sections) ── */}
        <div data-ev-id="ev_c179d2d008" className="relative z-10 p-5 space-y-7">
          {sections.map((section, sIdx) => {
            const color = Q_COLORS[sIdx % Q_COLORS.length];
            return (
              <div data-ev-id="ev_037d951469" key={section.id}>
                {/* Circuit header */}
                <div data-ev-id="ev_fa331923f9" className="flex items-center gap-2.5 mb-4">
                  {/* Circuit number — Bloch sphere mini */}
                  <div data-ev-id="ev_cb546624cc" className="w-7 h-7 rounded-full flex items-center justify-center relative"
                  style={{ border: `1px solid ${color}25`, background: `radial-gradient(circle, ${color}08, transparent)` }}>
                    <span data-ev-id="ev_113389abdf" className="text-[9px] font-mono font-bold" style={{ color: color + 'cc' }}>
                      Q{sIdx}
                    </span>
                    <div data-ev-id="ev_b2a35ad65f" className="absolute inset-[-2px] rounded-full border border-dashed animate-[spin_8s_linear_infinite]"
                    style={{ borderColor: color + '10' }} />
                  </div>
                  <div data-ev-id="ev_d522262678">
                    <span data-ev-id="ev_b060b95b72" className="text-xs font-mono font-bold" style={{ color: color + 'aa' }}>
                      {section.emoji} {section.title}
                    </span>
                    <span data-ev-id="ev_2d1112d63b" className="text-[8px] font-mono block" style={{ color: color + '25' }}>
                      CIRCUIT DEPTH: {section.links.length} • FIDELITY: {90 + sIdx % 10}%
                    </span>
                  </div>
                  {/* Quantum wire line */}
                  <div data-ev-id="ev_e426d17438" className="flex-1 relative h-px mx-2">
                    <div data-ev-id="ev_9a537726db" className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${color}15, ${color}05, transparent)` }} />
                    {/* Gate markers on wire */}
                    {[20, 40, 60, 80].map((p) =>
                    <div data-ev-id="ev_62ed14f740" key={p} className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
                    style={{ left: `${p}%`, backgroundColor: color + '20' }} />
                    )}
                  </div>
                  <span data-ev-id="ev_e4cb02cb39" className="text-[9px] font-mono" style={{ color: color + '20' }}>
                    {section.links.length} gates
                  </span>
                </div>

                {/* Qubit cards grid */}
                <div data-ev-id="ev_1be24093ef" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {section.links.map((link, lIdx) =>
                  <QubitCard
                    key={link.id}
                    link={link}
                    sIdx={sIdx}
                    lIdx={lIdx}
                    delay={250 + sIdx * 100 + lIdx * 60}
                    isActive={hovered === link.id}
                    onHover={setHovered} />

                  )}
                </div>
              </div>);

          })}
        </div>

        {/* ── Footer ── */}
        <div data-ev-id="ev_3270a2ce6a" className="relative z-10 flex items-center justify-between px-5 py-2.5 border-t text-[9px] font-mono"
        style={{ borderColor: 'rgba(56,189,248,0.04)', color: 'rgba(56,189,248,0.15)' }}>
          <span data-ev-id="ev_af6e003190">CIRCUITS: {sections.length}</span>
          <span data-ev-id="ev_8648100dba" className="flex items-center gap-2">
            <span data-ev-id="ev_5a8a5c260f" className="w-1.5 h-1.5 rounded-full bg-sky-400/20 animate-pulse" />
            QUANTUM PROCESSOR ONLINE
          </span>
          <span data-ev-id="ev_3bbdd8159e">ERROR RATE: 0.003%</span>
          <span data-ev-id="ev_18dd642879">QPU v4.0</span>
        </div>
      </div>
    </div>);

};

export default QuantumView;