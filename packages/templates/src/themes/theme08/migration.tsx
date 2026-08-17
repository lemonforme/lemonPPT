// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { T08Frame, T08Footer, commonFields, buildMeta } from './shared.js';
import { T08Header } from './shared.js';


export interface Theme08MigrationProps { kicker?: string; title?: string; subtitle?: string; items?: any[]; footerLeft?: string; footerRight?: string; _slideIdx?: number; _editable?: boolean; [key: string]: unknown; }

const DEFAULT_ITEMS: any[] = [{"title":"需求","note":"明确价值与边界。"},{"title":"原型","note":"快速验证关键假设。"},{"title":"放大","note":"规模化复制成功路径。"},{"title":"闭环","note":"数据反哺持续优化。"},{"title":"治理","note":"合规与风险控制。"}];

export const theme08MigrationMeta: LayoutMeta = buildMeta({
  id: 'theme08_migration_v1',
  role: 'migration',
  displayName: '迁移图',
  description: '策略页：迁移步骤',
  contentShape: 'migration',
  tags: ['black-gold', 'experimental'],
});

export const theme08MigrationSchema: PropsSchema = {
  fields: [
    ...commonFields({ kicker: 'BLACK GOLD', title: '迁移图', subtitle: '' }),
    ...([{"key":"items","label":"步骤","type":"array","itemSchema":[{"key":"title","label":"标题","type":"text"},{"key":"note","label":"说明","type":"text"}]}] as any),
  ],
};

export function Theme08Migration(props: Theme08MigrationProps): ReactNode {
  const { kicker, title = '标题', subtitle, items = DEFAULT_ITEMS, footerLeft, footerRight, _slideIdx, _editable } = props;
  
  return (
      <T08Frame className="t08-capital">
        <div className="lp-theme08-sec">
          <T08Header kicker={kicker} title={title} subtitle={subtitle} _slideIdx={_slideIdx} _editable={_editable} />
          <div className="t08-capital-loop">
            {items.map((s, i) => (
              <div key={i} className="t08-capital-step"><b><EditableField prop={'items.' + i + '.title'} slideIdx={_slideIdx} editable={_editable} as="span">{s.title}</EditableField></b> · <EditableField prop={'items.' + i + '.note'} slideIdx={_slideIdx} editable={_editable} as="span">{s.note}</EditableField>{i < items.length - 1 && ' →'}</div>
            ))}
          </div>
          <T08Footer left={footerLeft} right={footerRight} _slideIdx={_slideIdx} _editable={_editable} />
        </div>
      </T08Frame>
  );
}
