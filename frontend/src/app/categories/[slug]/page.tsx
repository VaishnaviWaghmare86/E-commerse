"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Star, Filter, Heart } from "lucide-react";
import { useParams } from "next/navigation";

export default function ProductListingPage() {
  const params = useParams();
  const categorySlug = params.slug || "toys";

  const products = [
    { id: 1, name: "Remote Control Monster Truck", price: 45.99, rating: 4.8, stock: 12, category: "Vehicles", img: "🚗" },
    { id: 2, name: "Giant Fluffy Teddy Bear", price: 29.99, rating: 4.9, stock: 5, category: "Soft Toys", img: "🧸" },
    { id: 3, name: "Galactic Lego Space Station", price: 89.99, rating: 5.0, stock: 3, category: "Learning", img: "🛸" },
    { id: 4, name: "Dinosaur Adventure Puzzle", price: 15.50, rating: 4.5, stock: 20, category: "Puzzles", img: "🦖" },
    { id: 5, name: "Magic Painting Kit", price: 22.00, rating: 4.6, stock: 8, category: "Art & Craft", img: "🎨" },
    { id: 6, name: "Educational Math Blocks", price: 34.99, rating: 4.7, stock: 15, category: "Learning", img: "🔢" },
  ];

  return (
    <div className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-8">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center md:text-left"
      >
        <h1 className="text-4xl font-extrabold text-slate-800 capitalize flex items-center justify-center md:justify-start gap-3">
          Explore {categorySlug} <span className="text-sky-500">✨</span>
        </h1>
        <p className="text-slate-500 mt-2 text-lg">Find the perfect gift to spark joy and imagination.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-64 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-fit"
        >
          <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold text-lg">
            <Filter size={20} className="text-pink-500" />
            Filters
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-700 mb-3">Age Group</h3>
              <div className="space-y-2">
                {['0-2 Years', '3-5 Years', '6-8 Years', '9+ Years'].map(age => (
                  <label key={age} className="flex items-center gap-3 text-slate-600 cursor-pointer hover:text-sky-500 transition-colors">
                    <input type="checkbox" className="rounded text-sky-500 focus:ring-sky-500 h-4 w-4" />
                    {age}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-700 mb-3">Price Range</h3>
              <input type="range" min="0" max="100" className="w-full accent-pink-500" />
              <div className="flex justify-between text-sm text-slate-500 mt-2">
                <span>$0</span>
                <span>$100+</span>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Product Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, idx) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              key={product.id}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 group hover:shadow-xl transition-all relative overflow-hidden flex flex-col"
            >
              {/* Like Button */}
              <button className="absolute top-4 right-4 z-10 text-slate-300 hover:text-pink-500 transition-colors">
                <Heart fill="currentColor" className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Product Image Placeholder */}
              <div className="bg-slate-50 rounded-2xl h-48 w-full flex items-center justify-center text-7xl mb-4 group-hover:scale-105 transition-transform duration-500">
                {product.img}
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-sky-500 uppercase tracking-wider mb-1">{product.category}</div>
                  <h3 className="font-bold text-slate-800 leading-tight mb-2 line-clamp-2">{product.name}</h3>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={16} className="text-yellow-400" fill="currentColor" />
                    <span className="text-sm font-semibold text-slate-600">{product.rating}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-slate-900">${product.price}</span>
                    <button className="bg-slate-900 hover:bg-sky-500 text-white p-3 rounded-2xl transition-colors shadow-md active:scale-95">
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
