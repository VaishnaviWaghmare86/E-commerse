import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function Categories() {
  const [categories] = useState([
    { id: 1, name: 'Toys', slug: 'toys', status: 'Active', items: 120 },
    { id: 2, name: 'Games', slug: 'games', status: 'Active', items: 45 },
    { id: 3, name: 'Learning', slug: 'learning', status: 'Active', items: 30 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your product categories and subcategories.</p>
        </div>
        <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium flex items-center shadow-sm transition-colors">
          <Plus size={20} className="mr-2" />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold uppercase tracking-wider">
              <th className="p-4">Category Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Products</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50 transition-colors group">
                <td className="p-4 flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-500 flex items-center justify-center mr-3">
                    <ImageIcon size={20} />
                  </div>
                  <span className="font-medium text-slate-800">{cat.name}</span>
                </td>
                <td className="p-4 text-slate-500">/{cat.slug}</td>
                <td className="p-4 text-slate-500">{cat.items}</td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    {cat.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-slate-400 hover:text-sky-500 p-1"><Edit2 size={18} /></button>
                  <button className="text-slate-400 hover:text-red-500 p-1"><Trash2 size={18} /></button>
                  <button className="text-slate-400 hover:text-slate-700 p-1"><ChevronRight size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No categories found. Click "Add Category" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
