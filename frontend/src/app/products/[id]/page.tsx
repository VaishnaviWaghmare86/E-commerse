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
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

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


  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const newReview = await api.submitReview({
        productId: product?.id,
        customerName: reviewName,
        customerEmail: reviewEmail,
        rating: reviewRating,
        comment: reviewComment
      });
      setReviews(prev => [newReview, ...prev]);
      setReviewName('');
      setReviewEmail('');
      setReviewRating(5);
      setReviewComment('');
      alert('Thank you! Your review has been published.');
    } catch (err) {
      alert('Failed to submit review. Please try again later.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-[#0F1026] min-h-[70vh] flex items-center justify-center font-sans">
        <div className="text-center font-bold text-[#A8ACCA] animate-pulse">Loading Toy Details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full bg-[#0F1026] min-h-[70vh] flex flex-col items-center justify-center font-sans p-6 text-white">
        <div className="text-6xl mb-4">🧸</div>
        <h2 className="text-2xl font-black text-white mb-2">Toy Not Found</h2>
        <p className="text-[#D9DBF0] text-sm mb-6">This product might have been moved or is undergoing seller review.</p>
        <Link href="/products" className="bg-gradient-to-r from-[#7C3CFF] to-[#9147FF] hover:from-[#9147FF] hover:to-[#FF4FA3] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md shadow-[#7C3CFF]/30 transition-all">
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
    <div className="w-full bg-[#0F1026] min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#A8ACCA] font-semibold mb-6">
          <Link href="/" className="hover:text-[#FFD447] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#FFD447] transition-colors">Toys</Link>
          <span>/</span>
          <span className="text-white font-bold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Showcase Card */}
        <div className="bg-[#20224A] rounded-3xl p-6 sm:p-10 shadow-xl border border-[#3A3D70] grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* LEFT: Image Gallery */}
          <div className="space-y-4">
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-[#171936] border border-[#3A3D70] relative group flex items-center justify-center p-4">
              <img
                src={activeImage || product.image}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
              {product.discount && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-[#FF8A3D] to-[#FF4FA3] text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                  {product.discount}% OFF
                </span>
              )}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#171936]/90 border border-[#3A3D70] backdrop-blur-md shadow-md flex items-center justify-center text-[#A8ACCA] hover:text-[#FF4FA3] hover:border-[#FF4FA3] transition-colors"
              >
                <Heart size={20} className={wishlisted ? "fill-[#FF4FA3] text-[#FF4FA3]" : ""} />
              </button>
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all bg-[#171936] p-1 ${
                      activeImage === imgUrl ? "border-[#7C3CFF] ring-2 ring-[#7C3CFF]/50 scale-95 shadow-md" : "border-[#3A3D70] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantee Pills */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#3A3D70] text-center">
              <div className="bg-[#171936] border border-[#3A3D70] rounded-2xl p-3">
                <Truck className="mx-auto text-[#FF4FA3] mb-1" size={20} />
                <div className="text-[11px] font-black text-white">Express Delivery</div>
                <div className="text-[9px] text-[#A8ACCA] font-semibold">2 - 3 Days Across India</div>
              </div>
              <div className="bg-[#171936] border border-[#3A3D70] rounded-2xl p-3">
                <ShieldCheck className="mx-auto text-[#28B8FF] mb-1" size={20} />
                <div className="text-[11px] font-black text-white">100% Non-Toxic</div>
                <div className="text-[9px] text-[#A8ACCA] font-semibold">BIS &amp; EN71 Certified</div>
              </div>
              <div className="bg-[#171936] border border-[#3A3D70] rounded-2xl p-3">
                <RefreshCcw className="mx-auto text-[#FFD447] mb-1" size={20} />
                <div className="text-[11px] font-black text-white">7 Days Return</div>
                <div className="text-[9px] text-[#A8ACCA] font-semibold">Hassle-free replacement</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#28B8FF]/15 text-[#28B8FF] border border-[#28B8FF]/30 text-xs font-black px-3 py-1 rounded-full">
                  {product.brand}
                </span>
                <span className="bg-[#FFD447]/15 text-[#FFD447] border border-[#FFD447]/30 text-xs font-black px-3 py-1 rounded-full">
                  Age: {product.ageGroup}
                </span>
                <span className="bg-[#48D597]/15 text-[#48D597] border border-[#48D597]/30 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                  <PackageCheck size={12} /> In Stock ({product.stock || 20} units)
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Rating & SKU */}
              <div className="flex items-center justify-between text-xs font-bold text-[#A8ACCA] pb-4 border-b border-[#3A3D70]">
                <div className="flex items-center gap-2">
                  <div className="flex text-[#FFD447]">
                    <Star size={16} className="fill-[#FFD447] text-[#FFD447]" />
                  </div>
                  <span className="font-black text-white text-sm">{product.rating || 4.9}</span>
                  <span>•</span>
                  <span>{product.salesCount || 120} Happy Kids &amp; Parents</span>
                </div>
                <div className="text-[11px] text-[#A8ACCA]">SKU: {product.sku || product.id}</div>
              </div>

              {/* MULTI-VENDOR ATTRIBUTION CARD (Crucial Requirement) */}
              <div className="bg-[#171936] border border-[#3A3D70] rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#28B8FF]">
                    Verified Toy Vendor
                  </div>
                  <div className="text-sm font-black text-white flex items-center gap-1.5 mt-0.5">
                    <ShieldCheck size={16} className="text-[#28B8FF]" />
                    <span>{product.vendorName || "ABC Toys Wonderland"}</span>
                  </div>
                  <p className="text-[11px] text-[#D9DBF0] font-medium mt-0.5">
                    Authorized brand seller • Dispatches within 24 hours
                  </p>
                </div>
                <div className="text-right">
                  <span className="bg-[#20224A] px-2.5 py-1 rounded-full text-xs font-black text-[#FFD447] border border-[#3A3D70] shadow-sm">
                    ⭐ {product.vendorRating || 4.9} / 5
                  </span>
                </div>
              </div>

              {/* Price Block */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#FFD447]">₹{currentPrice}</span>
                {originalPrice && originalPrice > currentPrice && (
                  <>
                    <span className="text-base font-bold text-[#A8ACCA] line-through">₹{originalPrice}</span>
                    <span className="text-xs font-black text-[#48D597] bg-[#48D597]/15 border border-[#48D597]/30 px-2 py-0.5 rounded-md">
                      Save ₹{originalPrice - currentPrice}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-[#A8ACCA] font-semibold">Inclusive of all taxes. Free shipping on orders over ₹999.</p>

              {/* Description */}
              <p className="text-[#D9DBF0] text-sm leading-relaxed">
                {product.description || product.shortDescription}
              </p>

              {/* Key Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="bg-[#171936] border border-[#3A3D70] rounded-2xl p-4 space-y-2 text-xs">
                  <h4 className="font-extrabold text-white text-xs mb-1">Product Specifications:</h4>
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-[#3A3D70]/50 last:border-0">
                      <span className="font-bold text-[#A8ACCA]">{key}:</span>
                      <span className="font-extrabold text-white">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Key Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="font-extrabold text-white text-xs mb-2">Key Highlights:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#D9DBF0] font-medium">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-[#48D597] flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions: Quantity + Add to Cart + Buy Now */}
            <div className="space-y-3 pt-6 border-t border-[#3A3D70]">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-[#D9DBF0]">Quantity:</span>
                <div className="flex items-center gap-1.5 bg-[#171936] border border-[#3A3D70] rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-lg bg-[#20224A] hover:bg-[#282B59] text-white hover:text-[#FFD447] flex items-center justify-center font-bold border border-[#3A3D70] transition-all active:scale-95 cursor-pointer text-sm"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="min-w-[28px] text-center font-black text-white text-sm select-none">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-[#20224A] hover:bg-[#282B59] text-white hover:text-[#FFD447] flex items-center justify-center font-bold border border-[#3A3D70] transition-all active:scale-95 cursor-pointer text-sm"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleShare}
                  className="ml-auto flex items-center gap-1.5 text-xs font-bold text-[#A8ACCA] hover:text-[#FFD447] cursor-pointer transition-colors"
                >
                  <Share2 size={15} /> {copied ? "Link Copied!" : "Share Toy"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-[#171936] hover:bg-[#282B59] border border-[#3A3D70] hover:border-[#7C3CFF] text-white py-3.5 rounded-2xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <ShoppingBag size={18} /> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-[#7C3CFF] to-[#9147FF] hover:from-[#9147FF] hover:to-[#FF4FA3] text-white py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-[#7C3CFF]/30 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
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
