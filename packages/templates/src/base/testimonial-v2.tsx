import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface TestimonialV2Props {
  quote: string;
  author?: string;
  role?: string;
  company?: string;
  logoUrl?: string;
  metric?: string;
  metricLabel?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const testimonialV2Meta: LayoutMeta = {
  id: 'testimonial_v2',
  theme: 'base',
  role: 'testimonial',
  displayName: '客户评价卡片',
  description: '卡片式客户证言，可配数据指标与公司 logo',
  needsMedia: true,
};

export function TestimonialV2(props: TestimonialV2Props): ReactNode {
  const { quote, author, role, company, logoUrl, metric, metricLabel, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-testimonial-v2">
      <div className="lp-testimonial-v2-card">
        {logoUrl ? (
          <img
            className="lp-testimonial-v2-logo"
            src={logoUrl}
            alt={company || ''}
            data-lp-editable-image="true"
            data-lp-slide-idx={_slideIdx}
            data-lp-prop="logoUrl"
          />
        ) : (
          company && (
            <EditableField
              prop="company"
              slideIdx={_slideIdx}
              editable={_editable}
              as="div"
              className="lp-testimonial-v2-company"
            >
              {company}
            </EditableField>
          )
        )}
        <EditableField
          prop="quote"
          slideIdx={_slideIdx}
          editable={_editable}
          as="blockquote"
          className="lp-testimonial-v2-quote"
        >
          {quote}
        </EditableField>
        <div className="lp-testimonial-v2-footer">
          <div className="lp-testimonial-v2-author">
            {author && (
              <EditableField
                prop="author"
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-testimonial-v2-name"
              >
                {author}
              </EditableField>
            )}
            {role && (
              <EditableField
                prop="role"
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-testimonial-v2-role"
              >
                {role}
              </EditableField>
            )}
          </div>
          {metric && (
            <div className="lp-testimonial-v2-metric">
              <EditableField
                prop="metric"
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-testimonial-v2-metric-value"
              >
                {metric}
              </EditableField>
              {metricLabel && (
                <EditableField
                  prop="metricLabel"
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="div"
                  className="lp-testimonial-v2-metric-label"
                >
                  {metricLabel}
                </EditableField>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
