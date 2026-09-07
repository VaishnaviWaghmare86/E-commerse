import React from 'react';
import { Modal } from '../components/ui/Modal';
import { StatusBadge } from '../components/ui/Badge';
import { useAdmin } from '../context/AdminContext';
import type { Customer } from '../types';
import { Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';

interface CustomerDetailsModalProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  customer,
  isOpen,
  onClose,
}) => {
  const { orders } = useAdmin();

  // Find orders belonging to this customer
  const customerOrders = orders.filter(
    (o) => o.customerEmail.toLowerCase() === customer.email.toLowerCase()
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Customer Profile"
      description={`Member since ${customer.joinedDate}`}
      size="lg"
      footer={
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Close
        </button>
      }
    >
      <div className="space-y-5">
        {/* Customer Header */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
          <img
            src={customer.avatar}
            alt={customer.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 truncate">{customer.name}</h3>
              <StatusBadge status={customer.status} />
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {customer.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {customer.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                Lifetime Orders
              </span>
              <span className="text-lg font-bold text-slate-900">{customer.totalOrders}</span>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h12" />
                <path d="M6 8h12" />
                <path d="m6 13 8.5 8" />
                <path d="M6 13h3" />
                <path d="M9 13c6.667 0 6.667-10 0-10" />
              </svg>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                Total Spend
              </span>
              <span className="text-lg font-bold text-slate-900">₹{customer.totalSpent.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Default Delivery Address
          </span>
          <p className="text-xs text-slate-700 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{customer.address}</span>
          </p>
        </div>

        {/* Recent Orders by this customer */}
        <div className="border border-slate-200/80 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/80">
            <span className="text-xs font-bold text-slate-800">
              Orders History ({customerOrders.length})
            </span>
          </div>
          {customerOrders.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No orders found for this customer profile yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
              {customerOrders.map((ord) => (
                <div key={ord.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-900">{ord.orderNumber}</span>
                    <span className="text-slate-400 block text-[11px]">{ord.productSummary}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-800">₹{ord.totalAmount.toLocaleString()}</span>
                    <div className="mt-0.5">
                      <StatusBadge status={ord.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
