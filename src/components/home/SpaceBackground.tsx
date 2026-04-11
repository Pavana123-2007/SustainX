import { useEffect, useRef } from "react";

const STAR_COUNT = 260;
const SHOOTING_STAR_INTERVAL = 3000;
const NEBULA_COUNT = 5;

interface Nebula {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  alpha: number;
  pulseSpeed: number;
  pulseOffset: number;
}

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;

    interface Star {
      x: number;
      y: number;
      z: number;
      size: number;
      baseAlpha: number;
      twinkleSpeed: number;
      twinkleOffset: number;
    }

    interface ShootingStar {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      tail: { x: number; y: number }[];
    }

    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let nebulae: Nebula[] = [];
    let time = 0;

    const resize = () => {
      width = window.innerWidth;
      height = document.documentElement.scrollHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const initStars = () => {
      stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random(),
        size: Math.random() * 2 + 0.5,
        baseAlpha: Math.random() * 0.6 + 0.3,
        twinkleSpeed: Math.random() * 2 + 1,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));
    };

    const initNebulae = () => {
      nebulae = Array.from({ length: NEBULA_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 300 + 200,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.04 + 0.02,
        pulseSpeed: Math.random() * 0.4 + 0.2,
        pulseOffset: Math.random() * Math.PI * 2,
      }));
    };

    const spawnShootingStar = () => {
      const startX = Math.random() * width * 0.8;
      const startY = Math.random() * height * 0.4;
      const angle = (Math.random() * 30 + 15) * (Math.PI / 180);
      const speed = Math.random() * 6 + 8;
      shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: Math.random() * 40 + 30,
        size: Math.random() * 2 + 1.5,
        tail: [],
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.008;

      // Slow parallax drift
      const driftX = Math.sin(time * 0.3) * 8;
      const driftY = Math.cos(time * 0.2) * 5;

      // --- White nebulae ---
      for (const neb of nebulae) {
        neb.x += neb.speedX;
        neb.y += neb.speedY;

        // Wrap around edges
        if (neb.x < -neb.radius) neb.x = width + neb.radius;
        if (neb.x > width + neb.radius) neb.x = -neb.radius;
        if (neb.y < -neb.radius) neb.y = height + neb.radius;
        if (neb.y > height + neb.radius) neb.y = -neb.radius;

        const pulse = Math.sin(time * neb.pulseSpeed + neb.pulseOffset);
        const currentAlpha = neb.alpha + pulse * 0.015;
        const currentRadius = neb.radius + pulse * 30;

        const grad = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, currentRadius);
        grad.addColorStop(0, `rgba(220, 230, 255, ${currentAlpha * 1.5})`);
        grad.addColorStop(0.3, `rgba(200, 215, 245, ${currentAlpha})`);
        grad.addColorStop(0.6, `rgba(180, 200, 240, ${currentAlpha * 0.4})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(neb.x, neb.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Stars ---
      for (const star of stars) {
        const parallax = 0.5 + star.z * 0.5;
        const sx = ((star.x + driftX * parallax) % width + width) % width;
        const sy = ((star.y + driftY * parallax) % height + height) % height;
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const alpha = star.baseAlpha + twinkle * 0.25;

        const glow = star.size * (2 + star.z);
        const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, glow);
        grad.addColorStop(0, `rgba(200, 240, 255, ${alpha})`);
        grad.addColorStop(0.4, `rgba(160, 220, 255, ${alpha * 0.3})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(sx, sy, glow, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(alpha + 0.2, 1)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, star.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Shooting stars ---
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life++;
        ss.tail.push({ x: ss.x, y: ss.y });
        if (ss.tail.length > 18) ss.tail.shift();

        const progress = ss.life / ss.maxLife;
        const headAlpha = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7;

        for (let j = 0; j < ss.tail.length; j++) {
          const t = j / ss.tail.length;
          const ta = t * headAlpha * 0.6;
          const ts = ss.size * t * 0.8;
          ctx.fillStyle = `rgba(180, 255, 220, ${ta})`;
          ctx.beginPath();
          ctx.arc(ss.tail[j].x, ss.tail[j].y, ts, 0, Math.PI * 2);
          ctx.fill();
        }

        const hGrad = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, ss.size * 3);
        hGrad.addColorStop(0, `rgba(255, 255, 255, ${headAlpha})`);
        hGrad.addColorStop(0.3, `rgba(160, 255, 200, ${headAlpha * 0.5})`);
        hGrad.addColorStop(1, "transparent");
        ctx.fillStyle = hGrad;
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.size * 3, 0, Math.PI * 2);
        ctx.fill();

        if (ss.life >= ss.maxLife) shootingStars.splice(i, 1);
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    initStars();
    initNebulae();
    draw();

    const shootingInterval = setInterval(spawnShootingStar, SHOOTING_STAR_INTERVAL);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      initStars();
      initNebulae();
    });
    resizeObserver.observe(document.body);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(shootingInterval);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: "transparent" }}
    />
  );
}