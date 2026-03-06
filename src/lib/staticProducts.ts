// Shared static product data for fallback when EverShop API is offline

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number; // GHS
  originalPrice?: number; // GHS
  image: string;
  category: string;
  badge?: string;
  rating: number;
  reviews: number;
  description: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  images: string[];
}

export const STATIC_PRODUCTS: Product[] = [
  {
    id: '1', slug: 'ankara-wrap-dress',
    name: 'Ankara Wrap Dress', price: 441.75, originalPrice: 588, category: 'womens',
    badge: '25% Off',
    image: 'https://images.pexels.com/photos/7783418/pexels-photo-7783418.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/7783418/pexels-photo-7783418.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7764596/pexels-photo-7764596.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    rating: 4.8, reviews: 124,
    description: 'A stunning Ankara wrap dress featuring vibrant African prints. Perfect for both casual and formal occasions. Made from premium 100% cotton wax print fabric.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Blue/Orange', 'Green/Yellow', 'Red/Black'], inStock: true,
  },
  {
    id: '2', slug: 'kente-shirt-mens',
    name: 'Kente Shirt (Men)', price: 341.00, originalPrice: 427, category: 'mens',
    badge: '20% Off',
    image: 'https://images.pexels.com/photos/8689028/pexels-photo-8689028.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/8689028/pexels-photo-8689028.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    rating: 4.7, reviews: 89,
    description: 'Authentic Kente-inspired shirt for men. Features a slim fit with traditional Ghanaian geometric patterns woven into premium fabric.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Gold/Green', 'Blue/Gold', 'Red/Gold'], inStock: true,
  },
  {
    id: '3', slug: 'wax-print-skirt',
    name: 'Wax Print Skirt', price: 302.25, originalPrice: 403, category: 'womens',
    badge: '25% Off',
    image: 'https://images.pexels.com/photos/7764576/pexels-photo-7764576.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/7764576/pexels-photo-7764576.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    rating: 4.6, reviews: 67,
    description: 'Beautiful wax print A-line skirt with a modern cut. Pairs perfectly with solid-colored blouses or crop tops.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Multi-color'], inStock: true,
  },
  {
    id: '4', slug: 'dashiki-boubou',
    name: 'Dashiki Boubou', price: 542.50, originalPrice: 697, category: 'mens',
    badge: '22% Off',
    image: 'https://images.pexels.com/photos/7764578/pexels-photo-7764578.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/7764578/pexels-photo-7764578.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    rating: 4.9, reviews: 203,
    description: 'Traditional Dashiki Boubou with intricate embroidery. A classic West African garment elevated with modern tailoring.',
    sizes: ['M', 'L', 'XL', 'XXL', '3XL'], colors: ['White', 'Navy', 'Green', 'Burgundy'], inStock: true,
  },
  {
    id: '5', slug: 'african-print-coat',
    name: 'African Print Coat', price: 852.50, originalPrice: 1085, category: 'womens',
    badge: '21% Off',
    image: 'https://images.pexels.com/photos/9558566/pexels-photo-9558566.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/9558566/pexels-photo-9558566.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    rating: 4.8, reviews: 56,
    description: 'A bold, fashion-forward African print coat that makes a statement. Ideal for cool Harmattan evenings.',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Blue/Yellow', 'Red/Black'], inStock: true,
  },
  {
    id: '6', slug: 'smock-shirt-northern',
    name: 'Smock Shirt (Northern)', price: 279.00, originalPrice: 355, category: 'mens',
    badge: '21% Off',
    image: 'https://images.pexels.com/photos/8689043/pexels-photo-8689043.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/8689043/pexels-photo-8689043.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    rating: 4.7, reviews: 144,
    description: 'Authentic handwoven smock shirt from Northern Ghana. Each piece is unique and produced by skilled artisans.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Black/White', 'Multi-strip'], inStock: true,
  },
  {
    id: '7', slug: 'batakari-dress',
    name: 'Batakari Dress', price: 496.00, originalPrice: 620, category: 'womens',
    badge: '20% Off',
    image: 'https://images.pexels.com/photos/7764586/pexels-photo-7764586.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/7764586/pexels-photo-7764586.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    rating: 4.5, reviews: 78,
    description: 'Feminine Batakari-style dress with traditional strip-woven fabric reimagined into a modern silhouette.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Earth tones'], inStock: true,
  },
  {
    id: '8', slug: 'tie-dye-jumpsuit',
    name: 'Tie-Dye Jumpsuit', price: 697.50, originalPrice: 875, category: 'womens',
    badge: '20% Off',
    image: 'https://images.pexels.com/photos/7764590/pexels-photo-7764590.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/7764590/pexels-photo-7764590.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    rating: 4.6, reviews: 93,
    description: 'Stylish tie-dye jumpsuit made using traditional Ghanaian dyeing techniques. Wide-leg fit for maximum comfort.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Indigo/Blue', 'Terracotta', 'Forest Green'], inStock: true,
  },
  {
    id: '9', slug: 'ankara-maxi-dress',
    name: 'Ankara Maxi Dress', price: 589.00, originalPrice: 785, category: 'womens',
    badge: '25% Off',
    image: 'https://images.pexels.com/photos/7783423/pexels-photo-7783423.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/7783423/pexels-photo-7783423.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    rating: 4.9, reviews: 189,
    description: 'Flowy Ankara maxi dress with bold print patterns. Ideal for special occasions, weddings and cultural events.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Royal Blue', 'Burgundy/Gold'], inStock: true,
  },
  {
    id: '10', slug: 'wax-print-blazer',
    name: 'Wax Print Blazer', price: 930.00, originalPrice: 1240, category: 'mens',
    badge: '25% Off',
    image: 'https://images.pexels.com/photos/7764593/pexels-photo-7764593.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/7764593/pexels-photo-7764593.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    rating: 4.7, reviews: 45,
    description: 'Sharp Wax Print blazer for the modern African gentleman. Single-button closure with notched lapels.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Blue/Orange', 'Green/Yellow'], inStock: true,
  },
  {
    id: '11', slug: 'african-bead-necklace',
    name: 'African Bead Necklace', price: 186.00, originalPrice: 248, category: 'jewellery',
    badge: '25% Off',
    image: 'https://images.pexels.com/photos/8100787/pexels-photo-8100787.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/8100787/pexels-photo-8100787.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    rating: 4.8, reviews: 212,
    description: 'Handcrafted African bead necklace made with authentic Krobo glass beads. Each piece is unique and one-of-a-kind.',
    sizes: ['One Size'], colors: ['Multi-color', 'Red/Gold', 'Blue/Silver'], inStock: true,
  },
  {
    id: '12', slug: 'batakari-hoodie',
    name: 'Batakari Hoodie', price: 651.00, originalPrice: 868, category: 'mens',
    badge: '25% Off',
    image: 'https://images.pexels.com/photos/8689050/pexels-photo-8689050.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/8689050/pexels-photo-8689050.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    rating: 4.6, reviews: 67,
    description: 'A modern fusion hoodie blending traditional Batakari strip-weave fabric with contemporary streetwear styling.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Earth tones', 'Black/Multi'], inStock: true,
  },
];

export const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'womens', label: "Women's Fashion" },
  { id: 'mens', label: "Men's Fashion" },
  { id: 'kids', label: "Kids' Fashion" },
  { id: 'jewellery', label: 'Jewellery' },
  { id: 'kente-ankara', label: 'Kente & Ankara' },
];
