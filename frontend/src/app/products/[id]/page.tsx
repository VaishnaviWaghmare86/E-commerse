"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCcw,
  CheckCircle2, ArrowLeft, Share2, Award, Zap, PackageCheck
} from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { api, Product } from "../../../services/api";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id || "");
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const prod = await api.getProductById(id);
        if (prod) {
          setProduct(prod);
          setActiveImage(prod.image || (prod.images && prod.images[0]?.url) || "");
        }
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full bg-[#FAF9F6] min-h-[70vh] flex items-center justify-center font-sans">
        <div className="text-center font-bold text-slate-500 animate-pulse">Loading Toy Details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full bg-[#FAF9F6] min-h-[70vh] flex flex-col items-center justify-center font-sans p-6">
        <div className="text-6xl mb-4">🧸</div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Toy Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">This product might have been moved or is undergoing seller review.</p>
        <Link href="/products" className="bg-pink-500 text-white px-6 py-2.5 rounded-full font-bold text-sm">
          &larr; Back to Toy Wonderland
        </Link>
      </div>
    );
  }

  const currentPrice = product.salePrice || product.price || product.basePrice;
  const originalPrice = product.basePrice || (product.salePrice ? product.price : undefined);
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: currentPrice,
        originalPrice: originalPrice,
        img: product.image,
        category: typeof product.category === "string" ? product.category : product.category?.name,
        brand: product.brand,
        ageGroup: product.ageGroup,
        vendorId: product.vendorId,
        vendorName: product.vendorName,
        sku: product.sku
      });
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const galleryImages = product.images && product.images.length > 0
    ? product.images.map(img => img.url)
    : [product.image];

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-6">
          <Link href="/" className="hover:text-pink-500">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-pink-500">Toys</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Showcase Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* LEFT: Image Gallery */}
          <div className="space-y-4">
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 relative group">
              <img
                src={activeImage || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {product.discount && (
                <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                  {product.discount}% OFF
                </span>
              )}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
              >
                <Heart size={20} className={wishlisted ? "fill-rose-500 text-rose-500" : ""} />
              </button>
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImage === imgUrl ? "border-pink-500 scale-95 shadow-md" : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantee Pills */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
              <div className="bg-slate-50 rounded-2xl p-3">
                <Truck className="mx-auto text-pink-500 mb-1" size={20} />
                <div className="text-[11px] font-black text-slate-800">Express Delivery</div>
                <div className="text-[9px] text-slate-400 font-semibold">2 - 3 Days Across India</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3">
                <ShieldCheck className="mx-auto text-sky-500 mb-1" size={20} />
                <div className="text-[11px] font-black text-slate-800">100% Non-Toxic</div>
                <div className="text-[9px] text-slate-400 font-semibold">BIS &amp; EN71 Certified</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3">
                <RefreshCcw className="mx-auto text-amber-500 mb-1" size={20} />
                <div className="text-[11px] font-black text-slate-800">7 Days Return</div>
                <div className="text-[9px] text-slate-400 font-semibold">Hassle-free replacement</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-sky-100 text-sky-700 text-xs font-black px-3 py-1 rounded-full">
                  {product.brand}
                </span>
                <span className="bg-amber-100 text-amber-700 text-xs font-black px-3 py-1 rounded-full">
                  Age: {product.ageGroup}
                </span>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                  <PackageCheck size={12} /> In Stock ({product.stock || 20} units)
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Rating & SKU */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    <Star size={16} className="fill-amber-400 text-amber-400" />
                  </div>
                  <span className="font-black text-slate-800 text-sm">{product.rating || 4.9}</span>
                  <span>•</span>
                  <span>{product.salesCount || 120} Happy Kids &amp; Parents</span>
                </div>
                <div className="text-[11px] text-slate-400">SKU: {product.sku || product.id}</div>
              </div>

              {/* MULTI-VENDOR ATTRIBUTION CARD (Crucial Requirement) */}
              <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200/70 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600">
                    Verified Toy Vendor
                  </div>
                  <div className="text-sm font-black text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <ShieldCheck size={16} className="text-sky-500" />
                    <span>{product.vendorName || "ABC Toys Wonderland"}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Authorized brand seller • Dispatches within 24 hours
                  </p>
                </div>
                <div className="text-right">
                  <span className="bg-white px-2.5 py-1 rounded-full text-xs font-black text-sky-700 border border-sky-100 shadow-sm">
                    ⭐ {product.vendorRating || 4.9} / 5
                  </span>
                </div>
              </div>

              {/* Price Block */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900">₹{currentPrice}</span>
                {originalPrice && originalPrice > currentPrice && (
                  <>
                    <span className="text-base font-bold text-slate-400 line-through">₹{originalPrice}</span>
                    <span className="text-xs font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
                      Save ₹{originalPrice - currentPrice}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-semibold">Inclusive of all taxes. Free shipping on orders over ₹999.</p>

              {/* Description */}
              <p className="text-slate-600 text-sm leading-relaxed">
                {product.description || product.shortDescription}
              </p>

              {/* Key Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-xs">
                  <h4 className="font-extrabold text-slate-800 text-xs mb-1">Product Specifications:</h4>
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-slate-200/50 last:border-0">
                      <span className="font-bold text-slate-500">{key}:</span>
                      <span className="font-extrabold text-slate-800">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Key Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs mb-2">Key Highlights:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 font-medium">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions: Quantity + Add to Cart + Buy Now */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-600">Quantity:</span>
                <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-3 py-1.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="font-bold text-slate-700 hover:text-pink-500 text-sm"
                  >
                    -
                  </button>
                  <span className="font-black text-slate-900 text-sm px-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="font-bold text-slate-700 hover:text-pink-500 text-sm"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleShare}
                  className="ml-auto flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-pink-500"
                >
                  <Share2 size={15} /> {copied ? "Link Copied!" : "Share Toy"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-2xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <ShoppingBag size={18} /> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Zap size={18} /> Buy Now
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
