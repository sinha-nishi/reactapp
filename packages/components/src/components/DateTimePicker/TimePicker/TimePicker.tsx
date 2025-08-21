import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./timepicker.css";

type Period = "AM" | "PM";

type Time = {
  hour: number;
  minute: number;
  period: Period;
};

type TimePickerProps = {
  /** show only one type: "dial" or "input" */
  type: "dial" | "input";
  value?: Time;
  initialHour?: number;
  initialMinute?: number;
  initialPeriod?: Period;
  onChange?: (t: Time) => void;
  label?: string;
  disabled?: boolean;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function from12h(hour: number, period: Period) {
  const h = hour % 12;
  return period === "PM" ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;
}

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

export function TimePicker(props: TimePickerProps) {
  const {
    type,
    value,
    initialHour = 10,
    initialMinute = 30,
    initialPeriod = "AM",
    onChange,
    label = "Time",
    disabled = false,
  } = props;

  const [time, setTime] = useState<Time>(
    value ?? { hour: initialHour, minute: initialMinute, period: initialPeriod }
  );
  const [view, setView] = useState<"hours" | "minutes">("hours");

  useEffect(() => {
    if (value) setTime(value);
  }, [value?.hour, value?.minute, value?.period]);

  const commit = useCallback(
    (t: Partial<Time>) => {
      setTime((prev) => {
        const next: Time = { ...prev, ...t } as Time;
        onChange?.(next);
        return next;
      });
    },
    [onChange]
  );

  const dialRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<null | "hours" | "minutes">(null);

  const angleFromPoint = (clientX: number, clientY: number) => {
    const el = dialRef.current!;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const rad = Math.atan2(dy, dx);
    let deg = (rad * 180) / Math.PI;
    deg = deg + 90;
    if (deg < 0) deg += 360;
    return deg;
  };

  const handleDialPointer = useCallback((clientX: number, clientY: number) => {
    const deg = angleFromPoint(clientX, clientY);
    if (isDraggingRef.current === "hours") {
      const snapped = Math.round(deg / 30) % 12;
      const newHour = snapped === 0 ? 12 : snapped;
      commit({ hour: newHour });
    } else if (isDraggingRef.current === "minutes") {
      let m = Math.round(deg / 6);
      if (m === 60) m = 0;
      commit({ minute: m });
    }
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      if (e instanceof TouchEvent) {
        const t = e.touches[0];
        handleDialPointer(t.clientX, t.clientY);
      } else {
        handleDialPointer((e as MouseEvent).clientX, (e as MouseEvent).clientY);
      }
    };
    const onUp = () => {
      isDraggingRef.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [handleDialPointer]);

  const startDrag =
    (phase: "hours" | "minutes") =>
    (e: React.MouseEvent | React.TouchEvent) => {
      if (disabled) return;
      isDraggingRef.current = phase;
      if (e.nativeEvent instanceof TouchEvent) {
        const t = (e.nativeEvent as TouchEvent).touches[0];
        handleDialPointer(t.clientX, t.clientY);
      } else {
        const m = e as React.MouseEvent;
        handleDialPointer(m.clientX, m.clientY);
      }
    };

  const hourAngle = useMemo(() => ((time.hour % 12) / 12) * 360, [time.hour]);
  const minuteAngle = useMemo(() => (time.minute / 60) * 360, [time.minute]);

  return (
    <div className={`tp-root ${disabled ? "tp-disabled" : ""}`}>
      <div className="tp-header">
        {label && <div className="tp-label">{label}:</div>}
        <div className="tp-time-display">
          {pad2(time.hour)}:{pad2(time.minute)}
        </div>
        <div className="tp-period-switch">
          <button
            className={`tp-tab ${time.period === "AM" ? "tp-tab-active" : ""}`}
            onClick={() => commit({ period: "AM" })}
          >
            AM
          </button>
          <button
            className={`tp-tab ${time.period === "PM" ? "tp-tab-active" : ""}`}
            onClick={() => commit({ period: "PM" })}
          >
            PM
          </button>
        </div>
      </div>

      {type === "dial" ? (
        <div className="tp-body">
          <div className="tp-dial" ref={dialRef}>
            <div className="tp-ring" />

            {view === "hours"
              ? Array.from({ length: 12 }).map((_, i) => {
                  const val = i + 1;
                  const angle = (val % 12) * 30;
                  const dialSize = dialRef.current?.offsetWidth ?? 260;
                  const labelSize = 40; // adjust agar font-size change karein
                  const radius = dialSize / 2 - labelSize / 2;
                  return (
                    <div
                      key={val}
                      className={`tp-num ${
                        val === time.hour ? "tp-num-active" : ""
                      }`}
                      style={{
                        transform: `rotate(${angle}deg) translate(0, -${radius}px) rotate(${-angle}deg)`,
                      }}
                      onMouseDown={startDrag("hours")}
                      onTouchStart={startDrag("hours")}
                    >
                      {val}
                    </div>
                  );
                })
              : Array.from({ length: 12 }).map((_, i) => {
                  const val = (i * 5) % 60;
                  const angle = i * 30;
                  const dialSize = dialRef.current?.offsetWidth ?? 260;
                  const labelSize = 48; // 2-digit text ke liye thoda bada rakha
                  const radius = dialSize / 2 - labelSize / 2;
                  return (
                    <div
                      key={i}
                      className={`tp-num ${
                        val === Math.round(time.minute / 5) * 5
                          ? "tp-num-active"
                          : ""
                      }`}
                      style={{
                        transform: `rotate(${angle}deg) translate(0, -${radius}px) rotate(${-angle}deg)`,
                      }}
                      onMouseDown={startDrag("minutes")}
                      onTouchStart={startDrag("minutes")}
                    >
                      {pad2(val)}
                    </div>
                  );
                })}

            <div
              className="tp-needle"
              style={{
                transform: `rotate(${
                  view === "hours" ? hourAngle : minuteAngle
                }deg)`,
              }}
              onMouseDown={startDrag(view)}
              onTouchStart={startDrag(view)}
            >
              <div className="tp-needle-cap" />
            </div>
            <div className="tp-center" />
          </div>
          <div className="tp-view-switch">
            <button
              className={`tp-tab ${view === "hours" ? "tp-tab-active" : ""}`}
              onClick={() => setView("hours")}
            >
              Hours
            </button>
            <button
              className={`tp-tab ${view === "minutes" ? "tp-tab-active" : ""}`}
              onClick={() => setView("minutes")}
            >
              Minutes
            </button>
          </div>
          {/* <div className="tp-footer">
            <button className="tp-btn tp-btn-cancel">Cancel</button>
            <button className="tp-btn tp-btn-ok">OK</button>
          </div> */}
        </div>
      ) : (
        <div className="tp-body">
          <div className="tp-inputs">
            <label className="tp-input">
              <span>Hour</span>
              <input
                type="number"
                min={1}
                max={12}
                value={time.hour}
                disabled={disabled}
                onChange={(e) =>
                  commit({
                    hour: clamp(
                      parseInt(e.target.value || "0", 10) || 0,
                      1,
                      12
                    ),
                  })
                }
              />
            </label>
            <span className="tp-colon">:</span>
            <label className="tp-input">
              <span>Minute</span>
              <input
                type="number"
                min={0}
                max={59}
                value={time.minute}
                disabled={disabled}
                onChange={(e) =>
                  commit({
                    minute: clamp(
                      parseInt(e.target.value || "0", 10) || 0,
                      0,
                      59
                    ),
                  })
                }
              />
            </label>
            <label className="tp-select">
              <span>Period</span>
              <select
                value={time.period}
                onChange={(e) => commit({ period: e.target.value as Period })}
              >
                <option>AM</option>
                <option>PM</option>
              </select>
            </label>
          </div>
          {/* <div className="tp-footer">
            <button className="tp-btn tp-btn-cancel">Cancel</button>
            <button className="tp-btn tp-btn-ok">OK</button>
          </div> */}
        </div>
      )}
    </div>
  );
}
