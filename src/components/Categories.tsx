import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/lib/api';

const FALLBACK_CATEGORIES = [
  { name: 'Men',     img: 'https://images.pexels.com/photos/2922301/pexels-photo-2922301.jpeg?auto=compress&cs=tinysrgb&h=350&fit=crop', href: '/shop?category=men' },
  { name: 'Women',   img: 'https://images.pexels.com/photos/871495/pexels-photo-871495.jpeg?auto=compress&cs=tinysrgb&h=350&fit=crop', href: '/shop?category=women' },
  { name: 'Casual',  img: 'https://images.unsplash.com/photo-1556452576-3e2d58536f62?w=300&h=350&q=80&auto=format&fit=crop', href: '/shop?category=casual' },
  { name: 'Outings', img: 'https://images.pexels.com/photos/34232728/pexels-photo-34232728.jpeg?auto=compress&cs=tinysrgb&h=350&fit=crop', href: '/shop?category=outings' },
];

/** Slugs we don't sell yet — hide from categories. */
const HIDDEN_CATEGORY_SLUGS = new Set(['kids', 'workwear', 'shoes', 'accessories', 'jewelry', 'jewellery']);

const FALLBACK_IMG = 'https://images.pexels.com/photos/34232728/pexels-photo-34232728.jpeg?auto=compress&cs=tinysrgb&h=350&fit=crop';

interface CategoriesProps {
  categories?: Category[];
}

export default function Categories({ categories }: CategoriesProps) {
  const items =
    categories && categories.length > 0
      ? categories
          .filter((c) => !HIDDEN_CATEGORY_SLUGS.has((c.slug || '').toLowerCase()))
          .map((c) => ({
            name: c.name,
            img: c.imageUrl || FALLBACK_IMG,
            href: `/shop?category=${c.slug}`,
          }))
      : FALLBACK_CATEGORIES;

  return (
    <div className="ul-container">
      <section className="ul-categories">
        <div className="ul-inner-container">
          <div className="ul-categories-grid">
            {items.map((cat, i) => (
              <Link className="ul-category" href={cat.href} key={i}>
                <div className="ul-category-img">
                  <Image
                    src={cat.img}
                    alt={cat.name}
                    width={280}
                    height={280}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </div>
                <span className="ul-category-txt">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
