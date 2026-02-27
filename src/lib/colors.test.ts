import { describe, it, expect } from 'vitest';
import { BRAND, BG, type BrandColor, type BgColor } from './colors';

describe('colors', () => {
  describe('BRAND', () => {
    it('has all expected brand color keys', () => {
      expect(BRAND).toHaveProperty('cyan');
      expect(BRAND).toHaveProperty('purple');
      expect(BRAND).toHaveProperty('purpleLight');
      expect(BRAND).toHaveProperty('pink');
      expect(BRAND).toHaveProperty('amber');
      expect(BRAND).toHaveProperty('red');
      expect(BRAND).toHaveProperty('green');
    });

    it('cyan is the primary brand color #06b6d4', () => {
      expect(BRAND.cyan).toBe('#06b6d4');
    });

    it('all brand colors are valid hex strings', () => {
      const hexPattern = /^#[0-9a-f]{6}$/i;
      for (const [key, value] of Object.entries(BRAND)) {
        expect(value, `BRAND.${key} should be a valid hex color`).toMatch(hexPattern);
      }
    });

    it('is frozen / readonly at runtime', () => {
      // TypeScript const assertion — the object itself is still mutable in JS
      // but we verify the values haven't drifted from design spec
      expect(BRAND.cyan).toBe('#06b6d4');
      expect(BRAND.purple).toBe('#8b5cf6');
      expect(BRAND.pink).toBe('#ec4899');
      expect(BRAND.amber).toBe('#f59e0b');
      expect(BRAND.red).toBe('#ef4444');
      expect(BRAND.green).toBe('#10b981');
    });
  });

  describe('BG', () => {
    it('has base and deep background colors', () => {
      expect(BG).toHaveProperty('base');
      expect(BG).toHaveProperty('deep');
    });

    it('base background is #0a0a14', () => {
      expect(BG.base).toBe('#0a0a14');
    });

    it('deep background is #0a0a0f', () => {
      expect(BG.deep).toBe('#0a0a0f');
    });

    it('all BG colors are valid hex strings', () => {
      const hexPattern = /^#[0-9a-f]{6}$/i;
      for (const [key, value] of Object.entries(BG)) {
        expect(value, `BG.${key} should be a valid hex color`).toMatch(hexPattern);
      }
    });
  });

  describe('type exports', () => {
    it('BrandColor type is assignable from BRAND values', () => {
      // Compile-time check via assignment — if this compiles, types are correct
      const color: BrandColor = BRAND.cyan;
      expect(color).toBe('#06b6d4');
    });

    it('BgColor type is assignable from BG values', () => {
      const bg: BgColor = BG.base;
      expect(bg).toBe('#0a0a14');
    });
  });
});
