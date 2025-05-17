"use client";

import { useEditor } from '@/contexts/editor-context';
import { PageElementRenderer } from './page-element-renderer';
import { ScrollArea } from '@/components/ui/scroll-area';

const deviceWidths = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

export function LivePreview() {
  const { pageElements, activeDeviceView } = useEditor();

  return (
    <ScrollArea className="h-full w-full bg-muted/40 p-4">
      <div 
        className="mx-auto bg-background shadow-lg"
        style={{ 
          width: deviceWidths[activeDeviceView], 
          maxWidth: '100%',
          minHeight: 'calc(100vh - 200px)', // Adjust as needed
          padding: '20px',
          border: '1px solid hsl(var(--border))',
          borderRadius: 'var(--radius)',
        }}
      >
        {pageElements.map(element => (
          <div key={element.id} className="mb-2"> {/* Add some margin between elements for preview clarity */}
            <PageElementRenderer element={element} />
          </div>
        ))}
        {pageElements.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Preview will appear here as you add elements.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
