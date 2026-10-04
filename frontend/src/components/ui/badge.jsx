import React from 'react';

export const Badge = ({ 
  className = '', 
  variant = 'default', 
  children, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variants = {
    default: "bg-teal-100 text-teal-800 border border-teal-200/80",
    secondary: "bg-slate-100 text-slate-700 border border-slate-200",
    outline: "text-slate-600 border border-slate-200 bg-white",
    destructive: "bg-rose-50 text-rose-700 border border-rose-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border border-amber-200",
    purple: "bg-purple-100 text-purple-800 border border-purple-200"
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
