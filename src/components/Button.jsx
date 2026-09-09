import React from 'react';
import { Link } from 'react-router-dom';

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5 shadow-sm"
  };

  const variantStyles = {
    primary: "bg-[#B5563C] text-[#FAF6EF] hover:bg-[#9E442B] active:bg-[#853620] focus:ring-[#B5563C] shadow-sm",
    secondary: "bg-[#FAF6EF] text-[#2B241D] border border-[#2B241D]/20 hover:bg-[#ECE4D8] hover:border-[#2B241D] focus:ring-[#2B241D]",
    accent: "bg-[#B5563C] text-white hover:bg-[#9E442B] active:bg-[#853620] focus:ring-[#B5563C] shadow-sm",
    dark: "bg-[#2B241D] text-[#FAF6EF] hover:bg-[#1F1813] focus:ring-[#2B241D] shadow-sm",
    outline: "bg-transparent text-[#2B241D] border border-[#2B241D] hover:bg-[#2B241D] hover:text-[#FAF6EF] focus:ring-[#2B241D]",
    ghost: "bg-transparent text-stone-700 hover:text-[#B5563C] hover:bg-stone-100/70 focus:ring-stone-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };

  const combinedClass = `${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`;

  const renderContent = () => (
    <>
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClass} {...props}>
        {renderContent()}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClass} {...props}>
        {renderContent()}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combinedClass}
      {...props}
    >
      {renderContent()}
    </button>
  );
}
