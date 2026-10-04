import React from 'react';

export const Button = React.forwardRef(({ 
  className = '', 
  variant = 'default', 
  size = 'default', 
  children, 
  disabled, 
  type = 'button',
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]";

  const variants = {
    default: "bg-teal-600 text-white shadow-sm hover:bg-teal-700",
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200/80",
    outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 shadow-xs",
    ghost: "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900",
    destructive: "bg-rose-600 text-white shadow-sm hover:bg-rose-700",
    purple: "bg-purple-600 text-white shadow-sm hover:bg-purple-700",
    gradient: "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-md hover:shadow-lg"
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 rounded-lg px-3 text-xs",
    lg: "h-12 rounded-2xl px-6 text-base",
    icon: "h-9 w-9 p-0"
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
