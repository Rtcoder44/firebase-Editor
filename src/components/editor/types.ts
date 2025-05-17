export type ElementType = 'heading' | 'text' | 'image' | 'button' | 'spacer';

export interface BaseElement {
  id: string;
  type: ElementType;
  styles?: React.CSSProperties; // Optional general styles
}

export interface HeadingElement extends BaseElement {
  type: 'heading';
  content: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string; // Can be simple text or basic HTML for rich text
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  alt: string;
  'data-ai-hint'?: string;
}

export interface ButtonElement extends BaseElement {
  type: 'button';
  text: string;
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  actionUrl?: string; // Optional URL for link buttons or actions
}

export interface SpacerElement extends BaseElement {
  type: 'spacer';
  height: number; // in pixels
}

export type PageElement = HeadingElement | TextElement | ImageElement | ButtonElement | SpacerElement;
