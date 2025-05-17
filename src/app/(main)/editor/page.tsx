"use client";

import { ElementToolbar } from '@/components/editor/element-toolbar';
import { VisualEditor } from '@/components/editor/visual-editor';
import { ElementConfigPanel } from '@/components/editor/element-config-panel';
import { LivePreview } from '@/components/editor/live-preview';
import { CodeView } from '@/components/editor/code-view';
import { DeviceToolbar } from '@/components/editor/device-toolbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Maximize, Code } from 'lucide-react'; // Icons for tabs

export default function EditorPage() {
  return (
    <div className="flex h-[calc(100vh-theme(spacing.14))] w-full bg-background"> {/* Adjust height based on AppLayout header */}
      <ElementToolbar />
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        <div className="flex justify-center">
          <DeviceToolbar />
        </div>
        <Tabs defaultValue="editor" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="shrink-0 self-center">
            <TabsTrigger value="editor" className="gap-1">
              <Maximize className="h-4 w-4" /> Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="gap-1">
              <Code className="h-4 w-4" /> Code
            </TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="flex-1 overflow-auto mt-0">
            <VisualEditor />
          </TabsContent>
          <TabsContent value="preview" className="flex-1 overflow-auto mt-0">
            <LivePreview />
          </TabsContent>
          <TabsContent value="code" className="flex-1 overflow-auto mt-0">
            <CodeView />
          </TabsContent>
        </Tabs>
      </div>
      <ElementConfigPanel />
    </div>
  );
}
