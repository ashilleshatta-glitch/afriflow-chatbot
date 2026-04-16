import mongoose, { Document, Schema } from 'mongoose'

export interface IActivity extends Document {
  user: mongoose.Types.ObjectId
  type: 'enrollment' | 'lesson_complete' | 'course_complete' | 'certificate_earned' | 'streak_milestone' | 'xp_milestone' | 'review' | 'login'
  title: string
  description: string
  metadata: Record<string, any>
  xpAwarded: number
  createdAt: Date
}

const ActivitySchema = new Schema<IActivity>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['enrollment', 'lesson_complete', 'course_complete', 'certificate_earned', 'streak_milestone', 'xp_milestone', 'review', 'login'],
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  metadata: { type: Schema.Types.Mixed, default: {} },
  xpAwarded: { type: Number, default: 0 },
}, {
  timestamps: true,
})

ActivitySchema.index({ user: 1, createdAt: -1 })
ActivitySchema.index({ user: 1, type: 1 })

export default mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema)
