"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { templates, type Template } from './data';
import { TemplateCard } from './template-card';
import { useEditor } from '@/contexts/editor-context';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

export function TemplateLibrary() {
  const router = useRouter();
  const { loadTemplate } = useEditor();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => ['All', ...new Set(templates.map(t => t.category))], []);

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const handleSelectTemplate = (template: Template) => {
    loadTemplate(template.elements);
    toast({
      title: "Template Loaded",
      description: `"${template.name}" has been loaded into the editor.`,
    });
    router.push('/editor');
  };

  // Optional: Implement onPreviewTemplate to show a modal with template details
  // const onPreviewTemplate = (template: Template) => { ... };

  return (
    <div className="p-6 flex flex-col h-full">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Template Library</h1>
        <p className="text-muted-foreground">
          Choose a template to kickstart your page design or start from scratch.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          type="search"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="flex-grow">
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTemplates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelectTemplate={handleSelectTemplate}
                // onPreviewTemplate={onPreviewTemplate} // Optional
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-10 h-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-x mb-4 text-muted-foreground opacity-50"><path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <p className="text-lg font-medium text-muted-foreground">No templates found.</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
