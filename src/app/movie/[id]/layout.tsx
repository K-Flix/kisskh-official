import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StreamVerse',
  description: 'A streaming website built with Next.js',
};

export default function DetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
