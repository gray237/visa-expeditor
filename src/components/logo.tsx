import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/logo.svg"
        alt="Visa Expeditor"
        width={631}
        height={321}
        priority
        className="h-10 w-auto drop-shadow-[0_1px_3px_rgba(15,36,68,0.2)]"
      />
    </Link>
  );
}