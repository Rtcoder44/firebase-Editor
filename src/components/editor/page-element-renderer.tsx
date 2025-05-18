"use client";

import type { PageElement, HeadingElement, TextElement, ImageElement, ButtonElement, SpacerElement, LinkElement, TableElement, BlockquoteElement, ListElement, DividerElement } from './types';
import { Button as ShadButton } from '@/components/ui/button';
import NextImage from 'next/image';

interface PageElementRendererProps {
  element: PageElement;
  isSelected?: boolean;
  onClick?: (id: string) => void;
  className?: string;
}

export function PageElementRenderer({ element, isSelected, onClick, className }: PageElementRendererProps) {
  const baseClasses = "cursor-pointer transition-all duration-150 ease-in-out";
  const selectedClasses = isSelected ? "ring-2 ring-offset-2 ring-primary shadow-lg" : "hover:shadow-md";
  // Ensure w-full is applied unless specific styles override width
  const defaultWidthClass = element.styles?.width ? '' : 'w-full';
  const combinedClassName = `${baseClasses} ${selectedClasses} ${defaultWidthClass} ${className || ''}`;


  const handleClick = () => {
    if (onClick) {
      onClick(element.id);
    }
  };

  const renderImage = (imgElement: ImageElement) => (
    <NextImage 
      src={imgElement.src} 
      alt={imgElement.alt} 
      width={600} // Default width, can be overridden by styles
      height={400} // Default height, can be overridden by styles
      className="object-contain" // Ensures image fits, can be customized further
      data-ai-hint={imgElement['data-ai-hint']}
      // Apply element styles to the NextImage component directly or to a wrapper
      // For simplicity, applying to a wrapper is often easier.
      // Here, we apply width/height from styles if present, otherwise use defaults.
      style={{ 
        width: imgElement.styles?.width || '100%', 
        height: imgElement.styles?.height || 'auto',
        display: imgElement.styles?.display || 'block', // ensure image is block for centering etc.
        margin: imgElement.styles?.margin, // allow margin overrides
      }}
    />
  );

  switch (element.type) {
    case 'heading':
      const HeadingTag = `h${element.level}` as keyof JSX.IntrinsicElements;
      return <HeadingTag className={combinedClassName} style={element.styles} onClick={handleClick}>{(element as HeadingElement).content}</HeadingTag>;
    case 'text':
      return <div className={combinedClassName} style={element.styles} onClick={handleClick} dangerouslySetInnerHTML={{ __html: (element as TextElement).content }} />;
    case 'image':
      const imgElement = element as ImageElement;
      const imageOutput = renderImage(imgElement);
      if (imgElement.linkHref) {
        return (
          <a href={imgElement.linkHref} target="_blank" rel="noopener noreferrer" className={`${combinedClassName} block`} style={{ ...element.styles, textDecoration: 'none' }} onClick={handleClick}>
            {imageOutput}
          </a>
        );
      }
      return (
         <div className={`${combinedClassName} relative h-auto`} style={{...element.styles, width: element.styles?.width || '100%'}} onClick={handleClick}>
           {imageOutput}
        </div>
      );
    case 'button':
      const btnElement = element as ButtonElement;
      // Apply text-align for button positioning
      const buttonContainerStyle: React.CSSProperties = { 
        display: 'flex', 
        justifyContent: element.styles?.textAlign === 'center' ? 'center' : element.styles?.textAlign === 'right' ? 'flex-end' : 'flex-start',
        width: '100%', // Ensure the container takes full width for alignment to work
      };
      return (
        <div onClick={handleClick} className={combinedClassName} style={buttonContainerStyle}>
          <ShadButton
            variant={btnElement.variant}
            style={element.styles} // Individual button styles applied here
            asChild={!!btnElement.actionUrl}
          >
            {btnElement.actionUrl ? <a href={btnElement.actionUrl}>{btnElement.text}</a> : btnElement.text}
          </ShadButton>
        </div>
      );
    case 'spacer':
      return <div className={combinedClassName} style={{ height: `${(element as SpacerElement).height}px`, ...element.styles }} onClick={handleClick}></div>;
    case 'link':
      const linkEl = element as LinkElement;
      return <a href={linkEl.href} target={linkEl.target || '_blank'} rel={linkEl.target === '_blank' ? 'noopener noreferrer' : undefined} className={combinedClassName} style={element.styles} onClick={handleClick}>{linkEl.text}</a>;
    case 'table':
      const tableEl = element as TableElement;
      return (
        <table className={`${combinedClassName} border-collapse border border-slate-400`} style={element.styles} onClick={handleClick}>
          {tableEl.caption && <caption className="caption-bottom p-2 text-sm text-muted-foreground">{tableEl.caption}</caption>}
          <thead className="bg-muted/50">
            <tr>
              {Array.from({ length: tableEl.numCols }).map((_, colIndex) => (
                <th key={colIndex} className="border border-slate-300 p-2">Header {colIndex + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: tableEl.numRows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: tableEl.numCols }).map((_, colIndex) => (
                  <td key={colIndex} className="border border-slate-300 p-2">Cell {rowIndex + 1}-{colIndex + 1}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case 'blockquote':
      const bqEl = element as BlockquoteElement;
      return (
        <blockquote className={`${combinedClassName} border-l-4 border-primary pl-4 italic my-4`} style={element.styles} onClick={handleClick}>
          <p>{bqEl.content}</p>
          {bqEl.citation && <footer className="text-sm mt-1 not-italic text-muted-foreground before:content-['—_']">{bqEl.citation}</footer>}
        </blockquote>
      );
    case 'list':
      const listEl = element as ListElement;
      const ListTag = listEl.ordered ? 'ol' : 'ul';
      return (
        <ListTag className={`${combinedClassName} list-inside ${listEl.ordered ? 'list-decimal' : 'list-disc'} pl-5`} style={element.styles} onClick={handleClick}>
          {listEl.items.map((item, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
          ))}
        </ListTag>
      );
    case 'divider':
      return <hr className={`${combinedClassName} my-4 border-border`} style={element.styles} onClick={handleClick} />;
    default:
      return <div className="text-destructive">Unknown element type</div>;
  }
}
