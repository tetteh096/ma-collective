import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services | MA Collective',
  description: 'Retail and wholesale fashion services. Quality clothing for work, casual and occasion wear across Ghana.',
};

export default function ServicesPage() {
  return (
    <main>
      {/* BREADCRUMB */}
      <div className="ul-container">
        <div className="ul-breadcrumb">
          <h2 className="ul-breadcrumb-title">Services</h2>
          <div className="ul-breadcrumb-nav">
            <Link href="/"><i className="flaticon-home"></i> Home</Link>
            <i className="flaticon-arrow-point-to-right"></i>
            <span className="current-page">Services</span>
          </div>
        </div>
      </div>

      {/* COVER IMAGE — clothing display, no humans */}
      <div className="ul-container">
        <div className="ul-about-cover-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.pexels.com/photos/3735641/pexels-photo-3735641.jpeg?auto=compress&cs=tinysrgb&w=1400"
            alt="MA Collective clothing display"
          />
        </div>
      </div>

      {/* WHY WE DO WHAT WE DO */}
      <div className="ul-inner-page-container my-0">
        <section className="ul-about">
          <div className="row row-cols-md-2 row-cols-1 align-items-center ul-bs-row">
            <div className="col">
              <div className="ul-about-txt">
                <span className="ul-section-sub-title">Services</span>
                <h2 className="ul-section-title">Why MA Collective</h2>
                <p>
                  MA Collective was founded with a simple belief: every woman deserves clothes that actually fit
                  her life, not just her body, but her day. Whether that&apos;s a meeting, a market run, a
                  weekend outing, or a quiet evening dinner, we have something for every moment.
                </p>
                <p>
                  We design and source quality pieces: workwear, casuals, and occasion wear that are made to
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
                  src="https://images.pexels.com/photos/6192463/pexels-photo-6192463.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="MA Collective fashion"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* OUR SERVICES: RETAIL & WHOLESALE */}
      <div className="ul-inner-page-container my-0">
        <section className="ul-about">
          <div className="row row-cols-md-2 row-cols-1 align-items-center ul-bs-row">
            <div className="col">
              <div className="ul-about-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.pexels.com/photos/1661443/pexels-photo-1661443.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="MA Collective store"
                />
              </div>
            </div>
            <div className="col">
              <div className="ul-about-txt">
                <span className="ul-section-sub-title">What we offer</span>
                <h2 className="ul-section-title">Retail and wholesale services</h2>
                <p>
                  We serve individual customers and businesses across Ghana. Our retail store and online shop
                  offer the same quality and care: curated workwear, casual and occasion wear, with clear pricing
                  and reliable delivery in Accra, Kumasi, Tamale and beyond.
                </p>
                <p>
                  For retailers and organisations we provide wholesale and bulk options. We work openly with
                  clear terms, professional communication and consistent quality so you can stock or gift with
                  confidence. Get in touch to discuss your needs.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* QUALITY & OFFER */}
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
                <h3 className="ul-more-about-point-title">Trending design</h3>
                <p className="ul-more-about-point-descr">
                  We stay ahead of the curve so you do not have to. Every new arrival is curated with current
                  trends and timeless wearability in mind: styles that work today and next season.
                </p>
              </div>
            </div>
            <div className="col">
              <div className="ul-more-about-point">
                <h3 className="ul-more-about-point-title">Multiple sizes</h3>
                <p className="ul-more-about-point-descr">
                  We believe great style has no size limit. Our range covers XS through 3XL so every body can
                  find their perfect fit and wear it with total confidence.
                </p>
              </div>
            </div>
            <div className="col">
              <div className="ul-more-about-point">
                <h3 className="ul-more-about-point-title">High quality matters</h3>
                <p className="ul-more-about-point-descr">
                  Every piece is selected for durability, comfort and wearability: clothes that hold up to real
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
