"use client";

import type { ReactNode } from "react";

type ReaderShellProps = {
  children: ReactNode;
};

export function ReaderShell({ children }: ReaderShellProps) {
  return <div className="reader-shell min-h-screen pb-20">{children}</div>;
}
