"use client";

import { useEditor } from '@/contexts/editor-context';
import type { PageElement, HeadingElement, TextElement, ImageElement, ButtonElement, SpacerElement } from './types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIAssistantPanel } from '@/components/ai/ai-assistant-panel';
import { Bot } from 'lucide-react';

export function ElementConfigPanel() {
  const { selectedElementId, pageElements, updateElement, getPageAsHtml } = useEditor();

  const selectedElement = pageElements.find(el => el.id === selectedElementId);

  if (!selectedElement) {
    return (
      <div className="w-80 border-l bg-card p-4 flex flex-col items-center justify-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mouse-pointer-square-dashed mb-4 text-muted-foreground opacity-50"><path d="M5 3a2 2 0 0 0-2 2"/><path d="M19 3a2 2 0 0 1 2 2"/><path d="m12 12 4 10 1.7-4.3L22 16Z"/><path d="M5 21a2 2 0 0 1-2-2"/><path d="M19 21a2 2 0 0 0 2-2"/><path d="M9 3h1"/><path d="M9 21h1"/><path d="M14 3h1"/><path d="M14 21h1"/><path d="M3 9v1"/><path d="M21 9v1"/><path d="M3 14v1"/><path d="M21 14v1"/></svg>
        <p className="text-sm text-muted-foreground">Select an element on the canvas to edit its properties.</p>
      </div>
    );
  }

  const handleChange = (key: string, value: any) => {
    updateElement(selectedElement.id, { [key]: value });
  };

  const renderCommonFields = (element: PageElement) => (
    <>
      <div className="space-y-1">
        <Label htmlFor={`element-id-${element.id}`}>Element ID (Read-only)</Label>
        <Input id={`element-id-${element.id}`} value={element.id} readOnly disabled className="text-xs" />
      </div>
    </>
  );

  const renderSpecificFields = (element: PageElement) => {
    switch (element.type) {
      case 'heading':
        const headingEl = element as HeadingElement;
        return (
          <>
            <div className="space-y-1">
              <Label htmlFor={`heading-content-${element.id}`}>Content</Label>
              <Input
                id={`heading-content-${element.id}`}
                value={headingEl.content}
                onChange={(e) => handleChange('content', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`heading-level-${element.id}`}>Level</Label>
              <Select
                value={String(headingEl.level)}
                onValueChange={(value) => handleChange('level', parseInt(value))}
              >
                <SelectTrigger id={`heading-level-${element.id}`}>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map(level => (
                    <SelectItem key={level} value={String(level)}>H{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case 'text':
        const textEl = element as TextElement;
        return (
          <div className="space-y-1">
            <Label htmlFor={`text-content-${element.id}`}>Content (HTML allowed)</Label>
            <Textarea
              id={`text-content-${element.id}`}
              value={textEl.content}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={5}
            />
          </div>
        );
      case 'image':
        const imageEl = element as ImageElement;
        return (
          <>
            <div className="space-y-1">
              <Label htmlFor={`image-src-${element.id}`}>Source URL</Label>
              <Input
                id={`image-src-${element.id}`}
                value={imageEl.src}
                onChange={(e) => handleChange('src', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`image-alt-${element.id}`}>Alt Text</Label>
              <Input
                id={`image-alt-${element.id}`}
                value={imageEl.alt}
                onChange={(e) => handleChange('alt', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`image-ai-hint-${element.id}`}>AI Hint (for placeholder)</Label>
              <Input
                id={`image-ai-hint-${element.id}`}
                value={imageEl['data-ai-hint'] || ''}
                onChange={(e) => handleChange('data-ai-hint', e.target.value)}
              />
            </div>
          </>
        );
      case 'button':
        const buttonEl = element as ButtonElement;
        return (
          <>
            <div className="space-y-1">
              <Label htmlFor={`button-text-${element.id}`}>Text</Label>
              <Input
                id={`button-text-${element.id}`}
                value={buttonEl.text}
                onChange={(e) => handleChange('text', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`button-variant-${element.id}`}>Variant</Label>
              <Select
                value={buttonEl.variant}
                onValueChange={(value) => handleChange('variant', value as ButtonElement['variant'])}
              >
                <SelectTrigger id={`button-variant-${element.id}`}>
                  <SelectValue placeholder="Select variant" />
                </SelectTrigger>
                <SelectContent>
                  {['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'].map(variant => (
                    <SelectItem key={variant} value={variant}>{variant.charAt(0).toUpperCase() + variant.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-1">
              <Label htmlFor={`button-action-${element.id}`}>Action URL (Optional)</Label>
              <Input
                id={`button-action-${element.id}`}
                value={buttonEl.actionUrl || ''}
                onChange={(e) => handleChange('actionUrl', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </>
        );
      case 'spacer':
        const spacerEl = element as SpacerElement;
        return (
          <div className="space-y-1">
            <Label htmlFor={`spacer-height-${element.id}`}>Height (px)</Label>
            <Input
              id={`spacer-height-${element.id}`}
              type="number"
              value={spacerEl.height}
              onChange={(e) => handleChange('height', parseInt(e.target.value) || 0)}
            />
          </div>
        );
      default:
        return <p>No configuration available for this element type.</p>;
    }
  };

  return (
    <div className="w-80 border-l bg-card">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-card-foreground">Properties</h3>
            <AIAssistantPanel 
              elementHtml={getPageAsHtml(selectedElement.id)} 
              elementId={selectedElement.id}
              triggerButton={
                <Button variant="outline" size="sm">
                  <Bot className="mr-2 h-4 w-4" /> AI Optimize
                </Button>
              }
            />
          </div>
          {renderCommonFields(selectedElement)}
          {renderSpecificFields(selectedElement)}
        </div>
      </ScrollArea>
    </div>
  );
}
