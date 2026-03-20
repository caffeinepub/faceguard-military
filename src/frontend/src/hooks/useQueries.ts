import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AccessLog,
  Camera,
  SystemStatus,
  UserProfile,
  VerificationRecord,
} from "../backend.d";
import { useActor } from "./useActor";

// Mock data fallbacks
const MOCK_SYSTEM_STATUS: SystemStatus = {
  storageUsedPercent: BigInt(34),
  uptime: BigInt(99),
  onlineCamerasCount: BigInt(52),
  activeNodes: BigInt(12),
};

const MOCK_CAMERAS: Camera[] = [
  { cameraId: BigInt(1), location: "Main Entrance", onlineStatus: true },
  { cameraId: BigInt(2), location: "Server Room", onlineStatus: true },
  { cameraId: BigInt(3), location: "Parking A", onlineStatus: true },
  { cameraId: BigInt(4), location: "East Gate", onlineStatus: true },
  { cameraId: BigInt(5), location: "Lobby", onlineStatus: true },
  { cameraId: BigInt(6), location: "Control Room", onlineStatus: false },
];

const MOCK_ACCESS_LOGS: AccessLog[] = [
  {
    id: BigInt(1),
    personName: "SGT. James Reeves",
    personId: BigInt(7734),
    timestamp: BigInt(Date.now() - 60000),
    location: "Main Entrance",
    cameraId: BigInt(1),
    accessStatus: true,
  },
  {
    id: BigInt(2),
    personName: "CPT. Sarah Chen",
    personId: BigInt(4421),
    timestamp: BigInt(Date.now() - 180000),
    location: "Server Room",
    cameraId: BigInt(2),
    accessStatus: true,
  },
  {
    id: BigInt(3),
    personName: "UNKNOWN",
    personId: BigInt(0),
    timestamp: BigInt(Date.now() - 300000),
    location: "East Gate",
    cameraId: BigInt(4),
    accessStatus: false,
  },
  {
    id: BigInt(4),
    personName: "LT. Marcus Webb",
    personId: BigInt(9902),
    timestamp: BigInt(Date.now() - 420000),
    location: "Control Room",
    cameraId: BigInt(6),
    accessStatus: true,
  },
  {
    id: BigInt(5),
    personName: "MAJ. Diana Torres",
    personId: BigInt(3315),
    timestamp: BigInt(Date.now() - 600000),
    location: "Lobby",
    cameraId: BigInt(5),
    accessStatus: true,
  },
  {
    id: BigInt(6),
    personName: "SGT. Kyle Price",
    personId: BigInt(8817),
    timestamp: BigInt(Date.now() - 900000),
    location: "Parking A",
    cameraId: BigInt(3),
    accessStatus: true,
  },
  {
    id: BigInt(7),
    personName: "UNKNOWN",
    personId: BigInt(0),
    timestamp: BigInt(Date.now() - 1200000),
    location: "Main Entrance",
    cameraId: BigInt(1),
    accessStatus: false,
  },
  {
    id: BigInt(8),
    personName: "COL. Robert Hayes",
    personId: BigInt(1001),
    timestamp: BigInt(Date.now() - 1800000),
    location: "Server Room",
    cameraId: BigInt(2),
    accessStatus: true,
  },
];

const MOCK_VERIFICATIONS: VerificationRecord[] = [
  {
    id: BigInt(1),
    personName: "SGT. James Reeves",
    personId: BigInt(7734),
    confidenceScore: BigInt(99),
    timestamp: BigInt(Date.now() - 60000),
  },
  {
    id: BigInt(2),
    personName: "CPT. Sarah Chen",
    personId: BigInt(4421),
    confidenceScore: BigInt(97),
    timestamp: BigInt(Date.now() - 180000),
  },
  {
    id: BigInt(3),
    personName: "UNKNOWN",
    personId: BigInt(0),
    confidenceScore: BigInt(23),
    timestamp: BigInt(Date.now() - 300000),
  },
  {
    id: BigInt(4),
    personName: "LT. Marcus Webb",
    personId: BigInt(9902),
    confidenceScore: BigInt(98),
    timestamp: BigInt(Date.now() - 420000),
  },
  {
    id: BigInt(5),
    personName: "MAJ. Diana Torres",
    personId: BigInt(3315),
    confidenceScore: BigInt(96),
    timestamp: BigInt(Date.now() - 600000),
  },
];

export function useSystemStatus() {
  const { actor, isFetching } = useActor();
  return useQuery<SystemStatus>({
    queryKey: ["systemStatus"],
    queryFn: async () => {
      if (!actor) return MOCK_SYSTEM_STATUS;
      try {
        return await actor.getSystemStatus();
      } catch {
        return MOCK_SYSTEM_STATUS;
      }
    },
    enabled: !isFetching,
    refetchInterval: 10000,
  });
}

export function useCameras() {
  const { actor, isFetching } = useActor();
  return useQuery<Camera[]>({
    queryKey: ["cameras"],
    queryFn: async () => {
      if (!actor) return MOCK_CAMERAS;
      try {
        return await actor.getAllCameras();
      } catch {
        return MOCK_CAMERAS;
      }
    },
    enabled: !isFetching,
  });
}

export function useAccessLogs(page = 0, pageSize = 20) {
  const { actor, isFetching } = useActor();
  return useQuery<AccessLog[]>({
    queryKey: ["accessLogs", page, pageSize],
    queryFn: async () => {
      if (!actor) return MOCK_ACCESS_LOGS;
      try {
        return await actor.getAccessLogsPaginated(
          BigInt(page),
          BigInt(pageSize),
        );
      } catch {
        return MOCK_ACCESS_LOGS;
      }
    },
    enabled: !isFetching,
    refetchInterval: 15000,
  });
}

export function useVerificationHistory(page = 0, pageSize = 10) {
  const { actor, isFetching } = useActor();
  return useQuery<VerificationRecord[]>({
    queryKey: ["verificationHistory", page, pageSize],
    queryFn: async () => {
      if (!actor) return MOCK_VERIFICATIONS;
      try {
        return await actor.getVerificationHistory(
          BigInt(page),
          BigInt(pageSize),
        );
      } catch {
        return MOCK_VERIFICATIONS;
      }
    },
    enabled: !isFetching,
    refetchInterval: 10000,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCallerUserProfile();
      } catch {
        return null;
      }
    },
    enabled: !isFetching,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("No actor");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}
