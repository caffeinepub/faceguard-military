import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Bool "mo:core/Bool";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type AccessLog = {
    id : Nat;
    timestamp : Time.Time;
    personName : Text;
    personId : Nat;
    location : Text;
    accessStatus : Bool;
    cameraId : Nat;
  };

  public type VerificationRecord = {
    id : Nat;
    confidenceScore : Nat;
    personId : Nat;
    personName : Text;
    timestamp : Time.Time;
  };

  public type SystemStatus = {
    uptime : Nat;
    activeNodes : Nat;
    onlineCamerasCount : Nat;
    storageUsedPercent : Nat;
  };

  public type Camera = {
    cameraId : Nat;
    location : Text;
    onlineStatus : Bool;
  };

  public type UserProfile = {
    name : Text;
    role : Text;
  };

  module AccessLog {
    public func compare(a : AccessLog, b : AccessLog) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module VerificationRecord {
    public func compare(a : VerificationRecord, b : VerificationRecord) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextLogId = 0;
  var nextVerificationId = 0;
  let accessLogs = Map.empty<Nat, AccessLog>();
  let verificationRecords = Map.empty<Nat, VerificationRecord>();
  let cameraRegistry = Map.empty<Nat, Camera>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Access log management - Admin only for write operations
  public shared ({ caller }) func addAccessLog(personName : Text, personId : Nat, location : Text, accessStatus : Bool, cameraId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add access logs");
    };

    let log : AccessLog = {
      id = nextLogId;
      timestamp = Time.now();
      personName;
      personId;
      location;
      accessStatus;
      cameraId;
    };

    accessLogs.add(nextLogId, log);
    nextLogId += 1;
  };

  // Read operations - Require at least user role for sensitive military data
  public query ({ caller }) func getAccessLog(id : Nat) : async AccessLog {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can view access logs");
    };

    switch (accessLogs.get(id)) {
      case (null) { Runtime.trap("Access log not found") };
      case (?log) { log };
    };
  };

  public query ({ caller }) func getAccessLogsPaginated(page : Nat, pageSize : Nat) : async [AccessLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can view access logs");
    };

    let allLogs = accessLogs.values().toArray().sort();
    let totalLogs = allLogs.size();
    let start = page * pageSize;
    let end = Int.min((start + pageSize).toInt(), totalLogs.toInt()).toNat();

    if (start >= totalLogs) {
      return [];
    };

    allLogs.sliceToArray(start, end);
  };

  // Verification records - Admin only for write operations
  public shared ({ caller }) func addVerificationRecord(confidenceScore : Nat, personId : Nat, personName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add verification records");
    };

    let record : VerificationRecord = {
      id = nextVerificationId;
      confidenceScore;
      personId;
      personName;
      timestamp = Time.now();
    };

    verificationRecords.add(nextVerificationId, record);
    nextVerificationId += 1;
  };

  public query ({ caller }) func getVerificationHistory(page : Nat, pageSize : Nat) : async [VerificationRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can view verification history");
    };

    let allRecords = verificationRecords.values().toArray().sort();
    let totalRecords = allRecords.size();
    let start = page * pageSize;
    let end = Int.min((start + pageSize).toInt(), totalRecords.toInt()).toNat();

    if (start >= totalRecords) {
      return [];
    };

    allRecords.sliceToArray(start, end);
  };

  // Camera management - Admin only for write operations
  public shared ({ caller }) func registerCamera(cameraId : Nat, location : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can register cameras");
    };

    let camera : Camera = {
      cameraId;
      location;
      onlineStatus = true;
    };

    cameraRegistry.add(cameraId, camera);
  };

  public shared ({ caller }) func updateCameraStatus(cameraId : Nat, onlineStatus : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update camera status");
    };

    switch (cameraRegistry.get(cameraId)) {
      case (null) { Runtime.trap("Camera not found") };
      case (?camera) {
        let updatedCamera : Camera = {
          camera with
          onlineStatus
        };
        cameraRegistry.add(cameraId, updatedCamera);
      };
    };
  };

  public query ({ caller }) func getCamera(cameraId : Nat) : async Camera {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can view camera information");
    };

    switch (cameraRegistry.get(cameraId)) {
      case (null) { Runtime.trap("Camera not found") };
      case (?camera) { camera };
    };
  };

  public query ({ caller }) func getAllCameras() : async [Camera] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can view camera information");
    };

    cameraRegistry.values().toArray();
  };

  // System status - Require at least user role for military system metrics
  public query ({ caller }) func getSystemStatus() : async SystemStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can view system status");
    };

    let onlineCameras = cameraRegistry.size();
    {
      uptime = 0;
      activeNodes = 0;
      onlineCamerasCount = onlineCameras;
      storageUsedPercent = 0;
    };
  };
};
