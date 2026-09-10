import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Switch } from '../components/ui/Switch';
import { Tabs } from '../components/ui/Tabs';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, useParams } from 'react-router-dom';
import {
  UploadCloud,
  Trash2,
  Info,
  DollarSign,
  FolderTree,
  Image as ImageIcon,
  SlidersHorizontal,
  Boxes,
  Globe,
  ArrowLeft,
  Plus,
  X,
  Tag,
  Layers,
  Palette,
} from 'lucide-react';
import type { ProductStatus } from '../types';

export const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const {
    products,
    addProduct,
    updateProduct,
    categories,
    attributes,
    addAttribute,
    addAttributeValue,
  } = useAdmin();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('basic');
  const [inlineAttrInputs, setInlineAttrInputs] = useState<Record<string, string>>({});
  const [openInlineInputId, setOpenInlineInputId] = useState<string | null>(null);

  const handleAddInlineValue = (attrId: string, attrName: string) => {
    const val = inlineAttrInputs[attrId]?.trim();
    if (!val) return;

    // Add to global catalog attributes
    addAttributeValue(attrId, val);

    // Also immediately select this value for the product
    const current = formData.selectedAttributes[attrName] || [];
    if (!current.includes(val)) {
      setFormData((prev) => ({
        ...prev,
        selectedAttributes: {
          ...prev.selectedAttributes,
          [attrName]: [...current, val],
        },
      }));
    }

    setInlineAttrInputs((prev) => ({ ...prev, [attrId]: '' }));
    setOpenInlineInputId(null);
    showToast(`Added and selected "${val}" for ${attrName}`, 'success');
  };

  const getAttrIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('brand')) return <Tag className="w-3.5 h-3.5 text-[#ff91db]" />;
    if (lower.includes('material') || lower.includes('fabric')) return <Layers className="w-3.5 h-3.5 text-[#ff91db]" />;
    if (lower.includes('pattern') || lower.includes('print')) return <Palette className="w-3.5 h-3.5 text-[#ff91db]" />;
    return <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff91db]" />;
  };

  // Form State with lazy initialization
  const [formData, setFormData] = useState(() => {
    if (isEdit && id) {
      const existing = products.find((p) => p.id === id);
      if (existing) {
        return {
          name: existing.name,
          slug: existing.slug,
          sku: existing.sku,
          shortDescription: existing.shortDescription,
          description: existing.description,
          price: existing.price,
          salePrice: existing.salePrice || existing.price,
          discount: existing.discount || 0,
          category: existing.category,
          subCategory: existing.subCategory || '',
          stock: existing.stock,
          status: existing.status,
          featured: existing.featured,
          isBestSeller: Boolean(existing.isBestSeller),
          isNewArrival: Boolean(existing.isNewArrival),
          image: existing.image,
          galleryImages: existing.galleryImages || [],
          selectedAttributes: existing.attributes || {},
          metaTitle: `${existing.name} | KidsPlay Store`,
          metaDescription: existing.shortDescription,
        };
      }
    }

    return {
      name: '',
      slug: '',
      sku: '',
      shortDescription: '',
      description: '',
      price: 999,
      salePrice: 799,
      discount: 20,
      category: 'Toys',
      subCategory: 'Soft Toys',
      stock: 25,
      status: 'Active' as ProductStatus,
      featured: false,
      isBestSeller: false,
      isNewArrival: false,
      image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400&auto=format&fit=crop&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&auto=format&fit=crop&q=80',
      ],
      selectedAttributes: {
        Color: ['Red', 'Blue'],
        'Age Group': ['3-5 Years'],
      } as Record<string, string[]>,
      metaTitle: '',
      metaDescription: '',
    };
  });

  // Handle auto-generating slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }));
  };

  // Image upload mock handler
  const handleMockImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fakeUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: fakeUrl,
        galleryImages: [...prev.galleryImages, fakeUrl],
      }));
      showToast('Image uploaded to local preview successfully', 'info');
    }
  };

  const removeGalleryImage = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.sku.trim()) {
      showToast('Please fill in Product Name and SKU', 'error');
      setActiveTab('basic');
      return;
    }

    if (isEdit && id) {
      updateProduct(id, {
        name: formData.name,
        slug: formData.slug,
        sku: formData.sku,
        shortDescription: formData.shortDescription,
        description: formData.description,
        price: Number(formData.price),
        salePrice: Number(formData.salePrice),
        discount: Number(formData.discount),
        category: formData.category,
        subCategory: formData.subCategory,
        stock: Number(formData.stock),
        status: formData.status,
        featured: formData.featured,
        isBestSeller: formData.isBestSeller,
        isNewArrival: formData.isNewArrival,
        image: formData.image,
        galleryImages: formData.galleryImages,
        attributes: formData.selectedAttributes,
      });
      showToast('Product updated successfully', 'success');
    } else {
      addProduct({
        name: formData.name,
        slug: formData.slug || 'product-' + Date.now(),
        sku: formData.sku,
        shortDescription: formData.shortDescription || 'KidsPlay top certified product.',
        description: formData.description || 'Full product description.',
        price: Number(formData.price),
        salePrice: Number(formData.salePrice),
        discount: Number(formData.discount),
        category: formData.category,
        subCategory: formData.subCategory,
        stock: Number(formData.stock),
        status: formData.status,
        featured: formData.featured,
        isBestSeller: formData.isBestSeller,
        isNewArrival: formData.isNewArrival,
        image: formData.image,
        galleryImages: formData.galleryImages,
        attributes: formData.selectedAttributes,
        rating: 5.0,
      });
      showToast('Product created successfully', 'success');
    }

    navigate('/admin/products');
  };

  const formTabs = [
    { id: 'basic', label: 'Basic Info', icon: <Info className="w-3.5 h-3.5" /> },
    { id: 'pricing', label: 'Pricing', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { id: 'category', label: 'Category', icon: <FolderTree className="w-3.5 h-3.5" /> },
    { id: 'media', label: 'Media & Images', icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { id: 'attributes', label: 'Attributes', icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
    { id: 'inventory', label: 'Inventory', icon: <Boxes className="w-3.5 h-3.5" /> },
    { id: 'seo', label: 'SEO Settings', icon: <Globe className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? 'Edit Product' : 'Add New Product'}
        description={
          isEdit
            ? `Modify details and catalog data for ${formData.name || 'product'}`
            : 'Fill in details to list a new toy, learning kit or apparel item'
        }
        breadcrumbs={[
          { label: 'Catalog', href: '/admin/products' },
          { label: 'Products', href: '/admin/products' },
          { label: isEdit ? 'Edit Product' : 'New Product' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/admin/products')}
            >
              Cancel
            </Button>
            <Button type="button" size="md" onClick={handleSubmit}>
              {isEdit ? 'Save Changes' : 'Publish Product'}
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Tabs bar */}
          <div className="px-6 pt-2 bg-slate-50/50 border-b border-slate-200">
            <Tabs tabs={formTabs} activeTab={activeTab} onChange={setActiveTab} />
          </div>

          <div className="p-6 sm:p-8">
            {/* 1. Basic Information */}
            {activeTab === 'basic' && (
              <div className="space-y-4 max-w-2xl animate-in fade-in duration-200">
                <Input
                  label="Product Name *"
                  placeholder="e.g. Remote Control High-Speed Racing Car"
                  value={formData.name}
                  onChange={handleNameChange}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Slug (URL key)"
                    placeholder="e.g. remote-control-car"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                  <Input
                    label="SKU (Stock Keeping Unit) *"
                    placeholder="e.g. RC-CAR-001"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    required
                  />
                </div>

                <Textarea
                  label="Short Description"
                  placeholder="Brief catchy sentence summarizing the toy's benefits"
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                />

                <Textarea
                  label="Full Description"
                  placeholder="Detailed specifications, safety certificates, materials, and care instructions..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />

                {/* Badges & Flags */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Customer Badges & Ordering Tags
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select which badges are displayed to customers when viewing or ordering this toy:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Best Seller Checkbox/Card */}
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                        formData.isBestSeller
                          ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400/30'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.isBestSeller}
                        onChange={(e) =>
                          setFormData({ ...formData, isBestSeller: e.target.checked })
                        }
                        className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                      />
                      <div className="flex-1">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          🔥 Best Seller
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                          Shows "Best Seller" badge when customer views and orders this toy
                        </p>
                      </div>
                    </label>

                    {/* New Arrival Checkbox/Card */}
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                        formData.isNewArrival
                          ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/30'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.isNewArrival}
                        onChange={(e) =>
                          setFormData({ ...formData, isNewArrival: e.target.checked })
                        }
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <div className="flex-1">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          ✨ New Arrival
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                          Shows "New Arrival" badge to highlight fresh toys to customers
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Featured Switch */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <Switch
                      label="Featured Product"
                      description="Highlight this product on the store homepage hero spotlight"
                      checked={formData.featured}
                      onChange={(checked: boolean) => setFormData({ ...formData, featured: checked })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Pricing */}
            {activeTab === 'pricing' && (
              <div className="space-y-4 max-w-xl animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    label="Base / Regular Price (₹) *"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                  />
                  <Input
                    type="number"
                    label="Sale Price (₹)"
                    value={formData.salePrice}
                    onChange={(e) => {
                      const sp = Number(e.target.value);
                      const disc = formData.price > 0 ? Math.round(((formData.price - sp) / formData.price) * 100) : 0;
                      setFormData({ ...formData, salePrice: sp, discount: Math.max(0, disc) });
                    }}
                  />
                </div>

                <div className="p-4 bg-pink-50/60 border border-pink-100 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#ff91db]">Calculated Discount</span>
                    <p className="text-xs text-slate-500">Customer savings percentage shown as badge</p>
                  </div>
                  <span className="text-base font-extrabold text-[#ff91db]">
                    {formData.discount}% OFF
                  </span>
                </div>
              </div>
            )}

            {/* 3. Category */}
            {activeTab === 'category' && (
              <div className="space-y-4 max-w-xl animate-in fade-in duration-200">
                <Select
                  label="Primary Category *"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  options={categories.map((c) => ({ value: c.name, label: c.name }))}
                />

                <Input
                  label="Subcategory"
                  placeholder="e.g. Soft Toys, Vehicles, Puzzles, Robotics"
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                />
              </div>
            )}

            {/* 4. Media */}
            {activeTab === 'media' && (
              <div className="space-y-6 max-w-2xl animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Main Display Image
                  </label>
                  <div className="flex items-center gap-4">
                    <img
                      src={formData.image}
                      alt="Main Preview"
                      className="w-24 h-24 rounded-xl object-cover border-2 border-slate-200 shadow-xs"
                    />
                    <div className="flex-1">
                      <Input
                        label="Image URL"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Drag-and-drop dropzone mock */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Upload Additional Gallery Images
                  </label>
                  <label className="border-2 border-dashed border-slate-200 hover:border-[#ff91db] bg-slate-50 hover:bg-pink-50/20 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                    <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-[#ff91db] mb-2 transition-colors" />
                    <span className="text-xs font-semibold text-slate-700">
                      Click to upload or drag and drop images
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      PNG, JPG, WEBP up to 5MB (handled locally in state)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMockImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Gallery previews */}
                {formData.galleryImages.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-slate-700 block mb-2">
                      Gallery Images ({formData.galleryImages.length})
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {formData.galleryImages.map((imgUrl, i) => (
                        <div key={i} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                          <img src={imgUrl} alt={`gallery-${i}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(i)}
                            className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. Attributes */}
            {activeTab === 'attributes' && (
              <div className="space-y-5 max-w-2xl animate-in fade-in duration-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Product Attributes</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select or add custom Brand, Material, Pattern, Color and Age Group for this item.
                    </p>
                  </div>
                </div>

                {attributes.map((attr) => {
                  const currentSelected = formData.selectedAttributes[attr.name] || [];
                  return (
                    <div key={attr.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          {getAttrIcon(attr.name)}
                          {attr.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {currentSelected.length} selected
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 items-center">
                        {attr.values.map((val) => {
                          const isChecked = currentSelected.includes(val);
                          return (
                            <button
                              type="button"
                              key={val}
                              onClick={() => {
                                const updated = isChecked
                                  ? currentSelected.filter((v) => v !== val)
                                  : [...currentSelected, val];
                                setFormData({
                                  ...formData,
                                  selectedAttributes: {
                                    ...formData.selectedAttributes,
                                    [attr.name]: updated,
                                  },
                                });
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                                isChecked
                                  ? 'bg-[#ff91db] text-white border-[#ff91db]'
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}

                        {/* Inline Quick Add button / input for this attribute */}
                        {openInlineInputId === attr.id ? (
                          <div className="inline-flex items-center gap-1 bg-white border border-[#ffd0ef] rounded-lg p-0.5 shadow-2xs">
                            <input
                              type="text"
                              autoFocus
                              placeholder={`New ${attr.name.toLowerCase()}...`}
                              value={inlineAttrInputs[attr.id] || ''}
                              onChange={(e) =>
                                setInlineAttrInputs({
                                  ...inlineAttrInputs,
                                  [attr.id]: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddInlineValue(attr.id, attr.name);
                                } else if (e.key === 'Escape') {
                                  setOpenInlineInputId(null);
                                }
                              }}
                              className="px-2 py-0.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none w-32 sm:w-40"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddInlineValue(attr.id, attr.name)}
                              className="px-2 py-1 text-[11px] font-bold bg-[#ff91db] text-white rounded-md hover:bg-[#eb70c3] cursor-pointer"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => setOpenInlineInputId(null)}
                              className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setOpenInlineInputId(attr.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#ff91db] bg-[#ffe3f5]/60 hover:bg-[#ffe3f5] border border-dashed border-[#ffd0ef] transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            Add {attr.name}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Quick Add missing attributes banner */}
                <div className="p-4 bg-pink-50/40 rounded-xl border border-dashed border-pink-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Need more attributes for your store?
                      </span>
                      <span className="text-[11px] text-slate-500">
                        1-click add Brand, Material, Pattern, or Demographics
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        {
                          name: 'Brand',
                          values: [
                            'KidsPlay Signature',
                            'Fisher-Price',
                            'Lego',
                            'Barbie',
                            "Carter's",
                          ],
                        },
                        {
                          name: 'Material',
                          values: [
                            'Organic Cotton',
                            'Natural Wood',
                            'ABS Plastic',
                            'Plush Fleece',
                            'Silicone (BPA Free)',
                          ],
                        },
                        {
                          name: 'Pattern',
                          values: [
                            'Solid',
                            'Striped',
                            'Dinosaur Print',
                            'Animal Cartoon',
                            'Floral',
                            'Polka Dots',
                          ],
                        },
                        { name: 'Gender', values: ['Unisex', 'Boys', 'Girls'] },
                      ]
                        .filter(
                          (p) =>
                            !attributes.some(
                              (a) => a.name.toLowerCase() === p.name.toLowerCase()
                            )
                        )
                        .map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              addAttribute(preset.name, preset.values);
                              showToast(
                                `Added ${preset.name} attribute with starter values!`,
                                'success'
                              );
                            }}
                            className="px-2.5 py-1 text-xs font-semibold bg-white text-[#ff91db] hover:bg-[#ff91db] hover:text-white border border-[#ffd0ef] rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            {preset.name}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Inventory */}
            {activeTab === 'inventory' && (
              <div className="space-y-4 max-w-xl animate-in fade-in duration-200">
                <Input
                  type="number"
                  label="Current In-Stock Quantity *"
                  value={formData.stock}
                  onChange={(e) => {
                    const stock = Number(e.target.value);
                    setFormData({
                      ...formData,
                      stock,
                      status: stock === 0 ? 'Out of Stock' : formData.status,
                    });
                  }}
                  required
                />

                <Select
                  label="Product Status *"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatus })}
                  options={[
                    { value: 'Active', label: 'Active (Visible on store)' },
                    { value: 'Draft', label: 'Draft (Hidden from store)' },
                    { value: 'Out of Stock', label: 'Out of Stock' },
                  ]}
                />
              </div>
            )}

            {/* 7. SEO Settings */}
            {activeTab === 'seo' && (
              <div className="space-y-4 max-w-xl animate-in fade-in duration-200">
                <Input
                  label="Meta Title"
                  placeholder="e.g. Remote Control High Speed Car | KidsPlay"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  helperText="Recommended length: 50-60 characters"
                />

                <Textarea
                  label="Meta Description"
                  placeholder="Brief summary for Google search engine results"
                  rows={3}
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  helperText="Recommended length: 140-160 characters"
                />
              </div>
            )}

            {/* Bottom Form Actions */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activeTab !== 'basic' && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const idx = formTabs.findIndex((t) => t.id === activeTab);
                      if (idx > 0) setActiveTab(formTabs[idx - 1].id);
                    }}
                  >
                    ← Previous Step
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {activeTab !== 'seo' ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const idx = formTabs.findIndex((t) => t.id === activeTab);
                      if (idx < formTabs.length - 1) setActiveTab(formTabs[idx + 1].id);
                    }}
                  >
                    Next Step →
                  </Button>
                ) : null}
                <Button type="submit" size="sm">
                  {isEdit ? 'Save Changes' : 'Create Product'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
