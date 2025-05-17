"use client";

import { useEditor } from '@/contexts/editor-context';
import { PageElementRenderer } from './page-element-renderer';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const deviceWidths = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

export function VisualEditor() {
  const { pageElements, selectedElementId, setSelectedElementId, moveElement, removeElement, activeDeviceView } = useEditor();

  return (
    <ScrollArea className="h-full w-full bg-muted/40 p-4 rounded-md shadow-inner">
      <div 
        className="mx-auto bg-background shadow-lg transition-all duration-300 ease-in-out overflow-y-auto"
        style={{ 
          width: deviceWidths[activeDeviceView], 
          maxWidth: '100%',
          minHeight: 'calc(100vh - 200px)', // Adjust as needed
          padding: '20px',
          border: '1px solid hsl(var(--border))',
          borderRadius: 'var(--radius)',
        }}
      >
        {pageElements.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard mb-4 opacity-50"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7"height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            <p className="text-lg font-medium">Empty Canvas</p>
            <p className="text-sm">Add elements from the toolbar to start building your page.</p>
          </div>
        )}
        {pageElements.map((element, index) => (
          <div key={element.id} className="relative group mb-4 p-1 rounded hover:bg-accent/10 transition-colors">
            <PageElementRenderer
              element={element}
              isSelected={element.id === selectedElementId}
              onClick={setSelectedElementId}
              className="min-h-[40px]" // Ensure elements have some clickable height
            />
            {selectedElementId === element.id && (
              <div className="absolute -top-2 -right-2 z-10 flex gap-1 p-1 bg-background border rounded-md shadow-md opacity-100 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={() => moveElement(element.id, 'up')} disabled={index === 0} className="h-6 w-6">
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => moveElement(element.id, 'down')} disabled={index === pageElements.length - 1} className="h-6 w-6">
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => removeElement(element.id)} className="h-6 w-6 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
