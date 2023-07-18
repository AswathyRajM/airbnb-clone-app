import './globals.css';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { NavBar } from './components/navbar/NavBar';
import Modal from './components/modals/Modal';
import ClientOnly from './components/ClientOnly';

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
          <Modal
            title={'hello'}
            isOpen
            actionLabel='submit'
            secondaryActionLabel='close'
          />
          <NavBar />
        </ClientOnly>
        {children}
      </body>
    </html>
  );
}
