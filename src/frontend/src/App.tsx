import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Header, type TabName } from "./components/Header";
import { NetworkBackground } from "./components/NetworkBackground";
import { Dashboard } from "./pages/Dashboard";
import { LiveView } from "./pages/LiveView";
import { Logs } from "./pages/Logs";
import { Settings } from "./pages/Settings";
import { SystemStatus } from "./pages/SystemStatus";
import { Verification } from "./pages/Verification";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabName>("Dashboard");

  const renderPage = () => {
    switch (activeTab) {
      case "Dashboard":
        return <Dashboard />;
      case "Live View":
        return <LiveView />;
      case "Verification":
        return <Verification />;
      case "Logs":
        return <Logs />;
      case "System Status":
        return <SystemStatus />;
      case "Settings":
        return <Settings />;
    }
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        background:
          "linear-gradient(160deg, oklch(8% 0.04 243) 0%, oklch(11% 0.045 243) 100%)",
      }}
    >
      {/* Animated network background */}
      <NetworkBackground />

      {/* Fixed header */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content */}
      <main className="relative z-10 pt-16 min-h-screen">
        <div className="max-w-[1440px] mx-auto px-6 py-6">{renderPage()}</div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border mt-8">
        <div className="max-w-[1440px] mx-auto px-6 py-3 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} GUARDIAN Facial Recognition System ·
            v4.2.1 · All rights reserved
          </span>
          <div className="flex items-center gap-4">
            <span
              className="text-[11px] font-bold tracking-widest uppercase"
              style={{ color: "oklch(56% 0.19 262)" }}
            >
              ⬡ LAN ONLY APPLICATION
            </span>
            <span className="text-[11px] text-muted-foreground">
              Built with ♥ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </span>
          </div>
        </div>
      </footer>

      <Toaster richColors theme="dark" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
