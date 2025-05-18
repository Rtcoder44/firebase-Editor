export type ElementType = 'heading' | 'text' | 'image' | 'button' | 'spacer' | 'link' | 'table' | 'blockquote' | 'list' | 'divider';

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
  linkHref?: string; // New: Optional URL to make the image a link
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

export interface LinkElement extends BaseElement {
  type: 'link';
  text: string;
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
}

export interface TableElement extends BaseElement {
  type: 'table';
  // For simplicity, we'll start with a placeholder.
  // In a real app, this would have a more complex structure for rows/cells.
  numRows: number;
  numCols: number;
  caption?: string;
}

export interface BlockquoteElement extends BaseElement {
  type: 'blockquote';
  content: string;
  citation?: string;
}

export interface ListElement extends BaseElement {
  type: 'list';
  items: string[]; // Each string can be a list item. Basic HTML could be allowed per item.
  ordered: boolean;
}

export interface DividerElement extends BaseElement {
  type: 'divider';
  // Dividers might not need specific props beyond styles,
  // but we could add thickness, style (solid, dashed), etc. later.
}

export type PageElement =
  | HeadingElement
  | TextElement
  | ImageElement
  | ButtonElement
  | SpacerElement
  | LinkElement
  | TableElement
  | BlockquoteElement
  | ListElement
  | DividerElement;
