import React, { useState, useRef } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Modal, ConfirmModal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';
import {
  Plus,
  Star,
  Package,
  UploadCloud,
  Trash2,
  Link as LinkIcon,
  Check,
  FolderOpen,
  ChevronRight,
  ExternalLink,
  Edit2,
  X,
  Search,
  Tag,
} from 'lucide-react';
import type { Collection } from '../types';

export const Collections: React.FC = () => {
  const {
    collections,
    products,
    addCollection,
    updateCollection,
    deleteCollection,
    toggleCollectionStatus,
    addProductToCollection,
    removeProductFromCollection,
  } = useAdmin();
  const { showToast } = useToast();

  const defaultSampleImage =
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&auto=format&fit=crop&q=80';

  // Opened Collection Details Modal
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  // Create Collection Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [fileName, setFileName] = useState('');
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Collection Modal State
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editFeatured, setEditFeatured] = useState(false);
  const [editStatus, setEditStatus] = useState<'Active' | 'Inactive'>('Active');
  const [editImageMode, setEditImageMode] = useState<'upload' | 'url'>('upload');
  const [editFileName, setEditFileName] = useState('');
  const [isEditDragging, setIsEditDragging] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Delete confirmation
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);

  // Add Product to Collection Picker Modal
  const [isAddProductPickerOpen, setIsAddProductPickerOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  // Active opened collection object derived from context
  const activeCollection = collections.find((c) => c.id === selectedCollectionId) || null;

  // Products belonging to the active collection
  const activeCollectionProducts = activeCollection
    ? products.filter((p) => activeCollection.productIds?.includes(p.id))
    : [];

  // Available products in catalog that are not yet in the active collection
  const availableProductsToAdd = activeCollection
    ? products.filter(
        (p) =>
          !activeCollection.productIds?.includes(p.id) &&
          (p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
            p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
            p.sku.toLowerCase().includes(productSearch.toLowerCase()))
      )
    : [];

  // File Upload Handlers for Create
  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP, etc.)', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
        setFileName(file.name);
        showToast(`Image "${file.name}" loaded successfully`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // File Upload Handlers for Edit
  const handleEditFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP, etc.)', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditImage(reader.result);
        setEditFileName(file.name);
        showToast(`Image "${file.name}" updated successfully`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Collection name is required', 'error');
      return;
    }
    const finalImage = image.trim() || defaultSampleImage;
    addCollection({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      image: finalImage,
      productCount: 0,
      status: 'Active',
      featured: true,
      productIds: [],
    });
    showToast(`Collection "${name}" created successfully`, 'success');
    setIsCreateModalOpen(false);
    setName('');
    setDescription('');
    setImage('');
    setFileName('');
  };

  const openEditModal = (col: Collection) => {
    setEditingCollection(col);
    setEditName(col.name);
    setEditDescription(col.description);
    setEditImage(col.image);
    setEditFeatured(col.featured);
    setEditStatus(col.status);
    setEditFileName('');
    setEditImageMode('upload');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCollection) return;
    if (!editName.trim()) {
      showToast('Collection name is required', 'error');
      return;
    }
    updateCollection(editingCollection.id, {
      name: editName,
      slug: editName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: editDescription,
      image: editImage.trim() || editingCollection.image,
      featured: editFeatured,
      status: editStatus,
    });
    showToast(`Collection "${editName}" updated successfully`, 'success');
    setEditingCollection(null);
  };

  const handleDelete = () => {
    if (collectionToDelete) {
      deleteCollection(collectionToDelete.id);
      showToast(`Collection "${collectionToDelete.name}" deleted`, 'success');
      if (selectedCollectionId === collectionToDelete.id) {
        setSelectedCollectionId(null);
      }
      setCollectionToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing Collections"
        description="Curate thematic product bundles and special festive collections (click any card to open and manage products)"
        breadcrumbs={[{ label: 'Marketing', href: '/admin/banners' }, { label: 'Collections' }]}
        actions={
          <Button onClick={() => setIsCreateModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Create Collection
          </Button>
        }
      />

      {/* Collections Grid - Each Card is Clickable to Open */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {collections.map((col) => {
          const count = col.productIds ? col.productIds.length : col.productCount;
          return (
            <Card
              key={col.id}
              onClick={() => setSelectedCollectionId(col.id)}
              className="overflow-hidden flex flex-col justify-between cursor-pointer group hover:shadow-xl hover:border-[#ff91db]/50 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <StatusBadge status={col.status} />
                </div>
                {col.featured && (
                  <div className="absolute top-3 right-3 bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                    <Star className="w-3 h-3 fill-amber-950" /> Featured
                  </div>
                )}

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold gap-1.5 transition-opacity duration-200">
                  <FolderOpen className="w-4 h-4" />
                  <span>Click to Open Collection</span>
                </div>
              </div>

              <CardContent className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#ff91db] transition-colors leading-snug">
                    {col.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{col.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                    <Package className="w-3.5 h-3.5 text-slate-400" />
                    {count} {count === 1 ? 'product' : 'products'}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#ff91db] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Open
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCollectionStatus(col.id);
                        showToast(
                          `Collection marked as ${col.status === 'Active' ? 'Inactive' : 'Active'}`,
                          'info'
                        );
                      }}
                      className="text-[11px] text-slate-400 hover:text-slate-700 hover:underline cursor-pointer pl-2 border-l border-slate-200"
                    >
                      {col.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 1. OPENED COLLECTION DETAILS MODAL */}
      {activeCollection && (
        <Modal
          isOpen={!!selectedCollectionId}
          onClose={() => setSelectedCollectionId(null)}
          title={activeCollection.name}
          description="Collection overview, storefront routing, and assigned products"
          size="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(activeCollection)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit Collection</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCollectionToDelete(activeCollection);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => setSelectedCollectionId(null)}>
                  Done
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Top Collection Visual Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md">
              <img
                src={activeCollection.image}
                alt={activeCollection.name}
                className="w-full h-44 object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 flex flex-col justify-end text-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <StatusBadge status={activeCollection.status} />
                  {activeCollection.featured && (
                    <span className="bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                      <Star className="w-3 h-3 fill-amber-950" /> Featured Storefront
                    </span>
                  )}
                  <span className="text-xs text-slate-300 font-mono flex items-center gap-1 ml-auto">
                    <Tag className="w-3.5 h-3.5" />
                    /collections/{activeCollection.slug}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white drop-shadow-sm">
                  {activeCollection.name}
                </h3>
                <p className="text-xs text-slate-200 mt-1 drop-shadow-sm max-w-xl">
                  {activeCollection.description}
                </p>
              </div>
            </div>

            {/* Quick Link bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="font-semibold text-slate-700">Storefront URL:</span>
                <span className="font-mono text-[#ff91db] bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                  https://kidsplay.store/collections/{activeCollection.slug}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  showToast(
                    `Simulating navigation to storefront: /collections/${activeCollection.slug}`,
                    'info'
                  )
                }
                className="text-[#ff91db] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Assigned Products in this Collection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#ff91db]" />
                    <span>Products in this Collection</span>
                    <span className="px-2 py-0.5 rounded-full bg-pink-100 text-[#ff91db] text-xs font-bold">
                      {activeCollectionProducts.length}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Customers browsing this collection on the storefront will see these toys
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setProductSearch('');
                    setIsAddProductPickerOpen(true);
                  }}
                >
                  Add Products
                </Button>
              </div>

              {activeCollectionProducts.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs divide-y divide-slate-100">
                  {activeCollectionProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-3 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-900 truncate">{prod.name}</p>
                            {prod.isBestSeller && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 shrink-0">
                                🔥 Best Seller
                              </span>
                            )}
                            {prod.isNewArrival && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                                ✨ New Arrival
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                            <span className="font-mono">{prod.sku}</span>
                            <span>•</span>
                            <span>{prod.category}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-700">
                              ₹{prod.salePrice || prod.price}
                            </span>
                            <span>•</span>
                            <span
                              className={
                                prod.stock <= 5 ? 'text-amber-600 font-bold' : 'text-slate-500'
                              }
                            >
                              {prod.stock} in stock
                            </span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          removeProductFromCollection(activeCollection.id, prod.id);
                          showToast(
                            `Removed "${prod.name}" from ${activeCollection.name}`,
                            'info'
                          );
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                        title="Remove product from collection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No products assigned yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Add toys from your catalog to make this collection visible to customers.
                  </p>
                  <Button
                    size="sm"
                    className="mt-3"
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setProductSearch('');
                      setIsAddProductPickerOpen(true);
                    }}
                  >
                    Add Products Now
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* 2. ADD PRODUCTS TO COLLECTION PICKER MODAL */}
      {activeCollection && (
        <Modal
          isOpen={isAddProductPickerOpen}
          onClose={() => setIsAddProductPickerOpen(false)}
          title={`Add Products to "${activeCollection.name}"`}
          description="Select toys from your inventory catalog to bundle into this collection"
          size="lg"
          footer={
            <div className="flex items-center justify-end w-full">
              <Button size="sm" onClick={() => setIsAddProductPickerOpen(false)}>
                Done Adding
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Search filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search toys by title, SKU, or category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#ff91db]/20 focus:border-[#ff91db]"
              />
            </div>

            {/* List of Available Products */}
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white">
              {availableProductsToAdd.length > 0 ? (
                availableProductsToAdd.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{prod.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {prod.category} • ₹{prod.salePrice || prod.price} • {prod.stock} in stock
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        addProductToCollection(activeCollection.id, prod.id);
                        showToast(`Added "${prod.name}" to ${activeCollection.name}`, 'success');
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-[#ff91db] bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  {productSearch
                    ? 'No matching toys found'
                    : 'All catalog products are already added to this collection!'}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* 3. EDIT COLLECTION MODAL */}
      {editingCollection && (
        <Modal
          isOpen={!!editingCollection}
          onClose={() => setEditingCollection(null)}
          title="Edit Collection"
          description="Update collection title, cover visual, and featured status"
          size="lg"
          footer={
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                type="button"
                onClick={() => setEditingCollection(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <Button size="sm" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          }
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <Input
              label="Collection Title *"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />

            <Textarea
              label="Description"
              rows={3}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />

            {/* Cover Image Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Collection Cover Image
                </label>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium text-slate-600">
                  <button
                    type="button"
                    onClick={() => setEditImageMode('upload')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                      editImageMode === 'upload'
                        ? 'bg-white text-[#ff91db] font-bold shadow-2xs'
                        : 'text-slate-500'
                    }`}
                  >
                    <UploadCloud className="w-3 h-3" />
                    <span>Drag & Drop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditImageMode('url')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                      editImageMode === 'url'
                        ? 'bg-white text-[#ff91db] font-bold shadow-2xs'
                        : 'text-slate-500'
                    }`}
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>Paste Link</span>
                  </button>
                </div>
              </div>

              {editImageMode === 'upload' ? (
                <div>
                  {editImage ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-3 flex items-center gap-4">
                      <img
                        src={editImage}
                        alt="Cover Preview"
                        className="w-24 h-20 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold mb-0.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Image Ready</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {editFileName || 'Active Cover Image'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditImage('');
                          setEditFileName('');
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsEditDragging(true);
                      }}
                      onDragLeave={() => setIsEditDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsEditDragging(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleEditFileProcess(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => editFileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-7 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                        isEditDragging
                          ? 'border-[#ff91db] bg-pink-50/70 ring-4 ring-[#ff91db]/10 scale-[0.99]'
                          : 'border-slate-200 hover:border-[#ff91db] bg-slate-50/70 hover:bg-pink-50/20'
                      }`}
                    >
                      <input
                        ref={editFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleEditFileProcess(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                      <UploadCloud className="w-6 h-6 text-[#ff91db] mb-2" />
                      <span className="text-xs font-bold text-slate-800">
                        Click to replace or drag & drop new image
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <Input
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="Paste image URL here"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={editFeatured}
                  onChange={(e) => setEditFeatured(e.target.checked)}
                  className="rounded text-[#ff91db] focus:ring-[#ff91db] w-4 h-4"
                />
                <span>Featured Collection</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={editStatus === 'Active'}
                  onChange={(e) => setEditStatus(e.target.checked ? 'Active' : 'Inactive')}
                  className="rounded text-[#ff91db] focus:ring-[#ff91db] w-4 h-4"
                />
                <span>Active (Live on Storefront)</span>
              </label>
            </div>
          </form>
        </Modal>
      )}

      {/* 4. CREATE COLLECTION MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Marketing Collection"
        description="Bundle products under a seasonal or milestone theme"
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button size="sm" onClick={handleCreate}>
              Create Collection
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Collection Title *"
            placeholder="e.g. Summer Vacation STEM Kits"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Textarea
            label="Description"
            placeholder="Short pitch describing who this collection is made for..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Cover Image Section with Drag & Drop */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Collection Cover Image
              </label>

              {/* Mode switch: Drag & Drop vs URL */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium text-slate-600">
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    imageMode === 'upload'
                      ? 'bg-white text-[#ff91db] font-bold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <UploadCloud className="w-3 h-3" />
                  <span>Drag & Drop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    imageMode === 'url'
                      ? 'bg-white text-[#ff91db] font-bold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Paste Link</span>
                </button>
              </div>
            </div>

            {imageMode === 'upload' ? (
              <div>
                {image ? (
                  /* Loaded Image Preview */
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-3 flex items-center gap-4">
                    <img
                      src={image}
                      alt="Cover Preview"
                      className="w-24 h-20 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold mb-0.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>Image Ready</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {fileName || 'Uploaded Cover Image'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        This image will be displayed on the collection card and banner
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImage('');
                        setFileName('');
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* Drag & Drop Dropzone */
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleFileProcess(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-7 flex flex-col items-center justify-center text-center cursor-pointer transition-all group ${
                      isDragging
                        ? 'border-[#ff91db] bg-pink-50/70 ring-4 ring-[#ff91db]/10 scale-[0.99]'
                        : 'border-slate-200 hover:border-[#ff91db] bg-slate-50/70 hover:bg-pink-50/20'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileProcess(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-2xl bg-pink-100/70 text-[#ff91db] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#ff91db] transition-colors">
                      {isDragging ? 'Drop your image here!' : 'Click to upload or drag & drop image'}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      Supports PNG, JPG, WEBP, GIF up to 5MB
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* URL Mode */
              <div className="space-y-2">
                <Input
                  placeholder="https://images.unsplash.com/... or paste image URL"
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    setFileName('');
                  }}
                />
                {image && (
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <img
                      src={image}
                      alt="URL Preview"
                      className="w-14 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="text-xs text-slate-500 truncate flex-1">
                      Preview of image from URL
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </Modal>

      {/* 5. DELETE COLLECTION CONFIRMATION */}
      {collectionToDelete && (
        <ConfirmModal
          isOpen={!!collectionToDelete}
          onClose={() => setCollectionToDelete(null)}
          onConfirm={handleDelete}
          title="Delete Collection?"
          message={`Are you sure you want to delete collection "${collectionToDelete.name}"? Products inside will remain in the catalog, but the collection page will be removed.`}
          confirmText="Delete Collection"
          isDanger
        />
      )}
    </div>
  );
};
