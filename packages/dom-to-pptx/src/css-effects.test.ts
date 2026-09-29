// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, it } from 'vitest';
import {
  classifyGradient,
  parseBoxShadow,
  parseClipPath,
  parseCssColor,
  parseCssLength,
  parseLinearGradient,
} from './css-effects.js';

describe('css-effects', () => {
  describe('parseCssColor', () => {
    it('parses hex colors', () => {
      expect(parseCssColor('#FF0000')).toEqual({ hex: 'FF0000', alpha: 1 });
      expect(parseCssColor('#fff')).toEqual({ hex: 'FFFFFF', alpha: 1 });
      const c = parseCssColor('#FF000080');
      expect(c?.hex).toBe('FF0000');
      expect(c?.alpha).toBeCloseTo(0.502, 2);
    });

    it('parses rgb/rgba colors', () => {
      expect(parseCssColor('rgb(255, 128, 0)')).toEqual({ hex: 'FF8000', alpha: 1 });
      expect(parseCssColor('rgba(0, 0, 0, 0.5)')).toEqual({ hex: '000000', alpha: 0.5 });
    });

    it('returns undefined for transparent/none', () => {
      expect(parseCssColor('transparent')).toBeUndefined();
      expect(parseCssColor('none')).toBeUndefined();
    });

    it('parses named colors', () => {
      expect(parseCssColor('red')).toEqual({ hex: 'FF0000', alpha: 1 });
      expect(parseCssColor('white')).toEqual({ hex: 'FFFFFF', alpha: 1 });
    });
  });

  describe('parseCssLength', () => {
    it('parses px/em/rem/pt/%', () => {
      expect(parseCssLength('10px')).toBe(10);
      expect(parseCssLength('2em')).toBe(32);
      expect(parseCssLength('1.5rem')).toBe(24);
      expect(parseCssLength('12pt')).toBeCloseTo(16);
      expect(parseCssLength('50%', 100)).toBe(50);
    });

    it('returns 0 for zero', () => {
      expect(parseCssLength('0')).toBe(0);
    });
  });

  describe('parseLinearGradient', () => {
    it('parses simple two-color gradient', () => {
      const g = parseLinearGradient('linear-gradient(#ff0000, #00ff00)');
      expect(g).toBeDefined();
      expect(g!.type).toBe('linear');
      expect(g!.angle).toBe(180);
      expect(g!.stops).toHaveLength(2);
      expect(g!.stops[0]).toEqual({ color: 'FF0000', position: 0 });
      expect(g!.stops[1]).toEqual({ color: '00FF00', position: 1 });
    });

    it('parses direction keywords', () => {
      expect(parseLinearGradient('linear-gradient(to right, red, blue)')!.angle).toBe(90);
      expect(parseLinearGradient('linear-gradient(to top, red, blue)')!.angle).toBe(0);
      expect(parseLinearGradient('linear-gradient(to top right, red, blue)')!.angle).toBe(45);
    });

    it('parses angle', () => {
      expect(parseLinearGradient('linear-gradient(135deg, red, blue)')!.angle).toBe(135);
    });

    it('parses stops with positions', () => {
      const g = parseLinearGradient('linear-gradient(red 0%, green 50%, blue 100%)');
      expect(g!.stops).toEqual([
        { color: 'FF0000', position: 0 },
        { color: '008000', position: 0.5 },
        { color: '0000FF', position: 1 },
      ]);
    });

    it('interpolates missing positions', () => {
      const g = parseLinearGradient('linear-gradient(red, green, blue)');
      expect(g!.stops[1]).toEqual({ color: '008000', position: 0.5 });
    });

    it('returns undefined for invalid input', () => {
      expect(parseLinearGradient('solid')).toBeUndefined();
      expect(parseLinearGradient('linear-gradient(red)')).toBeUndefined();
    });

    it('parses rgb() and color(srgb) stops with positions', () => {
      const g = parseLinearGradient(
        'linear-gradient(135deg, rgb(0, 229, 176) 0%, rgb(0, 180, 255) 100%)',
      );
      expect(g).toBeDefined();
      expect(g!.stops).toEqual([
        { color: '00E5B0', position: 0 },
        { color: '00B4FF', position: 1 },
      ]);

      const g2 = parseLinearGradient(
        'linear-gradient(0deg, color(srgb 0.0313726 0.0392157 0.054902 / 0.92) 0%, color(srgb 0 0 0 / 0.45) 100%)',
      );
      expect(g2).toBeDefined();
      expect(g2!.stops).toHaveLength(2);
      expect(g2!.stops[0].color).toBe('080A0E');
      expect(g2!.stops[0].position).toBe(0);
      expect(g2!.stops[1].color).toBe('000000');
      expect(g2!.stops[1].position).toBe(1);
    });
  });

  describe('classifyGradient', () => {
    it('classifies single gradients', () => {
      expect(classifyGradient('linear-gradient(red, blue)')).toBe('linear');
      expect(classifyGradient('radial-gradient(circle, red, blue)')).toBe('radial');
      expect(classifyGradient('conic-gradient(red, blue)')).toBe('conic');
    });

    it('classifies multiple gradients as multiple', () => {
      expect(
        classifyGradient(
          'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        ),
      ).toBe('multiple');
    });
  });

  describe('parseBoxShadow', () => {
    it('parses outer shadow', () => {
      const s = parseBoxShadow('2px 3px 4px rgba(0,0,0,0.3)');
      expect(s).toBeDefined();
      expect(s!.type).toBe('outer');
      expect(s!.color).toBe('000000');
      expect(s!.transparency).toBe(70);
      expect(s!.blur).toBe(4);
    });

    it('parses inset shadow', () => {
      const s = parseBoxShadow('inset 0 0 10px red');
      expect(s!.type).toBe('inner');
      expect(s!.color).toBe('FF0000');
    });

    it('returns undefined for none', () => {
      expect(parseBoxShadow('none')).toBeUndefined();
    });
  });

  describe('parseClipPath', () => {
    it('returns vectorizable true for none', () => {
      expect(parseClipPath('none')).toEqual({ vectorizable: true });
    });

    it('marks circle/ellipse/inset as vectorizable', () => {
      expect(parseClipPath('circle(50%)').vectorizable).toBe(true);
      expect(parseClipPath('ellipse(50% 30%)').vectorizable).toBe(true);
      expect(parseClipPath('inset(10px 20px)').vectorizable).toBe(true);
    });

    it('marks polygon/path/url as not vectorizable', () => {
      expect(parseClipPath('polygon(0 0, 100% 0, 50% 100%)').vectorizable).toBe(false);
      expect(parseClipPath('url(#clip)').vectorizable).toBe(false);
      expect(parseClipPath('path("M0 0 L10 10")').vectorizable).toBe(false);
    });
  });
});
