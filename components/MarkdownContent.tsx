'use client';

import { useTranslation } from './SiteData';


import type { Locale } from '@/lib/content';
import type { ReactNode } from 'react';

function inline(text: string, locale: Locale): ReactNode[] {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => part.startsWith('**') ? <strong key={index}>{part.slice(2, -2)}</strong> : part);
}
export default function MarkdownContent({ text, locale = 'en' }: { text: string; locale?: Locale }) {
  const t = useTranslation();

  const blocks = text.trim().split(/\n\s*\n/);
  return <div className="source-markdown">{blocks.map((block, index) => {
    if (/^---+$/.test(block)) return <hr key={index} />;
    if (block.startsWith('### ')) return <h3 key={index}>{t(locale, inline(block.slice(4), locale))}</h3>;
    if (block.startsWith('## ')) return <h2 key={index}>{t(locale, inline(block.slice(3), locale))}</h2>;
    if (block.startsWith('# ')) return <h2 key={index}>{t(locale, inline(block.slice(2), locale))}</h2>;
    if (block.startsWith('- ')) return <ul key={index}>{block.split('\n').map((line, lineIndex) => <li key={lineIndex}>{t(locale, inline(line.replace(/^- /, ''), locale))}</li>)}</ul>;
    if (block.startsWith('> ')) return <blockquote key={index}>{t(locale, inline(block.replace(/^> /gm, ''), locale))}</blockquote>;
    return <p key={index}>{t(locale, inline(block, locale))}</p>;
  })}</div>;
}
