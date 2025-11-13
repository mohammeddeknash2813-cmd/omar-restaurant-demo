/**
 * Product Card Component
 * Displays individual menu items with add to cart functionality
 */

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Product, addToCart } from '@/lib/cart';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  // Handle adding product to cart
  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} toegevoegd aan winkelwagen`);
  };

  return (
    <Card 
      className="group overflow-hidden transition-all hover:shadow-lg"
      data-product-id={product.id}
    >
      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-1">{product.name}</CardTitle>
        {product.description && (
          <CardDescription className="line-clamp-2">
            {product.description}
          </CardDescription>
        )}
      </CardHeader>

      {/* Price and Add Button */}
      <CardFooter className="flex items-center justify-between pt-0">
        <span className="text-2xl font-bold text-primary">
          €{product.price.toFixed(2)}
        </span>
        <Button 
          size="icon"
          className="rounded-full bg-accent hover:bg-accent/90"
          onClick={handleAddToCart}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Toevoegen aan winkelwagen</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
