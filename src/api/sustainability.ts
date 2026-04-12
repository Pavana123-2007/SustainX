import { auth } from "@/lib/firebase";

interface LogActionParams {
  category: string;
  actionLabel: string;
  points: number;
}

interface LogActionResponse {
  success: boolean;
  data?: {
    id: number;
    createdAt: string;
  };
  error?: string;
  message?: string;
}

interface UserStatsResponse {
  success: boolean;
  data?: {
    today: {
      totalPoints: number;
      goodActionsCount: number;
      badActionsCount: number;
    };
    allTime: {
      totalPoints: number;
    };
  };
  error?: string;
  message?: string;
}

export async function logSustainabilityAction({
  category,
  actionLabel,
  points,
}: LogActionParams): Promise<LogActionResponse> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const idToken = await user.getIdToken();

    const response = await fetch("http://localhost:5000/api/logSustainabilityAction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category,
        actionLabel,
        points,
        idToken,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to log action");
    }

    return data;
  } catch (error) {
    console.error("Error logging sustainability action:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getUserStats(): Promise<UserStatsResponse> {
  try {
    const user = auth.currentUser;
    console.log('[getUserStats] Current user:', user?.uid);
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const idToken = await user.getIdToken();
    console.log('[getUserStats] Got ID token, calling API...');

    const response = await fetch("http://localhost:5000/api/getUserStats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idToken,
      }),
    });

    const data = await response.json();
    console.log('[getUserStats] API response:', data);

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch stats");
    }

    return data;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

interface GlobalStatsResponse {
  success: boolean;
  data?: {
    activeUsers: number;
    treesEquivalent: number;
    ecoActionsLogged: number;
    co2Prevented: number;
  };
  error?: string;
  warning?: string;
}

export async function getGlobalStats(): Promise<GlobalStatsResponse> {
  try {
    const response = await fetch("http://localhost:5000/api/getGlobalStats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch global stats");
    }

    return data;
  } catch (error) {
    console.error("Error fetching global stats:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
