import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface PartnersV1Props {
  kicker?: string;
  title: string;
  partners?: { name?: string; logoUrl?: string }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const partnersV1Meta: LayoutMeta = {
  id: 'minimal_partners_v1',
  theme: 'minimal',
  role: 'partners',
  displayName: '合作伙伴墙',
  description: 'Logo 网格展示合作伙伴或客户',
  needsMedia: true,
};

export function PartnersV1(props: PartnersV1Props): ReactNode {
  const { kicker, title, partners = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-partners-v1">
      <div className="lp-partners-v1-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading">
          {title}
        </EditableField>
      </div>
      <div className="lp-partners-v1-grid">
        {partners.map((partner, index) => (
          <div key={index} className="lp-partners-v1-card">
            {partner.logoUrl ? (
              <img
                src={partner.logoUrl}
                alt={partner.name || ''}
                data-lp-editable-image="true"
                data-lp-slide-idx={_slideIdx}
                data-lp-prop={`partners.${index}.logoUrl`}
              />
            ) : (
              <div className="lp-partners-v1-logo-placeholder" />
            )}
            <EditableField
              prop={`partners.${index}.name`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="div"
              className="lp-partners-v1-name"
            >
              {partner.name}
            </EditableField>
          </div>
        ))}
      </div>
    </div>
  );
}
