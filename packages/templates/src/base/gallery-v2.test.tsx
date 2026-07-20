// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, it } from 'vitest';
import { GalleryV2, galleryV2Meta } from './gallery-v2.js';

describe('gallery_v2', () => {
  it('should have correct meta', () => {
    expect(galleryV2Meta.id).toBe('gallery_v2');
    expect(galleryV2Meta.role).toBe('gallery');
  });

  it('should render 3-column image grid', () => {
    const result = GalleryV2({
      title: '客户案例',
      images: [
        { url: 'https://example.com/a.jpg', caption: '案例一' },
        { url: 'https://example.com/b.jpg', caption: '案例二' },
        { url: 'https://example.com/c.jpg', caption: '案例三' },
      ],
    });
    expect(result).toBeDefined();
  });
});
