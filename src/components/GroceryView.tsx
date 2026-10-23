import React, { useState } from 'react';
import { GroceryItem, PantryItem } from '../types/mealPlanner';
import {
  ShoppingCart,
  Plus,
  Check,
  CheckCircle2,
  Trash2,
  Copy,
  PackageCheck,
  IndianRupee,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GroceryViewProps {
  groceryItems: GroceryItem[];
  onUpdateGrocery: (items: GroceryItem[]) => void;
  onMoveBoughtToPantry: (boughtItems: GroceryItem[]) => void;
  weeklyBudget: number;
}

export const GroceryView: React.FC<GroceryViewProps> = ({
  groceryItems,
  onUpdateGrocery,
  onMoveBoughtToPantry,
  weeklyBudget,
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<GroceryItem['category']>('Produce');
  const [newItemQty, setNewItemQty] = useState('1 unit');
  const [newItemCost, setNewItemCost] = useState(100);
  const [copied, setCopied] = useState(false);

  const toggleCheck = (id: string) => {
    onUpdateGrocery(
      groceryItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: GroceryItem = {
      id: 'g_' + Date.now(),
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: newItemQty,
      checked: false,
      estimatedCost: newItemCost,
      neededForRecipe: 'Manual Entry',
    };

    onUpdateGrocery([newItem, ...groceryItems]);
    setNewItemName('');
  };

  const handleDelete = (id: string) => {
    onUpdateGrocery(groceryItems.filter((i) => i.id !== id));
  };

  const handleClearChecked = () => {
    onUpdateGrocery(groceryItems.filter((i) => !i.checked));
  };

  const handleSyncToPantry = () => {
    const bought = groceryItems.filter((i) => i.checked);
    if (bought.length === 0) return;

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#E8AD48', '#ffffff'],
      });
    } catch (e) {
      // ignore
    }

    onMoveBoughtToPantry(bought);
  };

  const handleCopyClipboard = () => {
    const text = groceryItems
      .map((i) => `${i.checked ? '[x]' : '[ ]'} ${i.name} (${i.quantity}) - ₹${i.estimatedCost}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalCost = groceryItems.reduce((acc, curr) => acc + curr.estimatedCost, 0);
  const checkedCost = groceryItems
    .filter((i) => i.checked)
    .reduce((acc, curr) => acc + curr.estimatedCost, 0);
  const pendingItems = groceryItems.filter((i) => !i.checked);

  // Group by category
  const categories: GroceryItem['category'][] = [
    'Produce',
    'Proteins',
    'Dairy & Eggs',
    'Grains & Pasta',
    'Pantry Staples',
    'Spices & Oils',
  ];

  return (
    <div className="space-y-6">
      {/* Header and Budget Tracker */}
      <div className="bg-[#211715] border border-[#3A2925] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-[#F5F0E8]">
              Automated Grocery List
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">
              {pendingItems.length} To Buy
            </span>
          </div>
          <p className="text-xs text-[#A9A09A] mt-1">
            Synthesized directly from your weekly meal recipes, automatically excluding items already present in your pantry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyClipboard}
            className="px-3.5 py-2 rounded-xl bg-[#2A1E1B] hover:bg-[#352522] border border-[#3A2925] text-xs font-medium text-[#F5F0E8] flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#E8AD48]" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy List'}</span>
          </button>

          <button
            type="button"
            onClick={handleSyncToPantry}
            disabled={groceryItems.filter((i) => i.checked).length === 0}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all disabled:opacity-40"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Move Purchased to Pantry</span>
          </button>
        </div>
      </div>

      {/* Budget Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1C1211] border border-[#3A2925] p-4 rounded-xl">
          <span className="text-[11px] font-mono uppercase text-[#A9A09A] block">
            Estimated Basket Total
          </span>
          <span className="font-mono text-2xl font-bold text-[#E8AD48] tabular-nums">
            ₹{totalCost}
          </span>
          <span className="text-[11px] text-[#A9A09A] block mt-0.5">
            Target Cap: ₹{weeklyBudget}
          </span>
        </div>

        <div className="bg-[#1C1211] border border-[#3A2925] p-4 rounded-xl">
          <span className="text-[11px] font-mono uppercase text-[#A9A09A] block">
            Purchased in Cart
          </span>
          <span className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
            ₹{checkedCost}
          </span>
          <span className="text-[11px] text-[#A9A09A] block mt-0.5">
            {groceryItems.filter((i) => i.checked).length} items checked off
          </span>
        </div>

        <div className="bg-[#1C1211] border border-[#3A2925] p-4 rounded-xl">
          <span className="text-[11px] font-mono uppercase text-[#A9A09A] block">
            Budget Variance
          </span>
          <span
            className={`font-mono text-2xl font-bold tabular-nums ${
              weeklyBudget - totalCost >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {weeklyBudget - totalCost >= 0 ? `+₹${weeklyBudget - totalCost} Saved` : `-₹${Math.abs(weeklyBudget - totalCost)} Over`}
          </span>
          <span className="text-[11px] text-[#A9A09A] block mt-0.5">
            Optimal family cost efficiency
          </span>
        </div>
      </div>

      {/* Quick Add Bar */}
      <form
        onSubmit={handleAddItem}
        className="bg-[#211715] border border-[#3A2925] rounded-xl p-3 flex flex-wrap items-center gap-3"
      >
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add custom item (e.g., Organic Honeycomb, Brioche)..."
          className="flex-1 min-w-[200px] bg-[#160E0D] border border-[#3A2925] rounded-lg px-3 py-1.5 text-xs text-[#F5F0E8] outline-none focus:border-emerald-500"
        />

        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value as any)}
          className="bg-[#160E0D] border border-[#3A2925] rounded-lg px-2.5 py-1.5 text-xs text-[#F5F0E8] outline-none"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={newItemQty}
          onChange={(e) => setNewItemQty(e.target.value)}
          placeholder="Qty (e.g. 2 pcs)"
          className="w-24 bg-[#160E0D] border border-[#3A2925] rounded-lg px-2.5 py-1.5 text-xs text-[#F5F0E8] outline-none"
        />

        <div className="flex items-center gap-1 bg-[#160E0D] border border-[#3A2925] rounded-lg px-2 py-1.5">
          <span className="text-xs text-[#A9A09A]">₹</span>
          <input
            type="number"
            min={0}
            value={newItemCost}
            onChange={(e) => setNewItemCost(Number(e.target.value))}
            className="w-16 bg-transparent text-xs text-[#F5F0E8] outline-none font-mono"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-medium text-xs flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      {/* Grouped Grocery Checklist */}
      <div className="space-y-5">
        {categories.map((cat) => {
          const itemsInCat = groceryItems.filter((i) => i.category === cat);
          if (itemsInCat.length === 0) return null;

          return (
            <div
              key={cat}
              className="bg-[#211715] border border-[#3A2925] rounded-2xl p-4 md:p-5 space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#3A2925]/70">
                <h3 className="font-serif text-sm font-bold text-[#F5F0E8]">
                  {cat}
                </h3>
                <span className="text-[11px] font-mono text-[#A9A09A]">
                  {itemsInCat.length} items
                </span>
              </div>

              <div className="divide-y divide-[#3A2925]/40">
                {itemsInCat.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="py-2.5 flex items-center justify-between cursor-pointer group hover:bg-[#2A1E1B]/40 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          item.checked
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-[#3A2925] bg-[#160E0D] text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>

                      <div className="space-y-0.5">
                        <span
                          className={`text-xs font-medium transition-all ${
                            item.checked
                              ? 'line-through text-[#A9A09A]/60'
                              : 'text-[#F5F0E8] group-hover:text-emerald-300'
                          }`}
                        >
                          {item.name}
                        </span>
                        {item.neededForRecipe && (
                          <span className="block text-[10px] text-[#A9A09A]">
                            For: {item.neededForRecipe}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#A9A09A]">
                        {item.quantity}
                      </span>
                      <span className="text-xs font-mono text-[#E8AD48] font-semibold w-14 text-right">
                        ₹{item.estimatedCost}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="p-1 text-[#A9A09A] hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
