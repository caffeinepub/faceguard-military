import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Search } from "lucide-react";
import { useState } from "react";
import { useAccessLogs } from "../hooks/useQueries";

function formatFull(ts: bigint) {
  return new Date(Number(ts)).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function Logs() {
  const { data: logs = [], isLoading } = useAccessLogs(0, 50);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const locations = Array.from(new Set(logs.map((l) => l.location)));

  const filtered = logs.filter((log) => {
    const matchSearch =
      log.personName.toLowerCase().includes(search.toLowerCase()) ||
      String(log.personId).includes(search) ||
      log.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "granted" && log.accessStatus) ||
      (statusFilter === "denied" && !log.accessStatus);
    const matchLocation =
      locationFilter === "all" || log.location === locationFilter;
    return matchSearch && matchStatus && matchLocation;
  });

  const grantedCount = logs.filter((l) => l.accessStatus).length;
  const deniedCount = logs.filter((l) => !l.accessStatus).length;

  return (
    <div className="space-y-5 animate-float-in">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-foreground uppercase text-glow-blue">
            ACCESS LOGS
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {logs.length} total entries · {grantedCount} granted · {deniedCount}{" "}
            denied
          </p>
        </div>
        <Button
          data-ocid="logs.export.button"
          variant="outline"
          size="sm"
          className="gap-2 border-border text-muted-foreground hover:text-foreground"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Entries", value: logs.length, color: "text-primary" },
          {
            label: "Access Granted",
            value: grantedCount,
            color: "text-success",
          },
          {
            label: "Access Denied",
            value: deniedCount,
            color: "text-destructive",
          },
          {
            label: "Active Locations",
            value: locations.length,
            color: "text-primary",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card/60 border border-border rounded-lg px-4 py-3"
          >
            <div className={`text-2xl font-bold font-mono ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <Card className="bg-card/60 border-border">
        <CardHeader className="pb-3 pt-4 px-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-sm font-semibold tracking-wider uppercase text-foreground">
              Log Entries
            </CardTitle>
            <div className="flex items-center gap-2 ml-auto">
              <div className="relative">
                <Search
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  data-ocid="logs.search.input"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-[12px] bg-secondary/40 border-border w-48"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger
                  data-ocid="logs.status.select"
                  className="h-8 text-[12px] bg-secondary/40 border-border w-32"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="granted">Granted</SelectItem>
                  <SelectItem value="denied">Denied</SelectItem>
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger
                  data-ocid="logs.location.select"
                  className="h-8 text-[12px] bg-secondary/40 border-border w-40"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {isLoading ? (
            <div
              data-ocid="logs.loading_state"
              className="flex items-center justify-center py-16 text-muted-foreground text-sm"
            >
              Loading logs...
            </div>
          ) : (
            <div className="overflow-x-auto" data-ocid="logs.table">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "#",
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
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        data-ocid="logs.empty_state"
                        className="text-center py-12 text-muted-foreground"
                      >
                        No log entries found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((log, i) => (
                      <tr
                        key={String(log.id)}
                        data-ocid={`logs.item.${i + 1}`}
                        className="border-b border-border/40 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="px-4 py-2.5 font-mono text-muted-foreground">
                          {String(i + 1).padStart(4, "0")}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-muted-foreground text-[11px]">
                          {formatFull(log.timestamp)}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
