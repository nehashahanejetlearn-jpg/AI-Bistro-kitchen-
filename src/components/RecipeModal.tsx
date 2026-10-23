import React, { useState } from 'react';
import { Recipe, Ingredient } from '../types/mealPlanner';
import {
  X,
  Clock,
  Flame,
  ChefHat,
  ShieldCheck,
  ShieldAlert,
  ShoppingCart,
  Heart,
  Check,
  Sparkles,
  Bot,
} from 'lucide-react';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onAddToGrocery: (recipe: Recipe) => void;
  onToggleFavorite: (recipe: Recipe) => void;
  onConsultChef: (recipe: Recipe) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  onClose,
  onAddToGrocery,
  onToggleFavorite,
  onConsultChef,
}) => {
  if (!recipe) return null;

  const [addedGrocery, setAddedGrocery] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');

  const handleAddGrocery = () => {
    onAddToGrocery(recipe);
    setAddedGrocery(true);
    setTimeout(() => setAddedGrocery(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-[#1E1413] border border-[#3A2925] rounded-3xl overflow-hidden shadow-2xl shadow-black/80 animate-in fade-in zoom-in-95 duration-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Photo Header */}
        <div className="relative aspect-[16/9] w-full bg-[#160E0D] overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1413] via-[#1E1413]/40 to-transparent pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-[#F5F0E8] transition-colors backdrop-blur-md"
            aria-label="Close recipe details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on hero */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="text-xs font-mono uppercase font-semibold px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
              {recipe.mealType}
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-black/60 text-[#E8AD48] border border-[#E8AD48]/30 backdrop-blur-md">
              {recipe.pantryMatchScore}% In Stock
            </span>
          </div>

          {/* Title & subtitle on hero */}
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#F5F0E8] leading-tight">
              {recipe.title}
            </h2>
            <p className="text-xs md:text-sm text-[#A9A09A] mt-1 line-clamp-2">
              {recipe.description}
            </p>
          </div>
        </div>

        {/* Nutrition & Specs Bar */}
        <div className="px-6 py-3.5 bg-[#170E0D] border-y border-[#3A2925] grid grid-cols-4 gap-2 text-center text-xs font-mono">
          <div>
            <span className="text-[#A9A09A] block text-[10px]">TIME</span>
            <span className="text-[#F5F0E8] font-semibold">{recipe.prepTime + recipe.cookTime} min</span>
          </div>
          <div>
            <span className="text-[#A9A09A] block text-[10px]">ENERGY</span>
            <span className="text-[#E8AD48] font-semibold">{recipe.calories} kcal</span>
          </div>
          <div>
            <span className="text-[#A9A09A] block text-[10px]">PROTEIN</span>
            <span className="text-emerald-400 font-semibold">{recipe.protein}g</span>
          </div>
          <div>
            <span className="text-[#A9A09A] block text-[10px]">CARBS / FAT</span>
            <span className="text-[#F5F0E8] font-semibold">{recipe.carbs}g / {recipe.fat}g</span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-4 flex items-center justify-between border-b border-[#3A2925]/70">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('ingredients')}
              className={`pb-2.5 text-xs font-semibold uppercase tracking-wider transition-colors relative ${
                activeTab === 'ingredients'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-[#A9A09A] hover:text-[#F5F0E8]'
              }`}
            >
              Ingredients ({recipe.ingredients.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('instructions')}
              className={`pb-2.5 text-xs font-semibold uppercase tracking-wider transition-colors relative ${
                activeTab === 'instructions'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-[#A9A09A] hover:text-[#F5F0E8]'
              }`}
            >
              Method & Steps ({recipe.instructions.length})
            </button>
          </div>

          {/* Allergen status */}
          <div className="flex items-center gap-1.5 pb-2.5 text-xs">
            {recipe.allergens && recipe.allergens.length > 0 ? (
              <span className="flex items-center gap-1 text-amber-400 font-mono text-[11px]">
                <ShieldAlert className="w-3.5 h-3.5" />
                Contains: {recipe.allergens.join(', ')}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Allergen-Safe
              </span>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[340px] overflow-y-auto space-y-4">
          {activeTab === 'ingredients' ? (
            <div className="space-y-2.5">
              {recipe.ingredients.map((ing, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#18100F] border border-[#3A2925]/60 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="font-medium text-[#F5F0E8]">{ing.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[#A9A09A]">{ing.amount}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        ing.inStock
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {ing.inStock ? 'In Stock' : 'Needs Buying'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recipe.instructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px] border border-emerald-500/40">
                    {idx + 1}
                  </span>
                  <p className="text-[#F5F0E8]">{step}</p>
                </div>
              ))}
            </div>
          )}

          {/* Chef Pro Tip */}
          {recipe.chefTips && (
            <div className="p-3 rounded-xl bg-[#291B18] border border-[#E8AD48]/30 flex items-start gap-2.5 mt-4">
              <ChefHat className="w-4 h-4 text-[#E8AD48] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#E8AD48] font-bold block mb-0.5">
                  Chef Auguste's Secret Tip
                </span>
                <p className="text-xs text-[#F5F0E8]/90 italic">{recipe.chefTips}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 bg-[#170E0D] border-t border-[#3A2925] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleFavorite(recipe)}
              className={`p-2.5 rounded-xl border transition-colors flex items-center gap-2 text-xs font-medium ${
                recipe.isFavorite
                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                  : 'bg-[#211715] border-[#3A2925] text-[#A9A09A] hover:text-[#F5F0E8]'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${recipe.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
              />
              <span>{recipe.isFavorite ? 'Favorited' : 'Favorite'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onConsultChef(recipe);
              }}
              className="p-2.5 rounded-xl bg-[#211715] hover:bg-[#2A1E1B] border border-[#3A2925] text-xs font-medium text-[#F5F0E8] flex items-center gap-2 transition-colors"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>Ask Chef AI</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddGrocery}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all active:scale-[0.99]"
          >
            {addedGrocery ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Added to Grocery List</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 text-white" />
                <span>Add Missing to Grocery List</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
