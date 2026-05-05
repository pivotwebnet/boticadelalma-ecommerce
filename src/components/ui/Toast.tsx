'use client';

import { useStore } from '@/store/useStore';
import Icon from './Icon';

export default function Toast() {
  const toast = useStore(s => s.toast);

  return (
    <div className={`toast${toast ? ' show' : ''}`}>
      {toast && (
        <>
          <Icon name="check" size={14} />
          <span>{toast.msg}</span>
        </>
      )}
    </div>
  );
}
