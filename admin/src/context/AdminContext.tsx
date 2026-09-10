import React, { createContext, useContext, useState } from 'react';
import type {
  Product,
  Category,
  Attribute,
  InventoryItem,
  Order,
  OrderStatus,
  PaymentStatus,
  Customer,
  Banner,
  Collection,
  Coupon,
  CMSSection,
  MediaItem,
  Review,
  StoreSettings,
  StockHistoryEntry,
  NotificationItem,
} from '../types';

import { initialProducts } from '../data/products';
import { initialCategories } from '../data/categories';
import { initialAttributes } from '../data/attributes';
import { initialInventory, sampleStockHistory } from '../data/inventory';
import { initialOrders } from '../data/orders';
import { initialCustomers } from '../data/customers';
import { initialBanners, initialCollections, initialCoupons } from '../data/marketing';
import { initialCMSSections } from '../data/cms';
import { initialMedia } from '../data/media';

import { initialSettings } from '../data/settings';
import { initialNotifications } from '../data/notifications';

interface AdminContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'salesCount'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'itemCount'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Attributes
  attributes: Attribute[];
  addAttribute: (name: string, initialValues: string[]) => void;
  addAttributeValue: (attributeId: string, value: string) => void;
  removeAttributeValue: (attributeId: string, value: string) => void;
  deleteAttribute: (id: string) => void;

  // Inventory
  inventory: InventoryItem[];
  stockHistory: Record<string, StockHistoryEntry[]>;
  adjustStock: (inventoryId: string, newStock: number, reason: string) => void;

  // Orders
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderPayment: (orderId: string, paymentStatus: PaymentStatus) => void;

  // Customers
  customers: Customer[];
  toggleCustomerStatus: (customerId: string) => void;

  // Marketing
  banners: Banner[];
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  updateBanner: (id: string, banner: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;

  collections: Collection[];
  addCollection: (col: Omit<Collection, 'id'>) => void;
  updateCollection: (id: string, updated: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  toggleCollectionStatus: (id: string) => void;
  addProductToCollection: (collectionId: string, productId: string) => void;
  removeProductFromCollection: (collectionId: string, productId: string) => void;

  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  deleteCoupon: (id: string) => void;

  // CMS
  cmsSections: CMSSection[];
  toggleCMSSection: (id: string) => void;
  moveCMSSection: (id: string, direction: 'up' | 'down') => void;

  // Media
  mediaItems: MediaItem[];
  addMediaItem: (item: Omit<MediaItem, 'id' | 'uploadedDate'>) => void;
  deleteMediaItem: (id: string) => void;

  // Reviews
  reviews: Review[];
  updateReviewStatus: (id: string, status: Review['status']) => void;
  deleteReview: (id: string) => void;

  // Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;

  // UI state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [attributes, setAttributes] = useState<Attribute[]>(initialAttributes);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [stockHistory, setStockHistory] = useState<Record<string, StockHistoryEntry[]>>(sampleStockHistory);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [cmsSections, setCMSSections] = useState<CMSSection[]>(initialCMSSections);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMedia);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const unreadNotificationsCount = notifications.filter((n) => n.unread).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };


  // Products CRUD
  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt' | 'salesCount'>) => {
    const newProduct: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      salesCount: 0,
    };
    setProducts((prev) => [newProduct, ...prev]);

    // Also add to inventory automatically
    const newInvItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      productId: newProduct.id,
      productName: newProduct.name,
      sku: newProduct.sku,
      currentStock: newProduct.stock,
      minThreshold: 10,
      status: newProduct.stock > 10 ? 'In Stock' : newProduct.stock > 0 ? 'Low Stock' : 'Out of Stock',
      lastRestocked: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      image: newProduct.image,
      price: newProduct.salePrice || newProduct.price,
    };
    setInventory((prev) => [newInvItem, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    // Update inventory if stock or price changed
    if (updated.stock !== undefined || updated.price !== undefined || updated.name !== undefined) {
      setInventory((prev) =>
        prev.map((inv) =>
          inv.productId === id
            ? {
                ...inv,
                productName: updated.name ?? inv.productName,
                currentStock: updated.stock ?? inv.currentStock,
                price: (updated.salePrice || updated.price) ?? inv.price,
                status: (updated.stock ?? inv.currentStock) > 10 ? 'In Stock' : (updated.stock ?? inv.currentStock) > 0 ? 'Low Stock' : 'Out of Stock',
              }
            : inv
        )
      );
    }
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    setInventory((prev) => prev.filter((inv) => inv.productId !== id));
  };

  // Categories CRUD
  const addCategory = (catData: Omit<Category, 'id' | 'itemCount'>) => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
      itemCount: 0,
    };

    if (newCat.parentId) {
      // Add as child
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === newCat.parentId) {
            return {
              ...cat,
              children: [...(cat.children || []), newCat],
            };
          }
          return cat;
        })
      );
    } else {
      setCategories((prev) => [...prev, newCat]);
    }
  };

  const updateCategory = (id: string, updated: Partial<Category>) => {
    const updateRecursive = (cats: Category[]): Category[] => {
      return cats.map((cat) => {
        if (cat.id === id) {
          return { ...cat, ...updated };
        }
        if (cat.children && cat.children.length > 0) {
          return { ...cat, children: updateRecursive(cat.children) };
        }
        return cat;
      });
    };
    setCategories((prev) => updateRecursive(prev));
  };

  const deleteCategory = (id: string) => {
    const deleteRecursive = (cats: Category[]): Category[] => {
      return cats
        .filter((cat) => cat.id !== id)
        .map((cat) => ({
          ...cat,
          children: cat.children ? deleteRecursive(cat.children) : undefined,
        }));
    };
    setCategories((prev) => deleteRecursive(prev));
  };

  // Attributes CRUD
  const addAttribute = (name: string, initialValues: string[]) => {
    const newAttr: Attribute = {
      id: `attr-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      values: initialValues,
    };
    setAttributes((prev) => [...prev, newAttr]);
  };

  const addAttributeValue = (attributeId: string, value: string) => {
    setAttributes((prev) =>
      prev.map((attr) =>
        attr.id === attributeId && !attr.values.includes(value)
          ? { ...attr, values: [...attr.values, value] }
          : attr
      )
    );
  };

  const removeAttributeValue = (attributeId: string, value: string) => {
    setAttributes((prev) =>
      prev.map((attr) =>
        attr.id === attributeId
          ? { ...attr, values: attr.values.filter((v) => v !== value) }
          : attr
      )
    );
  };

  const deleteAttribute = (id: string) => {
    setAttributes((prev) => prev.filter((attr) => attr.id !== id));
  };

  // Inventory adjustment
  const adjustStock = (inventoryId: string, newStock: number, reason: string) => {
    const targetItem = inventory.find((i) => i.id === inventoryId);
    if (!targetItem) return;

    const diff = newStock - targetItem.currentStock;
    const historyEntry: StockHistoryEntry = {
      id: `h-${Date.now()}`,
      date: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      adjustment: diff,
      reason,
      adjustedBy: 'Store Admin',
      newStock,
    };

    setStockHistory((prev) => ({
      ...prev,
      [inventoryId]: [historyEntry, ...(prev[inventoryId] || [])],
    }));

    setInventory((prev) =>
      prev.map((item) =>
        item.id === inventoryId
          ? {
              ...item,
              currentStock: newStock,
              status: newStock > item.minThreshold ? 'In Stock' : newStock > 0 ? 'Low Stock' : 'Out of Stock',
              lastRestocked: diff > 0 ? new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : item.lastRestocked,
            }
          : item
      )
    );

    // Sync product stock
    setProducts((prev) =>
      prev.map((prod) =>
        prod.id === targetItem.productId
          ? {
              ...prod,
              stock: newStock,
              status: newStock === 0 ? 'Out of Stock' : prod.status,
            }
          : prod
      )
    );
  };

  // Orders
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const newTimelineItem = {
            status,
            timestamp: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            description: `Status updated to ${status} by Admin`,
          };
          return {
            ...ord,
            status,
            timeline: [...ord.timeline, newTimelineItem],
          };
        }
        return ord;
      })
    );
  };

  const updateOrderPayment = (orderId: string, paymentStatus: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, paymentStatus } : ord))
    );
  };

  // Customers
  const toggleCustomerStatus = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' }
          : c
      )
    );
  };

  // Marketing
  const addBanner = (bData: Omit<Banner, 'id'>) => {
    const newBanner: Banner = { ...bData, id: `ban-${Date.now()}` };
    setBanners((prev) => [...prev, newBanner]);
  };

  const updateBanner = (id: string, updated: Partial<Banner>) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  const addCollection = (colData: Omit<Collection, 'id'>) => {
    const newCol: Collection = { ...colData, id: `col-${Date.now()}` };
    setCollections((prev) => [...prev, newCol]);
  };

  const updateCollection = (id: string, updated: Partial<Collection>) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleCollectionStatus = (id: string) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c))
    );
  };

  const addProductToCollection = (collectionId: string, productId: string) => {
    setCollections((prev) =>
      prev.map((c) => {
        if (c.id !== collectionId) return c;
        const currentIds = c.productIds || [];
        if (currentIds.includes(productId)) return c;
        const newIds = [...currentIds, productId];
        return {
          ...c,
          productIds: newIds,
          productCount: newIds.length,
        };
      })
    );
  };

  const removeProductFromCollection = (collectionId: string, productId: string) => {
    setCollections((prev) =>
      prev.map((c) => {
        if (c.id !== collectionId) return c;
        const newIds = (c.productIds || []).filter((pid) => pid !== productId);
        return {
          ...c,
          productIds: newIds,
          productCount: newIds.length,
        };
      })
    );
  };

  const addCoupon = (cData: Omit<Coupon, 'id' | 'usageCount'>) => {
    const newCoupon: Coupon = { ...cData, id: `coup-${Date.now()}`, usageCount: 0 };
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  // CMS
  const toggleCMSSection = (id: string) => {
    setCMSSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, enabled: !sec.enabled } : sec))
    );
  };

  const moveCMSSection = (id: string, direction: 'up' | 'down') => {
    setCMSSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx === -1) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.length - 1) return prev;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;

      return copy.map((sec, i) => ({ ...sec, order: i + 1 }));
    });
  };

  // Media
  const addMediaItem = (itemData: Omit<MediaItem, 'id' | 'uploadedDate'>) => {
    const newItem: MediaItem = {
      ...itemData,
      id: `med-${Date.now()}`,
      uploadedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };
    setMediaItems((prev) => [newItem, ...prev]);
  };

  const deleteMediaItem = (id: string) => {
    setMediaItems((prev) => prev.filter((m) => m.id !== id));
  };

  // Reviews
  const updateReviewStatus = (id: string, status: Review['status']) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  // Settings
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        attributes,
        addAttribute,
        addAttributeValue,
        removeAttributeValue,
        deleteAttribute,
        inventory,
        stockHistory,
        adjustStock,
        orders,
        updateOrderStatus,
        updateOrderPayment,
        customers,
        toggleCustomerStatus,
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
        collections,
        addCollection,
        updateCollection,
        deleteCollection,
        toggleCollectionStatus,
        addProductToCollection,
        removeProductFromCollection,
        coupons,
        addCoupon,
        deleteCoupon,
        cmsSections,
        toggleCMSSection,
        moveCMSSection,
        mediaItems,
        addMediaItem,
        deleteMediaItem,
        reviews,
        updateReviewStatus,
        deleteReview,
        settings,
        updateSettings,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        dismissNotification,
        clearAllNotifications,
        searchQuery,
        setSearchQuery,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileSidebarOpen,
        setMobileSidebarOpen,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
