import React from 'react';

/**
 * Reusable Badge component with civic-tech color variants
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon,
}) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full transition-colors';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  };

  const variantStyles = {
    default: 'bg-emerald-50 text-emerald-800 border border-emerald-200/70',
    forest: 'bg-emerald-800 text-white shadow-xs',
    subtle: 'bg-stone-100 text-stone-700 border border-stone-200',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    blue: 'bg-sky-50 text-sky-800 border border-sky-200/80',
    outline: 'bg-transparent text-emerald-800 border border-emerald-600/40',
    neutral: 'bg-white text-stone-700 border border-stone-200 shadow-2xs',
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}

