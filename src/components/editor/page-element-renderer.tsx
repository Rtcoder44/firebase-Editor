"use client";

import type { PageElement, HeadingElement, TextElement, ImageElement, ButtonElement, SpacerElement } from './types';
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
  const combinedClassName = `${baseClasses} ${selectedClasses} ${className || ''}`;

  const handleClick = () => {
    if (onClick) {
      onClick(element.id);
    }
  };

  switch (element.type) {
    case 'heading':
      const HeadingTag = `h${element.level}` as keyof JSX.IntrinsicElements;
      return <HeadingTag className={combinedClassName} style={element.styles} onClick={handleClick}>{(element as HeadingElement).content}</HeadingTag>;
    case 'text':
      // Using dangerouslySetInnerHTML for potential rich text, sanitize if user input allowed
      return <div className={combinedClassName} style={element.styles} onClick={handleClick} dangerouslySetInnerHTML={{ __html: (element as TextElement).content }} />;
    case 'image':
      const imgElement = element as ImageElement;
      return (
        <div className={`${combinedClassName} relative w-full h-auto max-w-full`} style={element.styles} onClick={handleClick}>
           <NextImage 
            src={imgElement.src} 
            alt={imgElement.alt} 
            width={600} // Default, can be overridden by styles
            height={400} // Default, can be overridden by styles
            className="object-contain"
            data-ai-hint={imgElement['data-ai-hint']}
            style={{ width: '100%', height: 'auto' }} // Ensure responsiveness within parent
            />
        </div>
      );
    case 'button':
      const btnElement = element as ButtonElement;
      return (
        <ShadButton
          variant={btnElement.variant}
          className={combinedClassName}
          style={element.styles}
          onClick={handleClick}
          asChild={!!btnElement.actionUrl}
        >
          {btnElement.actionUrl ? <a href={btnElement.actionUrl}>{btnElement.text}</a> : btnElement.text}
        </ShadButton>
      );
    case 'spacer':
      return <div className={combinedClassName} style={{ height: `${(element as SpacerElement).height}px`, ...element.styles }} onClick={handleClick}></div>;
    default:
      return <div className="text-destructive">Unknown element type</div>;
  }
}
