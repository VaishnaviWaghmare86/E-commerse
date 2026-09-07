import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Modal, ConfirmModal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';
import {
  Plus,
  X,
  Trash2,
  SlidersHorizontal,
  Tag,
  Layers,
  Palette,
  Sparkles,
  Ruler,
  Users,
} from 'lucide-react';
import type { Attribute } from '../types';

export const Attributes: React.FC = () => {
  const { attributes, addAttribute, addAttributeValue, removeAttributeValue, deleteAttribute } =
    useAdmin();
  const { showToast } = useToast();

  const [isAddAttrModalOpen, setIsAddAttrModalOpen] = useState(false);
  const [attrToDelete, setAttrToDelete] = useState<Attribute | null>(null);

  // New Attribute Form
  const [newAttrName, setNewAttrName] = useState('');
  const [newAttrInitialValues, setNewAttrInitialValues] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  // Per-card quick add value input state: Record<attributeId, string>
  const [quickAddValues, setQuickAddValues] = useState<Record<string, string>>({});

  const attributePresets = [
    {
      name: 'Brand',
      icon: <Tag className="w-4 h-4" />,
      description: 'Toy manufacturers & apparel labels (e.g. Lego, Barbie, Carter\'s)',
      values: ['KidsPlay Signature', 'LittleJoy', 'WonderKid', 'EcoCub', 'PlaySpark', 'Lego', 'Barbie', "Carter's"],
    },
    {
      name: 'Material',
      icon: <Layers className="w-4 h-4" />,
      description: 'Fabric & toy construction (e.g. Organic Cotton, Natural Wood, ABS Plastic)',
      values: ['Organic Cotton', 'Natural Wood', 'ABS Plastic', 'Plush Fleece', 'Silicone (BPA Free)', 'Bamboo Fiber', 'Recycled Cardboard'],
    },
    {
      name: 'Pattern',
      icon: <Palette className="w-4 h-4" />,
      description: 'Design print for kids wear, beddings, and toy finishes',
      values: ['Solid', 'Striped', 'Dinosaur Print', 'Animal Cartoon', 'Floral', 'Polka Dots', 'Checkered'],
    },
    {
      name: 'Gender',
      icon: <Users className="w-4 h-4" />,
      description: 'Demographic filter (Unisex, Boys, Girls)',
      values: ['Unisex', 'Boys', 'Girls'],
    },
    {
      name: 'Character / Theme',
      icon: <Sparkles className="w-4 h-4" />,
      description: 'Popular kids themes (Superheroes, Dinosaurs, Space)',
      values: ['Superheroes', 'Dinosaurs', 'Space Explorer', 'Jungle Animals', 'Fairy Tales'],
    },
  ];

  const getAttrIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('brand')) return <Tag className="w-4 h-4" />;
    if (lower.includes('material') || lower.includes('fabric')) return <Layers className="w-4 h-4" />;
    if (lower.includes('pattern') || lower.includes('print')) return <Palette className="w-4 h-4" />;
    if (lower.includes('color')) return <Sparkles className="w-4 h-4" />;
    if (lower.includes('size')) return <Ruler className="w-4 h-4" />;
    if (lower.includes('age') || lower.includes('gender')) return <Users className="w-4 h-4" />;
    return <SlidersHorizontal className="w-4 h-4" />;
  };

  const handleAddInitialValue = () => {
    if (newTagInput.trim()) {
      const splitVals = newTagInput
        .split(',')
        .map((v) => v.trim())
        .filter((v) => v && !newAttrInitialValues.includes(v));
      if (splitVals.length > 0) {
        setNewAttrInitialValues([...newAttrInitialValues, ...splitVals]);
        setNewTagInput('');
      }
    }
  };

  const handleSaveAttribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttrName.trim()) {
      showToast('Attribute name is required', 'error');
      return;
    }
    addAttribute(newAttrName.trim(), newAttrInitialValues);
    showToast(`Attribute "${newAttrName}" created`, 'success');
    setIsAddAttrModalOpen(false);
    setNewAttrName('');
    setNewAttrInitialValues([]);
    setNewTagInput('');
  };

  const handleQuickAdd = (attrId: string) => {
    const rawVal = quickAddValues[attrId]?.trim();
    if (rawVal) {
      const vals = rawVal.split(',').map((v) => v.trim()).filter(Boolean);
      vals.forEach((val) => addAttributeValue(attrId, val));
      setQuickAddValues((prev) => ({ ...prev, [attrId]: '' }));
      showToast(vals.length > 1 ? `Added ${vals.length} values` : `Added "${vals[0]}"`, 'info');
    }
  };

  const handleDelete = () => {
    if (attrToDelete) {
      deleteAttribute(attrToDelete.id);
      showToast(`Attribute "${attrToDelete.name}" removed`, 'success');
      setAttrToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attributes"
        description="Configure product attributes (Brand, Material, Pattern, Color, Size, Age Group) to power store filtering and variants"
        breadcrumbs={[{ label: 'Catalog', href: '/admin/products' }, { label: 'Attributes' }]}
        actions={
          <Button
            onClick={() => setIsAddAttrModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            size="md"
          >
            Add Attribute
          </Button>
        }
      />

      {/* 1-Click Store Attribute Presets Ribbon */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#7e14ff]" />
              Quick-Add Store Attributes
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Easily equip your store with Brand, Material, Pattern, Theme, and Demographics
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {attributePresets.map((preset) => {
              const exists = attributes.some(
                (a) => a.name.toLowerCase() === preset.name.toLowerCase()
              );
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    if (exists) {
                      showToast(`"${preset.name}" is already configured below`, 'info');
                    } else {
                      addAttribute(preset.name, preset.values);
                      showToast(`Added "${preset.name}" with starter values!`, 'success');
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                    exists
                      ? 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300'
                      : 'bg-violet-50 text-[#7e14ff] border-[#dec5f7] hover:bg-[#7e14ff] hover:text-white shadow-2xs'
                  }`}
                  title={preset.description}
                >
                  <Plus className="w-3 h-3" />
                  {preset.name}
                  {exists && <span className="text-[10px] text-emerald-600 font-bold ml-0.5">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of Attribute Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {attributes.map((attr) => (
          <Card key={attr.id} className="flex flex-col justify-between">
            <div>
              <CardHeader className="flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 text-[#7e14ff] flex items-center justify-center">
                    {getAttrIcon(attr.name)}
                  </div>
                  <div>
                    <CardTitle>{attr.name}</CardTitle>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {attr.values.length} configured values
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setAttrToDelete(attr)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete Attribute"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </CardHeader>

              <CardContent className="pt-2">
                {/* Values badges */}
                <div className="flex flex-wrap gap-1.5 mb-4 min-h-[50px]">
                  {attr.values.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No values added yet</span>
                  ) : (
                    attr.values.map((val) => (
                      <span
                        key={val}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200/70 text-slate-800 text-xs font-medium rounded-lg border border-slate-200 transition-colors group"
                      >
                        {val}
                        <button
                          type="button"
                          onClick={() => {
                            removeAttributeValue(attr.id, val);
                            showToast(`Removed "${val}"`, 'info');
                          }}
                          className="text-slate-400 hover:text-rose-600 rounded-full cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </CardContent>
            </div>

            {/* Quick add value row */}
            <div className="p-4 pt-0 border-t border-slate-100 mt-2">
              <div className="flex items-center gap-2 pt-3">
                <input
                  type="text"
                  placeholder="New value..."
                  value={quickAddValues[attr.id] || ''}
                  onChange={(e) =>
                    setQuickAddValues({ ...quickAddValues, [attr.id]: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleQuickAdd(attr.id);
                    }
                  }}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#7e14ff] focus:bg-white"
                />
                <Button
                  size="xs"
                  variant="secondary"
                  onClick={() => handleQuickAdd(attr.id)}
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Attribute Modal */}
      <Modal
        isOpen={isAddAttrModalOpen}
        onClose={() => setIsAddAttrModalOpen(false)}
        title="Create New Attribute"
        description="Add a generic property that can be shared across kids toys and apparel"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              type="button"
              onClick={() => setIsAddAttrModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button size="sm" onClick={handleSaveAttribute}>
              Save Attribute
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSaveAttribute} className="space-y-4">
          {/* Quick preset chips */}
          <div className="p-3 bg-violet-50/60 rounded-xl border border-violet-100">
            <span className="text-[11px] font-semibold text-violet-800 block mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#7e14ff]" />
              Quick template presets (Click to autofill):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {attributePresets.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setNewAttrName(p.name);
                    setNewAttrInitialValues(p.values);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold bg-white text-violet-700 hover:bg-[#7e14ff] hover:text-white border border-violet-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3 h-3" />
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Attribute Name *"
            placeholder="e.g. Color, Size, Age Group, Brand, Material, Pattern"
            value={newAttrName}
            onChange={(e) => setNewAttrName(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Initial Values (comma-separated supported)
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Type value (e.g. Lego or Red, Blue, Green) & press Add"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInitialValue();
                  }
                }}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#7e14ff]"
              />
              <Button type="button" size="sm" variant="secondary" onClick={handleAddInitialValue}>
                Add Value
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80 min-h-[48px]">
              {newAttrInitialValues.length === 0 ? (
                <span className="text-xs text-slate-400">No values added yet</span>
              ) : (
                newAttrInitialValues.map((val) => (
                  <span
                    key={val}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-slate-800 text-xs font-medium rounded-lg border border-slate-200"
                  >
                    {val}
                    <button
                      type="button"
                      onClick={() =>
                        setNewAttrInitialValues(newAttrInitialValues.filter((v) => v !== val))
                      }
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      {attrToDelete && (
        <ConfirmModal
          isOpen={!!attrToDelete}
          onClose={() => setAttrToDelete(null)}
          onConfirm={handleDelete}
          title="Delete Attribute?"
          message={`Are you sure you want to remove "${attrToDelete.name}"? Products using this attribute will retain their existing values.`}
          confirmText="Delete Attribute"
          isDanger
        />
      )}
    </div>
  );
};
