import React from 'react';
import '../layouts/tailwind.css';
import '../layouts/style.css';
import { Layout } from '../components/Layout';
import { usePageContext } from 'vike-react/usePageContext';
import type { User } from '../types/api';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pageContext = usePageContext();
  const user = (pageContext as any).user as User | null;
  
  return <Layout user={user}>{children}</Layout>;
}