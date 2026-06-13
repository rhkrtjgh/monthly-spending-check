import { useEffect, useRef, useState } from "react";

import type { ExpenseSortOrder } from "../../types/expense";

interface SortSelectOption {
  value: ExpenseSortOrder;
  label: string;
}

interface SortSelectProps {
  value: ExpenseSortOrder;
  options: SortSelectOption[];
  onChange: (value: ExpenseSortOrder) => void;
}

export function SortSelect({ value, options, onChange }: SortSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? options[0]?.label;

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (
        target instanceof Node &&
        !containerRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [open]);

  return (
    <div className="dashboard-screen__sort-select-wrap" ref={containerRef}>
      <button
        type="button"
        className="dashboard-screen__sort-select"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="정렬 기준"
        onClick={() => setOpen((prev) => !prev)}
      >
        {selectedLabel}
      </button>

      {open ? (
        <ul className="dashboard-screen__sort-dropdown" role="listbox">
          {options.map((option) => (
            <li key={option.value} role="none">
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                className={`dashboard-screen__sort-option${
                  option.value === value
                    ? " dashboard-screen__sort-option--active"
                    : ""
                }`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
