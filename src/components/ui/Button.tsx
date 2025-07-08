import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses = 'font-bold rounded transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-infernus-gold';
  
  const variantClasses = {
    primary: 'bg-infernus-blood hover:bg-red-700 text-infernus-gold border border-infernus-gold shadow-infernal hover:shadow-gold',
    secondary: 'bg-infernus-charcoal hover:bg-gray-600 text-infernus-gold border border-infernus-silver',
    danger: 'bg-red-600 hover:bg-red-700 text-white border border-red-500',
    ghost: 'bg-transparent hover:bg-infernus-charcoal text-infernus-gold border border-transparent hover:border-infernus-gold',
  };
  
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

