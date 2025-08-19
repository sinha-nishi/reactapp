import React, { useState } from "react";
import "./DatePicker.css";

export type DatePickerProps = {
  variant?: "docked" | "modal" | "modal-input";
  initialDate?: Date;
  onChange?: (date: Date) => void;
};

const DatePicker: React.FC<DatePickerProps> = ({
  variant = "docked",
  initialDate = new Date(),
  onChange,
}) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);

  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
  

  // ---- Calendar Renderer ----
  const renderCalendar = (
    dateValue: Date | null,
    setValue: (d: Date) => void
  ) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();
    const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;

    const cells: React.ReactNode[] = [];

    // weekdays header
    weekdays.forEach((w, i) => {
      cells.push(
        <div key={`weekday-${i}`} className="dp-weekday">
          {w}
        </div>
      );
    });

    // grid cells
    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - startDay + 1;

      if (i < startDay || dayNum > daysInMonth) {
        cells.push(<div key={`blank-${i}`} className="dp-cell empty" />);
      } else {
        const date = new Date(year, month, dayNum);
        const isToday = date.toDateString() === new Date().toDateString();
        const isSelected = dateValue?.toDateString() === date.toDateString();

        cells.push(
          <button
            key={i}
            className={`dp-cell ${isToday ? "today" : ""} ${
              isSelected ? "selected" : ""
            }`}
            onClick={() => setValue(date)}
          >
            {dayNum}
          </button>
        );
      }
    }

    return <div className="dp-grid">{cells}</div>;
  };

  // ---- Modal Header (only for modal variant) ----
  const ModalHeader = () => (
    <>
      <div className="dp-dialog-header">
        {/* Top subtitle */}
        <p className="dp-dialog-subtitle">Select date</p>
  
        {/* Date row (date + edit button in same row) */}
        <div className="dp-dialog-date-row">
          <h2 className="dp-dialog-date">
            {tempDate
              ? tempDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })
              : selectedDate
              ? selectedDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })
              : currentDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
          </h2>
          <button className="dp-edit-btn">✎</button>
        </div>
      </div>
  
      <hr className="dp-divider" />
    </>
  );
  

  // ---- Month Selector (common in all) ----
  const MonthSelector = () => (
    <div className="dp-month-row">
      <select
        className="dp-month-select"
        value={`${currentDate.getFullYear()}-${currentDate.getMonth()}`}
        onChange={(e) => {
          const [year, month] = e.target.value.split("-").map(Number);
          setCurrentDate(new Date(year, month, 1));
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <option key={i} value={`${currentDate.getFullYear()}-${i}`}>
            {new Date(currentDate.getFullYear(), i, 1).toLocaleString("en-US", {
              month: "long",
            })}{" "}
            {currentDate.getFullYear()}
          </option>
        ))}
      </select>

      <div className="dp-month-controls">
        <button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
            )
          }
        >
          ◀
        </button>
        <button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
            )
          }
        >
          ▶
        </button>
      </div>
    </div>
  );

  // ----------------- DOCKED -----------------
  if (variant === "docked") {
    return (
      <div className="dp-field">
        <label className="dp-label">Date</label>
        <input
          className="dp-input"
          type="text"
          readOnly
          value={selectedDate ? selectedDate.toLocaleDateString() : ""}
          placeholder="MM/DD/YYYY"
        />
        <div className="dp-dialog docked-variant">
          <MonthSelector />
          {renderCalendar(selectedDate, setSelectedDate)}
        </div>
      </div>
    );
  }

  // ----------------- MODAL -----------------
  if (variant === "modal") {
    return (
      <div className="dp-overlay">
        <div className="dp-dialog modal-variant">
          <ModalHeader />
          <MonthSelector />
          {renderCalendar(tempDate, setTempDate)}
          <div className="dp-actions">
            <button className="dp-action" onClick={() => setTempDate(null)}>
              Cancel
            </button>
            <button
              className="dp-action primary"
              onClick={() => {
                if (tempDate) {
                  setSelectedDate(tempDate);
                  onChange?.(tempDate);
                }
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------- MODAL-INPUT -----------------
  if (variant === "modal-input") {
    return (
      <>
        <div className="dp-field" onClick={() => setShowModal(true)}>
          <label className="dp-label">Date</label>
          <input
            className="dp-input"
            type="text"
            readOnly
            value={selectedDate ? selectedDate.toLocaleDateString() : ""}
            placeholder="MM/DD/YYYY"
          />
        </div>

        {showModal && (
          <div
            className="dp-overlay"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <div className="dp-dialog modal-variant">
              <MonthSelector />
              {renderCalendar(tempDate, setTempDate)}
              <div className="dp-actions">
                <button
                  className="dp-action"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="dp-action primary"
                  onClick={() => {
                    if (tempDate) {
                      setSelectedDate(tempDate);
                      onChange?.(tempDate);
                    }
                    setShowModal(false);
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export default DatePicker;
