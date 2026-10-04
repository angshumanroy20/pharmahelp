import React from 'react';

export const Card = ({ className = '', children, ...props }) => (
  <div
    className={`rounded-2xl border border-slate-200/90 bg-white text-slate-900 shadow-sm transition-all ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ className = '', children, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className = '', children, ...props }) => (
  <h3 className={`text-lg font-bold leading-none tracking-tight text-slate-900 ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className = '', children, ...props }) => (
  <p className={`text-xs text-slate-500 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className = '', children, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className = '', children, ...props }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);
