"use client";

import { Heading1, Heading2, Heading3, Pilcrow, Image as ImageIcon, SquareArrowOutUpRight, Minus, Link as LinkIcon, Table as TableIcon, Quote, List as ListIcon, ListOrdered, SeparatorHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useEditor } from '@/contexts/editor-context';
import type { ElementType } from './types';

const elementTools = [
  { type: 'heading' as ElementType, level: 1, icon: Heading1, label: 'Heading 1' },
  { type: 'heading' as ElementType, level: 2, icon: Heading2, label: 'Heading 2' },
  { type: 'heading' as ElementType, level: 3, icon: Heading3, label: 'Heading 3' },
  { type: 'text' as ElementType, icon: Pilcrow, label: 'Text Paragraph' },
  { type: 'image' as ElementType, icon: ImageIcon, label: 'Image' },
  { type: 'button' as ElementType, icon: SquareArrowOutUpRight, label: 'Button' },
  { type: 'link' as ElementType, icon: LinkIcon, label: 'Link' },
  { type: 'blockquote' as ElementType, icon: Quote, label: 'Blockquote' },
  { type: 'list' as ElementType, ordered: false, icon: ListIcon, label: 'Unordered List' },
  { type: 'list' as ElementType, ordered: true, icon: ListOrdered, label: 'Ordered List' },
  { type: 'table' as ElementType, icon: TableIcon, label: 'Table' },
  { type: 'spacer' as ElementType, icon: Minus, label: 'Spacer' },
  { type: 'divider' as ElementType, icon: SeparatorHorizontal, label: 'Divider' },
];

export function ElementToolbar() {
  const { addElement } = useEditor();

  const handleAddElement = (tool: typeof elementTools[number]) => {
    let partialElement: Partial<any> = {};
    if (tool.type === 'heading' && tool.level) {
      partialElement = { level: tool.level };
    }
    if (tool.type === 'list' && tool.ordered !== undefined) {
      partialElement = { ordered: tool.ordered };
    }
    addElement(tool.type, partialElement);
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center gap-2 p-2 border-r bg-card h-full">
        <p className="text-sm font-medium text-card-foreground mb-2">Elements</p>
        {elementTools.map((tool) => (
          <Tooltip key={`${tool.type}-${tool.label}`}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleAddElement(tool)}
                aria-label={`Add ${tool.label}`}
                className="text-card-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <tool.icon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Add {tool.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
