/**
 * Chatbot Tool Definitions and Validation
 * Defines all tools that the LLM can call for retrieving and manipulating data
 */

import { ToolSchema } from "./llmProviders";

// Tool input/output types
export interface SearchCoursesInput {
  query?: string;
  school?: string;
  level?: "beginner" | "intermediate" | "advanced";
  free?: boolean;
  limit?: number;
  offset?: number;
}

export interface GetCourseDetailsInput {
  courseSlug: string;
}

export interface SearchJobsInput {
  query?: string;
  location?: string;
  jobType?: "fulltime" | "parttime" | "freelance" | "internship" | "contract";
  salaryMin?: number;
  salaryMax?: number;
  limit?: number;
  offset?: number;
}

export interface GetUserProfileInput {
  userId: string;
}

export interface GetAchievementInfoInput {
  badgeType?: string;
}

export interface GetPaymentInfoInput {
  userId: string;
}

export interface SearchWhatsAppCurriculumInput {
  trackName?: string;
}

export interface GetLeaderboardInput {
  type?: "global" | "weekly" | "challenge";
  userId?: string;
  limit?: number;
}

export interface AdminQueryInput {
  queryType:
    | "metrics"
    | "user_analytics"
    | "revenue"
    | "engagement"
    | "user_email";
  userId?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Tool Definitions with JSON Schema
 */
export const CHATBOT_TOOLS: ToolSchema[] = [
  {
    name: "search_courses",
    description:
      "Search for courses by query, school, or level. Returns paginated list of matching courses with titles, descriptions, prices, and ratings.",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Search query (e.g. 'AI automation', 'ChatGPT')",
        },
        school: {
          type: "string",
          enum: [
            "AI Foundations",
            "AI Automation",
            "AI for Business",
            "AI Creator & Income",
            "AI Builder",
            "AI Career",
            "Community & Mentorship",
          ],
          description: "Filter by learning school/track",
        },
        level: {
          type: "string",
          enum: ["beginner", "intermediate", "advanced"],
          description: "Filter by difficulty level",
        },
        free: {
          type: "boolean",
          description:
            "If true, return only free courses. If false, return only paid courses.",
        },
        limit: {
          type: "number",
          description: "Number of results to return (default: 10, max: 50)",
        },
        offset: {
          type: "number",
          description: "Pagination offset (default: 0)",
        },
      },
      required: [],
    },
  },

  {
    name: "get_course_details",
    description:
      "Get detailed information about a specific course including full description, instructor, lessons, reviews, and prerequisites.",
    inputSchema: {
      type: "object" as const,
      properties: {
        courseSlug: {
          type: "string",
          description:
            "The course slug (e.g. 'ai-automation-101' or 'chatgpt-mastery')",
        },
      },
      required: ["courseSlug"],
    },
  },

  {
    name: "search_jobs",
    description:
      "Search for job listings in the AfriFlow marketplace. Filter by skills, location, job type, and salary range.",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description:
            "Search query (e.g. 'AI automation freelancer', 'ChatGPT developer')",
        },
        location: {
          type: "string",
          description: "Job location or region (e.g. 'Ghana', 'Nigeria', 'Remote')",
        },
        jobType: {
          type: "string",
          enum: ["fulltime", "parttime", "freelance", "internship", "contract"],
          description: "Type of job",
        },
        salaryMin: {
          type: "number",
          description: "Minimum salary (in USD or local currency)",
        },
        salaryMax: {
          type: "number",
          description: "Maximum salary (in USD or local currency)",
        },
        limit: {
          type: "number",
          description: "Number of results to return (default: 10, max: 50)",
        },
        offset: {
          type: "number",
          description: "Pagination offset (default: 0)",
        },
      },
      required: [],
    },
  },

  {
    name: "get_user_profile",
    description:
      "Get the current authenticated user's profile including progress, achievements, XP, wallet balance, and verification score. Requires authentication.",
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: {
          type: "string",
          description: "The user ID (automatically provided when authenticated)",
        },
      },
      required: ["userId"],
    },
  },

  {
    name: "get_achievement_info",
    description:
      "Get information about badges, XP system, streaks, and leaderboards. Explains how to earn achievements and gamification mechanics.",
    inputSchema: {
      type: "object" as const,
      properties: {
        badgeType: {
          type: "string",
          enum: [
            "learning",
            "streak",
            "social",
            "milestone",
            "special",
            "all",
          ],
          description:
            "Filter by badge category (learning, streak, social, milestone, special, or 'all' for overview)",
        },
      },
      required: [],
    },
  },

  {
    name: "get_payment_info",
    description:
      "Get payment and subscription information for the user including wallet balance, subscription tier, and transaction history.",
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: {
          type: "string",
          description: "The user ID (automatically provided when authenticated)",
        },
      },
      required: ["userId"],
    },
  },

  {
    name: "search_whatsapp_curriculum",
    description:
      "Search available WhatsApp Academy curriculum tracks. Returns list of tracks with lesson counts and difficulty levels.",
    inputSchema: {
      type: "object" as const,
      properties: {
        trackName: {
          type: "string",
          description: "Filter by track name (e.g. 'ChatGPT Mastery', 'Zapier')",
        },
      },
      required: [],
    },
  },

  {
    name: "get_leaderboard",
    description:
      "Get global or category-specific leaderboards showing top learners, their XP, achievements, and user's rank.",
    inputSchema: {
      type: "object" as const,
      properties: {
        type: {
          type: "string",
          enum: ["global", "weekly", "challenge"],
          description:
            "Type of leaderboard (global all-time, weekly, or challenge-specific)",
        },
        userId: {
          type: "string",
          description:
            "Optional: show leaderboard around a specific user for context",
        },
        limit: {
          type: "number",
          description:
            "Number of results to return (default: 10, max: 100 for context)",
        },
      },
      required: [],
    },
  },

  {
    name: "admin_query",
    description:
      "Execute admin analytics queries on platform metrics. Requires admin authentication. Returns MRR, user growth, engagement stats, etc.",
    inputSchema: {
      type: "object" as const,
      properties: {
        queryType: {
          type: "string",
          enum: ["metrics", "user_analytics", "revenue", "engagement", "user_email"],
          description:
            "Type of query: metrics (overall platform), revenue (MRR/ARR), engagement (activity), user_analytics (specific user), or user_email (search by email)",
        },
        userId: {
          type: "string",
          description:
            "For user_analytics and user_email queries: the target user ID or email",
        },
        startDate: {
          type: "string",
          description: "Start date for analytics range (ISO 8601 format)",
        },
        endDate: {
          type: "string",
          description: "End date for analytics range (ISO 8601 format)",
        },
      },
      required: ["queryType"],
    },
  },
];

/**
 * Validate tool input against schema
 */
export function validateToolInput(
  toolName: string,
  input: Record<string, any>
): { valid: boolean; errors: string[] } {
  const tool = CHATBOT_TOOLS.find((t) => t.name === toolName);
  if (!tool) {
    return { valid: false, errors: [`Unknown tool: ${toolName}`] };
  }

  const errors: string[] = [];
  const schema = tool.inputSchema;

  // Check required properties
  for (const required of schema.required || []) {
    if (!(required in input)) {
      errors.push(`Missing required property: ${required}`);
    }
  }

  // Basic type checking
  for (const [key, value] of Object.entries(input)) {
    if (!(key in schema.properties)) {
      errors.push(`Unknown property: ${key}`);
      continue;
    }

    const propSchema = schema.properties[key] as any;

    if (propSchema.type && typeof value !== propSchema.type) {
      if (!(propSchema.type === "number" && typeof value === "string")) {
        errors.push(
          `Property ${key} should be ${propSchema.type}, got ${typeof value}`
        );
      }
    }

    if (propSchema.enum && !propSchema.enum.includes(value)) {
      errors.push(
        `Property ${key} must be one of: ${propSchema.enum.join(", ")}`
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Tool execution context wrapper
 */
export interface ToolExecutionContext {
  userId?: string;
  isAdmin?: boolean;
  isAuthenticated: boolean;
  userContext?: any;
}

/**
 * Check if user has permission to call a tool
 */
export function checkToolPermission(
  toolName: string,
  context: ToolExecutionContext
): { allowed: boolean; reason?: string } {
  switch (toolName) {
    case "get_user_profile":
    case "get_payment_info":
    case "apply_for_job":
    case "enroll_user_in_course":
    case "bookmark_course":
    case "join_challenge":
      if (!context.isAuthenticated) {
        return {
          allowed: false,
          reason:
            "This action requires you to be logged in. Please sign up or log in first.",
        };
      }
      break;

    case "admin_query":
      if (!context.isAdmin) {
        return {
          allowed: false,
          reason: "This action is restricted to platform administrators.",
        };
      }
      break;

    // Public tools don't require authentication
    case "search_courses":
    case "get_course_details":
    case "search_jobs":
    case "get_achievement_info":
    case "search_whatsapp_curriculum":
    case "get_leaderboard":
      break;

    default:
      return {
        allowed: false,
        reason: `Unknown tool: ${toolName}`,
      };
  }

  return { allowed: true };
}

/**
 * Get tool by name
 */
export function getTool(toolName: string): ToolSchema | undefined {
  return CHATBOT_TOOLS.find((t) => t.name === toolName);
}

/**
 * Get all tool names
 */
export function getAllToolNames(): string[] {
  return CHATBOT_TOOLS.map((t) => t.name);
}
