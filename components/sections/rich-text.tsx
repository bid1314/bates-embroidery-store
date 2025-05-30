import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import type { RichTextSectionProps } from '@/lib/types';

export default function RichTextSection({ markdown }: RichTextSectionProps) {
  const html = DOMPurify.sanitize(marked.parse(markdown));
  return (
    <section className="prose prose-gray mx-auto my-12 w-full max-w-3xl px-4 dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
  );
} 