"use client";

import { useTranslations } from "next-intl";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function AuthButton({ fullWidth = false }: { fullWidth?: boolean }) {
  const { isSignedIn, isLoaded } = useUser();
  const t = useTranslations("auth");

  const buttonClass = `flex h-9 items-center justify-center rounded-full bg-[#0F2444] px-6 font-body text-[13px] font-semibold text-[#F5F6F4] transition-colors hover:bg-[#0F2444]/90 ${
    fullWidth ? "w-full" : ""
  }`;

  if (!isLoaded) {
    return (
      <div
        className={`h-9 animate-pulse rounded-full bg-[#0F2444]/10 ${fullWidth ? "w-full" : "w-37.5"}`}
      />
    );
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button type="button" className={buttonClass}>
          {t("signIn")}
        </button>
      </SignInButton>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${fullWidth ? "w-full" : ""}`}>
      <UserButton
        appearance={{
          variables: {
            colorPrimary: "#0F2444",
            fontFamily: "var(--font-body)",
            borderRadius: "0.75rem",
          },
          elements: {
            avatarBox: "!h-9 !w-9",
          },
        }}
      >
        <UserButton.MenuItems>
          <UserButton.Link
            label={t("dashboard")}
            href="/dashboard"
            labelIcon={<LayoutDashboard className="h-4 w-4" />}
          />
        </UserButton.MenuItems>
      </UserButton>

      <Link href="/start" className={`${buttonClass} flex-1`}>
        {t("getStarted")}
      </Link>
    </div>
  );
}