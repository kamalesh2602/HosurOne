import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * EmptyState component for verified content sections awaiting real-world data
 */
export default function EmptyState({
  icon: Icon = AlertCircle,
  badgeText = 'Awaiting Verified Data',
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className = '',
}) {
  return (
    <div
      className={`rounded-2xl border border-stone-200 bg-white p-8 sm:p-12 text-center max-w-2xl mx-auto ${className}`}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-600 mb-4 border border-stone-200/60">
        <Icon className="h-7 w-7 text-emerald-800" aria-hidden="true" />
      </div>

      {badgeText && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200 mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          {badgeText}
        </span>
      )}

      <h3 className="text-lg sm:text-xl font-semibold text-stone-900 tracking-tight mb-2">
        {title}
      </h3>

      <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-lg mx-auto mb-6">
        {description}
      </p>

      {(actionText || secondaryActionText) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionText && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium bg-emerald-800 text-white hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 transition-colors shadow-xs cursor-pointer"
            >
              {actionText}
            </button>
          )}

          {secondaryActionText && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium bg-stone-100 text-stone-700 hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 transition-colors cursor-pointer"
            >
              {secondaryActionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

