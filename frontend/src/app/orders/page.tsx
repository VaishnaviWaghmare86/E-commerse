"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, Order } from "../../services/api";
import { Package, ShieldCheck, Clock, CheckCircle2, Truck, Sparkles, ArrowRight } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const list = await api.getOrders();
        setOrders(list);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
              My Orders 📦 <Sparkles className="text-yellow-500" size={24} />
            </h1>
            <p className="text-slate-500 text-sm font-semibold mt-1">
              Track delivery progress and inspect vendor attributions for your toys.
            </p>
          </div>
          <Link
            href="/products"
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2.5 rounded-full font-black text-xs shadow-md transition-all inline-block"
          >
            Explore More Toys
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-16 bg-slate-100 rounded-2xl"></div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-200">
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">No Orders Placed Yet</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
              You haven&apos;t ordered any toys yet! Explore our catalog and surprise your little ones.
            </p>
            <Link
              href="/products"
              className="bg-pink-500 text-white px-8 py-3 rounded-full font-black text-sm shadow-md hover:bg-pink-600 transition-colors inline-block"
            >
              Browse Toys &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusColors: Record<string, string> = {
                Pending: "bg-amber-100 text-amber-800 border-amber-200",
                Confirmed: "bg-blue-100 text-blue-800 border-blue-200",
                Processing: "bg-purple-100 text-purple-800 border-purple-200",
                Shipped: "bg-sky-100 text-sky-800 border-sky-200",
                Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
                Cancelled: "bg-rose-100 text-rose-800 border-rose-200",
              };

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-base">{order.orderNumber}</span>
                        <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${statusColors[order.status] || "bg-slate-100 text-slate-700"}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-semibold mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-slate-900">₹{order.totalAmount}</div>
                      <div className="text-xs text-emerald-600 font-bold">{order.paymentStatus} ({order.paymentMethod})</div>
                    </div>
                  </div>

                  {/* Multi-Vendor Items List */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Ordered Toys &amp; Sellers
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 rounded-2xl p-3 flex items-center justify-between gap-3 border border-slate-100"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image || "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=200&h=200&fit=crop"}
                              alt=""
                              className="w-14 h-14 object-cover rounded-xl bg-white flex-shrink-0"
                            />
                            <div>
                              <div className="font-extrabold text-slate-900 text-xs line-clamp-1">{item.name}</div>
                              <div className="text-[10px] text-sky-600 font-bold mt-0.5 flex items-center gap-1">
                                <ShieldCheck size={12} className="text-sky-500" />
                                <span>Sold by: {item.vendorName || "ABC Toys Wonderland"}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                Qty: {item.quantity} × ₹{item.price}
                              </div>
                            </div>
                          </div>
                          <div className="text-right font-black text-slate-900 text-xs">
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping & Delivery Timeline */}
                  <div className="bg-gradient-to-r from-pink-50/50 to-sky-50/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-semibold text-slate-600">
                    <div>
                      <span className="font-bold text-slate-800">Delivering to: </span>
                      <span>{typeof order.shippingAddress === "string" ? order.shippingAddress : "Customer Destination"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sky-700 font-extrabold flex-shrink-0">
                      <Truck size={16} />
                      <span>Estimated Doorstep Arrival in 2-3 Business Days</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
