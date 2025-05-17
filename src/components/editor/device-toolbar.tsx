"use client";

import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditor } from '@/contexts/editor-context';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function DeviceToolbar() {
  const { activeDeviceView, setActiveDeviceView } = useEditor();

  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-card border shadow-sm">
      <ToggleGroup 
        type="single" 
        value={activeDeviceView} 
        onValueChange={(value) => {
          if (value) setActiveDeviceView(value as 'desktop' | 'tablet' | 'mobile');
        }}
        aria-label="Device View"
      >
        <ToggleGroupItem value="desktop" aria-label="Desktop view">
          <Monitor className="h-5 w-5" />
        </ToggleGroupItem>
        <ToggleGroupItem value="tablet" aria-label="Tablet view">
          <Tablet className="h-5 w-5" />
        </ToggleGroupItem>
        <ToggleGroupItem value="mobile" aria-label="Mobile view">
          <Smartphone className="h-5 w-5" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
