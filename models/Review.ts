import mongoose, { Document, Schema } from 'mongoose'

export interface IReview extends Document {
  user: mongoose.Types.ObjectId
  userName: string
  userAvatar?: string
  userCountry: string
  courseSlug: string
  rating: number
  title: string
  content: string
  helpful: number
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<IReview>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String },
  userCountry: { type: String, default: 'Ghana' },
  courseSlug: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true, maxlength: 200 },
  content: { type: String, required: true, maxlength: 2000 },
  helpful: { type: Number, default: 0 },
}, {
  timestamps: true,
})

// One review per user per course
ReviewSchema.index({ user: 1, courseSlug: 1 }, { unique: true })
ReviewSchema.index({ courseSlug: 1, createdAt: -1 })

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema)
