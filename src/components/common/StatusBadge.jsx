import React from 'react';
import { STATUS_CONFIG } from '../../utils/constants';

/**
 * Status pill for showing verification status.
 * @param {string} status - 'Pending' | 'Approved' | 'Rejected' | 'Under Review'
 * @param {'sm'|'md'} size
 */
export const StatusBadge = ({ status, size = 'md' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Pending'];
  const textSize = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${config.bg} ${config.color} ${config.border} ${textSize}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
