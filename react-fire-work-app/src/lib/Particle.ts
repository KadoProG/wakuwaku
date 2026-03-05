const GRAVITY = 0.08;
const FRICTION = 0.98;

export interface ParticleOptions {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size?: number;
}

export class Particle {
  el: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
  isAlive: boolean;

  constructor(options: ParticleOptions) {
    this.x = options.x;
    this.y = options.y;
    this.vx = options.vx;
    this.vy = options.vy;
    this.color = options.color;
    this.size = options.size ?? 4;
    this.opacity = 1;
    this.isAlive = true;

    this.el = document.createElement('div');
    this.el.dataset.particle = 'true';
    this.el.style.cssText = `
      position: absolute;
      width: ${this.size}px;
      height: ${this.size}px;
      border-radius: 50%;
      background: ${this.color};
      box-shadow: 0 0 6px 2px ${this.color};
      will-change: transform, opacity;
      pointer-events: none;
      transform: translate(${this.x}px, ${this.y}px);
      opacity: 1;
      left: 0;
      top: 0;
    `;
  }

  update(deltaTime = 1): void {
    if (!this.isAlive) return;

    this.vy += GRAVITY * deltaTime;
    this.vx *= FRICTION;
    this.vy *= FRICTION;
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    this.opacity -= 0.012 * deltaTime;

    if (this.opacity <= 0) {
      this.opacity = 0;
      this.isAlive = false;
      return;
    }

    this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
    this.el.style.opacity = String(this.opacity);
  }

  remove(): void {
    if (this.el.parentNode) {
      this.el.remove();
    }
  }
}
