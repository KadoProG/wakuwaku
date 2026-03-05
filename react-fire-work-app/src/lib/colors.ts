export type ColorTheme = 'rainbow' | 'monochrome' | 'random';

export function getColor(theme: ColorTheme, index?: number): string {
  switch (theme) {
    case 'rainbow': {
      const hue =
        index !== undefined
          ? (((index * 30) % 360) + 360) % 360
          : Math.random() * 360;
      return `hsl(${hue}, 100%, 60%)`;
    }
    case 'monochrome': {
      const l = 50 + Math.random() * 30;
      return `hsl(200, 80%, ${l}%)`;
    }
    default: {
      const hue = Math.random() * 360;
      return `hsl(${hue}, 100%, 60%)`;
    }
  }
}

export function getExplosionColors(theme: ColorTheme, count: number): string[] {
  return Array.from({ length: count }, (_, i) => getColor(theme, i));
}
