import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-12 w-auto'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <svg 
        className={sizeClasses[size]} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circular background */}
        <circle cx="20" cy="20" r="18" fill="#22C55E" stroke="#F97316" strokeWidth="2"/>
        
        {/* Play button icon */}
        <path 
          d="M16 14L26 20L16 26V14Z" 
          fill="white" 
          stroke="white" 
          strokeWidth="1"
        />
        
        {/* Small streaming dots */}
        <circle cx="28" cy="12" r="1.5" fill="#F97316"/>
        <circle cx="32" cy="16" r="1" fill="#F97316" opacity="0.7"/>
        <circle cx="30" cy="20" r="0.8" fill="#F97316" opacity="0.5"/>
      </svg>
      
      <span className={`font-bold text-gray-900 ${
        size === 'sm' ? 'text-lg' : 
        size === 'md' ? 'text-xl' : 
        'text-2xl'
      }`}>
        Infomercialy
      </span>
    </div>
  );
};

export default Logo;