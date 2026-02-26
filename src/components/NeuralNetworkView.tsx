import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AnimatedIcon } from '@/components/AnimatedIcon';
import type { LinkItem, LinkSection } from '@/data/links';
import { ExternalLink, Zap, Activity, Cpu } from 'lucide-react';

interface NeuralNetworkViewProps {
  sections: LinkSection[];
  visible: boolean;
}

interface Neuron {
  link: LinkItem;
  sectionIdx: number;
  layerX: number; // 0–1 horizontal position of the layer
  neuronY: number; // 0–1 vertical position within layer
  cx: number; // computed canvas x
  cy: number; // computed canvas y
}

interface Signal {
  fromIdx: number;
  toIdx: number;
  progress: number; // 0–1
  color: string;
}

const LAYER_COLORS = [
'#818cf8', // indigo
'#a78bfa', // violet
'#c084fc', // purple
'#f472b6', // pink
'#fb923c', // orange
'#34d399' // emerald
];

const GLOW_COLORS = [
'rgba(129,140,248,0.4)',
'rgba(167,139,250,0.4)',
'rgba(192,132,252,0.4)',
'rgba(244,114,182,0.4)',
'rgba(251,146,60,0.4)',
'rgba(52,211,153,0.4)'];


/* ══════════════════════════════════════════════════
 *  Neural Network View — Layered NN Visualization
 * ══════════════════════════════════════════════════ */
export const NeuralNetworkView = ({ sections, visible }: NeuralNetworkViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrame = useRef(0);
  const signalsRef = useRef<Signal[]>([]);
  const neuronsRef = useRef<Neuron[]>([]);
  const [hoveredNeuron, setHoveredNeuron] = useState<Neuron | null>(null);
  const [activatedNeuron, setActivatedNeuron] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [canvasW, setCanvasW] = useState(800);
  const [canvasH, setCanvasH] = useState(500);
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const tickRef = useRef(0);

  // Layer names for display
  const layerNames = useMemo(() => {
    if (sections.length <= 1) return ['Input / Output'];
    if (sections.length === 2) return ['Input Layer', 'Output Layer'];
    return sections.map((_, i) => {
      if (i === 0) return 'Input Layer';
      if (i === sections.length - 1) return 'Output Layer';
      return `Hidden Layer ${i}`;
    });
  }, [sections]);

  // Calculate neuron positions
  const computeNeurons = useCallback(() => {
    const neurons: Neuron[] = [];
    const numLayers = sections.length;
    const padX = 0.1;
    const padY = 0.08;

    sections.forEach((section, sIdx) => {
      const layerX = numLayers === 1 ? 0.5 : padX + sIdx / (numLayers - 1) * (1 - 2 * padX);
      const count = section.links.length;

      section.links.forEach((link, lIdx) => {
        const neuronY = count === 1 ? 0.5 : padY + lIdx / (count - 1) * (1 - 2 * padY);
        neurons.push({
          link,
          sectionIdx: sIdx,
          layerX,
          neuronY,
          cx: layerX * canvasW,
          cy: neuronY * canvasH
        });
      });
    });
    neuronsRef.current = neurons;
  }, [sections, canvasW, canvasH]);

  useEffect(() => computeNeurons(), [computeNeurons]);

  // Responsive sizing
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth - 32;
        const clamped = Math.min(w, 900);
        setCanvasW(clamped);
        setCanvasH(Math.min(Math.max(clamped * 0.6, 380), 550));
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Reveal
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setRevealed(true), 300);
      return () => clearTimeout(t);
    }
  }, [visible]);

  // Generate signals periodically
  useEffect(() => {
    if (!revealed) return;
    const interval = setInterval(() => {
      const neurons = neuronsRef.current;
      if (neurons.length < 2) return;

      // Pick random neuron from layer N, connect to random neuron in layer N+1
      const layerIndices: number[][] = [];
      sections.forEach((_, sIdx) => {
        layerIndices.push(
          neurons.reduce<number[]>((acc, n, idx) => {
            if (n.sectionIdx === sIdx) acc.push(idx);
            return acc;
          }, [])
        );
      });

      // Create 1-3 signals
      const newSignals: Signal[] = [];
      const numSignals = 1 + Math.floor(Math.random() * 3);
      for (let s = 0; s < numSignals; s++) {
        const fromLayer = Math.floor(Math.random() * (sections.length - 1));
        const toLayer = fromLayer + 1;
        if (!layerIndices[fromLayer]?.length || !layerIndices[toLayer]?.length) continue;
        const fromIdx = layerIndices[fromLayer][Math.floor(Math.random() * layerIndices[fromLayer].length)];
        const toIdx = layerIndices[toLayer][Math.floor(Math.random() * layerIndices[toLayer].length)];
        const color = LAYER_COLORS[fromLayer % LAYER_COLORS.length];
        newSignals.push({ fromIdx, toIdx, progress: 0, color });
      }

      signalsRef.current = [...signalsRef.current.filter((s) => s.progress < 1), ...newSignals];
    }, 400);

    return () => clearInterval(interval);
  }, [revealed, sections]);

  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !revealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasW * dpr;
    canvas.height = canvasH * dpr;
    ctx.scale(dpr, dpr);

    const draw = () => {
      tickRef.current++;
      ctx.clearRect(0, 0, canvasW, canvasH);

      const neurons = neuronsRef.current;

      // Draw connections (synapses) between adjacent layers
      sections.forEach((_, sIdx) => {
        if (sIdx >= sections.length - 1) return;
        const fromNeurons = neurons.filter((n) => n.sectionIdx === sIdx);
        const toNeurons = neurons.filter((n) => n.sectionIdx === sIdx + 1);

        // Only show connections for active layers or all if none selected
        if (activeLayer !== null && activeLayer !== sIdx && activeLayer !== sIdx + 1) return;

        fromNeurons.forEach((from) => {
          toNeurons.forEach((to) => {
            const isHoveredConn =
            hoveredNeuron && (hoveredNeuron.link.id === from.link.id || hoveredNeuron.link.id === to.link.id);

            ctx.strokeStyle = isHoveredConn ?
            LAYER_COLORS[sIdx % LAYER_COLORS.length] + '40' :
            'rgba(255,255,255,0.04)';
            ctx.lineWidth = isHoveredConn ? 1.5 : 0.5;
            ctx.beginPath();

            // Bezier curve for nice flow
            const midX = (from.cx + to.cx) / 2;
            ctx.moveTo(from.cx, from.cy);
            ctx.bezierCurveTo(midX, from.cy, midX, to.cy, to.cx, to.cy);
            ctx.stroke();
          });
        });
      });

      // Draw signals
      signalsRef.current.forEach((sig) => {
        sig.progress += 0.018;
        if (sig.progress > 1) return;

        const from = neurons[sig.fromIdx];
        const to = neurons[sig.toIdx];
        if (!from || !to) return;

        const t = sig.progress;
        const midX = (from.cx + to.cx) / 2;
        // Cubic bezier interpolation
        const u = 1 - t;
        const px = u * u * u * from.cx + 3 * u * u * t * midX + 3 * u * t * t * midX + t * t * t * to.cx;
        const py = u * u * u * from.cy + 3 * u * u * t * from.cy + 3 * u * t * t * to.cy + t * t * t * to.cy;

        const alpha = t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = sig.color;
        ctx.globalAlpha = alpha * 0.9;
        ctx.shadowColor = sig.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      // Remove finished signals
      signalsRef.current = signalsRef.current.filter((s) => s.progress < 1);

      // Draw neurons
      neurons.forEach((neuron, idx) => {
        if (activeLayer !== null && neuron.sectionIdx !== activeLayer) {
          // Dimmed
          ctx.beginPath();
          ctx.arc(neuron.cx, neuron.cy, 6, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.05)';
          ctx.fill();
          return;
        }

        const color = LAYER_COLORS[neuron.sectionIdx % LAYER_COLORS.length];
        const glow = GLOW_COLORS[neuron.sectionIdx % GLOW_COLORS.length];
        const isHovered = hoveredNeuron?.link.id === neuron.link.id;
        const isActivated = activatedNeuron === neuron.link.id;

        // Pulse animation
        const pulse = Math.sin(tickRef.current * 0.03 + idx * 0.5) * 0.15 + 0.85;
        const r = isHovered ? 14 : isActivated ? 16 : 8 * pulse;

        // Outer glow
        if (isHovered || isActivated) {
          ctx.beginPath();
          ctx.arc(neuron.cx, neuron.cy, r + 8, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.globalAlpha = 0.3;
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        // Neuron body
        const grad = ctx.createRadialGradient(
          neuron.cx, neuron.cy, 0,
          neuron.cx, neuron.cy, r
        );
        grad.addColorStop(0, color);
        grad.addColorStop(1, color + '40');
        ctx.beginPath();
        ctx.arc(neuron.cx, neuron.cy, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.shadowColor = color;
        ctx.shadowBlur = isHovered ? 20 : 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner bright core
        ctx.beginPath();
        ctx.arc(neuron.cx, neuron.cy, r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fill();

        // Activation ring animation
        if (isActivated) {
          const ringR = r + 4 + Math.sin(tickRef.current * 0.1) * 4;
          ctx.beginPath();
          ctx.arc(neuron.cx, neuron.cy, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      // Layer labels at bottom
      sections.forEach((section, sIdx) => {
        const sampleNeuron = neurons.find((n) => n.sectionIdx === sIdx);
        if (!sampleNeuron) return;
        const color = LAYER_COLORS[sIdx % LAYER_COLORS.length];
        ctx.fillStyle = activeLayer !== null && activeLayer !== sIdx ? 'rgba(255,255,255,0.1)' : color + '80';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(layerNames[sIdx], sampleNeuron.cx, canvasH - 8);
      });

      animFrame.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrame.current);
  }, [canvasW, canvasH, revealed, hoveredNeuron, activatedNeuron, activeLayer, sections, layerNames]);

  // Hit detection
  const handleCanvasMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let found: Neuron | null = null;
    for (const neuron of neuronsRef.current) {
      if (activeLayer !== null && neuron.sectionIdx !== activeLayer) continue;
      const dist = Math.sqrt((mx - neuron.cx) ** 2 + (my - neuron.cy) ** 2);
      if (dist < 16) {
        found = neuron;
        break;
      }
    }
    setHoveredNeuron(found);
  }, [activeLayer]);

  const handleCanvasClick = useCallback(() => {
    if (hoveredNeuron) {
      setActivatedNeuron(hoveredNeuron.link.id);
      setTimeout(() => setActivatedNeuron(null), 1200);
      window.open(hoveredNeuron.link.url, '_blank', 'noopener,noreferrer');
    }
  }, [hoveredNeuron]);

  const totalNeurons = sections.reduce((a, s) => a + s.links.length, 0);
  const totalSynapses = sections.reduce((total, section, sIdx) => {
    if (sIdx >= sections.length - 1) return total;
    return total + section.links.length * sections[sIdx + 1].links.length;
  }, 0);

  return (
    <div data-ev-id="ev_706e7a9f79"
    ref={containerRef}
    className={`transition-[opacity,transform] duration-700 ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
    }>

      <div data-ev-id="ev_939d5184cb"
      className="mx-auto max-w-4xl rounded-xl overflow-hidden border border-purple-500/10"
      style={{
        background: 'linear-gradient(135deg, rgba(10,5,20,0.98) 0%, rgba(15,10,30,0.98) 50%, rgba(10,5,25,0.98) 100%)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 80px rgba(139,92,246,0.03)'
      }}>

        {/* Header */}
        <div data-ev-id="ev_e634e4107d" className="flex items-center justify-between px-4 py-3 border-b border-purple-500/10">
          <div data-ev-id="ev_0799d73188" className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span data-ev-id="ev_4a8f1b0937" className="text-purple-300 text-xs font-mono font-bold tracking-widest">
              NEURAL NETWORK VISUALIZER
            </span>
          </div>
          <div data-ev-id="ev_43b2a3d206" className="flex items-center gap-4 text-[10px] font-mono text-purple-400/40">
            <span data-ev-id="ev_c35922d71e" className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {totalNeurons} neurons
            </span>
            <span data-ev-id="ev_68b38c9046" className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {totalSynapses} synapses
            </span>
          </div>
        </div>

        {/* Layer filter */}
        <div data-ev-id="ev_e167636676" className="flex items-center gap-2 px-4 py-2.5 border-b border-purple-500/[0.06] overflow-x-auto scrollbar-hide">
          <button data-ev-id="ev_c87d8e1ae4"
          onClick={() => setActiveLayer(null)}
          className={`px-3 py-1 rounded text-[11px] font-mono transition-colors flex-shrink-0 ${
          activeLayer === null ?
          'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
          'text-purple-400/40 hover:text-purple-400/70 border border-transparent'}`
          }>

            ALL LAYERS
          </button>
          {sections.map((section, sIdx) =>
          <button data-ev-id="ev_82fbd34293"
          key={section.id}
          onClick={() => setActiveLayer(activeLayer === sIdx ? null : sIdx)}
          className={`px-3 py-1 rounded text-[11px] font-mono transition-colors flex-shrink-0 flex items-center gap-1.5 ${
          activeLayer === sIdx ?
          'border text-white/90' :
          'text-white/60 hover:text-white/60 border border-transparent'}`
          }
          style={{
            borderColor: activeLayer === sIdx ? LAYER_COLORS[sIdx % LAYER_COLORS.length] + '60' : undefined,
            backgroundColor: activeLayer === sIdx ? LAYER_COLORS[sIdx % LAYER_COLORS.length] + '15' : undefined
          }}>

              <span data-ev-id="ev_eeab6503b8"
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: LAYER_COLORS[sIdx % LAYER_COLORS.length] }} />

              {layerNames[sIdx]}
              <span data-ev-id="ev_f01ea94f5f" className="text-white/60 text-[9px]">({section.links.length})</span>
            </button>
          )}
        </div>

        {/* Canvas + Side List */}
        <div data-ev-id="ev_55a3cf9d6c" className="flex flex-col lg:flex-row">
          {/* Canvas area */}
          <div data-ev-id="ev_a3d7c35ed5" className="flex-1 flex items-center justify-center p-4 relative">
            <canvas data-ev-id="ev_04616f9214"
            ref={canvasRef}
            style={{ width: canvasW, height: canvasH, cursor: hoveredNeuron ? 'pointer' : 'default' }}
            className="rounded-lg"
            onMouseMove={handleCanvasMove}
            onMouseLeave={() => setHoveredNeuron(null)}
            onClick={handleCanvasClick} />


            {/* Tooltip */}
            {hoveredNeuron &&
            <div data-ev-id="ev_0a0db0dbe9"
            className="absolute z-20 pointer-events-none"
            style={{
              left: hoveredNeuron.cx + 24,
              top: hoveredNeuron.cy + 16
            }}>

                <div data-ev-id="ev_8c9ae5f620"
              className="px-3 py-2.5 rounded-lg border text-xs min-w-[180px]"
              style={{
                background: 'rgba(10,5,20,0.95)',
                borderColor: LAYER_COLORS[hoveredNeuron.sectionIdx % LAYER_COLORS.length] + '40',
                boxShadow: `0 8px 25px rgba(0,0,0,0.4), 0 0 20px ${LAYER_COLORS[hoveredNeuron.sectionIdx % LAYER_COLORS.length]}10`
              }}>

                  <div data-ev-id="ev_3139f71e87" className="flex items-center gap-2 mb-1.5">
                    <AnimatedIcon icon={hoveredNeuron.link.icon} animation={hoveredNeuron.link.animation} color={hoveredNeuron.link.color} size={14} />
                    <span data-ev-id="ev_2a7ea34e3c" className="text-white font-semibold text-[11px]">{hoveredNeuron.link.title}</span>
                  </div>
                  <p data-ev-id="ev_b846a80483" className="text-white/60 text-[10px] leading-relaxed mb-1.5">{hoveredNeuron.link.subtitle}</p>
                  <div data-ev-id="ev_8a5b038465" className="flex items-center justify-between">
                    <span data-ev-id="ev_5924e7d1eb"
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                  style={{
                    color: LAYER_COLORS[hoveredNeuron.sectionIdx % LAYER_COLORS.length],
                    background: LAYER_COLORS[hoveredNeuron.sectionIdx % LAYER_COLORS.length] + '15'
                  }}>

                      {layerNames[hoveredNeuron.sectionIdx]}
                    </span>
                    <span data-ev-id="ev_01a331170a" className="flex items-center gap-1 text-purple-400/50 text-[9px]">
                      <Zap className="w-2.5 h-2.5" />
                      Activate
                    </span>
                  </div>
                </div>
              </div>
            }

            {/* Corner info */}
            <div data-ev-id="ev_2306e68b80" className="absolute top-5 left-5 text-[9px] font-mono text-purple-400/25">
              <div data-ev-id="ev_195aae5502">LAYERS: {sections.length}</div>
              <div data-ev-id="ev_976df60c41">TOPOLOGY: FEEDFORWARD</div>
            </div>
            <div data-ev-id="ev_be19965cf4" className="absolute top-5 right-5 text-[9px] font-mono text-purple-400/25 text-right">
              <div data-ev-id="ev_86efbe089f">ACTIVATION: ReLU</div>
              <div data-ev-id="ev_9a72d07a8c">LOSS: 0.0042</div>
            </div>
            <div data-ev-id="ev_6dae5fba39" className="absolute bottom-5 left-5 text-[9px] font-mono text-purple-400/25">
              <div data-ev-id="ev_1a87978ac6">EPOCH: 2048</div>
              <div data-ev-id="ev_5e17308722">LR: 0.001</div>
            </div>
            <div data-ev-id="ev_4fb9a35906" className="absolute bottom-5 right-5 flex items-center gap-1 text-[9px] font-mono text-purple-400/25">
              <span data-ev-id="ev_38c49f9f18" className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              TRAINING
            </div>
          </div>

          {/* Side panel */}
          <div data-ev-id="ev_10af4949ce" className="lg:w-72 border-t lg:border-t-0 lg:border-l border-purple-500/[0.06] max-h-[400px] lg:max-h-[580px] overflow-y-auto scrollbar-hide">
            <div data-ev-id="ev_7f428b65aa" className="px-3 py-2 border-b border-purple-500/[0.06] sticky top-0 z-10" style={{ background: 'rgba(10,5,20,0.98)' }}>
              <span data-ev-id="ev_c60d1a96ec" className="text-purple-400/60 text-[10px] font-mono tracking-widest">
                ◆ NEURONS ({activeLayer !== null ? sections[activeLayer]?.links.length : totalNeurons})
              </span>
            </div>

            {sections.map((section, sIdx) => {
              if (activeLayer !== null && activeLayer !== sIdx) return null;
              return (
                <div data-ev-id="ev_427175664a" key={section.id}>
                  <div data-ev-id="ev_22f452d1be"
                  className="px-3 py-1.5 flex items-center gap-2 border-b border-white/[0.03]"
                  style={{ background: LAYER_COLORS[sIdx % LAYER_COLORS.length] + '08' }}>

                    <span data-ev-id="ev_617be8ff59"
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: LAYER_COLORS[sIdx % LAYER_COLORS.length] }} />

                    <span data-ev-id="ev_ed2388e5c5" className="text-[10px] font-mono font-bold text-white/60 tracking-wide">
                      {section.emoji} {layerNames[sIdx]}
                    </span>
                    <span data-ev-id="ev_49c07e10cb" className="text-[9px] font-mono text-white/60 mr-auto">
                      [{section.links.length} neurons]
                    </span>
                  </div>
                  {section.links.map((link) =>
                  <a data-ev-id="ev_e58bb35355"
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.title} — ${link.subtitle} (נפתח בחלון חדש)`}
                  className="flex items-center gap-2.5 px-3 py-2 border-b border-white/[0.02] hover:bg-purple-500/[0.06] transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onMouseEnter={() => {
                    const n = neuronsRef.current.find((n) => n.link.id === link.id);
                    if (n) setHoveredNeuron(n);
                  }}
                  onMouseLeave={() => setHoveredNeuron(null)}>

                      <AnimatedIcon icon={link.icon} animation={link.animation} color={link.color} size={14} />
                      <div data-ev-id="ev_c12df1693f" className="flex-1 min-w-0">
                        <div data-ev-id="ev_8b4e236ea1" className="text-white/70 text-[11px] font-mono truncate group-hover:text-white/90 transition-colors">
                          {link.title}
                        </div>
                        <div data-ev-id="ev_bba4b6d9f4" className="text-white/60 text-[9px] font-mono truncate">
                          {link.subtitle}
                        </div>
                      </div>
                      <ExternalLink className="w-3 h-3 text-white/60 group-hover:text-purple-400/50 transition-colors flex-shrink-0" />
                    </a>
                  )}
                </div>);

            })}
          </div>
        </div>

        {/* Bottom status */}
        <div data-ev-id="ev_dd88dfaab9" className="flex items-center justify-between px-4 py-2 border-t border-purple-500/[0.06] text-[9px] font-mono text-purple-400/30">
          <span data-ev-id="ev_80cc574c81">ARCHITECTURE: {sections.map((_, i) => sections[i].links.length).join(' → ')}</span>
          <div data-ev-id="ev_da620a6253" className="flex items-center gap-3">
            {sections.map((section, sIdx) =>
            <span data-ev-id="ev_8e206664dd" key={section.id} className="flex items-center gap-1">
                <span data-ev-id="ev_42e3b07c9a"
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: LAYER_COLORS[sIdx % LAYER_COLORS.length] }} />

                {section.links.length}
              </span>
            )}
          </div>
          <span data-ev-id="ev_d4090d2f87">nVision NN v1.0</span>
        </div>
      </div>
    </div>);

};

export default NeuralNetworkView;