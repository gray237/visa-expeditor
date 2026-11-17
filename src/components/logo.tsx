import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/logo.png"
        alt="Visa Expeditor"
        width={158}
        height={80}
        priority
        className="h-9 w-auto drop-shadow-[0_1px_3px_rgba(15,36,68,0.2)] sm:h-10"
      />
    </Link>
  );
}