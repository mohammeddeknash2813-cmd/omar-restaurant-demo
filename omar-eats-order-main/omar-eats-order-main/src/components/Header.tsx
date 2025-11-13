/**
 * Header Component
 * Contains search bar, account icon, and shopping cart
 */

import { useState, useEffect } from 'react';
import { Search, User, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getCartCount } from '@/lib/cart';

interface HeaderProps {
  onSearchChange: (query: string) => void;
  onCartClick: () => void;
}

export const Header = ({ onSearchChange, onCartClick }: HeaderProps) => {
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Update cart count on mount and when cart changes
  useEffect(() => {
    const updateCount = () => setCartCount(getCartCount());
    
    updateCount();
    window.addEventListener('cartUpdated', updateCount);
    
    return () => window.removeEventListener('cartUpdated', updateCount);
  }, []);

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-restaurant-orange bg-clip-text text-transparent">
            Omar
          </h1>
        </div>

        {/* Search Bar - Hidden on mobile, visible on tablet+ */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Zoek gerechten..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          {/* Account Icon */}
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>

          {/* Shopping Cart */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full relative"
            onClick={onCartClick}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                {cartCount}
              </span>
            )}
            <span className="sr-only">Winkelwagen ({cartCount})</span>
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden border-t px-4 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Zoek gerechten..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-muted/50"
          />
        </div>
      </div>
    </header>
  );
};
