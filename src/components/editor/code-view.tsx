"use client";

import { useEditor } from '@/contexts/editor-context';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

export function CodeView() {
  const { getPageAsHtml } = useEditor();
  const { toast } = useToast();
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    setHtmlContent(getPageAsHtml());
  }, [getPageAsHtml]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(htmlContent)
      .then(() => {
        toast({ title: "Success", description: "HTML copied to clipboard!" });
      })
      .catch(err => {
        toast({ variant: "destructive", title: "Error", description: "Failed to copy HTML." });
        console.error('Failed to copy HTML: ', err);
      });
  };
  
  // Note: Editing HTML directly and parsing it back into PageElement structure is complex and not implemented.
  // This CodeView is primarily for viewing and copying.

  return (
    <div className="h-full w-full p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">HTML Output</h3>
        <Button onClick={handleCopyToClipboard} variant="outline">Copy HTML</Button>
      </div>
      <Textarea
        value={htmlContent}
        readOnly // To prevent edits that won't be reflected back easily
        className="flex-1 font-mono text-sm resize-none bg-muted/20"
        placeholder="HTML code will appear here..."
      />
       <p className="text-xs text-muted-foreground">
        This view shows the HTML representation of your page. Direct editing here is not supported for now.
      </p>
    </div>
  );
}
