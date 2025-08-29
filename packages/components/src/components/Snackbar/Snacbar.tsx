// Snackbar.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./snacbar.css";

type Variant = "neutral" | "success" | "error" | "warning" | "info";
type Tone = "solid" | "outline" | "glass" | "elevated";
type VAlign = "top" | "bottom";
type HAlign = "start" | "center" | "end";

export interface SnackbarOptions {
  id?: string;
  message: React.ReactNode;
  variant?: Variant;
  tone?: Tone;
  duration?: number; // ms, 0 = persist until closed
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
  icon?: React.ReactNode;
  valign?: VAlign;
  halign?: HAlign;
  // custom classes
  className?: string;
}

type EnqueueFn = (opts: SnackbarOptions) => string; // returns id
type CloseFn = (id: string) => void;

const SnackbarCtx = createContext<{
  enqueue: EnqueueFn;
  close: CloseFn;
} | null>(null);

export const useSnackbar = () => {
  const ctx = useContext(SnackbarCtx);
  if (!ctx)
    throw new Error("useSnackbar must be used inside <SnackbarProvider />");
  return ctx;
};

type Item = Required<Pick<SnackbarOptions, "id">> &
  SnackbarOptions & { createdAt: number };

export const SnackbarProvider: React.FC<{
  children: React.ReactNode;
  max?: number;
}> = ({ children, max = 3 }) => {
  const [items, setItems] = useState<Item[]>([]);
  const idRef = useRef(0);

  const close: CloseFn = useCallback((id) => {
    setItems((list) => list.filter((i) => i.id !== id));
  }, []);

  const enqueue: EnqueueFn = useCallback(
    (opts) => {
      const id = opts.id ?? `snk_${++idRef.current}`;
      setItems((list) => {
        const next: Item = {
          id,
          createdAt: Date.now(),
          variant: "neutral",
          tone: "elevated",
          duration: 4000,
          dismissible: true,
          valign: "bottom",
          halign: "center",
          ...opts,
        };
        const merged = [...list, next];
        // cap by max (drop oldest)
        return merged.length > max ? merged.slice(merged.length - max) : merged;
      });
      return id;
    },
    [max]
  );

  const value = useMemo(() => ({ enqueue, close }), [enqueue, close]);

  // group by position (top/bottom x start/center/end)
  const groups = useMemo(() => {
    const map = new Map<string, Item[]>();
    items.forEach((it) => {
      const key = `${it.valign}-${it.halign}`;
      const arr = map.get(key) ?? [];
      arr.push(it);
      map.set(key, arr);
    });
    return map;
  }, [items]);

  return (
    <SnackbarCtx.Provider value={value}>
      {children}
      {[...groups.entries()].map(([key, list]) => {
        const [valign, halign] = key.split("-") as [VAlign, HAlign];
        // render a stack per group
        return (
          <div
            key={key}
            className={`snackbar-viewport snackbar-${valign} snackbar-${halign}`}
          >
            {list.map((it) => (
              <SnackbarItem
                key={it.id}
                item={it}
                onClose={() => close(it.id)}
              />
            ))}
          </div>
        );
      })}
    </SnackbarCtx.Provider>
  );
};

const SnackbarItem: React.FC<{ item: Item; onClose: () => void }> = ({
  item,
  onClose,
}) => {
  const {
    message,
    variant = "neutral",
    tone = "elevated",
    duration = 4000,
    actionLabel,
    onAction,
    dismissible = true,
    icon,
    className,
  } = item;

  const [hover, setHover] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const accRef = useRef(0);

  // auto hide with pause-on-hover
  useEffect(() => {
    setMounted(true); // ✅ hamesha mount pe true kar do

    if (!duration || duration <= 0) return; // persistent -> no timer
    const tick = (t: number) => {
      if (hover) {
        startRef.current = t; // freeze
      } else {
        if (startRef.current == null) startRef.current = t;
        const delta = t - startRef.current;
        startRef.current = t;
        accRef.current += delta;
        setProgress(Math.min(1, accRef.current / duration));
        if (accRef.current >= duration) return onClose();
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [duration, hover, onClose]);

  // ESC to close (assertive for error, polite otherwise)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const role = variant === "error" ? "alert" : "status";
  const ariaLive = variant === "error" ? "assertive" : "polite";

  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={[
        "snackbar",
        `snackbar-variant-${variant}`,
        `snackbar-tone-${tone}`,
        mounted ? "snackbar-in" : "",
        className ?? "",
      ].join(" ")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {icon && (
        <span className="snackbar-icon" aria-hidden>
          {icon}
        </span>
      )}

      <div className="snackbar-message">{message}</div>

      {actionLabel && (
        <button
          className="snackbar-action"
          onClick={() => {
            onAction?.();
            onClose();
          }}
        >
          {actionLabel}
        </button>
      )}

      {dismissible && (
        <button
          className="snackbar-close"
          aria-label="Close notification"
          onClick={onClose}
        >
          ×
        </button>
      )}

      {/* progress (hidden when persistent) */}
      {duration > 0 && (
        <div className="snackbar-progress">
          <div
            className="snackbar-progress-bar"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      )}
    </div>
  );
};
