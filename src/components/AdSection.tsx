import Link from 'next/link';

export default function AdSection() {
  return (
    <div className="ul-container">
      <section className="ul-ad">
        <div className="ul-inner-container">
          <div className="ul-ad-content">
            <div className="ul-ad-txt">
              <span className="ul-ad-sub-title">Shop MA Collection</span>
              <h2 className="ul-section-title">Quality fashion for work, weekend & every day</h2>
              <div className="ul-ad-categories">
                <span className="category"><span><i className="flaticon-check-mark"></i></span>Dresses</span>
                <span className="category"><span><i className="flaticon-check-mark"></i></span>Casual</span>
                <span className="category"><span><i className="flaticon-check-mark"></i></span>Men&apos;s</span>
                <span className="category"><span><i className="flaticon-check-mark"></i></span>Outings</span>
              </div>
            </div>
            <div className="ul-ad-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.pexels.com/photos/34232728/pexels-photo-34232728.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Afi styles" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <Link href="/shop" className="ul-btn">
              Shop the collection <i className="flaticon-up-right-arrow"></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
