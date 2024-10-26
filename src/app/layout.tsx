'use client';
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
    <head>
      <title>C-part management - BU & Zone view</title>
      <meta name="description" content="C-part management - BU & Zone view" />
    </head>
    <body suppressHydrationWarning={true}
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
    </body>
    </html>
  );
}
