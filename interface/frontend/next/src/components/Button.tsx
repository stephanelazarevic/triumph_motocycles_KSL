import React from 'react';
import { cn } from "@/lib/utils";
import { Button as BaseButton } from "@/components/ui/button";

type ButtonProps = {
  onClick: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'warning';
  icon?: React.ReactNode;
  text: string;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  onClick,
  variant = 'default',
  icon,
  text,
  className
}) => {
  const variantStyles = {
    default: 'bg-gray-500 hover:bg-gray-600',
    primary: 'bg-[#112434] hover:bg-blue-600',
    secondary: 'bg-purple-500 hover:bg-purple-600',
    danger: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600'
  };

  return (
    <BaseButton
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-md font-semibold text-white",
        variantStyles[variant],
        "transition-colors duration-200",
        className
      )}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </BaseButton>
  );
};

export default Button;
