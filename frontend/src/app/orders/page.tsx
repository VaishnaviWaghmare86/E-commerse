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
    <div className="w-full bg-[#0F1026] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans text-white">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              My Orders 📦 <Sparkles className="text-[#FFD447]" size={24} />
            </h1>
            <p className="text-[#D9DBF0] text-sm font-semibold mt-1">
              Track delivery progress and inspect vendor attributions for your toys.
            </p>
          </div>
          <Link
            href="/products"
            className="bg-gradient-to-r from-[#7C3CFF] to-[#9147FF] hover:from-[#9147FF] hover:to-[#FF4FA3] text-white px-6 py-2.5 rounded-full font-black text-xs shadow-md shadow-[#7C3CFF]/30 transition-all inline-block active:scale-95"
          >
            Explore More Toys
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="bg-[#20224A] rounded-3xl p-6 shadow-xl border border-[#3A3D70] animate-pulse space-y-4">
                <div className="h-4 bg-[#171936] rounded w-1/4"></div>
                <div className="h-16 bg-[#171936] rounded-2xl"></div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#20224A] rounded-3xl p-12 text-center shadow-xl border border-[#3A3D70]">
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="text-2xl font-black text-white mb-2">No Orders Placed Yet</h2>
            <p className="text-[#D9DBF0] text-sm mb-6 max-w-sm mx-auto">
              You haven&apos;t ordered any toys yet! Explore our catalog and surprise your little ones.
            </p>
            <Link
              href="/products"
              className="bg-gradient-to-r from-[#7C3CFF] to-[#9147FF] hover:from-[#9147FF] hover:to-[#FF4FA3] text-white px-8 py-3 rounded-full font-black text-sm shadow-md shadow-[#7C3CFF]/30 transition-all inline-block"
            >
              Browse Toys &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusColors: Record<string, string> = {
                Pending: "bg-[#FFD447]/15 text-[#FFD447] border-[#FFD447]/30",
                Confirmed: "bg-[#28B8FF]/15 text-[#28B8FF] border-[#28B8FF]/30",
                Processing: "bg-[#7C3CFF]/15 text-[#9147FF] border-[#7C3CFF]/30",
                Shipped: "bg-[#28B8FF]/15 text-[#28B8FF] border-[#28B8FF]/30",
                Delivered: "bg-[#48D597]/15 text-[#48D597] border-[#48D597]/30",
                Cancelled: "bg-[#FF4FA3]/15 text-[#FF4FA3] border-[#FF4FA3]/30",
              };

              return (
                <div
                  key={order.id}
                  className="bg-[#20224A] rounded-3xl p-6 shadow-xl border border-[#3A3D70] space-y-6"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#3A3D70]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-base">{order.orderNumber}</span>
                        <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${statusColors[order.status] || "bg-[#171936] text-[#D9DBF0] border-[#3A3D70]"}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-[#A8ACCA] font-semibold mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-[#FFD447]">₹{order.totalAmount}</div>
                      <div className="text-xs text-[#48D597] font-bold">{order.paymentStatus} ({order.paymentMethod})</div>
                    </div>
                  </div>

                  {/* Multi-Vendor Items List */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#A8ACCA]">
                      Ordered Toys &amp; Sellers
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-[#171936] rounded-2xl p-3 flex items-center justify-between gap-3 border border-[#3A3D70]"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image || "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=200&h=200&fit=crop"}
                              alt=""
                              className="w-14 h-14 object-cover rounded-xl bg-[#0F1026] flex-shrink-0"
                            />
                            <div>
                              <div className="font-extrabold text-white text-xs line-clamp-1">{item.name}</div>
                              <div className="text-[10px] text-[#28B8FF] font-bold mt-0.5 flex items-center gap-1">
                                <ShieldCheck size={12} className="text-[#28B8FF]" />
                                <span>Sold by: {item.vendorName || "ABC Toys Wonderland"}</span>
                              </div>
                              <div className="text-[10px] text-[#A8ACCA] font-semibold mt-0.5">
                                Qty: {item.quantity} × ₹{item.price}
                              </div>
                            </div>
                          </div>
                          <div className="text-right font-black text-[#FFD447] text-xs">
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping & Delivery Timeline */}
                  <div className="bg-[#171936] border border-[#3A3D70] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-semibold text-[#D9DBF0]">
                    <div>
                      <span className="font-bold text-white">Delivering to: </span>
                      <span>{typeof order.shippingAddress === "string" ? order.shippingAddress : "Customer Destination"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#28B8FF] font-extrabold flex-shrink-0">
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
