import { Link, useLocation } from "wouter";
import { ShieldCheck, LogOut, Lock } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white overflow-x-hidden relative">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="flex items-center justify-between mb-12">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="p-2 bg-primary/20 border border-primary/30 rounded-lg group-hover:bg-primary/30 transition-colors">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight group-hover:text-glow transition-all">
                Hide<span className="text-primary">.PV</span>
              </span>
            </div>
          </Link>
          
          {!isHome && (
             <Link href="/">
               <button className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-colors">
                 Back to Home
               </button>
             </Link>
          )}
        </header>

        <main className="min-h-[80vh]">
          {children}
        </main>

        <footer className="py-8 text-center text-muted-foreground text-sm font-mono border-t border-white/5 mt-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lock className="w-3 h-3" />
            <span>256-BIT ENCRYPTION ACTIVE</span>
          </div>
          <p>© 2024 Secure Vault Inc. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
