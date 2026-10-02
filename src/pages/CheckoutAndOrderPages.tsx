import React, { useState } from 'react';
import {
  CheckCircle2,
  Truck,
  CreditCard,
  Building2,
  Wallet,
  Banknote,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Package,
  MapPin,
} from 'lucide-react';
import { Link, useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import {
  CartItem,
  DeliveryMethodType,
  PaymentMethodType,
  ShippingAddress,
  OrderStatus,
} from '../types';
import { MALAYSIA_STATES } from '../data/volterraData';
import { ShoeVisual } from '../components/ShoeVisual';

interface CheckoutPageProps {
  directBuyItem: CartItem | null;
  clearDirectBuyItem: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  directBuyItem,
  clearDirectBuyItem,
}) => {
  const {
    cart,
    products,
    currentUser,
    appliedPromo,
    applyPromoCode,
    createOrder,
    addToast,
  } = useStore();
  const { navigate } = useRouter();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const defaultAddr = currentUser?.addresses?.[0];
  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: defaultAddr?.fullName || 'Aiman Hakim bin Azman',
    phone: defaultAddr?.phone || '+60 12-348 9921',
    email: defaultAddr?.email || 'aiman.hakim@demo.my',
    address: defaultAddr?.address || 'No. 18, Jalan Tun Razak, Hampshire Park',
    postcode: defaultAddr?.postcode || '50450',
    city: defaultAddr?.city || 'Kuala Lumpur',
    state: defaultAddr?.state || 'Kuala Lumpur',
  });

  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethodType>('standard');
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodType>('Online Banking');
  const [selectedBank, setSelectedBank] = useState('Maybank2u (Demo)');
  const [selectedWallet, setSelectedWallet] = useState("Touch 'n Go eWallet (Demo)");
  const [promoCodeInput, setPromoCodeInput] = useState('');

  const activeItems = directBuyItem ? [directBuyItem] : cart;
  const enrichedItems = activeItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  if (enrichedItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-20 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-[#111113]">
          No items in checkout
        </h1>
        <p className="text-xs text-zinc-600">
          Add VOLTERRA footwear to your bag before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 rounded-lg bg-[#111113] text-white text-xs font-semibold"
        >
          RETURN TO SHOP
        </Link>
      </div>
    );
  }

  const subtotal = enrichedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discount = appliedPromo
    ? Number(((subtotal * appliedPromo.discountPercent) / 100).toFixed(2))
    : 0;
  const shippingFee =
    deliveryMethod === 'express' ? 15 : subtotal > 200 ? 0 : 8;
  const total = Number((subtotal - discount + shippingFee).toFixed(2));

  const validateStep1 = () => {
    if (
      !shipping.fullName.trim() ||
      !shipping.phone.trim() ||
      !shipping.email.trim() ||
      !shipping.address.trim() ||
      !shipping.postcode.trim() ||
      !shipping.city.trim() ||
      !shipping.state.trim()
    ) {
      addToast(
        'Missing shipping details',
        'Please complete all Malaysia shipping fields before continuing.',
        'error'
      );
      return false;
    }
    return true;
  };

  const handleConfirmOrder = () => {
    createOrder({
      shippingAddress: shipping,
      deliveryMethod,
      paymentMethod,
      directBuyItem: directBuyItem || undefined,
    });
    if (directBuyItem) {
      clearDirectBuyItem();
    }
    navigate('/order-confirmation');
  };

  const stepsList = [
    { num: 1, label: 'Shipping Info' },
    { num: 2, label: 'Delivery Method' },
    { num: 3, label: 'Demo Payment' },
    { num: 4, label: 'Order Review' },
    { num: 5, label: 'Confirmation' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header & 5-Step Progress Indicator */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#E1381C]">
              VOLTERRA MALAYSIA CHECKOUT
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111113]">
              COMPLETE YOUR ORDER
            </h1>
          </div>
          {directBuyItem && (
            <button
              type="button"
              onClick={() => {
                clearDirectBuyItem();
                navigate('/cart');
              }}
              className="text-xs font-semibold text-zinc-500 hover:text-[#111113]"
            >
              Switch to Full Shopping Cart →
            </button>
          )}
        </div>

        {/* 5-Step Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {stepsList.map((s) => {
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <button
                key={s.num}
                type="button"
                disabled={s.num === 5 || s.num > step}
                onClick={() => {
                  if (s.num < step) setStep(s.num as 1 | 2 | 3 | 4);
                }}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  isActive
                    ? 'bg-[#111113] text-white border-[#111113]'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200 cursor-pointer'
                    : 'bg-[#F9F9F8] text-zinc-400 border-zinc-200'
                }`}
              >
                <p className="font-mono-num text-[11px] font-semibold">
                  STEP {s.num}
                </p>
                <p className="text-xs font-bold mt-0.5 truncate">{s.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active Checkout Step */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80">
          {/* STEP 1: SHIPPING INFORMATION (MALAYSIA) */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-zinc-200">
                <p className="text-xs font-mono-num font-semibold text-[#E1381C]">
                  STEP 1 OF 5
                </p>
                <h2 className="font-display text-xl font-bold text-[#111113] mt-0.5">
                  Shipping Information (Malaysia)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#111113] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.fullName}
                    onChange={(e) =>
                      setShipping({ ...shipping, fullName: e.target.value })
                    }
                    placeholder="e.g. Aiman Hakim bin Azman"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-[#111113]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#111113] mb-1.5">
                    Phone Number (Malaysia) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={shipping.phone}
                    onChange={(e) =>
                      setShipping({ ...shipping, phone: e.target.value })
                    }
                    placeholder="+60 12-345 6789"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-[#111113]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#111113] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={shipping.email}
                    onChange={(e) =>
                      setShipping({ ...shipping, email: e.target.value })
                    }
                    placeholder="athlete@domain.my"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-[#111113]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#111113] mb-1.5">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.address}
                    onChange={(e) =>
                      setShipping({ ...shipping, address: e.target.value })
                    }
                    placeholder="Unit, Building, Street Name, Taman / Section"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-[#111113]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#111113] mb-1.5">
                    Postcode *
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.postcode}
                    onChange={(e) =>
                      setShipping({ ...shipping, postcode: e.target.value })
                    }
                    placeholder="50450"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 font-mono-num focus:outline-none focus:border-[#111113]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#111113] mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.city}
                    onChange={(e) =>
                      setShipping({ ...shipping, city: e.target.value })
                    }
                    placeholder="e.g. Kuala Lumpur, Petaling Jaya, Johor Bahru"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-[#111113]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="checkout-state-select"
                    className="block font-semibold text-[#111113] mb-1.5"
                  >
                    State / Federal Territory *
                  </label>
                  <select
                    id="checkout-state-select"
                    value={shipping.state}
                    onChange={(e) =>
                      setShipping({ ...shipping, state: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:border-[#111113]"
                  >
                    {MALAYSIA_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                  className="px-6 py-3 rounded-lg bg-[#111113] hover:bg-[#E1381C] text-white text-xs font-semibold tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>CONTINUE TO DELIVERY METHOD</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DELIVERY METHOD */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-zinc-200">
                <p className="text-xs font-mono-num font-semibold text-[#E1381C]">
                  STEP 2 OF 5
                </p>
                <h2 className="font-display text-xl font-bold text-[#111113] mt-0.5">
                  Select Delivery Method
                </h2>
              </div>

              {subtotal > 200 && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <Truck className="w-4 h-4 shrink-0" />
                  <span>
                    FREE STANDARD SHIPPING applied automatically (Order exceeds RM200).
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('standard')}
                  className={`p-5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    deliveryMethod === 'standard'
                      ? 'border-[#111113] bg-[#F9F9F8]'
                      : 'border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base font-bold text-[#111113]">
                      Standard Delivery
                    </span>
                    <span className="font-mono-num text-sm font-bold text-[#E1381C]">
                      {subtotal > 200 ? 'FREE (RM0)' : 'RM8.00'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 mt-1">
                    3–5 working days across Peninsular & East Malaysia
                  </p>
                  {subtotal > 200 && (
                    <p className="text-[11px] font-semibold text-emerald-700 mt-2">
                      FREE STANDARD SHIPPING (Orders &gt; RM200)
                    </p>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('express')}
                  className={`p-5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    deliveryMethod === 'express'
                      ? 'border-[#111113] bg-[#F9F9F8]'
                      : 'border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base font-bold text-[#111113]">
                      Express Delivery
                    </span>
                    <span className="font-mono-num text-sm font-bold text-[#111113]">
                      RM15.00
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 mt-1">
                    1–2 working days priority air & courier dispatch
                  </p>
                </button>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-lg border border-zinc-300 text-xs font-semibold text-zinc-700 hover:border-[#111113] flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-lg bg-[#111113] hover:bg-[#E1381C] text-white text-xs font-semibold tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>CONTINUE TO PAYMENT METHOD</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DEMO PAYMENT UI */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-zinc-200">
                <p className="text-xs font-mono-num font-semibold text-[#E1381C]">
                  STEP 3 OF 5
                </p>
                <h2 className="font-display text-xl font-bold text-[#111113] mt-0.5">
                  Payment Method (Demo Payment)
                </h2>
              </div>

              {/* Mandatory Security Notice */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">DEMO PAYMENT SIMULATION</p>
                  <p className="mt-0.5 leading-relaxed">
                    This is a safe Demo Payment interface. Do not enter real credit card numbers, CVVs, banking passwords, or OTP credentials. Clicking confirm will simulate a successful transaction.
                  </p>
                </div>
              </div>

              {/* 4 Payment Method Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {[
                  {
                    id: 'Credit/Debit Card' as PaymentMethodType,
                    label: 'Credit / Debit Card',
                    sub: 'Visa / Mastercard (Simulated)',
                    Icon: CreditCard,
                  },
                  {
                    id: 'Online Banking' as PaymentMethodType,
                    label: 'Online Banking (FPX)',
                    sub: 'Maybank2u, CIMB Clicks, RHB, Public Bank',
                    Icon: Building2,
                  },
                  {
                    id: 'E-Wallet' as PaymentMethodType,
                    label: 'E-Wallet Malaysia',
                    sub: "Touch 'n Go eWallet, GrabPay, Boost",
                    Icon: Wallet,
                  },
                  {
                    id: 'Cash on Delivery' as PaymentMethodType,
                    label: 'Cash on Delivery (COD)',
                    sub: 'Pay in RM upon courier delivery',
                    Icon: Banknote,
                  },
                ].map(({ id, label, sub, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPaymentMethod(id)}
                    className={`p-4 rounded-xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${
                      paymentMethod === id
                        ? 'border-[#111113] bg-[#F9F9F8]'
                        : 'border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-[#E1381C] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#111113]">{label}</p>
                      <p className="text-zinc-500 mt-0.5">{sub}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Contextual Demo Payment Box (No real sensitive inputs) */}
              <div className="p-4 rounded-xl bg-[#F9F9F8] border border-zinc-200/80 text-xs space-y-3">
                {paymentMethod === 'Credit/Debit Card' && (
                  <div className="space-y-2">
                    <p className="font-semibold text-[#111113]">
                      Demo Card Token Active
                    </p>
                    <p className="font-mono-num text-zinc-600">
                      Simulated Card: •••• •••• •••• 4242 (VOLTERRA Demo Sandbox — No real card number or CVV collected)
                    </p>
                  </div>
                )}

                {paymentMethod === 'Online Banking' && (
                  <div className="space-y-2">
                    <label className="block font-semibold text-[#111113]">
                      Select Demo FPX Bank:
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full sm:w-72 px-3 py-2 rounded-lg bg-white border border-zinc-300"
                    >
                      <option>Maybank2u (Demo)</option>
                      <option>CIMB Clicks (Demo)</option>
                      <option>Public Bank FPX (Demo)</option>
                      <option>RHB Now (Demo)</option>
                      <option>Hong Leong Connect (Demo)</option>
                      <option>Bank Islam FPX (Demo)</option>
                    </select>
                  </div>
                )}

                {paymentMethod === 'E-Wallet' && (
                  <div className="space-y-2">
                    <label className="block font-semibold text-[#111113]">
                      Select Demo E-Wallet Provider:
                    </label>
                    <select
                      value={selectedWallet}
                      onChange={(e) => setSelectedWallet(e.target.value)}
                      className="w-full sm:w-72 px-3 py-2 rounded-lg bg-white border border-zinc-300"
                    >
                      <option>Touch &apos;n Go eWallet (Demo)</option>
                      <option>GrabPay Malaysia (Demo)</option>
                      <option>Boost Wallet (Demo)</option>
                      <option>MAE by Maybank2u (Demo)</option>
                    </select>
                  </div>
                )}

                {paymentMethod === 'Cash on Delivery' && (
                  <div className="space-y-1 text-zinc-700">
                    <p className="font-semibold text-[#111113]">
                      Cash on Delivery (COD) Selected
                    </p>
                    <p>
                      Prepare exact amount of{' '}
                      <strong className="font-mono-num text-[#111113]">
                        RM{total.toFixed(2)}
                      </strong>{' '}
                      upon delivery to {shipping.city}, {shipping.state}.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-lg border border-zinc-300 text-xs font-semibold text-zinc-700 hover:border-[#111113] flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-3 rounded-lg bg-[#111113] hover:bg-[#E1381C] text-white text-xs font-semibold tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>REVIEW YOUR ORDER</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER REVIEW */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-zinc-200">
                <p className="text-xs font-mono-num font-semibold text-[#E1381C]">
                  STEP 4 OF 5
                </p>
                <h2 className="font-display text-xl font-bold text-[#111113] mt-0.5">
                  Order Review & Confirmation
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#F9F9F8] border border-zinc-200/80 space-y-1">
                  <p className="font-bold text-[#111113]">Shipping To</p>
                  <p className="font-semibold text-zinc-800">{shipping.fullName}</p>
                  <p className="text-zinc-600">{shipping.phone}</p>
                  <p className="text-zinc-600">
                    {shipping.address}, {shipping.postcode} {shipping.city},{' '}
                    {shipping.state}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F9F9F8] border border-zinc-200/80 space-y-1">
                  <p className="font-bold text-[#111113]">Delivery Method</p>
                  <p className="font-semibold text-zinc-800">
                    {deliveryMethod === 'express'
                      ? 'Express Delivery (1–2 working days)'
                      : 'Standard Delivery (3–5 working days)'}
                  </p>
                  <p className="font-mono-num text-[#E1381C] font-semibold">
                    {shippingFee === 0 ? 'FREE SHIPPING' : `RM${shippingFee.toFixed(2)}`}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F9F9F8] border border-zinc-200/80 space-y-1">
                  <p className="font-bold text-[#111113]">Payment Method</p>
                  <p className="font-semibold text-zinc-800">{paymentMethod}</p>
                  <p className="text-emerald-700 font-medium">
                    Demo Payment Ready
                  </p>
                </div>
              </div>

              {/* Items Review */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-[#111113]">
                  VOLTERRA Items ({enrichedItems.length})
                </h3>
                <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-xl overflow-hidden">
                  {enrichedItems.map((item) => (
                    <div
                      key={`${item.productId}-${item.color}-${item.size}`}
                      className="p-3.5 bg-white flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <ShoeVisual
                          src={item.product.images.main}
                          alt={item.product.name}
                          color={item.color}
                          aspectClass="aspect-square"
                          className="w-14 h-14 rounded shrink-0"
                        />
                        <div>
                          <p className="font-bold text-[#111113]">
                            {item.product.name}
                          </p>
                          <p className="text-zinc-500">
                            Colour: {item.color} · Size: {item.size} · Qty:{' '}
                            {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono-num font-bold text-[#111113]">
                        RM{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 rounded-lg border border-zinc-300 text-xs font-semibold text-zinc-700 hover:border-[#111113] flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  className="px-8 py-3.5 rounded-lg bg-[#E1381C] hover:bg-[#c82d13] text-white text-xs font-semibold tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PLACE DEMO ORDER · RM{total.toFixed(2)}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Order Summary */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-zinc-200/80 space-y-5 lg:sticky lg:top-20">
          <h2 className="font-display text-base font-bold text-[#111113] pb-3 border-b border-zinc-200">
            ORDER SUMMARY
          </h2>

          {/* Promo Input inside Checkout too */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                placeholder="Promo code (VOLT10)"
                className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 text-xs font-mono-num uppercase"
              />
              <button
                type="button"
                onClick={() => {
                  if (promoCodeInput.trim()) {
                    applyPromoCode(promoCodeInput);
                    setPromoCodeInput('');
                  }
                }}
                className="px-3.5 py-2 rounded-lg bg-[#111113] text-white text-xs font-semibold cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="space-y-2.5 text-xs pt-2 border-t border-zinc-100">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal</span>
              <span className="font-mono-num font-semibold text-[#111113]">
                RM{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Discount {appliedPromo ? `(${appliedPromo.code})` : ''}</span>
              <span className="font-mono-num font-semibold text-emerald-700">
                -RM{discount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>
                Shipping ({deliveryMethod === 'express' ? 'Express' : 'Standard'})
              </span>
              <span className="font-mono-num font-semibold text-[#111113]">
                {shippingFee === 0 ? 'FREE' : `RM${shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="pt-3 border-t border-zinc-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-[#111113]">Total</span>
              <span className="font-mono-num text-xl font-bold text-[#111113]">
                RM{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OrderConfirmationPage: React.FC = () => {
  const { lastConfirmedOrder, orders } = useStore();
  const order = lastConfirmedOrder || orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-[#111113]">
          No recent order found
        </h1>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 rounded-lg bg-[#111113] text-white text-xs font-semibold"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-16">
      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-zinc-200/80 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-widest text-[#E1381C]">
            STEP 5 COMPLETE · OFFICIAL RECEIPT
          </p>
          <h1 className="font-display text-3xl font-extrabold text-[#111113]">
            ORDER CONFIRMED
          </h1>
          <p className="text-sm text-zinc-600">Thank you for your order.</p>
        </div>

        <div className="bg-[#F9F9F8] p-6 rounded-xl border border-zinc-200/80 text-left grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <p className="text-zinc-500">Order Number:</p>
            <p className="font-mono-num text-sm font-bold text-[#111113] mt-0.5">
              {order.id}
            </p>
          </div>
          <div>
            <p className="text-zinc-500">Total:</p>
            <p className="font-mono-num text-sm font-bold text-[#E1381C] mt-0.5">
              RM{order.total.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-zinc-500">Estimated Delivery:</p>
            <p className="font-semibold text-[#111113] mt-0.5">
              {order.estimatedDelivery}
            </p>
          </div>
        </div>

        <div className="text-left space-y-2 text-xs text-zinc-600 border-t border-zinc-100 pt-4">
          <p>
            <strong className="text-[#111113]">Recipient:</strong>{' '}
            {order.shippingAddress.fullName} ({order.shippingAddress.phone})
          </p>
          <p>
            <strong className="text-[#111113]">Shipping Address:</strong>{' '}
            {order.shippingAddress.address}, {order.shippingAddress.postcode}{' '}
            {order.shippingAddress.city}, {order.shippingAddress.state}
          </p>
          <p>
            <strong className="text-[#111113]">Payment Method:</strong>{' '}
            {order.paymentMethod} ({order.paymentStatus})
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={`/orders/${order.id}`}
            className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-[#111113] hover:bg-[#E1381C] text-white text-xs font-semibold tracking-wider transition-colors"
          >
            TRACK ORDER
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto px-7 py-3.5 rounded-lg border border-zinc-300 hover:border-[#111113] text-[#111113] text-xs font-semibold tracking-wider transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </div>
  );
};

const TIMELINE_STAGES: OrderStatus[] = [
  'Order Placed',
  'Payment Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

function getStageIndex(status: OrderStatus): number {
  if (status === 'Pending') return 0;
  if (status === 'Confirmed') return 1;
  const idx = TIMELINE_STAGES.indexOf(status);
  return idx >= 0 ? idx : 1;
}

export const OrderTrackingPage: React.FC<{ orderId?: string }> = ({
  orderId,
}) => {
  const { orders, updateOrderStatus } = useStore();
  const { navigate } = useRouter();

  const selectedOrder = orderId
    ? orders.find((o) => o.id.toLowerCase() === orderId.toLowerCase())
    : null;

  // If no specific orderId or showing /orders list
  if (!orderId || !selectedOrder) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        <div className="pb-6 border-b border-zinc-200/80 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#E1381C]">
              LOGISTICS & DISPATCH
            </p>
            <h1 className="font-display text-3xl font-extrabold text-[#111113] mt-1">
              MY VOLTERRA ORDERS ({orders.length})
            </h1>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-zinc-600 hover:text-[#111113]"
          >
            Shop New Gear →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-zinc-200 text-center space-y-4">
            <Package className="w-10 h-10 text-zinc-400 mx-auto" />
            <h2 className="font-display text-xl font-bold text-[#111113]">
              No orders found
            </h2>
            <Link
              to="/shop"
              className="inline-block px-6 py-2.5 rounded-lg bg-[#111113] text-white text-xs font-semibold"
            >
              EXPLORE SHOES
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white p-5 rounded-xl border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-mono-num font-bold text-[#111113]">
                      {ord.id}
                    </span>
                    <span>·</span>
                    <span className="font-mono-num text-zinc-500">
                      {ord.date}
                    </span>
                    <span>·</span>
                    <span className="font-semibold text-[#E1381C]">
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-700">
                    {ord.items.map((i) => `${i.productName} (${i.size})`).join(', ')}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Ship to: {ord.shippingAddress.city}, {ord.shippingAddress.state}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono-num text-sm font-bold text-[#111113]">
                    RM{ord.total.toFixed(2)}
                  </span>
                  <Link
                    to={`/orders/${ord.id}`}
                    className="px-4 py-2 rounded-lg bg-[#111113] hover:bg-[#E1381C] text-white text-xs font-semibold transition-colors whitespace-nowrap"
                  >
                    TRACK ORDER
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const activeIdx = getStageIndex(selectedOrder.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/orders')}
          className="text-xs font-semibold text-zinc-600 hover:text-[#111113] flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Orders</span>
        </button>
        <span className="font-mono-num text-xs text-zinc-500">
          Estimated Delivery: {selectedOrder.estimatedDelivery}
        </span>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200/80 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#E1381C]">
              LIVE SHIPMENT TIMELINE
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111113] mt-1">
              ORDER {selectedOrder.id}
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Placed on {selectedOrder.date} · Total:{' '}
              <strong className="font-mono-num text-[#111113]">
                RM{selectedOrder.total.toFixed(2)}
              </strong>
            </p>
          </div>

          {/* Demo Simulator to test stage progression */}
          <div className="flex flex-col items-start sm:items-end gap-1">
            <label className="text-[11px] text-zinc-500">
              Simulate Tracking Stage (Demo):
            </label>
            <select
              value={TIMELINE_STAGES[activeIdx]}
              onChange={(e) =>
                updateOrderStatus(selectedOrder.id, e.target.value as OrderStatus)
              }
              className="px-3 py-1.5 rounded-lg border border-zinc-300 text-xs font-semibold bg-[#F9F9F8]"
            >
              {TIMELINE_STAGES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 7-Stage Vertical Timeline */}
        <div className="max-w-lg mx-auto py-2">
          {TIMELINE_STAGES.map((stage, index) => {
            const isCompleted = index <= activeIdx;
            const isCurrent = index === activeIdx;
            const isLast = index === TIMELINE_STAGES.length - 1;

            return (
              <div key={stage} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-mono-num text-xs font-bold border-2 transition-colors ${
                      isCurrent
                        ? 'bg-[#E1381C] text-white border-[#E1381C] ring-4 ring-[#E1381C]/20'
                        : isCompleted
                        ? 'bg-[#111113] text-white border-[#111113]'
                        : 'bg-white text-zinc-400 border-zinc-300'
                    }`}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  {!isLast && (
                    <div
                      className={`w-0.5 h-10 my-1 ${
                        index < activeIdx ? 'bg-[#111113]' : 'bg-zinc-200'
                      }`}
                    />
                  )}
                </div>

                <div className="pt-1 pb-6">
                  <p
                    className={`text-sm font-bold ${
                      isCompleted ? 'text-[#111113]' : 'text-zinc-400'
                    }`}
                  >
                    {stage}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {stage === 'Order Placed' &&
                      'Order registered at VOLTERRA Malaysia Fulfilment Hub.'}
                    {stage === 'Payment Confirmed' &&
                      `Verified via ${selectedOrder.paymentMethod}.`}
                    {stage === 'Processing' &&
                      'Quality inspection & size verification in Shah Alam warehouse.'}
                    {stage === 'Packed' &&
                      'Protective VOLTERRA shoebox sealed for dispatch.'}
                    {stage === 'Shipped' &&
                      'Handed over to express linehaul courier.'}
                    {stage === 'Out for Delivery' &&
                      `Out with local delivery rider in ${selectedOrder.shippingAddress.city}.`}
                    {stage === 'Delivered' &&
                      `Delivered to ${selectedOrder.shippingAddress.fullName}.`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Shipping & Items Summary */}
        <div className="pt-6 border-t border-zinc-200 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-[#F9F9F8] border border-zinc-200/80 space-y-1.5">
            <p className="font-bold text-[#111113] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#E1381C]" />
              <span>Delivery Destination</span>
            </p>
            <p className="font-semibold text-zinc-800">
              {selectedOrder.shippingAddress.fullName}
            </p>
            <p className="text-zinc-600">{selectedOrder.shippingAddress.phone}</p>
            <p className="text-zinc-600">
              {selectedOrder.shippingAddress.address},{' '}
              {selectedOrder.shippingAddress.postcode}{' '}
              {selectedOrder.shippingAddress.city},{' '}
              {selectedOrder.shippingAddress.state}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F9F9F8] border border-zinc-200/80 space-y-2">
            <p className="font-bold text-[#111113]">Items in Shipment</p>
            {selectedOrder.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-zinc-700"
              >
                <span>
                  {item.productName} ({item.color} · {item.size}) × {item.quantity}
                </span>
                <span className="font-mono-num font-semibold text-[#111113]">
                  RM{(item.unitPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
