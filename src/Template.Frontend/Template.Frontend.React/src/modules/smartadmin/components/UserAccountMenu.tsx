"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import type { SessionUser } from "@/shared/auth/session";
import { useTheme } from "@/shared/utils/theme";

type UserAccountMenuProps = {
  user: SessionUser;
  isSigningOut: boolean;
  onSignOut: () => Promise<void>;
};

const accountMenuItems = [
  { id: "profile", label: "My Profile" },
  { id: "theme", label: "Theme" },
  { id: "logout", label: "Logout" },
] as const;

export function UserAccountMenu({ user, isSigningOut, onSignOut }: UserAccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(
    () => () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    },
    [],
  );

  function cancelPointerClose() {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }

  function schedulePointerClose() {
    cancelPointerClose();
    closeTimeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  }

  function closeMenu({ restoreFocus = false }: { restoreFocus?: boolean } = {}) {
    setIsOpen(false);

    if (restoreFocus) {
      triggerRef.current?.focus();
    }
  }

  function focusMenuItem(index: number) {
    const menuItems = menuRef.current?.querySelectorAll<HTMLElement>("[data-account-menu-item]");
    menuItems?.[index]?.focus();
  }

  function handleMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = accountMenuItems.findIndex(
      (item) => item.id === (event.target as HTMLElement).dataset.accountMenuItem,
    );

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusMenuItem((currentIndex + 1) % accountMenuItems.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusMenuItem((currentIndex - 1 + accountMenuItems.length) % accountMenuItems.length);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusMenuItem(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusMenuItem(accountMenuItems.length - 1);
    }
  }

  return (
    <div
      ref={menuRef}
      className="ma-account-menu"
      onMouseEnter={() => {
        cancelPointerClose();
        setIsOpen(true);
      }}
      onMouseLeave={schedulePointerClose}
      onKeyDown={handleMenuKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        className="ma-account-menu-trigger"
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Open user account menu"
        onClick={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
            event.preventDefault();
            setIsOpen(true);
            return;
          }

          if (event.key === "Escape") {
            closeMenu();
          }
        }}
      >
        <Image src="/users/default-avatar.jpg" alt="" className="ma-account-menu-avatar" width={36} height={36} />
      </button>

      {isOpen ? (
        <div id={menuId} className="ma-account-menu-panel" role="menu" aria-label="User account">
          <div className="ma-account-menu-summary">
            <Image
              src="/users/default-avatar.jpg"
              alt=""
              className="ma-account-menu-summary-avatar"
              width={66}
              height={66}
            />
            <div>
              <p className="ma-account-menu-name">{fullName}</p>
              <p className="ma-account-menu-email">{user.email}</p>
            </div>
          </div>
          <div className="ma-account-menu-divider" role="separator" />
          <Link
            href="/auth"
            className="ma-account-menu-item"
            data-account-menu-item="profile"
            role="menuitem"
            onClick={() => closeMenu()}
          >
            <ProfileIcon />
            My Profile
          </Link>
          <div className="ma-account-menu-divider" role="separator" />
          <button
            type="button"
            className="ma-account-menu-item"
            data-account-menu-item="theme"
            role="menuitemcheckbox"
            aria-checked={theme === "dark"}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            onClick={toggleTheme}
          >
            <ThemeIcon isDark={theme === "dark"} />
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <div className="ma-account-menu-divider" role="separator" />
          <button
            type="button"
            className="ma-account-menu-item"
            data-account-menu-item="logout"
            role="menuitem"
            disabled={isSigningOut}
            onClick={onSignOut}
          >
            <SignOutIcon />
            {isSigningOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ThemeIcon({ isDark }: { isDark: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {isDark ? (
        <path d="M12 4a1 1 0 0 1 1-1V1h-2v2a1 1 0 0 1 1 1Zm0 16a1 1 0 0 1 1 1v2h-2v-2a1 1 0 0 1 1-1ZM4 13H2v-2h2a1 1 0 0 1 0 2Zm18 0h-2a1 1 0 0 1 0-2h2v2ZM5.64 7.05 4.22 5.64l1.42-1.42 1.41 1.42-1.41 1.41Zm12.72 12.73-1.41-1.42 1.41-1.41 1.42 1.41-1.42 1.42ZM7.05 18.36l-1.41 1.42-1.42-1.42 1.42-1.41 1.41 1.41Zm12.73-12.72-1.42 1.41-1.41-1.41 1.41-1.42 1.42 1.42ZM12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
      ) : (
        <path d="M20.7 15.3A8 8 0 0 1 8.7 3.2a.8.8 0 0 0-.94-.94A10 10 0 1 0 21.64 16.2a.8.8 0 0 0-.94-.9ZM12 20a8 8 0 0 1-3.16-15.35A9.6 9.6 0 0 0 19.35 15.2 8 8 0 0 1 12 20Z" />
      )}
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M10 4h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-8v-2h8V6h-8V4Zm1.71 3.29L10.3 8.7 12.59 11H3v2h9.59L10.3 15.3l1.41 1.41L16.41 12l-4.7-4.71Z" />
    </svg>
  );
}
