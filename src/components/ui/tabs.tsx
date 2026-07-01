"use client";

import { motion } from "framer-motion";
import {
  createContext,
  useContext,
  useId,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  layoutId: string;
}

const TabsContext = createContext<TabsContextValue>({
  activeTab: "",
  setActiveTab: () => {},
  layoutId: "",
});

interface TabsProps {
  defaultTab: string;
  children: ReactNode;
  className?: string;
  onChange?: (tab: string) => void;
}

interface TabListProps {
  children: ReactNode;
  className?: string;
}

interface TabTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

interface TabContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

/**
 * Accessible tab navigation with animated underline indicator.
 *
 * @example
 * <Tabs defaultTab="overview">
 *   <TabList>
 *     <TabTrigger value="overview">Overview</TabTrigger>
 *     <TabTrigger value="settings">Settings</TabTrigger>
 *   </TabList>
 *   <TabContent value="overview">...</TabContent>
 *   <TabContent value="settings">...</TabContent>
 * </Tabs>
 */
export function Tabs({ defaultTab, children, className, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const layoutId = useId();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange, layoutId }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ children, className }: TabListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center gap-0 border-b border-[var(--border-subtle)] overflow-x-auto",
        "no-scrollbar",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabTrigger({ value, children, className }: TabTriggerProps) {
  const { activeTab, setActiveTab, layoutId } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={cn(
        "relative shrink-0 px-4 py-3 text-sm font-medium transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2",
        isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
        className
      )}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId={layoutId}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)] rounded-full"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
}

export function TabContent({ value, children, className }: TabContentProps) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;

  return (
    <motion.div
      role="tabpanel"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("mt-6", className)}
    >
      {children}
    </motion.div>
  );
}
