// lemonPPT - theme08 黑金实验 · 流程步骤
// 原创实现，不复制 Dashi theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08ProcessV1Item {
  title: string;
  desc?: string;
}

export interface Theme08ProcessV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme08ProcessV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08ProcessV1Meta: LayoutMeta = {
  id: 'theme08_process_v1',
  theme: 'theme08',
  role: 'process',
  displayName: 'Theme 08 流程步骤',
  description: '横向流程步骤 + 箭头连接，适合方法论/管线',
  needsMedia: false,
  tags: ['process', 'steps', 'black-gold'],
  contentShape: 'process',
};

export const theme08ProcessV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'WORKFLOW' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '四步交付流程' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从需求到上线，标准化且可复用。' },
    {
      key: 'items',
      label: '步骤',
      type: 'array',
      minItems: 2,
      maxItems: 5,
      defaultValue: [
        { title: '洞察', desc: '梳理场景与数据资产边界。' },
        { title: '建模', desc: '选型与训练，快速验证效果。' },
        { title: '集成', desc: '嵌入业务系统，灰度放量。' },
        { title: '运营', desc: '监控反馈，持续迭代优化。' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text' },
        { key: 'desc', label: '说明', type: 'textarea' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '72' },
  ],
};

export function Theme08ProcessV1(props: Theme08ProcessV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const valid = (items || []).slice(0, 5);
  return (
    <div className="lp-slide lp-theme08 lp-theme08-process-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="spark" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-process lp-rise">
            {valid.map((it, i) => (
              <div key={i} className="lp-theme08-card lp-theme08-card-pad lp-theme08-process-step" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="lp-theme08-process-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="lp-theme08-process-title"><EditableField prop={`items.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="span">{it.title}</EditableField></div>
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
