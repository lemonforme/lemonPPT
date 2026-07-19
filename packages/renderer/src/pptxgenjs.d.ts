declare module 'pptxgenjs' {
  export interface FillOptions {
    color?: string;
    transparency?: number;
  }

  export interface TextOptions {
    x: number;
    y: number;
    w: number;
    h: number;
    fontSize?: number;
    color?: string;
    bold?: boolean;
    align?: 'left' | 'center' | 'right';
    valign?: 'top' | 'middle' | 'bottom';
    fontFace?: string;
    fill?: FillOptions | string;
    line?: { color?: string; width?: number } | string;
    rectRadius?: number;
    inset?: number;
    charSpacing?: number;
  }

  export interface ShapeOptions {
    x?: number;
    y?: number;
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    w?: number;
    h?: number;
    fill?: FillOptions | string;
    line?: { color?: string; width?: number } | string;
    rectRadius?: number;
  }

  export interface ImageOptions {
    path: string;
    x: number;
    y: number;
    w: number;
    h: number;
    sizing?: {
      type: 'crop' | 'contain' | 'cover';
      w: number;
      h: number;
    };
  }

  export interface ChartOptions {
    x: number;
    y: number;
    w: number;
    h: number;
    chartColors?: string[];
    showValue?: boolean;
    dataLabelColor?: string;
    dataLabelFontSize?: number;
  }

  export interface ChartSeries {
    name: string;
    labels: string[];
    values: number[];
  }

  export interface Slide {
    addText(text: string | Array<{ text: string; options?: Record<string, unknown> }>, options: TextOptions): void;
    addShape(shape: string, options: ShapeOptions): void;
    addImage(options: ImageOptions): void;
    addChart(type: 'bar' | 'line' | 'pie', data: ChartSeries[], options: ChartOptions): void;
  }

  export default class PptxGenJS {
    constructor();
    layout: string;
    title: string;
    subject: string;
    author: string;
    defineSlideMaster(master: Record<string, unknown>): void;
    addSlide(): Slide;
    writeFile(options: { fileName: string }): Promise<void>;
  }
}
