/**
 * Chatbot Action Handlers
 * Handles lightweight user-modifying actions like enrolling, bookmarking, applying, etc.
 */

export interface ActionRequest {
  type:
    | "enroll_course"
    | "bookmark_course"
    | "join_challenge"
    | "update_profile"
    | "apply_job"
    | "start_whatsapp";
  userId: string;
  data: Record<string, any>;
  requiresConfirmation?: boolean;
}

export interface ActionResult {
  success: boolean;
  actionId: string;
  message: string;
  data?: Record<string, any>;
  error?: string;
  nextSteps?: string[];
}

/**
 * Action execution context
 */
export interface ActionContext {
  userId: string;
  userEmail?: string;
  isAuthenticated: boolean;
  userSubscriptionTier?: "free" | "premium" | "enterprise";
  userVerificationScore?: number;
}

/**
 * Base Action Handler
 */
export abstract class ActionHandler {
  abstract type: ActionRequest["type"];
  abstract execute(
    request: ActionRequest,
    context: ActionContext
  ): Promise<ActionResult>;

  /**
   * Validate action request before execution
   */
  abstract validate(request: ActionRequest): { valid: boolean; errors: string[] };

  /**
   * Get confirmation message to show user
   */
  abstract getConfirmationMessage(request: ActionRequest): string;
}

/**
 * Course Enrollment Action
 */
export class EnrollCourseAction extends ActionHandler {
  type: ActionRequest["type"] = "enroll_course";

  validate(request: ActionRequest) {
    const errors = [];
    if (!request.data.courseSlug) errors.push("Course slug is required");
    if (!request.userId) errors.push("User ID is required");
    return { valid: errors.length === 0, errors };
  }

  getConfirmationMessage(request: ActionRequest): string {
    const courseName = request.data.courseName || request.data.courseSlug;
    const price = request.data.price;
    if (price) {
      return `Enroll in "${courseName}" for ${price}? This will add it to your learning dashboard.`;
    }
    return `Enroll in "${courseName}"? This will add it to your learning dashboard.`;
  }

  async execute(
    request: ActionRequest,
    context: ActionContext
  ): Promise<ActionResult> {
    const { courseSlug } = request.data;

    try {
      // Call enrollment API
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${context.userId}`,
        },
        body: JSON.stringify({
          courseSlug,
          userId: context.userId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          actionId: `enroll-${courseSlug}-${context.userId}`,
          message: "Failed to enroll in course",
          error: error.message || "Unknown error",
        };
      }

      const result = await response.json();

      return {
        success: true,
        actionId: `enroll-${courseSlug}-${context.userId}`,
        message: `Successfully enrolled in "${request.data.courseName || courseSlug}"! 🎓`,
        data: result,
        nextSteps: [
          "View your course progress on the dashboard",
          "Start the first lesson",
          "Check out the learning path to stay on track",
        ],
      };
    } catch (error) {
      return {
        success: false,
        actionId: `enroll-${courseSlug}-${context.userId}`,
        message: "Error enrolling in course",
        error: (error as Error).message,
      };
    }
  }
}

/**
 * Bookmark Course Action
 */
export class BookmarkCourseAction extends ActionHandler {
  type: ActionRequest["type"] = "bookmark_course";

  validate(request: ActionRequest) {
    const errors = [];
    if (!request.data.courseSlug) errors.push("Course slug is required");
    if (!request.userId) errors.push("User ID is required");
    return { valid: errors.length === 0, errors };
  }

  getConfirmationMessage(request: ActionRequest): string {
    const courseName = request.data.courseName || request.data.courseSlug;
    return `Save "${courseName}" to your bookmarks? You can access it anytime from your dashboard.`;
  }

  async execute(
    request: ActionRequest,
    context: ActionContext
  ): Promise<ActionResult> {
    const { courseSlug } = request.data;

    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${context.userId}`,
        },
        body: JSON.stringify({
          courseSlug,
          userId: context.userId,
        }),
      });

      if (!response.ok) {
        return {
          success: false,
          actionId: `bookmark-${courseSlug}-${context.userId}`,
          message: "Failed to bookmark course",
          error: "Could not save bookmark",
        };
      }

      return {
        success: true,
        actionId: `bookmark-${courseSlug}-${context.userId}`,
        message: `${request.data.courseName || courseSlug} has been bookmarked! 📌`,
        nextSteps: ["View all bookmarks in your dashboard", "Share with a friend"],
      };
    } catch (error) {
      return {
        success: false,
        actionId: `bookmark-${courseSlug}-${context.userId}`,
        message: "Error bookmarking course",
        error: (error as Error).message,
      };
    }
  }
}

/**
 * Join Challenge Action
 */
export class JoinChallengeAction extends ActionHandler {
  type: ActionRequest["type"] = "join_challenge";

  validate(request: ActionRequest) {
    const errors = [];
    if (!request.data.challengeId) errors.push("Challenge ID is required");
    if (!request.userId) errors.push("User ID is required");
    return { valid: errors.length === 0, errors };
  }

  getConfirmationMessage(request: ActionRequest): string {
    const challengeName = request.data.challengeName || "this challenge";
    return `Join ${challengeName}? You'll compete with other learners and earn XP and badges. 🏆`;
  }

  async execute(
    request: ActionRequest,
    context: ActionContext
  ): Promise<ActionResult> {
    const { challengeId } = request.data;

    try {
      const response = await fetch("/api/challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${context.userId}`,
        },
        body: JSON.stringify({
          challengeId,
          userId: context.userId,
        }),
      });

      if (!response.ok) {
        return {
          success: false,
          actionId: `challenge-${challengeId}-${context.userId}`,
          message: "Failed to join challenge",
          error: "Could not register for challenge",
        };
      }

      return {
        success: true,
        actionId: `challenge-${challengeId}-${context.userId}`,
        message: `You've joined "${request.data.challengeName || "the challenge"}"! Let's go! 🚀`,
        nextSteps: [
          "View the challenge details",
          "Start completing tasks",
          "Check the leaderboard to see where you rank",
        ],
      };
    } catch (error) {
      return {
        success: false,
        actionId: `challenge-${challengeId}-${context.userId}`,
        message: "Error joining challenge",
        error: (error as Error).message,
      };
    }
  }
}

/**
 * Update Profile Action
 */
export class UpdateProfileAction extends ActionHandler {
  type: ActionRequest["type"] = "update_profile";

  validate(request: ActionRequest) {
    const errors = [];
    if (!request.userId) errors.push("User ID is required");
    if (!request.data.updates || Object.keys(request.data.updates).length === 0) {
      errors.push("At least one profile field to update is required");
    }
    return { valid: errors.length === 0, errors };
  }

  getConfirmationMessage(request: ActionRequest): string {
    const fields = Object.keys(request.data.updates || {}).join(", ");
    return `Update your profile (${fields})? These changes will be saved immediately.`;
  }

  async execute(
    request: ActionRequest,
    context: ActionContext
  ): Promise<ActionResult> {
    const { updates } = request.data;

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${context.userId}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        return {
          success: false,
          actionId: `profile-update-${context.userId}`,
          message: "Failed to update profile",
          error: "Could not save changes",
        };
      }

      return {
        success: true,
        actionId: `profile-update-${context.userId}`,
        message: "Your profile has been updated! ✨",
        nextSteps: ["View your updated profile", "Update other preferences"],
      };
    } catch (error) {
      return {
        success: false,
        actionId: `profile-update-${context.userId}`,
        message: "Error updating profile",
        error: (error as Error).message,
      };
    }
  }
}

/**
 * Apply for Job Action
 */
export class ApplyJobAction extends ActionHandler {
  type: ActionRequest["type"] = "apply_job";

  validate(request: ActionRequest) {
    const errors = [];
    if (!request.data.jobId) errors.push("Job ID is required");
    if (!request.userId) errors.push("User ID is required");
    return { valid: errors.length === 0, errors };
  }

  getConfirmationMessage(request: ActionRequest): string {
    const jobTitle = request.data.jobTitle || "this job";
    return `Apply for "${jobTitle}"? Your profile and certifications will be shared with the employer. 💼`;
  }

  async execute(
    request: ActionRequest,
    context: ActionContext
  ): Promise<ActionResult> {
    const { jobId } = request.data;

    try {
      const response = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${context.userId}`,
        },
        body: JSON.stringify({
          jobId,
          userId: context.userId,
          ...request.data.applicationData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          actionId: `apply-${jobId}-${context.userId}`,
          message: "Failed to apply for job",
          error: error.message || "Could not submit application",
        };
      }

      return {
        success: true,
        actionId: `apply-${jobId}-${context.userId}`,
        message: `Your application for "${request.data.jobTitle || "the job"}" has been submitted! 🎉`,
        nextSteps: [
          "View your applications dashboard",
          "Browse more job opportunities",
          "Strengthen your profile",
        ],
      };
    } catch (error) {
      return {
        success: false,
        actionId: `apply-${jobId}-${context.userId}`,
        message: "Error submitting application",
        error: (error as Error).message,
      };
    }
  }
}

/**
 * Start WhatsApp Curriculum Action
 */
export class StartWhatsAppAction extends ActionHandler {
  type: ActionRequest["type"] = "start_whatsapp";

  validate(request: ActionRequest) {
    const errors = [];
    if (!request.data.trackId) errors.push("Track ID is required");
    if (!request.userId) errors.push("User ID is required");
    return { valid: errors.length === 0, errors };
  }

  getConfirmationMessage(request: ActionRequest): string {
    const trackName = request.data.trackName || "this WhatsApp curriculum";
    return `Start "${trackName}" on WhatsApp? You'll receive lessons, quizzes, and earn XP directly on WhatsApp. 📱`;
  }

  async execute(
    request: ActionRequest,
    context: ActionContext
  ): Promise<ActionResult> {
    const { trackId } = request.data;

    try {
      const response = await fetch("/api/whatsapp/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${context.userId}`,
        },
        body: JSON.stringify({
          trackId,
          userId: context.userId,
          userPhone: context.userEmail, // WhatsApp phone if available
        }),
      });

      if (!response.ok) {
        return {
          success: false,
          actionId: `whatsapp-${trackId}-${context.userId}`,
          message: "Failed to start WhatsApp curriculum",
          error: "Could not enroll in track",
        };
      }

      return {
        success: true,
        actionId: `whatsapp-${trackId}-${context.userId}`,
        message: `You've enrolled in "${request.data.trackName || "the WhatsApp curriculum"}"! Check your WhatsApp for the first lesson. 📲`,
        nextSteps: [
          "Open WhatsApp and start learning",
          "Complete daily lessons",
          "Check your progress in the dashboard",
        ],
      };
    } catch (error) {
      return {
        success: false,
        actionId: `whatsapp-${trackId}-${context.userId}`,
        message: "Error starting WhatsApp curriculum",
        error: (error as Error).message,
      };
    }
  }
}

/**
 * Action Handler Registry
 */
export class ActionHandlerRegistry {
  private handlers: Map<ActionRequest["type"], ActionHandler> = new Map();

  constructor() {
    this.registerHandler(new EnrollCourseAction());
    this.registerHandler(new BookmarkCourseAction());
    this.registerHandler(new JoinChallengeAction());
    this.registerHandler(new UpdateProfileAction());
    this.registerHandler(new ApplyJobAction());
    this.registerHandler(new StartWhatsAppAction());
  }

  registerHandler(handler: ActionHandler) {
    this.handlers.set(handler.type, handler);
  }

  getHandler(type: ActionRequest["type"]): ActionHandler | undefined {
    return this.handlers.get(type);
  }

  async executeAction(
    request: ActionRequest,
    context: ActionContext
  ): Promise<ActionResult> {
    const handler = this.getHandler(request.type);
    if (!handler) {
      return {
        success: false,
        actionId: `unknown-${context.userId}`,
        message: "Unknown action type",
        error: `No handler for action type: ${request.type}`,
      };
    }

    // Validate request
    const validation = handler.validate(request);
    if (!validation.valid) {
      return {
        success: false,
        actionId: `invalid-${request.type}-${context.userId}`,
        message: "Invalid action request",
        error: validation.errors.join("; "),
      };
    }

    // Execute action
    return handler.execute(request, context);
  }

  getConfirmationMessage(request: ActionRequest): string {
    const handler = this.getHandler(request.type);
    if (!handler) return "Proceed with this action?";
    return handler.getConfirmationMessage(request);
  }
}

// Global registry instance
export const actionRegistry = new ActionHandlerRegistry();
