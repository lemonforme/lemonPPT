// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 产业链分层（value_chain_v1）
 * 基底：纸 | 骨架：grid | 图位：—
 *
 * 上游 / 中游 / 下游三列环节卡，列间以专色箭头串联成链。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, Masthead, Sheet } from './shared.js';

export interface Theme09ChainLink {
  name?: string;
  desc?: string;
}

export interface Theme09ValueChainV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  upstreamLabel?: string;
  midstreamLabel?: string;
  downstreamLabel?: string;
  upstream?: Theme09ChainLink[];
  midstream?: Theme09ChainLink[];
  downstream?: Theme09ChainLink[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09ValueChainV1Meta: LayoutMeta = {
  id: 'theme09_value_chain_v1',
  theme: 'theme09',
  role: 'process',
  displayName: '产业链分层',
  description: '上中下游三列环节卡 + 列间专色箭头串联，纸底',
  needsMedia: false,
  tags: ['process', 'value-chain', 'industry', 'layers'],
  contentShape: 'value-chain',
};

const linkItemSchema = [
  { key: 'name', label: '环节名称', type: 'text' as const },
  { key: 'desc', label: '环节简述', type: 'text' as const },
];

export const theme09ValueChainV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '产业链分层' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'VALUE CHAIN' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '05' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '从芯片到场景：一条链上的三段价值' },
    { key: 'upstreamLabel', label: '上游栏名', type: 'text', inlineEditable: true, defaultValue: '上游 · 基础供给' },
    { key: 'midstreamLabel', label: '中游栏名', type: 'text', inlineEditable: true, defaultValue: '中游 · 模型与平台' },
    { key: 'downstreamLabel', label: '下游栏名', type: 'text', inlineEditable: true, defaultValue: '下游 · 场景落地' },
    { key: 'upstream', label: '上游环节', type: 'array', maxItems: 4, itemSchema: linkItemSchema },
    { key: 'midstream', label: '中游环节', type: 'array', maxItems: 4, itemSchema: linkItemSchema },
    { key: 'downstream', label: '下游环节', type: 'array', maxItems: 4, itemSchema: linkItemSchema },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '结构 · 产业链' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '21' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_UPSTREAM: Theme09ChainLink[] = [
  { name: '算力芯片', desc: '训练卡与推理卡，交期与国产化率决定成本曲线' },
  { name: '智算中心', desc: '集群供电、液冷与网络，单位算力电价是关键变量' },
  { name: '语料与标注', desc: '行业语料清洗、合规授权与高质量标注队伍' },
];

const DEFAULT_MIDSTREAM: Theme09ChainLink[] = [
  { name: '基础模型', desc: '通用底座与行业底座，参数规模与推理成本并重' },
  { name: '训练框架', desc: '分布式训练、微调与推理加速的工具链' },
  { name: '应用中台', desc: '智能体编排、检索增强与权限治理' },
];

const DEFAULT_DOWNSTREAM: Theme09ChainLink[] = [
  { name: '金融风控', desc: '信贷审查与反欺诈，最先跑通付费闭环' },
  { name: '智能制造', desc: '质检、排产与设备预测性维护' },
  { name: '公共服务', desc: '政务问答、医疗辅助与教育测评' },
];

function Arrow(): ReactNode {
  return (
    <span
      aria-hidden="true"
      style={{ flex: 'none', width: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <svg width="28" height="16" viewBox="0 0 28 16" role="presentation">
        <path d="M0 8 H20" stroke="var(--lp-accent)" strokeWidth="1.5" fill="none" />
        <path d="M19 2 L27 8 L19 14 Z" fill="var(--lp-accent)" />
      </svg>
    </span>
  );
}

interface ColumnProps {
  label: string;
  items: Theme09ChainLink[];
  propKey: string;
  index: number;
  slideIdx?: number;
  editable?: boolean;
}

function ChainColumn(props: ColumnProps): ReactNode {
  const { label, items, propKey, index, slideIdx, editable } = props;
  const tone = `var(--lp-series-${(index % 6) + 1})`;

  return (
    <section style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: `2px solid ${tone}`, paddingBottom: 8 }}>
        <span
          style={{
            fontFamily: 'var(--lp-font-mono)',
            fontSize: 11,
            letterSpacing: '0.16em',
            color: 'var(--lp-on-accent)',
            background: tone,
            padding: '3px 7px',
            flex: 'none',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="lp-t9-serif" style={{ fontSize: 17, fontWeight: 700, color: 'var(--lp-ink)', letterSpacing: '0.03em' }}>
          <EditableField prop={`${propKey}Label`} slideIdx={slideIdx} editable={editable} as="span">
            {label}
          </EditableField>
        </span>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: '1 1 auto', minHeight: 0 }}>
        {items.map((it, i) => (
          <article
            key={i}
            style={{
              flex: '1 1 0',
              minHeight: 0,
              border: '1px solid var(--lp-border)',
              borderLeft: `3px solid ${tone}`,
              background: 'var(--lp-surface-solid)',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              justifyContent: 'center',
            }}
          >
            <h4 className="lp-t9-serif" style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--lp-ink)' }}>
              <EditableField prop={`${propKey}.${i}.name`} slideIdx={slideIdx} editable={editable} as="span">
                {it.name ?? ''}
              </EditableField>
            </h4>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.62, color: 'var(--lp-ink3)' }}>
              <EditableField prop={`${propKey}.${i}.desc`} slideIdx={slideIdx} editable={editable} as="span">
                {it.desc ?? ''}
              </EditableField>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Theme09ValueChainV1(props: Theme09ValueChainV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    title,
    upstreamLabel = '上游 · 基础供给',
    midstreamLabel = '中游 · 模型与平台',
    downstreamLabel = '下游 · 场景落地',
    upstream = [],
    midstream = [],
    downstream = [],
    folioLeft,
    folioPage,
    folioRight,
    _slideIdx: s,
    _editable: e,
  } = props;

  const columns = [
    { label: upstreamLabel, items: (upstream.length ? upstream : DEFAULT_UPSTREAM).slice(0, 4), propKey: 'upstream' },
    { label: midstreamLabel, items: (midstream.length ? midstream : DEFAULT_MIDSTREAM).slice(0, 4), propKey: 'midstream' },
    { label: downstreamLabel, items: (downstream.length ? downstream : DEFAULT_DOWNSTREAM).slice(0, 4), propKey: 'downstream' },
  ];

  return (
    <Sheet substrate="paper" frame="grid" className="lp-theme09-valuechain">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 20, padding: '96px 60px 70px' }}>
        {title && (
          <h2 className="lp-t9-serif" style={{ margin: 0, fontSize: 32, fontWeight: 700, lineHeight: 1.24, color: 'var(--lp-ink)' }}>
            <EditableField prop="title" slideIdx={s} editable={e} as="span">
              {title}
            </EditableField>
          </h2>
        )}

        <div style={{ display: 'flex', alignItems: 'stretch', flex: '1 1 auto', minHeight: 0 }}>
          {columns.map((col, i) => (
            <Fragment key={col.propKey}>
              {i > 0 && <Arrow />}
              <ChainColumn label={col.label} items={col.items} propKey={col.propKey} index={i} slideIdx={s} editable={e} />
            </Fragment>
          ))}
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
