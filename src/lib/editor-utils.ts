import type { PageElement, TableElement, ListElement, BlockquoteElement, LinkElement, ImageElement } from "@/components/editor/types";

function objectToCssString(styles?: React.CSSProperties): string {
  if (!styles) return '';
  return Object.entries(styles)
    .map(([key, value]) => {
      if (value === undefined || value === null || value === '') return null; // Skip undefined/null/empty styles
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssKey}:${value}`;
    })
    .filter(Boolean) // Remove null entries
    .join(';');
}

export function pageElementToHtml(element: PageElement): string {
  const styleString = objectToCssString(element.styles);
  const styleAttr = styleString ? ` style="${styleString}"` : '';

  switch (element.type) {
    case 'heading':
      return `<h${element.level}${styleAttr}>${element.content}</h${element.level}>`;
    case 'text':
      return `<div${styleAttr}>${element.content}</div>`;
    case 'image':
      const imgEl = element as ImageElement;
      const imgTag = `<img src="${imgEl.src}" alt="${imgEl.alt}"${styleAttr} data-ai-hint="${imgEl['data-ai-hint'] || ''}" />`;
      if (imgEl.linkHref) {
        return `<a href="${imgEl.linkHref}" target="_blank" rel="noopener noreferrer">${imgTag}</a>`;
      }
      return imgTag;
    case 'button':
      const buttonClass = `btn btn-${element.variant}`; 
      let buttonHtml = `<button class="${buttonClass}"${styleAttr}>${element.text}</button>`;
      if (element.actionUrl) {
        buttonHtml = `<a href="${element.actionUrl}" class="${buttonClass}"${styleAttr} role="button">${element.text}</a>`;
      }
      return buttonHtml;
    case 'spacer':
      return `<div style="height: ${element.height}px;${styleString}"></div>`; // styleString might be redundant if height is the only style
    case 'link':
      const linkEl = element as LinkElement;
      return `<a href="${linkEl.href}" target="${linkEl.target || '_blank'}" rel="${linkEl.target === '_blank' ? 'noopener noreferrer' : ''}"${styleAttr}>${linkEl.text}</a>`;
    case 'table':
      const tableEl = element as TableElement;
      let tableHtml = `<table${styleAttr} class="border-collapse border border-slate-500">`;
      if (tableEl.caption) {
        tableHtml += `<caption class="caption-bottom p-2 text-sm text-muted-foreground">${tableEl.caption}</caption>`;
      }
      tableHtml += '<thead><tr>';
      for (let i = 0; i < tableEl.numCols; i++) {
        tableHtml += `<th class="border border-slate-400 p-2">Header ${i + 1}</th>`;
      }
      tableHtml += '</tr></thead><tbody>';
      for (let i = 0; i < tableEl.numRows; i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < tableEl.numCols; j++) {
          tableHtml += `<td class="border border-slate-400 p-2">Cell ${i + 1}-${j + 1}</td>`;
        }
        tableHtml += '</tr>';
      }
      tableHtml += '</tbody></table>';
      return tableHtml;
    case 'blockquote':
      const bqEl = element as BlockquoteElement;
      let bqHtml = `<blockquote${styleAttr} class="border-l-4 border-gray-500 pl-4 italic my-4">`;
      bqHtml += `<p>${bqEl.content}</p>`;
      if (bqEl.citation) {
        bqHtml += `<footer class="text-sm mt-1 not-italic text-gray-600 before:content-['—_']">${bqEl.citation}</footer>`;
      }
      bqHtml += `</blockquote>`;
      return bqHtml;
    case 'list':
      const listEl = element as ListElement;
      const ListTag = listEl.ordered ? 'ol' : 'ul';
      let listHtml = `<${ListTag}${styleAttr} class="list-inside ${listEl.ordered ? 'list-decimal' : 'list-disc'} pl-5">`;
      listEl.items.forEach(item => {
        listHtml += `<li>${item}</li>`;
      });
      listHtml += `</${ListTag}>`;
      return listHtml;
    case 'divider':
      return `<hr${styleAttr} class="my-4 border-gray-300" />`;
    default:
      const unknownElement = element as any;
      return `<!-- Unknown element type: ${unknownElement.type} -->`;
  }
}
