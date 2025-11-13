/**
 * Main Restaurant Homepage
 * Features hero section, product grid with search, and cart functionality
 */

import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { CartSidebar } from '@/components/CartSidebar';
import { Product } from '@/lib/cart';

// Import product images
import heroImage from '@/assets/hero-restaurant.jpg';
import shawarmaImg from '@/assets/product-shawarma.jpg';
import falafelImg from '@/assets/product-falafel.jpg';
import grillImg from '@/assets/product-grill.jpg';
import saladImg from '@/assets/product-salad.jpg';
import baklavaImg from '@/assets/product-baklava.jpg';
import friesImg from '@/assets/product-fries.jpg';

// Product catalog
const PRODUCTS: Product[] = [
  {
    id: 'shawarma-wrap',
    name: 'Shawarma Wrap',
    price: 8.50,
    image: shawarmaImg,
    description: 'Verse wrap met gemarineerd vlees en groenten'
  },
  {
    id: 'falafel-platter',
    name: 'Falafel Schotel',
    price: 12.99,
    image: falafelImg,
    description: 'Krokante falafel met hummus en tahini'
  },
  {
    id: 'mixed-grill',
    name: 'Mixed Grill',
    price: 18.99,
    image: grillImg,
    description: 'Gegrilde kebabs met kip en lamsvlees'
  },
  {
    id: 'greek-salad',
    name: 'Griekse Salade',
    price: 9.50,
    image: saladImg,
    description: 'Verse salade met feta en olijven'
  },
  {
    id: 'baklava',
    name: 'Baklava',
    price: 5.50,
    image: baklavaImg,
    description: 'Traditioneel zoet gebak met honing'
  },
  {
    id: 'french-fries',
    name: 'Friet',
    price: 4.50,
    image: friesImg,
    description: 'Knapperige gouden frietjes'
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return PRODUCTS;
    
    const query = searchQuery.toLowerCase();
    return PRODUCTS.filter(
      product =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with search and cart */}
      <Header onSearchChange={setSearchQuery} onCartClick={() => setCartOpen(true)} />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px] overflow-hidden">
          <img
            src={heroImage}
            alt="Restaurant Omar"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-secondary/50" />
          <div className="relative container h-full flex flex-col justify-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Welkom bij Omar
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl">
              Authentieke Mediterraanse gerechten, vers bereid met liefde
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="container px-4 py-12">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Ons Menu</h2>
            {searchQuery && (
              <p className="text-muted-foreground">
                {filteredProducts.length} resultaten voor "{searchQuery}"
              </p>
            )}
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                Geen gerechten gevonden voor "{searchQuery}"
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Cart Sidebar */}
      <CartSidebar open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
};

export default Index;
