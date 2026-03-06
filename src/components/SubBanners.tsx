import Image from 'next/image';
import Link from 'next/link';

const banners = [
  {
    title: "Women's Workwear",
    sub: 'New Styles',
    descr: 'Office ready, all day comfortable',
    img: 'https://images.pexels.com/photos/1661443/pexels-photo-1661443.jpeg?auto=compress&cs=tinysrgb&w=400',
    href: '/shop?category=womens',
    modifier: '',
  },
  {
    title: "Men's Essentials",
    sub: 'Daily Wear',
    descr: 'Smart casual & formal looks',
    img: 'https://images.unsplash.com/photo-1556136412-3813d7367e4b?w=400&q=80&auto=format&fit=crop',
    href: '/shop?category=mens',
    modifier: 'ul-sub-banner--2',
  },
  {
    title: "Weekend & Outings",
    sub: 'Night Out',
    descr: 'Dresses & jumpsuits for special moments',
    img: 'https://images.pexels.com/photos/6192463/pexels-photo-6192463.jpeg?auto=compress&cs=tinysrgb&w=400',
    href: '/shop?category=outings',
    modifier: 'ul-sub-banner--3',
  },
];

export default function SubBanners() {
  return (
    <div className="ul-container">
      <section className="ul-sub-banners">
        <div className="ul-inner-container">
          <div className="row ul-bs-row row-cols-md-3 row-cols-sm-2 row-cols-1">
            {banners.map((b, i) => (
              <div className="col" key={i}>
                <div className={`ul-sub-banner ${b.modifier}`}>
                  <div className="ul-sub-banner-txt">
                    <div className="top">
                      <span className="ul-ad-sub-title">{b.sub}</span>
                      <h3 className="ul-sub-banner-title">{b.title}</h3>
                      <p className="ul-sub-banner-descr">{b.descr}</p>
                    </div>
                    <div className="bottom">
                      <Link href={b.href} className="ul-sub-banner-btn">
                        Collective <i className="flaticon-up-right-arrow"></i>
                      </Link>
                    </div>
                  </div>
                  <div className="ul-sub-banner-img">
                    <Image src={b.img} alt={b.title} width={200} height={280} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
