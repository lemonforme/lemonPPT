// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Buffer } from 'node:buffer';
import { execFile } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export interface PptxValidationResult {
  valid: boolean;
  errors: string[];
  slideCount?: number;
  fileSize?: number;
}

export interface PptxValidationOptions {
  /** 期望的页数；不填则跳过校验 */
  expectedSlideCount?: number;
  /** 每页最小字节数；不填则使用启发值 */
  minBytesPerSlide?: number;
}

/**
 * 校验 PPTX buffer 是否为合法 ZIP 包。
 */
function isZipBuffer(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b;
}

/**
 * 通过扫描 buffer 统计 ppt/slides/slideN.xml 数量。
 * 不依赖外部解压库，作为 unzip 不可用时兜底。
 */
function countSlidesFallback(buffer: Buffer): number {
  const marker = Buffer.from('ppt/slides/slide');
  let count = 0;
  let offset = 0;
  while ((offset = buffer.indexOf(marker, offset)) !== -1) {
    offset += marker.length;
    // 后续应为数字 + .xml
    let numEnd = offset;
    while (numEnd < buffer.length && buffer[numEnd] >= 0x30 && buffer[numEnd] <= 0x39) {
      numEnd++;
    }
    if (
      numEnd > offset &&
      buffer[numEnd] === 0x2e &&
      buffer[numEnd + 1] === 0x78 &&
      buffer[numEnd + 2] === 0x6d &&
      buffer[numEnd + 3] === 0x6c
    ) {
      count++;
      offset = numEnd + 4;
    }
  }
  return count;
}

/**
 * 使用系统 unzip 命令列出 PPTX 内容并统计页数。
 * macOS unzip 不支持 stdin，因此先将 buffer 写入临时文件。
 */
async function countSlidesWithUnzip(buffer: Buffer): Promise<{ count: number; error?: string }> {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'lemonppt-validate-'));
  const tempFile = path.join(tempDir, 'deck.pptx');
  try {
    await writeFile(tempFile, buffer);
    const { stdout } = await execFileAsync('unzip', ['-l', tempFile], {
      encoding: 'utf8',
      maxBuffer: 8 * 1024 * 1024,
    });
    const slideRegex = /ppt\/slides\/slide(\d+)\.xml/g;
    let maxIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = slideRegex.exec(stdout)) !== null) {
      maxIndex = Math.max(maxIndex, parseInt(match[1], 10));
    }
    return { count: maxIndex };
  } catch (err) {
    return {
      count: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

/**
 * 校验 DOM-to-PPTX 输出 Buffer 的基本完整性。
 */
export async function validatePptxOutput(
  buffer: Buffer,
  options: PptxValidationOptions = {},
): Promise<PptxValidationResult> {
  const { expectedSlideCount, minBytesPerSlide } = options;
  const result: PptxValidationResult = { valid: true, errors: [], fileSize: buffer.length };

  if (!buffer || buffer.length === 0) {
    result.valid = false;
    result.errors.push('PPTX buffer 为空');
    return result;
  }

  if (!isZipBuffer(buffer)) {
    result.valid = false;
    result.errors.push('PPTX buffer 不是合法 ZIP 格式');
    return result;
  }

  let slideCount = 0;
  const unzipResult = await countSlidesWithUnzip(buffer);
  if (unzipResult.error) {
    slideCount = countSlidesFallback(buffer);
    if (slideCount === 0) {
      result.errors.push(`系统 unzip 不可用且 fallback 未识别到幻灯片: ${unzipResult.error}`);
    }
  } else {
    slideCount = unzipResult.count;
  }
  result.slideCount = slideCount;

  if (expectedSlideCount !== undefined && slideCount !== expectedSlideCount) {
    result.valid = false;
    result.errors.push(`页数不匹配: 期望 ${expectedSlideCount}，实际 ${slideCount}`);
  }

  if (slideCount > 0) {
    const minPerSlide = minBytesPerSlide ?? 4096;
    const avg = buffer.length / slideCount;
    if (avg < minPerSlide) {
      result.valid = false;
      result.errors.push(
        `平均每页字节数过低: ${Math.round(avg)} B/页，可能截图或内容缺失`,
      );
    }
  } else {
    result.valid = false;
    result.errors.push('未识别到任何幻灯片');
  }

  return result;
}
