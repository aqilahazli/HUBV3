import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Boxes,
  BarChart3,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { Link, useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import {
  Product,
  ProductCategory,
  ProductSubcategory,
  GenderType,
  ShoeColorName,
  EUSize,
  OrderStatus,
} from '../types';
import {
  ALL_EU_SIZES,
  ALL_COLORS,
  CATEGORY_SUBCATEGORIES,
  STUDIO_IMAGES,
} from '../data/volterraData';
import { ShoeVisual } from '../components/ShoeVisual';

export type AdminSubRoute =
  | 'dashboard'
  | 'products'
  | 'product-new'
  | 'product-edit'
  | 'orders'
  | 'customers'
  | 'inventory'
  | 'analytics';

interface AdminPortalProps {
  subRoute: AdminSubRoute;
  editProductId?: string;
}

const ADMIN_ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

const SALES_CHART_SERIES: Record<
  'today' | '7d' | '30d' | '12m',
  { label: string; points: { label: string; value: number }[] }
> = {
  today: {
    label: 'Today (Hourly RM)',
    points: [
      { label: '08:00', value: 598 },
      { label: '10:00', value: 1240 },
      { label: '12:00', value: 2190 },
      { label: '14:00', value: 1850 },
      { label: '16:00', value: 2890 },
      { label: '18:00', value: 3420 },
      { label: '20:00', value: 4120 },
    ],
  },
  '7d': {
    label: 'Last 7 Days (RM)',
    points: [
      { label: 'Thu', value: 4890 },
      { label: 'Fri', value: 6120 },
      { label: 'Sat', value: 8450 },
      { label: 'Sun', value: 7920 },
      { label: 'Mon', value: 5340 },
      { label: 'Tue', value: 6780 },
      { label: 'Wed', value: 8940 },
    ],
  },
  '30d': {
    label: 'Last 30 Days (RM)',
    points: [
      { label: 'Wk 1', value: 28400 },
      { label: 'Wk 2', value: 34900 },
      { label: 'Wk 3', value: 31200 },
      { label: 'Wk 4', value: 42850 },
    ],
  },
  '12m': {
    label: 'Last 12 Months (RM)',
    points: [
      { label: 'Nov', value: 98000 },
      { label: 'Jan', value: 114000 },
      { label: 'Mar', value: 128000 },
      { label: 'May', value: 142000 },
      { label: 'Jul', value: 159000 },
      { label: 'Sep', value: 184500 },
    ],
  },
};

export const AdminPortal: React.FC<AdminPortalProps> = ({
  subRoute,
  editProductId,
}) => {
  const {
    products,
    orders,
    customers,
    currentUser,
    loginUser,
    addProduct,
    updateProduct,
    deleteProduct,
    updateInventoryStock,
    updateOrderStatus,
    resetDemoData,
  } = useStore();
  const { navigate } = useRouter();

  const [adminEmail, setAdminEmail] = useState('admin@volterra.demo');
  const [adminPass, setAdminPass] = useState('demo123');
  const [chartTimeframe, setChartTimeframe] = useState<
    'today' | '7d' | '30d' | '12m'
  >('7d');

  // Product Delete Confirmation Modal State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState<
    'all' | 'in-stock' | 'low-stock' | 'out-of-stock'
  >('all');

  // KPI Calculations
  const totalSalesRM = useMemo(
    () =>
      orders
        .filter((o) => o.status !== 'Cancelled')
        .reduce((acc, o) => acc + o.total, 0),
    [orders]
  );

  const lowStockCount = useMemo(() => {
    let count = 0;
    products.forEach((p) => {
      p.sizes.forEach((s) => {
        if (s.stock <= 5) count += 1;
      });
    });
    return count;
  }, [products]);

  const pendingOrdersCount = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.status === 'Pending' ||
          o.status === 'Order Placed' ||
          o.status === 'Processing'
      ).length,
    [orders]
  );

  const salesByCategory = useMemo(() => {
    const categories: ProductCategory[] = [
      'Running',
      'Training',
      'Basketball',
      'Football',
      'Outdoor',
      'Lifestyle',
    ];
    return categories.map((cat) => {
      const catProds = products.filter((p) => p.category === cat);
      const revenue = catProds.reduce(
        (sum, p) => sum + p.price * p.salesCount,
        0
      );
      const units = catProds.reduce((sum, p) => sum + p.salesCount, 0);
      return { category: cat, revenue, units };
    });
  }, [products]);

  const maxCatRevenue = Math.max(...salesByCategory.map((c) => c.revenue), 1);

  const navItems: { id: AdminSubRoute; label: string; to: string; Icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Overview', to: '/admin', Icon: LayoutDashboard },
    { id: 'products', label: 'Products', to: '/admin/products', Icon: Package },
    { id: 'orders', label: 'Orders', to: '/admin/orders', Icon: ShoppingCart },
    { id: 'customers', label: 'Customers', to: '/admin/customers', Icon: Users },
    { id: 'inventory', label: 'Inventory', to: '/admin/inventory', Icon: Boxes },
    { id: 'analytics', label: 'Analytics', to: '/admin/analytics', Icon: BarChart3 },
  ];

  // Sales Line Chart SVG renderer
  const activeSeries = SALES_CHART_SERIES[chartTimeframe];
  const maxVal = Math.max(...activeSeries.points.map((p) => p.value), 1);
  const svgWidth = 640;
  const svgHeight = 210;
  const padX = 40;
  const padY = 24;

  const polylinePoints = activeSeries.points
    .map((pt, idx) => {
      const x =
        padX +
        (idx / Math.max(1, activeSeries.points.length - 1)) *
          (svgWidth - padX * 2);
      const y =
        svgHeight -
        padY -
        (pt.value / maxVal) * (svgHeight - padY * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const SalesAnalyticsSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Line Chart: SALES OVERVIEW */}
      <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-zinc-200/80 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#E1381C]">
              REVENUE TELEMETRY
            </p>
            <h2 className="font-display text-lg font-bold text-[#111113]">
              SALES OVERVIEW
            </h2>
          </div>

          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg text-xs">
            {[
              { id: 'today', label: 'Today' },
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '12m', label: '12 Months' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setChartTimeframe(tab.id as 'today' | '7d' | '30d' | '12m')
                }
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  chartTimeframe === tab.id
                    ? 'bg-white text-[#111113] shadow-xs'
                    : 'text-zinc-600 hover:text-[#111113]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Line Chart */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-52 bg-[#F9F9F8] rounded-xl border border-zinc-200/60"
          >
            {/* Horizontal Grid Lines */}
            {[0.25, 0.5, 0.75].map((ratio) => {
              const y = padY + ratio * (svgHeight - padY * 2);
              return (
                <line
                  key={ratio}
                  x1={padX}
                  y1={y}
                  x2={svgWidth - padX}
                  y2={y}
                  stroke="#E4E4E7"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Line Path */}
            <polyline
              fill="none"
              stroke="#E1381C"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylinePoints}
            />

            {/* Data Points & Labels */}
            {activeSeries.points.map((pt, idx) => {
              const x =
                padX +
                (idx / Math.max(1, activeSeries.points.length - 1)) *
                  (svgWidth - padX * 2);
              const y =
                svgHeight -
                padY -
                (pt.value / maxVal) * (svgHeight - padY * 2);
              return (
                <g key={pt.label}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4.5"
                    fill="#111113"
                    stroke="#E1381C"
                    strokeWidth="2.5"
                  />
                  <text
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    className="fill-zinc-700 text-[10px] font-mono-num"
                  >
                    RM{pt.value.toLocaleString()}
                  </text>
                  <text
                    x={x}
                    y={svgHeight - 6}
                    textAnchor="middle"
                    className="fill-zinc-500 text-[10px] font-semibold"
                  >
                    {pt.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* SALES BY CATEGORY */}
      <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-zinc-200/80 space-y-4">
        <div>
          <p className="text-xs font-semibold text-[#E1381C]">
            SINGLE-BRAND BREAKDOWN
          </p>
          <h2 className="font-display text-lg font-bold text-[#111113]">
            SALES BY CATEGORY
          </h2>
        </div>

        <div className="space-y-3.5 text-xs">
          {salesByCategory.map((item) => {
            const pct = Math.round((item.revenue / maxCatRevenue) * 100);
            return (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#111113]">
                    {item.category}
                  </span>
                  <span className="font-mono-num text-zinc-600">
                    RM{item.revenue.toLocaleString()} ({item.units} pairs)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#111113] rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Admin Top Header & Demo Security Banner */}
      <div className="bg-[#111113] text-white p-6 rounded-2xl border border-zinc-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#E1381C] font-semibold tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>VOLTERRA ADMIN CONSOLE · DEMO ENVIRONMENT</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold">
            VOLTERRA OPERATIONS & INVENTORY
          </h1>
          <p className="text-xs text-zinc-400">
            Demo Credentials: <span className="font-mono-num text-zinc-200">admin@volterra.demo</span> / <span className="font-mono-num text-zinc-200">demo123</span> (For demo testing only — not for production).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {currentUser?.role !== 'admin' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                loginUser(adminEmail, 'admin');
              }}
              className="flex flex-wrap items-center gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-700 text-xs"
            >
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                aria-label="Admin demo email"
                className="px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-white font-mono-num"
              />
              <input
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                aria-label="Admin demo password"
                className="w-24 px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-700 text-white font-mono-num"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded bg-[#E1381C] text-white font-semibold cursor-pointer"
              >
                Login Demo Admin
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={resetDemoData}
            className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <Link
            to="/admin/products/new"
            className="px-4 py-2 rounded-lg bg-[#E1381C] hover:bg-[#c82d13] text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add VOLTERRA Shoe</span>
          </Link>
        </div>
      </div>

      {/* Admin Sub-Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {navItems.map(({ id, label, to, Icon }) => {
          const isCurrent =
            subRoute === id ||
            (id === 'products' &&
              (subRoute === 'product-new' || subRoute === 'product-edit'));
          return (
            <Link
              key={id}
              to={to}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
                isCurrent
                  ? 'bg-[#111113] text-white'
                  : 'bg-white text-zinc-700 border border-zinc-200/80 hover:border-[#111113]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* 1. ADMIN DASHBOARD OVERVIEW */}
      {subRoute === 'dashboard' && (
        <div className="space-y-8">
          {/* 6 KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-zinc-200/80">
              <p className="text-xs text-zinc-500">Total Sales</p>
              <p className="font-mono-num text-xl font-bold text-[#111113] mt-1">
                RM{totalSalesRM.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-zinc-200/80">
              <p className="text-xs text-zinc-500">Total Orders</p>
              <p className="font-mono-num text-xl font-bold text-[#111113] mt-1">
                {orders.length}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-zinc-200/80">
              <p className="text-xs text-zinc-500">Total Products</p>
              <p className="font-mono-num text-xl font-bold text-[#111113] mt-1">
                {products.length}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-zinc-200/80">
              <p className="text-xs text-zinc-500">Total Customers</p>
              <p className="font-mono-num text-xl font-bold text-[#111113] mt-1">
                {customers.length}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-zinc-200/80">
              <p className="text-xs text-zinc-500">Low Stock (Sizes ≤5)</p>
              <p className="font-mono-num text-xl font-bold text-amber-600 mt-1">
                {lowStockCount}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-zinc-200/80">
              <p className="text-xs text-zinc-500">Pending Orders</p>
              <p className="font-mono-num text-xl font-bold text-[#E1381C] mt-1">
                {pendingOrdersCount}
              </p>
            </div>
          </div>

          <SalesAnalyticsSection />

          {/* Top Selling VOLTERRA Models */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#111113]">
                TOP SELLING VOLTERRA FOOTWEAR
              </h2>
              <Link
                to="/admin/products"
                className="text-xs font-semibold text-[#E1381C] hover:underline"
              >
                Manage All Products →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-500">
                    <th className="py-3 px-3">Rank</th>
                    <th className="py-3 px-3">Product</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Price</th>
                    <th className="py-3 px-3">Units Sold</th>
                    <th className="py-3 px-3">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-mono-num">
                  {[...products]
                    .sort((a, b) => b.salesCount - a.salesCount)
                    .slice(0, 6)
                    .map((prod, idx) => (
                      <tr key={prod.id} className="hover:bg-zinc-50">
                        <td className="py-3 px-3 font-bold text-[#E1381C]">
                          #{idx + 1}
                        </td>
                        <td className="py-3 px-3 font-sans font-semibold text-[#111113]">
                          {prod.name}
                        </td>
                        <td className="py-3 px-3 font-sans text-zinc-600">
                          {prod.category} · {prod.subcategory}
                        </td>
                        <td className="py-3 px-3 font-semibold text-[#111113]">
                          RM{prod.price}
                        </td>
                        <td className="py-3 px-3 font-bold text-[#111113]">
                          {prod.salesCount} pairs
                        </td>
                        <td className="py-3 px-3">{prod.stock} units</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. DEDICATED ANALYTICS ROUTE (/admin/analytics) */}
      {subRoute === 'analytics' && <SalesAnalyticsSection />}

      {/* 3. PRODUCT MANAGEMENT (/admin/products) */}
      {subRoute === 'products' && (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-[#111113]">
                VOLTERRA PRODUCT CATALOG ({products.length})
              </h2>
              <p className="text-xs text-zinc-500">
                Add, edit, delete, or toggle Featured / New Arrival / Best Seller status.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filter products..."
                  className="pl-9 pr-3 py-2 rounded-lg border border-zinc-300 text-xs"
                />
              </div>
              <Link
                to="/admin/products/new"
                className="px-4 py-2 rounded-lg bg-[#111113] hover:bg-[#E1381C] text-white text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F9F9F8] border-y border-zinc-200 text-zinc-600">
                  <th className="py-3 px-3">Shoe</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price (RM)</th>
                  <th className="py-3 px-3">Stock</th>
                  <th className="py-3 px-3">Catalog Flags</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {products
                  .filter(
                    (p) =>
                      !productSearch.trim() ||
                      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                      p.category.toLowerCase().includes(productSearch.toLowerCase())
                  )
                  .map((prod) => (
                    <tr key={prod.id} className="hover:bg-zinc-50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <ShoeVisual
                            src={prod.images.main}
                            alt={prod.name}
                            aspectClass="aspect-square"
                            className="w-12 h-12 rounded shrink-0"
                          />
                          <div>
                            <p className="font-bold text-[#111113]">{prod.name}</p>
                            <p className="font-mono-num text-[11px] text-zinc-500">
                              {prod.id} · {prod.sku}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-zinc-600">
                        {prod.category}
                        <br />
                        <span className="text-[11px] text-zinc-400">
                          {prod.subcategory} ({prod.gender})
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono-num">
                        <div className="flex items-center gap-1.5">
                          <span className="text-zinc-500">RM</span>
                          <input
                            type="number"
                            value={prod.price}
                            onChange={(e) =>
                              updateProduct(prod.id, {
                                price: Math.max(1, Number(e.target.value)),
                              })
                            }
                            aria-label={`Price for ${prod.name}`}
                            className="w-20 px-2 py-1 rounded border border-zinc-300 font-bold text-[#111113]"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono-num">
                        <span
                          className={
                            prod.stock === 0
                              ? 'text-red-600 font-bold'
                              : prod.stock <= 15
                              ? 'text-amber-600 font-semibold'
                              : 'text-emerald-700 font-semibold'
                          }
                        >
                          {prod.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              updateProduct(prod.id, { featured: !prod.featured })
                            }
                            className={`px-2 py-1 rounded text-[11px] font-semibold border cursor-pointer ${
                              prod.featured
                                ? 'bg-[#111113] text-white border-[#111113]'
                                : 'bg-white text-zinc-500 border-zinc-200'
                            }`}
                          >
                            Featured
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateProduct(prod.id, {
                                newArrival: !prod.newArrival,
                              })
                            }
                            className={`px-2 py-1 rounded text-[11px] font-semibold border cursor-pointer ${
                              prod.newArrival
                                ? 'bg-[#111113] text-white border-[#111113]'
                                : 'bg-white text-zinc-500 border-zinc-200'
                            }`}
                          >
                            New Arrival
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateProduct(prod.id, {
                                bestSeller: !prod.bestSeller,
                              })
                            }
                            className={`px-2 py-1 rounded text-[11px] font-semibold border cursor-pointer ${
                              prod.bestSeller
                                ? 'bg-[#E1381C] text-white border-[#E1381C]'
                                : 'bg-white text-zinc-500 border-zinc-200'
                            }`}
                          >
                            Best Seller
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/admin/products/${prod.id}/edit`}
                            className="p-2 rounded-lg border border-zinc-200 hover:border-[#111113] text-zinc-700"
                            aria-label={`Edit ${prod.name}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(prod)}
                            className="p-2 rounded-lg border border-zinc-200 hover:border-red-600 text-zinc-600 hover:text-red-600 cursor-pointer"
                            aria-label={`Delete ${prod.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. ADD / EDIT PRODUCT FORM (/admin/products/new & /admin/products/:id/edit) */}
      {(subRoute === 'product-new' || subRoute === 'product-edit') && (
        <AdminProductForm
          existingProduct={
            subRoute === 'product-edit'
              ? products.find((p) => p.id === editProductId)
              : undefined
          }
          onSave={(data) => {
            if (subRoute === 'product-edit' && editProductId) {
              updateProduct(editProductId, data);
            } else {
              addProduct(data);
            }
            navigate('/admin/products');
          }}
          onCancel={() => navigate('/admin/products')}
        />
      )}

      {/* 5. ORDER MANAGEMENT (/admin/orders) */}
      {subRoute === 'orders' && (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 space-y-5">
          <div>
            <h2 className="font-display text-xl font-bold text-[#111113]">
              ORDER MANAGEMENT ({orders.length})
            </h2>
            <p className="text-xs text-zinc-500">
              Monitor incoming Malaysian athlete orders and update shipment status.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F9F9F8] border-y border-zinc-200 text-zinc-600">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">VOLTERRA Products</th>
                  <th className="py-3 px-3">Total (RM)</th>
                  <th className="py-3 px-3">Payment Status</th>
                  <th className="py-3 px-3">Order Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-50">
                    <td className="py-3 px-3 font-mono-num font-bold text-[#111113]">
                      <Link
                        to={`/orders/${ord.id}`}
                        className="hover:text-[#E1381C] underline"
                      >
                        {ord.id}
                      </Link>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-[#111113]">
                        {ord.customerName}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        {ord.shippingAddress.city}, {ord.shippingAddress.state}
                      </p>
                    </td>
                    <td className="py-3 px-3 font-mono-num text-zinc-600">
                      {ord.date}
                    </td>
                    <td className="py-3 px-3 text-zinc-700 max-w-xs">
                      {ord.items
                        .map(
                          (i) =>
                            `${i.productName} (${i.color}, ${i.size}) ×${i.quantity}`
                        )
                        .join(', ')}
                    </td>
                    <td className="py-3 px-3 font-mono-num font-bold text-[#111113]">
                      RM{ord.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-emerald-700">
                        {ord.paymentStatus}
                      </span>
                      <br />
                      <span className="text-[11px] text-zinc-400">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          updateOrderStatus(ord.id, e.target.value as OrderStatus)
                        }
                        aria-label={`Order status for ${ord.id}`}
                        className="px-2.5 py-1.5 rounded-lg border border-zinc-300 bg-white font-semibold text-[#111113]"
                      >
                        {ADMIN_ORDER_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. CUSTOMER MANAGEMENT (/admin/customers) */}
      {subRoute === 'customers' && (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 space-y-5">
          <div>
            <h2 className="font-display text-xl font-bold text-[#111113]">
              CUSTOMER DIRECTORY ({customers.length})
            </h2>
            <p className="text-xs text-zinc-500">
              Registered VOLTERRA athletes across Malaysia.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F9F9F8] border-y border-zinc-200 text-zinc-600">
                  <th className="py-3 px-3">Customer Name</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">State</th>
                  <th className="py-3 px-3">Orders</th>
                  <th className="py-3 px-3">Total Spending</th>
                  <th className="py-3 px-3">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-zinc-50">
                    <td className="py-3 px-3 font-bold text-[#111113]">
                      {cust.name}
                    </td>
                    <td className="py-3 px-3 text-zinc-600">{cust.email}</td>
                    <td className="py-3 px-3 font-mono-num text-zinc-600">
                      {cust.phone}
                    </td>
                    <td className="py-3 px-3 text-zinc-600">{cust.state}</td>
                    <td className="py-3 px-3 font-mono-num font-semibold text-[#111113]">
                      {cust.ordersCount}
                    </td>
                    <td className="py-3 px-3 font-mono-num font-bold text-[#E1381C]">
                      RM{cust.totalSpending.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 font-mono-num text-zinc-500">
                      {cust.lastOrderDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. STOCK / INVENTORY MANAGEMENT (/admin/inventory) */}
      {subRoute === 'inventory' && (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-[#111113]">
                STOCK & INVENTORY MATRIX
              </h2>
              <p className="text-xs text-zinc-500">
                IN STOCK (&gt;5), LOW STOCK (≤5), and OUT OF STOCK (=0) by VOLTERRA model, size, and colour.
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-lg text-xs">
              {[
                { id: 'all', label: 'All Sizes' },
                { id: 'in-stock', label: 'IN STOCK' },
                { id: 'low-stock', label: 'LOW STOCK (≤5)' },
                { id: 'out-of-stock', label: 'OUT OF STOCK (0)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setInventoryFilter(
                      tab.id as 'all' | 'in-stock' | 'low-stock' | 'out-of-stock'
                    )
                  }
                  className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                    inventoryFilter === tab.id
                      ? 'bg-white text-[#111113] shadow-xs'
                      : 'text-zinc-600 hover:text-[#111113]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto max-h-[640px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-[#F9F9F8] border-y border-zinc-200 text-zinc-600">
                <tr>
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">Size</th>
                  <th className="py-3 px-3">Available Colours</th>
                  <th className="py-3 px-3">Current Stock</th>
                  <th className="py-3 px-3">Stock Status</th>
                  <th className="py-3 px-3 text-right">Adjust Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 font-mono-num">
                {products.flatMap((prod) =>
                  prod.sizes
                    .filter((sz) => {
                      if (inventoryFilter === 'in-stock') return sz.stock > 5;
                      if (inventoryFilter === 'low-stock')
                        return sz.stock > 0 && sz.stock <= 5;
                      if (inventoryFilter === 'out-of-stock')
                        return sz.stock === 0;
                      return true;
                    })
                    .slice(0, 4) // Keep table scannable while showing all products
                    .map((sz) => {
                      const status =
                        sz.stock === 0
                          ? 'OUT OF STOCK'
                          : sz.stock <= 5
                          ? 'LOW STOCK'
                          : 'IN STOCK';
                      return (
                        <tr
                          key={`${prod.id}-${sz.size}`}
                          className="hover:bg-zinc-50"
                        >
                          <td className="py-2.5 px-3 font-sans font-bold text-[#111113]">
                            {prod.name}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-[#111113]">
                            {sz.size}
                          </td>
                          <td className="py-2.5 px-3 font-sans text-zinc-600">
                            {prod.colors.map((c) => c.name).join(', ')}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-[#111113]">
                            {sz.stock}
                          </td>
                          <td className="py-2.5 px-3 font-sans">
                            <span
                              className={`font-semibold ${
                                status === 'OUT OF STOCK'
                                  ? 'text-red-600'
                                  : status === 'LOW STOCK'
                                  ? 'text-amber-600'
                                  : 'text-emerald-700'
                              }`}
                            >
                              {status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  updateInventoryStock(
                                    prod.id,
                                    sz.size,
                                    sz.stock - 1
                                  )
                                }
                                className="px-2 py-1 rounded border border-zinc-300 hover:bg-zinc-100 cursor-pointer"
                              >
                                -1
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updateInventoryStock(
                                    prod.id,
                                    sz.size,
                                    sz.stock + 5
                                  )
                                }
                                className="px-2 py-1 rounded bg-[#111113] text-white hover:bg-[#E1381C] cursor-pointer"
                              >
                                +5
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal Before Product Delete */}
      {productToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-display text-lg font-bold text-[#111113]">
                Confirm Product Deletion
              </h3>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Are you sure you want to permanently remove{' '}
              <strong className="text-[#111113]">{productToDelete.name}</strong> (
              {productToDelete.sku}) from the VOLTERRA catalog?
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-lg border border-zinc-300 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProduct(productToDelete.id);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface AdminProductFormProps {
  existingProduct?: Product;
  onSave: (data: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

const AdminProductForm: React.FC<AdminProductFormProps> = ({
  existingProduct,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(
    existingProduct?.name || 'VOLTERRA AeroStride X'
  );
  const [category, setCategory] = useState<ProductCategory>(
    existingProduct?.category || 'Running'
  );
  const [subcategory, setSubcategory] = useState<ProductSubcategory>(
    existingProduct?.subcategory || 'Road Running'
  );
  const [gender, setGender] = useState<GenderType>(
    existingProduct?.gender || 'Unisex'
  );
  const [price, setPrice] = useState(existingProduct?.price || 329);
  const [originalPrice, setOriginalPrice] = useState(
    existingProduct?.originalPrice || 379
  );
  const [description, setDescription] = useState(
    existingProduct?.description ||
      'Engineered in the VOLTERRA biomechanics lab with supercritical AEROFOAM™ cushioning and breathable BREATHFLOW™ mesh.'
  );
  const [mainImage, setMainImage] = useState(
    existingProduct?.images.main || STUDIO_IMAGES.running
  );
  const [selectedColorNames, setSelectedColorNames] = useState<ShoeColorName[]>(
    existingProduct?.colors.map((c) => c.name) || ['White', 'Orange', 'Black']
  );
  const [selectedSizes, setSelectedSizes] = useState<EUSize[]>(
    existingProduct?.sizes.filter((s) => s.stock > 0).map((s) => s.size) || [
      'EU 39',
      'EU 40',
      'EU 41',
      'EU 42',
      'EU 43',
      'EU 44',
    ]
  );
  const [stockPerSize, setStockPerSize] = useState<number>(8);
  const [materialsText, setMaterialsText] = useState(
    existingProduct?.materials.join(', ') ||
      'BREATHFLOW™ Monofilament Mesh, Supercritical AEROFOAM™, GRIPMAX™ Outsole'
  );
  const [weight, setWeight] = useState(
    existingProduct?.weight || '220g (EU 42)'
  );
  const [drop, setDrop] = useState(existingProduct?.drop || '8mm');
  const [techText, setTechText] = useState(
    existingProduct?.technology.join(', ') ||
      'AEROFOAM™, BREATHFLOW™, GRIPMAX™'
  );
  const [featured, setFeatured] = useState(existingProduct?.featured ?? true);
  const [newArrival, setNewArrival] = useState(
    existingProduct?.newArrival ?? true
  );
  const [bestSeller, setBestSeller] = useState(
    existingProduct?.bestSeller ?? false
  );

  const computedDiscount =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedName = name.toUpperCase().includes('VOLTERRA')
      ? name.trim()
      : `VOLTERRA ${name.trim()}`;

    const colors = (
      selectedColorNames.length > 0 ? selectedColorNames : (['Black'] as ShoeColorName[])
    ).map((cName, idx) => {
      const ref = ALL_COLORS.find((c) => c.name === cName) || ALL_COLORS[0];
      return {
        name: ref.name,
        label: ref.label,
        hex: ref.hex,
        secondaryHex: ref.secondaryHex,
        stock: stockPerSize * 2,
        imageIndex: idx,
      };
    });

    const sizes = ALL_EU_SIZES.map((sz) => ({
      size: sz,
      stock: selectedSizes.includes(sz) ? stockPerSize : 0,
    }));

    const totalStock = sizes.reduce((sum, s) => sum + s.stock, 0);

    onSave({
      sku:
        existingProduct?.sku ||
        `VT-${category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 899)}`,
      name: normalizedName,
      brand: 'VOLTERRA',
      category,
      subcategory,
      gender,
      price: Number(price),
      originalPrice: Number(originalPrice),
      discount: computedDiscount,
      description,
      shortDescription: description.slice(0, 110),
      images: {
        main: mainImage,
        side: STUDIO_IMAGES.hero,
        top: mainImage,
        detail: STUDIO_IMAGES.training,
      },
      colors,
      sizes,
      stock: totalStock,
      rating: existingProduct?.rating || 4.9,
      reviewCount: existingProduct?.reviewCount || 18,
      salesCount: existingProduct?.salesCount || 120,
      featured,
      newArrival,
      bestSeller,
      sport: subcategory,
      materials: materialsText
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean),
      weight,
      drop,
      technology: techText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80 space-y-6 text-xs"
    >
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
        <div>
          <p className="text-[#E1381C] font-semibold">
            SINGLE-BRAND CATALOG EDITOR
          </p>
          <h2 className="font-display text-xl font-bold text-[#111113]">
            {existingProduct ? `EDIT: ${existingProduct.name}` : 'ADD NEW VOLTERRA PRODUCT'}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="px-3.5 py-2 rounded-lg border border-zinc-300 font-semibold text-zinc-700 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block font-semibold text-[#111113] mb-1">
            Product Name (VOLTERRA Brand Only) *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#111113] mb-1">
            Gender *
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as GenderType)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 bg-white"
          >
            <option value="Unisex">Unisex</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-[#111113] mb-1">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => {
              const newCat = e.target.value as ProductCategory;
              setCategory(newCat);
              setSubcategory(CATEGORY_SUBCATEGORIES[newCat][0]);
            }}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 bg-white"
          >
            {Object.keys(CATEGORY_SUBCATEGORIES).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-[#111113] mb-1">
            Subcategory *
          </label>
          <select
            value={subcategory}
            onChange={(e) =>
              setSubcategory(e.target.value as ProductSubcategory)
            }
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 bg-white"
          >
            {CATEGORY_SUBCATEGORIES[category].map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-[#111113] mb-1">
            Studio Image Preset
          </label>
          <select
            value={mainImage}
            onChange={(e) => setMainImage(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 bg-white"
          >
            <option value={STUDIO_IMAGES.running}>Road Running Studio</option>
            <option value={STUDIO_IMAGES.hero}>Carbon Racer Flagship</option>
            <option value={STUDIO_IMAGES.trail}>Trail & Mountain Studio</option>
            <option value={STUDIO_IMAGES.basketball}>Basketball Court Studio</option>
            <option value={STUDIO_IMAGES.training}>Training & Pitch Studio</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-[#111113] mb-1">
            Selling Price (RM) *
          </label>
          <input
            type="number"
            required
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 font-mono-num"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#111113] mb-1">
            Original Price (RM)
          </label>
          <input
            type="number"
            required
            value={originalPrice}
            onChange={(e) => setOriginalPrice(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 font-mono-num"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#111113] mb-1">
            Auto-Calculated Discount
          </label>
          <input
            type="text"
            disabled
            value={`${computedDiscount}% OFF`}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-zinc-100 font-mono-num text-[#E1381C] font-bold"
          />
        </div>
      </div>

      <div>
        <label className="block font-semibold text-[#111113] mb-1">
          Description *
        </label>
        <textarea
          rows={3}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300"
        />
      </div>

      {/* Colours & Sizes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold text-[#111113] mb-2">
            Available Colours
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_COLORS.map((col) => {
              const active = selectedColorNames.includes(col.name);
              return (
                <button
                  key={col.name}
                  type="button"
                  onClick={() =>
                    setSelectedColorNames((prev) =>
                      prev.includes(col.name)
                        ? prev.filter((c) => c !== col.name)
                        : [...prev, col.name]
                    )
                  }
                  className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-[#111113] text-white border-[#111113]'
                      : 'bg-white text-zinc-700 border-zinc-300'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-white/40"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-semibold text-[#111113]">
              Active Sizes (EU 36–46)
            </label>
            <div className="flex items-center gap-2">
              <span>Units per size:</span>
              <input
                type="number"
                value={stockPerSize}
                onChange={(e) => setStockPerSize(Math.max(1, Number(e.target.value)))}
                className="w-16 px-2 py-1 rounded border border-zinc-300 font-mono-num"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 font-mono-num">
            {ALL_EU_SIZES.map((sz) => {
              const active = selectedSizes.includes(sz);
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() =>
                    setSelectedSizes((prev) =>
                      prev.includes(sz)
                        ? prev.filter((s) => s !== sz)
                        : [...prev, sz]
                    )
                  }
                  className={`px-2.5 py-1.5 rounded border cursor-pointer ${
                    active
                      ? 'bg-[#111113] text-white border-[#111113]'
                      : 'bg-white text-zinc-500 border-zinc-200'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Technical Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block font-semibold text-[#111113] mb-1">
            Weight
          </label>
          <input
            type="text"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 font-mono-num"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#111113] mb-1">
            Heel Drop
          </label>
          <input
            type="text"
            value={drop}
            onChange={(e) => setDrop(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 font-mono-num"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#111113] mb-1">
            VOLTERRA Technologies (comma-separated)
          </label>
          <input
            type="text"
            value={techText}
            onChange={(e) => setTechText(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#111113] mb-1">
            Materials (comma-separated)
          </label>
          <input
            type="text"
            value={materialsText}
            onChange={(e) => setMaterialsText(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300"
          />
        </div>
      </div>

      {/* Flags */}
      <div className="flex flex-wrap items-center gap-6 pt-2">
        <label className="flex items-center gap-2 cursor-pointer font-semibold">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          <span>Mark as Featured</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer font-semibold">
          <input
            type="checkbox"
            checked={newArrival}
            onChange={(e) => setNewArrival(e.target.checked)}
          />
          <span>Mark as New Arrival</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer font-semibold">
          <input
            type="checkbox"
            checked={bestSeller}
            onChange={(e) => setBestSeller(e.target.checked)}
          />
          <span>Mark as Best Seller</span>
        </label>
      </div>

      <div className="pt-4 border-t border-zinc-200 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg border border-zinc-300 font-semibold text-zinc-700 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg bg-[#E1381C] hover:bg-[#c82d13] text-white font-semibold cursor-pointer"
        >
          {existingProduct ? 'SAVE CHANGES' : 'CREATE VOLTERRA PRODUCT'}
        </button>
      </div>
    </form>
  );
};
