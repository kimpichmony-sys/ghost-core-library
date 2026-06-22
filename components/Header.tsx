import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#071018]/85 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-[#e7c873] text-lg font-black text-[#11151d]">
            M
          </span>
          <span className="text-lg font-bold tracking-wide text-white">Ghost Core Library</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-300 sm:flex">
          <Link className="transition hover:text-white" href="/">
            Home
          </Link>
          <Link className="transition hover:text-white" href="/#latest">
            Latest
          </Link>
        </nav>
      </div>
    </header>
  );
}
