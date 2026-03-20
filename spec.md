# FaceGuard Military

## Current State
New project with empty backend and no frontend.

## Requested Changes (Diff)

### Add
- Military-grade facial recognition dashboard web application
- LAN-only access indicator throughout the UI
- Navigation: Dashboard, Live View, Verification, Logs, System Status, Settings
- Operational dashboard with KPI strip (Uptime, Active Nodes, Online Cams, Storage Used)
- Live Camera Feeds section with simulated feed thumbnails and face detection overlays
- Identity Verification module with face bounding box preview and verification result
- Recent Access Logs table (Timestamp, Name, ID, Location, Status, Camera)
- System Status Indicators panel (all system health metrics)
- Role-based user profile display (Admin role)
- IP/LAN address display in header
- Authorization for admin access

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Select authorization component for role-based access control
2. Generate Motoko backend with access logs, verification records, system status data
3. Build frontend dashboard with dark navy/blue-white military aesthetic
4. Implement all navigation tabs with mock camera feeds and face detection UI
5. Wire backend data to frontend tables and status panels
