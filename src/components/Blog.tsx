import Image from 'next/image';
import Link from 'next/link';

const posts = [
  {
    img: 'https://images.pexels.com/photos/34232728/pexels-photo-34232728.jpeg?auto=compress&cs=tinysrgb&w=800',
    day: '10',
    month: 'Feb',
    title: '5 Ways to Style Kente for Modern Occasions',
    excerpt: 'Kente cloth is not just for ceremonies — here are five modern ways to incorporate it into your everyday wardrobe.',
    href: '/blog/style-kente-modern',
  },
  {
    img: 'https://images.pexels.com/photos/10919897/pexels-photo-10919897.jpeg?auto=compress&cs=tinysrgb&w=800',
    day: '18',
    month: 'Feb',
    title: 'Top Ankara Trends in Ghana for 2026',
    excerpt: 'From bold prints to subtle patterns, Ankara fashion is evolving fast. See what\'s trending in Ghanaian fashion this year.',
    href: '/blog/ankara-trends-2026',
  },
  {
    img: 'https://images.pexels.com/photos/6192463/pexels-photo-6192463.jpeg?auto=compress&cs=tinysrgb&w=800',
    day: '25',
    month: 'Feb',
    title: 'How to Care for Your African Print Fabrics',
    excerpt: 'Your wax prints and cotton fabrics last longer with the right care. Follow these tips to keep them vibrant.',
    href: '/blog/care-for-african-prints',
  },
];

export default function Blog() {
  return (
    <div className="ul-container">
      <section className="ul-blogs">
        <div className="ul-inner-container">
          <div className="ul-section-heading">
            <div className="left">
              <span className="ul-section-sub-title">News &amp; Blog</span>
              <h2 className="ul-section-title">Latest Fashion News &amp; Tips</h2>
            </div>
            <div>
              <Link href="/blog" className="ul-blogs-heading-btn">
                View All Posts <i className="flaticon-up-right-arrow"></i>
              </Link>
            </div>
          </div>

          <div className="row ul-bs-row row-cols-md-3 row-cols-2 row-cols-xxs-1">
            {posts.map((post, i) => (
              <div className="col" key={i}>
                <div className="ul-blog">
                  <div className="ul-blog-img">
                    <Image src={post.img} alt={post.title} width={400} height={260} style={{ objectFit: 'cover', width: '100%' }} />
                    <div className="date">
                      <span className="number">{post.day}</span>
                      <span className="txt">{post.month}</span>
                    </div>
                  </div>
                  <div className="ul-blog-txt">
                    <div className="ul-blog-infos flex gap-x-[30px] mb-[16px]">
                      <div className="ul-blog-info">
                        <span className="icon"><i className="flaticon-user-2"></i></span>
                        <span className="text font-normal text-[14px] text-etGray">By Admin</span>
                      </div>
                    </div>
                    <h3 className="ul-blog-title">
                      <Link href={post.href}>{post.title}</Link>
                    </h3>
                    <p className="ul-blog-descr">{post.excerpt}</p>
                    <Link href={post.href} className="ul-blog-btn">
                      Read More <span className="icon"><i className="flaticon-up-right-arrow"></i></span>
                    </Link>
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
