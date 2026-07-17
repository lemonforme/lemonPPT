import type { DeckGoal, Slide as CoreSlide } from '@lemonppt/core';
import PptxGenJS, { type Slide as PptxSlide } from 'pptxgenjs';

export interface PptxExportOptions {
  outFile: string;
  title?: string;
  subject?: string;
  author?: string;
}

const COLORS = {
  primary: '0F172A',
  secondary: '64748B',
  accent: '3B82F6',
  white: 'FFFFFF',
};

const FONTS = {
  heading: 'Inter',
  body: 'Inter',
  mono: 'JetBrains Mono',
};

export async function exportDeckToPptx(goal: DeckGoal, options: PptxExportOptions): Promise<void> {
  const { outFile, title = goal.title, subject, author } = options;

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = title;
  if (subject) pptx.subject = subject;
  if (author) pptx.author = author;

  for (const slide of goal.slides) {
    const pptxSlide = pptx.addSlide();
    renderSlideToPptx(pptxSlide, slide);
  }

  await pptx.writeFile({ fileName: outFile });
}

function renderSlideToPptx(pptxSlide: PptxSlide, slide: CoreSlide): void {
  switch (slide.layout) {
    case 'minimal_cover_v1':
      renderCoverV1(pptxSlide, slide.props as unknown as CoverV1Props);
      break;
    case 'minimal_metric_v2':
      renderMetricV2(pptxSlide, slide.props as unknown as MetricV2Props);
      break;
    case 'minimal_table_of_contents_v1':
      renderTableOfContentsV1(pptxSlide, slide.props as unknown as TableOfContentsV1Props);
      break;
    case 'minimal_comparison_v1':
      renderComparisonV1(pptxSlide, slide.props as unknown as ComparisonV1Props);
      break;
    case 'minimal_process_v1':
      renderProcessV1(pptxSlide, slide.props as unknown as ProcessV1Props);
      break;
    case 'minimal_quote_v1':
      renderQuoteV1(pptxSlide, slide.props as unknown as QuoteV1Props);
      break;
    case 'minimal_content_v1':
      renderContentV1(pptxSlide, slide.props as unknown as ContentV1Props);
      break;
    case 'minimal_closing_v1':
      renderClosingV1(pptxSlide, slide.props as unknown as ClosingV1Props);
      break;
    default:
      pptxSlide.addText(`Unknown layout: ${slide.layout}`, {
        x: 0.5, y: 3.5, w: 9, h: 1,
        fontSize: 18, color: 'EF4444', align: 'center',
      });
  }
}

interface CoverV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  date?: string;
}

function renderCoverV1(slide: PptxSlide, props: CoverV1Props): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 1, y: 2.2, w: 8, h: 0.4,
      fontSize: 14, color: COLORS.accent, align: 'center',
      fontFace: FONTS.mono,
    });
  }
  slide.addText(props.title, {
    x: 1, y: 2.7, w: 8, h: 1.2,
    fontSize: 54, color: COLORS.primary, bold: true, align: 'center',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 4.0, w: 7, h: 0.8,
      fontSize: 22, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.body,
    });
  }
  if (props.date) {
    slide.addText(props.date, {
      x: 1, y: 5.2, w: 8, h: 0.3,
      fontSize: 14, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.mono,
    });
  }
}

interface MetricV2Props {
  kicker?: string;
  value: string;
  unit?: string;
  description?: string;
}

function renderMetricV2(slide: PptxSlide, props: MetricV2Props): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 1, y: 1.8, w: 8, h: 0.4,
      fontSize: 14, color: COLORS.accent, align: 'center',
      fontFace: FONTS.mono,
    });
  }
  const metricText = props.unit ? `${props.value} ${props.unit}` : props.value;
  slide.addText(metricText, {
    x: 1, y: 2.5, w: 8, h: 1.4,
    fontSize: 80, color: COLORS.primary, bold: true, align: 'center',
    fontFace: FONTS.heading,
  });
  if (props.description) {
    slide.addText(props.description, {
      x: 1.5, y: 4.1, w: 7, h: 0.8,
      fontSize: 20, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.body,
    });
  }
}

interface ContentV1Props {
  kicker?: string;
  title: string;
  points?: string[];
}

function renderContentV1(slide: PptxSlide, props: ContentV1Props): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.8, y: 1.0, w: 8.4, h: 0.4,
      fontSize: 14, color: COLORS.accent, align: 'left',
      fontFace: FONTS.mono,
    });
  }
  slide.addText(props.title, {
    x: 0.8, y: 1.5, w: 8.4, h: 1.0,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'left',
    fontFace: FONTS.heading,
  });

  const points = props.points || [];
  let y = 2.8;
  for (const point of points) {
    slide.addShape('ellipse', {
      x: 0.9, y: y + 0.18, w: 0.1, h: 0.1,
      fill: { color: COLORS.accent },
    });
    slide.addText(point, {
      x: 1.2, y, w: 8, h: 0.6,
      fontSize: 22, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    y += 0.85;
  }
}

interface ClosingV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  cta?: string;
}

function renderClosingV1(slide: PptxSlide, props: ClosingV1Props): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 1, y: 2.0, w: 8, h: 0.4,
      fontSize: 14, color: COLORS.accent, align: 'center',
      fontFace: FONTS.mono,
    });
  }
  slide.addText(props.title, {
    x: 1, y: 2.5, w: 8, h: 1.0,
    fontSize: 48, color: COLORS.primary, bold: true, align: 'center',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 3.6, w: 7, h: 0.7,
      fontSize: 22, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.body,
    });
  }
  if (props.cta) {
    slide.addShape('roundRect', {
      x: 3.5, y: 4.6, w: 3, h: 0.6,
      fill: { color: COLORS.accent },
      rectRadius: 0.3,
    });
    slide.addText(props.cta, {
      x: 3.5, y: 4.6, w: 3, h: 0.6,
      fontSize: 16, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
  }
}

interface TableOfContentsV1Props {
  kicker?: string;
  title: string;
  items?: string[];
}

function renderTableOfContentsV1(slide: PptxSlide, props: TableOfContentsV1Props): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.8, y: 0.8, w: 8.4, h: 0.4,
      fontSize: 14, color: COLORS.accent, align: 'left',
      fontFace: FONTS.mono,
    });
  }
  slide.addText(props.title, {
    x: 0.8, y: 1.3, w: 8.4, h: 0.9,
    fontSize: 44, color: COLORS.primary, bold: true, align: 'left',
    fontFace: FONTS.heading,
  });

  const items = props.items || [];
  let y = 2.6;
  items.forEach((item, index) => {
    const number = String(index + 1).padStart(2, '0');
    slide.addText(number, {
      x: 0.8, y, w: 0.8, h: 0.5,
      fontSize: 18, color: COLORS.accent, align: 'left', valign: 'top',
      fontFace: FONTS.mono,
    });
    slide.addText(item, {
      x: 1.7, y, w: 7.8, h: 0.5,
      fontSize: 26, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    y += 0.9;
  });
}

interface ComparisonV1Props {
  kicker?: string;
  title: string;
  leftTitle?: string;
  leftPoints?: string[];
  rightTitle?: string;
  rightPoints?: string[];
}

function renderComparisonV1(slide: PptxSlide, props: ComparisonV1Props): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.8, y: 0.8, w: 8.4, h: 0.4,
      fontSize: 14, color: COLORS.accent, align: 'left',
      fontFace: FONTS.mono,
    });
  }
  slide.addText(props.title, {
    x: 0.8, y: 1.3, w: 8.4, h: 0.9,
    fontSize: 44, color: COLORS.primary, bold: true, align: 'left',
    fontFace: FONTS.heading,
  });

  const leftTitle = props.leftTitle || '方案 A';
  const rightTitle = props.rightTitle || '方案 B';

  slide.addText(leftTitle, {
    x: 0.8, y: 2.4, w: 4.0, h: 0.5,
    fontSize: 24, color: COLORS.primary, bold: true, align: 'left',
    fontFace: FONTS.heading,
  });
  slide.addText(rightTitle, {
    x: 5.2, y: 2.4, w: 4.0, h: 0.5,
    fontSize: 24, color: COLORS.primary, bold: true, align: 'left',
    fontFace: FONTS.heading,
  });

  const leftPoints = props.leftPoints || [];
  let leftY = 3.1;
  leftPoints.forEach((point) => {
    slide.addShape('ellipse', {
      x: 0.9, y: leftY + 0.15, w: 0.1, h: 0.1,
      fill: { color: COLORS.accent },
    });
    slide.addText(point, {
      x: 1.2, y: leftY, w: 3.8, h: 0.5,
      fontSize: 20, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    leftY += 0.75;
  });

  const rightPoints = props.rightPoints || [];
  let rightY = 3.1;
  rightPoints.forEach((point) => {
    slide.addShape('ellipse', {
      x: 5.3, y: rightY + 0.15, w: 0.1, h: 0.1,
      fill: { color: COLORS.accent },
    });
    slide.addText(point, {
      x: 5.6, y: rightY, w: 3.8, h: 0.5,
      fontSize: 20, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    rightY += 0.75;
  });
}

interface ProcessV1Props {
  kicker?: string;
  title: string;
  steps?: string[];
}

function renderProcessV1(slide: PptxSlide, props: ProcessV1Props): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.8, y: 0.8, w: 8.4, h: 0.4,
      fontSize: 14, color: COLORS.accent, align: 'left',
      fontFace: FONTS.mono,
    });
  }
  slide.addText(props.title, {
    x: 0.8, y: 1.3, w: 8.4, h: 0.9,
    fontSize: 44, color: COLORS.primary, bold: true, align: 'left',
    fontFace: FONTS.heading,
  });

  const steps = props.steps || [];
  const count = steps.length;
  if (count === 0) return;

  const stepWidth = 8.4 / count;
  steps.forEach((step, index) => {
    const x = 0.8 + index * stepWidth;
    slide.addShape('ellipse', {
      x: x + stepWidth / 2 - 0.3, y: 2.6, w: 0.6, h: 0.6,
      fill: { color: COLORS.accent },
    });
    slide.addText(String(index + 1), {
      x: x + stepWidth / 2 - 0.3, y: 2.6, w: 0.6, h: 0.6,
      fontSize: 22, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.heading,
    });
    slide.addText(step, {
      x: x + 0.1, y: 3.5, w: stepWidth - 0.2, h: 1.2,
      fontSize: 18, color: COLORS.primary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

interface QuoteV1Props {
  quote: string;
  author?: string;
  source?: string;
}

function renderQuoteV1(slide: PptxSlide, props: QuoteV1Props): void {
  slide.addText(`“${props.quote}”`, {
    x: 1, y: 2.0, w: 8, h: 2.2,
    fontSize: 36, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });

  const attribution = [props.author, props.source].filter(Boolean).join(' · ');
  if (attribution) {
    slide.addText(attribution, {
      x: 1, y: 4.4, w: 8, h: 0.4,
      fontSize: 18, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.mono,
    });
  }
}
