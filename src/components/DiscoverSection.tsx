import Link from 'next/link';

const points = [
  {
    icon: 'flaticon-check-mark',
    title: 'Quality fabrics',
    text: 'Thoughtfully chosen materials that look good and last.',
  },
  {
    icon: 'flaticon-star',
    title: 'Modern fits',
    text: 'Cuts designed for how you actually move and work.',
  },
  {
    icon: 'flaticon-heart',
    title: 'Wear anywhere',
    text: 'From office to weekend — one wardrobe, every moment.',
  },
];

export default function DiscoverSection() {
  return (
    <section className="ul-discover">
      <div className="ul-container">
        <div className="ul-discover-inner">
          <div className="ul-discover-heading">
            <span className="ul-discover-label">Why Ayekwa Collective</span>
            <h2 className="ul-discover-title">Clothing for work, life & every moment</h2>
            <p className="ul-discover-sub">
              Pieces you can rely on — quality fabrics, modern fits, and styles that work from Monday to Sunday.
            </p>
            <Link href="/shop" className="ul-btn ul-discover-cta">
              Shop the collection <i className="flaticon-up-right-arrow" />
            </Link>
          </div>
          <ul className="ul-discover-list">
            {points.map((item, i) => (
              <li key={i} className="ul-discover-item">
                <span className="ul-discover-icon">
                  <i className={item.icon} />
                </span>
                <div>
                  <h3 className="ul-discover-item-title">{item.title}</h3>
                  <p className="ul-discover-item-text">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
