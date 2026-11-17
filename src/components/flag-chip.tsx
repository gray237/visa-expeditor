import * as Flags from "country-flag-icons/react/3x2";

export function FlagChip({
  code,
  className = "",
}: {
  code: string;
  className?: string;
}) {
  const Flag = Flags[code as keyof typeof Flags];
  return (
    <span
      className={`relative inline-block h-4 w-6 shrink-0 overflow-hidden rounded-[4px] ring-1 ring-[#0F2444]/12 [&>svg]:absolute! [&>svg]:inset-0! [&>svg]:h-full! [&>svg]:w-full! [&>svg]:object-cover ${className}`}
    >
      {Flag ? <Flag title={code} /> : null}
    </span>
  );
}
