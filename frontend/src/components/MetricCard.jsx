import React from 'react';

const MetricCard = ({ title, value, unit, subtitle, icon: Icon, color = 'emerald', trend, badge }) => {
  const colorMap = {
    emerald: 'from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/30',
    blue: 'from-blue-500/20 to-cyan-500/5 text-blue-400 border-blue-500/30',
    amber: 'from-amber-500/20 to-orange-500/5 text-amber-400 border-amber-500/30',
    purple: 'from-purple-500/20 to-pink-500/5 text-purple-400 border-purple-500/30',
    rose: 'from-rose-500/20 to-red-500/5 text-rose-400 border-rose-500/30',
  };

  const selectedColor = colorMap[color] || colorMap.emerald;

  return (
    <div className="glass-card rounded-2xl p-5 border relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${selectedColor} rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity`}></div>
      
      <div className="flex items-start justify-between relative z-10 mb-3">
        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-xl bg-neutral-900/80 border border-neutral-800 ${selectedColor.split(' ')[2]}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-1.5 relative z-10">
        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</span>
        {unit && <span className="text-sm font-semibold text-neutral-400">{unit}</span>}
      </div>

      {(subtitle || trend || badge) && (
        <div className="mt-3 flex items-center justify-between text-xs text-neutral-400 relative z-10">
          <span>{subtitle}</span>
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
