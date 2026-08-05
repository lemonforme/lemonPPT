// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Slide } from '@lemonppt/core';

// 使用内联 SVG 占位图，避免外部网络依赖导致渲染/导出超时或失败
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjgwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZTJlOGYwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojY2JkNWUxIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iODAwIiBmaWxsPSJ1cmwoI2cpIi8+PGNpcmNsZSBjeD0iNjAwIiBjeT0iMzIwIiByPSIxMjAiIGZpbGw9IiM5NGEzYjgiIG9wYWNpdHk9IjAuMyIvPjxyZWN0IHg9IjQyMCIgeT0iNTIwIiB3aWR0aD0iMzYwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzk0YTNiOCIgb3BhY2l0eT0iMC4zIi8+PC9zdmc+';
const PLACEHOLDER_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNjYmQ1ZTEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM5NGEzYjgiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNnKSIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSI0MCIgZmlsbD0iIzY0NzQ4YiIvPjxlbGxpcHNlIGN4PSIxMDAiIGN5PSIxOTAiIHJ4PSI3MCIgcnk9IjUwIiBmaWxsPSIjNjQ3NDhiIi8+PC9zdmc+';
const PLACEHOLDER_COVER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I2YxZjVmOSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2NiZDVlMSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIGZpbGw9InVybCgjZykiLz48Y2lyY2xlIGN4PSI5NjAiIGN5PSI0NDAiIHI9IjIwMCIgZmlsbD0iIzk0YTNiOCIgb3BhY2l0eT0iMC4yNSIvPjxyZWN0IHg9IjY2MCIgeT0iNzYwIiB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwIiByeD0iMTIiIGZpbGw9IiM5NGEzYjgiIG9wYWNpdHk9IjAuMjUiLz48L3N2Zz4=';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function ensureString(props: Record<string, unknown>, key: string, fallback: string): string {
  if (isNonEmptyString(props[key])) return props[key] as string;
  props[key] = fallback;
  return fallback;
}

function ensureArray(props: Record<string, unknown>, key: string, fallback: unknown[]): unknown[] {
  const value = props[key];
  if (Array.isArray(value) && value.length > 0) return value;
  props[key] = fallback;
  return fallback;
}

function ensureObjectArray(
  props: Record<string, unknown>,
  key: string,
  fallback: Record<string, unknown>[],
): Record<string, unknown>[] {
  const arr = ensureArray(props, key, fallback);
  return arr.filter((item): item is Record<string, unknown> => item !== null && typeof item === 'object');
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => (typeof item === 'string' ? item : String(item ?? ''))).filter(Boolean);
}

function asObjectArray(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Record<string, unknown> => item !== null && typeof item === 'object');
}

function splitPoints(points: string[], perSide = 2): { left: string[]; right: string[] } {
  const safe = points.filter(Boolean);
  const mid = Math.min(perSide, Math.ceil(safe.length / 2));
  return { left: safe.slice(0, mid), right: safe.slice(mid, mid + perSide) };
}

function objectToStringStep(step: Record<string, unknown>): string {
  const title = isNonEmptyString(step.title) ? step.title : '';
  const description = isNonEmptyString(step.description) ? step.description : '';
  return title && description ? `${title}：${description}` : title || description || '步骤';
}

function stringToObjectStep(step: unknown): Record<string, unknown> {
  const text = typeof step === 'string' ? step : String(step ?? '');
  const [title = '步骤', description = ''] = text.split(/[:：]/, 2).map((s) => s.trim());
  return { title: title || '步骤', description };
}

function alignLabelsAndData(labels: string[], data: number[]): { labels: string[]; data: number[] } {
  const count = Math.max(1, Math.min(labels.length || data.length, 8));
  const alignedLabels: string[] = [];
  const alignedData: number[] = [];
  for (let i = 0; i < count; i++) {
    alignedLabels.push(labels[i] ?? `节点 ${i + 1}`);
    alignedData.push(typeof data[i] === 'number' ? data[i] : 0);
  }
  return { labels: alignedLabels, data: alignedData };
}

function ensureTitle(props: Record<string, unknown>, fallback = '标题'): void {
  ensureString(props, 'title', fallback);
}

function deriveValueFromMetrics(metrics: Record<string, unknown>[]): string {
  const first = metrics[0];
  if (!first) return '100';
  if (isNonEmptyString(first.value)) return first.value;
  return '100';
}

/**
 * 根据具体版式补全/转换 props，保证每个版式都能拿到它真正需要的数据结构。
 */
/**
 * 将带主题前缀的 layout ID（如 theme01_process_v1）还原为版式 ID（process_v1），
 * 同时兼容不带前缀的 legacy ID。
 */
function normalizeLayoutId(layout: string): string {
  const idx = layout.indexOf('_');
  return idx > 0 ? layout.slice(idx + 1) : layout;
}

function patchSlideContentForLayout(slide: Slide, props: Record<string, unknown>): void {
  const rawLayout = slide.layout ?? '';
  if (!rawLayout) return;
  const layout = normalizeLayoutId(rawLayout);

  // cover / closing / simple pages
  if (layout.startsWith('cover')) {
    ensureString(props, 'title', '演示标题');
    return;
  }

  if (layout.startsWith('closing')) {
    ensureString(props, 'title', '感谢观看');
    return;
  }

  if (layout.startsWith('table_of_contents')) {
    ensureTitle(props, '目录');
    ensureArray(props, 'items', ['内容一', '内容二', '内容三']);
    return;
  }

  // metric
  if (layout === 'metric_v1' || layout === 'metric_v2') {
    if (Array.isArray(props.metrics) && props.metrics.length > 0) {
      const metrics = asObjectArray(props.metrics);
      props.value = deriveValueFromMetrics(metrics);
      if (!isNonEmptyString(props.unit) && isNonEmptyString(metrics[0]?.unit)) {
        props.unit = metrics[0].unit;
      }
      if (!isNonEmptyString(props.label) && isNonEmptyString(metrics[0]?.label)) {
        props.label = metrics[0].label;
      }
    }
    ensureString(props, 'value', '100');
    ensureString(props, 'unit', '%');
    ensureString(props, 'label', '核心指标');
    return;
  }

  if (layout === 'metric_v3') {
    ensureTitle(props, '核心指标');
    const metrics = ensureObjectArray(props, 'metrics', [
      { label: '核心指标 A', value: '100', unit: '%', change: '+12%' },
      { label: '核心指标 B', value: '85', unit: '%', change: '+8%' },
    ]);
    // 补齐每个指标字段
    props.metrics = metrics.map((m) => ({
      label: isNonEmptyString(m.label) ? m.label : '指标',
      value: isNonEmptyString(m.value) ? m.value : '0',
      unit: isNonEmptyString(m.unit) ? m.unit : '%',
      change: isNonEmptyString(m.change) ? m.change : '',
    }));
    return;
  }

  // stats
  if (layout.startsWith('stats')) {
    ensureTitle(props, '关键指标');
    const stats = ensureObjectArray(props, 'stats', [
      { label: '指标 A', value: '100', unit: '%', change: '+10%' },
      { label: '指标 B', value: '85', unit: '%', change: '+8%' },
      { label: '指标 C', value: '70', unit: '%', change: '+5%' },
      { label: '指标 D', value: '60', unit: '%', change: '+3%' },
    ]);
    props.stats = stats.map((s) => ({
      label: isNonEmptyString(s.label) ? s.label : '指标',
      value: isNonEmptyString(s.value) ? s.value : '0',
      unit: isNonEmptyString(s.unit) ? s.unit : '%',
      change: isNonEmptyString(s.change) ? s.change : '',
    }));
    return;
  }

  // chart
  if (layout === 'chart_v1') {
    ensureTitle(props, '数据趋势');
    const rawLabels = asStringArray(props.labels);
    const rawData = Array.isArray(props.data) ? props.data.filter((n): n is number => typeof n === 'number') : [];
    const aligned = alignLabelsAndData(rawLabels, rawData);
    if (aligned.labels.length === 0) {
      aligned.labels = ['Q1', 'Q2', 'Q3', 'Q4'];
      aligned.data = [20, 45, 70, 95];
    }
    props.labels = aligned.labels;
    props.data = aligned.data;
    ensureString(props, 'unit', '%');
    return;
  }

  if (layout === 'chart_v2') {
    ensureTitle(props, '多系列对比');
    let labels = asStringArray(props.labels);
    if (labels.length === 0) labels = ['Q1', 'Q2', 'Q3', 'Q4'];
    let datasets = asObjectArray(props.datasets);
    if (datasets.length === 0 && Array.isArray(props.data)) {
      const data = props.data.filter((n): n is number => typeof n === 'number');
      datasets = [{ label: '数据', data: data.length > 0 ? data : [20, 45, 70, 95] }];
    }
    if (datasets.length === 0) {
      datasets = [
        { label: '系列 A', data: [20, 45, 60, 80] },
        { label: '系列 B', data: [15, 35, 55, 75] },
      ];
    }
    props.labels = labels;
    props.datasets = datasets.map((ds) => {
      const data = Array.isArray(ds.data)
        ? ds.data.filter((n): n is number => typeof n === 'number')
        : [];
      const aligned = alignLabelsAndData(labels, data);
      return {
        label: isNonEmptyString(ds.label) ? ds.label : '数据',
        data: aligned.data,
        color: isNonEmptyString(ds.color) ? ds.color : undefined,
      };
    });
    ensureString(props, 'unit', '%');
    return;
  }

  // comparison
  if (layout === 'comparison_v1' || layout === 'comparison_v2') {
    ensureTitle(props, '对比分析');
    ensureString(props, 'leftTitle', layout === 'comparison_v2' ? '优势' : '方案 A');
    ensureString(props, 'rightTitle', layout === 'comparison_v2' ? '劣势' : '方案 B');
    const points = asStringArray(props.points);
    const { left, right } = splitPoints(points, 3);
    const leftPoints = asStringArray(props.leftPoints).length > 0 ? asStringArray(props.leftPoints) : left;
    const rightPoints = asStringArray(props.rightPoints).length > 0 ? asStringArray(props.rightPoints) : right;
    props.leftPoints = leftPoints.length > 0 ? leftPoints : ['对比点 A', '对比点 B'];
    props.rightPoints = rightPoints.length > 0 ? rightPoints : ['对比点 C', '对比点 D'];
    return;
  }

  if (layout === 'comparison_v3') {
    ensureTitle(props, '对比分析');
    ensureString(props, 'leftTitle', '方案 A');
    ensureString(props, 'rightTitle', '方案 B');
    const rows = asObjectArray(props.rows);
    if (rows.length === 0) {
      const leftPoints = asStringArray(props.leftPoints);
      const rightPoints = asStringArray(props.rightPoints);
      const count = Math.max(leftPoints.length, rightPoints.length, 3);
      props.rows = Array.from({ length: count }, (_, i) => ({
        feature: `维度 ${i + 1}`,
        left: leftPoints[i] ?? '支持',
        right: rightPoints[i] ?? '待完善',
      }));
    } else {
      props.rows = rows.map((r) => ({
        feature: isNonEmptyString(r.feature) ? r.feature : '维度',
        left: isNonEmptyString(r.left) ? r.left : '',
        right: isNonEmptyString(r.right) ? r.right : '',
      }));
    }
    return;
  }

  // pricing
  if (layout === 'pricing_v1') {
    ensureTitle(props, '价格方案');
    let tiers = asObjectArray(props.tiers);
    if (tiers.length === 0) tiers = asObjectArray(props.plans);
    if (tiers.length === 0) {
      tiers = [
        { name: '基础版', price: '¥99', period: '/月', features: ['核心功能', '邮件支持'], cta: '选择基础版' },
        { name: '专业版', price: '¥299', period: '/月', features: ['全部功能', '优先支持', '数据分析'], cta: '选择专业版' },
        { name: '企业版', price: '定制', period: '', features: ['私有化部署', '专属客户经理', 'SLA 保障'], cta: '联系我们' },
      ];
    }
    props.tiers = tiers.map((t) => ({
      name: isNonEmptyString(t.name) ? t.name : '方案',
      price: isNonEmptyString(t.price) ? t.price : '¥0',
      period: isNonEmptyString(t.period) ? t.period : '/月',
      features: asStringArray(t.features).length > 0 ? asStringArray(t.features) : ['基础功能'],
      cta: isNonEmptyString(t.cta) ? t.cta : '立即选择',
    }));
    return;
  }

  if (layout === 'pricing_v2') {
    ensureTitle(props, '价格方案');
    let plans = asObjectArray(props.plans);
    if (plans.length === 0) plans = asObjectArray(props.tiers);
    if (plans.length === 0) {
      plans = [
        { name: '基础版', price: '¥99', period: '/月', features: ['核心功能', '邮件支持'] },
        { name: '专业版', price: '¥299', period: '/月', features: ['全部功能', '优先支持', '数据分析'], highlighted: true },
        { name: '企业版', price: '定制', period: '', features: ['私有化部署', '专属客户经理', 'SLA 保障'] },
      ];
    }
    props.plans = plans.map((p) => ({
      name: isNonEmptyString(p.name) ? p.name : '方案',
      price: isNonEmptyString(p.price) ? p.price : '¥0',
      period: isNonEmptyString(p.period) ? p.period : '/月',
      features: asStringArray(p.features).length > 0 ? asStringArray(p.features) : ['基础功能'],
      highlighted: typeof p.highlighted === 'boolean' ? p.highlighted : false,
    }));
    return;
  }

  // process
  if (layout === 'process_v1') {
    ensureTitle(props, '实施流程');
    const steps = asObjectArray(props.steps);
    if (steps.length > 0) {
      props.steps = steps.map((s) => objectToStringStep(s));
    } else {
      const stringSteps = asStringArray(props.steps);
      props.steps = stringSteps.length > 0 ? stringSteps : ['需求调研', '方案落地', '持续运营'];
    }
    return;
  }

  if (layout === 'process_v2' || layout === 'process_v3') {
    ensureTitle(props, '实施流程');
    const steps = asObjectArray(props.steps);
    if (steps.length > 0) {
      props.steps = steps.map((s) => ({
        title: isNonEmptyString(s.title) ? s.title : objectToStringStep(s),
        description: isNonEmptyString(s.description) ? s.description : '',
      }));
    } else {
      const stringSteps = asStringArray(props.steps);
      props.steps = stringSteps.length > 0
        ? stringSteps.map(stringToObjectStep)
        : [
            { title: '需求调研', description: '梳理业务场景与关键痛点' },
            { title: '方案落地', description: '快速部署并接入现有工作流' },
            { title: '持续运营', description: '基于使用数据不断优化效果' },
          ];
    }
    return;
  }

  // timeline
  if (layout === 'timeline_v1' || layout === 'timeline_v2') {
    ensureTitle(props, '发展历程');
    const milestones = asObjectArray(props.milestones);
    if (milestones.length === 0) {
      props.milestones = [
        { date: '第一阶段', title: '产品立项', description: '验证核心场景与用户需求' },
        { date: '第二阶段', title: '快速迭代', description: '发布 MVP 并收集反馈' },
        { date: '第三阶段', title: '规模化', description: '服务更多客户，完善生态' },
      ];
    } else {
      props.milestones = milestones.map((m) => ({
        date: isNonEmptyString(m.date) ? m.date : '',
        title: isNonEmptyString(m.title) ? m.title : '里程碑',
        description: isNonEmptyString(m.description) ? m.description : '',
      }));
    }
    return;
  }

  if (layout === 'timeline_v3') {
    ensureTitle(props, '发展历程');
    const events = asObjectArray(props.events);
    if (events.length === 0) {
      const milestones = asObjectArray(props.milestones);
      if (milestones.length > 0) {
        props.events = milestones.map((m) => ({
          date: isNonEmptyString(m.date) ? m.date : '',
          title: isNonEmptyString(m.title) ? m.title : '事件',
          description: isNonEmptyString(m.description) ? m.description : '',
        }));
      } else {
        props.events = [
          { date: '第一阶段', title: '产品立项', description: '验证核心场景与用户需求' },
          { date: '第二阶段', title: '快速迭代', description: '发布 MVP 并收集反馈' },
          { date: '第三阶段', title: '规模化', description: '服务更多客户，完善生态' },
        ];
      }
    } else {
      props.events = events.map((e) => ({
        date: isNonEmptyString(e.date) ? e.date : '',
        title: isNonEmptyString(e.title) ? e.title : '事件',
        description: isNonEmptyString(e.description) ? e.description : '',
      }));
    }
    return;
  }

  // roadmap
  if (layout === 'roadmap_v1') {
    ensureTitle(props, '产品路线图');
    const phases = asObjectArray(props.phases);
    if (phases.length > 0 && isNonEmptyString(phases[0]?.title)) {
      props.phases = phases.map((p) => ({
        title: isNonEmptyString(p.title) ? p.title : '阶段',
        description: isNonEmptyString(p.description) ? p.description : '',
        status: isNonEmptyString(p.status) ? p.status : '',
      }));
    } else {
      props.phases = [
        { title: '短期', description: '完成核心功能打磨，验证首批客户场景', status: '进行中' },
        { title: '中期', description: '扩展平台能力，提升自动化水平', status: '规划中' },
        { title: '长期', description: '构建生态闭环，成为行业标杆', status: '愿景' },
      ];
    }
    return;
  }

  if (layout === 'roadmap_v2') {
    ensureTitle(props, '产品路线图');
    const phases = asObjectArray(props.phases);
    if (phases.length > 0 && (Array.isArray(phases[0]?.goals) || isNonEmptyString(phases[0]?.phase))) {
      props.phases = phases.map((p) => ({
        phase: isNonEmptyString(p.phase) ? p.phase : isNonEmptyString(p.title) ? p.title : '阶段',
        goals: asStringArray(p.goals).length > 0 ? asStringArray(p.goals) : ['完成关键目标'],
      }));
    } else {
      props.phases = [
        { phase: '短期', goals: ['完成核心功能打磨', '验证首批客户场景'] },
        { phase: '中期', goals: ['扩展平台能力', '提升自动化水平'] },
        { phase: '长期', goals: ['构建生态闭环', '成为行业标杆'] },
      ];
    }
    return;
  }

  // quote / testimonial
  if (layout.startsWith('quote') || layout.startsWith('testimonial')) {
    ensureString(props, 'quote', '我们致力于为客户创造可持续的价值。');
    return;
  }

  // content variants
  if (layout === 'content_v1') {
    ensureTitle(props, '内容要点');
    const points = asStringArray(props.points);
    props.points = points.length > 0 ? points : ['要点一', '要点二', '要点三'];
    return;
  }

  if (layout === 'content_v2') {
    ensureTitle(props, '内容要点');
    const points = asStringArray(props.points);
    const { left, right } = splitPoints(points, 3);
    const leftPoints = asStringArray(props.leftPoints).length > 0 ? asStringArray(props.leftPoints) : left;
    const rightPoints = asStringArray(props.rightPoints).length > 0 ? asStringArray(props.rightPoints) : right;
    props.leftPoints = leftPoints.length > 0 ? leftPoints : ['左侧要点一', '左侧要点二'];
    props.rightPoints = rightPoints.length > 0 ? rightPoints : ['右侧要点一', '右侧要点二'];
    return;
  }

  if (layout === 'content_v3' || layout === 'split_v1') {
    ensureTitle(props, '内容要点');
    const points = asStringArray(props.points);
    props.points = points.length > 0 ? points : ['要点一', '要点二', '要点三'];
    if (!isNonEmptyString(props.imageUrl) && !isNonEmptyString(props.image)) {
      props.imageUrl = PLACEHOLDER_IMAGE;
    }
    return;
  }

  if (layout === 'content_v4') {
    ensureTitle(props, '内容要点');
    const cards = asObjectArray(props.cards);
    if (cards.length === 0) {
      const points = asStringArray(props.points);
      props.cards = points.length > 0
        ? points.slice(0, 3).map((p) => ({ title: p, description: '' }))
        : [
            { title: '卡片一', description: '' },
            { title: '卡片二', description: '' },
            { title: '卡片三', description: '' },
          ];
    } else {
      props.cards = cards.slice(0, 3).map((c) => ({
        title: isNonEmptyString(c.title) ? c.title : '卡片',
        description: isNonEmptyString(c.description) ? c.description : '',
      }));
    }
    return;
  }

  // faq
  if (layout.startsWith('faq')) {
    ensureTitle(props, '常见问题');
    const items = asObjectArray(props.items);
    if (items.length === 0) {
      props.items = [
        { q: '常见问题一？', a: '这是对应的回答内容。' },
        { q: '常见问题二？', a: '这是对应的回答内容。' },
      ];
    } else {
      props.items = items.map((item) => ({
        q: isNonEmptyString(item.q) ? item.q : '问题',
        a: isNonEmptyString(item.a) ? item.a : '回答',
      }));
    }
    return;
  }

  // feature
  if (layout.startsWith('feature')) {
    ensureTitle(props, '产品特性');
    const features = asObjectArray(props.features);
    if (features.length === 0) {
      props.features = [
        { title: '核心能力', description: '支撑关键业务目标高效达成' },
        { title: '差异化优势', description: '形成与竞品显著区隔的能力' },
        { title: '长期价值', description: '持续沉淀资产并释放复利效应' },
      ];
    } else {
      props.features = features.slice(0, 4).map((f) => ({
        title: isNonEmptyString(f.title) ? f.title : '特性',
        description: isNonEmptyString(f.description) ? f.description : '',
        icon: isNonEmptyString(f.icon) ? f.icon : undefined,
      }));
    }
    if (layout === 'feature_v3' && !isNonEmptyString(props.image)) {
      props.image = PLACEHOLDER_IMAGE;
    }
    return;
  }

  // team
  if (layout.startsWith('team')) {
    ensureTitle(props, '团队介绍');
    const members = asObjectArray(props.members);
    if (members.length === 0) {
      props.members = [
        { name: '创始人', role: 'CEO', bio: '负责战略与整体方向' },
        { name: '产品负责人', role: 'CPO', bio: '聚焦用户体验与产品迭代' },
        { name: '技术负责人', role: 'CTO', bio: '主导技术架构与工程落地' },
      ];
    } else {
      props.members = members.map((m) => ({
        name: isNonEmptyString(m.name) ? m.name : '成员',
        role: isNonEmptyString(m.role) ? m.role : '职位',
        bio: isNonEmptyString(m.bio) ? m.bio : '',
        imageUrl: layout === 'team_v1' ? (isNonEmptyString(m.imageUrl) ? m.imageUrl : PLACEHOLDER_AVATAR) : undefined,
        avatar: layout === 'team_v2' ? (isNonEmptyString(m.avatar) ? m.avatar : isNonEmptyString(m.imageUrl) ? m.imageUrl : PLACEHOLDER_AVATAR) : undefined,
      }));
    }
    return;
  }

  // partners
  if (layout.startsWith('partners')) {
    ensureTitle(props, '合作伙伴');
    const partners = asObjectArray(props.partners);
    if (partners.length === 0) {
      props.partners = [
        { name: '合作伙伴 A', logoUrl: PLACEHOLDER_IMAGE },
        { name: '合作伙伴 B', logoUrl: PLACEHOLDER_IMAGE },
        { name: '合作伙伴 C', logoUrl: PLACEHOLDER_IMAGE },
      ];
    } else {
      props.partners = partners.map((p) => ({
        name: isNonEmptyString(p.name) ? p.name : '合作伙伴',
        logoUrl: isNonEmptyString(p.logoUrl) ? p.logoUrl : PLACEHOLDER_IMAGE,
      }));
    }
    return;
  }

  // gallery
  if (layout.startsWith('gallery')) {
    ensureTitle(props, '图片集');
    const images = asObjectArray(props.images);
    if (images.length === 0) {
      props.images = [
        { url: PLACEHOLDER_IMAGE, caption: '' },
        { url: PLACEHOLDER_IMAGE, caption: '' },
        { url: PLACEHOLDER_IMAGE, caption: '' },
      ];
    } else {
      props.images = images.map((img) => ({
        url: isNonEmptyString(img.url) ? img.url : PLACEHOLDER_IMAGE,
        caption: isNonEmptyString(img.caption) ? img.caption : '',
      }));
    }
    return;
  }

  // image
  if (layout === 'image_v1') {
    ensureString(props, 'title', '图片标题');
    if (!isNonEmptyString(props.imageUrl)) props.imageUrl = PLACEHOLDER_COVER;
    return;
  }

  if (layout === 'image_v2') {
    ensureTitle(props, '图文说明');
    if (!isNonEmptyString(props.image)) props.image = PLACEHOLDER_IMAGE;
    const body = isNonEmptyString(props.body) ? props.body : isNonEmptyString(props.subtitle) ? props.subtitle : '';
    if (!isNonEmptyString(props.body)) props.body = body || '配合标题补充关键信息';
    return;
  }

  // swot / pest
  if (layout.startsWith('swot')) {
    ensureTitle(props, 'SWOT 分析');
    ensureString(props, 'strength', '核心优势');
    ensureString(props, 'weakness', '待改进点');
    ensureString(props, 'opportunity', '市场机会');
    ensureString(props, 'threat', '潜在风险');
    return;
  }

  if (layout.startsWith('pest')) {
    ensureTitle(props, 'PEST 分析');
    ensureString(props, 'political', '政策环境');
    ensureString(props, 'economic', '经济环境');
    ensureString(props, 'social', '社会环境');
    ensureString(props, 'technological', '技术环境');
    return;
  }
}

/**
 * 为 AI 生成的 slide 自动补全关键 props，避免渲染时出现空白页或占位提示。
 * 先按角色兜底，再按具体版式转换数据结构。
 */
export function patchSlideContent(slide: Slide): Slide {
  const props = { ...(slide.props ?? {}) } as Record<string, unknown>;

  // 1. 角色级兜底（确保常见数组存在）
  switch (slide.role) {
    case 'chart':
      if (slide.layout !== 'chart_v2') {
        ensureArray(props, 'data', [20, 45, 70, 95]);
      }
      ensureArray(props, 'labels', ['Q1', 'Q2', 'Q3', 'Q4']);
      break;
    case 'stats':
      ensureArray(props, 'stats', [{ label: '指标', value: '100', unit: '%' }]);
      break;
    case 'process':
      ensureArray(props, 'steps', ['步骤一', '步骤二', '步骤三']);
      break;
    case 'timeline':
      ensureArray(props, 'milestones', [
        { date: '第一阶段', title: '里程碑', description: '关键进展' },
      ]);
      break;
    case 'roadmap':
      ensureArray(props, 'phases', [{ phase: '近期', goals: ['完成核心功能'] }]);
      break;
    case 'faq':
      ensureArray(props, 'items', [{ q: '常见问题？', a: '这是回答。' }]);
      break;
    case 'feature':
      ensureArray(props, 'features', [{ title: '核心能力', description: '支撑关键业务目标高效达成' }]);
      break;
    case 'team':
      ensureArray(props, 'members', [{ name: '成员', role: '职位', bio: '简介' }]);
      break;
    case 'partners':
      ensureArray(props, 'partners', [{ name: '合作伙伴' }]);
      break;
    case 'pricing':
      ensureArray(props, 'plans', [
        { name: '基础版', price: '¥0', period: '/月', features: ['基础功能'] },
      ]);
      break;
    case 'gallery':
      ensureArray(props, 'images', [{ caption: '图片说明' }]);
      break;
    case 'tableOfContents':
      ensureArray(props, 'items', ['内容一', '内容二', '内容三']);
      break;
    case 'metric':
      ensureArray(props, 'metrics', [{ label: '核心指标', value: '100', unit: '%', change: '' }]);
      break;
    case 'quote':
    case 'testimonial':
      ensureString(props, 'quote', '我们致力于为客户创造可持续的价值。');
      break;
    case 'cover':
    case 'closing':
      ensureString(props, 'title', slide.role === 'cover' ? '演示标题' : '感谢观看');
      break;
    case 'swot':
      ensureString(props, 'strength', '核心优势');
      ensureString(props, 'weakness', '待改进点');
      ensureString(props, 'opportunity', '市场机会');
      ensureString(props, 'threat', '潜在风险');
      break;
    case 'pest':
      ensureString(props, 'political', '政策环境');
      ensureString(props, 'economic', '经济环境');
      ensureString(props, 'social', '社会环境');
      ensureString(props, 'technological', '技术环境');
      break;
    default:
      break;
  }

  // 2. 按版式精确补全/转换
  patchSlideContentForLayout(slide, props);

  return { ...slide, props };
}

/**
 * 对 DeckGoal 的每一页自动补全关键内容字段。
 */
export function patchGoalContent<T extends { slides: Slide[] }>(goal: T): T {
  return {
    ...goal,
    slides: goal.slides.map((slide) => patchSlideContent(slide)),
  };
}
