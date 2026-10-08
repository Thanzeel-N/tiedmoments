import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tied Moments | Wedding stories, beautifully told',
  description: 'Wedding photography for the moments that matter. Over 500 weddings captured. Tied Moments travels wherever your love story takes us.',
  icons: { icon: '/favicon.svg' },
  openGraph: { title: 'Tied Moments — For the moments that become forever.', description: '500+ weddings. Countless moments. Available wherever your story takes us.', type: 'website' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
