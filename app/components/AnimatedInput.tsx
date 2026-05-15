import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  error?: string;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  icon: Icon,
  error,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState(props.value || '');

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (props.onChange) props.onChange(e);
  };

  const isActive = isFocused || value !== '';

  return (
    <div className="relative mb-4">
      <div
        className={`absolute top-0 left-0 w-full h-full border ${
          error
            ? 'border-red-500'
            : isFocused
            ? 'border-reelspro-blue'
            : 'border-white/20'
        } rounded-md transition-all duration-200 pointer-events-none`}
      ></div>
      
      <label 
        htmlFor={props.id} 
        className={`absolute left-10 transition-all duration-200 pointer-events-none ${
          isActive 
            ? '-top-2.5 text-xs bg-black px-1 text-reelspro-blue' 
            : 'top-1/2 -translate-y-1/2 text-gray-400'
        }`}
      >
        {label}
      </label>
      
      <div className="flex items-center">
        <div className={`pl-3 py-3 text-${isFocused ? 'reelspro-blue' : 'gray-500'} transition-colors duration-200`}>
          <Icon className="h-5 w-5" />
        </div>
        <input
          {...props}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className="bg-transparent border-0 outline-none pl-2 py-3 pr-4 w-full text-white placeholder-gray-500 focus:ring-0"
        />
      </div>

      {error && (
        <p className="absolute -bottom-5 left-0 text-red-500 text-xs">{error}</p>
      )}
    </div>
  );
};

export default AnimatedInput;