import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import MaintenanceBlocker from '@/components/MaintenanceBlocker';
import { checkPusdatinMaintenance } from '@/lib/pusdatin';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://loket.kemenag-baritoutara.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Loket PTSP - Sistem Antrian Pelayanan Terpadu Satu Pintu',
  description: 'Sistem Informasi dan Antrian Loket Pelayanan Terpadu Satu Pintu (PTSP) Kementerian Agama RI',
  icons: {
    icon: '/kemenag.svg',
    shortcut: '/kemenag.svg',
    apple: '/kemenag.svg',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Direct Server-Side check before rendering any HTML to browser
  const maintenanceStatus = await checkPusdatinMaintenance();

  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="min-h-screen font-sans bg-slate-950 text-slate-100 antialiased selection:bg-emerald-600 selection:text-white">
        <MaintenanceBlocker initialIsMaintenance={maintenanceStatus.isMaintenance}>
          {children}
        </MaintenanceBlocker>
      </body>
    </html>
  );
}
