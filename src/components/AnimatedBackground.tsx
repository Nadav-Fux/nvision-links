import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  opacity: number;
  baseOpacity: number;
  color: string;
  hue: number;
}

interface AnimatedBackgroundProps {
  /** Disable particle animation (e.g. when a Canvas view is active) */
  disabled?: boolean;
}

export const AnimatedBackground = ({ disabled }: AnimatedBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const scrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced || disabled) {
      // Cancel any running animation when disabled
      cancelAnimationFrame(animationRef.current);
      // Clear the canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Capture non-null canvas reference for use inside closures
    const canvasEl = canvas;

    // Adaptive particle count: fewer on mobile for performance
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4;
    const particleCount = isMobile ? isLowEnd ? 20 : 30 : 60;

    const resize = () => {
      canvasEl.width = window.innerWidth;
      canvasEl.height = window.innerHeight;
      initParticles();
    };

    const colors = ['#06b6d4', '#8b5cf6', '#a855f7', '#0ea5e9', '#6366f1', '#22d3ee'];
    const MOUSE_RADIUS = 180;
    const PUSH_FORCE = 0.08;
    const RETURN_SPEED = 0.015;
    const CONNECTION_DIST = isMobile ? 100 : 140;
    const MOUSE_CONNECTION_DIST = 200;

    function initParticles() {
      particlesRef.current = Array.from({ length: particleCount }, () => {
        const x = Math.random() * canvasEl.width;
        const y = Math.random() * canvasEl.height;
        return {
          x, y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5,
          baseSize: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.4 + 0.15,
          baseOpacity: Math.random() * 0.4 + 0.15,
          color: colors[Math.floor(Math.random() * colors.length)],
          hue: Math.random() * 60 - 30
        };
      });
    }

    initParticles();
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Pause animation during scroll to prevent flickering
    const handleScroll = () => {
      scrollingRef.current = true;
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        scrollingRef.current = false;
      }, 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    let frameCount = 0;

    const animate = () => {
      // During scroll, skip heavy rendering — just schedule next frame
      if (scrollingRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my, active } = mouseRef.current;
      const particles = particlesRef.current;

      // Draw mouse glow when active
      if (active) {
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, MOUSE_RADIUS);
        grad.addColorStop(0, 'rgba(6, 182, 212, 0.04)');
        grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.02)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(mx - MOUSE_RADIUS, my - MOUSE_RADIUS, MOUSE_RADIUS * 2, MOUSE_RADIUS * 2);
      }

      // Draw connections from mouse to nearby particles
      if (active) {
        particles.forEach((p) => {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_CONNECTION_DIST) {
            const alpha = (1 - dist / MOUSE_CONNECTION_DIST) * 0.25;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        });
      }

      particles.forEach((p, i) => {
        // Drift base position slowly
        p.baseX += p.vx;
        p.baseY += p.vy;

        // Wrap base
        if (p.baseX < -20) p.baseX = canvas.width + 20;
        if (p.baseX > canvas.width + 20) p.baseX = -20;
        if (p.baseY < -20) p.baseY = canvas.height + 20;
        if (p.baseY > canvas.height + 20) p.baseY = -20;

        // Mouse interaction
        let targetX = p.baseX;
        let targetY = p.baseY;

        if (active) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MOUSE_RADIUS) {
            const force = (1 - dist / MOUSE_RADIUS) * PUSH_FORCE;
            const angle = Math.atan2(dy, dx);
            targetX = p.baseX + Math.cos(angle) * MOUSE_RADIUS * force * 8;
            targetY = p.baseY + Math.sin(angle) * MOUSE_RADIUS * force * 8;
            p.size = p.baseSize + (1 - dist / MOUSE_RADIUS) * 3;
            p.opacity = Math.min(p.baseOpacity + (1 - dist / MOUSE_RADIUS) * 0.4, 0.9);
          } else {
            p.size += (p.baseSize - p.size) * 0.05;
            p.opacity += (p.baseOpacity - p.opacity) * 0.05;
          }
        } else {
          p.size += (p.baseSize - p.size) * 0.05;
          p.opacity += (p.baseOpacity - p.opacity) * 0.05;
        }

        // Smooth move toward target
        p.x += (targetX - p.x) * RETURN_SPEED * 3;
        p.y += (targetY - p.y) * RETURN_SPEED * 3;

        // Draw particle with glow
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Soft glow for larger particles
        if (p.size > 2) {
          ctx.globalAlpha = p.opacity * 0.3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }

        // Draw connections between particles (skip on mobile, draw every other frame on desktop)
        if (!isMobile && frameCount % 2 === 0) {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CONNECTION_DIST) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = p.color;
              ctx.globalAlpha = (1 - dist / CONNECTION_DIST) * 0.12;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimerRef.current);
      cancelAnimationFrame(animationRef.current);
    };
  }, [prefersReduced, disabled]);

  // When reduced motion is preferred, render a subtle static gradient
  if (prefersReduced) {
    return (
      <div data-ev-id="ev_01a5ffb2dc"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(6,182,212,0.04) 0%, transparent 60%)' }}
      role="presentation"
      aria-hidden="true" />);
  }

  return (
    <canvas data-ev-id="ev_fa6a941bd7"
    ref={canvasRef}
    className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${
    disabled ? 'opacity-0' : 'opacity-100'}`
    }
    style={{ zIndex: 0, willChange: 'transform' }}
    role="presentation"
    aria-hidden="true" />);
};