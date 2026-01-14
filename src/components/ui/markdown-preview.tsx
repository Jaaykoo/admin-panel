'use client';

import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import { cn } from '@/lib/utils';

// Import dynamique pour éviter les erreurs SSR
const MDPreview = dynamic(
  () => import('@uiw/react-md-editor').then(mod => {
    const Preview = mod.default.Markdown;
    return { default: Preview };
  }),
  { ssr: false },
);

export interface MarkdownPreviewProps {
  source?: string;
  className?: string;
}

/**
 * Composant de prévisualisation Markdown
 * Utilisé pour afficher du contenu Markdown formaté (descriptions produits, etc.)
 */
export function MarkdownPreview({ source, className }: MarkdownPreviewProps) {
  if (!source) {
    return (
      <p className="text-sm italic text-gray-400">Aucune description</p>
    );
  }

  return (
    <div
      data-color-mode="light"
      className={cn(
        'prose prose-sm max-w-none',
        '[&_.wmde-markdown]:bg-transparent',
        '[&_.wmde-markdown]:text-gray-700',
        '[&_.wmde-markdown_h1]:text-xl [&_.wmde-markdown_h1]:font-bold [&_.wmde-markdown_h1]:text-gray-900',
        '[&_.wmde-markdown_h2]:text-lg [&_.wmde-markdown_h2]:font-semibold [&_.wmde-markdown_h2]:text-gray-900',
        '[&_.wmde-markdown_h3]:text-base [&_.wmde-markdown_h3]:font-semibold [&_.wmde-markdown_h3]:text-gray-900',
        '[&_.wmde-markdown_ul]:list-disc [&_.wmde-markdown_ul]:pl-5',
        '[&_.wmde-markdown_ol]:list-decimal [&_.wmde-markdown_ol]:pl-5',
        '[&_.wmde-markdown_a]:text-[#009ef7] [&_.wmde-markdown_a]:underline',
        '[&_.wmde-markdown_code]:bg-gray-100 [&_.wmde-markdown_code]:px-1 [&_.wmde-markdown_code]:rounded',
        '[&_.wmde-markdown_pre]:bg-gray-100 [&_.wmde-markdown_pre]:p-3 [&_.wmde-markdown_pre]:rounded-lg',
        '[&_.wmde-markdown_blockquote]:border-l-4 [&_.wmde-markdown_blockquote]:border-[#009ef7] [&_.wmde-markdown_blockquote]:pl-4 [&_.wmde-markdown_blockquote]:italic',
        '[&_.wmde-markdown_table]:w-full [&_.wmde-markdown_table]:border-collapse',
        '[&_.wmde-markdown_th]:border [&_.wmde-markdown_th]:border-gray-200 [&_.wmde-markdown_th]:bg-gray-50 [&_.wmde-markdown_th]:p-2',
        '[&_.wmde-markdown_td]:border [&_.wmde-markdown_td]:border-gray-200 [&_.wmde-markdown_td]:p-2',
        className,
      )}
    >
      <MDPreview source={source} />
    </div>
  );
}

export default MarkdownPreview;

