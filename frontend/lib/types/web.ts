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

