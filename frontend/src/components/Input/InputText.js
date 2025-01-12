import { useState } from "react";

function InputText({
  labelTitle,
  labelStyle,
  type,
  containerStyle,
  defaultValue,
  placeholder,
  updateFormValue,
  updateType,
  isDropdown = false, // Tambahkan properti untuk dropdown
  options = [], // Tambahkan properti untuk opsi dropdown
}) {
  const [value, setValue] = useState(defaultValue);

  const updateInputValue = (val) => {
    setValue(val);
    updateFormValue({ updateType, value: val });
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label font-bold">
        <span className={"label-text text-base-content " + labelStyle}>
          {labelTitle}
        </span>
      </label>
      {isDropdown ? (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => updateInputValue(e.target.value)}
            className="input input-bordered w-full appearance-none pr-10"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {/* Tambahkan ikon dropdown */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      ) : (
        <input
          type={type || "text"}
          value={value}
          placeholder={placeholder || ""}
          onChange={(e) => updateInputValue(e.target.value)}
          className="input input-bordered w-full"
        />
      )}
    </div>
  );
}

export default InputText;
