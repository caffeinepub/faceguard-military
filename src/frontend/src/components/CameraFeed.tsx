import { cn } from "@/lib/utils";

interface CameraFeedProps {
  location: string;
  cameraId: number;
  online?: boolean;
  showFaceBox?: boolean;
  large?: boolean;
  className?: string;
  [key: string]: unknown;
}

export function CameraFeed({
  location,
  cameraId,
  online = true,
  showFaceBox = false,
  large = false,
  className,
  ...props
}: CameraFeedProps) {
  const id = ((cameraId - 1) % 6) + 1;

  return (
    <div
      {...props}
      className={cn(
        "relative overflow-hidden rounded-lg border border-border group",
        !online && "opacity-60",
        className,
      )}
      style={{
        background:
          "linear-gradient(135deg, oklch(11% 0.055 243) 0%, oklch(8% 0.04 243) 100%)",
      }}
    >
      {/* Camera noise texture */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: "150px 150px",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(oklch(56% 0.19 262 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(56% 0.19 262 / 0.04) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Simulated person silhouette */}
      {online && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 100 120"
            className={large ? "w-32 h-40 opacity-15" : "w-16 h-20 opacity-10"}
            fill="oklch(56% 0.19 262)"
            aria-hidden="true"
          >
            <ellipse cx="50" cy="25" rx="18" ry="22" />
            <path d="M20 120 Q20 70 50 65 Q80 70 80 120 Z" />
          </svg>
        </div>
      )}

      {/* Face detection bounding box */}
      {showFaceBox && online && (
        <div
          className="absolute camera-active-border rounded-sm"
          style={{
            top: large ? "18%" : "20%",
            left: large ? "28%" : "30%",
            width: large ? "44%" : "40%",
            height: large ? "42%" : "38%",
            border: "2px solid oklch(70% 0.19 147)",
            boxShadow:
              "0 0 8px oklch(70% 0.19 147 / 0.5), inset 0 0 8px oklch(70% 0.19 147 / 0.1)",
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
          <div className="absolute -bottom-6 left-0 right-0 text-center">
            <span
              className="text-[9px] font-bold"
              style={{ color: "oklch(70% 0.19 147)" }}
            >
              TRACKING
            </span>
          </div>
        </div>
      )}

      {/* Scan line */}
      {online && (
        <div
          className="absolute left-0 right-0 h-0.5 scan-line pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(56% 0.19 262 / 0.4), transparent)",
          }}
        />
      )}

      {/* Status overlays */}
      <div className="absolute inset-0 p-2 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {online ? (
              <span className="flex items-center gap-1 bg-success/20 border border-success/40 rounded px-1.5 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[9px] font-bold text-success tracking-wider">
                  LIVE
                </span>
              </span>
            ) : (
              <span className="bg-destructive/20 border border-destructive/40 rounded px-1.5 py-0.5 text-[9px] font-bold text-destructive">
                OFFLINE
              </span>
            )}
          </div>
          <span className="text-[9px] font-mono text-muted-foreground bg-black/40 px-1.5 py-0.5 rounded">
            CAM-{String(id).padStart(2, "0")}
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[10px] font-semibold text-foreground bg-black/50 px-1.5 py-0.5 rounded">
              {location}
            </div>
            <div className="text-[9px] text-muted-foreground font-mono mt-0.5 bg-black/40 px-1.5 py-0.5 rounded">
              {new Date().toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </div>
          <div className="text-[8px] font-mono text-muted-foreground/60">
            1920×1080
          </div>
        </div>
      </div>
    </div>
  );
}
