import Link from 'next/link';

const footerLinks = {
  'Shop': [
    { label: 'Women\'s Fashion', href: '/shop?category=womens' },
    { label: 'Men\'s Fashion', href: '/shop?category=mens' },
    { label: 'Workwear', href: '/shop?category=workwear' },
    { label: 'Casual Wear', href: '/shop?category=casual' },
    { label: 'Outings & Events', href: '/shop?category=outings' },
  ],
  'Customer Service': [
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Returns & Exchanges', href: '/faq#returns' },
    { label: 'Shipping Info', href: '/faq#delivery' },
  ],
  'Company': [
    { label: 'Services', href: '/services' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="ul-footer">
      <div className="ul-inner-container">
        <div className="ul-footer-top">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div className="ul-footer-top-widget" key={title}>
              <h3 className="ul-footer-top-widget-title">{title}</h3>
              <div className="ul-footer-top-widget-links">
                {links.map((l, i) => (
                  <Link key={`${title}-${i}`} href={l.href}>{l.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="ul-footer-middle">
          <div className="ul-footer-middle-widget">
            <h3 className="ul-footer-middle-widget-title">Follow Us</h3>
            <div className="ul-footer-middle-widget-content">
              <div className="social-links">
                <a href="https://www.facebook.com/macollection" target="_blank" rel="noreferrer"><i className="flaticon-facebook-app-symbol"></i></a>
                <a href="https://www.twitter.com/macollection" target="_blank" rel="noreferrer"><i className="flaticon-twitter"></i></a>
                <a href="https://www.instagram.com/macollection" target="_blank" rel="noreferrer"><i className="flaticon-instagram"></i></a>
                <a href="https://www.tiktok.com/@macollection" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #fff' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="ul-footer-middle-widget">
            <h3 className="ul-footer-middle-widget-title">Get in Touch</h3>
            <div className="ul-footer-middle-widget-content">
              <div className="contact-nums">
                <a href="https://wa.me/233209117053">WhatsApp: 0209117053</a>
                <br />
                <a href="mailto:hello@aficlothing.com">Email: hello@aficlothing.com</a>
              </div>
            </div>
          </div>

          <div className="ul-footer-middle-widget align-self-center">
            <Link href="/">
              <span
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontWeight: 900,
                  fontSize: '1.8rem',
                  letterSpacing: '0.15em',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                Ayekwa Collective
              </span>
            </Link>
          </div>
        </div>

        <div className="ul-footer-bottom">
          <p className="copyright-txt">
            Copyright {new Date().getFullYear()} © Ayekwa Collective — Made with care in Accra, Ghana
          </p>
        </div>
      </div>
    </footer>
  );
}
