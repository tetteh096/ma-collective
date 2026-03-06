import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="ul-sidebar">
      {/* header */}
      <div className="ul-sidebar-header">
        <div className="ul-sidebar-header-logo">
          <Link href="/" style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-color)', textDecoration: 'none' }}>
            MA Collective
          </Link>
        </div>
        <button className="ul-sidebar-closer">
          <i className="flaticon-close"></i>
        </button>
      </div>

      <div className="ul-sidebar-header-nav-wrapper d-block d-lg-none"></div>

      <div className="ul-sidebar-about d-none d-lg-block">
        <span className="title">About MA Collective</span>
        <p className="mb-0">
          Real, wearable fashion for work, life & every moment. We design quality pieces — workwear, 
          casuals, and occasion wear — that fit your life, not just your body. Shop authentic 
          Ghanaian fashion delivered to your door.
        </p>
      </div>

      {/* sidebar footer */}
      <div className="ul-sidebar-footer">
        <span className="ul-sidebar-footer-title">Follow us</span>
        <div className="ul-sidebar-footer-social">
          <a href="#"><i className="flaticon-facebook-app-symbol"></i></a>
          <a href="#"><i className="flaticon-twitter"></i></a>
          <a href="#"><i className="flaticon-instagram"></i></a>
          <a href="#"><i className="flaticon-youtube"></i></a>
        </div>
      </div>
    </div>
  );
}
