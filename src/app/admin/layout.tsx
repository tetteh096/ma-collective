import './admin.css';
import { AdminProviders } from './providers';

export const metadata = { title: 'Admin Dashboard' };

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProviders>{children}</AdminProviders>;
}
