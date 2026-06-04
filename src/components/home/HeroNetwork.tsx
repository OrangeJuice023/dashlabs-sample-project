"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; phase: number };
type Pulse = { a: number; b: number; t: number; speed: number };

export function HeroNetwork() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(function setup() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const LINK_DIST = 150;
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let raf = 0;
    let last = 0;
    let pulseTimer = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(18, Math.min(46, Math.floor((width * height) / 24000)));
      nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function neighbors(i: number): number[] {
      const out: number[] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (dx * dx + dy * dy < LINK_DIST * LINK_DIST) out.push(j);
      }
      return out;
    }

    function spawnPulse() {
      const a = Math.floor(Math.random() * nodes.length);
      const ns = neighbors(a);
      if (ns.length === 0) return;
      const b = ns[Math.floor(Math.random() * ns.length)];
      pulses.push({ a: a, b: b, t: 0, speed: 0.6 + Math.random() * 0.5 });
    }

    function draw(now: number) {
      const dt = last ? (now - last) / 1000 : 0;
      last = now;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!reduce) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const a = (1 - Math.sqrt(d2) / LINK_DIST) * 0.18;
            ctx.strokeStyle = "rgba(120,150,220," + a.toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      const t = now / 1000;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const beat = reduce ? 0 : Math.sin(t * 1.6 + n.phase);
        const r = 1.8 + (beat + 1) * 0.7;
        const glow = 0.35 + (beat + 1) * 0.18;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(21,102,255," + glow.toFixed(3) + ")";
        ctx.fill();
      }

      if (!reduce) {
        pulseTimer += dt;
        if (pulseTimer > 0.7) {
          pulseTimer = 0;
          spawnPulse();
        }
        pulses = pulses.filter(function keep(p) { return p.t < 1; });
        for (let k = 0; k < pulses.length; k++) {
          const p = pulses[k];
          p.t += dt * p.speed;
          const A = nodes[p.a];
          const B = nodes[p.b];
          if (!A || !B) continue;
          const x = A.x + (B.x - A.x) * p.t;
          const y = A.y + (B.y - A.y) * p.t;
          const fade = Math.sin(Math.min(p.t, 1) * Math.PI);
          ctx.beginPath();
          ctx.arc(x, y, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(150,190,255," + (0.9 * fade).toFixed(3) + ")";
          ctx.fill();
        }
      }

      if (!reduce) raf = requestAnimationFrame(draw);
    }

    resize();
    if (reduce) {
      draw(0);
    } else {
      raf = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    return function cleanup() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none opacity-70"
    />
  );
}
