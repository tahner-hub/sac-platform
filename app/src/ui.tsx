import { useState, type CSSProperties, type ReactNode } from "react";
import { C, stripeLight } from "./theme";
import { Icon, ICON } from "./icons";
import { STATUS_TONE, type StatusTone } from "./data";

export function Placeholder({
  width,
  height,
  radius = 8,
  size = 5,
  dashed = false,
  label,
  labelOnWhite = false,
  style,
  children,
}: {
  width?: number | string;
  height?: number | string;
  radius?: number;
  size?: number;
  dashed?: boolean;
  label?: string;
  labelOnWhite?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: stripeLight(size),
        border: dashed ? `1.5px dashed ${C.chipLine}` : undefined,
        display: label || children ? "flex" : undefined,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}
    >
      {label && (
        <span
          className="mono"
          style={{
            fontSize: 11,
            color: C.textFaint,
            background: labelOnWhite ? "#fff" : undefined,
            padding: labelOnWhite ? "5px 12px" : undefined,
            borderRadius: labelOnWhite ? 6 : undefined,
          }}
        >
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

export function StatusBadge({
  tone,
  children,
  style,
}: {
  tone: StatusTone | { color: string; bg: string };
  children: ReactNode;
  style?: CSSProperties;
}) {
  const t = typeof tone === "string" ? STATUS_TONE[tone] : tone;
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 700,
        color: t.color,
        background: t.bg,
        padding: "4px 10px",
        borderRadius: 999,
        width: "fit-content",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function MonoTag({
  children,
  color = C.textFaint,
  style,
}: {
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <span className="mono" style={{ fontSize: 10, letterSpacing: 1, color, ...style }}>
      {children}
    </span>
  );
}

export function SectionLabel({
  children,
  color = C.green,
  mb = 18,
}: {
  children: ReactNode;
  color?: string;
  mb?: number;
}) {
  return (
    <div className="mono" style={{ fontSize: 11, letterSpacing: 1.5, color, marginBottom: mb }}>
      {children}
    </div>
  );
}

export function Card({
  children,
  style,
  onClick,
  hover = true,
}: {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  hover?: boolean;
}) {
  const cls = ["card", hover ? (onClick ? "card-click" : "card-static") : ""].join(" ").trim();
  return (
    <div
      className={cls}
      onClick={onClick}
      style={{
        background: "#fff",
        border: `1px solid ${C.line}`,
        borderRadius: 14,
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

type BtnVariant = "primary" | "secondary" | "mint" | "ghost" | "danger" | "softGreen";

const BTN_STYLES: Record<BtnVariant, CSSProperties> = {
  primary: { color: "#fff", background: C.green, border: "none" },
  secondary: { color: C.textMute, background: "#fff", border: `1.5px solid ${C.chipLine}` },
  mint: { color: C.ink, background: C.mint, border: "none" },
  ghost: { color: "#fff", background: "transparent", border: `1.5px solid ${C.navyBorderBtn}` },
  danger: { color: C.red, background: "#fff", border: `1.5px solid ${C.redLine}` },
  softGreen: { color: C.green, background: C.greenPale, border: "none" },
};

export function Btn({
  variant = "primary",
  children,
  onClick,
  style,
  disabled = false,
  title,
}: {
  variant?: BtnVariant;
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  disabled?: boolean;
  title?: string;
}) {
  const cls = ["btn", variant === "secondary" ? "btn-secondary" : "", variant === "danger" ? "btn-danger" : ""]
    .join(" ")
    .trim();
  return (
    <button
      className={cls}
      title={title}
      disabled={disabled}
      onClick={
        onClick
          ? (e) => {
              // Buttons often sit inside clickable cards — don't let the card
              // navigate out from under the button's own action.
              e.stopPropagation();
              onClick();
            }
          : undefined
      }
      style={{
        fontSize: 14,
        fontWeight: variant === "secondary" ? 600 : 700,
        borderRadius: 9,
        padding: "12px 20px",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        opacity: disabled ? 0.55 : 1,
        ...BTN_STYLES[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function BackLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div
      className="tlink"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        color: C.textMute,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        marginBottom: 14,
      }}
    >
      <Icon d={ICON.chevronLeft} size={15} color={C.textMute} strokeWidth={2} />
      {label}
    </div>
  );
}

export function PageTitle({
  title,
  subtitle,
  size = 28,
  maxWidth,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  size?: number;
  maxWidth?: number;
}) {
  return (
    <div style={{ textAlign: "left" }}>
      <h1 style={{ fontSize: size, fontWeight: 800, letterSpacing: "-0.5px" }}>{title}</h1>
      {subtitle && (
        <p style={{ color: C.textMute, fontSize: 15, marginTop: 4, maxWidth }}>{subtitle}</p>
      )}
    </div>
  );
}

/** Section heading used on public pages — always left-aligned per spec. */
export function SectionHead({
  title,
  sub,
  size = 30,
  style,
}: {
  title: string;
  sub?: string;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <div style={{ textAlign: "left", ...style }}>
      <h2 style={{ fontSize: size, fontWeight: 800, letterSpacing: "-0.5px", textWrap: "balance" }}>
        {title}
      </h2>
      {sub && (
        <p style={{ color: C.textMute, fontSize: 16, marginTop: 8, maxWidth: 640, lineHeight: 1.55 }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export function Chip({
  children,
  active = false,
  dashed = false,
  onClick,
  style,
}: {
  children: ReactNode;
  active?: boolean;
  dashed?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  const cls = ["chip", active ? "chip-active" : ""].join(" ").trim();
  return (
    <span
      className={onClick ? cls : undefined}
      onClick={onClick}
      style={{
        fontSize: 13,
        fontWeight: active ? 700 : 600,
        color: active ? "#fff" : dashed ? C.textMute : C.ink,
        background: active ? C.navy : "#fff",
        border: active ? "1.5px solid transparent" : `1.5px ${dashed ? "dashed" : "solid"} ${C.chipLine}`,
        padding: "8px 14px",
        borderRadius: 999,
        cursor: onClick ? "pointer" : undefined,
        display: "inline-block",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function Field({
  label,
  value,
  muted = true,
  hint,
  right,
  labelStyle,
  style,
  info,
}: {
  label: string;
  value: ReactNode;
  muted?: boolean;
  hint?: string;
  right?: ReactNode;
  labelStyle?: CSSProperties;
  style?: CSSProperties;
  info?: string;
}) {
  return (
    <div style={style}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 6, ...labelStyle }}>
        {label}
        {info && <InfoIcon text={info} />}
      </div>
      <div
        style={{
          border: `1.5px solid ${C.line}`,
          borderRadius: 9,
          padding: "12px 14px",
          fontSize: 14,
          color: muted ? C.textMute : C.ink,
          display: right ? "flex" : undefined,
          justifyContent: right ? "space-between" : undefined,
          background: "#fff",
        }}
      >
        {value}
        {right}
      </div>
      {hint && <div style={{ fontSize: 12.5, color: C.textFaint, marginTop: 6 }}>{hint}</div>}
    </div>
  );
}

/** Accessible info tooltip — works on hover and on tap (mobile). */
export function InfoIcon({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={text}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        style={{
          width: 16,
          height: 16,
          borderRadius: 99,
          border: `1.5px solid ${C.textFaint}`,
          background: "transparent",
          color: C.textFaint,
          fontSize: 11,
          fontWeight: 700,
          lineHeight: 1,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        i
      </button>
      {open && (
        <span
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: C.navy,
            color: "#fff",
            fontSize: 12,
            fontWeight: 500,
            lineHeight: 1.45,
            padding: "9px 12px",
            borderRadius: 8,
            width: 240,
            zIndex: 60,
            boxShadow: "0 8px 24px rgba(11,28,48,.28)",
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
  labelStyle,
  style,
  info,
  suffix,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  type?: string;
  labelStyle?: CSSProperties;
  style?: CSSProperties;
  info?: string;
  suffix?: string;
}) {
  return (
    <div style={style}>
      {label && (
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 6, ...labelStyle }}>
          {label}
          {info && <InfoIcon text={info} />}
        </div>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            border: `1.5px solid ${C.line}`,
            borderRadius: 9,
            padding: suffix ? "12px 52px 12px 14px" : "12px 14px",
            fontSize: 14,
            color: C.ink,
            background: "#fff",
            outline: "none",
          }}
        />
        {suffix && (
          <span className="mono" style={{ position: "absolute", right: 14, fontSize: 12, color: C.textFaint }}>
            {suffix}
          </span>
        )}
      </div>
      {hint && <div style={{ fontSize: 12.5, color: C.textFaint, marginTop: 6 }}>{hint}</div>}
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  style,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  style?: CSSProperties;
}) {
  return (
    <div style={style}>
      {label && <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{label}</div>}
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          minHeight: 70,
          border: `1.5px solid ${C.line}`,
          borderRadius: 9,
          padding: "12px 14px",
          fontSize: 14,
          color: C.ink,
          background: "#fff",
          outline: "none",
          resize: "vertical",
        }}
      />
    </div>
  );
}

export function Select({
  label,
  value,
  options,
  onChange,
  style,
  labelStyle,
  info,
}: {
  label?: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  style?: CSSProperties;
  labelStyle?: CSSProperties;
  info?: string;
}) {
  return (
    <div style={style}>
      {label && (
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 6, ...labelStyle }}>
          {label}
          {info && <InfoIcon text={info} />}
        </div>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          border: `1.5px solid ${C.line}`,
          borderRadius: 9,
          padding: "12px 14px",
          fontSize: 14,
          color: C.ink,
          background: "#fff",
          outline: "none",
          cursor: "pointer",
          appearance: "none",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235B6472' stroke-width='3'><path d='M6 9l6 6 6-6'/></svg>\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function QtyStepper({
  value,
  onChange,
  min = 0,
  step = 1,
  max,
}: {
  value: number;
  onChange?: (v: number) => void;
  min?: number;
  step?: number;
  max?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        border: `1.5px solid ${C.line}`,
        borderRadius: 9,
        overflow: "hidden",
        width: "fit-content",
        background: "#fff",
      }}
    >
      <div
        className="stepbtn"
        onClick={() => onChange?.(Math.max(min, value - step))}
        style={{ padding: "10px 15px", fontSize: 16, color: C.textMute, borderRight: `1.5px solid ${C.line}`, cursor: "pointer" }}
      >
        –
      </div>
      <div style={{ padding: "10px 20px", fontSize: 15, fontWeight: 700, minWidth: 34, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
        {value}
      </div>
      <div
        className="stepbtn"
        onClick={() => onChange?.(max === undefined ? value + step : Math.min(max, value + step))}
        style={{ padding: "10px 15px", fontSize: 16, color: C.textMute, borderLeft: `1.5px solid ${C.line}`, cursor: "pointer" }}
      >
        +
      </div>
    </div>
  );
}

export function Toggle({
  on,
  small = false,
  onChange,
}: {
  on: boolean;
  small?: boolean;
  onChange?: (on: boolean) => void;
}) {
  const w = small ? 38 : 42;
  const h = small ? 22 : 24;
  const k = small ? 18 : 20;
  return (
    <div
      role={onChange ? "switch" : undefined}
      aria-checked={on}
      tabIndex={onChange ? 0 : undefined}
      onClick={onChange ? () => onChange(!on) : undefined}
      onKeyDown={onChange ? (e) => (e.key === "Enter" || e.key === " ") && onChange(!on) : undefined}
      style={{
        width: w,
        height: h,
        borderRadius: 999,
        background: on ? C.mint : C.chipLine,
        padding: 2,
        display: "flex",
        justifyContent: on ? "flex-end" : "flex-start",
        flexShrink: 0,
        cursor: onChange ? "pointer" : undefined,
        transition: "background .15s",
      }}
    >
      <div style={{ width: k, height: k, borderRadius: 999, background: on ? C.navy : "#fff", transition: "background .15s" }} />
    </div>
  );
}

/** Two-option segmented control (pickup / drop-off, delivery / self pickup). */
export function Segmented({
  options,
  value,
  onChange,
  disabledValues = [],
  style,
}: {
  options: { value: string; label: string; hint?: string; iconPath?: string }[];
  value: string;
  onChange: (v: string) => void;
  disabledValues?: string[];
  style?: CSSProperties;
}) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", ...style }}>
      {options.map((o) => {
        const active = o.value === value;
        const disabled = disabledValues.includes(o.value);
        return (
          <div
            key={o.value}
            className={disabled ? undefined : "btn"}
            onClick={() => !disabled && onChange(o.value)}
            title={disabled ? "Not available for this listing" : undefined}
            style={{
              flex: 1,
              minWidth: 180,
              background: active ? C.green : "#fff",
              color: active ? "#fff" : disabled ? C.chipLine : C.textMute,
              border: active ? "1.5px solid transparent" : `1.5px solid ${C.line}`,
              borderRadius: 10,
              padding: o.hint ? 16 : 12,
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
              textAlign: o.hint ? "left" : "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: o.hint ? "flex-start" : "center", gap: 10 }}>
              {o.iconPath && (
                <Icon d={o.iconPath} size={20} color={active ? "#fff" : disabled ? C.chipLine : C.textMute} strokeWidth={1.9} />
              )}
              <span style={{ fontSize: o.hint ? 15 : 14, fontWeight: 700 }}>{o.label}</span>
            </div>
            {o.hint && (
              <div style={{ fontSize: 12.5, color: active ? C.chatTime : C.textFaint, marginTop: 8 }}>
                {disabled ? "Disabled by the donor for this listing." : o.hint}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function IconTile({
  path,
  bg,
  color,
  size = 38,
  radius = 10,
  iconSize = 18,
  strokeWidth = 1.8,
}: {
  path: string;
  bg: string;
  color: string;
  size?: number;
  radius?: number;
  iconSize?: number;
  strokeWidth?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon d={path} size={iconSize} color={color} strokeWidth={strokeWidth} />
    </div>
  );
}

export function TableHead({
  columns,
  template,
  lastRight = true,
}: {
  columns: string[];
  template: string;
  lastRight?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: template,
        padding: "12px 22px",
        background: C.bg,
        borderBottom: `1px solid ${C.lineSoft}`,
      }}
    >
      {columns.map((c, i) => (
        <MonoTag key={i} style={{ textAlign: lastRight && i === columns.length - 1 ? "right" : undefined }}>
          {c}
        </MonoTag>
      ))}
    </div>
  );
}

export function SearchBox({ placeholder, style }: { placeholder: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#fff",
        border: `1px solid ${C.line}`,
        borderRadius: 9,
        padding: "11px 14px",
        ...style,
      }}
    >
      <Icon d={ICON.search} size={16} color={C.textFaint} strokeWidth={2} />
      <span style={{ color: C.textFaint, fontSize: 14 }}>{placeholder}</span>
    </div>
  );
}

/** Progress meter used for community-request fulfilment (60/100 units). */
export function Progress({
  received,
  needed,
  unit,
  showLabel = true,
  height = 8,
}: {
  received: number;
  needed: number;
  unit: string;
  showLabel?: boolean;
  height?: number;
}) {
  const pct = needed > 0 ? Math.min(100, Math.round((received / needed) * 100)) : 0;
  const done = received >= needed;
  return (
    <div>
      {showLabel && (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
          <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
            {received.toLocaleString()}/{needed.toLocaleString()} {unit}
          </span>
          <span style={{ color: done ? C.green : C.textFaint, fontWeight: done ? 700 : 400 }}>
            {done ? "Fully met" : `${pct}%`}
          </span>
        </div>
      )}
      <div style={{ height, background: C.lineSoft, borderRadius: 99, overflow: "hidden" }}>
        <div
          style={{
            height,
            width: `${pct}%`,
            background: done ? C.green : C.mint,
            borderRadius: 99,
            transition: "width .3s ease",
          }}
        />
      </div>
    </div>
  );
}

/** Location/window summary shown before an order unlocks the full address. */
export function PickupSummary({
  city,
  dist,
  window: win,
  address,
  revealed,
  label = "Pickup",
}: {
  city: string;
  dist: string;
  window: string;
  address?: string;
  revealed: boolean;
  label?: string;
}) {
  return (
    <div style={{ background: C.bg, border: `1px solid ${C.lineSoft}`, borderRadius: 11, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Icon d={ICON.pin} size={16} color={C.green} strokeWidth={2} />
        <span style={{ fontSize: 13.5, fontWeight: 700 }}>{label} location</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Row k="Distance from you" v={dist} />
        <Row k="City / state" v={city} />
        <Row k={`${label} window`} v={win} />
      </div>
      {revealed && address ? (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.line}` }}>
          <Row k="Full address" v={address} bold />
          <Placeholder
            height={110}
            radius={9}
            size={9}
            label="MAP — route to pickup"
            labelOnWhite
            style={{ marginTop: 10 }}
          />
        </div>
      ) : (
        <div
          style={{
            marginTop: 12,
            padding: "10px 12px",
            background: C.blueWash,
            borderRadius: 8,
            fontSize: 12.5,
            color: C.blueDark,
            lineHeight: 1.45,
          }}
        >
          The exact address and map unlock once your order is placed.
        </div>
      )}
    </div>
  );
}

function Row({ k, v, bold = false }: { k: string; v: string; bold?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13.5 }}>
      <span style={{ color: C.textMute }}>{k}</span>
      <span style={{ fontWeight: bold ? 700 : 600, textAlign: "right" }}>{v}</span>
    </div>
  );
}

export function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        zIndex: 200,
        width: "min(92vw, 460px)",
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: t.tone === "error" ? "#5C1414" : C.navy,
            color: "#fff",
            fontSize: 13.5,
            fontWeight: 600,
            padding: "12px 16px",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(11,28,48,.35)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 99,
              background: t.tone === "error" ? "#FF8A8A" : C.mint,
              flexShrink: 0,
            }}
          />
          {t.text}
        </div>
      ))}
    </div>
  );
}

interface Toast {
  id: number;
  text: string;
  tone?: "ok" | "error";
}

/** Generic centered modal used by confirm/report/detail dialogs. */
export function Modal({
  open,
  onClose,
  children,
  maxWidth = 460,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: number;
}) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(11,28,48,.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 120,
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth,
          maxHeight: "88vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: 16,
          padding: 28,
          boxShadow: "0 20px 60px rgba(11,28,48,.3)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
