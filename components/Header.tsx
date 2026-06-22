import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-orange-100/80 bg-white/92 shadow-sm shadow-orange-950/5 backdrop-blur-xl">
      <div className="mx-auto grid min-h-16 w-full max-w-7xl grid-cols-[1fr_auto] items-center gap-3 px-4 sm:px-6 md:grid-cols-[auto_1fr_auto] lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#f06a2a] text-lg font-black text-white shadow-sm shadow-orange-700/30">
            G
          </span>
          <span className="truncate text-lg font-black tracking-tight text-stone-950">
            Ghost Core Library
          </span>
        </Link>
        <div className="order-3 col-span-2 md:order-none md:col-span-1">
          <SearchBar compact />
        </div>
        <nav className="flex items-center gap-4 text-sm font-bold text-stone-600">
          <Link className="transition hover:text-[#df3f21]" href="/">
            Home
          </Link>
          <Link className="transition hover:text-[#df3f21]" href="/#latest">
            Latest
          </Link>
        </nav>
      </div>
    </header>
  );
}
