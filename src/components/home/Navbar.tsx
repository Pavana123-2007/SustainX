import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Leaf, Menu, X, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations, Text } from "@fimo/ui";
import { Button } from "@/components/UI/button";
import { Badge } from "@/components/UI/badge";
import ComingSoonDialog from "./ComingSoonDialog";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar() {
  const { t } = useTranslations();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t("nav.features", "Features"), href: "#features" },
    { label: t("nav.dashboard", "Dashboard"), href: "#dashboard" },
    { label: t("nav.camera", "Camera"), href: "#camera" },
    { label: t("nav.futureSimulator", "Future Simulator"), href: "#future" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border"
            : "bg-transparent backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              SustainX
            </span>
            <Badge variant="secondary" className="bg-primary/20 text-primary text-xs font-semibold">
              AI
            </Badge>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Text value={link.label} />
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {user.photoURL && (
                  <img src={user.photoURL} alt="avatar" className="h-8 w-8 rounded-full border border-border" />
                )}
                <span className="text-sm text-muted-foreground max-w-[120px] truncate">{user.displayName || user.email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut(auth)}
                  className="gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Text value={t("nav.getStarted", "Get Started")} />
              </Button>
            )}
          </div>

          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-left text-muted-foreground hover:text-foreground"
                >
                  <Text value={link.label} />
                </button>
              ))}
              <Button onClick={() => { setDialogOpen(true); setMobileOpen(false); }} className="bg-primary text-primary-foreground">
                <Text value={t("nav.getStarted", "Get Started")} />
              </Button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      <ComingSoonDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}