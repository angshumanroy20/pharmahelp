import React from 'react';

export const Input = React.forwardRef(({ 
  className = '', 
  type = 'text', 
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={`flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:border-teal-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";
