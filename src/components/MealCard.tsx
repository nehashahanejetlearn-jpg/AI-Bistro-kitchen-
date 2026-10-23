import React, { useState } from 'react';
import { Clock, Flame, ShieldAlert, Heart, Eye, ArrowRightLeft, ShoppingCart, Check } from 'lucide-react';
import { Recipe } from '../types/mealPlanner';

interface MealCardProps {
  recipe: Recipe;
  onOpenDetails: (recipe: Recipe) => void;
  onSwapMeal?: (recipe: Recipe) => void;
  onToggleFavorite?: (recipe: Recipe) => void;
  onAddToGrocery?: (recipe: Recipe) => void;
}

export const MealCard: React.FC<MealCardProps> = ({
  recipe,
  onOpenDetails,
  onSwapMeal,
  onToggleFavorite,
  onAddToGrocery,
}) => {
  const [imageError, setImageError] = useState(false);
  const [addedGrocery, setAddedGrocery] = useState(false);

  const mealTypeColorMap = {
    breakfast: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
    lunch: 'text-teal-400 bg-teal-950/40 border-teal-500/30',
    dinner: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
    snack: 'text-purple-400 bg-purple-950/40 border-purple-500/30',
  };

  const handleAddGrocery = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToGrocery) {
      onAddToGrocery(recipe);
      setAddedGrocery(true);
      setTimeout(() => setAddedGrocery(false), 2000);
    }
  };

  return (
    <div
      onClick={() => onOpenDetails(recipe)}
      className="group bg-[#211715] hover:bg-[#2A1E1B] border border-[#3A2925] hover:border-emerald-500/50 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl hover:shadow-black/50 flex flex-col justify-between"
    >
      <div>
        {/* Photo with scrim & badges */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#160E0D]">
          {!imageError && recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#241715] to-[#120B0B] text-[#A9A09A]">
              <Flame className="w-8 h-8 text-amber-500/60 mb-2" />
              <span className="text-xs font-serif text-center line-clamp-2 text-[#F5F0E8]">
                {recipe.title}
              </span>
            </div>
          )}

          {/* Measured dark scrim for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#211715] via-transparent to-black/30 pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            <span
              className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded-md border backdrop-blur-md ${
                mealTypeColorMap[recipe.mealType] || 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
              }`}
            >
              {recipe.mealType}
            </span>

            {/* Favorite button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleFavorite) onToggleFavorite(recipe);
              }}
              className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-[#F5F0E8] hover:text-rose-400 transition-colors pointer-events-auto"
              title={recipe.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  recipe.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-[#F5F0E8]'
                }`}
              />
            </button>
          </div>

          {/* Bottom Photo Overlay Info */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-[#F5F0E8] pointer-events-none">
            <span className="flex items-center gap-1 font-mono bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
              <Clock className="w-3 h-3 text-[#E8AD48]" />
              {recipe.prepTime + recipe.cookTime}m
            </span>
            <span className="flex items-center gap-1 font-mono bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
              <Flame className="w-3 h-3 text-emerald-400" />
              {recipe.calories} kcal
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-3.5 space-y-2">
          <h3 className="font-serif text-sm font-semibold text-[#F5F0E8] line-clamp-1 group-hover:text-emerald-300 transition-colors">
            {recipe.title}
          </h3>

          <p className="text-xs text-[#A9A09A] line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>

          {/* Metadata: Pantry match & Allergens */}
          <div className="pt-2 border-t border-[#3A2925]/60 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-mono font-medium">
              {recipe.pantryMatchScore}% In Stock
            </span>

            {recipe.allergens && recipe.allergens.length > 0 ? (
              <span className="text-amber-400 flex items-center gap-0.5 text-[10px] font-mono">
                <ShieldAlert className="w-3 h-3" />
                {recipe.allergens[0]}
              </span>
            ) : (
              <span className="text-[#A9A09A] text-[10px] font-mono">Allergen Safe</span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Row on hover or tap */}
      <div className="px-3.5 pb-3 pt-1 flex items-center justify-between border-t border-[#3A2925]/40 text-xs text-[#A9A09A]">
        <button
          type="button"
          onClick={handleAddGrocery}
          className="flex items-center gap-1 hover:text-[#F5F0E8] transition-colors py-1"
          title="Add missing ingredients to grocery list"
        >
          {addedGrocery ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <ShoppingCart className="w-3.5 h-3.5 text-[#E8AD48]" />
          )}
          <span className={addedGrocery ? 'text-emerald-400' : ''}>
            {addedGrocery ? 'Added' : 'Grocery'}
          </span>
        </button>

        {onSwapMeal && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSwapMeal(recipe);
            }}
            className="flex items-center gap-1 hover:text-emerald-300 transition-colors py-1"
            title="Swap this meal"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Swap</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onOpenDetails(recipe)}
          className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium py-1"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Recipe</span>
        </button>
      </div>
    </div>
  );
};
