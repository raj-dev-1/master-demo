import React from 'react';

interface CheckboxFourProps {
  value1: string;
  value2: string;
  selectedValue: string;
  onChange: (value: string) => void;
}

const CheckboxFour: React.FC<CheckboxFourProps> = ({ value1, value2, selectedValue, onChange }) => {
  const handleChange = (value: string) => {
    onChange(value);
  };

  return (
    <div className="flex gap-3 items-center">
      <label htmlFor={value1} className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="radio"
            id={value1}
            name="gender"
            className="sr-only"
            onChange={() => handleChange(value1)}
            checked={selectedValue === value1}
          />
          <div className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border ${selectedValue === value1 ? "border-primary" : ""}`}>
            <span className={`h-2.5 w-2.5 rounded-full bg-transparent ${selectedValue === value1 ? "!bg-primary" : ""}`}></span>
          </div>
        </div>
        {value1}
      </label>
      <label htmlFor={value2} className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="radio"
            id={value2}
            name="gender"
            className="sr-only"
            onChange={() => handleChange(value2)}
            checked={selectedValue === value2}
          />
          <div className={`mr-4 flex h-5 w-5 items-center justify-center rounded-full border ${selectedValue === value2 ? "border-primary" : ""}`}>
            <span className={`h-2.5 w-2.5 rounded-full bg-transparent ${selectedValue === value2 ? "!bg-primary" : ""}`}></span>
          </div>
        </div>
        {value2}
      </label>
    </div>
  );
};

export default CheckboxFour;
