import { TemplateLibrary } from '@/components/templates/template-library';

export const metadata = {
  title: 'Templates - VersaPage',
  description: 'Browse and select from a variety of page templates to start your design.',
};

export default function TemplatesPage() {
  return (
    <div className="h-full"> {/* Ensure TemplateLibrary can use flex-grow correctly */}
      <TemplateLibrary />
    </div>
  );
}
