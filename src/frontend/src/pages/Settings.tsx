import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  Camera,
  Database,
  Lock,
  Network,
  Save,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Settings() {
  const [confidence, setConfidence] = useState("75");
  const [retention, setRetention] = useState("90");
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [motionAlerts, setMotionAlerts] = useState(true);
  const [auditLog, setAuditLog] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [logLevel, setLogLevel] = useState("info");
  const [lanIp, setLanIp] = useState("192.168.1.10");

  const handleSave = () => {
    toast.success("Settings saved successfully", {
      description: "Configuration updated. Changes take effect immediately.",
    });
  };

  return (
    <div className="space-y-5 animate-float-in">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-foreground uppercase text-glow-blue">
            SYSTEM SETTINGS
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Guardian v4.2.1 — Configuration &amp; Administration
          </p>
        </div>
        <Button
          data-ocid="settings.save.button"
          className="gap-2 bg-primary hover:bg-primary/90"
          onClick={handleSave}
        >
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Recognition Engine */}
        <Card className="bg-card/60 border-border">
          <CardHeader className="pb-3 pt-4 px-4">
            <CardTitle className="text-sm font-semibold tracking-wider uppercase text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Recognition Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-4">
            <div>
              <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">
                Confidence Threshold (%)
              </Label>
              <Input
                data-ocid="settings.confidence.input"
                value={confidence}
                onChange={(e) => setConfidence(e.target.value)}
                className="mt-1.5 bg-secondary/40 border-border h-8 text-[13px]"
                type="number"
                min="50"
                max="99"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Minimum match score to grant access (recommended: 75–90%)
              </p>
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">
                Processing Mode
              </Label>
              <Select defaultValue="realtime">
                <SelectTrigger
                  data-ocid="settings.processing.select"
                  className="mt-1.5 bg-secondary/40 border-border h-8 text-[13px]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="realtime">
                    Real-time (GPU accelerated)
                  </SelectItem>
                  <SelectItem value="batch">Batch processing</SelectItem>
                  <SelectItem value="hybrid">Hybrid mode</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator className="bg-border/50" />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] text-foreground">
                  Liveness Detection
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Anti-spoofing via depth analysis
                </div>
              </div>
              <Switch data-ocid="settings.liveness.switch" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] text-foreground">
                  Multi-face Tracking
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Track multiple subjects simultaneously
                </div>
              </div>
              <Switch data-ocid="settings.multiface.switch" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Camera Settings */}
        <Card className="bg-card/60 border-border">
          <CardHeader className="pb-3 pt-4 px-4">
            <CardTitle className="text-sm font-semibold tracking-wider uppercase text-foreground flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary" />
              Camera Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-4">
            <div>
              <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">
                Stream Resolution
              </Label>
              <Select defaultValue="1080p">
                <SelectTrigger
                  data-ocid="settings.resolution.select"
                  className="mt-1.5 bg-secondary/40 border-border h-8 text-[13px]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="4k">4K (3840×2160)</SelectItem>
                  <SelectItem value="1080p">1080p (1920×1080)</SelectItem>
                  <SelectItem value="720p">720p (1280×720)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">
                Frame Rate (fps)
              </Label>
              <Select defaultValue="30">
                <SelectTrigger
                  data-ocid="settings.framerate.select"
                  className="mt-1.5 bg-secondary/40 border-border h-8 text-[13px]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="60">60 fps</SelectItem>
                  <SelectItem value="30">30 fps</SelectItem>
                  <SelectItem value="15">15 fps</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator className="bg-border/50" />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] text-foreground">
                  Auto-brightness
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Adaptive image enhancement
                </div>
              </div>
              <Switch data-ocid="settings.brightness.switch" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] text-foreground">
                  Night Vision Mode
                </div>
                <div className="text-[10px] text-muted-foreground">
                  IR-based low-light detection
                </div>
              </div>
              <Switch data-ocid="settings.nightvision.switch" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="bg-card/60 border-border">
          <CardHeader className="pb-3 pt-4 px-4">
            <CardTitle className="text-sm font-semibold tracking-wider uppercase text-foreground flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              Alert Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] text-foreground">Enable Alerts</div>
                <div className="text-[10px] text-muted-foreground">
                  Master switch for all notifications
                </div>
              </div>
              <Switch
                data-ocid="settings.alerts.switch"
                checked={alertsEnabled}
                onCheckedChange={setAlertsEnabled}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] text-foreground">Motion Alerts</div>
                <div className="text-[10px] text-muted-foreground">
                  Alert on unidentified motion
                </div>
              </div>
              <Switch
                data-ocid="settings.motion.switch"
                checked={motionAlerts}
                onCheckedChange={setMotionAlerts}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] text-foreground">
                  Denied Access Alerts
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Immediate notification on denial
                </div>
              </div>
              <Switch data-ocid="settings.denied.switch" defaultChecked />
            </div>
            <Separator className="bg-border/50" />
            <div>
              <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">
                Alert Sound
              </Label>
              <Select defaultValue="chime">
                <SelectTrigger
                  data-ocid="settings.sound.select"
                  className="mt-1.5 bg-secondary/40 border-border h-8 text-[13px]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="chime">Chime</SelectItem>
                  <SelectItem value="alarm">Alarm</SelectItem>
                  <SelectItem value="silent">Silent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Network & Security */}
        <Card className="bg-card/60 border-border">
          <CardHeader className="pb-3 pt-4 px-4">
            <CardTitle className="text-sm font-semibold tracking-wider uppercase text-foreground flex items-center gap-2">
              <Network className="w-4 h-4 text-primary" />
              Network &amp; Security
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-4">
            <div>
              <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">
                LAN IP Address
              </Label>
              <Input
                data-ocid="settings.lan_ip.input"
                value={lanIp}
                onChange={(e) => setLanIp(e.target.value)}
                className="mt-1.5 bg-secondary/40 border-border h-8 text-[13px] font-mono"
              />
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">
                Log Level
              </Label>
              <Select value={logLevel} onValueChange={setLogLevel}>
                <SelectTrigger
                  data-ocid="settings.loglevel.select"
                  className="mt-1.5 bg-secondary/40 border-border h-8 text-[13px]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="debug">Debug</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">
                Data Retention (days)
              </Label>
              <Input
                data-ocid="settings.retention.input"
                value={retention}
                onChange={(e) => setRetention(e.target.value)}
                className="mt-1.5 bg-secondary/40 border-border h-8 text-[13px]"
                type="number"
                min="7"
                max="365"
              />
            </div>
            <Separator className="bg-border/50" />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] text-foreground">
                  Two-Factor Auth
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Require 2FA for admin access
                </div>
              </div>
              <Switch
                data-ocid="settings.2fa.switch"
                checked={twoFactor}
                onCheckedChange={setTwoFactor}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] text-foreground">Audit Log</div>
                <div className="text-[10px] text-muted-foreground">
                  Log all administrative actions
                </div>
              </div>
              <Switch
                data-ocid="settings.audit.switch"
                checked={auditLog}
                onCheckedChange={setAuditLog}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
