import { isLocale } from '@/lib/content';
import '../../globals.css';

export default async function LocaleLayout({ children, params }: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const language = isLocale(locale) ? (locale === 'ge' ? 'de' : locale) : 'en';
  const direction = language === 'ar' ? 'rtl' : 'ltr';

  return <html lang={language} dir={direction}><body>{children}</body></html>;
}
