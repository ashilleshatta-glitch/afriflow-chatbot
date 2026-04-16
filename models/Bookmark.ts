import mongoose, { Document, Schema } from 'mongoose'

export interface IBookmark extends Document {
  user: mongoose.Types.ObjectId
  courseSlug: string
  courseTitle: string
  courseSchool: string
  courseDescription: string
  createdAt: Date
}

const BookmarkSchema = new Schema<IBookmark>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseSlug: { type: String, required: true },
  courseTitle: { type: String, required: true },
  courseSchool: { type: String, required: true },
  courseDescription: { type: String, default: '' },
}, {
  timestamps: true,
})

// One bookmark per user per course
BookmarkSchema.index({ user: 1, courseSlug: 1 }, { unique: true })
BookmarkSchema.index({ user: 1, createdAt: -1 })

export default mongoose.models.Bookmark || mongoose.model<IBookmark>('Bookmark', BookmarkSchema)
