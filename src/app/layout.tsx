import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/providers';
import { Modal } from '@/entities/modal';
import { Header } from '@/widgets/header';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <Modal />
                    <div
                        style={{
                            maxWidth: 1440,
                            margin: '0 auto',
                            height: '100vh',
                        }}
                    >
                        <Header />

                        {children}
                    </div>
                </Providers>
            </body>
        </html>
    );
}
