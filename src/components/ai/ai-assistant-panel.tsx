"use client";

import { useState, type ReactNode } from 'react';
import { optimizeContentBlock, type OptimizeContentBlockOutput } from '@/ai/flows/optimize-content-block';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wand2, Palette, TextCursorInput, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEditor } from '@/contexts/editor-context';

interface AIAssistantPanelProps {
  elementHtml: string;
  elementId: string;
  triggerButton?: ReactNode; // Optional custom trigger
}

export function AIAssistantPanel({ elementHtml, elementId, triggerButton }: AIAssistantPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<OptimizeContentBlockOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { updateElement } = useEditor();

  const handleFetchSuggestions = async () => {
    if (!elementHtml) {
      setError("No content block selected or content is empty.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const result = await optimizeContentBlock({ contentBlock: elementHtml });
      setSuggestions(result);
    } catch (e) {
      console.error("AI Assistant Error:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to get suggestions: ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "AI Assistant Error",
        description: `Could not fetch suggestions. ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const applySuggestion = (type: 'layout' | 'font' | 'color') => {
    if (!suggestions) return;

    let updates: Partial<any> = {}; // Using 'any' for updates as element structure varies. Be careful.

    switch(type) {
        case 'layout':
            // Applying layout is complex. For now, we'll just log it.
            // In a real app, this would parse suggestedLayout and update element properties or replace the element.
            console.log("Applying layout:", suggestions.suggestedLayout);
            toast({ title: "Layout Suggestion", description: "Applying HTML layout directly is complex and not yet implemented. See console for suggested HTML." });
            return; // Early return as direct HTML application is not straightforward
        case 'font':
            updates = { styles: { fontFamily: suggestions.suggestedFont } };
            break;
        case 'color':
            const [color, backgroundColor] = suggestions.suggestedColorCombination.split(';').map(s => s.trim());
            updates = { 
                styles: { 
                    color: color?.split(':')[1]?.trim(), 
                    backgroundColor: backgroundColor?.split(':')[1]?.trim() 
                } 
            };
            break;
    }
    
    updateElement(elementId, updates);
    toast({
      title: "Suggestion Applied",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} suggestion has been applied to the element.`,
    });
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || <Button variant="outline"><Wand2 className="mr-2 h-4 w-4" /> AI Assistant</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center"><Wand2 className="mr-2 h-5 w-5 text-primary" />AI Content Optimizer</DialogTitle>
          <DialogDescription>
            Get suggestions to improve the layout, fonts, and colors of your selected content block.
          </DialogDescription>
        </DialogHeader>
        
        {!suggestions && !isLoading && (
          <div className="flex-grow flex flex-col items-center justify-center p-6">
            <div className="text-center">
              <Wand2 size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Ready to optimize?</p>
              <p className="text-sm text-muted-foreground mb-6">
                Click the button below to get AI-powered suggestions for the selected content block.
              </p>
              <Button onClick={handleFetchSuggestions} size="lg">
                <Wand2 className="mr-2 h-4 w-4" /> Get Suggestions
              </Button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex-grow flex items-center justify-center p-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg">Generating suggestions...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex-grow p-6">
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <Button onClick={handleFetchSuggestions}>
                <Wand2 className="mr-2 h-4 w-4" /> Try Again
              </Button>
            </div>
          </div>
        )}

        {suggestions && !isLoading && (
          <div className="flex-grow overflow-y-auto p-1 pr-3 space-y-6">
            <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-700">
               <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle className="text-green-700 dark:text-green-300">Suggestions Ready!</AlertTitle>
              <AlertDescription className="text-green-600 dark:text-green-500">
                {suggestions.explanation}
              </AlertDescription>
            </Alert>

            <div>
              <h4 className="font-semibold mb-2 flex items-center"><Palette className="mr-2 h-5 w-5 text-accent" />Color Combination</h4>
              <div className="p-4 border rounded-md bg-muted/50">
                <p className="text-sm"><strong>Suggested Colors:</strong> {suggestions.suggestedColorCombination}</p>
                <div className="mt-2 p-3 rounded" style={{
                    color: suggestions.suggestedColorCombination.split(';')[0]?.split(':')[1]?.trim(),
                    backgroundColor: suggestions.suggestedColorCombination.split(';')[1]?.split(':')[1]?.trim(),
                }}>Preview Text</div>
                 <Button onClick={() => applySuggestion('color')} size="sm" className="mt-2">Apply Colors</Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center"><TextCursorInput className="mr-2 h-5 w-5 text-accent" />Font</h4>
              <div className="p-4 border rounded-md bg-muted/50">
                <p className="text-sm"><strong>Suggested Font:</strong> <span style={{fontFamily: suggestions.suggestedFont}}>{suggestions.suggestedFont}</span></p>
                 <Button onClick={() => applySuggestion('font')} size="sm" className="mt-2">Apply Font</Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-stretch-horizontal mr-2 text-accent"><rect width="20" height="6" x="2" y="4" rx="2"/><rect width="20" height="6" x="2" y="14" rx="2"/></svg>Layout (HTML)</h4>
              <div className="p-4 border rounded-md bg-muted/50">
                <p className="text-sm mb-1"><strong>Suggested Layout:</strong></p>
                <pre className="text-xs bg-background p-2 rounded-md overflow-x-auto max-h-40">
                  <code>{suggestions.suggestedLayout}</code>
                </pre>
                <Button onClick={() => applySuggestion('layout')} size="sm" className="mt-2" disabled>Apply Layout (Not Implemented)</Button>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter className="mt-auto pt-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
