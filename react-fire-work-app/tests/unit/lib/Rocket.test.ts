import { describe, expect, it, vi } from 'vitest';
import { Rocket } from '../../../src/lib/Rocket';

function makeRocket(overrides?: Partial<Parameters<typeof Rocket>[0]>) {
  return new Rocket({
    startX: 400,
    startY: 600,
    targetX: 400,
    targetY: 200,
    onExplode: () => {},
    ...overrides,
  });
}

describe('Rocket', () => {
  it('creates a div element with data-rocket attribute', () => {
    const rocket = makeRocket();
    expect(rocket.el).toBeInstanceOf(HTMLDivElement);
    expect(rocket.el.dataset.rocket).toBe('true');
  });

  it('starts with negative vy (moving upward)', () => {
    const rocket = makeRocket();
    expect(rocket.vy).toBeLessThan(0);
  });

  it('starts with isAlive = true', () => {
    const rocket = makeRocket();
    expect(rocket.isAlive).toBe(true);
  });

  it('calls onExplode exactly once when vy >= 0 (peak reached)', () => {
    const onExplode = vi.fn();
    const rocket = makeRocket({ onExplode });

    for (let i = 0; i < 500; i++) {
      if (!rocket.isAlive) break;
      rocket.update();
    }

    expect(onExplode).toHaveBeenCalledOnce();
    expect(rocket.isAlive).toBe(false);
  });

  it('onExplode receives current x, y position', () => {
    const onExplode = vi.fn();
    const rocket = makeRocket({ onExplode });

    for (let i = 0; i < 500; i++) {
      if (!rocket.isAlive) break;
      rocket.update();
    }

    expect(onExplode).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
    );
  });

  it('update() changes el.style.transform', () => {
    const container = document.createElement('div');
    const rocket = makeRocket();
    container.appendChild(rocket.el);
    const initial = rocket.el.style.transform;
    rocket.update();
    expect(rocket.el.style.transform).not.toBe(initial);
  });

  it('remove() detaches element from parent', () => {
    const container = document.createElement('div');
    const rocket = makeRocket();
    container.appendChild(rocket.el);
    rocket.remove();
    expect(container.children.length).toBe(0);
  });
});
