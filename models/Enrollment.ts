import mongoose, { Document, Schema } from 'mongoose'

export interface IEnrollment extends Document {
  user: mongoose.Types.ObjectId
  courseSlug: string
  courseTitle: string
  courseSchool: string
  courseThumbnail: string
  enrolledAt: Date
  completedAt?: Date
  isCompleted: boolean
  progress: number // 0-100 percentage
  lastAccessedAt: Date
  completedLessons: string[] // lesson IDs
  totalLessons: number
  xpEarned: number
}

const EnrollmentSchema = new Schema<IEnrollment>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseSlug: { type: String, required: true },
  courseTitle: { type: String, required: true },
  courseSchool: { type: String, required: true },
  courseThumbnail: { type: String, default: '' },
  enrolledAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  isCompleted: { type: Boolean, default: false },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  lastAccessedAt: { type: Date, default: Date.now },
  completedLessons: [{ type: String }],
  totalLessons: { type: Number, default: 0 },
  xpEarned: { type: Number, default: 0 },
}, {
  timestamps: true,
})

// Compound index: one enrollment per user per course
EnrollmentSchema.index({ user: 1, courseSlug: 1 }, { unique: true })
EnrollmentSchema.index({ user: 1, isCompleted: 1 })

export default mongoose.models.Enrollment || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema)
