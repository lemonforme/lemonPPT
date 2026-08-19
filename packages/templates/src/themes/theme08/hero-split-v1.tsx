// lemonPPT - theme08 黑金实验 · 跨页分割（Hero Split）
// 原创实现，不复制 third-party theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';

export interface Theme08HeroSplitV1Props {
  leftKicker?: string;
  leftTitle: string;
  leftDesc?: string;
  rightKicker?: string;
  rightTitle: string;
  rightDesc?: string;
  watermarkNumber?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  accent?: boolean;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08HeroSplitV1Meta: LayoutMeta = {
  id: 'theme08_hero_split_v1',
  theme: 'theme08',
  role: 'content',
  displayName: 'Theme 08 跨页分割',
  description: '左右对半分割，深黑叙事 vs 浅色机会的强对比',
  needsMedia: false,
  tags: ['hero', 'split', 'contrast', 'black-gold'],
  contentShape: 'split',
};

export const theme08HeroSplitV1Schema: PropsSchema = {
  fields: [
    { key: 'leftKicker', label: '左·标签', type: 'text', inlineEditable: true, defaultValue: 'PROBLEM' },
    { key: 'leftTitle', label: '左·标题', type: 'text', inlineEditable: true, defaultValue: '赌叙事' },
    { key: 'leftDesc', label: '左·描述', type: 'textarea', inlineEditable: true, defaultValue: '资本下一阶段，将从赌叙事转向看兑现。过去两年 AI 融资主要由故事驱动，缺乏可验证的商业指标。' },
    { key: 'rightKicker', label: '右·标签', type: 'text', inlineEditable: true, defaultValue: 'OPPORTUNITY' },
    { key: 'rightTitle', label: '右·标题', type: 'text', inlineEditable: true, defaultValue: '看兑现' },
    { key: 'rightDesc', label: '右·描述', type: 'textarea', inlineEditable: true, defaultValue: '能证明单位经济模型为正的公司将获得溢价。收入增速、毛利率、客户留存率成为新的估值锚点。' },
    { key: 'watermarkNumber', label: '水印数字', type: 'text', inlineEditable: true, defaultValue: '86' },
    { key: 'accent', label: '强调（机会侧）', type: 'boolean', defaultValue: false },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '11' },
  ],
};

export function Theme08HeroSplitV1(props: Theme08HeroSplitV1Props): ReactNode {
  const {
    leftKicker, leftTitle, leftDesc,
    rightKicker, rightTitle, rightDesc,
    watermarkNumber,
    footnoteLeft, footnoteRight,
    accent,
    _slideIdx, _editable,
  } = props;

  return (
    <div className="lp-slide lp-theme08 lp-theme08-hero-split-page">
      <Theme08SlideBg />
      <div className="lp-theme08-hero-split-half left">
        {leftKicker && <div className="lp-theme08-hero-split-kicker"><EditableField prop="leftKicker" slideIdx={_slideIdx} editable={_editable} as="span">{leftKicker}</EditableField></div>}
        <EditableField prop="leftTitle" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-hero-split-title">{leftTitle}</EditableField>
        {leftDesc && <EditableField prop="leftDesc" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-hero-split-desc">{leftDesc}</EditableField>}
        {watermarkNumber && <div className="lp-theme08-hero-split-number">{watermarkNumber}</div>}
      </div>
      <div className={`lp-theme08-hero-split-half right ${accent ? 'accent' : ''}`}>
        {rightKicker && <div className="lp-theme08-hero-split-kicker"><EditableField prop="rightKicker" slideIdx={_slideIdx} editable={_editable} as="span">{rightKicker}</EditableField></div>}
        <EditableField prop="rightTitle" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-hero-split-title">{rightTitle}</EditableField>
        {rightDesc && <EditableField prop="rightDesc" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-hero-split-desc">{rightDesc}</EditableField>}
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
