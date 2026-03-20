import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface AccessLog {
    id: bigint;
    personName: string;
    personId: bigint;
    timestamp: Time;
    location: string;
    cameraId: bigint;
    accessStatus: boolean;
}
export interface Camera {
    onlineStatus: boolean;
    location: string;
    cameraId: bigint;
}
export interface VerificationRecord {
    id: bigint;
    personName: string;
    confidenceScore: bigint;
    personId: bigint;
    timestamp: Time;
}
export interface UserProfile {
    name: string;
    role: string;
}
export interface SystemStatus {
    storageUsedPercent: bigint;
    uptime: bigint;
    onlineCamerasCount: bigint;
    activeNodes: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAccessLog(personName: string, personId: bigint, location: string, accessStatus: boolean, cameraId: bigint): Promise<void>;
    addVerificationRecord(confidenceScore: bigint, personId: bigint, personName: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAccessLog(id: bigint): Promise<AccessLog>;
    getAccessLogsPaginated(page: bigint, pageSize: bigint): Promise<Array<AccessLog>>;
    getAllCameras(): Promise<Array<Camera>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCamera(cameraId: bigint): Promise<Camera>;
    getSystemStatus(): Promise<SystemStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVerificationHistory(page: bigint, pageSize: bigint): Promise<Array<VerificationRecord>>;
    isCallerAdmin(): Promise<boolean>;
    registerCamera(cameraId: bigint, location: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCameraStatus(cameraId: bigint, onlineStatus: boolean): Promise<void>;
}
