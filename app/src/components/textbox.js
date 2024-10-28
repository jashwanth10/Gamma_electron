import React from 'react';

const TextBox = ({ placeholder, value, onChange, heading}) => {
  return (
    <div className="flex items-center space-x-4">
    {/* Side Heading */}
        <label className="text-lg font-medium">{heading}</label>
        <input
        type="text"
        placeholder={placeholder || "Enter text"}
        value={value}
        onChange={onChange}
        className="input input-bordered w-full max-w-xs"
        />
    </div>
  );
};

export default TextBox;