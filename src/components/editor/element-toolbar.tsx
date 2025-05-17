"use client";

import { Heading1, Pilcrow, Image as ImageIcon, SquareArrowOutUpRight, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useEditor } from '@/contexts/editor-context';
import type { ElementType } from './types';

const elementTools = [
  { type: 'heading' as ElementType, icon: Heading1, label: 'Heading' },
  { type: 'text' as ElementType, icon: Pilcrow, label: 'Text Paragraph' },
  { type: 'image' as ElementType, icon: ImageIcon, label: 'Image' },
  { type: 'button' as ElementType, icon: SquareArrowOutUpRight, label: 'Button' },
  { type: 'spacer' as ElementType, icon: Minus, label: 'Spacer' },
];

export function ElementToolbar() {
  const { addElement } = useEditor();

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center gap-2 p-2 border-r bg-card h-full">
        <p className="text-sm font-medium text-card-foreground mb-2">Elements</p>
        {elementTools.map((tool) => (
          <Tooltip key={tool.type}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => addElement(tool.type)}
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
