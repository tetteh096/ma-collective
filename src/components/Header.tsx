import Link from 'next/link';
import HeaderActions from '@/components/HeaderActions';
import AnnouncementBar from '@/components/AnnouncementBar';
import HeaderCategorySelect from '@/components/HeaderCategorySelect';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Shop', href: '/shop' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  return (
    <header className="ul-header">
      <AnnouncementBar />

      {/* Main header row */}
      <div className="ul-header-bottom">
        <div className="ul-container">
          <div className="ul-header-bottom-wrapper">

            {/* Wordmark logo + search */}
            <div className="header-bottom-left">
              <div className="logo-container">
                <Link
                  href="/"
                  style={{
                    textDecoration: 'none',
                    display: 'inline-flex',
                    flexDirection: 'column',
                    lineHeight: 1,
                    gap: 2,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Georgia', 'Times New Roman', serif",
                      fontWeight: 900,
                      fontSize: '1.75rem',
                      letterSpacing: '0.18em',
                      color: '#1a1a2e',
                      textTransform: 'uppercase',
                    }}
                  >
                    AYEKWA
                  </span>
                  <span
                    style={{
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      fontWeight: 300,
                      fontSize: '0.58rem',
                      letterSpacing: '0.45em',
                      color: '#888',
                      textTransform: 'uppercase',
                      paddingLeft: '0.1em',
                    }}
                  >
                    Collective
                  </span>
                </Link>
              </div>

              {/* Search */}
              <div className="ul-header-search-form-wrapper flex-grow-1 flex-shrink-0">
                <form action="/shop" method="GET" className="ul-header-search-form">
                  <div className="dropdown-wrapper">
                    <HeaderCategorySelect />
                  </div>
                  <div className="ul-header-search-form-right">
                    <input
                      type="search"
                      name="q"
                      id="ul-header-search"
                      placeholder="Search styles, outfits…"
                    />
                    <button type="submit">
                      <span className="icon">
                        <i className="flaticon-search-interface-symbol" />
                      </span>
                    </button>
                  </div>
                </form>
                <button className="ul-header-mobile-search-closer d-xxl-none">
                  <i className="flaticon-close" />
                </button>
              </div>
            </div>

            {/* Nav */}
            <div className="ul-header-nav-wrapper">
              <div className="to-go-to-sidebar-in-mobile">
                <nav className="ul-header-nav">
                  {NAV_LINKS.map((link) => (
                    <Link key={link.href} href={link.href}>
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            {/* Cart / Wishlist / Account icons */}
            <HeaderActions />

            <div className="d-inline-flex">
              <button className="ul-header-sidebar-opener">
                <i className="flaticon-hamburger" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
