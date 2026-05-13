import type { ReactNode } from "react";

export type IconProps = {
  size?: number;
  className?: string;
  title?: string;
};

function Icon({
  size = 16,
  className,
  title,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={["ic", className].filter(Boolean).join(" ")}
      role={title ? "img" : "presentation"}
      aria-label={title}
    >
      {children}
    </svg>
  );
}

export type IconComponent = (props: IconProps) => ReactNode;

export const Dashboard: IconComponent = (p) => (
  <Icon {...p}>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </Icon>
);

export const Box: IconComponent = (p) => (
  <Icon {...p}>
    <path d="M3 7l9-4 9 4-9 4-9-4z" />
    <path d="M3 7v10l9 4 9-4V7" />
    <path d="M12 11v10" />
  </Icon>
);

export const Bell: IconComponent = (p) => (
  <Icon {...p}>
    <path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9z" />
    <path d="M10 21a2 2 0 0 0 4 0" />
  </Icon>
);

export const Sparkles: IconComponent = (p) => (
  <Icon {...p}>
    <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z" />
    <path d="M19 16l.8 1.7L21.5 19l-1.7.8L19 21l-.8-1.2L16.5 19l1.7-.8L19 16z" />
  </Icon>
);

export const Calendar: IconComponent = (p) => (
  <Icon {...p}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M3 9h18M8 3v4M16 3v4" />
  </Icon>
);

export const Chart: IconComponent = (p) => (
  <Icon {...p}>
    <path d="M3 21V5" />
    <path d="M3 21h18" />
    <path d="M7 17V13M12 17V9M17 17V11" />
  </Icon>
);

export const Truck: IconComponent = (p) => (
  <Icon {...p}>
    <path d="M1 7h13v9H1z" />
    <path d="M14 10h4l3 3v3h-7" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </Icon>
);

export const Users: IconComponent = (p) => (
  <Icon {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M16 20a5 5 0 0 1 6-4.9" />
  </Icon>
);

export const Gear: IconComponent = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </Icon>
);

export const Search: IconComponent = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </Icon>
);

export const Plus: IconComponent = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const Filter: IconComponent = (p) => (
  <Icon {...p}>
    <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" />
  </Icon>
);

export const Download: IconComponent = (p) => (
  <Icon {...p}>
    <path d="M12 3v12" />
    <path d="M7 10l5 5 5-5" />
    <path d="M5 21h14" />
  </Icon>
);

export const ArrowUp: IconComponent = (p) => (
  <Icon {...p}>
    <path d="M12 19V5" />
    <path d="M5 12l7-7 7 7" />
  </Icon>
);

export const ArrowDown: IconComponent = (p) => (
  <Icon {...p}>
    <path d="M12 5v14" />
    <path d="M5 12l7 7 7-7" />
  </Icon>
);

export const Dots: IconComponent = (p) => (
  <Icon {...p}>
    <circle cx="5" cy="12" r="1.4" />
    <circle cx="12" cy="12" r="1.4" />
    <circle cx="19" cy="12" r="1.4" />
  </Icon>
);

export const Check: IconComponent = (p) => (
  <Icon {...p}>
    <path d="M5 12l5 5L20 7" />
  </Icon>
);
