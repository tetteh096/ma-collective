import path from 'node:path';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

config({ path: path.join(process.cwd(), '.env') });
config({ path: path.join(process.cwd(), '.env.local'), override: true });

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('🌱 Seeding database...');

  // ── Categories ──────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'womens' },
      update: {},
      create: {
        name: "Women's Fashion",
        slug: 'womens',
        description: 'Dresses, skirts, blouses and more for women',
        imageUrl: 'https://images.pexels.com/photos/7783418/pexels-photo-7783418.jpeg?auto=compress&cs=tinysrgb&w=600',
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'mens' },
      update: {},
      create: {
        name: "Men's Fashion",
        slug: 'mens',
        description: 'Shirts, boubous, blazers and more for men',
        imageUrl: 'https://images.pexels.com/photos/8689028/pexels-photo-8689028.jpeg?auto=compress&cs=tinysrgb&w=600',
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'kids' },
      update: {},
      create: {
        name: "Kids' Fashion",
        slug: 'kids',
        description: 'Stylish and comfortable clothing for children',
        imageUrl: 'https://images.pexels.com/photos/8100787/pexels-photo-8100787.jpeg?auto=compress&cs=tinysrgb&w=600',
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'jewellery' },
      update: {},
      create: {
        name: 'Jewellery',
        slug: 'jewellery',
        description: 'Handcrafted African beads, necklaces and accessories',
        imageUrl: 'https://images.pexels.com/photos/8100787/pexels-photo-8100787.jpeg?auto=compress&cs=tinysrgb&w=600',
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'kente-ankara' },
      update: {},
      create: {
        name: 'Kente & Ankara',
        slug: 'kente-ankara',
        description: 'Premium Kente cloth and Ankara print collections',
        imageUrl: 'https://images.pexels.com/photos/7764596/pexels-photo-7764596.jpeg?auto=compress&cs=tinysrgb&w=600',
        sortOrder: 5,
      },
    }),
  ]);
  console.log(`✅ ${categories.length} categories seeded`);

  // ── Products ─────────────────────────────────────────────────────────────────
  const products = [
    {
      name: 'Ankara Wrap Dress',
      slug: 'ankara-wrap-dress',
      description: 'A stunning Ankara wrap dress featuring vibrant African prints. Perfect for both casual and formal occasions. Made from premium 100% cotton wax print fabric.',
      costPrice: 265.00,
      sellingPrice: 441.75,
      originalPrice: 588.00,
      category: 'womens',
      brand: 'AFI Originals',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Blue/Orange', 'Green/Yellow', 'Red/Black'],
      tags: ['ankara', 'dress', 'wax-print', 'womens'],
      imageUrl: 'https://images.pexels.com/photos/7783418/pexels-photo-7783418.jpeg?auto=compress&cs=tinysrgb&w=600',
      gallery: [
        'https://images.pexels.com/photos/7783418/pexels-photo-7783418.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/7764596/pexels-photo-7764596.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      inStock: true,
      stockQty: 25,
      isFeatured: true,
      isOnSale: true,
      isNewArrival: false,
      rating: 4.8,
      reviewsCount: 124,
    },
    {
      name: 'Kente Shirt (Men)',
      slug: 'kente-shirt-mens',
      description: 'Authentic Kente-inspired shirt for men. Features a slim fit with traditional Ghanaian geometric patterns woven into premium fabric.',
      costPrice: 204.00,
      sellingPrice: 341.00,
      originalPrice: 427.00,
      category: 'mens',
      brand: 'AFI Originals',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Gold/Green', 'Blue/Gold', 'Red/Gold'],
      tags: ['kente', 'shirt', 'mens'],
      imageUrl: 'https://images.pexels.com/photos/8689028/pexels-photo-8689028.jpeg?auto=compress&cs=tinysrgb&w=600',
      gallery: [
        'https://images.pexels.com/photos/8689028/pexels-photo-8689028.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      inStock: true,
      stockQty: 18,
      isFeatured: true,
      isOnSale: true,
      isNewArrival: false,
      rating: 4.7,
      reviewsCount: 89,
    },
    {
      name: 'Wax Print Skirt',
      slug: 'wax-print-skirt',
      description: 'Beautiful wax print A-line skirt with a modern cut. Pairs perfectly with solid-colored blouses or crop tops.',
      costPrice: 181.00,
      sellingPrice: 302.25,
      originalPrice: 403.00,
      category: 'womens',
      brand: 'AFI Originals',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Multi-color'],
      tags: ['wax-print', 'skirt', 'womens'],
      imageUrl: 'https://images.pexels.com/photos/7764576/pexels-photo-7764576.jpeg?auto=compress&cs=tinysrgb&w=600',
      gallery: [
        'https://images.pexels.com/photos/7764576/pexels-photo-7764576.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      inStock: true,
      stockQty: 30,
      isFeatured: false,
      isOnSale: true,
      isNewArrival: false,
      rating: 4.6,
      reviewsCount: 67,
    },
    {
      name: 'Dashiki Boubou',
      slug: 'dashiki-boubou',
      description: 'Traditional Dashiki Boubou with intricate embroidery. A classic West African garment elevated with modern tailoring.',
      costPrice: 325.00,
      sellingPrice: 542.50,
      originalPrice: 697.00,
      category: 'mens',
      brand: 'AFI Heritage',
      sizes: ['M', 'L', 'XL', 'XXL', '3XL'],
      colors: ['White', 'Navy', 'Green', 'Burgundy'],
      tags: ['dashiki', 'boubou', 'mens', 'traditional'],
      imageUrl: 'https://images.pexels.com/photos/7764578/pexels-photo-7764578.jpeg?auto=compress&cs=tinysrgb&w=600',
      gallery: [
        'https://images.pexels.com/photos/7764578/pexels-photo-7764578.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      inStock: true,
      stockQty: 12,
      isFeatured: true,
      isOnSale: true,
      isNewArrival: false,
      rating: 4.9,
      reviewsCount: 203,
    },
    {
      name: 'African Print Coat',
      slug: 'african-print-coat',
      description: 'A bold, fashion-forward African print coat that makes a statement. Ideal for cool Harmattan evenings.',
      costPrice: 510.00,
      sellingPrice: 852.50,
      originalPrice: 1085.00,
      category: 'womens',
      brand: 'AFI Originals',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Blue/Yellow', 'Red/Black'],
      tags: ['coat', 'african-print', 'womens'],
      imageUrl: 'https://images.pexels.com/photos/9558566/pexels-photo-9558566.jpeg?auto=compress&cs=tinysrgb&w=600',
      gallery: [
        'https://images.pexels.com/photos/9558566/pexels-photo-9558566.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      inStock: true,
      stockQty: 8,
      isFeatured: true,
      isOnSale: true,
      isNewArrival: true,
      rating: 4.8,
      reviewsCount: 56,
    },
    {
      name: 'Smock Shirt (Northern)',
      slug: 'smock-shirt-northern',
      description: 'Authentic handwoven smock shirt from Northern Ghana. Each piece is unique and produced by skilled artisans.',
      costPrice: 167.00,
      sellingPrice: 279.00,
      originalPrice: 355.00,
      category: 'mens',
      brand: 'AFI Heritage',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black/White', 'Multi-strip'],
      tags: ['smock', 'northern', 'handwoven', 'mens'],
      imageUrl: 'https://images.pexels.com/photos/8689043/pexels-photo-8689043.jpeg?auto=compress&cs=tinysrgb&w=600',
      gallery: [
        'https://images.pexels.com/photos/8689043/pexels-photo-8689043.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      inStock: true,
      stockQty: 20,
      isFeatured: false,
      isOnSale: true,
      isNewArrival: false,
      rating: 4.7,
      reviewsCount: 144,
    },
    {
      name: 'Batakari Dress',
      slug: 'batakari-dress',
      description: 'Feminine Batakari-style dress with traditional strip-woven fabric reimagined into a modern silhouette.',
      costPrice: 297.00,
      sellingPrice: 496.00,
      originalPrice: 620.00,
      category: 'womens',
      brand: 'AFI Heritage',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Earth tones'],
      tags: ['batakari', 'dress', 'traditional', 'womens'],
      imageUrl: 'https://images.pexels.com/photos/7764586/pexels-photo-7764586.jpeg?auto=compress&cs=tinysrgb&w=600',
      gallery: [
        'https://images.pexels.com/photos/7764586/pexels-photo-7764586.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      inStock: true,
      stockQty: 15,
      isFeatured: false,
      isOnSale: true,
      isNewArrival: true,
      rating: 4.5,
      reviewsCount: 78,
    },
    {
      name: 'Tie-Dye Jumpsuit',
      slug: 'tie-dye-jumpsuit',
      description: 'Stylish tie-dye jumpsuit made using traditional Ghanaian dyeing techniques. Wide-leg fit for maximum comfort.',
      costPrice: 418.00,
      sellingPrice: 697.50,
      originalPrice: 875.00,
      category: 'womens',
      brand: 'AFI Originals',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Indigo/Blue', 'Terracotta', 'Forest Green'],
      tags: ['tie-dye', 'jumpsuit', 'womens'],
      imageUrl: 'https://images.pexels.com/photos/7764590/pexels-photo-7764590.jpeg?auto=compress&cs=tinysrgb&w=600',
      gallery: [
        'https://images.pexels.com/photos/7764590/pexels-photo-7764590.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      inStock: true,
      stockQty: 10,
      isFeatured: true,
      isOnSale: true,
      isNewArrival: true,
      rating: 4.6,
      reviewsCount: 93,
    },
    {
      name: 'Ankara Maxi Dress',
      slug: 'ankara-maxi-dress',
      description: 'Flowy Ankara maxi dress with bold print patterns. Ideal for special occasions, weddings and cultural events.',
      costPrice: 353.00,
      sellingPrice: 589.00,
      originalPrice: 785.00,
      category: 'womens',
      brand: 'AFI Originals',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Royal Blue', 'Burgundy/Gold'],
      tags: ['ankara', 'maxi-dress', 'womens', 'special-occasion'],
      imageUrl: 'https://images.pexels.com/photos/7783423/pexels-photo-7783423.jpeg?auto=compress&cs=tinysrgb&w=600',
      gallery: [
        'https://images.pexels.com/photos/7783423/pexels-photo-7783423.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      inStock: true,
      stockQty: 22,
      isFeatured: true,
      isOnSale: true,
      isNewArrival: false,
      rating: 4.9,
      reviewsCount: 189,
    },
    {
      name: 'Wax Print Blazer',
      slug: 'wax-print-blazer',
      description: 'Sharp Wax Print blazer for the modern African gentleman. Single-button closure with notched lapels.',
      costPrice: 558.00,
      sellingPrice: 930.00,
      originalPrice: 1240.00,
      category: 'mens',
      brand: 'AFI Originals',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Blue/Orange', 'Green/Yellow'],
      tags: ['blazer', 'wax-print', 'mens'],
      imageUrl: 'https://images.pexels.com/photos/7764593/pexels-photo-7764593.jpeg?auto=compress&cs=tinysrgb&w=600',
      gallery: [
        'https://images.pexels.com/photos/7764593/pexels-photo-7764593.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      inStock: true,
      stockQty: 7,
      isFeatured: true,
      isOnSale: true,
      isNewArrival: true,
      rating: 4.7,
      reviewsCount: 45,
    },
    {
      name: 'African Bead Necklace',
      slug: 'african-bead-necklace',
      description: 'Handcrafted African bead necklace made with authentic Krobo glass beads. Each piece is unique and one-of-a-kind.',
      costPrice: 111.00,
      sellingPrice: 186.00,
      originalPrice: 248.00,
      category: 'jewellery',
      brand: 'AFI Crafts',
      sizes: ['One Size'],
      colors: ['Multi-color', 'Red/Gold', 'Blue/Silver'],
      tags: ['necklace', 'beads', 'krobo', 'jewellery', 'handcrafted'],
      imageUrl: 'https://images.pexels.com/photos/8100787/pexels-photo-8100787.jpeg?auto=compress&cs=tinysrgb&w=600',
      gallery: [
        'https://images.pexels.com/photos/8100787/pexels-photo-8100787.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      inStock: true,
      stockQty: 50,
      isFeatured: false,
      isOnSale: true,
      isNewArrival: true,
      rating: 4.8,
      reviewsCount: 212,
    },
    {
      name: 'Batakari Hoodie',
      slug: 'batakari-hoodie',
      description: 'A modern fusion hoodie blending traditional Batakari strip-weave fabric with contemporary streetwear styling.',
      costPrice: 390.00,
      sellingPrice: 651.00,
      originalPrice: 868.00,
      category: 'mens',
      brand: 'AFI Originals',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Earth tones', 'Black/Multi'],
      tags: ['hoodie', 'batakari', 'streetwear', 'mens'],
      imageUrl: 'https://images.pexels.com/photos/8689050/pexels-photo-8689050.jpeg?auto=compress&cs=tinysrgb&w=600',
      gallery: [
        'https://images.pexels.com/photos/8689050/pexels-photo-8689050.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
      inStock: true,
      stockQty: 14,
      isFeatured: false,
      isOnSale: true,
      isNewArrival: true,
      rating: 4.6,
      reviewsCount: 67,
    },
  ];

  let seeded = 0;
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p as any,
    });
    seeded++;
    process.stdout.write(`  ↳ ${p.name}\n`);
  }
  console.log(`✅ ${seeded} products seeded`);

  // ── Announcements (top bar) ───────────────────────────────────────────────────
  const announcementCount = await prisma.announcement.count();
  if (announcementCount === 0) {
    await prisma.announcement.createMany({
      data: [
        { message: 'Free delivery within Accra on orders over GH₵500', sortOrder: 0, isActive: true },
        { message: 'Work outfits, casual looks, and everything in between', sortOrder: 1, isActive: true },
        { message: 'Quality clothes for real life, designed for women', sortOrder: 2, isActive: true },
        { message: 'Easy returns within 7 days of delivery', sortOrder: 3, isActive: true },
        { message: 'Pay securely with Mobile Money or Card', sortOrder: 4, isActive: true },
      ],
    });
    console.log('✅ 5 announcements seeded');
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
