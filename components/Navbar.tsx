import Link from 'next/link';
import { Github } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass-card border-b border-white/10">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500" />
        <span className="text-xl font-bold tracking-tight font-display">VisionTrainer</span>
      </div>
      <Link href="https://github.com" target="_blank" className="p-2 transition-colors hover:text-cyan-500">
        <Github className="w-6 h-6" />
      </Link>
    </header>
  );
}
