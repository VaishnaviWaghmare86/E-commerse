import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Switch } from '../components/ui/Switch';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Store,
  Phone,
  Globe,
  Share2,
  Palette,
  Sliders,
  Check,
  ShieldCheck,
  UserPlus,
  Key,
  Shield,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useAdmin();
  const { user, registeredAccounts, createShopkeeperAccount } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('store');
  const [formData, setFormData] = useState({ ...settings });

  // Form state for creating a new shopkeeper account
  const [newShopkeeper, setNewShopkeeper] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    storeName: '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    showToast('Store settings saved successfully', 'success');
  };

  const handleCreateShopkeeper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopkeeper.username || !newShopkeeper.password || !newShopkeeper.email) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    const res = createShopkeeperAccount(newShopkeeper);
    if (res.success) {
      showToast(`Shopkeeper account for ${newShopkeeper.name} created successfully!`, 'success');
      setNewShopkeeper({
        name: '',
        username: '',
        email: '',
        password: '',
        storeName: '',
      });
    } else {
      showToast(res.message || 'Failed to create shopkeeper account', 'error');
    }
  };

  const tabs = [
    { id: 'store', label: 'Store Info', icon: <Store className="w-3.5 h-3.5" /> },
    { id: 'authority', label: 'Admin & Shopkeepers', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'contact', label: 'Contact', icon: <Phone className="w-3.5 h-3.5" /> },
    { id: 'seo', label: 'Search SEO', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'social', label: 'Social Links', icon: <Share2 className="w-3.5 h-3.5" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-3.5 h-3.5" /> },
    { id: 'general', label: 'General & Alerts', icon: <Sliders className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Store Settings & Authority"
        description="Manage your storefront profile, authorized admin & shopkeeper credentials, styling, and alerts"
        breadcrumbs={[{ label: 'Settings' }]}
        actions={
          activeTab !== 'authority' ? (
            <Button onClick={handleSave} leftIcon={<Check className="w-4 h-4" />}>
              Save Changes
            </Button>
          ) : undefined
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 pt-2 bg-slate-50/50 border-b border-slate-200 overflow-x-auto">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="p-6 sm:p-8 max-w-3xl">
          {/* Store Info */}
          {activeTab === 'store' && (
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Store Display Name *"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                required
              />
              <Input
                label="Store Tagline"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Store Currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  options={[
                    { value: 'INR (₹)', label: 'Indian Rupee (INR ₹)' },
                    { value: 'USD ($)', label: 'US Dollar (USD $)' },
                    { value: 'EUR (€)', label: 'Euro (EUR €)' },
                    { value: 'GBP (£)', label: 'British Pound (GBP £)' },
                  ]}
                />
                <Input
                  label="Currency Symbol"
                  value={formData.currencySymbol}
                  onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                />
              </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit" size="sm">
                  Save Store Info
                </Button>
              </div>
            </form>
          )}

          {/* Admin & Shopkeepers Authority Tab */}
          {activeTab === 'authority' && (
            <div className="space-y-8">
              {/* Current Session Overview */}
              <div className="p-4 bg-violet-50/60 border border-violet-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7e14ff] to-[#47bfff] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {user?.name ? user.name.charAt(0) : 'A'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-800">{user?.name || 'Administrator'}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        user?.role === 'ADMIN' ? 'bg-[#eedffc] text-[#7e14ff]' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user?.role || 'ADMIN'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Logged in as {user?.email} • {user?.storeName || 'Primary Store'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Registered Accounts List */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#7e14ff]" />
                  Authorized Portal Accounts ({registeredAccounts.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Only users with an authorized Super Admin or registered Shopkeeper account can sign in to the Admin Panel.
                </p>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {registeredAccounts.map((acc) => (
                    <div key={acc.id} className="p-3.5 bg-white hover:bg-slate-50 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          acc.role === 'ADMIN' ? 'bg-purple-100 text-[#7e14ff]' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {acc.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-800">{acc.name}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                              acc.role === 'ADMIN' ? 'bg-[#eedffc] text-[#7e14ff]' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {acc.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Username: <code className="font-mono text-slate-600">{acc.username}</code> • Email: {acc.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs text-slate-500 font-medium">{acc.storeName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pre-Configured Default Credentials Callout */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-500" />
                  Pre-Configured Default Sign-In Credentials
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="font-semibold text-slate-800 text-xs">Super Admin Account</p>
                    <p className="text-[11px] text-slate-500 mt-1">Username: <code className="text-[#7e14ff] font-bold">admin</code></p>
                    <p className="text-[11px] text-slate-500">Email: <code className="text-[#7e14ff]">admin@kidsplaystore.com</code></p>
                    <p className="text-[11px] text-slate-500">Password: <code className="text-[#7e14ff] font-bold">admin123</code></p>
                    <p className="text-[10px] text-emerald-600 font-medium mt-1">Authority: Full Storefront & Operations Control</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="font-semibold text-slate-800 text-xs">Shopkeeper Account</p>
                    <p className="text-[11px] text-slate-500 mt-1">Username: <code className="text-[#7e14ff] font-bold">shopkeeper</code></p>
                    <p className="text-[11px] text-slate-500">Email: <code className="text-[#7e14ff]">shopkeeper@kidsplaystore.com</code></p>
                    <p className="text-[11px] text-slate-500">Password: <code className="text-[#7e14ff] font-bold">shopkeeper123</code></p>
                    <p className="text-[10px] text-blue-600 font-medium mt-1">Authority: Store Inventory, Catalog & Orders</p>
                  </div>
                </div>
              </div>

              {/* Create New Shopkeeper Account Form */}
              <div className="border-t border-slate-200 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <UserPlus className="w-4 h-4 text-[#7e14ff]" />
                  <h3 className="text-sm font-bold text-slate-900">Register New Shopkeeper Account</h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Create a new authorized login for store managers or vendor shopkeepers.
                </p>

                <form onSubmit={handleCreateShopkeeper} className="bg-slate-50/50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Shopkeeper Name *"
                      placeholder="e.g. Ramesh Kumar"
                      value={newShopkeeper.name}
                      onChange={(e) => setNewShopkeeper({ ...newShopkeeper, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Store / Outlet Name"
                      placeholder="e.g. Toy Junction Mall Outlet"
                      value={newShopkeeper.storeName}
                      onChange={(e) => setNewShopkeeper({ ...newShopkeeper, storeName: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Username *"
                      placeholder="e.g. ramesh_shop"
                      value={newShopkeeper.username}
                      onChange={(e) => setNewShopkeeper({ ...newShopkeeper, username: e.target.value })}
                      required
                    />
                    <Input
                      label="Email Address *"
                      type="email"
                      placeholder="e.g. ramesh@kidsplaystore.com"
                      value={newShopkeeper.email}
                      onChange={(e) => setNewShopkeeper({ ...newShopkeeper, email: e.target.value })}
                      required
                    />
                    <Input
                      label="Password *"
                      type="password"
                      placeholder="••••••••"
                      value={newShopkeeper.password}
                      onChange={(e) => setNewShopkeeper({ ...newShopkeeper, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button type="submit" size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>
                      Create Shopkeeper Account
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Contact Information */}
          {activeTab === 'contact' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Customer Support Email"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
                <Input
                  label="Support Phone Number"
                  type="tel"
                  value={formData.supportPhone}
                  onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                />
              </div>
              <Input
                label="Store Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                <Input
                  label="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
                <Input
                  label="Zip / Postal Code"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
              </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit" size="sm">
                  Save Contact Settings
                </Button>
              </div>
            </form>
          )}

          {/* SEO Settings */}
          {activeTab === 'seo' && (
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Meta Title (Storefront Homepage)"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              />
              <Textarea
                label="Meta Description"
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                rows={3}
              />
              <Input
                label="SEO Keywords (comma-separated)"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              />
              <div className="pt-4 flex justify-end">
                <Button type="submit" size="sm">
                  Save SEO Settings
                </Button>
              </div>
            </form>
          )}

          {/* Social Links */}
          {activeTab === 'social' && (
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Instagram Profile URL"
                placeholder="https://instagram.com/kidsplay"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
              />
              <Input
                label="Facebook Page URL"
                placeholder="https://facebook.com/kidsplay"
                value={formData.facebookUrl}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
              />
              <Input
                label="YouTube Channel URL"
                placeholder="https://youtube.com/@kidsplay"
                value={formData.youtubeUrl}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
              />
              <div className="pt-4 flex justify-end">
                <Button type="submit" size="sm">
                  Save Social Links
                </Button>
              </div>
            </form>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Primary Brand Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <span className="font-mono text-xs font-bold text-slate-700">
                    {formData.primaryColor}
                  </span>
                  <span className="text-xs text-slate-400">
                    (KidsPlay signature purple accent)
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <p className="font-semibold text-slate-800 mb-1">Storefront & Admin Theme</p>
                <p>
                  The Admin Panel maintains a clean, minimal white & soft gray SaaS palette to keep focus on sales metrics, orders, and catalog data.
                </p>
              </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit" size="sm">
                  Save Appearance
                </Button>
              </div>
            </form>
          )}

          {/* General & Alerts */}
          {activeTab === 'general' && (
            <form onSubmit={handleSave} className="space-y-5">
              <Switch
                label="Enable Automatic Low Stock Alerts"
                description="Display warning tags and dashboard alerts when SKU inventory drops below the threshold"
                checked={formData.enableStockAlerts}
                onChange={(checked: boolean) => setFormData({ ...formData, enableStockAlerts: checked })}
              />

              <Input
                type="number"
                label="Default Low Stock Threshold Quantity"
                value={formData.lowStockThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })
                }
                helperText="Units count at which warning badges trigger"
              />
              <div className="pt-4 flex justify-end">
                <Button type="submit" size="sm">
                  Save General Settings
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
