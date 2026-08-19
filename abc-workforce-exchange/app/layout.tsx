import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ABC NorCal Workforce Exchange',
  description: 'Merit Shop workforce recruiting and career network for ABC NorCal members and candidates.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
