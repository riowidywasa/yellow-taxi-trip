import React from "react";
import { UseFormRegister } from "react-hook-form";
import { FilterValues } from "../Interface";


interface InputFieldProps {
  label: string;
  type: string;
  name: keyof FilterValues; // Use keyof FilterValues to restrict the name to one of the keys
  register: UseFormRegister<FilterValues>; // Register function typed for FilterValues
  required?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  optionLabels?: string[];
  options?: string[]; // For select input
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  name,
  register,
  required = false,
  min,
  max,
  step,
  options,
  optionLabels,
  error,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {type === "select" ? (
        <select
          {...register(name, { required })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          {options?.map((option, index) => (
            <option key={index} value={option}>
              {optionLabels && optionLabels[index] || ""}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          {...register(name, { required })}
          min={min}
          max={max}
          step={step}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
