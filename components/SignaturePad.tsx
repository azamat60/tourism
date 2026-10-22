'use client';

import { useTranslation } from './SiteData';



import type { Locale } from '@/lib/content';

import { useEffect, useRef } from 'react';

export default function SignaturePad({ label, value, onChange, locale = 'en' }: { locale?: Locale; label: string; value: string; onChange: (value: string) => void }) {
  const t = useTranslation();

  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  useEffect(() => {
    const context = canvas.current?.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, 600, 160);
    if (!value) return;
    const image = new window.Image(); image.onload = () => context.drawImage(image, 0, 0); image.src = value;
  }, [value]);
  return <div className="source-signature"><p>{t(locale, label)}</p><canvas ref={canvas} width={600} height={160} aria-label={t(locale, label)} role="img" onPointerDown={(event) => {
    const target = event.currentTarget; const context = target.getContext('2d'); if (!context) return;
    target.setPointerCapture(event.pointerId); drawing.current = true;
    const bounds = target.getBoundingClientRect(); const x = (event.clientX - bounds.left) * 600 / bounds.width; const y = (event.clientY - bounds.top) * 160 / bounds.height;
    context.beginPath(); context.lineWidth = 2.5; context.lineCap = 'round'; context.strokeStyle = '#243e32'; context.moveTo(x, y); context.lineTo(x + 0.1, y); context.stroke();
  }} onPointerMove={(event) => {
    if (!drawing.current) return;
    const target = event.currentTarget; const bounds = target.getBoundingClientRect();
    const context = target.getContext('2d'); context?.lineTo((event.clientX - bounds.left) * 600 / bounds.width, (event.clientY - bounds.top) * 160 / bounds.height); context?.stroke();
  }} onPointerUp={(event) => { if (drawing.current) { drawing.current = false; onChange(event.currentTarget.toDataURL('image/png')); } }} onPointerCancel={(event) => { if (drawing.current) { drawing.current = false; onChange(event.currentTarget.toDataURL('image/png')); } }} /><button type="button" className="source-action" onClick={() => onChange('')}>{t(locale, "Clear signature")}</button><span role="status">{t(locale, value ? 'Signature captured' : 'Draw your signature above')}</span></div>;
}
