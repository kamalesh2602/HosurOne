import React from 'react';

/**
 * Standardized Section Heading with civic badge, title, subtitle, and optional action
 */
export default function SectionHeading({
  badge,
  title,
  subtitle,
  action,
  align = 'left',
  className = '',
}) {
  const isCentered = align === 'center';

  return (
    <div
      className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10 ${className} ${
        isCentered ? 'text-center items-center' : ''
      }`}
    >
      <div className={`space-y-1.5 ${isCentered ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
        {badge && (
          <div className={`inline-block ${isCentered ? 'mx-auto' : ''}`}>
            {typeof badge === 'string' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200">
                {badge}
              </span>
            ) : (
              badge
            )}
          </div>
        )}

        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          {title}
        </h2>

        {subtitle && (
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

