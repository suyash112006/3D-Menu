import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  return (
    <button onClick={onClick} className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
