import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, Wifi } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserProfile } from "../hooks/useQueries";

const NAV_TABS = [
  "Dashboard",
  "Live View",
  "Verification",
  "Logs",
  "System Status",
  "Settings",
] as const;

export type TabName = (typeof NAV_TABS)[number];

interface HeaderProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { clear, identity } = useInternetIdentity();
  const { data: profile } = useUserProfile();

  const displayName = profile?.name || (identity ? "Admin User" : "John Doe");
  const displayRole = profile?.role || "Admin";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16 border-b border-border"
      style={{
        background:
          "linear-gradient(180deg, oklch(14% 0.048 243) 0%, oklch(12% 0.045 243 / 0.97) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 min-w-[160px]">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-md bg-primary/10 border border-primary/30">
          <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-success box-glow-green" />
        </div>
        <div>
          <div className="text-foreground font-bold text-base tracking-widest uppercase leading-none">
            GUARDIAN
          </div>
          <div className="text-muted-foreground text-[10px] tracking-wider mt-0.5">
            Secure
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-1">
        {NAV_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            data-ocid={`nav.${tab.toLowerCase().replace(" ", "_")}.link`}
            onClick={() => onTabChange(tab)}
            className={`px-3.5 py-1.5 text-[13px] font-medium rounded-md transition-all duration-200 relative ${
              activeTab === tab
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-4/5 rounded-full bg-primary"
                style={{ boxShadow: "0 0 8px oklch(56% 0.19 262 / 0.8)" }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* User info */}
      <div className="flex items-center gap-3 min-w-[200px] justify-end">
        <Badge
          variant="outline"
          className="text-[10px] font-semibold tracking-widest border-primary/40 text-primary bg-primary/10 uppercase"
        >
          <Wifi className="w-2.5 h-2.5 mr-1" aria-hidden="true" />
          LAN Only
        </Badge>
        <Avatar className="w-8 h-8 border border-border">
          <AvatarFallback className="bg-secondary text-primary text-[11px] font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="text-right leading-none">
          <div className="text-foreground text-[12px] font-semibold">
            {displayName}
          </div>
          <div className="text-muted-foreground text-[10px] mt-0.5">
            {displayRole}
          </div>
        </div>
        <Button
          data-ocid="header.logout.button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7 px-2"
          onClick={() => clear()}
          title="Logout"
        >
          <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}
