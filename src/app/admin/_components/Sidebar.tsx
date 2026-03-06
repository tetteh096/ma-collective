'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthenticate } from '@neondatabase/neon-js/auth/react';
import { authClient } from '@/lib/auth';

/* ── Inline SVG Icons ───────────────────────────── */
const Icons = {
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  products: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  categories: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  orders: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
      <path d="M9 12h6M9 16h4"/>
    </svg>
  ),
  analytics: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  customers: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  coupons: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="15" x2="15.01" y2="15"/>
      <line x1="9" y1="15" x2="15" y2="9"/>
    </svg>
  ),
  flashSale: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M15 4h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M9 8h6m-6 4h6m-6 4h6"/>
      <path d="M9 2l2 2-2 2M15 22l-2-2 2-2"/>
    </svg>
  ),
  featured: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  newsletter: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  megaphone: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 14v-3z"/><path d="M11 6.5a3.5 3.5 0 0 1 5 3 3.5 3.5 0 0 1-5 3"/>
    </svg>
  ),
  logout: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  logo: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m2.98 2.98l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m-2.98-2.98l4.24-4.24M19.78 19.78l-4.24-4.24m-2.98-2.98l-4.24-4.24"/></svg>
  ),
}

type NavItem =
  | { section: string }
  | { href: string; label: string; icon: React.ReactNode };

const navItems: NavItem[] = [
  { href: '/admin',            label: 'Admin Dashboard',  icon: Icons.dashboard  },
  { section: 'Catalogue' },
  { href: '/admin/products',   label: 'Products',   icon: Icons.products   },
  { href: '/admin/categories', label: 'Categories', icon: Icons.categories },
  { section: 'Sales' },
  { href: '/admin/orders',     label: 'Orders',     icon: Icons.orders     },
  { href: '/admin/customers',  label: 'Customers',  icon: Icons.customers  },
  { href: '/admin/coupons',    label: 'Coupons',    icon: Icons.coupons    },
  { section: 'Engagement' },
  { href: '/admin/announcements', label: 'Announcements', icon: Icons.megaphone },
  { section: 'Insights' },
  { href: '/admin/analytics',  label: 'Analytics',  icon: Icons.analytics  },
  { section: 'Settings' },
  { href: '/admin/settings/user', label: 'User Settings', icon: Icons.settings },
  { href: '/admin/settings/org',  label: 'Organization',  icon: Icons.settings },
];

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const { data } = useAuthenticate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (data as any)?.user as { name?: string; email?: string } | undefined;

  async function handleLogout() {
    await authClient.signOut();
    router.push('/auth/sign-in?redirectTo=/admin');
  }

  return (
    <aside className="ad-sidebar">
      {/* Logo */}
      <div className="ad-sidebar-logo">
        <div className="ad-logo-mark">{Icons.logo}</div>
        <div className="ad-logo-text">MA <span>Collective</span></div>
      </div>

      {/* Navigation */}
      <nav className="ad-nav">
        {navItems.map((item, i) => {
          if ('section' in item) {
            return <div key={i} className="ad-nav-section">{item.section}</div>;
          }
          const active =
            item.href === '/admin'
              ? path === '/admin'
              : path.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={active ? 'active' : ''}>
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="ad-sidebar-footer">
        <div className="ad-user-badge">
          <div className="ad-user-avatar">
            {(user?.name?.[0] ?? user?.email?.[0] ?? 'A').toUpperCase()}
          </div>
          <div className="ad-user-info">
            <div className="ad-user-name">{user?.name ?? 'Admin'}</div>
            <div className="ad-user-email">{user?.email ?? ''}</div>
          </div>
          <button className="ad-logout-btn" title="Sign out" onClick={handleLogout}>
            {Icons.logout}
          </button>
        </div>
      </div>
    </aside>
  );
}
