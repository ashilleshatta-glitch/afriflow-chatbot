/**
 * Chatbot Context Engine
 * Builds user and platform context for personalized responses
 */

import { User } from "../models/User";
import { Course } from "../models/Course";

export interface UserContext {
  userId?: string;
  email?: string;
  name?: string;
  role?: "student" | "instructor" | "admin";
  subscriptionTier?: "free" | "premium" | "enterprise";
  verificationScore?: number;
  totalXP?: number;
  completedCourses?: string[];
  currentStreak?: number;
  achievements?: string[];
  walletBalance?: number;
  enrolledCourses?: Array<{
    slug: string;
    title: string;
    progress: number;
  }>;
  learningStyle?: string;
  careerGoal?: string;
}

export interface PlatformContext {
  totalUsers?: number;
  totalCourses?: number;
  totalJobs?: number;
  publishedCourses?: Array<{
    slug: string;
    title: string;
    school: string;
    level: string;
    price?: number;
  }>;
  activeJobs?: Array<{
    id: string;
    title: string;
    company: string;
  }>;
  featuredPaths?: string[];
  newCourses?: string[];
}

export interface ChatbotContext {
  timestamp: Date;
  userContext: UserContext | null;
  platformContext: PlatformContext;
  pageContext?: {
    currentPage?: string;
    currentRoute?: string;
  };
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const CONTEXT_CACHE_KEY = "chatbot-context";
const CONTEXT_CACHE_TTL = 60000; // 1 minute

interface CachedContext {
  context: ChatbotContext;
  timestamp: number;
}

/**
 * Context Builder
 */
export class ContextBuilder {
  private cache: Map<string, CachedContext> = new Map();

  /**
   * Build full context for a user and platform
   */
  async buildContext(
    userId?: string,
    pageContext?: { currentPage?: string; currentRoute?: string }
  ): Promise<ChatbotContext> {
    const now = Date.now();
    const isAuthenticated = !!userId;
    const cacheKey = `${userId || "anonymous"}`;

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && now - cached.timestamp < CONTEXT_CACHE_TTL) {
      return cached.context;
    }

    // Build user context
    let userContext: UserContext | null = null;
    if (userId) {
      userContext = await this.buildUserContext(userId);
    }

    // Build platform context
    const platformContext = await this.buildPlatformContext();

    const context: ChatbotContext = {
      timestamp: new Date(),
      userContext,
      platformContext,
      pageContext,
      isAuthenticated,
      isAdmin: userContext?.role === "admin" || false,
    };

    // Cache result
    this.cache.set(cacheKey, { context, timestamp: now });

    return context;
  }

  /**
   * Build user-specific context
   */
  private async buildUserContext(userId: string): Promise<UserContext | null> {
    try {
      // Fetch user from database
      const user = await User.findById(userId).select(
        "email name role subscriptionTier verificationScore totalXP achievements currentStreak enrolledCourses learningStyle careerGoal"
      );

      if (!user) return null;

      // Get enrolled courses with progress
      const enrolledCourses = await Promise.all(
        (user.enrolledCourses || []).map(async (courseId: string) => {
          const course = await Course.findById(courseId).select(
            "slug title progress"
          );
          if (course) {
            // Calculate progress percentage
            const enrollment = user.enrolledCourses.find(
              (e: any) => e._id?.toString() === courseId.toString()
            );
            const progress = enrollment?.progress || 0;
            return {
              slug: course.slug,
              title: course.title,
              progress,
            };
          }
          return null;
        })
      );

      // Get wallet balance
      const walletBalance = user.wallet?.balance || 0;

      return {
        userId: user._id?.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        subscriptionTier: user.subscriptionTier,
        verificationScore: user.verificationScore,
        totalXP: user.totalXP || 0,
        completedCourses: user.completedCourses || [],
        currentStreak: user.currentStreak || 0,
        achievements: user.achievements || [],
        walletBalance,
        enrolledCourses: enrolledCourses.filter(Boolean) as Array<{
          slug: string;
          title: string;
          progress: number;
        }>,
        learningStyle: user.learningStyle,
        careerGoal: user.careerGoal,
      };
    } catch (error) {
      console.error("Error building user context:", error);
      return null;
    }
  }

  /**
   * Build platform-wide context
   */
  private async buildPlatformContext(): Promise<PlatformContext> {
    try {
      // Get course statistics
      const courses = await Course.find({ published: true })
        .select("slug title school level price")
        .limit(20);

      return {
        publishedCourses: courses.map((course) => ({
          slug: course.slug,
          title: course.title,
          school: course.school,
          level: course.level,
          price: course.price,
        })),
      };
    } catch (error) {
      console.error("Error building platform context:", error);
      return {
        publishedCourses: [],
      };
    }
  }

  /**
   * Clear cache
   */
  clearCache(userId?: string) {
    if (userId) {
      this.cache.delete(userId);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache stats
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

/**
 * Context formatter for different LLM providers
 */
export class ContextFormatter {
  /**
   * Format context as system prompt supplement
   */
  static formatAsSystemContext(context: ChatbotContext): string {
    let contextStr = "";

    if (context.isAuthenticated && context.userContext) {
      const user = context.userContext;
      contextStr += `\n## User Profile\n`;
      contextStr += `- Name: ${user.name || "Not provided"}\n`;
      contextStr += `- Subscription: ${user.subscriptionTier || "Free"}\n`;
      contextStr += `- Total XP: ${user.totalXP || 0}\n`;
      contextStr += `- Current Streak: ${user.currentStreak || 0} days\n`;
      contextStr += `- Verification Score: ${user.verificationScore || 0}%\n`;
      contextStr += `- Completed Courses: ${user.completedCourses?.length || 0}\n`;
      contextStr += `- Achievements: ${user.achievements?.length || 0} badges earned\n`;

      if (user.enrolledCourses && user.enrolledCourses.length > 0) {
        contextStr += `\n## Currently Enrolled Courses\n`;
        for (const course of user.enrolledCourses) {
          contextStr += `- ${course.title} (${course.progress}% complete)\n`;
        }
      }

      if (user.learningStyle) {
        contextStr += `- Learning Style: ${user.learningStyle}\n`;
      }
      if (user.careerGoal) {
        contextStr += `- Career Goal: ${user.careerGoal}\n`;
      }
    } else {
      contextStr += `\n## Visitor Status\n`;
      contextStr += `- Status: Not logged in\n`;
      contextStr += `- Can access: Public courses, job listings, community content\n`;
      contextStr += `- Suggestion: Many features unlock when you sign up!\n`;
    }

    if (context.pageContext?.currentRoute) {
      contextStr += `\n## Current Page\n`;
      contextStr += `- Route: ${context.pageContext.currentRoute}\n`;
    }

    return contextStr;
  }

  /**
   * Format context for tool execution
   */
  static formatForToolExecution(context: ChatbotContext): Record<string, any> {
    return {
      userId: context.userContext?.userId,
      isAuthenticated: context.isAuthenticated,
      isAdmin: context.isAdmin,
      subscriptionTier: context.userContext?.subscriptionTier,
      verificationScore: context.userContext?.verificationScore,
      userContext: context.userContext,
    };
  }

  /**
   * Get personalized recommendations based on context
   */
  static getPersonalizedTips(context: ChatbotContext): string[] {
    const tips: string[] = [];

    if (!context.isAuthenticated) {
      tips.push(
        "💡 Sign up to unlock personalized learning recommendations!"
      );
      tips.push("🚀 Free account gets you started with foundational courses.");
      return tips;
    }

    if (!context.userContext) return tips;

    const user = context.userContext;

    // Streak tips
    if (user.currentStreak && user.currentStreak > 0) {
      tips.push(
        `🔥 Amazing! You're on a ${user.currentStreak}-day streak. Keep it up!`
      );
    } else {
      tips.push(
        "🌟 Start a learning streak: Complete one lesson every day for XP bonuses."
      );
    }

    // Achievement tips
    if ((user.achievements?.length || 0) < 5) {
      tips.push("🏆 Earn badges by completing courses and challenges.");
    }

    // Course progress tips
    if (!user.enrolledCourses || user.enrolledCourses.length === 0) {
      tips.push("📚 Enroll in a course to start your AI learning journey!");
    } else {
      const inProgress = user.enrolledCourses.filter((c) => c.progress < 100);
      if (inProgress.length > 0) {
        tips.push(
          `📖 You're making progress on ${inProgress.length} course(s). Keep going!`
        );
      }
    }

    // Verification tips
    if ((user.verificationScore || 0) < 50) {
      tips.push(
        "✅ Increase your verification score to access premium jobs and opportunities."
      );
    }

    // Wallet tips
    if (user.subscriptionTier === "free") {
      tips.push(
        "💎 Upgrade to Premium for unlimited course access and job priority."
      );
    }

    return tips;
  }
}

// Export singleton instance
let contextBuilder: ContextBuilder | null = null;

export function getContextBuilder(): ContextBuilder {
  if (!contextBuilder) {
    contextBuilder = new ContextBuilder();
  }
  return contextBuilder;
}

export function initContextBuilder(): ContextBuilder {
  contextBuilder = new ContextBuilder();
  return contextBuilder;
}
