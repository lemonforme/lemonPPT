// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9Rgba } from './chart-utils.js';

export interface Theme09VersusV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  leftLabel?: string;
  leftValue?: string;
  leftUnit?: string;
  rightLabel?: string;
  rightValue?: string;
  rightUnit?: string;
  note?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09VersusV1Meta: LayoutMeta = {
  id: 'theme09_versus_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '数字对决',
  description: '左右巨数对决，中缝朱砂分隔，墨底',
  needsMedia: false,
  tags: ['chart', 'compare', 'versus', 'stat'],
  contentShape: 'two-stat-compare',
};

export const theme09VersusV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '两极对照' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'VERSUS' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '12' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '对决' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一半是{{加速}}，一半是收敛' },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '同一时间窗口内，两类企业在投入强度上出现明显分野。',
    },
    { key: 'leftLabel', label: '左侧标签', type: 'text', inlineEditable: true, defaultValue: '头部厂商投入' },
    { key: 'leftValue', label: '左侧数值', type: 'text', inlineEditable: true, defaultValue: '312' },
    { key: 'leftUnit', label: '左侧单位', type: 'text', inlineEditable: true, defaultValue: '亿元' },
    { key: 'rightLabel', label: '右侧标签', type: 'text', inlineEditable: true, defaultValue: '腰部厂商投入' },
    { key: 'rightValue', label: '右侧数值', type: 'text', inlineEditable: true, defaultValue: '47' },
    { key: 'rightUnit', label: '右侧单位', type: 'text', inlineEditable: true, defaultValue: '亿元' },
    { key: 'note', label: '底部注记', type: 'text', inlineEditable: true, defaultValue: '差距倍数 6.6×，较上一年度扩大 1.9×' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_LEFT = { label: '头部厂商投入', value: '312', unit: '亿元' };
const DEFAULT_RIGHT = { label: '腰部厂商投入', value: '47', unit: '亿元' };
const DEFAULT_NOTE = '差距倍数 6.6×，较上一年度扩大 1.9×';

export function Theme09VersusV1(props: Theme09VersusV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    leftLabel,
    leftValue,
    leftUnit,
    rightLabel,
    rightValue,
    rightUnit,
    note,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const c = t9ChartColors('ink');
  const lLabel = leftLabel && leftLabel.trim() ? leftLabel : DEFAULT_LEFT.label;
  const lValue = leftValue && leftValue.trim() ? leftValue : DEFAULT_LEFT.value;
  const lUnit = leftUnit && leftUnit.trim() ? leftUnit : DEFAULT_LEFT.unit;
  const rLabel = rightLabel && rightLabel.trim() ? rightLabel : DEFAULT_RIGHT.label;
  const rValue = rightValue && rightValue.trim() ? rightValue : DEFAULT_RIGHT.value;
  const rUnit = rightUnit && rightUnit.trim() ? rightUnit : DEFAULT_RIGHT.unit;
  const noteText = note && note.trim() ? note : DEFAULT_NOTE;

  const renderTitle = (t: string): ReactNode => {
    const parts = t.split(/(\{\{[^}]+\}\})/g);
    return (
      <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme09-chart-title lp-t9-serif">
        {parts.map((part, idx) => {
          const m = part.match(/^\{\{(.+)\}\}$/);
          if (m) return <em key={idx} className="lp-theme09-accent-text">{m[1]}</em>;
          return <span key={idx}>{part}</span>;
        })}
      </EditableField>
    );
  };

  const labelStyle = {
    fontFamily: c.font,
    fontSize: '15px',
    letterSpacing: '.06em',
    color: c.ink3,
  };

  return (
    <Sheet substrate="ink" frame="chart-canvas" className="lp-theme09-versus">
      <T9ChartShell
        slideIdx={_slideIdx}
        editable={_editable}
        footnoteLeft={footnoteLeft}
        footnoteRight={footnoteRight}
        head={
          <T9ChartHeader
            section={section}
            sectionEn={sectionEn}
            mark={mark}
            kicker={kicker}
            slideIdx={_slideIdx}
            editable={_editable}
          />
        }
        body={
          <div
            className="lp-theme09-versus-body"
            style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, gap: '10px' }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}

            <div
              style={{
                display: 'flex',
                alignItems: 'stretch',
                flex: '1 1 auto',
                minHeight: 0,
                gap: '40px',
              }}
            >
              <div
                style={{
                  flex: '1 1 0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '14px',
                  textAlign: 'right',
                  alignItems: 'flex-end',
                }}
              >
                <div style={labelStyle}>
                  <EditableField prop="leftLabel" slideIdx={_slideIdx} editable={_editable} as="span">
                    {lLabel}
                  </EditableField>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                  <span
                    style={{
                      fontFamily: c.fontHeading,
                      fontWeight: 700,
                      fontSize: '132px',
                      lineHeight: 0.9,
                      letterSpacing: '-0.04em',
                      color: c.accent,
                    }}
                  >
                    <EditableField prop="leftValue" slideIdx={_slideIdx} editable={_editable} as="span">
                      {lValue}
                    </EditableField>
                  </span>
                  <span style={{ fontFamily: c.font, fontSize: '20px', color: c.ink3, paddingBottom: '14px' }}>
                    <EditableField prop="leftUnit" slideIdx={_slideIdx} editable={_editable} as="span">
                      {lUnit}
                    </EditableField>
                  </span>
                </div>
              </div>

              <div
                style={{
                  flex: '0 0 auto',
                  width: '2px',
                  background: `linear-gradient(180deg, ${t9Rgba(c.accent, 0)} 0%, ${c.accent} 22%, ${c.accent} 78%, ${t9Rgba(c.accent, 0)} 100%)`,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    fontFamily: c.fontMono,
                    fontSize: '13px',
                    letterSpacing: '.14em',
                    color: c.onAccent,
                    background: c.accent,
                    padding: '6px 9px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  VS
                </span>
              </div>

              <div
                style={{
                  flex: '1 1 0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '14px',
                  alignItems: 'flex-start',
                }}
              >
                <div style={labelStyle}>
                  <EditableField prop="rightLabel" slideIdx={_slideIdx} editable={_editable} as="span">
                    {rLabel}
                  </EditableField>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                  <span
                    style={{
                      fontFamily: c.fontHeading,
                      fontWeight: 700,
                      fontSize: '132px',
                      lineHeight: 0.9,
                      letterSpacing: '-0.04em',
                      color: c.ink,
                    }}
                  >
                    <EditableField prop="rightValue" slideIdx={_slideIdx} editable={_editable} as="span">
                      {rValue}
                    </EditableField>
                  </span>
                  <span style={{ fontFamily: c.font, fontSize: '20px', color: c.ink3, paddingBottom: '14px' }}>
                    <EditableField prop="rightUnit" slideIdx={_slideIdx} editable={_editable} as="span">
                      {rUnit}
                    </EditableField>
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                fontFamily: c.font,
                fontSize: '14px',
                color: c.ink3,
                textAlign: 'center',
                borderTop: `1px solid ${c.rule}`,
                paddingTop: '10px',
                flex: '0 0 auto',
              }}
            >
              <EditableField prop="note" slideIdx={_slideIdx} editable={_editable} as="span">
                {noteText}
              </EditableField>
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
