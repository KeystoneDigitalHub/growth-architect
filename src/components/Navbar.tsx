import { useState } from "react";
import { Menu, X } from "lucide-react";
import faviconLogo from "@/assets/favicon-logo.png";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "AI Toolbox", href: "#toolbox" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Pricing", href: "#pricing" },
  { label: "Dashboard", href: "/dashboard" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-8 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a href="#" className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight">
            <img src={faviconLogo} alt="Keystone" className="w-8 h-8 rounded-full" />
            <span>
              <span className="gradient-text">Keystone</span>
              <span className="text-foreground"> Growth Hub</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a key={item.label} href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
                {item.label}
              </a>
            ))}
            <a href="#audit"
              className="px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              Free Audit
            </a>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden text-foreground" aria-label="Toggle menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-border">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setOpen(false)}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
                {item.label}
              </a>
            ))}
            <a href="#audit" onClick={() => setOpen(false)}
              className="block text-center px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground">
              Free Audit
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
