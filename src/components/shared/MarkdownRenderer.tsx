// src/components/shared/MarkdownRenderer.tsx
'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  // Simple markdown to HTML converter
  const parseMarkdown = (text: string): string => {
    let html = text;

    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-gray-900 mt-8 mb-4">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>');

    // Bold and Italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 hover:text-primary-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // Code blocks (triple backticks)
    html = html.replace(/```([^`]+)```/g, '<pre class="bg-gray-100 p-4 rounded-md my-4 overflow-x-auto"><code class="text-sm">$1</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>');

    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary-500 pl-4 italic text-gray-700 my-4">$1</blockquote>');

    // Unordered lists
// Unordered lists
html = html.replace(/^- (.+)$/gm, '<li class="mb-1">$1</li>');
// Wrap consecutive list items in ul tags
html = html.replace(/(<li class="mb-1">[^<]*<\/li>(?:\s*<li class="mb-1">[^<]*<\/li>)*)/g, 
  '<ul class="list-disc list-inside my-4 space-y-1">$1</ul>');

// Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="mb-1">$1</li>');
  // Wrap consecutive ordered list items in ol tags
  html = html.replace(/(<li class="mb-1">[^<]*<\/li>(?:\s*<li class="mb-1">[^<]*<\/li>)*)/g, 
    '<ol class="list-decimal list-inside my-4 space-y-1">$1</ol>');
    // This is a simple approach - in real implementation you might want to handle nested lists better

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p class="mb-4">');
    html = html.replace(/\n/g, '<br>');

    // Wrap in paragraphs
    html = '<p class="mb-4">' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p class="mb-4"><\/p>/g, '');

    return html;
  };

  const htmlContent = parseMarkdown(content);

  return (
    <div 
      className={`prose prose-lg max-w-none text-gray-800 leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}