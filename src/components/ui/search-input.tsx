"use client";

import { Search, X } from "lucide-react";
import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  onClear?: () => void;
  isLoading?: boolean;
}

/**
 * Search input with built-in search icon, clear button, and loading state.
 *
 * @example
 * <SearchInput
 *   placeholder="Search items..."
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 *   onClear={() => setQuery("")}
 * />
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onClear, isLoading, ...props }, ref) => {
    const hasValue = value !== "" && value !== undefined && value !== null;

    return (
      <div className="relative flex items-center">
        <Search
          aria-hidden
          className="absolute left-3 h-4 w-4 text-[var(--text-tertiary)] shrink-0"
        />

        <input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            "w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface)]",
            "pl-9 pr-9 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]",
            "transition-colors duration-150",
            "focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]",
            "hover:border-[var(--border-strong)]",
            // Remove browser default search input clear button
            "[&::-webkit-search-cancel-button]:appearance-none",
            className
          )}
          {...props}
        />

        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--bg-overlay)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}

        {isLoading && !hasValue && (
          <div
            aria-label="Searching..."
            className="absolute right-3 h-4 w-4 animate-spin rounded-full border-2 border-[var(--border-strong)] border-t-[var(--accent-primary)]"
          />
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
