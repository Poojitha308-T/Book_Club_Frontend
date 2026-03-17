import React from "react";
import { Award, Calendar } from "lucide-react";

const AchievementCard = ({ achievement }) => {
  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden">
      {/* Subtle decorative glow effect */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon Container */}
        <div className="w-16 h-16 mb-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform duration-500 border border-slate-100 dark:border-slate-700">
          {achievement.icon_url ? (
            <img 
              src={achievement.icon_url} 
              alt={achievement.title || achievement.name} 
              className="w-10 h-10 object-contain" 
            />
          ) : (
            <Award className="text-amber-500" size={32} />
          )}
        </div>
        
        <h3 className="font-bold text-slate-900 dark:text-white leading-tight">
          {achievement.title || achievement.name}
        </h3>
        
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 line-clamp-2 px-2 leading-relaxed">
          {achievement.description}
        </p>
        
        {achievement.earned_at && (
          <div className="mt-5 pt-4 border-t border-slate-50 dark:border-slate-800 w-full flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <Calendar size={12} className="text-indigo-500" />
            {new Date(achievement.earned_at).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementCard;