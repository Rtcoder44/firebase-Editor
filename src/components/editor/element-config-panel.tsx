
"use client";

import { useEditor, defaultHeadingFontSizesMap } from '@/contexts/editor-context';
import type { PageElement, HeadingElement, TextElement, ImageElement, ButtonElement, SpacerElement, LinkElement, TableElement, BlockquoteElement, ListElement } from './types';
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
import { Checkbox } from '@/components/ui/checkbox';

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

  const handleStyleChange = (styleKey: keyof React.CSSProperties, value: string | number | undefined) => {
    updateElement(selectedElement.id, {
      styles: {
        ...selectedElement.styles,
        [styleKey]: value,
      },
    });
  };

  const handleHeadingLevelChange = (elementId: string, currentStyles: React.CSSProperties | undefined, newLevel: number) => {
    updateElement(elementId, {
      level: newLevel,
      styles: {
        ...currentStyles,
        fontSize: defaultHeadingFontSizesMap[newLevel],
        // fontWeight is often bold by default for headings, ensure it's preserved or set
        fontWeight: currentStyles?.fontWeight || 'bold', 
      },
    });
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
                onValueChange={(value) => handleHeadingLevelChange(element.id, headingEl.styles, parseInt(value))}
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
            <div className="space-y-1">
              <Label htmlFor={`style-fontSize-heading-${element.id}`}>Font Size (px)</Label>
              <Input
                id={`style-fontSize-heading-${element.id}`}
                type="number"
                placeholder="e.g., 36"
                value={element.styles?.fontSize ? String(element.styles.fontSize).replace('px', '') : ''}
                onChange={(e) => handleStyleChange('fontSize', e.target.value ? `${e.target.value}px` : undefined)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`style-fontWeight-heading-${element.id}`}>Font Weight</Label>
              <Select
                value={element.styles?.fontWeight?.toString() || 'bold'}
                onValueChange={(value) => handleStyleChange('fontWeight', value as 'normal' | 'bold')}
              >
                <SelectTrigger id={`style-fontWeight-heading-${element.id}`}>
                  <SelectValue placeholder="Select weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case 'text':
        const textEl = element as TextElement;
        return (
          <>
            <div className="space-y-1">
              <Label htmlFor={`text-content-${element.id}`}>Content (HTML allowed)</Label>
              <Textarea
                id={`text-content-${element.id}`}
                value={textEl.content}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={5}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`style-fontSize-text-${element.id}`}>Font Size (px)</Label>
              <Input
                id={`style-fontSize-text-${element.id}`}
                type="number"
                placeholder="e.g., 16"
                value={element.styles?.fontSize ? String(element.styles.fontSize).replace('px', '') : ''}
                onChange={(e) => handleStyleChange('fontSize', e.target.value ? `${e.target.value}px` : undefined)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`style-fontWeight-text-${element.id}`}>Font Weight</Label>
              <Select
                value={element.styles?.fontWeight?.toString() || 'normal'}
                onValueChange={(value) => handleStyleChange('fontWeight', value as 'normal' | 'bold')}
              >
                <SelectTrigger id={`style-fontWeight-text-${element.id}`}>
                  <SelectValue placeholder="Select weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
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
            <div className="space-y-1">
              <Label htmlFor={`image-linkHref-${element.id}`}>Link URL (Optional)</Label>
              <Input
                id={`image-linkHref-${element.id}`}
                value={imageEl.linkHref || ''}
                onChange={(e) => handleChange('linkHref', e.target.value)}
                placeholder="https://example.com"
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
      case 'link':
        const linkEl = element as LinkElement;
        return (
          <>
            <div className="space-y-1">
              <Label htmlFor={`link-text-${element.id}`}>Text</Label>
              <Input
                id={`link-text-${element.id}`}
                value={linkEl.text}
                onChange={(e) => handleChange('text', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`link-href-${element.id}`}>URL (href)</Label>
              <Input
                id={`link-href-${element.id}`}
                value={linkEl.href}
                onChange={(e) => handleChange('href', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`link-target-${element.id}`}>Target</Label>
              <Select
                value={linkEl.target || '_blank'}
                onValueChange={(value) => handleChange('target', value as LinkElement['target'])}
              >
                <SelectTrigger id={`link-target-${element.id}`}>
                  <SelectValue placeholder="Select target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_blank">_blank (New Tab)</SelectItem>
                  <SelectItem value="_self">_self (Same Tab)</SelectItem>
                  <SelectItem value="_parent">_parent</SelectItem>
                  <SelectItem value="_top">_top</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case 'table':
        const tableEl = element as TableElement;
        return (
          <>
            <div className="space-y-1">
              <Label htmlFor={`table-caption-${element.id}`}>Caption</Label>
              <Input
                id={`table-caption-${element.id}`}
                value={tableEl.caption || ''}
                onChange={(e) => handleChange('caption', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`table-rows-${element.id}`}>Number of Rows</Label>
              <Input
                id={`table-rows-${element.id}`}
                type="number"
                value={tableEl.numRows}
                onChange={(e) => handleChange('numRows', parseInt(e.target.value) || 1)}
                min="1"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`table-cols-${element.id}`}>Number of Columns</Label>
              <Input
                id={`table-cols-${element.id}`}
                type="number"
                value={tableEl.numCols}
                onChange={(e) => handleChange('numCols', parseInt(e.target.value) || 1)}
                min="1"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Table content is currently fixed. More advanced editing coming soon.</p>
          </>
        );
      case 'blockquote':
        const bqEl = element as BlockquoteElement;
        return (
          <>
            <div className="space-y-1">
              <Label htmlFor={`blockquote-content-${element.id}`}>Quote Content</Label>
              <Textarea
                id={`blockquote-content-${element.id}`}
                value={bqEl.content}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`blockquote-citation-${element.id}`}>Citation (Source)</Label>
              <Input
                id={`blockquote-citation-${element.id}`}
                value={bqEl.citation || ''}
                onChange={(e) => handleChange('citation', e.target.value)}
              />
            </div>
          </>
        );
      case 'list':
        const listEl = element as ListElement;
        return (
          <>
            <div className="space-y-1">
              <Label htmlFor={`list-items-${element.id}`}>List Items (one per line)</Label>
              <Textarea
                id={`list-items-${element.id}`}
                value={listEl.items.join('\n')}
                onChange={(e) => handleChange('items', e.target.value.split('\n'))}
                rows={5}
              />
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id={`list-ordered-${element.id}`}
                checked={listEl.ordered}
                onCheckedChange={(checked) => handleChange('ordered', !!checked)}
              />
              <Label htmlFor={`list-ordered-${element.id}`} className="text-sm font-normal">
                Ordered List (Numbered)
              </Label>
            </div>
          </>
        );
      case 'divider':
        return <p className="text-xs text-muted-foreground">Configure divider styles (e.g., margin, color) via advanced style options if available.</p>;
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
            {selectedElement.type !== 'divider' && selectedElement.type !== 'spacer' && (
                 <AIAssistantPanel 
                  elementHtml={getPageAsHtml(selectedElement.id)} 
                  elementId={selectedElement.id}
                  triggerButton={
                    <Button variant="outline" size="sm">
                      <Bot className="mr-2 h-4 w-4" /> AI Optimize
                    </Button>
                  }
                />
            )}
          </div>
          {renderCommonFields(selectedElement)}
          {renderSpecificFields(selectedElement)}
        </div>
      </ScrollArea>
    </div>
  );
}

