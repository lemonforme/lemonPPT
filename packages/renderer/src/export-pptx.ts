import type { DeckGoal, Slide as CoreSlide } from '@lemonppt/core';
import { normalizeDeckGoal } from '@lemonppt/core';
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
  light: 'F1F5F9',
  border: 'E2E8F0',
};

const FONTS = {
  heading: 'Inter',
  body: 'Inter',
  mono: 'JetBrains Mono',
};

export async function exportDeckToPptx(goal: DeckGoal, options: PptxExportOptions): Promise<void> {
  goal = normalizeDeckGoal(goal);
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
    case 'cover_v1':
      renderCoverV1(pptxSlide, slide.props as unknown as CoverV1Props);
      break;
    case 'table_of_contents_v1':
      renderTableOfContentsV1(pptxSlide, slide.props as unknown as TableOfContentsV1Props);
      break;
    case 'metric_v1':
      renderMetricV1(pptxSlide, slide.props as unknown as MetricV1Props);
      break;
    case 'metric_v2':
      renderMetricV2(pptxSlide, slide.props as unknown as MetricV2Props);
      break;
    case 'stats_v1':
      renderStatsV1(pptxSlide, slide.props as unknown as StatsV1Props);
      break;
    case 'chart_v1':
      renderChartV1(pptxSlide, slide.props as unknown as ChartV1Props);
      break;
    case 'content_v1':
      renderContentV1(pptxSlide, slide.props as unknown as ContentV1Props);
      break;
    case 'content_v2':
      renderContentV2(pptxSlide, slide.props as unknown as ContentV2Props);
      break;
    case 'content_v3':
      renderContentV3(pptxSlide, slide.props as unknown as ContentV3Props);
      break;
    case 'split_v1':
      renderSplitV1(pptxSlide, slide.props as unknown as SplitV1Props);
      break;
    case 'comparison_v1':
      renderComparisonV1(pptxSlide, slide.props as unknown as ComparisonV1Props);
      break;
    case 'comparison_v2':
      renderComparisonV2(pptxSlide, slide.props as unknown as ComparisonV2Props);
      break;
    case 'process_v1':
      renderProcessV1(pptxSlide, slide.props as unknown as ProcessV1Props);
      break;
    case 'process_v2':
      renderProcessV2(pptxSlide, slide.props as unknown as ProcessV2Props);
      break;
    case 'timeline_v1':
      renderTimelineV1(pptxSlide, slide.props as unknown as TimelineV1Props);
      break;
    case 'roadmap_v1':
      renderRoadmapV1(pptxSlide, slide.props as unknown as RoadmapV1Props);
      break;
    case 'quote_v1':
      renderQuoteV1(pptxSlide, slide.props as unknown as QuoteV1Props);
      break;
    case 'quote_v2':
      renderQuoteV2(pptxSlide, slide.props as unknown as QuoteV2Props);
      break;
    case 'testimonial_v1':
      renderTestimonialV1(pptxSlide, slide.props as unknown as TestimonialV1Props);
      break;
    case 'faq_v1':
      renderFaqV1(pptxSlide, slide.props as unknown as FaqV1Props);
      break;
    case 'feature_v1':
      renderFeatureV1(pptxSlide, slide.props as unknown as FeatureV1Props);
      break;
    case 'team_v1':
      renderTeamV1(pptxSlide, slide.props as unknown as TeamV1Props);
      break;
    case 'partners_v1':
      renderPartnersV1(pptxSlide, slide.props as unknown as PartnersV1Props);
      break;
    case 'pricing_v1':
      renderPricingV1(pptxSlide, slide.props as unknown as PricingV1Props);
      break;
    case 'gallery_v1':
      renderGalleryV1(pptxSlide, slide.props as unknown as GalleryV1Props);
      break;
    case 'image_v1':
      renderImageV1(pptxSlide, slide.props as unknown as ImageV1Props);
      break;
    case 'swot_v1':
      renderSwotV1(pptxSlide, slide.props as unknown as SwotV1Props);
      break;
    case 'pest_v1':
      renderPestV1(pptxSlide, slide.props as unknown as PestV1Props);
      break;
    case 'closing_v1':
      renderClosingV1(pptxSlide, slide.props as unknown as ClosingV1Props);
      break;
    case 'closing_v2':
      renderClosingV2(pptxSlide, slide.props as unknown as ClosingV2Props);
      break;
    default:
      pptxSlide.addText(`Unknown layout: ${slide.layout}`, {
        x: 0.5, y: 3.5, w: 9, h: 1,
        fontSize: 18, color: 'EF4444', align: 'center',
      });
  }
}

// ---- Shared helpers --------------------------------------------------------

function addKicker(slide: PptxSlide, kicker: string | undefined, x = 0.8, y = 0.8): void {
  if (!kicker) return;
  slide.addText(kicker, {
    x, y, w: 8.4, h: 0.4,
    fontSize: 14, color: COLORS.accent, align: 'left',
    fontFace: FONTS.mono,
  });
}

function addTitle(slide: PptxSlide, title: string, x = 0.8, y = 1.3, w = 8.4, h = 0.9, fontSize = 44): void {
  slide.addText(title, {
    x, y, w, h,
    fontSize, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
    fontFace: FONTS.heading,
  });
}

function addBulletList(slide: PptxSlide, items: string[], x: number, y: number, w: number, maxItems = 8): number {
  const list = items.slice(0, maxItems);
  let cy = y;
  for (const item of list) {
    slide.addShape('ellipse', {
      x: x + 0.05, y: cy + 0.16, w: 0.1, h: 0.1,
      fill: { color: COLORS.accent },
    });
    slide.addText(item, {
      x: x + 0.3, y: cy, w: w - 0.3, h: 0.55,
      fontSize: 20, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    cy += 0.7;
  }
  return cy;
}

function addImageMaybe(slide: PptxSlide, url: string | undefined, x: number, y: number, w: number, h: number): void {
  if (!url) return;
  // pptxgenjs 在 Node 环境无法直接下载远程 URL，仅当为本地文件或 base64 时可用。
  try {
    slide.addImage({ path: url, x, y, w, h, sizing: { type: 'crop', w, h } });
  } catch {
    slide.addText('[图片]', { x, y, w, h, fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'middle' });
  }
}

// ---- Layout renderers ------------------------------------------------------

interface CoverV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  date?: string;
  image?: string;
}

function renderCoverV1(slide: PptxSlide, props: CoverV1Props): void {
  if (props.image) addImageMaybe(slide, props.image, 0, 0, 10, 5.625);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 1, y: 2.0, w: 8, h: 0.4,
      fontSize: 14, color: COLORS.accent, align: 'center',
      fontFace: FONTS.mono,
    });
  }
  slide.addText(props.title, {
    x: 1, y: 2.5, w: 8, h: 1.2,
    fontSize: 54, color: COLORS.primary, bold: true, align: 'center',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 3.8, w: 7, h: 0.8,
      fontSize: 22, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.body,
    });
  }
  if (props.date) {
    slide.addText(props.date, {
      x: 1, y: 5.0, w: 8, h: 0.3,
      fontSize: 14, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.mono,
    });
  }
}

interface TableOfContentsV1Props {
  kicker?: string;
  title: string;
  items?: string[];
}

function renderTableOfContentsV1(slide: PptxSlide, props: TableOfContentsV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
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

interface MetricV1Props {
  label?: string;
  value: string;
  unit?: string;
  description?: string;
}

function renderMetricV1(slide: PptxSlide, props: MetricV1Props): void {
  if (props.label) {
    slide.addText(props.label, {
      x: 1, y: 1.8, w: 8, h: 0.4,
      fontSize: 16, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.body,
    });
  }
  const metricText = props.unit ? `${props.value} ${props.unit}` : props.value;
  slide.addText(metricText, {
    x: 1, y: 2.4, w: 8, h: 1.4,
    fontSize: 90, color: COLORS.primary, bold: true, align: 'center',
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

interface StatsV1Props {
  kicker?: string;
  title: string;
  stats?: { label?: string; value?: string; unit?: string; change?: string }[];
}

function renderStatsV1(slide: PptxSlide, props: StatsV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const stats = (props.stats || []).slice(0, 4);
  const positions = [
    { x: 0.8, y: 2.5 },
    { x: 5.2, y: 2.5 },
    { x: 0.8, y: 4.0 },
    { x: 5.2, y: 4.0 },
  ];
  stats.forEach((stat, index) => {
    const pos = positions[index];
    if (!pos) return;
    slide.addShape('rect', {
      x: pos.x, y: pos.y, w: 4.2, h: 1.3,
      fill: { color: COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    const valueText = [stat.value, stat.unit].filter(Boolean).join(' ');
    slide.addText(valueText || '-', {
      x: pos.x + 0.2, y: pos.y + 0.15, w: 3.8, h: 0.55,
      fontSize: 30, color: COLORS.primary, bold: true, align: 'left',
      fontFace: FONTS.heading,
    });
    slide.addText(stat.label || '', {
      x: pos.x + 0.2, y: pos.y + 0.75, w: 2.6, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.body,
    });
    if (stat.change) {
      slide.addText(stat.change, {
        x: pos.x + 2.8, y: pos.y + 0.75, w: 1.2, h: 0.35,
        fontSize: 14, color: COLORS.accent, align: 'right',
        fontFace: FONTS.mono,
      });
    }
  });
}

interface ChartV1Props {
  title: string;
  kicker?: string;
  type?: 'bar' | 'line' | 'pie';
  labels?: string[];
  data?: number[];
  unit?: string;
}

function renderChartV1(slide: PptxSlide, props: ChartV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const labels = props.labels || [];
  const data = props.data || [];
  if (labels.length === 0 || data.length === 0) return;

  const chartType = props.type || 'bar';
  const chartData = [
    {
      name: props.title,
      labels,
      values: data,
    },
  ];
  slide.addChart(chartType as 'bar' | 'line' | 'pie', chartData, {
    x: 0.8, y: 2.3, w: 8.4, h: 3.2,
    chartColors: [COLORS.accent],
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });
}

interface ContentV1Props {
  kicker?: string;
  title: string;
  points?: string[];
}

function renderContentV1(slide: PptxSlide, props: ContentV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  addBulletList(slide, props.points || [], 0.8, 2.8, 8.4);
}

interface ContentV2Props {
  kicker?: string;
  title: string;
  leftPoints?: string[];
  rightPoints?: string[];
}

function renderContentV2(slide: PptxSlide, props: ContentV2Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  slide.addText('左栏', {
    x: 0.8, y: 2.4, w: 4.0, h: 0.4,
    fontSize: 18, color: COLORS.accent, bold: true, align: 'left',
    fontFace: FONTS.heading,
  });
  slide.addText('右栏', {
    x: 5.2, y: 2.4, w: 4.0, h: 0.4,
    fontSize: 18, color: COLORS.accent, bold: true, align: 'left',
    fontFace: FONTS.heading,
  });
  addBulletList(slide, props.leftPoints || [], 0.8, 2.9, 4.0);
  addBulletList(slide, props.rightPoints || [], 5.2, 2.9, 4.0);
}

interface ContentV3Props {
  kicker?: string;
  title: string;
  points?: string[];
  imageUrl?: string;
  imageAlt?: string;
}

function renderContentV3(slide: PptxSlide, props: ContentV3Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title, 0.8, 1.3, 4.5);
  addBulletList(slide, props.points || [], 0.8, 2.5, 4.2);
  addImageMaybe(slide, props.imageUrl, 5.3, 1.5, 4.0, 3.5);
}

interface SplitV1Props {
  kicker?: string;
  title: string;
  points?: string[];
  imageUrl?: string;
  imageAlt?: string;
}

function renderSplitV1(slide: PptxSlide, props: SplitV1Props): void {
  renderContentV3(slide, props);
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
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  renderComparisonColumns(slide, props.leftTitle || '方案 A', props.leftPoints || [], props.rightTitle || '方案 B', props.rightPoints || []);
}

interface ComparisonV2Props {
  kicker?: string;
  title: string;
  leftTitle?: string;
  leftPoints?: string[];
  rightTitle?: string;
  rightPoints?: string[];
}

function renderComparisonV2(slide: PptxSlide, props: ComparisonV2Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  renderComparisonColumns(slide, props.leftTitle || '优点', props.leftPoints || [], props.rightTitle || '缺点', props.rightPoints || []);
}

function renderComparisonColumns(
  slide: PptxSlide,
  leftTitle: string,
  leftPoints: string[],
  rightTitle: string,
  rightPoints: string[]
): void {
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
  addBulletList(slide, leftPoints, 0.8, 3.0, 4.0);
  addBulletList(slide, rightPoints, 5.2, 3.0, 4.0);
}

interface ProcessV1Props {
  kicker?: string;
  title: string;
  steps?: string[];
}

function renderProcessV1(slide: PptxSlide, props: ProcessV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
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

interface ProcessV2Props {
  kicker?: string;
  title: string;
  steps?: { title?: string; description?: string }[];
}

function renderProcessV2(slide: PptxSlide, props: ProcessV2Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const steps = (props.steps || []).slice(0, 4);
  let y = 2.5;
  steps.forEach((step, index) => {
    slide.addShape('ellipse', {
      x: 0.9, y: y + 0.12, w: 0.4, h: 0.4,
      fill: { color: COLORS.accent },
    });
    slide.addText(String(index + 1), {
      x: 0.9, y: y + 0.12, w: 0.4, h: 0.4,
      fontSize: 16, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.heading,
    });
    slide.addText(step.title || '', {
      x: 1.6, y, w: 7.6, h: 0.35,
      fontSize: 20, color: COLORS.primary, bold: true, align: 'left',
      fontFace: FONTS.heading,
    });
    slide.addText(step.description || '', {
      x: 1.6, y: y + 0.38, w: 7.6, h: 0.5,
      fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    y += 1.0;
  });
}

interface TimelineV1Props {
  kicker?: string;
  title: string;
  milestones?: { date?: string; title?: string; description?: string }[];
}

function renderTimelineV1(slide: PptxSlide, props: TimelineV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const milestones = (props.milestones || []).slice(0, 4);
  const count = milestones.length || 1;
  const stepWidth = 8.4 / count;
  milestones.forEach((m, index) => {
    const cx = 0.8 + stepWidth * index + stepWidth / 2;
    slide.addShape('ellipse', {
      x: cx - 0.2, y: 3.0, w: 0.4, h: 0.4,
      fill: { color: COLORS.accent },
    });
    slide.addShape('line', {
      x1: 0.8 + stepWidth * index, y1: 3.2, x2: 0.8 + stepWidth * (index + 1), y2: 3.2,
      line: { color: COLORS.border, width: 2 },
    });
    slide.addText(m.date || '', {
      x: cx - stepWidth / 2 + 0.1, y: 2.4, w: stepWidth - 0.2, h: 0.4,
      fontSize: 12, color: COLORS.accent, align: 'center', valign: 'top',
      fontFace: FONTS.mono,
    });
    slide.addText(m.title || '', {
      x: cx - stepWidth / 2 + 0.1, y: 3.6, w: stepWidth - 0.2, h: 0.4,
      fontSize: 14, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(m.description || '', {
      x: cx - stepWidth / 2 + 0.1, y: 4.05, w: stepWidth - 0.2, h: 0.8,
      fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

interface RoadmapV1Props {
  kicker?: string;
  title: string;
  phases?: { title?: string; description?: string; status?: string }[];
}

function renderRoadmapV1(slide: PptxSlide, props: RoadmapV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const phases = (props.phases || []).slice(0, 4);
  let y = 2.5;
  phases.forEach((phase, index) => {
    const statusColor = phase.status === '已完成' ? COLORS.accent : COLORS.secondary;
    slide.addShape('rect', {
      x: 0.8, y, w: 0.2, h: 0.7,
      fill: { color: statusColor },
    });
    slide.addText(`${index + 1}. ${phase.title || ''}`, {
      x: 1.1, y, w: 7.8, h: 0.35,
      fontSize: 18, color: COLORS.primary, bold: true, align: 'left',
      fontFace: FONTS.heading,
    });
    slide.addText(phase.description || '', {
      x: 1.1, y: y + 0.38, w: 7.8, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    y += 1.0;
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

interface QuoteV2Props {
  quote: string;
  author?: string;
  role?: string;
}

function renderQuoteV2(slide: PptxSlide, props: QuoteV2Props): void {
  slide.addShape('rect', {
    x: 0.6, y: 1.5, w: 0.15, h: 2.8,
    fill: { color: COLORS.accent },
  });
  slide.addText(`“${props.quote}”`, {
    x: 1.0, y: 1.8, w: 8.0, h: 2.0,
    fontSize: 34, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
    fontFace: FONTS.heading,
  });
  const attribution = [props.author, props.role].filter(Boolean).join(' · ');
  if (attribution) {
    slide.addText(attribution, {
      x: 1.0, y: 4.0, w: 8.0, h: 0.4,
      fontSize: 18, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }
}

interface TestimonialV1Props {
  quote: string;
  author?: string;
  role?: string;
  company?: string;
  avatarUrl?: string;
}

function renderTestimonialV1(slide: PptxSlide, props: TestimonialV1Props): void {
  slide.addText(`“${props.quote}”`, {
    x: 1, y: 1.8, w: 8, h: 2.2,
    fontSize: 34, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });
  if (props.avatarUrl) addImageMaybe(slide, props.avatarUrl, 4.5, 4.1, 1, 1);
  const attribution = [props.author, props.role, props.company].filter(Boolean).join(' · ');
  if (attribution) {
    slide.addText(attribution, {
      x: 1, y: 5.0, w: 8, h: 0.4,
      fontSize: 16, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.mono,
    });
  }
}

interface FaqV1Props {
  kicker?: string;
  title: string;
  items?: { q?: string; a?: string }[];
}

function renderFaqV1(slide: PptxSlide, props: FaqV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const items = (props.items || []).slice(0, 4);
  let y = 2.5;
  items.forEach((item) => {
    slide.addText(`Q: ${item.q || ''}`, {
      x: 0.8, y, w: 8.4, h: 0.35,
      fontSize: 18, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(`A: ${item.a || ''}`, {
      x: 0.8, y: y + 0.4, w: 8.4, h: 0.55,
      fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    y += 1.1;
  });
}

interface FeatureV1Props {
  kicker?: string;
  title: string;
  features?: { title?: string; description?: string }[];
}

function renderFeatureV1(slide: PptxSlide, props: FeatureV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const features = (props.features || []).slice(0, 3);
  const cardWidth = 2.6;
  const gap = 0.3;
  const startX = (10 - (features.length * cardWidth + (features.length - 1) * gap)) / 2;
  features.forEach((feature, index) => {
    const x = startX + index * (cardWidth + gap);
    slide.addShape('rect', {
      x, y: 2.8, w: cardWidth, h: 2.2,
      fill: { color: COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addText(feature.title || '', {
      x: x + 0.15, y: 3.0, w: cardWidth - 0.3, h: 0.5,
      fontSize: 20, color: COLORS.primary, bold: true, align: 'center',
      fontFace: FONTS.heading,
    });
    slide.addText(feature.description || '', {
      x: x + 0.15, y: 3.6, w: cardWidth - 0.3, h: 1.2,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

interface TeamV1Props {
  kicker?: string;
  title: string;
  members?: { name?: string; role?: string; bio?: string; imageUrl?: string }[];
}

function renderTeamV1(slide: PptxSlide, props: TeamV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const members = (props.members || []).slice(0, 4);
  const cardWidth = 2.0;
  const gap = 0.4;
  const startX = (10 - (members.length * cardWidth + (members.length - 1) * gap)) / 2;
  members.forEach((member, index) => {
    const x = startX + index * (cardWidth + gap);
    if (member.imageUrl) addImageMaybe(slide, member.imageUrl, x + 0.5, 2.7, 1, 1);
    slide.addText(member.name || '', {
      x, y: 3.85, w: cardWidth, h: 0.35,
      fontSize: 16, color: COLORS.primary, bold: true, align: 'center',
      fontFace: FONTS.heading,
    });
    slide.addText(member.role || '', {
      x, y: 4.2, w: cardWidth, h: 0.3,
      fontSize: 12, color: COLORS.accent, align: 'center',
      fontFace: FONTS.mono,
    });
    slide.addText(member.bio || '', {
      x, y: 4.55, w: cardWidth, h: 0.55,
      fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

interface PartnersV1Props {
  kicker?: string;
  title: string;
  partners?: { name?: string; logoUrl?: string }[];
}

function renderPartnersV1(slide: PptxSlide, props: PartnersV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const partners = (props.partners || []).slice(0, 8);
  const cols = 4;
  const cellW = 2.0;
  const cellH = 1.1;
  const gapX = 0.4;
  const gapY = 0.3;
  const startX = (10 - (cols * cellW + (cols - 1) * gapX)) / 2;
  partners.forEach((partner, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = startX + col * (cellW + gapX);
    const y = 2.5 + row * (cellH + gapY);
    slide.addShape('rect', {
      x, y, w: cellW, h: cellH,
      fill: { color: COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    if (partner.logoUrl) addImageMaybe(slide, partner.logoUrl, x + 0.25, y + 0.15, cellW - 0.5, cellH - 0.5);
    slide.addText(partner.name || '', {
      x, y: y + cellH - 0.25, w: cellW, h: 0.25,
      fontSize: 12, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.body,
    });
  });
}

interface PricingV1Props {
  kicker?: string;
  title: string;
  tiers?: { name?: string; price?: string; period?: string; features?: string[]; cta?: string }[];
}

function renderPricingV1(slide: PptxSlide, props: PricingV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const tiers = (props.tiers || []).slice(0, 3);
  const cardWidth = 2.5;
  const gap = 0.35;
  const startX = (10 - (tiers.length * cardWidth + (tiers.length - 1) * gap)) / 2;
  tiers.forEach((tier, index) => {
    const x = startX + index * (cardWidth + gap);
    const isHighlight = index === 1;
    slide.addShape('rect', {
      x, y: 2.6, w: cardWidth, h: 2.6,
      fill: { color: isHighlight ? COLORS.accent : COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addText(tier.name || '', {
      x, y: 2.8, w: cardWidth, h: 0.4,
      fontSize: 18, color: isHighlight ? COLORS.white : COLORS.primary, bold: true, align: 'center',
      fontFace: FONTS.heading,
    });
    slide.addText([tier.price, tier.period].filter(Boolean).join(' '), {
      x, y: 3.25, w: cardWidth, h: 0.5,
      fontSize: 24, color: isHighlight ? COLORS.white : COLORS.primary, bold: true, align: 'center',
      fontFace: FONTS.heading,
    });
    const features = (tier.features || []).slice(0, 3);
    let fy = 3.85;
    features.forEach((feature) => {
      slide.addText(feature, {
        x: x + 0.15, y: fy, w: cardWidth - 0.3, h: 0.3,
        fontSize: 12, color: isHighlight ? COLORS.white : COLORS.secondary, align: 'center',
        fontFace: FONTS.body,
      });
      fy += 0.35;
    });
    if (tier.cta) {
      slide.addText(tier.cta, {
        x: x + 0.3, y: 4.8, w: cardWidth - 0.6, h: 0.3,
        fontSize: 12, color: isHighlight ? COLORS.accent : COLORS.white,
        fill: isHighlight ? { color: COLORS.white } : { color: COLORS.accent },
        align: 'center', valign: 'middle',
        fontFace: FONTS.body,
      });
    }
  });
}

interface GalleryV1Props {
  kicker?: string;
  title: string;
  images?: { url?: string; caption?: string }[];
}

function renderGalleryV1(slide: PptxSlide, props: GalleryV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const images = (props.images || []).slice(0, 4);
  const positions = [
    { x: 0.8, y: 2.5 },
    { x: 5.2, y: 2.5 },
    { x: 0.8, y: 4.0 },
    { x: 5.2, y: 4.0 },
  ];
  images.forEach((image, index) => {
    const pos = positions[index];
    if (!pos) return;
    if (image.url) addImageMaybe(slide, image.url, pos.x, pos.y, 4.0, 1.3);
    if (image.caption) {
      slide.addText(image.caption, {
        x: pos.x, y: pos.y + 1.35, w: 4.0, h: 0.25,
        fontSize: 12, color: COLORS.secondary, align: 'center',
        fontFace: FONTS.body,
      });
    }
  });
}

interface ImageV1Props {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
}

function renderImageV1(slide: PptxSlide, props: ImageV1Props): void {
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, 0, 0, 10, 5.625);
    slide.addShape('rect', {
      x: 0, y: 0, w: 10, h: 5.625,
      fill: { color: '000000', transparency: 40 },
    });
  }
  slide.addText(props.title, {
    x: 1, y: 2.4, w: 8, h: 1.0,
    fontSize: 48, color: COLORS.white, bold: true, align: 'center',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 3.5, w: 7, h: 0.7,
      fontSize: 22, color: COLORS.white, align: 'center',
      fontFace: FONTS.body,
    });
  }
}

interface SwotV1Props {
  title: string;
  kicker?: string;
  strength?: string;
  weakness?: string;
  opportunity?: string;
  threat?: string;
}

function renderSwotV1(slide: PptxSlide, props: SwotV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  render2x2Grid(slide, [
    { title: '优势 Strengths', text: props.strength || '' },
    { title: '劣势 Weaknesses', text: props.weakness || '' },
    { title: '机会 Opportunities', text: props.opportunity || '' },
    { title: '威胁 Threats', text: props.threat || '' },
  ]);
}

interface PestV1Props {
  title: string;
  kicker?: string;
  political?: string;
  economic?: string;
  social?: string;
  technological?: string;
}

function renderPestV1(slide: PptxSlide, props: PestV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  render2x2Grid(slide, [
    { title: '政治 Political', text: props.political || '' },
    { title: '经济 Economic', text: props.economic || '' },
    { title: '社会 Social', text: props.social || '' },
    { title: '技术 Technological', text: props.technological || '' },
  ]);
}

function render2x2Grid(slide: PptxSlide, cells: { title: string; text: string }[]): void {
  const positions = [
    { x: 0.8, y: 2.5 },
    { x: 5.2, y: 2.5 },
    { x: 0.8, y: 4.1 },
    { x: 5.2, y: 4.1 },
  ];
  cells.forEach((cell, index) => {
    const pos = positions[index];
    if (!pos) return;
    slide.addShape('rect', {
      x: pos.x, y: pos.y, w: 4.0, h: 1.4,
      fill: { color: COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addText(cell.title, {
      x: pos.x + 0.15, y: pos.y + 0.1, w: 3.7, h: 0.35,
      fontSize: 16, color: COLORS.accent, bold: true, align: 'left',
      fontFace: FONTS.heading,
    });
    slide.addText(cell.text, {
      x: pos.x + 0.15, y: pos.y + 0.5, w: 3.7, h: 0.8,
      fontSize: 13, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  });
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

interface ClosingV2Props {
  title: string;
  subtitle?: string;
  contact?: string;
  email?: string;
  link?: string;
}

function renderClosingV2(slide: PptxSlide, props: ClosingV2Props): void {
  slide.addText(props.title, {
    x: 1, y: 2.2, w: 8, h: 1.0,
    fontSize: 48, color: COLORS.primary, bold: true, align: 'center',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 3.3, w: 7, h: 0.6,
      fontSize: 22, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.body,
    });
  }
  const lines = [props.contact, props.email, props.link].filter(Boolean) as string[];
  let y = 4.2;
  lines.forEach((line) => {
    slide.addText(line, {
      x: 1, y, w: 8, h: 0.35,
      fontSize: 16, color: COLORS.accent, align: 'center',
      fontFace: FONTS.mono,
    });
    y += 0.45;
  });
}
