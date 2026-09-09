import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/Badge';
import { Modal, ConfirmModal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';
import { Plus, Trash2, TicketPercent, Calendar } from 'lucide-react';
import type { Coupon } from '../types';

export const Coupons: React.FC = () => {
  const { coupons, addCoupon, deleteCoupon } = useAdmin();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  // Form state
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [minimumOrder, setMinimumOrder] = useState<number>(999);
  const [maximumDiscount, setMaximumDiscount] = useState<number>(500);
  const [usageLimit, setUsageLimit] = useState<number>(500);
  const [perUserLimit, setPerUserLimit] = useState<number>(1);
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-10-31');
  const [status, setStatus] = useState<'Active' | 'Expired' | 'Disabled'>('Active');

  const openAddModal = () => {
    setCode('');
    setDiscountType('percentage');
    setDiscountValue(20);
    setMinimumOrder(999);
    setMaximumDiscount(500);
    setUsageLimit(500);
    setPerUserLimit(1);
    setStartDate('2026-09-01');
    setEndDate('2026-10-31');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      showToast('Coupon code is required', 'error');
      return;
    }

    addCoupon({
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      minimumOrder: Number(minimumOrder),
      maximumDiscount: Number(maximumDiscount),
      usageLimit: Number(usageLimit),
      perUserLimit: Number(perUserLimit),
      startDate,
      endDate,
      status,
    });

    showToast(`Coupon ${code.toUpperCase()} created successfully`, 'success');
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (couponToDelete) {
      deleteCoupon(couponToDelete.id);
      showToast(`Coupon ${couponToDelete.code} deleted`, 'success');
      setCouponToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupons & Discount Codes"
        description="Configure promotional vouchers, percentage discounts, minimum spends, and usage ceilings"
        breadcrumbs={[{ label: 'Marketing', href: '/admin/banners' }, { label: 'Coupons' }]}
        actions={
          <Button onClick={openAddModal} leftIcon={<Plus className="w-4 h-4" />}>
            Create Coupon
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coupon Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Min Order</TableHead>
                <TableHead>Redemption Usage</TableHead>
                <TableHead>Validity Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#ff91db] flex items-center justify-center">
                        <TicketPercent className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-mono font-bold text-slate-900 text-xs tracking-wider">
                        {c.code}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-xs text-slate-900">
                      {c.discountType === 'percentage'
                        ? `${c.discountValue}% OFF`
                        : `₹${c.discountValue} FLAT OFF`}
                    </span>
                    {c.maximumDiscount && c.discountType === 'percentage' && (
                      <span className="text-[10px] text-slate-400 block">
                        Max ₹{c.maximumDiscount}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-slate-700 font-medium">
                    ₹{c.minimumOrder.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-800">
                        {c.usageCount} / {c.usageLimit}
                      </span>
                      <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div
                          className="bg-[#ff91db] h-full rounded-full"
                          style={{
                            width: `${Math.min(100, (c.usageCount / c.usageLimit) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {c.startDate} ~ {c.endDate}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={c.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => setCouponToDelete(c)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Coupon Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Coupon"
        description="Configure discount rules, spend limits, and coupon expiration"
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button size="sm" onClick={handleSaveCoupon}>
              Save Coupon
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSaveCoupon} className="space-y-4">
          <Input
            label="Coupon Code *"
            placeholder="e.g. DIWALI100, KIDSPLAY20"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Discount Type *"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as any)}
              options={[
                { value: 'percentage', label: 'Percentage (%) Discount' },
                { value: 'fixed', label: 'Fixed Amount (₹) Off' },
              ]}
            />
            <Input
              type="number"
              label={discountType === 'percentage' ? 'Discount Percentage (%) *' : 'Discount Amount (₹) *'}
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Minimum Order Amount (₹)"
              value={minimumOrder}
              onChange={(e) => setMinimumOrder(Number(e.target.value))}
            />
            <Input
              type="number"
              label="Maximum Discount Cap (₹)"
              value={maximumDiscount}
              onChange={(e) => setMaximumDiscount(Number(e.target.value))}
              disabled={discountType === 'fixed'}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Total Redemptions Limit"
              value={usageLimit}
              onChange={(e) => setUsageLimit(Number(e.target.value))}
            />
            <Input
              type="number"
              label="Limit Per Customer"
              value={perUserLimit}
              onChange={(e) => setPerUserLimit(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      {couponToDelete && (
        <ConfirmModal
          isOpen={!!couponToDelete}
          onClose={() => setCouponToDelete(null)}
          onConfirm={handleDelete}
          title="Delete Coupon?"
          message={`Are you sure you want to delete coupon code "${couponToDelete.code}"? Customers will no longer be able to apply this discount at checkout.`}
          confirmText="Delete Coupon"
          isDanger
        />
      )}
    </div>
  );
};
