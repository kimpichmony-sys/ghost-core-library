import type { ReactNode } from "react";
import { ReaderLayout } from "@/components/ReaderLayout";

type ReaderShellProps = {
  children: ReactNode;
};

export function ReaderShell({ children }: ReaderShellProps) {
  return <ReaderLayout>{children}</ReaderLayout>;
}
