import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | MA Collection',
  description: 'Learn about MA Collection — real, wearable fashion for every moment.',
};

export default function AboutPage() {
  return (
    <main>
      {/* BREADCRUMB */}
      <div className="ul-container">
        <div className="ul-breadcrumb">
          <h2 className="ul-breadcrumb-title">About us</h2>
          <div className="ul-breadcrumb-nav">
            <Link href="/"><i className="flaticon-home"></i> Home</Link>
            <i className="flaticon-arrow-point-to-right"></i>
            <span className="current-page">About us</span>
          </div>
        </div>
      </div>

      {/* COVER IMAGE — clothing rack, no humans */}
      <div className="ul-container">
        <div className="ul-about-cover-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.pexels.com/photos/5698854/pexels-photo-5698854.jpeg?auto=compress&cs=tinysrgb&w=1400"
            alt="MA Collection clothing"
          />
        </div>
      </div>

      {/* ABOUT SECTION 1 — text left, image right */}
      <div className="ul-inner-page-container my-0">
        <section className="ul-about">
          <div className="row row-cols-md-2 row-cols-1 align-items-center ul-bs-row">
            <div className="col">
              <div className="ul-about-txt">
                <span className="ul-section-sub-title">About us</span>
                <h2 className="ul-section-title">We are MA Collection</h2>
                <p>
                  MA Collection was founded with a simple belief: every woman deserves clothes that actually fit
                  her life — not just her body, but her day. Whether that&apos;s a meeting, a market run, a
                  weekend outing, or a quiet evening dinner, we have something for every moment.
                </p>
                <p>
                  We design and source quality pieces — workwear, casuals, and occasion wear — that are made to
                  last, easy to style and priced for real people. Our talented stylists have put together outfits
                  that are perfect for every season with a wide variety of ways to inspire your next
                  fashion-forward look.
                </p>
              </div>
            </div>
            <div className="col">
              <div className="ul-about-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="MA Collection clothing styles"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ABOUT SECTION 2 — image left, text right */}
      <div className="ul-inner-page-container my-0">
        <section className="ul-about">
          <div className="row row-cols-md-2 row-cols-1 align-items-center ul-bs-row">
            <div className="col">
              <div className="ul-about-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Our clothing collection"
                />
              </div>
            </div>
            <div className="col">
              <div className="ul-about-txt">
                <span className="ul-section-sub-title">Our history</span>
                <h2 className="ul-section-title">Established — 2010</h2>
                <p>
                  What started as a small boutique has grown into a full fashion destination trusted by thousands
                  of customers. Over the years we have built our name on quality fabrics, honest pricing, and
                  styles that hold up to real daily life. We are proud of where we started and excited about
                  where we are going.
                </p>
                <p>
                  From our first collection of everyday basics to our now-expansive range of workwear, casual,
                  and occasion wear, MA Collection has always put the customer first. We listen, we evolve, and
                  we deliver clothes that make people feel confident every single day.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* MORE ABOUT US */}
      <div className="ul-inner-page-container mb-0">
        <div className="ul-more-about">
          <div className="ul-more-about-heading">
            <h2 className="ul-section-title">Quality is our priority</h2>
            <p className="ul-more-about-heading-descr">
              Our talented stylists have put together outfits that are perfect for the season. They have a wide
              variety of ways to inspire your next fashion-forward look.
            </p>
          </div>
          <div className="row row-cols-lg-3 row-cols-sm-2 row-cols-1 ul-more-about-row">
            <div className="col">
              <div className="ul-more-about-point">
                <h3 className="ul-more-about-point-title">Trending Design</h3>
                <p className="ul-more-about-point-descr">
                  We stay ahead of the curve so you do not have to. Every new arrival is curated with current
                  trends and timeless wearability in mind — styles that work today and next season.
                </p>
              </div>
            </div>
            <div className="col">
              <div className="ul-more-about-point">
                <h3 className="ul-more-about-point-title">Multiple Sizes</h3>
                <p className="ul-more-about-point-descr">
                  We believe great style has no size limit. Our range covers XS through 3XL so every body can
                  find their perfect fit and wear it with total confidence.
                </p>
              </div>
            </div>
            <div className="col">
              <div className="ul-more-about-point">
                <h3 className="ul-more-about-point-title">High Quality Matters</h3>
                <p className="ul-more-about-point-descr">
                  Every piece is selected for durability, comfort and wearability — clothes that hold up to real
                  life, not just a photoshoot. Quality you can genuinely feel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
