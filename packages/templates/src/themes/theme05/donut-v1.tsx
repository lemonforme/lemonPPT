// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme05DonutV1Item {
  name: string;
  value: number;
  scheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
}

export interface Theme05DonutV1Conclusion {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme05DonutV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  unit?: string;
  items?: Theme05DonutV1Item[];
  showConclusion?: boolean;
  conclusion?: Theme05DonutV1Conclusion;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05DonutV1Meta: LayoutMeta = {
  id: 'theme05_donut_v1',
  theme: 'theme05',
  role: 'chart',
  displayName: 'Theme 05 光谱环形图',
  description: '环形图 + 右侧图例与结论区',
  needsMedia: false,
  tags: ['chart', 'donut', 'spectrum', 'distribution'],
  contentShape: 'donut-legend-insight',
};

const schemeMap: Record<string, string> = {
  coral: '#E85D4E',
  amber: '#F5A623',
  teal: '#0FA3B1',
  indigo: '#4A58D9',
  violet: '#7C3AED',
};

function schemeColor(scheme?: string): string {
  return schemeMap[scheme || 'coral'] || schemeMap.coral;
}

export const theme05DonutV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'DISTRIBUTION' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '融资阶段分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '早期与成长期项目仍占主导' },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    {
      key: 'items',
      label: '分类数据',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: [
        { name: '种子 / 天使', value: 28, scheme: 'coral' },
        { name: 'A 轮', value: 35, scheme: 'amber' },
        { name: 'B 轮', value: 22, scheme: 'teal' },
        { name: 'C 轮及以上', value: 12, scheme: 'indigo' },
        { name: '战略融资', value: 8, scheme: 'violet' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'number', inlineEditable: true },
        {
          key: 'scheme',
          label: '强调色',
          type: 'select',
          defaultValue: 'coral',
          options: [
            { value: 'coral', label: '珊瑚' },
            { value: 'amber', label: '琥珀' },
            { value: 'teal', label: '青绿' },
            { value: 'indigo', label: '靛蓝' },
            { value: 'violet', label: '紫罗兰' },
          ],
        },
      ],
    },
    { key: 'showConclusion', label: '重点强调', type: 'boolean', defaultValue: true },
    {
      key: 'conclusion',
      label: '结论区',
      type: 'object',
      visibleWhen: { key: 'showConclusion', value: true },
      defaultValue: {
        value: '63%',
        label: '早期项目占比',
        description: '种子至 A 轮项目合计超过六成，市场仍处于快速孵化与验证阶段。',
      },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text', inlineEditable: true },
        { key: 'label', label: '主数值说明', type: 'text', inlineEditable: true },
        { key: 'description', label: '解读文字', type: 'textarea', inlineEditable: true },
      ],
    },
  ],
};

function buildOption(items: Theme05DonutV1Item[]): Record<string, unknown> {
  const total = items.reduce((sum, item) => sum + (item.value || 0), 0);
  const data = items.map((item) => ({
    value: item.value,
    name: item.name,
    itemStyle: {
      color: schemeColor(item.scheme),
      borderColor: 'var(--lp-bg)',
      borderWidth: 3,
      borderRadius: 4,
    },
  }));

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const pct = total > 0 ? Math.round((params.value / total) * 1000) / 10 : 0;
        return `<div style="font-weight:700;margin-bottom:4px">${params.name}</div>${params.value} (${pct}%)`;
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '80%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderColor: 'var(--lp-bg)',
          borderWidth: 3,
          borderRadius: 4,
        },
        label: { show: false },
        emphasis: {
          scale: true,
          scaleSize: 8,
          itemStyle: {
            shadowBlur: 16,
            shadowColor: 'var(--lp-shadow-rgb)',
          },
        },
        data,
        animationType: 'scale',
        animationEasing: 'cubicOut',
        animationDuration: 800,
      },
    ],
  };
}

export function Theme05DonutV1(props: Theme05DonutV1Props): ReactNode {
  const { kicker, title, subtitle, unit, items = [], showConclusion = true, conclusion, _slideIdx, _editable } = props;

  const validItems = (items || []).filter((item) => item != null && !!item.name);
  const total = validItems.reduce((sum, item) => sum + (item.value || 0), 0);
  const hasData = validItems.length > 0;
  const hasConclusion = showConclusion !== false && !!conclusion && (!!conclusion.value || !!conclusion.label || !!conclusion.description);

  return (
    <div className="lp-slide lp-theme05-donut">
      <div className="lp-theme05-donut-main lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}

        <div className="lp-theme05-donut-body">
          <div className="lp-theme05-donut-chart-wrap lp-rise">
            {hasData ? (
              <LpEChart type="pie" option={buildOption(validItems)} className="lp-theme05-donut-echart" />
            ) : (
              <div className="lp-theme05-donut-empty">请配置分类数据</div>
            )}
            {total > 0 && (
              <div className="lp-theme05-donut-center">
                <div className="lp-theme05-donut-center-value">{total}</div>
                {unit && <div className="lp-theme05-donut-center-unit">{unit}</div>}
              </div>
            )}
          </div>

          <div className="lp-theme05-donut-aside lp-rise">
            {unit && (
              <div className="lp-theme05-donut-unit">
                <span className="lp-theme05-donut-unit-label">单位</span>
                <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span">{unit}</EditableField>
              </div>
            )}

            {hasData && (
              <div className="lp-theme05-donut-legend">
                {validItems.map((item, index) => {
                  const pct = total > 0 ? Math.round(((item.value || 0) / total) * 1000) / 10 : 0;
                  return (
                    <div key={index} className="lp-theme05-donut-legend-item" style={{ animationDelay: `${index * 60}ms` }}>
                      <span className="lp-theme05-donut-legend-dot" style={{ backgroundColor: schemeColor(item.scheme) }} />
                      <div className="lp-theme05-donut-legend-text">
                        <EditableField prop={`items.${index}.name`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme05-donut-legend-name">{item.name}</EditableField>
                        <EditableField prop={`items.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme05-donut-legend-value" chartData>{item.value}</EditableField>
                      </div>
                      <div className="lp-theme05-donut-legend-percent">{pct}%</div>
                    </div>
                  );
                })}
              </div>
            )}

            {hasConclusion && (
              <div className="lp-theme05-conclusion">
                {conclusion!.value && <div className="lp-theme05-conclusion-value"><EditableField prop="conclusion.value" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.value}</EditableField></div>}
                {conclusion!.label && <div className="lp-theme05-conclusion-label"><EditableField prop="conclusion.label" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.label}</EditableField></div>}
                {conclusion!.description && <div className="lp-theme05-conclusion-description"><EditableField prop="conclusion.description" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.description}</EditableField></div>}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
