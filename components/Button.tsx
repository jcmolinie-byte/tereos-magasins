import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  icon,
  className = '',
  type = 'button', // Default explicitly to 'button'
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-medium transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 border border-transparent",
    secondary: "bg-gray-500 dark:bg-white/10 text-white border border-gray-600 dark:border-white/10 hover:bg-gray-600 dark:hover:bg-white/20 hover:border-gray-700 dark:hover:border-white/30",
    danger: "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5",
    ghost: "bg-transparent text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-primary/10",
    outline: "border-2 border-primary text-primary hover:bg-primary/10"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      type={type}
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};