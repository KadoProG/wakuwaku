const GRAVITY = 0.15;

export interface RocketOptions {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  onExplode: (x: number, y: number) => void;
}

export class Rocket {
  el: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  onExplode: (x: number, y: number) => void;
  isAlive: boolean;

  constructor(options: RocketOptions) {
    this.x = options.startX;
    this.y = options.startY;
    this.onExplode = options.onExplode;
    this.isAlive = true;

    // Physics: set vy to reach approximately targetY height
    const heightToTarget = Math.max(options.startY - options.targetY, 50);
    this.vy = -Math.sqrt(2 * GRAVITY * heightToTarget);

    // Set vx to guide rocket toward targetX during ascent
    const timeToPeak = Math.abs(this.vy) / GRAVITY;
    const dx = options.targetX - options.startX;
    this.vx = timeToPeak > 0 ? dx / timeToPeak : 0;
    this.vx = Math.max(-15, Math.min(15, this.vx));

    this.el = document.createElement('div');
    this.el.dataset.rocket = 'true';
    this.el.style.cssText = `
      position: absolute;
      width: 4px;
      height: 10px;
      border-radius: 2px;
      background: white;
      box-shadow: 0 0 8px 3px rgba(255, 255, 255, 0.8);
      will-change: transform;
      pointer-events: none;
      transform: translate(${this.x}px, ${this.y}px);
      left: 0;
      top: 0;
    `;
  }

  update(): void {
    if (!this.isAlive) return;

    this.vy += GRAVITY;
    this.x += this.vx;
    this.y += this.vy;

    this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;

    if (this.vy >= 0) {
      this.isAlive = false;
      this.onExplode(this.x, this.y);
    }
  }

  remove(): void {
    if (this.el.parentNode) {
      this.el.remove();
    }
  }
}
