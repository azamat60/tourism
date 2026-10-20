import 'leaflet/dist/leaflet.css';
import type { Metadata } from 'next';
import '../globals.css';
import '../internal.css';
import '../expanded.css';
import '../source-content.css';

export const metadata: Metadata = {
  title: 'Nomad Discovery Tours — Kyrgyzstan Horse Treks & Tours',
  description: 'Experience the wild beauty, nomadic culture, and breathtaking landscapes of Kyrgyzstan with our expert-guided horse treks.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
