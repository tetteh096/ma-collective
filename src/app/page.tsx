import Banner from '@/components/Banner';
import DiscoverSection from '@/components/DiscoverSection';
import ProductsSection from '@/components/ProductsSection';
import AdSection from '@/components/AdSection';
import MostSelling from '@/components/MostSelling';
import FlashSale from '@/components/FlashSale';
import Reviews from '@/components/Reviews';
import Newsletter from '@/components/Newsletter';
import Gallery from '@/components/Gallery';
import ScriptsLoader from '@/components/ScriptsLoader';
import ScrollReveal from '@/components/ScrollReveal';
import { getFeaturedProducts, getTopDiscountProducts, getNewArrivals } from '@/lib/api';

export default async function Home() {
  const [featuredProducts, topDiscountProducts, newArrivals] = await Promise.all([
    getFeaturedProducts(12).catch(() => []),
    getTopDiscountProducts(3).catch(() => []),
    getNewArrivals(3).catch(() => []),
  ]);

  return (
    <>
      <main>
        <Banner />

        <ScrollReveal direction="up" delay={0}>
          <DiscoverSection />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0}>
          <ProductsSection products={featuredProducts} />
        </ScrollReveal>

        <ScrollReveal direction="fade" delay={0}>
          <AdSection />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0}>
          <MostSelling products={topDiscountProducts} />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0}>
          <FlashSale products={newArrivals} />
        </ScrollReveal>

        <ScrollReveal direction="fade" delay={0}>
          <Reviews />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0}>
          <Newsletter />
        </ScrollReveal>

        <ScrollReveal direction="fade" delay={0}>
          <Gallery />
        </ScrollReveal>
      </main>
      <ScriptsLoader />
    </>
  );
}
