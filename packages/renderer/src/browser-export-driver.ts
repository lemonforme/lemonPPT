// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 浏览器端导出驱动页生成器。
 *
 * 当服务端无法启动 Chromium 时，渲染一个包含 deck 静态 markup 的 HTML 页面，
 * 由用户浏览器完成截图 / PPTX 组装 / PDF 图片上传，服务端只做文件 I/O。
 */

import type { DeckGoal } from '@lemonppt/core';
import { renderDeck } from './render.js';

export interface BrowserExportDriverOptions {
  /** deck 数据 */
  goal: DeckGoal;
  /** 导出模式：pptx 在浏览器内组装后 POST base64；pdf 截图后 POST base64 数组 */
  mode: 'pdf' | 'pptx';
  /** 接收导出结果的回调 URL */
  callbackUrl: string;
  /** 页面宽度，默认 1280 */
  width?: number;
  /** 页面高度，默认 720 */
  height?: number;
  /** 像素比，默认 2 */
  pixelRatio?: number;
  /** 静态资源基础路径，默认 ./assets */
  assetBaseUrl?: string;
}

function buildDriverScript(options: BrowserExportDriverOptions): string {
  const { mode, callbackUrl, width = 1280, height = 720, pixelRatio = 2 } = options;
  const title = options.goal.title || 'Presentation';
  const hasCallback = Boolean(callbackUrl);

  return `<script>
(function() {
  async function postJSON(url, payload) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error('Callback failed: ' + text);
    }
    return res.json();
  }

  function downloadBase64(filename, mimeType, base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function run() {
    const api = window.__lemonPPT_browserExport;
    if (!api) {
      document.body.innerHTML = '<div style="padding:40px;color:red">浏览器端导出脚本未加载</div>';
      return;
    }

    document.body.innerHTML += '<div id="lp-export-status" style="position:fixed;top:16px;left:16px;z-index:99999;background:#111;color:#fff;padding:12px 16px;border-radius:8px;font-family:system-ui,sans-serif">正在导出 ${mode.toUpperCase()}，请稍候...</div>';

    try {
      const exportOptions = { width: ${width}, height: ${height}, pixelRatio: ${pixelRatio}, title: ${JSON.stringify(title)}, author: 'lemonPPT' };
      let result;
      if (${mode === 'pptx' ? 'true' : 'false'}) {
        result = await api.exportDeckToPptxInBrowser(exportOptions);
      } else {
        result = await api.exportDeckToPdfInBrowser(exportOptions);
      }

      const status = document.getElementById('lp-export-status');

      if (${hasCallback ? 'true' : 'false'}) {
        if (status) status.textContent = '正在上传结果到服务端...';
        const callbackResult = await postJSON(${JSON.stringify(callbackUrl)}, {
          mode: ${JSON.stringify(mode)},
          filename: result.filename,
          mimeType: result.mimeType,
          base64: result.base64,
        });
        if (callbackResult && callbackResult.downloadUrl) {
          window.location.href = callbackResult.downloadUrl;
        } else {
          document.body.innerHTML = '<div style="padding:40px;color:green">导出完成，但服务端未返回下载地址</div>';
        }
      } else {
        if (status) status.textContent = '正在保存到本地...';
        downloadBase64(result.filename, result.mimeType, result.base64);
        document.body.innerHTML = '<div style="padding:40px;color:green">导出完成，文件已开始下载</div>';
      }
    } catch (err) {
      const message = err && err.message ? err.message : String(err);
      document.body.innerHTML = '<div style="padding:40px;color:red">导出失败：' + escapeHtml(message) + '</div>';
      console.error(err);
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(run, 100);
  } else {
    document.addEventListener('DOMContentLoaded', run);
  }
})();
</script>`;
}

/**
 * 生成浏览器端导出驱动页 HTML。
 */
export function renderBrowserExportDriver(options: BrowserExportDriverOptions): string {
  const { goal, width, height } = options;
  const { html } = renderDeck(goal, { width, height });
  const assetBase = (options.assetBaseUrl || './assets').replace(/\/$/, '');

  // 将 deck 内部相对资源路径替换为指定的静态资源基础路径，确保在独立路由下资源可加载
  const htmlWithBase = html.replace(/\.\/assets\//g, `${assetBase}/`);

  const vendorScripts = [
    `<script src="${assetBase}/vendor/html-to-image.js"></script>`,
    `<script src="${assetBase}/vendor/pdf-lib.js"></script>`,
    `<script src="${assetBase}/vendor/pptxgenjs.js"></script>`,
    `<script src="${assetBase}/browser-export.js"></script>`,
  ].join('\n');

  const driverScript = buildDriverScript(options);

  // 在 </body> 前注入 vendor 脚本和驱动脚本
  if (htmlWithBase.includes('</body>')) {
    return htmlWithBase.replace('</body>', `${vendorScripts}\n${driverScript}\n</body>`);
  }

  // 兜底：追加到末尾
  return `${htmlWithBase}\n${vendorScripts}\n${driverScript}`;
}
