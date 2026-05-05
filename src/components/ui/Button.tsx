'use client';

import Link from 'next/link';
import Icon from './Icon';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  full?: boolean;
  icon?: string;
  iconRight?: string;
  href?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled,
  full,
  icon,
  iconRight,
  href,
}: ButtonProps) {
  const cls = `btn btn-${variant} btn-${size}${full ? ' btn-full' : ''}`;
  const iconSize = size === 'sm' ? 14 : 16;

  const content = (
    <>
      {icon && <Icon name={icon} size={iconSize} />}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} size={iconSize} />}
    </>
  );

  if (href) {
    return <Link href={href} className={cls}>{content}</Link>;
  }

  return (
    <button className={cls} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
}
