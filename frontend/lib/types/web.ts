export type RobotSummary = {
  id: string;
  name: string;
  status: "idle" | "active" | "maintenance";
  batteryLevel: number;
};

export type ActivityLog = {
  id: string;
  robotId: string;
  message: string;
  timestamp: string;
};

export type DashboardData = {
  summaries: RobotSummary[];
  logs: ActivityLog[];
};

export type WorkStatus = "work" | "not_work";

export type WorkEntry = {
  timestamp: string; // ISO string
  label: WorkStatus;
  probability: number;
};

export type WorkSeriesResponse = {
  entries: WorkEntry[];
};

export type EmotionStatus  = "happy" | "angry" | "neutral" | "sad" | "surprised" | "fear" | "disgust";

export type EmotionEntry = {
  timestamp: string; // ISO string
  label: EmotionStatus;
  confidence: number;
  class : number
};
