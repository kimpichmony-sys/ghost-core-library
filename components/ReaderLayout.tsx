import type { ReactNode } from "react";

type ReaderLayoutProps = {
  children: ReactNode;
};

export function ReaderLayout({ children }: ReaderLayoutProps) {
  return <div className="reader-shell min-h-screen pb-24 transition-colors">{children}</div>;
}
