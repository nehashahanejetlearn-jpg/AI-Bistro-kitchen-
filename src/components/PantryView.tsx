import React, { useState } from 'react';
import { PantryItem, Recipe } from '../types/mealPlanner';
import {
  Package,
  Plus,
  AlertTriangle,
  Sparkles,
  Check,
  Trash2,
  Filter,
  ShoppingCart,
  ChefHat,
  RefreshCw,
} from 'lucide-react';

interface PantryViewProps {
  pantryItems: PantryItem[];
  onUpdatePantry: (items: PantryItem[]) => void;
  onAddGroceryItem: (name: string, category: any) => void;
  onSelectRecipePrompt: (prompt: string) => void;
}

export const PantryView: React.FC<PantryViewProps> = ({
  pantryItems,
  onUpdatePantry,
  onAddGroceryItem,
  onSelectRecipePrompt,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PantryItem['category']>('Produce');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('pcs');
  const [newItemExpiry, setNewItemExpiry] = useState(5);

  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);

  const categories = [
    'All',
    'Produce',
    'Proteins',
    'Dairy & Eggs',
    'Grains & Pasta',
    'Pantry Staples',
    'Spices & Oils',
  ];

  const filteredItems =
    selectedCategory === 'All'
      ? pantryItems
      : pantryItems.filter((i) => i.category === selectedCategory);

  const expiringSoon = pantryItems.filter((i) => i.expiryDays <= 3 && i.inStock);

  const handleToggleStock = (id: string) => {
    onUpdatePantry(
      pantryItems.map((item) =>
        item.id === id ? { ...item, inStock: !item.inStock } : item
      )
    );
  };

  const handleAdjustQty = (id: string, delta: number) => {
    onUpdatePantry(
      pantryItems.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty, inStock: newQty > 0 };
        }
        return item;
      })
    );
  };

  const handleDeleteItem = (id: string) => {
    onUpdatePantry(pantryItems.filter((i) => i.id !== id));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: PantryItem = {
      id: 'p_' + Date.now(),
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: newItemQty,
      unit: newItemUnit,
      expiryDays: newItemExpiry,
      inStock: true,
    };

    onUpdatePantry([newItem, ...pantryItems]);
    setNewItemName('');
    setShowAddModal(false);
  };

  const handleGeneratePantryMealIdeas = async () => {
    setLoadingAi(true);
    try {
      const expiringNames = expiringSoon.map((i) => i.name);
      const res = await fetch('/api/pantry-smart-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expiringItems: expiringNames.length > 0 ? expiringNames : pantryItems.slice(0, 5).map((i) => i.name),
        }),
      });
      const data = await res.json();
      if (data.ideas && data.ideas.length > 0) {
        setAiSuggestions(data.ideas);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#211715] border border-[#3A2925] rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#F5F0E8]">
              Pantry Inventory & Freshness
            </h1>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">
              {pantryItems.filter((i) => i.inStock).length} Items Stocked
            </span>
          </div>
          <p className="text-xs text-[#A9A09A] mt-1">
            Real-time kitchen inventory tracked against your weekly meal plans to prevent spoilage and eliminate duplicate shopping.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleGeneratePantryMealIdeas}
            disabled={loadingAi}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {loadingAi ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>AI Ideas for Expiring Stock</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* AI Pantry Recipe Suggestions (if generated) */}
      {aiSuggestions.length > 0 && (
        <div className="bg-[#1C1211] border border-amber-500/40 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-[#E8AD48]" />
              <h3 className="font-serif font-bold text-sm text-[#F5F0E8]">
                Chef Auguste's Zero-Waste Recommendations
              </h3>
            </div>
            <button
              onClick={() => setAiSuggestions([])}
              className="text-xs text-[#A9A09A] hover:text-[#F5F0E8]"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiSuggestions.map((idea, idx) => (
              <div
                key={idx}
                className="bg-[#241715] border border-[#3A2925] p-3.5 rounded-xl space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-serif font-semibold text-[#F5F0E8]">{idea.title}</span>
                    <span className="font-mono text-[#E8AD48]">{idea.prepTime}m</span>
                  </div>
                  <p className="text-xs text-[#A9A09A] mt-1 leading-relaxed">
                    {idea.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectRecipePrompt(`Plan a meal: ${idea.title}`)}
                  className="w-full mt-2 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono font-medium transition-colors"
                >
                  Schedule in Planner →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === cat
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-[#1C1211] text-[#A9A09A] hover:text-[#F5F0E8] border border-[#3A2925]/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Pantry Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredItems.map((item) => {
          const isExpiring = item.expiryDays <= 3 && item.inStock;
          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                isExpiring
                  ? 'bg-[#291B18] border-amber-500/40'
                  : 'bg-[#211715] border-[#3A2925]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-[#F5F0E8]">{item.name}</span>
                  {isExpiring && (
                    <span className="flex items-center gap-0.5 text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
                      <AlertTriangle className="w-3 h-3" />
                      {item.expiryDays}d left
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-[#A9A09A] font-mono">
                  <span>{item.category}</span>
                  <span>·</span>
                  <span className="text-[#F5F0E8]">
                    {item.quantity} {item.unit}
                  </span>
                </div>
              </div>

              {/* Adjust Qty & Actions */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-[#160E0D] rounded-lg p-1 border border-[#3A2925]">
                  <button
                    type="button"
                    onClick={() => handleAdjustQty(item.id, -1)}
                    className="w-5 h-5 flex items-center justify-center text-[#A9A09A] hover:text-[#F5F0E8] text-sm"
                  >
                    -
                  </button>
                  <span className="font-mono text-xs px-1 text-[#F5F0E8]">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAdjustQty(item.id, 1)}
                    className="w-5 h-5 flex items-center justify-center text-[#A9A09A] hover:text-[#F5F0E8] text-sm"
                  >
                    +
                  </button>
                </div>

                {!item.inStock && (
                  <button
                    type="button"
                    onClick={() => onAddGroceryItem(item.name, item.category)}
                    className="p-1.5 rounded-lg bg-[#2A1E1B] hover:bg-[#382622] text-[#E8AD48] border border-[#3A2925]"
                    title="Add to Grocery List"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1.5 rounded-lg text-[#A9A09A] hover:text-rose-400 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#211715] border border-[#3A2925] rounded-2xl p-6 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-[#F5F0E8] mb-4">
              Add Item to Pantry Inventory
            </h3>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#A9A09A] mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Organic Baby Spinach"
                  className="w-full bg-[#160E0D] border border-[#3A2925] rounded-xl px-3 py-2 text-sm text-[#F5F0E8] outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#A9A09A] mb-1">
                    Category
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full bg-[#160E0D] border border-[#3A2925] rounded-xl px-3 py-2 text-xs text-[#F5F0E8] outline-none"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A9A09A] mb-1">
                    Expires In (Days)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={newItemExpiry}
                    onChange={(e) => setNewItemExpiry(Number(e.target.value))}
                    className="w-full bg-[#160E0D] border border-[#3A2925] rounded-xl px-3 py-2 text-xs text-[#F5F0E8] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#A9A09A] mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value))}
                    className="w-full bg-[#160E0D] border border-[#3A2925] rounded-xl px-3 py-2 text-xs text-[#F5F0E8] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A9A09A] mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    placeholder="g, pcs, fillets, loaf"
                    className="w-full bg-[#160E0D] border border-[#3A2925] rounded-xl px-3 py-2 text-xs text-[#F5F0E8] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#3A2925]/60">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-[#A9A09A] hover:text-[#F5F0E8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs shadow-md"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
