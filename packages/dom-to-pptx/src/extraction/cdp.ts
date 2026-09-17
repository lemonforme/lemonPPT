// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * CDP（Chrome DevTools Protocol）高效 DOM/图层提取实验模块。
 *
 * 借鉴 deckforge 的思路：
 * - DOMSnapshot.captureSnapshot：一次 CDP 调用获取页面布局、文本框、计算样式。
 * - LayerTree：获取合成层并捕获层截图，用于复杂区域 fallback。
 *
 * 本模块为阶段 2 POC，仅用于评估和对比，不替代现有 JS 注入提取。
 */

import type { CDPSession, Page } from 'playwright';

export interface CdpBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CdpNodeLayoutInfo {
  backendNodeId: number;
  paintOrder: number;
  bounds: CdpBounds;
}

export interface CdpRawTextBox {
  layoutIndex: number;
  bounds: CdpBounds;
  start: number;
  length: number;
}

export interface CdpDomSnapshot {
  /** backendNodeId -> 布局信息 */
  layoutMap: Map<number, CdpNodeLayoutInfo>;
  /** 文本框原始数据 */
  textBoxes: CdpRawTextBox[];
  /** 共享字符串表 */
  strings: string[];
  /** 节点类型索引数组 */
  nodeTypes: number[];
  /** 节点名称在字符串表中的索引 */
  nodeNames: number[];
  /** backendNodeId 数组 */
  backendNodeIds: number[];
  /** 父节点索引数组 */
  parentIndices: number[];
  /** 布局项对应的文本（字符串表索引） */
  layoutTexts: number[];
  /** 布局项对应的节点索引 */
  layoutNodeIndices: number[];
  /** 布局项样式索引 */
  layoutStyles: number[][];
  /** 布局项绘制顺序 */
  layoutPaintOrders: number[];
}

export interface CdpLayerScreenshot {
  layerId: string;
  dataURL: string;
}

export interface CdpLayer {
  layerId: string;
  backendNodeId: number;
  bounds: CdpBounds;
  paintOrder: number;
  drawsContent: boolean;
  imageData?: Buffer;
  offsetX: number;
  offsetY: number;
  transform: number[] | null;
}

/**
 * 为指定页面创建 CDP Session。
 */
export async function createCdpSession(page: Page): Promise<CDPSession> {
  return page.context().newCDPSession(page);
}

/**
 * 使用 DOMSnapshot.captureSnapshot 捕获页面 DOM 与布局快照。
 *
 * 一次 CDP 调用即可获取：
 * - 所有节点的边界框（bounds）
 * - 文本框位置与字符范围
 * - 计算样式（用于后续文本渲染）
 * - 绘制顺序（paint order）
 */
export async function captureDomSnapshot(_page: Page, cdp: CDPSession): Promise<CdpDomSnapshot> {
  const snapshot = await cdp.send('DOMSnapshot.captureSnapshot', {
    computedStyles: [
      'font-size',
      'font-family',
      'font-weight',
      'font-style',
      'color',
      'opacity',
      'text-align',
      'letter-spacing',
      'line-height',
      'text-decoration-line',
      'background-color',
      'border-radius',
    ],
    includePaintOrder: true,
    includeDOMRects: true,
    includeTextColorOpacities: true,
  });

  const doc = snapshot.documents?.[0];
  if (!doc) {
    throw new Error('DOMSnapshot.captureSnapshot 未返回 documents[0]');
  }

  const layout = doc.layout ?? {};
  const nodes = doc.nodes ?? {};
  const strings = snapshot.strings ?? [];
  const textBoxesData = doc.textBoxes ?? {};

  const layoutMap = parseLayoutMap(layout, nodes);
  const textBoxes = parseTextBoxes(textBoxesData);

  return {
    layoutMap,
    textBoxes,
    strings,
    nodeTypes: nodes.nodeType ?? [],
    nodeNames: nodes.nodeName ?? [],
    backendNodeIds: nodes.backendNodeId ?? [],
    parentIndices: nodes.parentIndex ?? [],
    layoutTexts: layout.text ?? [],
    layoutNodeIndices: layout.nodeIndex ?? [],
    layoutStyles: layout.styles ?? [],
    layoutPaintOrders: layout.paintOrders ?? [],
  };
}

function parseLayoutMap(layout: any, nodes: any): Map<number, CdpNodeLayoutInfo> {
  const layoutMap = new Map<number, CdpNodeLayoutInfo>();
  const nodeIndices: number[] = layout?.nodeIndex ?? [];
  const boundsList: number[][] = layout?.bounds ?? [];
  const paintOrders: number[] = layout?.paintOrders ?? [];
  const backendNodeIds: number[] = nodes?.backendNodeId ?? [];

  for (let i = 0; i < nodeIndices.length; i++) {
    const nodeIdx = nodeIndices[i];
    if (nodeIdx >= backendNodeIds.length) continue;

    const backendNodeId = backendNodeIds[nodeIdx];
    const rawBounds = i < boundsList.length ? boundsList[i] : [0, 0, 0, 0];
    const paintOrder = i < paintOrders.length ? paintOrders[i] : 0;

    layoutMap.set(backendNodeId, {
      backendNodeId,
      paintOrder,
      bounds: {
        x: rawBounds[0] ?? 0,
        y: rawBounds[1] ?? 0,
        width: rawBounds[2] ?? 0,
        height: rawBounds[3] ?? 0,
      },
    });
  }

  return layoutMap;
}

function parseTextBoxes(textBoxesData: any): CdpRawTextBox[] {
  const textBoxes: CdpRawTextBox[] = [];
  const layoutIndices: number[] = textBoxesData?.layoutIndex ?? [];
  const boundsList: number[][] = textBoxesData?.bounds ?? [];
  const starts: number[] = textBoxesData?.start ?? [];
  const lengths: number[] = textBoxesData?.length ?? [];

  for (let i = 0; i < layoutIndices.length; i++) {
    if (i >= boundsList.length) continue;
    const rawBounds = boundsList[i];
    if (!Array.isArray(rawBounds) || rawBounds.length < 4) continue;

    textBoxes.push({
      layoutIndex: layoutIndices[i],
      bounds: {
        x: rawBounds[0],
        y: rawBounds[1],
        width: rawBounds[2],
        height: rawBounds[3],
      },
      start: i < starts.length ? starts[i] : 0,
      length: i < lengths.length ? lengths[i] : 0,
    });
  }

  return textBoxes;
}

/**
 * 启用 LayerTree 并捕获当前页面合成层列表。
 *
 * 返回的层包含 bounds、backendNodeId、drawsContent 等元数据，但不含截图；
 * 如需层截图请调用 captureLayerScreenshots。
 */
export async function captureLayers(page: Page, cdp: CDPSession): Promise<CdpLayer[]> {
  let received = false;
  let layers: any[] = [];

  const handler = (params: any) => {
    if (params.layers && params.layers.length > 0) {
      layers = params.layers;
      received = true;
    }
  };

  cdp.on('LayerTree.layerTreeDidChange', handler);

  try {
    await cdp.send('LayerTree.enable');

    // 注入 will-change 提升合成层，触发 layerTreeDidChange。
    await page.evaluate(() => {
      document.querySelectorAll('*').forEach((el) => {
        const style = window.getComputedStyle(el);
        if (style.display !== 'inline' && style.display !== 'contents') {
          (el as HTMLElement).style.willChange = 'transform';
        }
      });
    });

    await page.waitForTimeout(200);

    // 强制重绘以触发事件。
    if (!received) {
      await page.evaluate(() => {
        document.body.style.zoom = '1.0001';
        void document.body.offsetHeight;
        document.body.style.zoom = '1';
        void document.body.offsetHeight;
      });
      await page.waitForTimeout(500);
    }
  } finally {
    cdp.off('LayerTree.layerTreeDidChange', handler);
  }

  return layers
    .filter((layer: any) => layer.drawsContent && (layer.backendNodeId ?? 0) !== 0)
    .map((layer: any) => {
      const offsetX = layer.offsetX ?? 0;
      const offsetY = layer.offsetY ?? 0;
      const layerWidth = layer.width ?? 0;
      const layerHeight = layer.height ?? 0;
      const transform = layer.transform ?? null;

      let x = offsetX;
      let y = offsetY;
      if (transform && transform.length >= 14) {
        x += transform[12];
        y += transform[13];
      }

      return {
        layerId: String(layer.layerId),
        backendNodeId: layer.backendNodeId,
        bounds: { x, y, width: layerWidth, height: layerHeight },
        paintOrder: layer.paintOrder ?? 0,
        drawsContent: true,
        offsetX,
        offsetY,
        transform,
      };
    });
}

/**
 * 对指定 layerId 列表捕获层截图，返回 data URL 映射。
 */
export async function captureLayerScreenshots(
  cdp: CDPSession,
  layerIds: string[],
): Promise<Map<string, Buffer>> {
  const result = new Map<string, Buffer>();

  for (const layerId of layerIds) {
    try {
      const snapshotResult: any = await cdp.send('LayerTree.makeSnapshot', { layerId });
      const snapshotId = snapshotResult.snapshotId;
      const replayResult: any = await cdp.send('LayerTree.replaySnapshot', {
        snapshotId,
        scale: 1.0,
      });
      await cdp.send('LayerTree.releaseSnapshot', { snapshotId });

      const dataURL: string = replayResult.dataURL ?? '';
      const commaIndex = dataURL.indexOf(',');
      if (commaIndex > 0) {
        const base64 = dataURL.slice(commaIndex + 1);
        result.set(layerId, Buffer.from(base64, 'base64'));
      }
    } catch {
      // 单个层截图失败不影响其他层。
    }
  }

  return result;
}

/**
 * 在字符串表中查找节点名称。
 */
export function getNodeName(snapshot: CdpDomSnapshot, nodeIndex: number): string | undefined {
  const nameIdx = snapshot.nodeNames[nodeIndex];
  if (typeof nameIdx !== 'number') return undefined;
  return snapshot.strings[nameIdx];
}

/**
 * 查找所有匹配指定标签名的 backendNodeId。
 */
export function getBackendNodeIdsForElements(
  snapshot: CdpDomSnapshot,
  elementName: string,
): number[] {
  const result: number[] = [];
  const lower = elementName.toLowerCase();

  for (let idx = 0; idx < snapshot.backendNodeIds.length; idx++) {
    const name = getNodeName(snapshot, idx);
    if (name && name.toLowerCase() === lower) {
      result.push(snapshot.backendNodeIds[idx]);
    }
  }

  return result;
}

// =============================================================================
// 转换为内部 SlideData 结构（POC 最小实现）
// =============================================================================

export interface CdpExtractedSlide {
  path: string;
  textBoxes: Array<{
    text: string;
    x: number;
    y: number;
    w: number;
    h: number;
    fontFamilies: string[];
    fontSize: number;
    color: string;
    bold: boolean;
    italic: boolean;
    align: 'left' | 'center' | 'right';
    valign: 'top' | 'middle' | 'bottom';
  }>;
  shapes: any[];
  images: Array<{ src: string; x: number; y: number; w: number; h: number }>;
  fallbackRegions: Array<{
    path?: string;
    x: number;
    y: number;
    w: number;
    h: number;
    imageOnly?: boolean;
    kind?: 'chart' | 'table' | 'decoration' | 'generic';
  }>;
  warnings: Array<{ slide: number; type: string; detail?: string }>;
}

function getStyleValue(snapshot: CdpDomSnapshot, layoutIndex: number, property: string): string | undefined {
  const styles = snapshot.layoutStyles[layoutIndex];
  if (!styles) return undefined;

  const strings = snapshot.strings;
  for (let i = 0; i < styles.length - 1; i += 2) {
    const nameIdx = styles[i];
    const valueIdx = styles[i + 1];
    if (strings[nameIdx] === property) {
      return strings[valueIdx];
    }
  }
  return undefined;
}

function rgbToHex(value: string | undefined): string | undefined {
  if (!value || value === 'none' || value === 'transparent') return undefined;
  const m = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!m) return undefined;
  const toHex = (n: string) => parseInt(n, 10).toString(16).padStart(2, '0');
  return `#${toHex(m[1])}${toHex(m[2])}${toHex(m[3])}`;
}

/**
 * 将 CDP DOMSnapshot 转换为内部可组装的 SlideData 结构。
 *
 * POC 范围：
 * - 文本框：从 snapshot.textBoxes 还原文本内容与基础样式。
 * - 图片：从 <img> 节点还原 src 与边界框。
 * - 区域：预留，当前返回空数组（后续可结合 data-lp-fallback-region 标注）。
 * - 形状：预留，当前返回空数组（后续可结合 LayerTree 或形状检测）。
 */
function intersects(a: CdpBounds, b: CdpBounds, tolerance = 0): boolean {
  return (
    a.x < b.x + b.width + tolerance &&
    a.x + a.width > b.x - tolerance &&
    a.y < b.y + b.height + tolerance &&
    a.y + a.height > b.y - tolerance
  );
}

export function convertCdpSnapshotToSlideData(
  snapshot: CdpDomSnapshot,
  options: { screenshotPath: string; slideIndex: number; slideBounds?: CdpBounds },
): CdpExtractedSlide {
  const { screenshotPath, slideIndex: _slideIndex, slideBounds } = options;
  const textBoxes: CdpExtractedSlide['textBoxes'] = [];
  const warnings: CdpExtractedSlide['warnings'] = [];

  for (const tb of snapshot.textBoxes) {
    if (tb.length <= 0) continue;

    // 如果指定了 slideBounds，只保留与当前幻灯片区域相交的文本框。
    if (slideBounds && !intersects(tb.bounds, slideBounds, 2)) continue;

    const layoutIndex = tb.layoutIndex;
    const nodeIdx = snapshot.layoutNodeIndices[layoutIndex];
    const textStart = snapshot.layoutTexts[layoutIndex];

    if (typeof textStart !== 'number' || nodeIdx == null) continue;

    // 从共享字符串表拼接文本。
    let text = '';
    for (let i = 0; i < tb.length; i++) {
      const charIdx = textStart + i;
      if (charIdx >= snapshot.strings.length) break;
      text += snapshot.strings[charIdx];
    }
    text = text.trim();
    if (!text) continue;

    const fontSizeStr = getStyleValue(snapshot, layoutIndex, 'font-size');
    const fontSize = fontSizeStr ? parseFloat(fontSizeStr) : 16;
    if (!fontSize || fontSize <= 0) continue;

    const color = rgbToHex(getStyleValue(snapshot, layoutIndex, 'color')) ?? '#000000';
    const fontFamilyStr = getStyleValue(snapshot, layoutIndex, 'font-family') ?? 'sans-serif';
    const fontFamilies = fontFamilyStr
      .split(',')
      .map((s) => s.replace(/['"]/g, '').trim())
      .filter(Boolean);

    const fontWeight = getStyleValue(snapshot, layoutIndex, 'font-weight') ?? '400';
    const bold = fontWeight === 'bold' || parseInt(fontWeight, 10) >= 600;
    const italic = getStyleValue(snapshot, layoutIndex, 'font-style') === 'italic';

    const textAlign = getStyleValue(snapshot, layoutIndex, 'text-align') ?? 'left';
    let align: 'left' | 'center' | 'right' = 'left';
    if (textAlign === 'center') align = 'center';
    else if (textAlign === 'right' || textAlign === 'end') align = 'right';

    textBoxes.push({
      text,
      x: tb.bounds.x,
      y: tb.bounds.y,
      w: tb.bounds.width,
      h: tb.bounds.height,
      fontFamilies,
      fontSize,
      color,
      bold,
      italic,
      align,
      valign: 'top',
    });
  }

  // 图片：扫描 <img> 节点，从 layoutMap 取边界框。
  const images: CdpExtractedSlide['images'] = [];
  const imgBackendIds = getBackendNodeIdsForElements(snapshot, 'img');
  for (const backendNodeId of imgBackendIds) {
    const layoutInfo = snapshot.layoutMap.get(backendNodeId);
    if (!layoutInfo || layoutInfo.bounds.width < 1 || layoutInfo.bounds.height < 1) continue;

    // DOMSnapshot 不直接提供 src，POC 中通过 JS 注入补充更可靠；此处仅记录占位。
    images.push({
      src: '',
      x: layoutInfo.bounds.x,
      y: layoutInfo.bounds.y,
      w: layoutInfo.bounds.width,
      h: layoutInfo.bounds.height,
    });
  }

  return {
    path: screenshotPath,
    textBoxes,
    shapes: [],
    images,
    fallbackRegions: [],
    warnings,
  };
}
