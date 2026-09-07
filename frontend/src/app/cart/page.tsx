"use client";

import { useCart } from "../../context/CartContext";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { useState, useEffect } from "react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartCount, subtotal, deliveryFee, discountAmount, grandTotal, isMounted } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isMounted) {
    return (
      <div className="w-full bg-[#FAF9F6] min-h-[70vh] py-12 px-4 flex items-center justify-center font-sans">
        <div className="text-center font-bold text-slate-500">Loading Shopping Cart...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-black text-slate-900">Your Shopping Cart 🛍️</h1>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-bold text-rose-500 hover:text-rose-700 underline"
            >
              Empty Cart
            </button>
          )}
        </div>
        <p className="text-slate-500 text-sm font-semibold mb-8">
          You have <span className="text-pink-500 font-extrabold">{cartCount}</span> item{cartCount === 1 ? '' : 's'} in your bag.
        </p>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-200">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Your Bag is Empty</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
              Looks like you haven&apos;t added any toys yet! Explore our certified marketplace and find something magical.
            </p>
            <Link
              href="/products"
              className="bg-pink-500 text-white px-8 py-3 rounded-full font-black text-sm shadow-md hover:bg-pink-600 transition-colors inline-block"
            >
              Start Shopping &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-2xl bg-slate-50 flex-shrink-0"
                    />
                    <div>
                      <Link href={`/products/${item.id}`} className="font-extrabold text-slate-900 text-sm hover:text-pink-500 transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      
                      {/* Vendor Attribution */}
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-600 my-1">
                        <ShieldCheck size={13} className="text-sky-500" />
                        <span>Sold by: {item.vendorName || "ABC Toys Wonderland"}</span>
                      </div>

                      <div className="text-xs font-black text-slate-700">₹{item.price} each</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 mt-2 sm:mt-0">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-2.5 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-slate-600 hover:text-pink-500 p-0.5 font-bold"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-black px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-slate-600 hover:text-pink-500 p-0.5 font-bold"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-slate-900 text-base">
                        ₹{item.price * item.quantity}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 mt-1"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-black text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm font-semibold text-slate-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-black text-slate-900">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-rose-500">
                    <span>Special Savings</span>
                    <span className="font-black">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="font-black text-emerald-600">
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-[11px] text-pink-500 font-bold">
                    Add ₹{999 - subtotal} more for FREE shipping!
                  </p>
                )}
                <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
                  <span>Total Amount</span>
                  <span className="text-pink-500">₹{grandTotal}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-3.5 rounded-full font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 text-center"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Safe 256-Bit SSL Checkout</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
