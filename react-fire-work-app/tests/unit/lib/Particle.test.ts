import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Particle } from '../../../src/lib/Particle';

describe('Particle', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('creates a div element with data-particle attribute', () => {
    const p = new Particle({ x: 100, y: 100, vx: 1, vy: -2, color: 'red' });
    expect(p.el).toBeInstanceOf(HTMLDivElement);
    expect(p.el.dataset.particle).toBe('true');
  });

  it('starts with isAlive = true and opacity = 1', () => {
    const p = new Particle({ x: 0, y: 0, vx: 0, vy: 0, color: 'red' });
    expect(p.isAlive).toBe(true);
    expect(p.opacity).toBe(1);
  });

  it('update() applies gravity to vy', () => {
    const p = new Particle({ x: 0, y: 0, vx: 0, vy: 0, color: 'red' });
    const initialVy = p.vy;
    p.update();
    expect(p.vy).toBeGreaterThan(initialVy);
  });

  it('update() applies friction — vx magnitude decreases', () => {
    const p = new Particle({ x: 0, y: 0, vx: 10, vy: 0, color: 'red' });
    p.update();
    expect(Math.abs(p.vx)).toBeLessThan(10);
  });

  it('update() updates el.style.transform', () => {
    const p = new Particle({ x: 0, y: 0, vx: 5, vy: -5, color: 'red' });
    container.appendChild(p.el);
    p.update();
    expect(p.el.style.transform).toContain('translate');
  });

  it('isAlive becomes false when opacity reaches 0', () => {
    const p = new Particle({ x: 0, y: 0, vx: 0, vy: 0, color: 'red' });
    for (let i = 0; i < 200; i++) {
      if (!p.isAlive) break;
      p.update();
    }
    expect(p.isAlive).toBe(false);
  });

  it('remove() detaches element from parent', () => {
    const p = new Particle({ x: 0, y: 0, vx: 0, vy: 0, color: 'red' });
    container.appendChild(p.el);
    expect(container.children.length).toBe(1);
    p.remove();
    expect(container.children.length).toBe(0);
  });

  it('remove() is safe to call when not in DOM', () => {
    const p = new Particle({ x: 0, y: 0, vx: 0, vy: 0, color: 'red' });
    expect(() => p.remove()).not.toThrow();
  });
});
