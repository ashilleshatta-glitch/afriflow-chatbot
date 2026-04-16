import mongoose, { Document, Schema } from 'mongoose'

export type LearningEventType =
  | 'lesson_started'
  | 'lesson_completed'
  | 'lesson_abandoned'
  | 'quiz_passed'
  | 'quiz_failed'
  | 'coach_query'
  | 'template_downloaded'
  | 'job_viewed'
  | 'job_applied'
  | 'automation_built'

export type CoachQueryCategory =
  | 'tool_help'
  | 'career_advice'
  | 'business_problem'
  | 'technical_question'
  | 'pricing_question'
  | 'motivation'
  | 'other'

export interface ILearningEventMetadata {
  timeSpent?: number         // seconds
  attemptsNeeded?: number    // for quizzes
  dropOffPoint?: number      // 0–100 % through lesson when abandoned
  coachQuery?: string        // raw query text
  coachQueryCategory?: CoachQueryCategory
}

export interface ILearningEvent extends Document {
  userId: mongoose.Types.ObjectId
  eventType: LearningEventType
  courseId?: mongoose.Types.ObjectId
  lessonId?: string
  metadata: ILearningEventMetadata
  deviceType: 'mobile' | 'desktop' | 'tablet'
  country: string
  sessionId: string
  createdAt: Date
  updatedAt: Date
}

const MetadataSchema = new Schema<ILearningEventMetadata>(
  {
    timeSpent: { type: Number },
    attemptsNeeded: { type: Number },
    dropOffPoint: { type: Number, min: 0, max: 100 },
    coachQuery: { type: String },
    coachQueryCategory: {
      type: String,
      enum: ['tool_help', 'career_advice', 'business_problem', 'technical_question', 'pricing_question', 'motivation', 'other'],
    },
  },
  { _id: false }
)

const LearningEventSchema = new Schema<ILearningEvent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    eventType: {
      type: String,
      required: true,
      enum: [
        'lesson_started', 'lesson_completed', 'lesson_abandoned',
        'quiz_passed', 'quiz_failed', 'coach_query', 'template_downloaded',
        'job_viewed', 'job_applied', 'automation_built',
      ],
      index: true,
    },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', index: true },
    lessonId: { type: String, index: true },
    metadata: { type: MetadataSchema, default: () => ({}) },
    deviceType: { type: String, enum: ['mobile', 'desktop', 'tablet'], default: 'desktop' },
    country: { type: String, default: 'Unknown' },
    sessionId: { type: String, required: true },
  },
  { timestamps: true }
)

// Compound indexes for intelligence queries
LearningEventSchema.index({ userId: 1, createdAt: -1 })
LearningEventSchema.index({ userId: 1, eventType: 1 })
LearningEventSchema.index({ userId: 1, courseId: 1 })
LearningEventSchema.index({ eventType: 1, createdAt: -1 })

export default mongoose.models.LearningEvent ||
  mongoose.model<ILearningEvent>('LearningEvent', LearningEventSchema)
