"use client";

import Image from 'next/image';
import type { Template } from './data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, PlusCircle } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
  onSelectTemplate: (template: Template) => void;
  onPreviewTemplate?: (template: Template) => void; // Optional: for a modal preview
}

export function TemplateCard({ template, onSelectTemplate, onPreviewTemplate }: TemplateCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-xl transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="relative w-full h-48 mb-2 rounded-md overflow-hidden">
          <Image
            src={template.previewImageUrl}
            alt={`${template.name} preview`}
            layout="fill"
            objectFit="cover"
            data-ai-hint={`${template.tags[0]} ${template.tags[1] || ''}`}
          />
        </div>
        <CardTitle className="text-lg">{template.name}</CardTitle>
        <CardDescription className="text-xs h-10 overflow-hidden text-ellipsis">{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-1 mb-2">
          {template.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2 pt-2 border-t">
        {onPreviewTemplate && (
          <Button variant="outline" size="sm" onClick={() => onPreviewTemplate(template)} className="flex-1">
            <Eye className="mr-2 h-4 w-4" /> Preview
          </Button>
        )}
        <Button size="sm" onClick={() => onSelectTemplate(template)} className="flex-1">
          <PlusCircle className="mr-2 h-4 w-4" /> Use Template
        </Button>
      </CardFooter>
    </Card>
  );
}
