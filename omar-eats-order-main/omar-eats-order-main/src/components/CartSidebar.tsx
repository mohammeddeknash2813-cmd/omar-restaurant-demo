/**
 * Cart Sidebar Component
 * Displays cart items and checkout functionality
 */

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { getCart, addToCart, removeFromCart, getCartTotal, clearCart, submitOrder, CartItem } from '@/lib/cart';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CartSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CartSidebar = ({ open, onOpenChange }: CartSidebarProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Update cart when it changes
  useEffect(() => {
    const updateCart = () => setCart(getCart());
    
    updateCart();
    window.addEventListener('cartUpdated', updateCart);
    
    return () => window.removeEventListener('cartUpdated', updateCart);
  }, []);

  // Reset checkout form when sidebar closes
  useEffect(() => {
    if (!open) {
      setIsCheckout(false);
      setCustomerInfo({ name: '', email: '', phone: '', address: '' });
    }
  }, [open]);

  // Handle incrementing quantity
  const handleIncrement = (item: CartItem) => {
    addToCart(item);
  };

  // Handle decrementing quantity
  const handleDecrement = (item: CartItem) => {
    removeFromCart(item.id);
  };

  // Handle order submission
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitOrder(customerInfo);
      
      if (result.success) {
        toast.success('Bestelling geplaatst!', {
          description: 'Bedankt voor uw bestelling. We nemen binnenkort contact op.'
        });
        onOpenChange(false);
      } else {
        toast.error('Fout bij bestellen', {
          description: result.error || 'Probeer het opnieuw'
        });
      }
    } catch (error) {
      toast.error('Fout bij bestellen', {
        description: 'Er ging iets mis. Probeer het opnieuw.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = getCartTotal();
  const isEmpty = cart.length === 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {isCheckout ? 'Bestelling Afronden' : 'Winkelwagen'}
          </SheetTitle>
        </SheetHeader>

        {isEmpty ? (
          // Empty Cart State
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Uw winkelwagen is leeg</p>
            <p className="text-sm text-muted-foreground">
              Voeg gerechten toe om te beginnen met bestellen
            </p>
          </div>
        ) : !isCheckout ? (
          // Cart Items View
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    {/* Product Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.name}</h4>
                      <p className="text-sm text-primary font-medium">
                        €{item.price.toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleDecrement(item)}
                        >
                          {item.quantity === 1 ? (
                            <Trash2 className="h-3 w-3" />
                          ) : (
                            <Minus className="h-3 w-3" />
                          )}
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleIncrement(item)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="font-medium">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Footer */}
            <SheetFooter className="flex-col gap-4">
              <Separator />
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Totaal</span>
                <span className="text-primary">€{total.toFixed(2)}</span>
              </div>
              <Button 
                className="w-full bg-accent hover:bg-accent/90" 
                size="lg"
                onClick={() => setIsCheckout(true)}
              >
                Bestellen
              </Button>
            </SheetFooter>
          </>
        ) : (
          // Checkout Form
          <>
            <form onSubmit={handleCheckout} className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Naam *</Label>
                  <Input
                    id="name"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    placeholder="Uw naam"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    placeholder="uw@email.nl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefoonnummer</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    placeholder="06 12345678"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adres</Label>
                  <Input
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    placeholder="Straat 123, Amsterdam"
                  />
                </div>

                <Separator />

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h4 className="font-medium">Bestelling Overzicht</h4>
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Totaal</span>
                    <span className="text-primary">€{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <SheetFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCheckout(false)}
                  className="flex-1"
                >
                  Terug
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-accent hover:bg-accent/90"
                >
                  {isSubmitting ? 'Bezig...' : 'Bevestigen'}
                </Button>
              </SheetFooter>
            </form>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
