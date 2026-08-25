import Link from "next/link";
import { Activity, BookOpen, Clock3, Dumbbell, Settings, Target } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: Activity },
  { href: "/warmup", label: "Warmup", icon: Dumbbell },
  { href: "/skills", label: "Skills", icon: Target },
  { href: "/history", label: "History", icon: Clock3 },
  { href: "/reference", label: "Reference", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Nav() {
  return (
    <aside className="border-zinc-800 bg-zinc-950/95 px-4 py-5 md:min-h-screen md:w-64 md:border-r">
      <Link href="/" className="mb-6 flex items-center gap-3 text-lg font-semibold">
        <span className="grid size-9 place-items-center rounded-md bg-emerald-400 text-zinc-950">Py</span>
        Interview Gym
      </Link>
      <nav className="grid gap-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white">
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

