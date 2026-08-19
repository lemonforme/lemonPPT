// lemonPPT - theme08 黑金实验 · 三栏特性
// 原创实现，不复制 third-party theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08FeatureV1Item {
  icon?: string;
  title: string;
  desc?: string;
}

export interface Theme08FeatureV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme08FeatureV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08FeatureV1Meta: LayoutMeta = {
  id: 'theme08_feature_v1',
  theme: 'theme08',
  role: 'feature',
  displayName: 'Theme 08 三栏特性',
  description: '标题 + 三栏图标卡片，适合能力/优势展示',
  needsMedia: false,
  tags: ['feature', 'cards', 'black-gold'],
  contentShape: 'feature',
};

export const theme08FeatureV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CAPABILITIES' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '三大核心能力' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从数据底座到场景落地，形成闭环。' },
    {
      key: 'items',
      label: '特性卡片',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: [
        { icon: 'bolt', title: '极致算力调度', desc: '异构集群统一编排，训练利用率提升至 92%。' },
        { icon: 'chart', title: '实时数据闭环', desc: '在线反馈分钟级回流，模型迭代周期缩短一半。' },
        { icon: 'target', title: '场景化交付', desc: '开箱即用的行业模板，部署成本下降 60%。' },
      ],
      itemSchema: [
        { key: 'icon', label: '图标', type: 'text' },
        { key: 'title', label: '标题', type: 'text' },
        { key: 'desc', label: '说明', type: 'textarea' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '08' },
  ],
};

export function Theme08FeatureV1(props: Theme08FeatureV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const valid = (items || []).slice(0, 4);
  return (
    <div className="lp-slide lp-theme08 lp-theme08-feature">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="spark" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-feature-grid lp-rise">
            {valid.map((it, i) => (
              <div key={i} className="lp-theme08-card lp-theme08-card-pad lp-theme08-feature-card" style={{ animationDelay: `${i * 70}ms` }}>
                <div className="lp-theme08-feature-head">
                  <Theme08IconChip name={it.icon || 'bolt'} size={38} />
                  <div className="lp-theme08-card-title"><EditableField prop={`items.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="span">{it.title}</EditableField></div>
                </div>
                {it.desc && <div className="lp-theme08-card-desc"><EditableField prop={`items.${i}.desc`} slideIdx={_slideIdx} editable={_editable} as="span">{it.desc}</EditableField></div>}
              </div>
            ))}
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
