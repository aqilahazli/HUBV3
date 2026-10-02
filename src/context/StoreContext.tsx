import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  CartItem,
  Order,
  OrderStatus,
  Customer,
  Review,
  UserAccount,
  ShoeColorName,
  EUSize,
  ToastMessage,
  ShippingAddress,
  DeliveryMethodType,
  PaymentMethodType,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_REVIEWS,
  DEMO_PROMO_CODES,
} from '../data/volterraData';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  orders: Order[];
  customers: Customer[];
  reviews: Review[];
  currentUser: UserAccount | null;
  appliedPromo: { code: string; discountPercent: number; description: string } | null;
  lastConfirmedOrder: Order | null;
  quickViewProduct: Product | null;
  isSizeGuideOpen: boolean;
  toasts: ToastMessage[];

  // Cart & Wishlist Actions
  addToCart: (productId: string, color: ShoeColorName, size: EUSize, quantity?: number) => void;
  updateCartQuantity: (productId: string, color: ShoeColorName, size: EUSize, quantity: number) => void;
  removeFromCart: (productId: string, color: ShoeColorName, size: EUSize) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  addRecentlyViewed: (productId: string) => void;

  // Promo & Checkout
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  createOrder: (params: {
    shippingAddress: ShippingAddress;
    deliveryMethod: DeliveryMethodType;
    paymentMethod: PaymentMethodType;
    directBuyItem?: CartItem;
  }) => Order;

  // Reviews
  addReview: (review: Omit<Review, 'id' | 'date' | 'verified'>) => void;

  // Auth & User Profile
  loginUser: (email: string, roleHint?: 'customer' | 'admin') => UserAccount;
  registerUser: (name: string, email: string) => UserAccount;
  logoutUser: () => void;
  updateUserProfile: (updates: Partial<UserAccount>) => void;

  // Admin Actions
  addProduct: (newProduct: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateInventoryStock: (productId: string, size: EUSize, newStock: number) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // UI Modals & Toasts
  setQuickViewProduct: (product: Product | null) => void;
  setIsSizeGuideOpen: (open: boolean) => void;
  addToast: (title: string, description?: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  resetDemoData: () => void;
}

const STORAGE_KEYS = {
  PRODUCTS: 'volterra_products_v1',
  CART: 'volterra_cart_v1',
  WISHLIST: 'volterra_wishlist_v1',
  RECENTLY_VIEWED: 'volterra_recent_v1',
  ORDERS: 'volterra_orders_v1',
  CUSTOMERS: 'volterra_customers_v1',
  REVIEWS: 'volterra_reviews_v1',
  USER: 'volterra_user_v1',
};

const DEFAULT_DEMO_USER: UserAccount = {
  id: 'cust-01',
  name: 'Aiman Hakim bin Azman',
  email: 'aiman.hakim@demo.my',
  phone: '+60 12-348 9921',
  role: 'customer',
  defaultShoeSize: 'EU 42',
  preferredSport: 'Running',
  newsletterSubscribed: true,
  addresses: [
    {
      id: 'addr-1',
      label: 'Home (Kuala Lumpur)',
      fullName: 'Aiman Hakim bin Azman',
      phone: '+60 12-348 9921',
      email: 'aiman.hakim@demo.my',
      address: 'No. 18, Jalan Tun Razak, Hampshire Park',
      postcode: '50450',
      city: 'Kuala Lumpur',
      state: 'Kuala Lumpur',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Office (Petaling Jaya)',
      fullName: 'Aiman Hakim bin Azman',
      phone: '+60 12-348 9921',
      email: 'aiman.hakim@demo.my',
      address: 'Level 12, Menara Axis, Jalan 51A/223',
      postcode: '46100',
      city: 'Petaling Jaya',
      state: 'Selangor',
      isDefault: false,
    },
  ],
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS)
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.CART, [
      { productId: 'vr001', color: 'White', size: 'EU 42', quantity: 1 },
    ])
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEYS.WISHLIST, ['vr002', 'vr011', 'vr019'])
  );
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEYS.RECENTLY_VIEWED, ['vr001', 'vr019', 'vr005', 'vr009'])
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    loadFromStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
  );
  const [customers, setCustomers] = useState<Customer[]>(() =>
    loadFromStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS)
  );
  const [reviews, setReviews] = useState<Review[]>(() =>
    loadFromStorage(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS)
  );
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() =>
    loadFromStorage(STORAGE_KEYS.USER, DEFAULT_DEMO_USER)
  );

  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountPercent: number;
    description: string;
  } | null>(null);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(() =>
    INITIAL_ORDERS[0] || null
  );
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage (Never storing passwords or payment credentials)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(recentlyViewed));
    } catch {}
  }, [recentlyViewed]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    } catch {}
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch {}
  }, [reviews]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch {}
  }, [currentUser]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (title: string, description?: string, type: 'success' | 'info' | 'error' = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, title, description, type }]);
      setTimeout(() => {
        removeToast(id);
      }, 3600);
    },
    [removeToast]
  );

  const addToCart = useCallback(
    (productId: string, color: ShoeColorName, size: EUSize, quantity = 1) => {
      const prod = products.find((p) => p.id === productId);
      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.productId === productId && item.color === color && item.size === size
        );
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        }
        return [...prev, { productId, color, size, quantity }];
      });
      addToast(
        'Added to cart',
        prod ? `${prod.name} (${color} · ${size})` : 'Item added to your shopping bag.',
        'success'
      );
    },
    [products, addToast]
  );

  const updateCartQuantity = useCallback(
    (productId: string, color: ShoeColorName, size: EUSize, quantity: number) => {
      if (quantity <= 0) {
        setCart((prev) =>
          prev.filter(
            (item) => !(item.productId === productId && item.color === color && item.size === size)
          )
        );
        addToast('Removed from cart', 'Item removed from your shopping bag.', 'info');
        return;
      }
      setCart((prev) =>
        prev.map((item) =>
          item.productId === productId && item.color === color && item.size === size
            ? { ...item, quantity }
            : item
        )
      );
    },
    [addToast]
  );

  const removeFromCart = useCallback(
    (productId: string, color: ShoeColorName, size: EUSize) => {
      const prod = products.find((p) => p.id === productId);
      setCart((prev) =>
        prev.filter(
          (item) => !(item.productId === productId && item.color === color && item.size === size)
        )
      );
      addToast(
        'Removed from cart',
        prod ? `${prod.name} removed from bag.` : undefined,
        'info'
      );
    },
    [products, addToast]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedPromo(null);
  }, []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      const prod = products.find((p) => p.id === productId);
      setWishlist((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          addToast(
            'Removed from wishlist',
            prod ? `${prod.name} removed from saved shoes.` : undefined,
            'info'
          );
          return prev.filter((id) => id !== productId);
        } else {
          addToast(
            'Added to wishlist',
            prod ? `${prod.name} saved to your wishlist.` : undefined,
            'success'
          );
          return [productId, ...prev];
        }
      });
    },
    [products, addToast]
  );

  const addRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  }, []);

  const applyPromoCode = useCallback(
    (rawCode: string): boolean => {
      const normalized = rawCode.trim().toUpperCase();
      const found = DEMO_PROMO_CODES[normalized];
      if (found) {
        setAppliedPromo(found);
        addToast(
          'Promo code applied',
          `${found.code}: ${found.discountPercent}% discount activated.`,
          'success'
        );
        return true;
      }
      addToast(
        'Invalid promo code',
        'Try demo codes: VOLT10, WELCOME15, or SPORT20.',
        'error'
      );
      return false;
    },
    [addToast]
  );

  const removePromoCode = useCallback(() => {
    setAppliedPromo(null);
    addToast('Promo code removed', undefined, 'info');
  }, [addToast]);

  const createOrder = useCallback(
    ({
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      directBuyItem,
    }: {
      shippingAddress: ShippingAddress;
      deliveryMethod: DeliveryMethodType;
      paymentMethod: PaymentMethodType;
      directBuyItem?: CartItem;
    }): Order => {
      const sourceItems = directBuyItem ? [directBuyItem] : cart;
      const orderItems = sourceItems.map((c) => {
        const prod = products.find((p) => p.id === c.productId) || products[0];
        return {
          productId: prod.id,
          productName: prod.name,
          color: c.color,
          size: c.size,
          quantity: c.quantity,
          unitPrice: prod.price,
          image: prod.images.main,
        };
      });

      const subtotal = orderItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );
      const discount = appliedPromo
        ? Number(((subtotal * appliedPromo.discountPercent) / 100).toFixed(2))
        : 0;
      const shippingFee =
        deliveryMethod === 'express' ? 15 : subtotal > 200 ? 0 : 8;
      const total = Number((subtotal - discount + shippingFee).toFixed(2));

      const orderNumber = `VT-20261002-${String(orders.length + 1).padStart(3, '0')}`;
      const newOrder: Order = {
        id: orderNumber,
        customerId: currentUser?.id || 'cust-guest',
        customerName: shippingAddress.fullName,
        customerEmail: shippingAddress.email,
        customerPhone: shippingAddress.phone,
        date: '2026-10-02',
        items: orderItems,
        subtotal,
        discount,
        promoCode: appliedPromo?.code,
        shippingFee,
        total,
        deliveryMethod,
        estimatedDelivery:
          deliveryMethod === 'express' ? '1–2 working days' : '3–5 working days',
        paymentMethod,
        paymentStatus:
          paymentMethod === 'Cash on Delivery' ? 'COD Pending' : 'Paid (Demo)',
        status:
          paymentMethod === 'Cash on Delivery'
            ? 'Order Placed'
            : 'Payment Confirmed',
        shippingAddress,
      };

      setOrders((prev) => [newOrder, ...prev]);
      setLastConfirmedOrder(newOrder);

      // Update product stock & salesCount
      setProducts((prev) =>
        prev.map((prod) => {
          const matchingItems = sourceItems.filter((i) => i.productId === prod.id);
          if (matchingItems.length === 0) return prod;
          const totalQtyBought = matchingItems.reduce((s, i) => s + i.quantity, 0);
          const updatedSizes = prod.sizes.map((sz) => {
            const boughtForSize = matchingItems
              .filter((i) => i.size === sz.size)
              .reduce((s, i) => s + i.quantity, 0);
            return boughtForSize > 0
              ? { ...sz, stock: Math.max(0, sz.stock - boughtForSize) }
              : sz;
          });
          return {
            ...prod,
            stock: Math.max(0, prod.stock - totalQtyBought),
            salesCount: prod.salesCount + totalQtyBought,
            sizes: updatedSizes,
          };
        })
      );

      // Update customer stats
      setCustomers((prev) => {
        const existing = prev.find(
          (c) => c.email.toLowerCase() === shippingAddress.email.toLowerCase()
        );
        if (existing) {
          return prev.map((c) =>
            c.id === existing.id
              ? {
                  ...c,
                  ordersCount: c.ordersCount + 1,
                  totalSpending: Number((c.totalSpending + total).toFixed(2)),
                  lastOrderDate: '2026-10-02',
                }
              : c
          );
        }
        return [
          {
            id: `cust-${Date.now()}`,
            name: shippingAddress.fullName,
            email: shippingAddress.email,
            phone: shippingAddress.phone,
            state: shippingAddress.state,
            ordersCount: 1,
            totalSpending: total,
            lastOrderDate: '2026-10-02',
            joinedDate: '2026-10-02',
          },
          ...prev,
        ];
      });

      if (!directBuyItem) {
        setCart([]);
        setAppliedPromo(null);
      }

      addToast(
        'Order successful',
        `Order ${orderNumber} has been confirmed.`,
        'success'
      );
      return newOrder;
    },
    [cart, products, appliedPromo, orders.length, currentUser, addToast]
  );

  const addReview = useCallback(
    (reviewData: Omit<Review, 'id' | 'date' | 'verified'>) => {
      const newReview: Review = {
        ...reviewData,
        id: `rev-${Date.now()}`,
        date: '2026-10-02',
        verified: true,
      };
      setReviews((prev) => [newReview, ...prev]);

      // Recalculate rating on product
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== reviewData.productId) return p;
          const newCount = p.reviewCount + 1;
          const newRating = Number(
            ((p.rating * p.reviewCount + reviewData.rating) / newCount).toFixed(1)
          );
          return {
            ...p,
            rating: newRating,
            reviewCount: newCount,
          };
        })
      );

      addToast('Review submitted', 'Thank you for reviewing your VOLTERRA gear!', 'success');
    },
    [addToast]
  );

  const loginUser = useCallback(
    (email: string, roleHint?: 'customer' | 'admin'): UserAccount => {
      const cleanEmail = email.trim().toLowerCase();
      const isAdmin =
        roleHint === 'admin' || cleanEmail === 'admin@volterra.demo';

      const user: UserAccount = isAdmin
        ? {
            id: 'admin-01',
            name: 'VOLTERRA Operations Admin',
            email: 'admin@volterra.demo',
            phone: '+60 3-2181 9000',
            role: 'admin',
            defaultShoeSize: 'EU 42',
            preferredSport: 'Running',
            newsletterSubscribed: true,
            addresses: DEFAULT_DEMO_USER.addresses,
          }
        : {
            ...DEFAULT_DEMO_USER,
            email: cleanEmail || DEFAULT_DEMO_USER.email,
            name:
              cleanEmail === DEFAULT_DEMO_USER.email
                ? DEFAULT_DEMO_USER.name
                : cleanEmail
                    .split('@')[0]
                    .replace(/[._]/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase()),
            role: 'customer',
          };

      setCurrentUser(user);
      addToast(
        isAdmin ? 'Admin session active' : 'Welcome back to VOLTERRA',
        `Signed in as ${user.email}`,
        'success'
      );
      return user;
    },
    [addToast]
  );

  const registerUser = useCallback(
    (name: string, email: string): UserAccount => {
      const newUser: UserAccount = {
        id: `cust-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: '+60 12-000 0000',
        role: 'customer',
        defaultShoeSize: 'EU 42',
        preferredSport: 'Running',
        newsletterSubscribed: true,
        addresses: [
          {
            id: `addr-${Date.now()}`,
            label: 'Primary Address',
            fullName: name.trim(),
            phone: '+60 12-000 0000',
            email: email.trim().toLowerCase(),
            address: '10 Jalan Ampang',
            postcode: '50450',
            city: 'Kuala Lumpur',
            state: 'Kuala Lumpur',
            isDefault: true,
          },
        ],
      };
      setCurrentUser(newUser);
      addToast('Account created', `Welcome to VOLTERRA, ${newUser.name}!`, 'success');
      return newUser;
    },
    [addToast]
  );

  const logoutUser = useCallback(() => {
    setCurrentUser(null);
    addToast('Signed out', 'You have logged out of your account.', 'info');
  }, [addToast]);

  const updateUserProfile = useCallback(
    (updates: Partial<UserAccount>) => {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
      addToast('Profile updated', 'Your account preferences have been saved.', 'success');
    },
    [addToast]
  );

  const addProduct = useCallback(
    (newProdData: Omit<Product, 'id'>): Product => {
      const nextNum = products.length + 1;
      const id = `vr${String(nextNum).padStart(3, '0')}`;
      const created: Product = {
        ...newProdData,
        id,
        brand: 'VOLTERRA', // Enforce single brand rule
      };
      setProducts((prev) => [created, ...prev]);
      addToast('Product added', `${created.name} added to VOLTERRA catalog.`, 'success');
      return created;
    },
    [products.length, addToast]
  );

  const updateProduct = useCallback(
    (id: string, updates: Partial<Product>) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, ...updates, brand: 'VOLTERRA' } : p
        )
      );
      addToast('Product updated', 'Changes saved to catalog.', 'success');
    },
    [addToast]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      const target = products.find((p) => p.id === id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setCart((prev) => prev.filter((c) => c.productId !== id));
      setWishlist((prev) => prev.filter((wId) => wId !== id));
      addToast(
        'Product deleted',
        target ? `${target.name} removed from catalog.` : 'Product deleted.',
        'info'
      );
    },
    [products, addToast]
  );

  const updateInventoryStock = useCallback(
    (productId: string, size: EUSize, newStock: number) => {
      const clamped = Math.max(0, newStock);
      setProducts((prev) =>
        prev.map((prod) => {
          if (prod.id !== productId) return prod;
          const updatedSizes = prod.sizes.map((s) =>
            s.size === size ? { ...s, stock: clamped } : s
          );
          const totalStock = updatedSizes.reduce((acc, s) => acc + s.stock, 0);
          return {
            ...prod,
            sizes: updatedSizes,
            stock: totalStock,
          };
        })
      );
      addToast('Product updated', `Stock for ${size} updated to ${clamped} units.`, 'success');
    },
    [addToast]
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      setLastConfirmedOrder((prev) =>
        prev && prev.id === orderId ? { ...prev, status } : prev
      );
      addToast('Order status updated', `Order ${orderId} marked as ${status}.`, 'success');
    },
    [addToast]
  );

  const resetDemoData = useCallback(() => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setReviews(INITIAL_REVIEWS);
    setCart([{ productId: 'vr001', color: 'White', size: 'EU 42', quantity: 1 }]);
    setWishlist(['vr002', 'vr011', 'vr019']);
    setCurrentUser(DEFAULT_DEMO_USER);
    addToast('Demo data restored', 'All VOLTERRA products, orders, and stock reset.', 'info');
  }, [addToast]);

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        recentlyViewed,
        orders,
        customers,
        reviews,
        currentUser,
        appliedPromo,
        lastConfirmedOrder,
        quickViewProduct,
        isSizeGuideOpen,
        toasts,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        addRecentlyViewed,
        applyPromoCode,
        removePromoCode,
        createOrder,
        addReview,
        loginUser,
        registerUser,
        logoutUser,
        updateUserProfile,
        addProduct,
        updateProduct,
        deleteProduct,
        updateInventoryStock,
        updateOrderStatus,
        setQuickViewProduct,
        setIsSizeGuideOpen,
        addToast,
        removeToast,
        resetDemoData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
};
