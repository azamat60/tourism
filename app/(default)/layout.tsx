import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Nomad Discovery Tours — Kyrgyzstan, beyond the ordinary',
  description: 'Thoughtful horse treks and private journeys through the wild heart of Kyrgyzstan.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
