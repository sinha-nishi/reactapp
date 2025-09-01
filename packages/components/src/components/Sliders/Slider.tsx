// Slider.tsx
import React, { useState, useEffect } from "react";
import "./slider.css";

type Variant = "continuous" | "stepped" | "range" | "vertical";

interface SliderProps {
  variant?: Variant;
  min?: number;
  max?: number;
  step?: number;
  value?: number | [number, number];
  onChange?: (val: number | [number, number]) => void;
}

export const Slider: React.FC<SliderProps> = ({
  variant = "continuous",
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
}) => {
  const isRange = variant === "range";
  const isVertical = variant === "vertical";

  const [internalValue, setInternalValue] = useState<number | [number, number]>(
    value ?? (isRange ? [min, max] : min)
  );

  // ✅ Sync with external value
  useEffect(() => {
    if (value !== undefined) setInternalValue(value);
  }, [value]);

  const updateValue = (val: number | [number, number]) => {
    setInternalValue(val);
    onChange?.(val);
  };

  // ✅ Range handler
  const handleRangeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: 0 | 1
  ) => {
    const val = Number(e.target.value);
    let [start, end] = internalValue as [number, number];
  
    if (idx === 0) {
      // left handle
      start = Math.max(min, Math.min(val, end - step));
    } else {
      // right handle
      end = Math.min(max, Math.max(val, start + step));
    }
  
    updateValue([start, end]);
  };
  

  return (
    <div className={`slider ${isVertical ? "vertical" : ""}`}>
      <div className="slider-track">
        {isRange ? (
          <div
            className="slider-fill"
            style={{
              left: `${((internalValue as [number, number])[0] / max) * 100}%`,
              width: `${
                (((internalValue as [number, number])[1] -
                  (internalValue as [number, number])[0]) /
                  max) *
                100
              }%`,
            }}
          />
        ) : (
          <div
            className="slider-fill"
            style={{
              [isVertical ? "height" : "width"]: `${
                ((internalValue as number) / max) * 100
              }%`,
            }}
          />
        )}
      </div>

      {/* Inputs */}
      {isRange ? (
        <>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={(internalValue as [number, number])[0]}
            onChange={(e) => handleRangeChange(e, 0)}
            className="slider-input"
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={(internalValue as [number, number])[1]}
            onChange={(e) => handleRangeChange(e, 1)}
            className="slider-input"
          />
        </>
      ) : (
        <input
          type="range"
          min={min}
          max={max}
          step={variant === "stepped" ? step : 1}
          value={internalValue as number}
          onChange={(e) => updateValue(Number(e.target.value))}
          className="slider-input"
        />
      )}
    </div>
  );
};
