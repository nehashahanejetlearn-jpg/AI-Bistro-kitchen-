import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

export const TopSafetyNotice: React.FC = () => {
  return (
    <div className="w-full bg-[#1F1712]/90 border border-[#E8AD48]/30 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm mb-6">
      <div className="p-1 rounded-md bg-[#E8AD48]/15 text-[#E8AD48] shrink-0">
        <AlertTriangle className="w-4 h-4" />
      </div>
      <p className="text-xs md:text-sm text-[#E8AD48]/95 font-medium leading-relaxed">
        <span className="font-semibold text-[#F5F0E8] mr-1">BistroChef Safety Notice:</span>
        Meal suggestions are for informational purposes only. This is not a substitute for professional medical, nutritional, or clinical advice.
      </p>
    </div>
  );
};
