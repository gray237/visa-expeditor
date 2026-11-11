"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import * as Flags from "country-flag-icons/react/3x2";
import { COUNTRIES, POPULAR_COUNTRY_CODES } from "@/lib/countries";

function CountryFlag({ code }: { code: string }) {
  const Flag = Flags[code as keyof typeof Flags];
  return (
    <span className="relative inline-block h-5 w-7 shrink-0 overflow-hidden rounded ring-1 ring-[#0F2444]/10 [&>svg]:absolute! [&>svg]:inset-0! [&>svg]:h-full! [&>svg]:w-full! [&>svg]:object-cover dark:ring-white/15">
      {Flag ? <Flag title={code} /> : null}
    </span>
  );
}

export function DestinationSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const selected = COUNTRIES.find((c) => c.code === value);
  const popular = COUNTRIES.filter((c) => POPULAR_COUNTRY_CODES.includes(c.code));
  const list = query
    ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : popular;

  function handleSelect(code: string) {
    onChange(code);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-2 py-1.5 text-left"
      >
        <Search className="h-4 w-4 shrink-0 text-[#161B22]/40" />
        <span className="flex-1 overflow-hidden">
          <span className="block font-mono text-[10px] uppercase tracking-wider text-[#161B22]/40">
            My destination
          </span>
          <span className="block truncate text-sm text-[#161B22]">
            {selected ? selected.name : "Where are you going?"}
          </span>
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl border border-[#0F2444]/10 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-[#1a1b20]">
          <div className="flex items-center gap-2 rounded-xl border border-[#0F2444]/10 px-3 py-2 dark:border-white/10">
            <Search className="h-4 w-4 shrink-0 text-[#161B22]/40 dark:text-[#F5F6F4]/40" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations..."
              className="w-full bg-transparent text-sm text-[#161B22] outline-none dark:text-[#F5F6F4]"
            />
          </div>

          {!query && (
            <p className="mb-1 mt-3 px-1 font-mono text-[10px] uppercase tracking-wider text-[#161B22]/40 dark:text-[#F5F6F4]/40">
              Popular
            </p>
          )}

          <div className="mt-1 max-h-64 overflow-y-auto">
            {list.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleSelect(country.code)}
                className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-[#0F2444]/5 dark:hover:bg-white/10"
              >
                <CountryFlag code={country.code} />
                <span className="text-sm text-[#161B22] dark:text-[#F5F6F4]">{country.name}</span>
              </button>
            ))}
            {list.length === 0 && (
              <p className="p-4 text-center text-sm text-[#161B22]/50 dark:text-[#F5F6F4]/50">
                No matches found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}