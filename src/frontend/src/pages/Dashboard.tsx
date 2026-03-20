import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  Camera,
  CheckCircle,
  HardDrive,
  Network,
  XCircle,
} from "lucide-react";
import { CameraFeed } from "../components/CameraFeed";
import {
  useAccessLogs,
  useCameras,
  useSystemStatus,
  useVerificationHistory,
} from "../hooks/useQueries";

function formatTime(ts: bigint) {
  return new Date(Number(ts)).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatTimestamp(ts: bigint) {
  const d = new Date(Number(ts));
  return `${d.toLocaleDateString("en-US", { month: "short", day: "2-digit" })} ${d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })}`;
}

export function Dashboard() {
  const { data: status } = useSystemStatus();
  const { data: logs = [] } = useAccessLogs(0, 8);
  const { data: verifications = [] } = useVerificationHistory(0, 5);
  const { data: cameras = [] } = useCameras();

  const kpis = [
    {
      icon: <Activity className="w-4 h-4" aria-hidden="true" />,
      label: "Uptime",
      value: "99.97%",
      sub: "30-day average",
      color: "text-success",
    },
    {
      icon: <Network className="w-4 h-4" aria-hidden="true" />,
      label: "Active Nodes",
      value: status ? String(status.activeNodes) : "12",
      sub: "Operational",
      color: "text-primary",
    },
    {
      icon: <Camera className="w-4 h-4" aria-hidden="true" />,
      label: "Online Cameras",
      value: `${status ? String(status.onlineCamerasCount) : "52"}/52`,
      sub: "All sectors covered",
      color: "text-success",
      dot: true,
    },
    {
      icon: <HardDrive className="w-4 h-4" aria-hidden="true" />,
      label: "Storage Used",
      value: `${status ? String(status.storageUsedPercent) : "34"}%`,
      sub: "3.4 TB / 10 TB",
      color: "text-warning",
    },
  ];

  const feedCameras =
    cameras.length > 0
      ? cameras.slice(0, 4)
      : [
          {
            cameraId: BigInt(1),
            location: "Main Entrance",
            onlineStatus: true,
          },
          { cameraId: BigInt(2), location: "Server Room", onlineStatus: true },
          { cameraId: BigInt(3), location: "Parking A", onlineStatus: true },
          { cameraId: BigInt(4), location: "East Gate", onlineStatus: true },
        ];

  const latestVerification = verifications[0];
  const isVerified =
    latestVerification && Number(latestVerification.confidenceScore) > 70;

  return (
    <div className="space-y-5 animate-float-in">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-widest text-foreground uppercase text-glow-blue">
          OPERATIONAL DASHBOARD
          <span className="text-muted-foreground font-normal text-lg ml-4">
            | LAN 192.168.1.10
          </span>
        </h1>
        <div
          className="grid grid-cols-4 gap-4 mt-4"
          data-ocid="dashboard.kpi.section"
        >
          {kpis.map((kpi, i) => (
            <div
              key={kpi.label}
              data-ocid={`dashboard.kpi.item.${i + 1}`}
              className="flex items-center gap-3 bg-card/60 border border-border rounded-lg px-4 py-3"
            >
              <div className={`${kpi.color} opacity-80`}>{kpi.icon}</div>
              <div>
                <div className="flex items-center gap-1.5">
                  {kpi.dot && (
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  )}
                  <span className={`text-xl font-bold font-mono ${kpi.color}`}>
                    {kpi.value}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {kpi.label}
                </div>
                <div className="text-[10px] text-muted-foreground/60">
                  {kpi.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Left: camera feeds */}
        <div className="col-span-3 space-y-4">
          <Card className="bg-card/60 border-border">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-sm font-semibold tracking-wider uppercase text-foreground flex items-center gap-2">
                <Camera className="w-4 h-4 text-primary" aria-hidden="true" />
                Live Camera Feeds
                <Badge
                  variant="outline"
                  className="ml-auto text-[9px] border-success/40 text-success bg-success/10"
                >
                  52 ONLINE
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div
                className="grid grid-cols-2 gap-3"
                data-ocid="camera.feeds.section"
              >
                {feedCameras.map((cam, i) => (
                  <CameraFeed
                    key={String(cam.cameraId)}
                    data-ocid={`camera.feed.item.${i + 1}`}
                    location={cam.location}
                    cameraId={Number(cam.cameraId)}
                    online={cam.onlineStatus}
                    showFaceBox={i === 0}
                    className="h-36"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-card/60 border-border"
            data-ocid="access.logs.card"
          >
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-sm font-semibold tracking-wider uppercase text-foreground">
                Recent Access Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-border">
                      {[
                        "Timestamp",
                        "Name",
                        "ID",
                        "Location",
                        "Status",
                        "Camera",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-2 text-muted-foreground font-medium uppercase text-[10px] tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {logs.slice(0, 6).map((log, i) => (
                      <tr
                        key={String(log.id)}
                        data-ocid={`access.logs.item.${i + 1}`}
                        className="border-b border-border/40 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="px-4 py-2.5 font-mono text-muted-foreground">
                          {formatTimestamp(log.timestamp)}
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-foreground">
                          {log.personName}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-muted-foreground">
                          {log.personId > 0 ? `ID-${log.personId}` : "—"}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {log.location}
                        </td>
                        <td className="px-4 py-2.5">
                          <Badge
                            variant="outline"
                            className={`text-[9px] font-bold uppercase ${
                              log.accessStatus
                                ? "border-success/40 text-success bg-success/10"
                                : "border-destructive/40 text-destructive bg-destructive/10"
                            }`}
                          >
                            {log.accessStatus ? "GRANTED" : "DENIED"}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-muted-foreground">
                          CAM-{String(Number(log.cameraId)).padStart(2, "0")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: verification + status */}
        <div className="col-span-2 space-y-4">
          <Card
            className="bg-card/60 border-border"
            data-ocid="verification.panel.card"
          >
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-sm font-semibold tracking-wider uppercase text-foreground">
                Identity Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-4">
              <div
                className="relative rounded-lg overflow-hidden flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(11% 0.055 243), oklch(8% 0.04 243))",
                  height: 180,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(oklch(56% 0.19 262 / 0.05) 1px, transparent 1px), linear-gradient(90deg, oklch(56% 0.19 262 / 0.05) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="relative">
                  <svg
                    viewBox="0 0 80 100"
                    className="w-28 h-36"
                    fill="oklch(56% 0.19 262 / 0.3)"
                    aria-hidden="true"
                  >
                    <ellipse cx="40" cy="32" rx="24" ry="28" />
                    <path d="M8 100 Q8 65 40 58 Q72 65 72 100 Z" />
                    <ellipse
                      cx="28"
                      cy="28"
                      rx="5"
                      ry="4"
                      fill="oklch(56% 0.19 262 / 0.6)"
                    />
                    <ellipse
                      cx="52"
                      cy="28"
                      rx="5"
                      ry="4"
                      fill="oklch(56% 0.19 262 / 0.6)"
                    />
                  </svg>
                  <div
                    className="absolute inset-0 rounded camera-active-border"
                    style={{
                      border: "2px solid oklch(70% 0.19 147)",
                      boxShadow:
                        "0 0 12px oklch(70% 0.19 147 / 0.5), inset 0 0 12px oklch(70% 0.19 147 / 0.08)",
                    }}
                  >
                    <span
                      className="absolute -top-0.5 -left-0.5 w-3 h-3 border-t-2 border-l-2"
                      style={{ borderColor: "oklch(70% 0.19 147)" }}
                    />
                    <span
                      className="absolute -top-0.5 -right-0.5 w-3 h-3 border-t-2 border-r-2"
                      style={{ borderColor: "oklch(70% 0.19 147)" }}
                    />
                    <span
                      className="absolute -bottom-0.5 -left-0.5 w-3 h-3 border-b-2 border-l-2"
                      style={{ borderColor: "oklch(70% 0.19 147)" }}
                    />
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b-2 border-r-2"
                      style={{ borderColor: "oklch(70% 0.19 147)" }}
                    />
                  </div>
                </div>
                <div
                  className="absolute bottom-2 right-2 text-[10px] font-mono font-bold"
                  style={{ color: "oklch(70% 0.19 147)" }}
                >
                  CONF:{" "}
                  {latestVerification
                    ? `${latestVerification.confidenceScore}%`
                    : "99%"}
                </div>
              </div>

              {isVerified !== false ? (
                <div
                  className="rounded-lg px-4 py-3 border"
                  style={{
                    background: "oklch(70% 0.19 147 / 0.08)",
                    borderColor: "oklch(70% 0.19 147 / 0.3)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle
                      className="w-4 h-4"
                      style={{ color: "oklch(70% 0.19 147)" }}
                      aria-hidden="true"
                    />
                    <span
                      className="text-[12px] font-bold tracking-widest uppercase"
                      style={{ color: "oklch(70% 0.19 147)" }}
                    >
                      VERIFICATION SUCCESSFUL
                    </span>
                  </div>
                  <div className="text-foreground font-bold text-sm">
                    {latestVerification?.personName || "SGT. James Reeves"}
                  </div>
                  <div className="text-muted-foreground text-[11px] font-mono">
                    ID-
                    {latestVerification
                      ? String(latestVerification.personId)
                      : "7734"}
                  </div>
                  <div
                    className="mt-2 pt-2 border-t"
                    style={{ borderColor: "oklch(70% 0.19 147 / 0.2)" }}
                  >
                    <span
                      className="text-[10px] font-bold tracking-widest uppercase"
                      style={{ color: "oklch(70% 0.19 147)" }}
                    >
                      ACCESS GRANTED
                    </span>
                    <span className="text-muted-foreground text-[10px] ml-2">
                      {latestVerification
                        ? formatTime(latestVerification.timestamp)
                        : "14:32:07"}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-lg px-4 py-3 border"
                  style={{
                    background: "oklch(55% 0.19 22 / 0.08)",
                    borderColor: "oklch(55% 0.19 22 / 0.3)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <XCircle
                      className="w-4 h-4 text-destructive"
                      aria-hidden="true"
                    />
                    <span className="text-[12px] font-bold tracking-widest uppercase text-destructive">
                      ACCESS DENIED
                    </span>
                  </div>
                </div>
              )}

              <div>
                <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-2">
                  Recent Verifications
                </div>
                <div className="space-y-1" data-ocid="verification.log.list">
                  {verifications.slice(0, 5).map((v, i) => (
                    <div
                      key={String(v.id)}
                      data-ocid={`verification.log.item.${i + 1}`}
                      className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-secondary/20 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${Number(v.confidenceScore) > 70 ? "bg-success" : "bg-destructive"}`}
                        />
                        <span className="text-[11px] text-foreground">
                          {v.personName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {v.confidenceScore}%
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatTime(v.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-card/60 border-border"
            data-ocid="system.status.card"
          >
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-sm font-semibold tracking-wider uppercase text-foreground">
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-2">
                {[
                  { label: "Core Recognition Engine", status: "ONLINE" },
                  { label: "Database Sync", status: "SECURE" },
                  { label: "LAN Network", status: "ONLINE" },
                  { label: "Encryption Layer", status: "ACTIVE" },
                  { label: "Threat Detection", status: "MONITORING" },
                  { label: "Backup System", status: "ONLINE" },
                ].map((item, i) => (
                  <div
                    key={item.label}
                    data-ocid={`system.status.item.${i + 1}`}
                    className="flex items-center justify-between py-1.5"
                  >
                    <span className="text-[12px] text-muted-foreground">
                      {item.label}
                    </span>
                    <span
                      className="text-[10px] font-bold tracking-widest"
                      style={{ color: "oklch(70% 0.19 147)" }}
                    >
                      {item.status}
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
