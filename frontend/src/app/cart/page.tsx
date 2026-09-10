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
      <div className="w-full bg-[#0F1026] min-h-[70vh] py-12 px-4 flex items-center justify-center font-sans text-white">
        <div className="text-center font-bold text-[#A8ACCA] animate-pulse">Loading Shopping Cart...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0F1026] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-black text-white">Your Shopping Cart 🛍️</h1>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-bold text-[#FF4FA3] hover:text-white underline transition-colors cursor-pointer"
            >
              Empty Cart
            </button>
          )}
        </div>
        <p className="text-[#D9DBF0] text-sm font-semibold mb-8 flex items-center gap-1.5">
          You have <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-[#7C3CFF]/25 border border-[#7C3CFF]/40 text-[#FFD447] font-black text-sm">{cartCount}</span> item{cartCount === 1 ? '' : 's'} in your bag.
        </p>

        {cart.length === 0 ? (
          <div className="bg-[#20224A] rounded-3xl p-12 text-center shadow-xl border border-[#3A3D70]">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-black text-white mb-2">Your Bag is Empty</h2>
            <p className="text-[#D9DBF0] text-sm mb-6 max-w-sm mx-auto">
              Looks like you haven&apos;t added any toys yet! Explore our certified marketplace and find something magical.
            </p>
            <Link
              href="/products"
              className="bg-gradient-to-r from-[#7C3CFF] to-[#9147FF] hover:from-[#9147FF] hover:to-[#FF4FA3] text-white px-8 py-3 rounded-full font-black text-sm shadow-md shadow-[#7C3CFF]/30 transition-all inline-block"
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
                  className="bg-[#20224A] hover:bg-[#282B59] rounded-3xl p-5 shadow-lg border border-[#3A3D70] hover:border-[#7C3CFF] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-2xl bg-[#171936] p-1 border border-[#3A3D70] flex-shrink-0"
                    />
                    <div>
                      <Link href={`/products/${item.id}`} className="font-extrabold text-white text-sm hover:text-[#FFD447] transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      
                      {/* Vendor Attribution */}
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#28B8FF] my-1">
                        <ShieldCheck size={13} className="text-[#28B8FF]" />
                        <span>Sold by: {item.vendorName || "ABC Toys Wonderland"}</span>
                      </div>

                      <div className="text-xs font-black text-[#FFD447]">₹{item.price} each</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 mt-2 sm:mt-0">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-[#171936] border border-[#3A3D70] rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-[#20224A] hover:bg-[#282B59] text-white hover:text-[#FFD447] flex items-center justify-center font-bold border border-[#3A3D70] transition-all active:scale-95 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} strokeWidth={2.5} />
                      </button>
                      <span className="min-w-[28px] text-center font-black text-sm text-white select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-[#20224A] hover:bg-[#282B59] text-white hover:text-[#FFD447] flex items-center justify-center font-bold border border-[#3A3D70] transition-all active:scale-95 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} strokeWidth={2.5} />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-[#FFD447] text-base">
                        ₹{item.price * item.quantity}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#FF4FA3] hover:text-white p-1 mt-1 cursor-pointer transition-colors"
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
            <div className="bg-[#20224A] rounded-3xl p-6 shadow-xl border border-[#3A3D70]">
              <h2 className="text-lg font-black text-white mb-4 pb-2 border-b border-[#3A3D70]">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm font-semibold text-[#D9DBF0] mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-black text-white">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#48D597]">
                    <span>Special Savings</span>
                    <span className="font-black">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="font-black text-[#48D597]">
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-[11px] text-[#FFD447] font-bold">
                    Add ₹{999 - subtotal} more for FREE shipping!
                  </p>
                )}
                <div className="flex justify-between items-baseline text-base font-black text-white pt-3 border-t border-[#3A3D70]">
                  <span>Total Amount</span>
                  <span className="text-2xl font-black text-[#FFD447]">₹{grandTotal}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-gradient-to-r from-[#7C3CFF] to-[#9147FF] hover:from-[#9147FF] hover:to-[#FF4FA3] text-white py-3.5 rounded-full font-black text-sm shadow-md shadow-[#7C3CFF]/30 transition-all flex items-center justify-center gap-2 text-center active:scale-95"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-[#A8ACCA]">
                <ShieldCheck size={14} className="text-[#48D597]" />
                <span>Safe 256-Bit SSL Checkout</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
