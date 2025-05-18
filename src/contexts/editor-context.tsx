"use client";

import type { PageElement, HeadingElement, LinkElement, TableElement, BlockquoteElement, ListElement, DividerElement } from '@/components/editor/types';
import { pageElementToHtml } from '@/lib/editor-utils';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface EditorContextType {
  pageElements: PageElement[];
  addElement: (type: PageElement['type'], partialElement?: Partial<PageElement>) => string;
  updateElement: (id: string, updates: Partial<PageElement>) => void;
  removeElement: (id: string) => void;
  moveElement: (id: string, direction: 'up' | 'down') => void;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  loadTemplate: (elements: PageElement[]) => void;
  getPageAsHtml: (elementId?: string) => string;
  setPageElements: (elements: PageElement[]) => void;
  activeDeviceView: 'desktop' | 'tablet' | 'mobile';
  setActiveDeviceView: (view: 'desktop' | 'tablet' | 'mobile') => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [pageElements, setPageElements] = useState<PageElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeDeviceView, setActiveDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Load from localStorage on mount
  useEffect(() => {
    const savedElements = localStorage.getItem('versaPageElements');
    if (savedElements) {
      try {
        setPageElements(JSON.parse(savedElements));
      } catch (error) {
        console.error("Failed to parse saved elements from localStorage", error);
        localStorage.removeItem('versaPageElements'); // Clear corrupted data
      }
    }
  }, []);

  // Save to localStorage whenever pageElements change
  useEffect(() => {
    localStorage.setItem('versaPageElements', JSON.stringify(pageElements));
  }, [pageElements]);


  const addElement = useCallback((type: PageElement['type'], partialElement?: Partial<PageElement>) => {
    const id = uuidv4();
    let newElement: PageElement;
    switch (type) {
      case 'heading':
        newElement = { id, type, content: `New Heading ${ (partialElement as HeadingElement)?.level || 1}`, level: (partialElement as HeadingElement)?.level || 1, ...partialElement } as PageElement;
        break;
      case 'text':
        newElement = { id, type, content: 'New paragraph text.', ...partialElement } as PageElement;
        break;
      case 'image':
        newElement = { id, type, src: 'https://placehold.co/600x400.png', alt: 'Placeholder Image', ...partialElement, "data-ai-hint": "abstract texture" } as PageElement;
        break;
      case 'button':
        newElement = { id, type, text: 'Click Me', variant: 'default', ...partialElement } as PageElement;
        break;
      case 'spacer':
        newElement = { id, type, height: 20, ...partialElement } as PageElement;
        break;
      case 'link':
        newElement = { id, type, text: 'Link Text', href: 'https://example.com', target: '_blank', ...partialElement } as LinkElement;
        break;
      case 'table':
        newElement = { id, type, numRows: 3, numCols: 3, caption: 'New Table', ...partialElement } as TableElement;
        break;
      case 'blockquote':
        newElement = { id, type, content: 'This is a quote.', citation: 'Source', ...partialElement } as BlockquoteElement;
        break;
      case 'list':
        newElement = { id, type, items: ['List item 1', 'List item 2'], ordered: (partialElement as ListElement)?.ordered || false, ...partialElement } as ListElement;
        break;
      case 'divider':
        newElement = { id, type, ...partialElement } as DividerElement;
        break;
      default:
        throw new Error(`Unsupported element type: ${type}`);
    }
    setPageElements(prev => [...prev, newElement]);
    setSelectedElementId(id);
    return id;
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<PageElement>) => {
    setPageElements(prev => prev.map(el => (el.id === id ? { ...el, ...updates } : el)));
  }, []);

  const removeElement = useCallback((id: string) => {
    setPageElements(prev => prev.filter(el => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  }, [selectedElementId]);

  const moveElement = useCallback((id: string, direction: 'up' | 'down') => {
    setPageElements(prev => {
      const index = prev.findIndex(el => el.id === id);
      if (index === -1) return prev;
      const newElements = [...prev];
      const [element] = newElements.splice(index, 1);
      const newIndex = direction === 'up' ? Math.max(0, index - 1) : Math.min(newElements.length, index + 1);
      newElements.splice(newIndex, 0, element);
      return newElements;
    });
  }, []);

  const loadTemplate = useCallback((elements: PageElement[]) => {
    const newElements = elements.map(el => ({ ...el, id: uuidv4() })); // Ensure unique IDs
    setPageElements(newElements);
    setSelectedElementId(null);
  }, []);

  const getPageAsHtml = useCallback((elementId?: string): string => {
    if (elementId) {
      const element = pageElements.find(el => el.id === elementId);
      return element ? pageElementToHtml(element) : '';
    }
    return pageElements.map(pageElementToHtml).join('\n');
  }, [pageElements]);

  return (
    <EditorContext.Provider
      value={{
        pageElements,
        addElement,
        updateElement,
        removeElement,
        moveElement,
        selectedElementId,
        setSelectedElementId,
        loadTemplate,
        getPageAsHtml,
        setPageElements,
        activeDeviceView,
        setActiveDeviceView,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor(): EditorContextType {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
