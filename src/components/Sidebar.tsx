import Image from 'next/image';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="ul-sidebar">
      {/* header */}
      <div className="ul-sidebar-header">
        <div className="ul-sidebar-header-logo">
          <Link href="/">
            <Image src="/assets/img/logo.svg" alt="logo" width={140} height={40} className="logo" style={{ height: 'auto' }} />
          </Link>
        </div>
        <button className="ul-sidebar-closer">
          <i className="flaticon-close"></i>
        </button>
      </div>

      <div className="ul-sidebar-header-nav-wrapper d-block d-lg-none"></div>

      <div className="ul-sidebar-about d-none d-lg-block">
        <span className="title">About Us</span>
        <p className="mb-0">
          Ghana&apos;s premier online fashion destination. Shop the latest styles in clothing,
          footwear, accessories and more — all delivered to your doorstep across Accra, Kumasi,
          Tamale and beyond.
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
