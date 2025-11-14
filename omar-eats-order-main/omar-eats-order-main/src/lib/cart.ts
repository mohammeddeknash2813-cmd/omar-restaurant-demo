/**
 * Cart Management Utility
 * Handles adding/removing products and order submission
 * Uses localStorage for cart persistence
 */

// Product interface with required data-product-id attribute
export interface Product {
  id: string; // Corresponds to data-product-id
  name: string;
  price: number;
  image: string;
  description?: string;
}

// Cart item with quantity
export interface CartItem extends Product {
  quantity: number;
}

// Storage key for localStorage
const CART_STORAGE_KEY = 'omar-restaurant-cart';

/**
 * Get current cart from localStorage
 */
export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading cart:', error);
    return [];
  }
};

/**
 * Save cart to localStorage
 */
const saveCart = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

/**
 * Add product to cart
 * If product exists, increment quantity
 */
export const addToCart = (product: Product): CartItem[] => {
  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingIndex >= 0) {
    // Product exists, increment quantity
    cart[existingIndex].quantity += 1;
  } else {
    // New product, add with quantity 1
    cart.push({ ...product, quantity: 1 });
  }
  
  saveCart(cart);
  return cart;
};

/**
 * Remove product from cart
 * Decrements quantity or removes if quantity becomes 0
 */
export const removeFromCart = (productId: string): CartItem[] => {
  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === productId);
  
  if (existingIndex >= 0) {
    cart[existingIndex].quantity -= 1;
    
    // Remove item if quantity is 0
    if (cart[existingIndex].quantity <= 0) {
      cart.splice(existingIndex, 1);
    }
  }
  
  saveCart(cart);
  return cart;
};

/**
 * Clear entire cart
 */
export const clearCart = (): void => {
  saveCart([]);
};

/**
 * Get total items count in cart
 */
export const getCartCount = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Get cart total price
 */
export const getCartTotal = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

/**
 * Submit order to API endpoint
 * POSTs cart data as JSON to /api/order
 */
export const submitOrder = async (customerInfo: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}): Promise<{ success: boolean; orderId?: string; error?: string }> => {
  const cart = getCart();
  
  if (cart.length === 0) {
    return { success: false, error: 'Winkelwagen is leeg' };
  }
  
  const orderData = {
    customer: customerInfo,
    items: cart,
    total: getCartTotal(),
    timestamp: new Date().toISOString()
  };
  
  try {
   const response = await fetch(
  "https://omar-restaurant-demo.onrender.com/api/order",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
  }
);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Clear cart on successful order
    if (result.success) {
      clearCart();
    }
    
    return result;
  } catch (error) {
    console.error('Error submitting order:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Onbekende fout opgetreden'
    };
  }
};
