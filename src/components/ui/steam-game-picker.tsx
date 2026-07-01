import { useState, useEffect, useRef } from "react";
import { Search, X, Gamepad2, RefreshCw } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface SteamGame {
  steamAppId: number;
  name: string;
  headerImage: string;
  storeUrl: string;
  platform: string;
}

const searchCache = new Map<string, SteamGame[]>();

export function SteamGamePicker({
  value,
  onSelect,
  placeholder = "Steam'de oyun ara...",
  className,
}: {
  value?: SteamGame | null;
  onSelect: (game: SteamGame | null) => void;
  placeholder?: string;
  className?: string;
}) {
  const [prevValue, setPrevValue] = useState<SteamGame | null | undefined>(value);
  const [search, setSearch] = useState(value ? value.name : "");
  const [results, setResults] = useState<SteamGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (value !== prevValue) {
    setPrevValue(value);
    setSearch(value ? value.name : "");
  }

  const trimmedQuery = search.toLowerCase().trim();
  const isQueryActive = search && (!value || search !== value.name);
  const displayedResults = isQueryActive
    ? (searchCache.get(trimmedQuery) || results)
    : [];

  const [prevSearch, setPrevSearch] = useState(search);
  if (search !== prevSearch) {
    setPrevSearch(search);
    setActiveIndex(-1);
  }

  useEffect(() => {
    if (!search || (value && search === value.name)) {
      return;
    }

    const trimmed = search.toLowerCase().trim();
    if (searchCache.has(trimmed)) {
      return;
    }

    const controller = new AbortController();
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/steam/search?term=${encodeURIComponent(search)}`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data = await res.json();
          const items = data.items || [];
          searchCache.set(trimmed, items);
          setResults(items);
          setIsOpen(true);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        console.error(err);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(delayDebounce);
      controller.abort();
    };
  }, [search, value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev + 1;
        return next >= displayedResults.length ? 0 : next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev - 1;
        return next < 0 ? displayedResults.length - 1 : next;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < displayedResults.length) {
        const selected = displayedResults[activeIndex];
        onSelect(selected);
        setSearch(selected.name);
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={dropdownRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            const val = e.target.value;
            setSearch(val);
            if (!val) {
              onSelect(null);
              setResults([]);
              setIsLoading(false);
            } else if (!value || val !== value.name) {
              const trimmed = val.toLowerCase().trim();
              if (searchCache.has(trimmed)) {
                setIsLoading(false);
              } else {
                setIsLoading(true);
                setIsOpen(true);
              }
            }
          }}
          onFocus={() => {
            if (search && (!value || search !== value.name)) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-[var(--bg-overlay)] border border-[var(--border-default)] rounded-[var(--radius-md)] pl-9 pr-9 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-all font-semibold"
        />
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="w-3.5 h-3.5 text-zinc-500" />
        </div>
        {isLoading ? (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--accent-primary)]" />
          </div>
        ) : (
          search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                onSelect(null);
                setResults([]);
                setIsLoading(false);
                setIsOpen(false);
              }}
              className="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )
        )}
      </div>

      {isOpen && (search && (!value || search !== value.name)) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg shadow-[var(--shadow-md)] z-50 max-h-60 overflow-y-auto py-1">
          {isLoading ? (
            <div className="px-4 py-3 text-xs text-zinc-500 flex items-center gap-2">
              <Gamepad2 className="w-3.5 h-3.5 animate-spin text-[var(--accent-primary)]" />
              Searching...
            </div>
          ) : displayedResults.length === 0 ? (
            <div className="px-4 py-3 text-xs text-zinc-500 font-semibold select-none">
              No results
            </div>
          ) : (
            displayedResults.map((game, index) => (
              <button
                key={game.steamAppId}
                type="button"
                onClick={() => {
                  onSelect(game);
                  setSearch(game.name);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 hover:bg-[var(--bg-overlay)] transition-colors text-left border-none cursor-pointer",
                  index === activeIndex && "bg-[var(--bg-overlay)] border-l-2 border-[var(--accent-primary)]"
                )}
              >
                {game.headerImage ? (
                  <div className="w-12 h-6 relative bg-black/40 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={game.headerImage}
                      alt={game.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-12 h-6 rounded bg-zinc-800 flex-shrink-0 flex items-center justify-center text-[8px] text-zinc-600 font-bold uppercase">No Pic</div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                    {game.name}
                  </p>
                  <p className="text-[9px] text-[var(--text-tertiary)] uppercase font-bold tracking-wider mt-0.5">
                    {game.platform}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
