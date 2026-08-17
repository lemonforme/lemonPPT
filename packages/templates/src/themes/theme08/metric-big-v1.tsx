// lemonPPT - theme08 黑金实验 · 大数字
// 原创实现，不复制 Dashi theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08MetricBigV1Props {
  kicker?: string;
  value: string;
  unit?: string;
  title: string;
  desc?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08MetricBigV1Meta: LayoutMeta = {
  id: 'theme08_metric_big_v1',
  theme: 'theme08',
  role: 'metric',
  displayName: 'Theme 08 大数字',
  description: '超大荧光金数字 + 标题解读，强视觉冲击',
  needsMedia: false,
  tags: ['metric', 'big-number', 'black-gold'],
  contentShape: 'metric-big',
};

export const theme08MetricBigV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'HEADLINE NUMBER' },
    { key: 'value', label: '主数字', type: 'text', inlineEditable: true, defaultValue: '92' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '%' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '异构集群算力利用率' },
    { key: 'desc', label: '解读', type: 'textarea', inlineEditable: true, defaultValue: '通过统一编排与弹性调度，训练任务的平均利用率较行业基准提升约 27 个百分点。' },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '26' },
  ],
};

export function Theme08MetricBigV1(props: Theme08MetricBigV1Props): ReactNode {
  const { kicker, value, unit, title, desc, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  return (
    <div className="lp-slide lp-theme08 lp-theme08-metric-big-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="bolt" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-metric-big lp-rise">
            <div>
              <span className="lp-theme08-metric-big-num"><EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="span">{value}</EditableField></span>
              {unit && <span className="lp-theme08-metric-big-unit"><EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span">{unit}</EditableField></span>}
            </div>
            <div className="lp-theme08-metric-big-side">
              <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-metric-big-title">{title}</EditableField>
              {desc && <EditableField prop="desc" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-metric-big-desc">{desc}</EditableField>}
            </div>
          </div>
        </div>
      </div>
      <div className="lp-theme08-glow-line" aria-hidden="true" />
      <div className="lp-theme08-footer">
        <span className="lp-theme08-footer-left">{footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}</span>
        <span className="lp-theme08-footer-right">{footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}</span>
      </div>
      <Theme08MiniBars count={20} />
    </div>
  );
}
