import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, Search, UserCheck, XCircle } from "lucide-react";
import { useState } from "react";
import { useVerificationHistory } from "../hooks/useQueries";

function formatDate(ts: bigint) {
  return new Date(Number(ts)).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function Verification() {
  const { data: verifications = [] } = useVerificationHistory(0, 20);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(0);

  const filtered = verifications.filter(
    (v) =>
      v.personName.toLowerCase().includes(search.toLowerCase()) ||
      String(v.personId).includes(search),
  );

  const current = filtered[selected] || verifications[0];
  const isMatch = current && Number(current.confidenceScore) > 70;

  return (
    <div className="space-y-5 animate-float-in">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-widest text-foreground uppercase text-glow-blue">
          IDENTITY VERIFICATION
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time facial recognition and identity matching
        </p>
      </div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-2 space-y-4">
          <Card className="bg-card/60 border-border">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-sm font-semibold tracking-wider uppercase text-foreground">
                Active Scan
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div
                className="relative rounded-lg overflow-hidden flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(11% 0.055 243), oklch(8% 0.04 243))",
                  height: 240,
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
                <div
                  className="absolute left-0 right-0 h-0.5 scan-line"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, oklch(70% 0.19 147 / 0.6), transparent)",
                  }}
                />
                <div className="relative">
                  <svg
                    viewBox="0 0 80 100"
                    className="w-40 h-48"
                    fill="oklch(56% 0.19 262 / 0.35)"
                    aria-hidden="true"
                  >
                    <ellipse cx="40" cy="32" rx="24" ry="28" />
                    <path d="M8 100 Q8 65 40 58 Q72 65 72 100 Z" />
                    <ellipse
                      cx="28"
                      cy="28"
                      rx="5"
                      ry="4"
                      fill="oklch(56% 0.19 262 / 0.7)"
                    />
                    <ellipse
                      cx="52"
                      cy="28"
                      rx="5"
                      ry="4"
                      fill="oklch(56% 0.19 262 / 0.7)"
                    />
                  </svg>
                  <div
                    className="absolute inset-0 camera-active-border rounded"
                    style={{
                      border: "2px solid oklch(70% 0.19 147)",
                      boxShadow: "0 0 20px oklch(70% 0.19 147 / 0.4)",
                    }}
                  >
                    <span
                      className="absolute -top-0.5 -left-0.5 w-4 h-4 border-t-2 border-l-2"
                      style={{ borderColor: "oklch(70% 0.19 147)" }}
                    />
                    <span
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 border-t-2 border-r-2"
                      style={{ borderColor: "oklch(70% 0.19 147)" }}
                    />
                    <span
                      className="absolute -bottom-0.5 -left-0.5 w-4 h-4 border-b-2 border-l-2"
                      style={{ borderColor: "oklch(70% 0.19 147)" }}
                    />
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-4 h-4 border-b-2 border-r-2"
                      style={{ borderColor: "oklch(70% 0.19 147)" }}
                    />
                  </div>
                </div>
                <div className="absolute top-2 left-2 space-y-1">
                  <div
                    className="text-[9px] font-mono bg-black/50 px-1.5 py-0.5 rounded"
                    style={{ color: "oklch(70% 0.19 147)" }}
                  >
                    FACIAL SCAN ACTIVE
                  </div>
                  <div className="text-[9px] font-mono bg-black/50 px-1.5 py-0.5 rounded text-muted-foreground">
                    CONF: {current ? `${current.confidenceScore}%` : "99%"}
                  </div>
                </div>
              </div>

              {current && (
                <div
                  className="rounded-lg px-4 py-3 border mb-4"
                  style={{
                    background: isMatch
                      ? "oklch(70% 0.19 147 / 0.08)"
                      : "oklch(55% 0.19 22 / 0.08)",
                    borderColor: isMatch
                      ? "oklch(70% 0.19 147 / 0.3)"
                      : "oklch(55% 0.19 22 / 0.3)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isMatch ? (
                      <CheckCircle
                        className="w-4 h-4"
                        style={{ color: "oklch(70% 0.19 147)" }}
                        aria-hidden="true"
                      />
                    ) : (
                      <XCircle
                        className="w-4 h-4 text-destructive"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className="text-[12px] font-bold tracking-widest uppercase"
                      style={{
                        color: isMatch
                          ? "oklch(70% 0.19 147)"
                          : "oklch(55% 0.19 22)",
                      }}
                    >
                      {isMatch ? "VERIFICATION SUCCESSFUL" : "MATCH FAILED"}
                    </span>
                  </div>
                  <div className="text-foreground font-bold">
                    {current.personName}
                  </div>
                  <div className="text-muted-foreground text-[11px] font-mono">
                    ID-{String(current.personId)}
                  </div>
                  <div className="text-muted-foreground text-[10px] mt-1">
                    {formatDate(current.timestamp)}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                {["LEVEL 1", "LEVEL 2", "LEVEL 3"].map((lvl, i) => (
                  <div
                    key={lvl}
                    className="text-center py-2 rounded border text-[10px] font-bold"
                    style={{
                      borderColor:
                        i === 0
                          ? "oklch(70% 0.19 147 / 0.4)"
                          : "oklch(26% 0.065 243)",
                      color:
                        i === 0 ? "oklch(70% 0.19 147)" : "oklch(65% 0.05 243)",
                      background:
                        i === 0 ? "oklch(70% 0.19 147 / 0.08)" : "transparent",
                    }}
                  >
                    {lvl}
                    <div className="text-[8px] mt-0.5">
                      {i === 0 ? "CLEARED" : "RESTRICTED"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3">
          <Card className="bg-card/60 border-border h-full">
            <CardHeader className="pb-3 pt-4 px-4">
              <div className="flex items-center gap-3">
                <CardTitle className="text-sm font-semibold tracking-wider uppercase text-foreground flex items-center gap-2">
                  <UserCheck
                    className="w-4 h-4 text-primary"
                    aria-hidden="true"
                  />
                  Verification History
                </CardTitle>
                <div className="relative ml-auto w-56">
                  <Search
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    data-ocid="verification.search.input"
                    placeholder="Search name or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-8 text-[12px] bg-secondary/40 border-border"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div
                className="overflow-x-auto"
                data-ocid="verification.history.table"
              >
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-border">
                      {[
                        "#",
                        "Timestamp",
                        "Subject",
                        "ID",
                        "Confidence",
                        "Result",
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
                    {filtered.map((v, i) => {
                      const match = Number(v.confidenceScore) > 70;
                      return (
                        <tr
                          key={String(v.id)}
                          data-ocid={`verification.history.item.${i + 1}`}
                          className={`border-b border-border/40 hover:bg-secondary/30 transition-colors cursor-pointer ${
                            selected === i ? "bg-primary/5" : ""
                          }`}
                          onClick={() => setSelected(i)}
                          onKeyDown={(e) => e.key === "Enter" && setSelected(i)}
                        >
                          <td className="px-4 py-2.5 font-mono text-muted-foreground">
                            {String(i + 1).padStart(3, "0")}
                          </td>
                          <td className="px-4 py-2.5 font-mono text-muted-foreground text-[11px]">
                            {formatDate(v.timestamp)}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-foreground">
                            {v.personName}
                          </td>
                          <td className="px-4 py-2.5 font-mono text-muted-foreground">
                            ID-{String(v.personId)}
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 rounded-full bg-secondary/60 w-16">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${v.confidenceScore}%`,
                                    background: match
                                      ? "oklch(70% 0.19 147)"
                                      : "oklch(55% 0.19 22)",
                                  }}
                                />
                              </div>
                              <span
                                className="font-mono text-[11px]"
                                style={{
                                  color: match
                                    ? "oklch(70% 0.19 147)"
                                    : "oklch(55% 0.19 22)",
                                }}
                              >
                                {String(v.confidenceScore)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            <Badge
                              variant="outline"
                              className={`text-[9px] font-bold uppercase ${
                                match
                                  ? "border-success/40 text-success bg-success/10"
                                  : "border-destructive/40 text-destructive bg-destructive/10"
                              }`}
                            >
                              {match ? "VERIFIED" : "DENIED"}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
