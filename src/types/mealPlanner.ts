export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface Ingredient {
  name: string;
  amount: string;
  inStock?: boolean;
  category: 'produce' | 'dairy' | 'meat' | 'bakery' | 'pantry' | 'spices' | 'other';
}

export interface Recipe {
  id: string;
  title: string;
  mealType: MealType;
  description: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  allergens: string[];
  tags: string[];
  image: string;
  ingredients: Ingredient[];
  instructions: string[];
  chefTips?: string;
  estimatedCost: number; // in INR/USD
  pantryMatchScore: number; // 0 to 100%
  isFavorite?: boolean;
}

export interface DayPlan {
  day: DayOfWeek;
  dateStr: string;
  breakfast: Recipe;
  lunch: Recipe;
  dinner: Recipe;
  snack: Recipe;
  totalCalories: number;
  dailyPantryMatch: number;
}

export interface PantryItem {
  id: string;
  name: string;
  category: 'Produce' | 'Proteins' | 'Dairy & Eggs' | 'Grains & Pasta' | 'Pantry Staples' | 'Spices & Oils';
  quantity: number;
  unit: string;
  expiryDays: number; // days until expiry
  inStock: boolean;
}

export interface GroceryItem {
  id: string;
  name: string;
  category: 'Produce' | 'Proteins' | 'Dairy & Eggs' | 'Grains & Pasta' | 'Pantry Staples' | 'Spices & Oils';
  quantity: string;
  checked: boolean;
  estimatedCost: number;
  neededForRecipe?: string;
}

export interface FamilyProfile {
  adults: number;
  kids: number;
  allergens: string[];
  dietaryStyle: string;
  weeklyBudget: number; // ₹ or $
  cookingTimePreference: 'quick' | 'standard' | 'gourmet';
}

export interface AIPlannerConfig {
  prompt: string;
  allergens: string[];
  dietaryPreference: string;
  familyMembers: number;
  maxCookingTime: number;
  budgetCap: number;
  useExpiringPantryFirst: boolean;
}

export type ViewMode = 'calendar' | 'day-by-day';
export type ActivePage =
  | 'dashboard'
  | 'planner'
  | 'pantry'
  | 'assistant'
  | 'grocery'
  | 'analytics'
  | 'favorites';
