import { describe, expect, it } from 'vitest';
import { getColor, getExplosionColors } from '../../../src/lib/colors';

describe('colors', () => {
  describe('getColor', () => {
    it('returns an HSL string for rainbow theme', () => {
      const color = getColor('rainbow', 0);
      expect(color).toMatch(/hsl\(\d+(\.\d+)?, 100%, 60%\)/);
    });

    it('uses index-based hue for rainbow theme', () => {
      const color0 = getColor('rainbow', 0);
      const color1 = getColor('rainbow', 1);
      expect(color0).not.toBe(color1);
    });

    it('returns a color for monochrome theme', () => {
      const color = getColor('monochrome');
      expect(color).toMatch(/hsl\(/);
    });

    it('returns a color for random theme', () => {
      const color = getColor('random');
      expect(color).toMatch(/hsl\(/);
    });

    it('does not throw for out-of-range index', () => {
      expect(() => getColor('rainbow', -1)).not.toThrow();
      expect(() => getColor('rainbow', 9999)).not.toThrow();
    });
  });

  describe('getExplosionColors', () => {
    it('returns correct number of colors', () => {
      const colors = getExplosionColors('rainbow', 10);
      expect(colors).toHaveLength(10);
    });

    it('returns an array of strings', () => {
      const colors = getExplosionColors('random', 5);
      expect(colors.every((c) => typeof c === 'string')).toBe(true);
    });

    it('returns empty array when count is 0', () => {
      const colors = getExplosionColors('rainbow', 0);
      expect(colors).toHaveLength(0);
    });
  });
});
