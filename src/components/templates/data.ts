import type { PageElement } from '@/components/editor/types';

export interface Template {
  id: string;
  name: string;
  description: string;
  previewImageUrl: string;
  elements: PageElement[];
  category: string;
  tags: string[];
}

export const templates: Template[] = [
  {
    id: 'tpl_blank',
    name: 'Blank Canvas',
    description: 'Start fresh with an empty page. Your imagination is the limit!',
    previewImageUrl: 'https://placehold.co/400x300.png?text=Blank',
    elements: [],
    category: 'Basic',
    tags: ['empty', 'starter'],
  },
  {
    id: 'tpl_landing_basic',
    name: 'Basic Landing Page',
    description: 'A simple hero section with a call to action. Perfect for quick launches.',
    previewImageUrl: 'https://placehold.co/400x300.png?text=Landing+Basic',
    elements: [
      { id: 'h1', type: 'heading', content: 'Welcome to Our Site!', level: 1, styles: { textAlign: 'center', margin: '20px 0' } },
      { id: 'p1', type: 'text', content: 'This is a simple landing page template. Customize it to fit your needs.', styles: { textAlign: 'center', marginBottom: '20px' } },
      { id: 'img1', type: 'image', src: 'https://placehold.co/800x400.png', alt: 'Placeholder Hero Image', "data-ai-hint": "landscape abstract", styles: { display: 'block', margin: '0 auto 20px auto', maxWidth: '800px' } },
      { id: 'btn1', type: 'button', text: 'Learn More', variant: 'default', styles: { display: 'block', margin: '0 auto', width: 'fit-content' } },
    ],
    category: 'Landing Pages',
    tags: ['hero', 'cta', 'simple'],
  },
  {
    id: 'tpl_portfolio_minimal',
    name: 'Minimal Portfolio',
    description: 'A clean layout to showcase your work with a brief introduction.',
    previewImageUrl: 'https://placehold.co/400x300.png?text=Portfolio+Minimal',
    elements: [
      { id: 'h_port', type: 'heading', content: 'My Portfolio', level: 2, styles: { textAlign: 'center', padding: '30px 0' } },
      { id: 'p_port_intro', type: 'text', content: 'Hello! I am a creator and designer. Here are some of my projects.', styles: { textAlign: 'center', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px auto' } },
      { id: 'img_port_1', type: 'image', src: 'https://placehold.co/300x200.png', alt: 'Project 1', "data-ai-hint": "design project", styles: { margin: '10px' } },
      { id: 'img_port_2', type: 'image', src: 'https://placehold.co/300x200.png', alt: 'Project 2', "data-ai-hint": "mockup app", styles: { margin: '10px' } },
      { id: 'img_port_3', type: 'image', src: 'https://placehold.co/300x200.png', alt: 'Project 3', "data-ai-hint": "ui concept", styles: { margin: '10px' } },
      { id: 'spacer_1', type: 'spacer', height: 40 },
      { id: 'p_contact', type: 'text', content: 'Interested in collaborating? Get in touch!', styles: { textAlign: 'center' } },
      { id: 'btn_contact', type: 'button', text: 'Contact Me', variant: 'outline', styles: { display: 'block', margin: '10px auto', width: 'fit-content' } },
    ],
    category: 'Portfolio',
    tags: ['minimal', 'showcase', 'creative'],
  },
  {
    id: 'tpl_blog_post',
    name: 'Simple Blog Post',
    description: 'A classic blog post layout with a title, image, and text content.',
    previewImageUrl: 'https://placehold.co/400x300.png?text=Blog+Post',
    elements: [
      { id: 'blog_title', type: 'heading', content: 'My Awesome Blog Post Title', level: 1, styles: { marginBottom: '10px' } },
      { id: 'blog_meta', type: 'text', content: '<small><em>Published on January 1, 2024 by VersaPage</em></small>', styles: { color: 'grey', marginBottom: '20px' } },
      { id: 'blog_image', type: 'image', src: 'https://placehold.co/700x350.png', alt: 'Blog post image', "data-ai-hint": "article writing", styles: { marginBottom: '20px', borderRadius: '8px' } },
      { id: 'blog_p1', type: 'text', content: 'This is the first paragraph of the blog post. It introduces the main topic and engages the reader. We can write multiple paragraphs to elaborate on the subject matter.' },
      { id: 'blog_h2', type: 'heading', content: 'A Subheading for a New Section', level: 2, styles: { marginTop: '30px', marginBottom: '10px' } },
      { id: 'blog_p2', type: 'text', content: 'This paragraph delves deeper into a specific aspect discussed under the subheading. It can include more details, examples, or arguments.' },
      { id: 'blog_spacer', type: 'spacer', height: 20 },
      { id: 'blog_p3', type: 'text', content: 'Finally, a concluding paragraph that summarizes the key points or offers a final thought.' },
    ],
    category: 'Blog',
    tags: ['article', 'content', 'writing'],
  },
];
