import React, { InputHTMLAttributes, forwardRef, useState } from "react";

export interface InputNumberProps
  extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
  classNameInput?: string;
  classNameError?: string;
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  function InputNumberInner(
    {
      className,
      errorMessage,
      classNameInput = "w-full rounded-sm border-[1px] border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm",
      classNameError = "mt-1 min-h-[1.25rem] text-sm text-red-600",
      onChange,
      value = "",
      ...rest
    },
    ref
  ) {
    const [localValue, setLocalValue] = useState<string>(value as string);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      if (/^\d+$/.test(value) || value === "") {
        onChange && onChange(event);
        setLocalValue(value);
      }
    };

    return (
      <div className={className}>
        <input
          onChange={handleChange}
          value={value || localValue}
          className={classNameInput}
          {...rest}
          ref={ref}
        />
        <div className={classNameError}>{errorMessage}</div>
      </div>
    );
  }
);

export default InputNumber;
