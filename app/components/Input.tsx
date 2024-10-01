'use client';

import React, { ChangeEvent } from 'react';

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  name: string;
}

const Input: React.FC<InputProps> = ({ type, placeholder, value, onChange, className, name }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
    />
  );
};

export default Input;
