import type { PageElement } from "@/components/editor/types";

function objectToCssString(styles?: React.CSSProperties): string {
  if (!styles) return '';
  return Object.entries(styles)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`)
    .join(';');
}

export function pageElementToHtml(element: PageElement): string {
  const styleString = objectToCssString(element.styles);
  const styleAttr = styleString ? ` style="${styleString}"` : '';

  switch (element.type) {
    case 'heading':
      return `<h${element.level}${styleAttr}>${element.content}</h${element.level}>`;
    case 'text':
      return `<p${styleAttr}>${element.content}</p>`; // Assuming content can be basic HTML for rich text
    case 'image':
      return `<img src="${element.src}" alt="${element.alt}"${styleAttr} data-ai-hint="${element['data-ai-hint'] || ''}" />`;
    case 'button':
      // Basic button rendering, might need more for specific variants or actions
      let buttonHtml = `<button class="btn btn-${element.variant}"${styleAttr}>${element.text}</button>`;
      if (element.actionUrl) {
        buttonHtml = `<a href="${element.actionUrl}" class="btn btn-${element.variant}"${styleAttr}>${element.text}</a>`;
      }
      return buttonHtml;
    case 'spacer':
      return `<div style="height: ${element.height}px;${styleString}"></div>`;
    default:
      // Handle unknown elements or return an empty string/comment
      return `<!-- Unknown element type: ${(element as any).type} -->`;
  }
}
