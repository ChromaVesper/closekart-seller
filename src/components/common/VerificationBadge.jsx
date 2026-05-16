import React from 'react';
import { ShieldCheck } from 'lucide-react';

/**
 * Verification badge shown on approved seller profiles.
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} showLabel
 */
export const VerificationBadge = ({ size = 'md', showLabel = true }) => {
  const sizes = {
    sm: { icon: 14, text: 'text-xs', px: 'px-2 py-0.5' },
    md: { icon: 16, text: 'text-sm', px: 'px-3 py-1' },
    lg: { icon: 20, text: 'text-base', px: 'px-4 py-1.5' },
  };
  const s = sizes[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 bg-green-100 text-green-700 border border-green-300 rounded-full font-semibold ${s.px} ${s.text}`}
    >
      <ShieldCheck size={s.icon} className="flex-shrink-0" />
      {showLabel && 'Verified Seller'}
    </span>
  );
};
