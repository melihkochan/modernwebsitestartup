"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface DropdownContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const DropdownContext = createContext<DropdownContextValue>({
  open: false,
  setOpen: () => {},
});

interface DropdownRootProps {
  children: ReactNode;
  className?: string;
}

interface DropdownTriggerProps {
  children: ReactNode;
  className?: string;
  /** Show a chevron icon. */
  chevron?: boolean;
}

interface DropdownContentProps {
  children: ReactNode;
  className?: string;
  align?: "left" | "right";
  width?: "trigger" | "auto";
}

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  className?: string;
}

interface DropdownSeparatorProps {
  className?: string;
}

interface DropdownLabelProps {
  children: ReactNode;
  className?: string;
}

/**
 * Composable Dropdown menu.
 *
 * @example
 * <Dropdown>
 *   <DropdownTrigger chevron>Options</DropdownTrigger>
 *   <DropdownContent>
 *     <DropdownItem onClick={edit} leftIcon={<Pencil />}>Edit</DropdownItem>
 *     <DropdownItem destructive onClick={remove} leftIcon={<Trash />}>Delete</DropdownItem>
 *   </DropdownContent>
 * </Dropdown>
 */
export function Dropdown({ children, className }: DropdownRootProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className={cn("relative inline-block", className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownTrigger({ children, chevron = false, className }: DropdownTriggerProps) {
  const { open, setOpen } = useContext(DropdownContext);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      aria-haspopup="menu"
      className={cn(
        "inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]",
        className
      )}
    >
      {children}
      {chevron && (
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      )}
    </button>
  );
}

export function DropdownContent({
  children,
  className,
  align = "left",
  width = "auto",
}: DropdownContentProps) {
  const { open } = useContext(DropdownContext);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="menu"
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.97 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cn(
            "absolute top-full mt-2 z-40 min-w-[10rem] overflow-hidden",
            "rounded-[var(--radius-lg)] border border-[var(--border-default)]",
            "bg-[var(--bg-elevated)] shadow-[var(--shadow-lg)] p-1",
            align === "right" && "right-0",
            width === "trigger" && "w-full",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function DropdownItem({
  children,
  onClick,
  selected = false,
  destructive = false,
  disabled = false,
  leftIcon,
  className,
}: DropdownItemProps) {
  const { setOpen } = useContext(DropdownContext);

  const handleClick = useCallback(() => {
    if (disabled) return;
    onClick?.();
    setOpen(false);
  }, [disabled, onClick, setOpen]);

  return (
    <button
      role="menuitem"
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2 text-sm text-left",
        "transition-colors duration-150",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        destructive
          ? "text-[var(--error)] hover:bg-[rgba(255,69,58,0.1)]"
          : selected
          ? "text-[var(--accent-primary)] bg-[var(--accent-glow)]"
          : "text-[var(--text-primary)] hover:bg-[var(--bg-overlay)]",
        className
      )}
    >
      {leftIcon && <span className="shrink-0 opacity-70" aria-hidden>{leftIcon}</span>}
      <span className="flex-1 truncate">{children}</span>
      {selected && <Check className="h-3.5 w-3.5 shrink-0 text-[var(--accent-primary)]" aria-hidden />}
    </button>
  );
}

export function DropdownSeparator({ className }: DropdownSeparatorProps) {
  return <div role="separator" className={cn("my-1 h-px bg-[var(--border-subtle)]", className)} />;
}

export function DropdownLabel({ children, className }: DropdownLabelProps) {
  return (
    <div className={cn("px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]", className)}>
      {children}
    </div>
  );
}
