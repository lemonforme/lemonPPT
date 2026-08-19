// lemonPPT - theme08 黑金实验 · 气泡图
// 原创实现，不复制 third-party theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08BubbleItem {
  label: string;
  size: number;
  color: string;
  category: string;
  cat?: string;
}

export interface Theme08BubbleGroup {
  label: string;
  count: string;
  total?: string;
  items: Theme08BubbleItem[];
}

export interface Theme08BubbleV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  groups?: Theme08BubbleGroup[];
  legend?: { color: string; label: string }[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08BubbleV1Meta: LayoutMeta = {
  id: 'theme08_bubble_v1',
  theme: 'theme08',
  role: 'stats',
  displayName: 'Theme 08 气泡图',
  description: '按金额区间分组的融资气泡图 + 图例',
  needsMedia: false,
  tags: ['bubble', 'deal-map', 'chart', 'black-gold'],
  contentShape: 'bubble',
};

export const theme08BubbleV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'DEAL MAP' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '融资事件规模分层' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '97 笔大额融资按金额分四组，呈明显长尾分布。' },
    {
      key: 'groups',
      label: '气泡分组',
      type: 'array',
      minItems: 2,
      maxItems: 5,
      defaultValue: [
        { label: '$100-200M', count: '41', total: '58 亿美元', items: [
          { label: '', size: 6, color: '#FFD23F', category: '模型' }, { label: '', size: 5, color: '#FF2D9B', category: '应用' },
          { label: '', size: 5, color: '#8DBEEC', category: '基础' }, { label: '', size: 4, color: '#E83B22', category: '芯片' },
          { label: '', size: 7, color: '#FFD23F', category: '模型' }, { label: '', size: 6, color: '#FF2D9B', category: '应用' },
          { label: '', size: 5, color: '#8DBEEC', category: '基础' }, { label: '', size: 4, color: '#8A8A93', category: '其他' },
          { label: '', size: 6, color: '#FFD23F', category: '模型' }, { label: '', size: 5, color: '#FF2D9B', category: '应用' },
          { label: '', size: 4, color: '#8DBEEC', category: '基础' }, { label: '', size: 3, color: '#8A8A93', category: '其他' },
          { label: '', size: 5, color: '#FFD23F', category: 'model' }, { label: '', size: 4, color: '#FF2D9B', category: 'app' },
          { label: '', size: 3, color: '#8DBEEC', category: 'infra' }, { label: '', size: 3, color: '#8A8A93', category: 'other' },
        ] },
        { label: '$200-500M', count: '29', total: '91 亿美元', items: [
          { label: '', size: 7, color: '#FFD23F', cat: '模型' }, { label: '', size: 6, color: '#FF2D9B', cat: '应用' },
          { label: '', size: 6, color: '#8DBEEC', cat: '基础' }, { label: '', size: 5, color: '#E83B22', cat: '芯片' },
          { label: '', size: 7, color: '#FFD23F', cat: '模型' }, { label: '', size: 6, color: '#FF2D9B', cat: '应用' },
          { label: '', size: 5, color: '#8DBEEC', cat: '基础' }, { label: '', size: 5, color: '#E83B22', cat: '芯片' },
          { label: '', size: 6, color: '#FFD23F', cat: '模型' }, { label: '', size: 5, color: '#FF2D9B', cat: '应用' },
          { label: '', size: 4, color: '#8DBEEC', cat: '基础' },
        ] },
        { label: '$500M-1G', count: '15', total: '103 亿美元', items: [
          { label: '', size: 8, color: '#FFD23F', cat: '模型' }, { label: '', size: 7, color: '#FF2D9B', cat: '应用' },
          { label: '', size: 6, color: '#8DBEEC', cat: '基础' }, { label: '', size: 6, color: '#E83B22', cat: '芯片' },
          { label: '', size: 7, color: '#FFD23F', cat: '模型' }, { label: '', size: 6, color: '#FF2D9B', cat: '应用' },
          { label: '', size: 5, color: '#8DBEEC', cat: '基础' }, { label: '', size: 5, color: '#8A8A93', cat: '其他' },
        ] },
        { label: '$1B+', count: '12', total: '718 亿美元', items: [
          { label: '', size: 10, color: '#FFD23F', cat: '模型' }, { label: '', size: 9, color: '#8DBEEC', cat: '基础' },
          { label: '', size: 9, color: '#FF2D9B', cat: '应用' }, { label: '', size: 8, color: '#8A8A93', cat: '其他' },
          { label: '', size: 9, color: '#FFD23F', cat: '模型' }, { label: '', size: 8, color: '#8DBEEC', cat: '基础' },
          { label: '', size: 8, color: '#FF2D9B', cat: '应用' }, { label: '', size: 7, color: '#8A8A93', cat: '其他' },
          { label: '', size: 8, color: '#FFD23F', cat: '模型' }, { label: '', size: 7, color: '#8DBEEC', cat: '基础' },
          { label: '', size: 7, color: '#FF2D9B', cat: '应用' }, { label: '', size: 6, color: '#8A8A93', cat: '其他' },
        ] },
      ],
      itemSchema: [
        { key: 'label', label: '分组标题', type: 'text' },
        { key: 'count', label: '数量', type: 'text' },
        { key: 'total', label: '总金额', type: 'text' },
        { key: 'items', label: '气泡', type: 'array', itemSchema: [
          { key: 'size', label: '大小', type: 'number' },
          { key: 'color', label: '颜色', type: 'text' },
          { key: 'category', label: '类别', type: 'text' },
        ] },
      ],
    },
    { key: 'legend', label: '图例', type: 'array', itemSchema: [{ key: 'color', label: '颜色', type: 'text' }, { key: 'label', label: '标签', type: 'text' }] },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '54' },
  ],
};

export function Theme08BubbleV1(props: Theme08BubbleV1Props): ReactNode {
  const { kicker, title, subtitle, groups = [], legend = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const valid = (groups || []).slice(0, 5);
  return (
    <div className="lp-slide lp-theme08 lp-theme08-bubble-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="chart" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-bubble lp-rise" style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
            {valid.map((group, gi) => (
              <div
                key={gi}
                className="lp-theme08-bubble-group"
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '12px 14px 14px',
                  borderRadius: 14,
                  border: '1px solid color-mix(in srgb, var(--lp-ink-soft) 20%, transparent)',
                  background: 'color-mix(in srgb, var(--lp-ink-soft) 6%, transparent)',
                }}
              >
                <div className="lp-theme08-bubble-group-label" style={{ fontSize: 13, fontWeight: 700, color: 'var(--lp-accent)', letterSpacing: 0.5 }}>
                  <EditableField prop={`groups.${gi}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{group.label}</EditableField>
                </div>
                <div
                  className="lp-theme08-bubble-cloud"
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '12px 4px',
                    minHeight: 120,
                  }}
                >
                  {(group.items || []).map((b, bi) => {
                    const d = (b.size || 1) * 4 + 16;
                    return (
                      <span
                        key={bi}
                        className="lp-theme08-bubble-dot"
                        title={b.category || b.cat || ''}
                        style={{
                          width: d,
                          height: d,
                          borderRadius: '50%',
                          background: b.color,
                          boxShadow: `0 0 0 1px rgba(0,0,0,0.25), 0 4px 10px ${b.color}55`,
                          opacity: 0.92,
                        }}
                      >
                        <span style={{ display: 'none' }}>
                          <EditableField prop={`groups.${gi}.items.${bi}.size`} slideIdx={_slideIdx} editable={_editable} chartData as="span">{b.size}</EditableField>
                        </span>
                      </span>
                    );
                  })}
                </div>
                <div className="lp-theme08-bubble-group-foot" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid color-mix(in srgb, var(--lp-ink-soft) 18%, transparent)', paddingTop: 8, marginTop: 4 }}>
                  <span className="lp-theme08-bubble-count" style={{ fontSize: 13, fontWeight: 700, color: 'var(--lp-ink)' }}>
                    <EditableField prop={`groups.${gi}.count`} slideIdx={_slideIdx} editable={_editable} as="span">{group.count}</EditableField><span style={{ color: 'var(--lp-ink-soft)', fontWeight: 400 }}> 笔</span>
                  </span>
                  {group.total && (
                    <span className="lp-theme08-bubble-total" style={{ fontSize: 11, color: 'var(--lp-ink-soft)' }}>
                      <EditableField prop={`groups.${gi}.total`} slideIdx={_slideIdx} editable={_editable} as="span">{group.total}</EditableField>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {legend.length > 0 && (
            <div className="lp-theme08-bubble-legend" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginTop: 14 }}>
              {legend.map((lg, li) => (
                <span key={li} className="lp-theme08-legend-item" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--lp-ink-soft)' }}>
                  <span className="lp-theme08-legend-dot" style={{ width: 12, height: 12, borderRadius: '50%', background: lg.color }} />
                  <EditableField prop={`legend.${li}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{lg.label}</EditableField>
                </span>
              ))}
            </div>
          )}
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
