import React from 'react';

const HotelField = ({ label, name, value, onChange, type = 'text', required, ...props }) => (
  <div className="bg-blue-50 bg-blend-lighten border-slate-950">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    {type === 'textarea' ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
        {...props}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
        {...props}
      />
    )}
  </div>
);

export default HotelField;
