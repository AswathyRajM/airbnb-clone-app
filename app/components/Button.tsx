'use client';
import React from 'react';
import { IconType } from 'react-icons';

interface ButtonProps {
  label: string | React.ReactElement;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
const Button: React.FC<ButtonProps> = ({
  label,
  disabled,
  outline,
  small,
  icon: Icon,
  onClick,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
    relative
    disabled:cursor-not-allowed
    disabled:opacity-70
    hover:opacity-80
    rounded-lg
    w-full
    transition 
    ${
      outline
        ? 'bg-white border-black text-black'
        : 'bg-rose-500 border-rose-500 text-white'
    }
    ${
      small
        ? 'py-1 text-sm font-light border-[1px]'
        : 'py-3 text-md font-semibold border-2'
    }
   `}
    >
      {Icon && <Icon size={24} className='absolute left-4 top-3' />}
      {label}
    </button>
  );
};

export default Button;
