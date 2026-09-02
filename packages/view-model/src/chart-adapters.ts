// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Chart data adapters.
 *
 * workbuddy / Agent 通常输出通用 chart 数据（labels + data / datasets），
 * 但大量主题版式使用专用结构（segments、series、items、nodes/links 等）。
 * 本模块在 normalizeSlide 阶段把通用数据适配为各版式期望的结构。
 */

export interface GenericDataset {
  label?: string;
  name?: string;
  data?: unknown[];
  values?: unknown[];
}

/** 将任意数组归一化为 number[]，支持对象数组 { item?: number }。 */
export function normalizeNumberArray(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => {
      if (typeof v === 'number') return v;
      if (typeof v === 'string') return Number(v);
      if (v && typeof v === 'object') return Number((v as { item?: number | string }).item ?? 0);
      return Number(v ?? 0);
    })
    .filter((v) => !Number.isNaN(v));
}

/** 将任意数组归一化为 string[]，支持对象数组 { item?: string }。 */
export function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => {
      if (typeof v === 'string') return v;
      if (typeof v === 'number') return String(v);
      if (v && typeof v === 'object') return String((v as { item?: string }).item ?? '');
      return String(v ?? '');
    })
    .filter((s): s is string => s.length > 0);
}

/** 将任意数组归一化为对象数组，过滤掉非对象项。 */
export function normalizeObjectArray(value: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is Record<string, unknown> => !!v && typeof v === 'object');
}

function getTitle(props: Record<string, unknown>): string {
  return typeof props.title === 'string' && props.title ? props.title : '数值';
}

/** 从 props 中提取通用 chart 数据。 */
export function extractGenericChartData(
  props: Record<string, unknown>
): { labels: string[]; datasets: GenericDataset[] } | null {
  const labels = normalizeStringArray(props.labels);

  const datasets: GenericDataset[] = [];
  if (Array.isArray(props.datasets)) {
    for (const ds of props.datasets as GenericDataset[]) {
      if (!ds || typeof ds !== 'object') continue;
      datasets.push({
        label: ds.label ?? ds.name,
        data: ds.data ?? ds.values,
        values: ds.values ?? ds.data,
      });
    }
  }

  if (props.data !== undefined) {
    datasets.unshift({ name: getTitle(props), data: props.data as unknown[], values: props.data as unknown[] });
  }

  if (datasets.length === 0 && labels.length === 0) return null;
  return { labels, datasets };
}

/** 判断一个数组字段是否为空或需要重新填充。 */
function needsFill(props: Record<string, unknown>, key: string): boolean {
  const value = props[key];
  if (!Array.isArray(value)) return true;
  return value.length === 0;
}

export type ChartAdapter = (layout: string, props: Record<string, unknown>) => void;

/** 通用 data / datasets → series（name + values）。 */
export function seriesAdapter(valueKey = 'values'): ChartAdapter {
  return (_layout, props) => {
    const generic = extractGenericChartData(props);
    if (!generic) return;
    const { labels, datasets } = generic;

    if (Array.isArray(props.series) && props.series.length > 0) {
      props.series = normalizeObjectArray(props.series).map((s) => ({
        ...s,
        [valueKey]: normalizeNumberArray(s[valueKey] ?? s.values ?? s.data),
      }));
      return;
    }

    props.series = datasets.map((ds, i) => ({
      name: ds.label ?? ds.name ?? (i === 0 ? getTitle(props) : `系列${i + 1}`),
      [valueKey]: normalizeNumberArray(ds.data ?? ds.values),
    }));

    if (!props.labels && labels.length > 0) {
      props.labels = labels;
    }
  };
}

/** 通用 data → segments（label/name + value）。 */
export function segmentsAdapter(
  labelKey: 'label' | 'name' = 'label',
  extra?: (label: string, value: number, index: number) => Record<string, unknown>
): ChartAdapter {
  return (_layout, props) => {
    if (!needsFill(props, 'segments')) return;
    const generic = extractGenericChartData(props);
    if (!generic) return;
    const { labels, datasets } = generic;
    const values = normalizeNumberArray(datasets[0]?.data ?? datasets[0]?.values);
    const safeLabels = labels.length > 0 ? labels : values.map((_, i) => `项${i + 1}`);

    props.segments = values.slice(0, safeLabels.length).map((value, i) => ({
      [labelKey]: safeLabels[i] ?? `项${i + 1}`,
      value,
      ...(extra ? extra(safeLabels[i] ?? `项${i + 1}`, value, i) : {}),
    }));
  };
}

/** 通用 data / datasets → items（支持字段映射）。 */
export function itemsAdapter(
  targetKey: string,
  mapping: Record<string, string | string[]>,
  options?: { fillFromDatasets?: boolean }
): ChartAdapter {
  return (_layout, props) => {
    if (!targetKey || !needsFill(props, targetKey)) return;

    const generic = extractGenericChartData(props);
    if (!generic) return;
    const { labels, datasets } = generic;

    // 如果 datasets 有多条 series，按字段顺序分配
    const fieldNames = Object.keys(mapping);
    const numericFields = fieldNames.filter((k) => mapping[k] !== 'name' && mapping[k] !== 'label');

    if (options?.fillFromDatasets && datasets.length > 1 && numericFields.length > 1) {
      const len = labels.length || Math.max(...datasets.map((d) => normalizeNumberArray(d.data).length));
      props[targetKey] = Array.from({ length: len }, (_, i) => {
        const item: Record<string, unknown> = {};
        // 名称字段
        for (const [key, source] of Object.entries(mapping)) {
          if (source === 'name' || source === 'label') {
            item[key] = labels[i] ?? `项${i + 1}`;
          }
        }
        // 数值字段按 dataset 顺序
        numericFields.forEach((key, di) => {
          const ds = datasets[di];
          const vals = ds ? normalizeNumberArray(ds.data ?? ds.values) : [];
          item[key] = vals[i] ?? 0;
        });
        return item;
      });
      return;
    }

    const values = normalizeNumberArray(datasets[0]?.data ?? datasets[0]?.values);
    const safeLabels = labels.length > 0 ? labels : values.map((_, i) => `项${i + 1}`);

    props[targetKey] = values.slice(0, safeLabels.length).map((value, i) => {
      const item: Record<string, unknown> = {};
      for (const [key, source] of Object.entries(mapping)) {
        if (source === 'name' || source === 'label') {
          item[key] = safeLabels[i] ?? `项${i + 1}`;
        } else if (source === 'value') {
          item[key] = value;
        } else if (Array.isArray(source)) {
          // source 是字段路径，用于从对象数组原值中取值
          item[key] = value;
        } else {
          item[key] = value;
        }
      }
      return item;
    });
  };
}

/** 通用 data → labels + values（瀑布图等）。 */
export function labelsValuesAdapter(labelsKey = 'labels', valuesKey = 'values'): ChartAdapter {
  return (_layout, props) => {
    if (!needsFill(props, valuesKey)) return;
    const generic = extractGenericChartData(props);
    if (!generic) return;
    const { labels, datasets } = generic;
    props[valuesKey] = normalizeNumberArray(datasets[0]?.data ?? datasets[0]?.values);
    if (labels.length > 0) {
      props[labelsKey] = labels;
    }
  };
}

/** 通用 data → bars。 */
export function barsAdapter(): ChartAdapter {
  return (_layout, props) => {
    if (!needsFill(props, 'bars')) return;
    const generic = extractGenericChartData(props);
    if (!generic) return;
    const { labels, datasets } = generic;
    const values = normalizeNumberArray(datasets[0]?.data ?? datasets[0]?.values);
    const safeLabels = labels.length > 0 ? labels : values.map((_, i) => `项${i + 1}`);
    props.bars = values.slice(0, safeLabels.length).map((value, i) => ({
      value,
      label: safeLabels[i] ?? `项${i + 1}`,
      alt: '',
    }));
  };
}

/** 通用 data → stages（漏斗等）。 */
export function stagesAdapter(mapping: Record<string, string | string[]> = { name: 'label', value: 'value' }): ChartAdapter {
  return (_layout, props) => {
    if (!needsFill(props, 'stages')) return;
    const generic = extractGenericChartData(props);
    if (!generic) return;
    const { labels, datasets } = generic;
    const values = normalizeNumberArray(datasets[0]?.data ?? datasets[0]?.values);
    const safeLabels = labels.length > 0 ? labels : values.map((_, i) => `项${i + 1}`);
    props.stages = values.slice(0, safeLabels.length).map((value, i) => {
      const item: Record<string, unknown> = {};
      for (const [key, source] of Object.entries(mapping)) {
        if (source === 'label' || source === 'name') item[key] = safeLabels[i] ?? `项${i + 1}`;
        else item[key] = value;
      }
      return item;
    });
  };
}

/** 通用 data → points（散点/矩阵/四象限等）。 */
export function pointsAdapter(targetKey: string, mapping: Record<string, string>): ChartAdapter {
  return (_layout, props) => {
    if (!needsFill(props, targetKey)) return;
    const generic = extractGenericChartData(props);
    if (!generic) return;
    const { labels, datasets } = generic;

    // 支持单 series（用索引和 value 作 x/y）或多 datasets（x, y, size...）
    const labelSource = mapping.name ?? mapping.label;
    const numericFields = Object.keys(mapping).filter((k) => mapping[k] !== labelSource);
    const valueLists = datasets.map((ds) => normalizeNumberArray(ds.data ?? ds.values));

    const len = labels.length || Math.max(...valueLists.map((v) => v.length), 0);
    props[targetKey] = Array.from({ length: len }, (_, i) => {
      const item: Record<string, unknown> = {};
      for (const [key, source] of Object.entries(mapping)) {
        if (source === 'name' || source === 'label') {
          item[key] = labels[i] ?? `项${i + 1}`;
        } else {
          const fieldIndex = numericFields.indexOf(key);
          const vals = valueLists[fieldIndex] ?? valueLists[0] ?? [];
          item[key] = vals[i] ?? 0;
        }
      }
      return item;
    });
  };
}

/** 通用 data → nodes + links（关系图/桑基/弦图等）。 */
export function nodesLinksAdapter(options?: {
  nodesFromLabels?: boolean;
  nodeFields?: Record<string, string>;
  linkFields?: Record<string, string>;
}): ChartAdapter {
  return (_layout, props) => {
    const generic = extractGenericChartData(props);
    if (!generic) return;
    const { labels, datasets } = generic;

    if (needsFill(props, 'nodes') && options?.nodesFromLabels !== false) {
      const nodeNames = labels.length > 0 ? labels : datasets.map((d, i) => d.name ?? `节点${i + 1}`);
      props.nodes = nodeNames.map((name) => {
        const node: Record<string, unknown> = { name };
        if (options?.nodeFields) {
          for (const [key, source] of Object.entries(options.nodeFields)) {
            if (source === 'name') node[key] = name;
          }
        }
        return node;
      });
    }

    if (needsFill(props, 'links') && datasets.length >= 2) {
      const sourceValues = normalizeNumberArray(datasets[0]?.data ?? datasets[0]?.values);
      const targetValues = normalizeNumberArray(datasets[1]?.data ?? datasets[1]?.values);
      const linkNames = labels.length > 0 ? labels : sourceValues.map((_, i) => `项${i + 1}`);
      props.links = sourceValues.slice(0, linkNames.length).map((value, i) => ({
        source: linkNames[i] ?? `源${i + 1}`,
        target: targetValues[i] !== undefined ? String(targetValues[i]) : `目标${i + 1}`,
        value,
      }));
    }
  };
}

/** theme10 通用 data → categories + series（values 为逗号分隔字符串）。 */
export function theme10SeriesAdapter(): ChartAdapter {
  return (_layout, props) => {
    const generic = extractGenericChartData(props);
    if (!generic) return;
    const { labels, datasets } = generic;

    if (labels.length > 0 && !props.categories) {
      props.categories = labels.map((l) => ({ text: l }));
    }

    if (!Array.isArray(props.series) || props.series.length === 0) {
      props.series = datasets.map((ds, i) => ({
        name: ds.label ?? ds.name ?? (i === 0 ? getTitle(props) : `系列${i + 1}`),
        values: normalizeNumberArray(ds.data ?? ds.values).join(','),
      }));
    }
  };
}

/** theme10 items 适配（label/value 等字段）。 */
export function theme10ItemsAdapter(
  targetKey: string,
  mapping: Record<string, string | string[]>,
  options?: { fillFromDatasets?: boolean }
): ChartAdapter {
  return (_layout, props) => {
    if (!targetKey || !needsFill(props, targetKey)) return;

    const generic = extractGenericChartData(props);
    if (!generic) return;
    const { labels, datasets } = generic;

    const fieldNames = Object.keys(mapping);
    const numericFields = fieldNames.filter((k) => mapping[k] !== 'label' && mapping[k] !== 'name');

    if (options?.fillFromDatasets && datasets.length > 1 && numericFields.length > 1) {
      const len = labels.length || Math.max(...datasets.map((d) => normalizeNumberArray(d.data).length));
      props[targetKey] = Array.from({ length: len }, (_, i) => {
        const item: Record<string, unknown> = {};
        for (const [key, source] of Object.entries(mapping)) {
          if (source === 'label' || source === 'name') {
            item[key] = labels[i] ?? `项${i + 1}`;
          } else {
            const di = numericFields.indexOf(key);
            const vals = datasets[di] ? normalizeNumberArray(datasets[di].data ?? datasets[di].values) : [];
            item[key] = vals[i] ?? 0;
          }
        }
        return item;
      });
      return;
    }

    const values = normalizeNumberArray(datasets[0]?.data ?? datasets[0]?.values);
    const safeLabels = labels.length > 0 ? labels : values.map((_, i) => `项${i + 1}`);

    props[targetKey] = values.slice(0, safeLabels.length).map((value, i) => {
      const item: Record<string, unknown> = {};
      for (const [key, source] of Object.entries(mapping)) {
        if (source === 'label' || source === 'name') item[key] = safeLabels[i] ?? `项${i + 1}`;
        else item[key] = value;
      }
      return item;
    });
  };
}

/** theme10 scatter/bubble points 适配。 */
export function theme10PointsAdapter(): ChartAdapter {
  return (_layout, props) => {
    if (!needsFill(props, 'series')) return;
    const generic = extractGenericChartData(props);
    if (!generic) return;
    const { labels, datasets } = generic;

    if (datasets.length >= 2) {
      const xValues = normalizeNumberArray(datasets[0]?.data ?? datasets[0]?.values);
      const yValues = normalizeNumberArray(datasets[1]?.data ?? datasets[1]?.values);
      const name = datasets[0]?.name ?? getTitle(props);
      props.series = [
        {
          name,
          points: xValues.map((x, i) => ({ x, y: yValues[i] ?? 0, label: labels[i] ?? `项${i + 1}` })),
        },
      ];
    } else {
      const values = normalizeNumberArray(datasets[0]?.data ?? datasets[0]?.values);
      const name = datasets[0]?.name ?? getTitle(props);
      props.series = [
        {
          name,
          points: values.map((y, i) => ({ x: i, y, label: labels[i] ?? `项${i + 1}` })),
        },
      ];
    }
  };
}

/** theme10 small_multiples 适配。 */
export function theme10PanelsAdapter(): ChartAdapter {
  return (_layout, props) => {
    if (!needsFill(props, 'panels')) return;
    const generic = extractGenericChartData(props);
    if (!generic) return;
    const { labels, datasets } = generic;

    props.panels = datasets.slice(0, 4).map((ds, i) => ({
      title: ds.name ?? `系列${i + 1}`,
      kind: 'bar',
      labels,
      values: normalizeNumberArray(ds.data ?? ds.values),
    }));
  };
}

/** 保留 theme02 原有适配逻辑，确保向后兼容。 */
function adaptTheme02ChartProps(layout: string, props: Record<string, unknown>): void {
  const seriesLayouts = new Set([
    'theme02_chart_bar_v1',
    'theme02_chart_line_v1',
    'theme02_chart_area_v1',
    'theme02_chart_stack_v1',
  ]);

  if (seriesLayouts.has(layout)) {
    const existingSeries = props.series;
    if (Array.isArray(existingSeries) && existingSeries.length > 0) {
      props.series = existingSeries
        .filter((s): s is Record<string, unknown> => !!s && typeof s === 'object')
        .map((s) => ({
          ...s,
          values: normalizeNumberArray(s.values),
        }));
      return;
    }

    const title = getTitle(props);
    const generic = extractGenericChartData(props);
    if (generic) {
      props.series = generic.datasets.map((ds, i) => ({
        name: ds.label ?? ds.name ?? (i === 0 ? title : `系列${i + 1}`),
        values: normalizeNumberArray(ds.data ?? ds.values),
      }));
    }
    return;
  }

  if (layout === 'theme02_chart_v1' && props.data === undefined && Array.isArray(props.datasets)) {
    const first = (props.datasets as GenericDataset[])[0];
    if (first) {
      props.data = normalizeNumberArray(first.data ?? first.values);
    }
  }
}

/** 版式 ID → 适配器。 */
const CHART_ADAPTERS: Record<string, ChartAdapter> = {
  // theme02
  'theme02_chart_donut': segmentsAdapter('label'),

  // theme04
  'theme04_chart_donut': segmentsAdapter('label'),
  'theme04_treemap_v1': itemsAdapter('items', { name: 'name', value: 'value', tone: 'value' }),
  'theme04_scatter_v1': itemsAdapter('items', { name: 'name', x: 'value', y: 'value', value: 'value', tone: 'value' }),
  'theme04_slope_v1': itemsAdapter('items', { name: 'name', previous: 'value', current: 'value', tone: 'value' }, { fillFromDatasets: true }),
  'theme04_waterfall_v1': itemsAdapter('items', { label: 'label', value: 'value', tone: 'value' }),
  'theme04_region_v1': itemsAdapter('items', { name: 'name', value: 'value', tone: 'value' }),
  'theme04_valuechart_v1': stagesAdapter({ label: 'label', value: 'value', description: 'label', tone: 'value' }),
  'theme04_dumbbell_v1': itemsAdapter('items', { name: 'name', start: 'value', end: 'value', tone: 'value' }, { fillFromDatasets: true }),
  'theme04_pyramid_v1': itemsAdapter('items', { label: 'label', value: 'value', description: 'label', tone: 'value' }),
  'theme04_spread_v1': itemsAdapter('items', { label: 'label', value: 'value', tone: 'value' }),

  // theme05
  'theme05_bubble_v1': itemsAdapter('items', { name: 'name', x: 'value', y: 'value', value: 'value', scheme: 'value' }),
  'theme05_map_v1': itemsAdapter('items', { name: 'name', value: 'value', scheme: 'value' }),
  'theme05_heatmap_v1': labelsValuesAdapter('months', 'values'),
  'theme05_waterfall_v1': itemsAdapter('items', { name: 'name', value: 'value' }),
  'theme05_chart_share_v1': itemsAdapter('items', { name: 'name', value: 'value', scheme: 'value' }),
  'theme05_chart_funnel_v1': stagesAdapter({ name: 'name', value: 'value', scheme: 'value' }),
  'theme05_donut_v1': itemsAdapter('items', { name: 'name', value: 'value', scheme: 'value' }),
  'theme05_radar_v1': seriesAdapter('values'),
  'theme05_treemap_v1': itemsAdapter('items', { name: 'name', value: 'value', scheme: 'value' }),

  // theme06
  'theme06_chart_waterfall_v1': labelsValuesAdapter('labels', 'values'),
  'theme06_chart_graph_v1': nodesLinksAdapter({
    nodeFields: { id: 'name', name: 'name', value: 'value', category: 'name' },
    linkFields: { source: 'source', target: 'target', value: 'value' },
  }),
  'theme06_map_v1': itemsAdapter('items', { name: 'name', value: 'value' }),
  'theme06_geo_distribution_v1': itemsAdapter('items', { name: 'name', value: 'value' }),
  'theme06_ecosystem_graph_v1': nodesLinksAdapter({
    nodeFields: { name: 'name', category: 'name', value: 'value' },
    linkFields: { source: 'source', target: 'target', value: 'value' },
  }),
  'theme06_agent_v1': nodesLinksAdapter({
    nodeFields: { id: 'name', name: 'name', category: 'name', value: 'value' },
    linkFields: { source: 'source', target: 'target' },
  }),
  'theme06_deal_map_v1': nodesLinksAdapter({
    nodeFields: { name: 'name', category: 'name', value: 'value' },
    linkFields: { source: 'source', target: 'target', value: 'value' },
  }),
  'theme06_size_split_v1': itemsAdapter('items', { name: 'name', value: 'value' }),
  'theme06_capital_flow_v1': nodesLinksAdapter({
    linkFields: { source: 'source', target: 'target', value: 'value' },
  }),
  'theme06_region_risk_v1': itemsAdapter('items', { region: 'label', risk: 'label', value: 'value' }),
  'theme06_avg_ticket_v1': labelsValuesAdapter('intervals', 'values'),

  // theme07
  'theme07_waterfall_v1': labelsValuesAdapter('labels', 'values'),
  'theme07_deal_size_v1': itemsAdapter('items', { name: 'name', value: 'value' }),
  'theme07_avg_ticket_v1': labelsValuesAdapter('intervals', 'values'),
  'theme07_deal_map_v1': nodesLinksAdapter({
    nodeFields: { name: 'name', category: 'name', value: 'value' },
    linkFields: { source: 'source', target: 'target', value: 'value' },
  }),

  // theme08
  'theme08_chart_bar_v1': barsAdapter(),
  'theme08_chart_donut_v1': segmentsAdapter('name'),

  // theme09
  'theme09_market_overview_v1': pointsAdapter('points', { name: 'name', x: 'value', y: 'value', q: 'value' }),
  'theme09_streamgraph_v1': seriesAdapter('values'),
  'theme09_chord_v1': nodesLinksAdapter({ linkFields: { source: 'source', target: 'target', value: 'value' } }),
  'theme09_ribbon_v1': segmentsAdapter('name'),
  'theme09_rounds_v1': (_layout, props) => {
    const generic = extractGenericChartData(props);
    if (!generic) return;
    if (!props.categories) props.categories = generic.labels.map((l) => ({ name: l }));
    if (!props.rounds) props.rounds = generic.labels.map((l) => ({ name: l }));
    if (!props.matrix) {
      const values = normalizeNumberArray(generic.datasets[0]?.data ?? generic.datasets[0]?.values);
      props.matrix = [values];
    }
  },
  'theme09_ranking_v1': itemsAdapter('items', { name: 'name', value: 'value', delta: 'value' }),
  'theme09_funnel_v1': stagesAdapter({ name: 'name', value: 'value' }),
  'theme09_arc_v1': nodesLinksAdapter({ linkFields: { source: 'source', target: 'target' } }),
  'theme09_network_v1': nodesLinksAdapter({
    nodeFields: { name: 'name', category: 'name', value: 'value' },
    linkFields: { source: 'source', target: 'target' },
  }),
  'theme09_radar_v1': (_layout, props) => {
    const generic = extractGenericChartData(props);
    if (!generic) return;
    if (!Array.isArray(props.indicators) || props.indicators.length === 0) {
      props.indicators = generic.labels.map((name) => ({ name, max: Math.max(...normalizeNumberArray(generic.datasets[0]?.data), 100) }));
    }
    if (!Array.isArray(props.seriesA) && generic.datasets[0]) {
      props.seriesA = normalizeNumberArray(generic.datasets[0].data ?? generic.datasets[0].values);
    }
    if (!Array.isArray(props.seriesB) && generic.datasets[1]) {
      props.seriesB = normalizeNumberArray(generic.datasets[1].data ?? generic.datasets[1].values);
    }
  },
  'theme09_radialbar_v1': itemsAdapter('items', { name: 'name', value: 'value' }),
  'theme09_tornado_v1': itemsAdapter('items', { name: 'name', left: 'value', right: 'value' }, { fillFromDatasets: true }),
  'theme09_matrix_v1': pointsAdapter('points', { name: 'name', x: 'value', y: 'value', size: 'value', cat: 'name' }),
  'theme09_quadrant_v1': pointsAdapter('points', { name: 'name', x: 'value', y: 'value', size: 'value', accent: 'name' }),
  'theme09_bubble_v1': nodesLinksAdapter({
    nodeFields: { name: 'name', value: 'value', category: 'name' },
    linkFields: { source: 'source', target: 'target' },
  }),
  'theme09_marimekko_v1': (_layout, props) => {
    const generic = extractGenericChartData(props);
    if (!generic) return;
    const values = normalizeNumberArray(generic.datasets[0]?.data ?? generic.datasets[0]?.values);
    if (!Array.isArray(props.segments) || props.segments.length === 0) {
      props.segments = generic.labels.map((name, i) => ({ name, value: values[i] ?? 0 }));
    }
    if (!Array.isArray(props.rows) || props.rows.length === 0) {
      props.rows = [{ name: getTitle(props), values }];
    }
  },
  'theme09_parallel_v1': (_layout, props) => {
    const generic = extractGenericChartData(props);
    if (!generic) return;
    if (!Array.isArray(props.dimensions)) props.dimensions = generic.labels.map((name) => ({ name }));
    if (!Array.isArray(props.profiles) || props.profiles.length === 0) {
      props.profiles = generic.datasets.map((ds) => ({
        name: ds.name ?? getTitle(props),
        values: normalizeNumberArray(ds.data ?? ds.values),
      }));
    }
  },
  'theme09_alloc_v1': itemsAdapter('items', { name: 'name', value: 'value' }),
  'theme09_heatmap_v1': (_layout, props) => {
    const generic = extractGenericChartData(props);
    if (!generic) return;
    if (!Array.isArray(props.rows) || props.rows.length === 0) {
      props.rows = [{ name: getTitle(props), values: normalizeNumberArray(generic.datasets[0]?.data) }];
    }
  },
  'theme09_flow_v1': nodesLinksAdapter({
    nodeFields: { name: 'name' },
    linkFields: { source: 'source', target: 'target', value: 'value' },
  }),

  // theme10
  'theme10_bar_v1': theme10SeriesAdapter(),
  'theme10_line_v1': theme10SeriesAdapter(),
  'theme10_area_v1': theme10SeriesAdapter(),
  'theme10_grouped_v1': theme10SeriesAdapter(),
  'theme10_stack_v1': theme10SeriesAdapter(),
  'theme10_trend_v1': theme10SeriesAdapter(),
  'theme10_hbar_v1': theme10ItemsAdapter('items', { name: 'name', value: 'value' }),
  'theme10_donut_v1': theme10ItemsAdapter('items', { name: 'name', value: 'value' }),
  'theme10_pie_v1': theme10ItemsAdapter('items', { name: 'name', value: 'value' }),
  'theme10_waterfall_v1': theme10ItemsAdapter('items', { name: 'name', value: 'value' }),
  'theme10_radial_v1': theme10ItemsAdapter('items', { name: 'name', value: 'value' }),
  'theme10_funnel_v1': theme10ItemsAdapter('items', { label: 'label', value: 'value' }),
  'theme10_treemap_v1': theme10ItemsAdapter('items', { label: 'label', value: 'value' }),
  'theme10_waffle_v1': theme10ItemsAdapter('items', { label: 'label', value: 'value' }),
  'theme10_rose_v1': theme10ItemsAdapter('items', { label: 'label', value: 'value' }),
  'theme10_dotplot_v1': theme10ItemsAdapter('items', { label: 'label', value: 'value' }),
  'theme10_histogram_v1': theme10ItemsAdapter('items', { label: 'label', value: 'value' }),
  'theme10_circlepack_v1': theme10ItemsAdapter('items', { label: 'label', value: 'value' }),
  'theme10_scatter_v1': theme10PointsAdapter(),
  'theme10_bubble_v1': theme10PointsAdapter(),
  'theme10_radar_v1': (_layout, props) => {
    const generic = extractGenericChartData(props);
    if (!generic) return;
    if (!Array.isArray(props.axes) || props.axes.length === 0) {
      props.axes = generic.labels.map((text) => ({ text }));
    }
    if (!Array.isArray(props.series) || props.series.length === 0) {
      props.series = generic.datasets.map((ds) => ({
        name: ds.name ?? getTitle(props),
        values: normalizeNumberArray(ds.data ?? ds.values).join(','),
      }));
    }
  },
  'theme10_ridgeline_v1': (_layout, props) => {
    const generic = extractGenericChartData(props);
    if (!generic) return;
    if (!Array.isArray(props.axis) || props.axis.length === 0) {
      props.axis = generic.labels.map((text) => ({ text }));
    }
    if (!Array.isArray(props.series) || props.series.length === 0) {
      props.series = generic.datasets.map((ds) => ({
        name: ds.name ?? getTitle(props),
        values: normalizeNumberArray(ds.data ?? ds.values).join(','),
      }));
    }
  },
  'theme10_range_v1': theme10ItemsAdapter('items', { label: 'label', low: 'value', high: 'value', mid: 'value' }, { fillFromDatasets: true }),
  'theme10_candlestick_v1': theme10ItemsAdapter('items', { open: 'value', high: 'value', low: 'value', close: 'value' }, { fillFromDatasets: true }),
  'theme10_bullet_v1': theme10ItemsAdapter('items', { label: 'label', value: 'value', target: 'value', range: 'value' }, { fillFromDatasets: true }),
  'theme10_box_v1': theme10ItemsAdapter('items', { label: 'label', min: 'value', q1: 'value', median: 'value', q3: 'value', max: 'value' }, { fillFromDatasets: true }),
  'theme10_sankey_v1': (_layout, props) => {
    const generic = extractGenericChartData(props);
    if (!generic) return;
    if (!Array.isArray(props.links) || props.links.length === 0) {
      const values = normalizeNumberArray(generic.datasets[0]?.data ?? generic.datasets[0]?.values);
      const labels = generic.labels.length > 0 ? generic.labels : values.map((_, i) => `项${i + 1}`);
      props.links = values.slice(0, labels.length - 1).map((value, i) => ({
        from: labels[i],
        to: labels[i + 1] ?? `目标${i + 1}`,
        value,
      }));
    }
  },
  'theme10_dumbbell_v1': theme10ItemsAdapter('items', { label: 'label', start: 'value', end: 'value' }, { fillFromDatasets: true }),
  'theme10_slope_v1': theme10ItemsAdapter('items', { label: 'label', before: 'value', after: 'value' }, { fillFromDatasets: true }),
  'theme10_bump_v1': (_layout, props) => {
    const generic = extractGenericChartData(props);
    if (!generic) return;
    if (!Array.isArray(props.periodLabels) || props.periodLabels.length === 0) {
      props.periodLabels = generic.labels.map((text) => ({ text }));
    }
    if (!Array.isArray(props.items) || props.items.length === 0) {
      // 取前 4 个 series
      props.items = generic.datasets.slice(0, 4).map((ds, i) => ({
        name: ds.name ?? `系列${i + 1}`,
        r1: normalizeNumberArray(ds.data)[0] ?? 0,
        r2: normalizeNumberArray(ds.data)[1] ?? 0,
        r3: normalizeNumberArray(ds.data)[2] ?? 0,
        r4: normalizeNumberArray(ds.data)[3] ?? 0,
      }));
    }
  },
  'theme10_parallel_v1': (_layout, props) => {
    const generic = extractGenericChartData(props);
    if (!generic) return;
    if (!Array.isArray(props.axes) || props.axes.length === 0) {
      props.axes = generic.labels.map((text) => ({ text }));
    }
    if (!Array.isArray(props.items) || props.items.length === 0) {
      props.items = generic.datasets.slice(0, 3).map((ds, i) => ({
        name: ds.name ?? `系列${i + 1}`,
        v1: normalizeNumberArray(ds.data)[0] ?? 0,
        v2: normalizeNumberArray(ds.data)[1] ?? 0,
        v3: normalizeNumberArray(ds.data)[2] ?? 0,
      }));
    }
  },
  'theme10_marimekko_v1': theme10ItemsAdapter('items', { label: 'label', share: 'value', value: 'value' }, { fillFromDatasets: true }),
  'theme10_cscatter_v1': (_layout, props) => {
    const generic = extractGenericChartData(props);
    if (!generic) return;
    if (!Array.isArray(props.points) || props.points.length === 0) {
      const x = normalizeNumberArray(generic.datasets[0]?.data);
      const y = normalizeNumberArray(generic.datasets[1]?.data);
      props.points = x.map((xv, i) => ({ x: xv, y: y[i] ?? 0, label: generic.labels[i] ?? `项${i + 1}` }));
    }
  },
  'theme10_small_multiples_v1': theme10PanelsAdapter(),
};

/** 主入口：根据版式 ID 适配 chart props。 */
export function adaptChartProps(layout: string, props: Record<string, unknown>): void {
  // 保留 theme02 原有逻辑
  adaptTheme02ChartProps(layout, props);

  const adapter = CHART_ADAPTERS[layout];
  if (adapter) {
    adapter(layout, props);
  }
}
