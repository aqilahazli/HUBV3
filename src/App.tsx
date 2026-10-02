/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { StoreProvider } from './context/StoreContext';
import { CartItem, ProductCategory } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GlobalModalsAndToasts } from './components/Modals';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage, WishlistPage } from './pages/CartAndWishlistPages';
import {
  CheckoutPage,
  OrderConfirmationPage,
  OrderTrackingPage,
} from './pages/CheckoutAndOrderPages';
import {
  LoginPage,
  RegisterPage,
  AccountPage,
  SizeGuidePage,
  ContactPage,
  FaqPage,
} from './pages/AccountAndStaticPages';
import { AdminPortal } from './pages/AdminPages';

const RouteView: React.FC = () => {
  const { path } = useRouter();
  const [directBuyItem, setDirectBuyItem] = useState<CartItem | null>(null);

  const normalized = path.replace(/\/+$/, '') || '/';

  // 1. Homepage
  if (normalized === '/') {
    return <HomePage />;
  }

  // 2. Shop & Collection Routes
  if (normalized === '/shop') {
    return <ShopPage presetMode="all" />;
  }
  if (normalized === '/new-arrivals') {
    return <ShopPage presetMode="new-arrivals" />;
  }
  if (normalized === '/sale') {
    return <ShopPage presetMode="sale" />;
  }

  if (normalized.startsWith('/category/')) {
    const slug = normalized.replace('/category/', '').toLowerCase();
    const categoryMap: Record<string, ProductCategory> = {
      running: 'Running',
      training: 'Training',
      basketball: 'Basketball',
      football: 'Football',
      outdoor: 'Outdoor',
      lifestyle: 'Lifestyle',
    };
    const matchedCat = categoryMap[slug];
    return <ShopPage presetCategory={matchedCat} presetMode="all" />;
  }

  // 3. Product Detail Page (/product/:id)
  if (normalized.startsWith('/product/')) {
    const productId = normalized.replace('/product/', '');
    return (
      <ProductDetailPage
        productId={productId}
        onBuyNow={(item) => setDirectBuyItem(item)}
      />
    );
  }

  // 4. Cart & Wishlist
  if (normalized === '/cart') {
    return <CartPage />;
  }
  if (normalized === '/wishlist') {
    return <WishlistPage />;
  }

  // 5. Checkout & Orders
  if (normalized === '/checkout') {
    return (
      <CheckoutPage
        directBuyItem={directBuyItem}
        clearDirectBuyItem={() => setDirectBuyItem(null)}
      />
    );
  }
  if (normalized === '/order-confirmation') {
    return <OrderConfirmationPage />;
  }
  if (normalized === '/orders') {
    return <OrderTrackingPage />;
  }
  if (normalized.startsWith('/orders/')) {
    const orderId = normalized.replace('/orders/', '');
    return <OrderTrackingPage orderId={orderId} />;
  }

  // 6. Auth, Account & Customer Care
  if (normalized === '/login') {
    return <LoginPage />;
  }
  if (normalized === '/register') {
    return <RegisterPage />;
  }
  if (normalized === '/account') {
    return <AccountPage />;
  }
  if (normalized === '/size-guide') {
    return <SizeGuidePage />;
  }
  if (normalized === '/contact') {
    return <ContactPage />;
  }
  if (normalized === '/faq') {
    return <FaqPage />;
  }

  // 7. Admin Routes
  if (normalized === '/admin') {
    return <AdminPortal subRoute="dashboard" />;
  }
  if (normalized === '/admin/products') {
    return <AdminPortal subRoute="products" />;
  }
  if (normalized === '/admin/products/new') {
    return <AdminPortal subRoute="product-new" />;
  }
  if (normalized.startsWith('/admin/products/') && normalized.endsWith('/edit')) {
    const id = normalized
      .replace('/admin/products/', '')
      .replace('/edit', '');
    return <AdminPortal subRoute="product-edit" editProductId={id} />;
  }
  if (normalized === '/admin/orders') {
    return <AdminPortal subRoute="orders" />;
  }
  if (normalized === '/admin/customers') {
    return <AdminPortal subRoute="customers" />;
  }
  if (normalized === '/admin/inventory') {
    return <AdminPortal subRoute="inventory" />;
  }
  if (normalized === '/admin/analytics') {
    return <AdminPortal subRoute="analytics" />;
  }

  // Fallback to Shop
  return <ShopPage presetMode="all" />;
};

export default function App() {
  return (
    <RouterProvider>
      <StoreProvider>
        <div className="min-h-screen flex flex-col bg-[#F9F9F8] text-[#111113]">
          <Header />
          <main className="flex-1">
            <RouteView />
          </main>
          <Footer />
          <GlobalModalsAndToasts />
        </div>
      </StoreProvider>
    </RouterProvider>
  );
}
