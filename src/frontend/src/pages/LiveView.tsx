import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Maximize2 } from "lucide-react";
import { useState } from "react";
import { CameraFeed } from "../components/CameraFeed";
import { useCameras } from "../hooks/useQueries";

const DEFAULT_CAMERAS = [
  { cameraId: BigInt(1), location: "Main Entrance", onlineStatus: true },
  { cameraId: BigInt(2), location: "Server Room", onlineStatus: true },
  { cameraId: BigInt(3), location: "Parking A", onlineStatus: true },
  { cameraId: BigInt(4), location: "East Gate", onlineStatus: true },
  { cameraId: BigInt(5), location: "Lobby", onlineStatus: true },
  { cameraId: BigInt(6), location: "Control Room", onlineStatus: false },
];

export function LiveView() {
  const { data: cameras = DEFAULT_CAMERAS } = useCameras();
  const [focusedCam, setFocusedCam] = useState<number | null>(null);
  const displayCams = cameras.length > 0 ? cameras : DEFAULT_CAMERAS;

  return (
    <div className="space-y-5 animate-float-in">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-foreground uppercase text-glow-blue">
            LIVE VIEW
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {displayCams.filter((c) => c.onlineStatus).length} active feeds ·
            Real-time facial detection enabled
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-success/40 text-success bg-success/10 text-[11px]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse mr-1.5 inline-block" />
          ALL SYSTEMS LIVE
        </Badge>
      </div>

      {focusedCam !== null ? (
        <Card
          className="bg-card/60 border-border"
          data-ocid="liveview.focused.card"
        >
          <CardHeader className="pb-3 pt-4 px-4 flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold tracking-wider uppercase text-foreground">
              {displayCams[focusedCam]?.location} — FULL VIEW
            </CardTitle>
            <button
              type="button"
              data-ocid="liveview.close.button"
              onClick={() => setFocusedCam(null)}
              className="text-muted-foreground hover:text-foreground text-xs border border-border rounded px-2 py-1"
            >
              ✕ CLOSE
            </button>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <CameraFeed
              location={displayCams[focusedCam]?.location || ""}
              cameraId={Number(displayCams[focusedCam]?.cameraId)}
              online={displayCams[focusedCam]?.onlineStatus}
              showFaceBox
              large
              className="h-96"
            />
          </CardContent>
        </Card>
      ) : (
        <div
          className="grid grid-cols-3 gap-4"
          data-ocid="liveview.grid.section"
        >
          {displayCams.map((cam, i) => (
            <button
              key={String(cam.cameraId)}
              type="button"
              data-ocid={`liveview.feed.item.${i + 1}`}
              className="relative group cursor-pointer text-left w-full"
              onClick={() => setFocusedCam(i)}
            >
              <CameraFeed
                location={cam.location}
                cameraId={Number(cam.cameraId)}
                online={cam.onlineStatus}
                showFaceBox={i % 3 === 0}
                className="h-52"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2
                  className="w-4 h-4 text-primary"
                  aria-hidden="true"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      <Card className="bg-card/60 border-border">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-sm font-semibold tracking-wider uppercase text-foreground flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary" aria-hidden="true" />
            Detection Events
            <span className="ml-2 w-2 h-2 rounded-full bg-success animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="space-y-2" data-ocid="detection.events.list">
            {[
              {
                cam: "Main Entrance",
                id: "CAM-01",
                event: "Face detected — SGT. James Reeves",
                time: "14:32:07",
                type: "match",
              },
              {
                cam: "East Gate",
                id: "CAM-04",
                event: "Unknown subject detected",
                time: "14:31:44",
                type: "alert",
              },
              {
                cam: "Server Room",
                id: "CAM-02",
                event: "Face detected — CPT. Sarah Chen",
                time: "14:30:52",
                type: "match",
              },
              {
                cam: "Parking A",
                id: "CAM-03",
                event: "Motion detected — No face",
                time: "14:29:18",
                type: "motion",
              },
              {
                cam: "Lobby",
                id: "CAM-05",
                event: "Face detected — MAJ. Diana Torres",
                time: "14:27:33",
                type: "match",
              },
            ].map((e, i) => (
              <div
                key={e.id}
                data-ocid={`detection.event.item.${i + 1}`}
                className="flex items-center gap-3 py-2 px-3 rounded-lg bg-secondary/20 border border-border/40"
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    e.type === "match"
                      ? "bg-success"
                      : e.type === "alert"
                        ? "bg-destructive animate-pulse"
                        : "bg-warning"
                  }`}
                />
                <span className="text-[11px] font-mono text-muted-foreground w-16">
                  {e.id}
                </span>
                <span className="text-[11px] text-muted-foreground w-28">
                  {e.cam}
                </span>
                <span className="text-[12px] text-foreground flex-1">
                  {e.event}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {e.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
