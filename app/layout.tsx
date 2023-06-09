import './globals.css';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { NavBar } from './components/navbar/NavBar';
import ClientOnly from './components/ClientOnly';
import RegisterModal from './components/modals/RegisterModal';
import ToasterProvider from './providers/ToasterProvider';

const font = Nunito({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Air bnb',
  description: 'Airbnb clone',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <RegisterModal />
          <NavBar />
        </ClientOnly>
        {children}
      </body>
    </html>
  );
}
