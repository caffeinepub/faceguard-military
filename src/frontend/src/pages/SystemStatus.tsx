import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle,
  Cpu,
  Database,
  Lock,
  Network,
  Server,
  Shield,
} from "lucide-react";
import { useCameras, useSystemStatus } from "../hooks/useQueries";

export function SystemStatus() {
  const { data: status } = useSystemStatus();
  const { data: cameras = [] } = useCameras();

  const onlineCams = cameras.filter((c) => c.onlineStatus).length;
  const totalCams = cameras.length || 52;
  const storagePercent = status ? Number(status.storageUsedPercent) : 34;
  const uptimeStr = status ? `${status.uptime}d` : "127d";

  const metrics = [
    {
      icon: <Server className="w-4 h-4" aria-hidden="true" />,
      label: "Core Recognition Engine",
      status: "ONLINE",
      detail: "v4.2.1 — 847ms avg response",
      ok: true,
    },
    {
      icon: <Database className="w-4 h-4" aria-hidden="true" />,
      label: "Identity Database",
      status: "SECURE",
      detail: "12,847 registered identities",
      ok: true,
    },
    {
      icon: <Network className="w-4 h-4" aria-hidden="true" />,
      label: "LAN Network Stack",
      status: "ONLINE",
      detail: "192.168.1.0/24 — 1Gbps",
      ok: true,
    },
    {
      icon: <Lock className="w-4 h-4" aria-hidden="true" />,
      label: "AES-256 Encryption",
      status: "ACTIVE",
      detail: "All channels encrypted",
      ok: true,
    },
    {
      icon: <Shield className="w-4 h-4" aria-hidden="true" />,
      label: "Intrusion Detection",
      status: "MONITORING",
      detail: "0 threats detected (24h)",
      ok: true,
    },
    {
      icon: <Cpu className="w-4 h-4" aria-hidden="true" />,
      label: "GPU Processing Unit",
      status: "ONLINE",
      detail: "RTX 4090 — 34% utilization",
      ok: true,
    },
    {
      icon: <Database className="w-4 h-4" aria-hidden="true" />,
      label: "Backup Systems",
      status: "STANDBY",
      detail: "Last sync: 2h ago",
      ok: true,
    },
    {
      icon: <Server className="w-4 h-4" aria-hidden="true" />,
      label: "API Gateway",
      status: "ONLINE",
      detail: "LAN-only mode enforced",
      ok: true,
    },
  ];

  return (
    <div className="space-y-5 animate-float-in">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-widest text-foreground uppercase text-glow-blue">
          SYSTEM STATUS
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          All subsystems operational · Last scan:{" "}
          {new Date().toLocaleTimeString()}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "System Uptime",
            value: uptimeStr,
            sub: "Continuous operation",
            color: "text-success",
          },
          {
            label: "Active Nodes",
            value: status ? String(status.activeNodes) : "12",
            sub: "Fully synchronized",
            color: "text-primary",
          },
          {
            label: "Online Cameras",
            value: `${onlineCams || 52}/${totalCams}`,
            sub: "Full coverage",
            color: "text-success",
          },
          {
            label: "Threat Level",
            value: "LOW",
            sub: "No active threats",
            color: "text-success",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-card/60 border border-border rounded-lg px-4 py-3"
          >
            <div className={`text-2xl font-bold font-mono ${kpi.color}`}>
              {kpi.value}
            </div>
            <div className="text-[12px] text-foreground font-medium mt-0.5">
              {kpi.label}
            </div>
            <div className="text-[10px] text-muted-foreground">{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Card className="bg-card/60 border-border">
          <CardHeader className="pb-3 pt-4 px-4">
            <CardTitle className="text-sm font-semibold tracking-wider uppercase text-foreground">
              Subsystem Health
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {metrics.map((m, i) => (
              <div
                key={m.label}
                data-ocid={`system.metric.item.${i + 1}`}
                className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-secondary/20 border border-border/40"
              >
                <div className={m.ok ? "text-success" : "text-destructive"}>
                  {m.icon}
                </div>
                <div className="flex-1">
                  <div className="text-[12px] font-medium text-foreground">
                    {m.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {m.detail}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {m.ok ? (
                    <CheckCircle
                      className="w-3 h-3"
                      style={{ color: "oklch(70% 0.19 147)" }}
                      aria-hidden="true"
                    />
                  ) : (
                    <AlertCircle
                      className="w-3 h-3 text-destructive"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className="text-[10px] font-bold tracking-widest"
                    style={{ color: "oklch(70% 0.19 147)" }}
                  >
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-card/60 border-border">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-sm font-semibold tracking-wider uppercase text-foreground">
                Resource Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-4">
              {[
                {
                  label: "Storage",
                  value: storagePercent,
                  unit: `${storagePercent}% (3.4 TB / 10 TB)`,
                  color: "oklch(72% 0.19 70)",
                },
                {
                  label: "CPU Usage",
                  value: 34,
                  unit: "34% (4/12 cores)",
                  color: "oklch(56% 0.19 262)",
                },
                {
                  label: "RAM Usage",
                  value: 62,
                  unit: "62% (49.6 / 80 GB)",
                  color: "oklch(56% 0.19 262)",
                },
                {
                  label: "GPU VRAM",
                  value: 44,
                  unit: "44% (10.6 / 24 GB)",
                  color: "oklch(70% 0.19 147)",
                },
                {
                  label: "Network I/O",
                  value: 18,
                  unit: "18% (180 Mbps / 1 Gbps)",
                  color: "oklch(70% 0.19 147)",
                },
              ].map((res) => (
                <div key={res.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] text-muted-foreground">
                      {res.label}
                    </span>
                    <span className="text-[11px] font-mono text-foreground">
                      {res.unit}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${res.value}%`, background: res.color }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/60 border-border">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-sm font-semibold tracking-wider uppercase text-foreground">
                Security Audit
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-2">
                {[
                  { label: "Last security scan", value: "02:00 UTC" },
                  { label: "Open ports", value: "None (LAN only)" },
                  { label: "Failed auth attempts", value: "3 (24h)" },
                  { label: "SSL certificate", value: "Valid (365d)" },
                  { label: "Firmware version", value: "v4.2.1 (latest)" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0"
                  >
                    <span className="text-[12px] text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="text-[11px] font-mono text-foreground">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
