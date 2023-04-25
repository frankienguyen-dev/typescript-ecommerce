import { range } from "lodash";
import React, { useState } from "react";

interface Props {
  onChange?: (value: Date) => void;
  value?: Date;
  errorMessage?: string;
}

export default function DateSelect({ onChange, value, errorMessage }: Props) {
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990,
  });

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    const newDate = {
      ...date,
      [name]: value,
    };
    setDate(newDate);
    if (onChange) {
      onChange(new Date(newDate.year, newDate.month, newDate.date));
    }
  };

  return (
    <div className=" mt-2 flex flex-col flex-wrap sm:flex-row">
      <div className="w-full truncate pt-3 capitalize sm:w-[20%] sm:text-right">
        Ngày sinh:
      </div>
      <div className="mt-3 w-full sm:mt-0 sm:w-[80%] sm:pl-5">  
        <div className="flex justify-between gap-5">
          <select
            onChange={handleChange}
            value={value?.getDate() || date.date}
            name="date"
            className="h-10 w-[32%] rounded-sm border border-black/10 pl-2 hover:cursor-pointer
         hover:border-orange"
          >
            <option disabled>Ngày</option>
            {range(1, 32).map((item) => (
              <option value={item} key={item}>
                Ngày {item}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            value={value?.getMonth() || date.month}
            name="month"
            className="h-10 w-[32%] rounded-sm border border-black/10 pl-2 hover:cursor-pointer
         hover:border-orange"
          >
            <option disabled>Tháng</option>
            {range(0, 12).map((item) => (
              <option value={item} key={item}>
                Tháng {item + 1}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            value={value?.getFullYear() || date.year}
            name="year"
            className="h-10 w-[32%] rounded-sm border border-black/10
         pl-2 hover:cursor-pointer hover:border-orange"
          >
            <option disabled>Năm</option>
            {range(1990, 2024).map((item) => (
              <option value={item} key={item}>
                Năm {item}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-1 min-h-[1.25rem] text-sm text-red-600">
          {errorMessage}
        </div>
      </div>
    </div>
  );
}