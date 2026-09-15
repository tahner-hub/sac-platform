import type { CSSProperties, ReactNode } from "react";

export const ICON = {
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
  box: "M3 7l9-4 9 4v10l-9 4-9-4z M3 7l9 4 9-4 M12 11v10",
  boxSimple: "M3 7l9-4 9 4v10l-9 4-9-4z",
  plus: "M12 5v14 M5 12h14",
  chart: "M4 20h16 M7 20v-6 M12 20V8 M17 20v-10",
  clock: "M12 7v5l3 2 M12 21a9 9 0 100-18 9 9 0 000 18z",
  map: "M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z M9 3v15 M15 6v15",
  cart: "M3 3h2l2 12h12l2-9H6 M9 21a1 1 0 100-2 1 1 0 000 2 M18 21a1 1 0 100-2 1 1 0 000 2",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  users:
    "M16 20v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2 M9 11a3 3 0 100-6 3 3 0 000 6 M22 20v-2a4 4 0 00-3-3.8",
  userX: "M16 20v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2 M9 11a3 3 0 100-6 3 3 0 000 6 M17 8l5 5M22 8l-5 5",
  clipboard: "M9 3h6v3H9z M7 5H5v16h14V5h-2 M9 11h6 M9 15h6",
  truck:
    "M1 4h13v11H1z M14 8h4l3 3v4h-7 M5.5 18.5a2 2 0 100-4 2 2 0 000 4 M17.5 18.5a2 2 0 100-4 2 2 0 000 4",
  heart:
    "M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z",
  search: "M11 19a8 8 0 100-16 8 8 0 000 16z M21 21l-4.35-4.35",
  flag: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7",
  check: "M20 6L9 17l-5-5",
  chevronLeft: "M15 18l-6-6 6-6",
  bell: "M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8 M13.7 21a2 2 0 01-3.4 0",
  bellSimple: "M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8",
  star: "M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 18l-6.3 3.2L7 14 2 9.4l7-.9z",
  signOut: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  calendar: "M3 9h18M8 2v4M16 2v4",
  file: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6",
  pin: "M12 21s-7-5.6-7-11a7 7 0 0114 0c0 5.4-7 11-7 11z",
  send: "M22 2L11 13 M22 2l-7 20-4-9-9-4z",
  download: "M12 3v12M7 10l5 5 5-5M5 21h14",
  info: "M12 8v5M12 16h.01",
  warn: "M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z",
  recycle: "M17 1l4 4-4 4 M3 11V9a4 4 0 014-4h14 M7 23l-4-4 4-4 M21 13v2a4 4 0 01-4 4H3",
  leaf: "M11 20A7 7 0 019.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8a7 7 0 01-10 10z",
  trend: "M3 13h4l3 7 4-14 3 7h4",
  dollar: "M12 2v20 M16 6H10a3 3 0 000 6h4a3 3 0 010 6H8",
  trash: "M3 6h18 M8 6V4h8v2 M6 6l1 14h10l1-14",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4z",
  handshake: "M8 12l3 3 3-3 3 3 M2 9l5-5 5 3 5-3 5 5-5 8-5-3-5 3z",
  globe: "M12 21a9 9 0 100-18 9 9 0 000 18z M3 12h18 M12 3a15 15 0 010 18 15 15 0 010-18z",
  gearFull:
    "M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-2.7 1.1V21a2 2 0 11-4 0v-.1A1.6 1.6 0 005 19.4l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00-1.1-2.7H1a2 2 0 110-4h.1A1.6 1.6 0 002.6 5l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V1a2 2 0 114 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1H23a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z",
} as const;

export type IconName = keyof typeof ICON;

export function Icon({
  d,
  size = 18,
  color = "currentColor",
  strokeWidth = 1.8,
  style,
  extra,
}: {
  d: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: CSSProperties;
  extra?: ReactNode;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <path d={d} />
      {extra}
    </svg>
  );
}

export function LogoMark({
  size = 34,
  bg = "#6CF8BB",
  fg = "#0E1B2E",
  radius = 9,
}: {
  size?: number;
  bg?: string;
  fg?: string;
  radius?: number;
}) {
  const s = Math.round(size * 0.53);
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
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="6" r="2.4" fill={fg} />
        <circle cx="18" cy="6" r="2.4" fill={fg} />
        <circle cx="12" cy="18" r="2.4" fill={fg} />
        <path d="M6 6L12 18L18 6" stroke={fg} strokeWidth="1.6" />
      </svg>
    </div>
  );
}
